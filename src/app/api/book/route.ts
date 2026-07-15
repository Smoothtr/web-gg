import { createHash } from 'node:crypto'
import { FieldValue, type Firestore } from 'firebase-admin/firestore'
import { google } from 'googleapis'
import { after, NextResponse, type NextRequest } from 'next/server'
import { getFirebaseAdminDb } from '../../../cms/firebaseAdmin'
import { checkRateLimit, rateLimitResponse } from '../../../security/serverRateLimit'
import {
  BOOKING_TIME_ZONE,
  buildWeekBusyState,
  dayOfWeek,
  getTimeFrameByLabel,
  getWeekDates,
  isDateWithinBookingWindow,
  isRecurringBusy,
  isSlotUnavailable,
  type TimeFrameLabel,
} from '../../../booking/schedulePolicy'
import {
  normalizeAcquisitionAttribution,
  type AcquisitionAttribution,
} from '../../../analytics/acquisition'
import {
  BOOKING_NOTIFICATION_COLLECTION,
  createBookingNotificationOutboxRecord,
  dispatchBookingNotification,
} from '../../../booking/notifications/service'
import { notificationErrorCode } from '../../../booking/notifications/errors'
import type { BookingLocale } from '../../../booking/notifications/types'

export const runtime = 'nodejs'
export const maxDuration = 60

const MAX_BODY_BYTES = 16_384

type BookingPayload = {
  date: string
  timeFrame: TimeFrameLabel
  timeRange: string
  name: string
  phone: string
  email: string
  company: string
  need: string
  note: string
  website: string
  consent: boolean
  startedAt: number
  idempotencyKey: string
  challengeToken: string
  attribution: AcquisitionAttribution
  locale: BookingLocale
}

function jsonError(status: number, error: string) {
  return NextResponse.json({ ok: false, error }, { status, headers: { 'Cache-Control': 'no-store' } })
}

function cleanText(value: unknown, maxLength: number) {
  if (typeof value !== 'string') return ''
  return value.normalize('NFKC').replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, maxLength + 1)
}

function validatePayload(value: unknown): { ok: true; value: BookingPayload } | { ok: false; error: string } {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return { ok: false, error: 'Invalid booking request.' }
  const body = value as Record<string, unknown>
  const date = cleanText(body.date, 10)
  const timeFrame = cleanText(body.timeFrame, 8) as TimeFrameLabel
  const name = cleanText(body.name, 80)
  const phone = cleanText(body.phone, 30)
  const email = cleanText(body.email, 254).toLowerCase()
  const company = cleanText(body.company, 120)
  const need = cleanText(body.need, 160)
  const note = cleanText(body.note, 1000)
  const website = cleanText(body.website, 200)
  const idempotencyKey = cleanText(body.idempotencyKey, 80)
  const challengeToken = cleanText(body.challengeToken, 4096)
  const startedAt = Number(body.startedAt)
  const consent = body.consent === true
  const attribution = normalizeAcquisitionAttribution(body.attribution)
  const requestedLocale = cleanText(body.locale, 2)
  const locale: BookingLocale = requestedLocale === 'vi' || requestedLocale === 'ko' ? requestedLocale : 'en'

  if (website) return { ok: false, error: 'Invalid booking request.' }
  if (!Number.isFinite(startedAt) || Date.now() - startedAt < 1_500 || Date.now() - startedAt > 24 * 60 * 60 * 1000) {
    return { ok: false, error: 'Please reopen the booking form and try again.' }
  }
  if (!consent) return { ok: false, error: 'Please accept the privacy notice before submitting.' }
  if (!isDateWithinBookingWindow(date)) return { ok: false, error: 'Bookings must be scheduled from tomorrow onward.' }
  if (dayOfWeek(date) === 0) return { ok: false, error: 'Sundays are not available.' }
  if (!getTimeFrameByLabel(timeFrame)) return { ok: false, error: 'The selected time slot is invalid.' }
  if (name.length < 2 || name.length > 80) return { ok: false, error: 'Please enter a valid name.' }
  if (!/^\+?[0-9]{8,15}$/.test(phone.replace(/[\s().-]/g, ''))) return { ok: false, error: 'Please enter a valid phone number.' }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 254) return { ok: false, error: 'Please enter a valid email address.' }
  if (company.length > 120 || need.length > 160 || note.length > 1000) return { ok: false, error: 'One or more fields are too long.' }
  if (!/^[a-zA-Z0-9_-]{16,80}$/.test(idempotencyKey)) return { ok: false, error: 'The request identifier is invalid.' }

  return {
    ok: true,
    value: {
      date,
      timeFrame,
      timeRange: cleanText(body.timeRange, 40),
      name,
      phone,
      email,
      company,
      need,
      note,
      website: '',
      consent,
      startedAt,
      idempotencyKey,
      challengeToken,
      attribution,
      locale,
    },
  }
}

