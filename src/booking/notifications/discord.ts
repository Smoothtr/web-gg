import { NotificationProviderError } from './errors'
import type { BookingNotificationPayload } from './types'

const DISCORD_VALUE_LIMIT = 1_000

function discordText(value: string, fallback = '—') {
  const clean = value.replace(/[\u0000-\u001f\u007f]/g, ' ').trim()
  return (clean || fallback).slice(0, DISCORD_VALUE_LIMIT)
}

function attributionText(booking: BookingNotificationPayload) {
  const { attribution } = booking
  const parts = [
    attribution.utmSource ? `Source: ${attribution.utmSource}` : '',
    attribution.utmMedium ? `Medium: ${attribution.utmMedium}` : '',
    attribution.utmCampaign ? `Campaign: ${attribution.utmCampaign}` : '',
    attribution.landingUrl ? `Landing: ${attribution.landingUrl}` : '',
    attribution.referrer ? `Referrer: ${attribution.referrer}` : '',
  ].filter(Boolean)
  return discordText(parts.join('\n'), 'Direct / unknown')
}

function safeCalendarUrl(value: string) {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' ? url.toString() : undefined
  } catch {
    return undefined
  }
}

export function buildDiscordBookingPayload(booking: BookingNotificationPayload, configuredRoleId = '') {
  const roleId = /^\d{17,20}$/.test(configuredRoleId.trim()) ? configuredRoleId.trim() : ''
  const calendarUrl = safeCalendarUrl(booking.calendarUrl)
  return {
    username: 'GG99 Booking',
    content: roleId ? `<@&${roleId}>` : undefined,
    allowed_mentions: roleId ? { parse: [] as string[], roles: [roleId] } : { parse: [] as string[] },
    embeds: [{
      title: '🔔 Booking mới',
      description: 'Google Calendar đã được tạo thành công.',
      color: 0xdf2676,
      url: calendarUrl,
      fields: [
        { name: 'Khách hàng', value: discordText(booking.name), inline: true },
        { name: 'Công ty', value: discordText(booking.company), inline: true },
        { name: 'Thời gian', value: discordText(`${booking.date}\n${booking.timeFrame} · ${booking.timeRange}`), inline: false },
        { name: 'Điện thoại', value: discordText(booking.phone), inline: true },
        { name: 'Email', value: discordText(booking.email), inline: true },
        { name: 'Nhu cầu', value: discordText(booking.need), inline: false },
        { name: 'Ghi chú', value: discordText(booking.note), inline: false },
        { name: 'Nguồn', value: attributionText(booking), inline: false },
      ],
      footer: { text: `Request ${booking.requestId.slice(0, 12)}` },
      timestamp: new Date().toISOString(),
    }],
  }
}

function discordWebhookUrl() {
  const raw = process.env.DISCORD_BOOKING_WEBHOOK_URL?.trim()
  if (!raw) throw new NotificationProviderError('discord_not_configured')
  try {
    const url = new URL(raw)
    const allowedHost = /^(?:(?:canary|ptb)\.)?discord(?:app)?\.com$/i.test(url.hostname)
    if (url.protocol !== 'https:' || !allowedHost || !/^\/api\/webhooks\/\d+\/[A-Za-z0-9._-]+$/.test(url.pathname)) {
      throw new Error('invalid')
    }
    url.searchParams.set('wait', 'true')
    return url
  } catch {
    throw new NotificationProviderError('discord_webhook_invalid')
  }
}

export async function sendDiscordBookingNotification(booking: BookingNotificationPayload) {
  const response = await fetch(discordWebhookUrl(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(buildDiscordBookingPayload(booking, process.env.DISCORD_BOOKING_ROLE_ID)),
    cache: 'no-store',
    signal: AbortSignal.timeout(8_000),
  }).catch(() => {
    throw new NotificationProviderError('discord_network_error')
  })
  if (!response.ok) throw new NotificationProviderError(`discord_http_${response.status}`)
  const result = (await response.json().catch(() => null)) as { id?: string } | null
  if (!result?.id) throw new NotificationProviderError('discord_missing_message_id')
  return result.id
}
