import 'server-only'

import { FieldValue, type Firestore } from 'firebase-admin/firestore'
import { decryptNotificationPayload, encryptNotificationPayload } from './crypto'
import { sendDiscordBookingNotification } from './discord'
import { sendCustomerBookingEmail, sendInternalFallbackEmail } from './email'
import { notificationErrorCode } from './errors'
import type {
  BookingNotificationPayload,
  EncryptedNotificationPayload,
  NotificationChannelStatus,
} from './types'

export const BOOKING_NOTIFICATION_COLLECTION = 'bookingNotificationOutbox'
const OUTBOX_PENDING_RETENTION_MS = 7 * 24 * 60 * 60 * 1000
const OUTBOX_SENT_RETENTION_MS = 30 * 24 * 60 * 60 * 1000
const LEASE_MS = 30_000

type OutboxData = {
  status?: 'pending' | 'partial' | 'sent'
  encryptedPayload?: EncryptedNotificationPayload
  customerEmailStatus?: NotificationChannelStatus
  discordStatus?: NotificationChannelStatus
  fallbackEmailStatus?: NotificationChannelStatus
  customerEmailId?: string
  discordMessageId?: string
  fallbackEmailId?: string
  attempts?: number
  leaseUntil?: { toDate?: () => Date }
}

type SendResult = { ok: true; id: string } | { ok: false; code: string }

async function settled(send: () => Promise<string>): Promise<SendResult> {
  try {
    return { ok: true, id: await send() }
  } catch (error) {
    return { ok: false, code: notificationErrorCode(error) }
  }
}

export function createBookingNotificationOutboxRecord(payload: BookingNotificationPayload) {
  return {
    status: 'pending',
    encryptedPayload: encryptNotificationPayload(payload),
    customerEmailStatus: 'pending',
    discordStatus: 'pending',
    fallbackEmailStatus: 'pending',
    attempts: 0,
    nextAttemptAt: new Date(),
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
    expiresAt: new Date(Date.now() + OUTBOX_PENDING_RETENTION_MS),
  }
}

type ClaimResult =
  | { state: 'missing' }
  | { state: 'complete' }
  | { state: 'busy' }
  | { state: 'claimed'; data: OutboxData; attempt: number }

async function claimOutbox(db: Firestore, outboxId: string): Promise<ClaimResult> {
  const ref = db.collection(BOOKING_NOTIFICATION_COLLECTION).doc(outboxId)
  return db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(ref)
    if (!snapshot.exists) return { state: 'missing' }
    const data = snapshot.data() as OutboxData
    if (data.status === 'sent') return { state: 'complete' }
    const leaseUntil = data.leaseUntil?.toDate?.().getTime() ?? 0
    if (leaseUntil > Date.now()) return { state: 'busy' }
    const attempt = (data.attempts ?? 0) + 1
    transaction.update(ref, {
      attempts: attempt,
      leaseUntil: new Date(Date.now() + LEASE_MS),
      updatedAt: FieldValue.serverTimestamp(),
    })
    return { state: 'claimed', data, attempt }
  })
}

function retryAt(attempt: number) {
  const delayMinutes = Math.min(24 * 60, 5 * (2 ** Math.min(attempt, 8)))
  return new Date(Date.now() + delayMinutes * 60 * 1000)
}