function securityHash(value: string) {
  const secret = process.env.SECURITY_HASH_SECRET || process.env.REVALIDATE_SECRET || ''
  return createHash('sha256').update(`${secret}|${value}`).digest('hex')
}

function requestIp(request: NextRequest) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || ''
}

function isAllowedOrigin(request: NextRequest) {
  const origin = request.headers.get('origin')
  if (!origin) return true
  try {
    const { hostname, protocol } = new URL(origin)
    const localOrigin = hostname === 'localhost' || hostname === '127.0.0.1'
    const productionOrigin = [
      'gg99.vn',
      'www.gg99.vn',
      'theone.marketing',
      'www.theone.marketing',
    ].includes(hostname)
    return (localOrigin && (protocol === 'http:' || protocol === 'https:'))
      || (productionOrigin && protocol === 'https:')
  } catch {
    return false
  }
}

async function verifyChallenge(request: NextRequest, token: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return true
  if (!token) return false
  const body = new URLSearchParams({ secret, response: token, remoteip: requestIp(request) })
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body,
    signal: AbortSignal.timeout(8_000),
  })
  const result = (await response.json().catch(() => null)) as { success?: boolean } | null
  return Boolean(response.ok && result?.success)
}

function calendarAuth() {
  const { GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY } = process.env
  if (!GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY) return null
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: GOOGLE_CLIENT_EMAIL,
      private_key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/calendar.events'],
  })
}

function scheduleNotificationRetry(db: Firestore, outboxId: string) {
  try {
    after(async () => {
      try {
        await dispatchBookingNotification(db, outboxId, { allowFallback: true })
      } catch (error) {
        console.error(JSON.stringify({
          event: 'booking_notification_retry_deferred_failed',
          requestId: outboxId.slice(0, 12),
          errorCode: notificationErrorCode(error),
        }))
      }
    })
  } catch {
    console.error(JSON.stringify({
      event: 'booking_notification_retry_schedule_failed',
      requestId: outboxId.slice(0, 12),
      errorCode: 'notification_after_schedule_failed',
    }))
  }
}

