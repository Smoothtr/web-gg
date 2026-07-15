import { expect, test } from '@playwright/test'
import { render } from '@react-email/render'
import { decryptNotificationPayload, encryptNotificationPayload } from '../src/booking/notifications/crypto'
import { buildDiscordBookingPayload } from '../src/booking/notifications/discord'
import type { BookingNotificationPayload } from '../src/booking/notifications/types'
import { BookingCustomerEmail } from '../src/emails/BookingCustomerEmail'

const booking: BookingNotificationPayload = {
  requestId: 'a'.repeat(64),
  reservationId: '2026-07-24_14-16',
  name: '@everyone Nguyễn Văn A',
  phone: '0912345678',
  email: 'customer@example.com',
  company: 'ABC',
  need: 'Branding',
  note: '<@123456789012345678> Please call first',
  date: '2026-07-24',
  timeFrame: '14-16',
  timeRange: '14:00 – 16:00',
  locale: 'vi',
  calendarEventId: 'calendar-event',
  calendarUrl: 'https://calendar.google.com/calendar/event?eid=test',
  attribution: { utmSource: 'google', utmCampaign: 'booking' },
}

test('encrypts booking notification payloads with authenticated encryption', () => {
  const key = Buffer.alloc(32, 7).toString('base64')
  const encrypted = encryptNotificationPayload(booking, key)

  expect(encrypted.ciphertext).not.toContain(booking.email)
  expect(decryptNotificationPayload(encrypted, key)).toEqual(booking)
})

test('Discord notification only permits the configured role mention', () => {
  const roleId = '123456789012345678'
  const payload = buildDiscordBookingPayload(booking, roleId)

  expect(payload.content).toBe(`<@&${roleId}>`)
  expect(payload.allowed_mentions).toEqual({ parse: [], roles: [roleId] })
  expect(payload.embeds[0].fields.find((field) => field.name === 'Khách hàng')?.value).toContain('@everyone')
})

test('renders the customer confirmation email with the requested slot', async () => {
  const html = await render(BookingCustomerEmail({ booking }))

  expect(html).toContain('Chúng tôi đã nhận yêu cầu của bạn')
  expect(html).toContain('14-16')
  expect(html).toContain('14:00')
  expect(html).toContain('zalo.me/smoothgg')
})
