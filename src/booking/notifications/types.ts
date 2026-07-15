import type { AcquisitionAttribution } from '../../analytics/acquisition'

export type BookingLocale = 'vi' | 'en' | 'ko'

export type BookingNotificationPayload = {
  requestId: string
  reservationId: string
  name: string
  phone: string
  email: string
  company: string
  need: string
  note: string
  date: string
  timeFrame: string
  timeRange: string
  locale: BookingLocale
  calendarEventId: string
  calendarUrl: string
  attribution: AcquisitionAttribution
}

export type EncryptedNotificationPayload = {
  algorithm: 'aes-256-gcm'
  ciphertext: string
  iv: string
  tag: string
}

export type NotificationChannelStatus = 'pending' | 'sent' | 'failed'