export async function POST(request: NextRequest) {
  if (!isAllowedOrigin(request)) return jsonError(403, 'Origin is not allowed.')
  if (!(request.headers.get('content-type') ?? '').includes('application/json')) return jsonError(415, 'Content-Type must be application/json.')
  const contentLength = Number(request.headers.get('content-length') ?? 0)
  if (contentLength > MAX_BODY_BYTES) return jsonError(413, 'Request body is too large.')

  const ipLimit = await checkRateLimit(request, { scope: 'booking-ip', limit: 3, windowSeconds: 60 * 60 })
  if (!ipLimit.allowed) return rateLimitResponse(ipLimit)

  const rawBody = await request.text()
  if (Buffer.byteLength(rawBody, 'utf8') > MAX_BODY_BYTES) return jsonError(413, 'Request body is too large.')
  let requestBody: unknown = null
  try {
    requestBody = JSON.parse(rawBody)
  } catch {
    return jsonError(400, 'Invalid booking request.')
  }
  const parsed = validatePayload(requestBody)
  if (!parsed.ok) return jsonError(400, parsed.error)
  const payload = parsed.value
  const requestedFrame = getTimeFrameByLabel(payload.timeFrame)
  if (!requestedFrame) return jsonError(400, 'The selected time slot is invalid.')
  if (isRecurringBusy(payload.date, requestedFrame.id)) {
    return jsonError(409, 'This time slot is reserved and cannot be booked.')
  }

  if (!(await verifyChallenge(request, payload.challengeToken))) return jsonError(403, 'Bot verification failed. Please try again.')

  const contactLimit = await checkRateLimit(request, {
    scope: 'booking-contact',
    limit: 5,
    windowSeconds: 24 * 60 * 60,
    extraKey: securityHash(`${payload.email}|${payload.phone}`),
  })
  if (!contactLimit.allowed) return rateLimitResponse(contactLimit)

  const db = getFirebaseAdminDb()
  const calendarId = process.env.GOOGLE_CALENDAR_ID
  const auth = calendarAuth()
  if (!db || !calendarId || !auth) return jsonError(503, 'Booking is temporarily unavailable. Please try again later.')

  const idempotencyHash = securityHash(payload.idempotencyKey)
  const reservationId = `${payload.date}_${payload.timeFrame.replace(/[^a-z0-9-]/gi, '-')}`
  const requestRef = db.collection('bookingRequests').doc(idempotencyHash)
  const reservationRef = db.collection('bookingReservations').doc(reservationId)
  const now = Date.now()
  const pendingExpiry = new Date(now + 10 * 60 * 1000)

  const reservationResult = await db.runTransaction(async (transaction) => {
    const [requestSnapshot, reservationSnapshot] = await Promise.all([
      transaction.get(requestRef),
      transaction.get(reservationRef),
    ])
    const previousRequest = requestSnapshot.data()
    if (previousRequest?.status === 'confirmed') return 'duplicate' as const
    if (previousRequest?.status === 'pending') return 'processing' as const

    const existingReservation = reservationSnapshot.data()
    const existingExpiry = existingReservation?.expiresAt?.toDate?.().getTime?.() ?? 0
    if (existingReservation?.status === 'confirmed' || (existingReservation?.status === 'pending' && existingExpiry > now)) {
      return 'conflict' as const
    }

    const common = {
      status: 'pending',
      date: payload.date,
      timeFrame: payload.timeFrame,
      idempotencyHash,
      contactHash: securityHash(`${payload.email}|${payload.phone}`),
      createdAt: FieldValue.serverTimestamp(),
      expiresAt: pendingExpiry,
    }
    transaction.set(requestRef, { ...common, attribution: payload.attribution })
    transaction.set(reservationRef, common)
    return 'created' as const
  })

  if (reservationResult === 'duplicate') {
    scheduleNotificationRetry(db, idempotencyHash)
    return NextResponse.json({ ok: true, duplicate: true }, { headers: { 'Cache-Control': 'no-store' } })
  }
  if (reservationResult === 'processing') return jsonError(409, 'This booking request is already being processed.')
  if (reservationResult === 'conflict') return jsonError(409, 'This time slot is no longer available. Please choose another slot.')

  const startDateTime = `${payload.date}T${requestedFrame.startH}:00+07:00`
  const endDateTime = `${payload.date}T${requestedFrame.endH}:00+07:00`
  const canonicalTimeRange = `${requestedFrame.startH} – ${requestedFrame.endH === '23:59' ? '24:00' : requestedFrame.endH}`

  try {
    const calendar = google.calendar({ version: 'v3', auth })
    const weekDates = getWeekDates(payload.date)
    const weeklyEvents = await calendar.events.list({
      calendarId,
      timeMin: `${weekDates[0]}T00:00:00+07:00`,
      timeMax: `${weekDates[weekDates.length - 1]}T23:59:59+07:00`,
      singleEvents: true,
    })
    const weekBusyState = buildWeekBusyState(payload.date, weeklyEvents.data.items ?? [])
    if (isSlotUnavailable(payload.date, requestedFrame.id, weekBusyState)) {
      await Promise.all([requestRef.delete(), reservationRef.delete()])
      return jsonError(409, 'This time slot is no longer available. Please choose another slot.')
    }

    const existing = await calendar.events.list({
      calendarId,
      timeMin: startDateTime,
      timeMax: endDateTime,
      singleEvents: true,
      maxResults: 1,
    })
    if ((existing.data.items ?? []).length > 0) {
      await Promise.all([requestRef.delete(), reservationRef.delete()])
      return jsonError(409, 'This time slot is no longer available. Please choose another slot.')
    }

    const event = await calendar.events.insert({
      calendarId,
      sendUpdates: 'none',
      requestBody: {
        summary: `Consultation request - ${payload.name}`,
        description: [
          `Name: ${payload.name}`,
          `Phone: ${payload.phone}`,
          `Email: ${payload.email}`,
          payload.company ? `Company: ${payload.company}` : null,
          payload.need ? `Need: ${payload.need}` : null,
          payload.note ? `Note: ${payload.note}` : null,
          `Preferred slot: ${payload.timeFrame} (${canonicalTimeRange})`,
        ].filter(Boolean).join('\n'),
        start: { dateTime: startDateTime, timeZone: BOOKING_TIME_ZONE },
        end: { dateTime: endDateTime, timeZone: BOOKING_TIME_ZONE },
        colorId: '5',
        reminders: { useDefault: false, overrides: [{ method: 'popup', minutes: 60 }] },
      },
    })

    let notificationOutboxRecord: ReturnType<typeof createBookingNotificationOutboxRecord> | null = null
    try {
      notificationOutboxRecord = createBookingNotificationOutboxRecord({
        requestId: idempotencyHash,
        reservationId,
        name: payload.name,
        phone: payload.phone,
        email: payload.email,
        company: payload.company,
        need: payload.need,
        note: payload.note,
        date: payload.date,
        timeFrame: payload.timeFrame,
        timeRange: canonicalTimeRange,
        locale: payload.locale,
        calendarEventId: event.data.id ?? '',
        calendarUrl: event.data.htmlLink ?? '',
        attribution: payload.attribution,
      })
    } catch (error) {
      console.error(JSON.stringify({
        event: 'booking_notification_enqueue_failed',
        reservationId,
        requestId: idempotencyHash.slice(0, 12),
        errorCode: notificationErrorCode(error),
      }))
    }

    const confirmed = {
      status: 'confirmed',
      eventId: event.data.id ?? null,
      confirmedAt: FieldValue.serverTimestamp(),
      expiresAt: new Date(now + 180 * 24 * 60 * 60 * 1000),
    }
    const batch = db.batch()
    batch.set(requestRef, confirmed, { merge: true })
    batch.set(reservationRef, confirmed, { merge: true })
    if (notificationOutboxRecord) {
      batch.set(db.collection(BOOKING_NOTIFICATION_COLLECTION).doc(idempotencyHash), notificationOutboxRecord)
    }
    for (const weekDate of weekDates) {
      batch.delete(db.collection('bookingAvailabilityCache').doc(weekDate))
    }
    await batch.commit()

    if (notificationOutboxRecord) {
      let notificationComplete = false
      try {
        const delivery = await dispatchBookingNotification(db, idempotencyHash, { allowFallback: false })
        notificationComplete = delivery.complete
      } catch (error) {
        console.error(JSON.stringify({
          event: 'booking_notification_initial_failed',
          reservationId,
          requestId: idempotencyHash.slice(0, 12),
          errorCode: notificationErrorCode(error),
        }))
      }
      if (!notificationComplete) scheduleNotificationRetry(db, idempotencyHash)
    }

    console.info(JSON.stringify({ event: 'booking_created', reservationId, requestId: idempotencyHash.slice(0, 12) }))
    return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    await Promise.allSettled([requestRef.delete(), reservationRef.delete()])
    console.error(JSON.stringify({ event: 'booking_failed', reservationId, error: error instanceof Error ? error.message : 'unknown' }))
    return jsonError(503, 'Booking could not be completed. Please try again later.')
  }
}
