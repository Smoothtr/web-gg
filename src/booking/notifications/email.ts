import 'server-only'

import { BookingCustomerEmail, bookingCustomerEmailSubject } from '../../emails/BookingCustomerEmail'
import { BookingInternalFallbackEmail } from '../../emails/BookingInternalFallbackEmail'
import { getResend } from '../../lib/resend'
import { NotificationProviderError } from './errors'
import type { BookingNotificationPayload } from './types'

function resendErrorCode(name: unknown) {
  const clean = typeof name === 'string' ? name.toLowerCase().replace(/[^a-z0-9_]+/g, '_').slice(0, 80) : ''
  return clean ? `resend_${clean}` : 'resend_send_failed'
}

function emailConfig() {
  const resend = getResend()
  const from = process.env.BOOKING_EMAIL_FROM?.trim()
  const replyTo = process.env.BOOKING_EMAIL_REPLY_TO?.trim()
  if (!resend || !from) throw new NotificationProviderError('resend_not_configured')
  return { resend, from, replyTo }
}

export async function sendCustomerBookingEmail(booking: BookingNotificationPayload) {
  const { resend, from, replyTo } = emailConfig()
  const { data, error } = await resend.emails.send({
    from,
    to: booking.email,
    replyTo: replyTo || undefined,
    subject: bookingCustomerEmailSubject(booking.locale),
    react: BookingCustomerEmail({ booking }),
    tags: [{ name: 'type', value: 'booking-customer' }],
  }, { idempotencyKey: `booking-customer-${booking.requestId}` })
  if (error) throw new NotificationProviderError(resendErrorCode(error.name))
  if (!data?.id) throw new NotificationProviderError('resend_missing_message_id')
  return data.id
}

export async function sendInternalFallbackEmail(booking: BookingNotificationPayload) {
  const to = process.env.BOOKING_NOTIFICATION_TO?.trim()
  if (!to) throw new NotificationProviderError('internal_email_not_configured')
  const { resend, from, replyTo } = emailConfig()
  const { data, error } = await resend.emails.send({
    from,
    to,
    replyTo: replyTo || undefined,
    subject: `[Dự phòng] Booking mới - ${booking.name} - ${booking.date}`,
    react: BookingInternalFallbackEmail({ booking }),
    tags: [{ name: 'type', value: 'booking-internal-fallback' }],
  }, { idempotencyKey: `booking-internal-${booking.requestId}` })
  if (error) throw new NotificationProviderError(resendErrorCode(error.name))
  if (!data?.id) throw new NotificationProviderError('resend_missing_message_id')
  return data.id
}