export async function dispatchBookingNotification(
  db: Firestore,
  outboxId: string,
  options: { allowFallback: boolean },
) {
  const claim = await claimOutbox(db, outboxId)
  if (claim.state === 'missing' || claim.state === 'complete') return { complete: true, state: claim.state }
  if (claim.state === 'busy') return { complete: false, state: claim.state }

  const ref = db.collection(BOOKING_NOTIFICATION_COLLECTION).doc(outboxId)
  const data = claim.data
  if (!data.encryptedPayload) {
    await ref.set({
      status: 'partial',
      leaseUntil: FieldValue.delete(),
      lastErrorCodes: { outbox: 'notification_payload_missing' },
      nextAttemptAt: retryAt(claim.attempt),
      updatedAt: FieldValue.serverTimestamp(),
    }, { merge: true })
    return { complete: false, state: 'payload-missing' }
  }

  let booking: BookingNotificationPayload
  try {
    booking = decryptNotificationPayload(data.encryptedPayload)
  } catch {
    await ref.set({
      status: 'partial',
      leaseUntil: FieldValue.delete(),
      lastErrorCodes: { outbox: 'notification_decryption_failed' },
      nextAttemptAt: retryAt(claim.attempt),
      updatedAt: FieldValue.serverTimestamp(),
    }, { merge: true })
    return { complete: false, state: 'decrypt-failed' }
  }

  const customerWasSent = data.customerEmailStatus === 'sent'
  const discordWasSent = data.discordStatus === 'sent'
  const fallbackWasSent = data.fallbackEmailStatus === 'sent'
  const [customerResult, discordResult] = await Promise.all([
    customerWasSent ? Promise.resolve<SendResult>({ ok: true, id: data.customerEmailId ?? '' }) : settled(() => sendCustomerBookingEmail(booking)),
    discordWasSent || fallbackWasSent
      ? Promise.resolve<SendResult>({ ok: true, id: data.discordMessageId ?? data.fallbackEmailId ?? '' })
      : settled(() => sendDiscordBookingNotification(booking)),
  ])

  let fallbackResult: SendResult | null = null
  if (!discordWasSent && !fallbackWasSent && !discordResult.ok && options.allowFallback) {
    fallbackResult = await settled(() => sendInternalFallbackEmail(booking))
  }

  const customerSent = customerWasSent || customerResult.ok
  const discordSent = discordWasSent || (!fallbackWasSent && discordResult.ok)
  const fallbackSent = fallbackWasSent || Boolean(fallbackResult?.ok)
  const complete = customerSent && (discordSent || fallbackSent)
  const lastErrorCodes: Record<string, string> = {}
  if (!customerResult.ok) lastErrorCodes.customerEmail = customerResult.code
  if (!discordResult.ok) lastErrorCodes.discord = discordResult.code
  if (fallbackResult && !fallbackResult.ok) lastErrorCodes.fallbackEmail = fallbackResult.code

  const update: Record<string, unknown> = {
    status: complete ? 'sent' : customerSent || discordSent || fallbackSent ? 'partial' : 'pending',
    customerEmailStatus: customerSent ? 'sent' : 'failed',
    discordStatus: discordSent ? 'sent' : 'failed',
    fallbackEmailStatus: fallbackSent ? 'sent' : fallbackResult ? 'failed' : data.fallbackEmailStatus ?? 'pending',
    leaseUntil: FieldValue.delete(),
    lastErrorCodes,
    updatedAt: FieldValue.serverTimestamp(),
  }
  if (customerResult.ok && customerResult.id) update.customerEmailId = customerResult.id
  if (!fallbackWasSent && discordResult.ok && discordResult.id) update.discordMessageId = discordResult.id
  if (fallbackResult?.ok && fallbackResult.id) update.fallbackEmailId = fallbackResult.id

  if (complete) {
    update.encryptedPayload = FieldValue.delete()
    update.nextAttemptAt = FieldValue.delete()
    update.sentAt = FieldValue.serverTimestamp()
    update.expiresAt = new Date(Date.now() + OUTBOX_SENT_RETENTION_MS)
  } else {
    update.nextAttemptAt = retryAt(claim.attempt)
    update.expiresAt = new Date(Date.now() + OUTBOX_PENDING_RETENTION_MS)
  }
  await ref.set(update, { merge: true })
  return { complete, state: complete ? 'sent' : 'pending' }
}

export async function retryPendingBookingNotifications(db: Firestore, limit = 10) {
  const snapshot = await db
    .collection(BOOKING_NOTIFICATION_COLLECTION)
    .where('nextAttemptAt', '<=', new Date())
    .limit(Math.max(1, Math.min(limit, 50)))
    .get()
  let complete = 0
  let pending = 0
  for (const document of snapshot.docs) {
    const result = await dispatchBookingNotification(db, document.id, { allowFallback: true })
    if (result.complete) complete += 1
    else pending += 1
  }
  return { processed: snapshot.size, complete, pending }
}
