import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto'
import type { BookingNotificationPayload, EncryptedNotificationPayload } from './types'

const KEY_BYTES = 32
const IV_BYTES = 12

function decodeKey(encodedKey: string) {
  const key = Buffer.from(encodedKey, 'base64')
  if (key.length !== KEY_BYTES) throw new Error('NOTIFICATION_ENCRYPTION_KEY must be a base64-encoded 32-byte key.')
  return key
}

export function encryptNotificationPayload(
  payload: BookingNotificationPayload,
  encodedKey = process.env.NOTIFICATION_ENCRYPTION_KEY ?? '',
): EncryptedNotificationPayload {
  const key = decodeKey(encodedKey)
  const iv = randomBytes(IV_BYTES)
  const cipher = createCipheriv('aes-256-gcm', key, iv)
  const ciphertext = Buffer.concat([
    cipher.update(JSON.stringify(payload), 'utf8'),
    cipher.final(),
  ])

  return {
    algorithm: 'aes-256-gcm',
    ciphertext: ciphertext.toString('base64'),
    iv: iv.toString('base64'),
    tag: cipher.getAuthTag().toString('base64'),
  }
}

export function decryptNotificationPayload(
  encrypted: EncryptedNotificationPayload,
  encodedKey = process.env.NOTIFICATION_ENCRYPTION_KEY ?? '',
): BookingNotificationPayload {
  if (encrypted.algorithm !== 'aes-256-gcm') throw new Error('Unsupported notification encryption algorithm.')
  const key = decodeKey(encodedKey)
  const decipher = createDecipheriv('aes-256-gcm', key, Buffer.from(encrypted.iv, 'base64'))
  decipher.setAuthTag(Buffer.from(encrypted.tag, 'base64'))
  const plaintext = Buffer.concat([
    decipher.update(Buffer.from(encrypted.ciphertext, 'base64')),
    decipher.final(),
  ])
  return JSON.parse(plaintext.toString('utf8')) as BookingNotificationPayload
}
