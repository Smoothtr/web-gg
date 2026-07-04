import { google } from 'googleapis'

const MANUAL_BUSY_SLOTS = {
  '2026-05-19': ['20-22', '22-24'],
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { date, timeFrame, timeRange, name, phone, email, company, need, note } = req.body ?? {}

  if (!date || !timeFrame || !name || !phone || !email) {
    return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' })
  }

  if ((MANUAL_BUSY_SLOTS[date] ?? []).includes(timeFrame)) {
    return res.status(409).json({ error: 'Khung thời gian này đã có lịch hẹn. Vui lòng chọn khung khác.' })
  }

  const description = [
    `👤 Họ tên: ${name}`,
    `📞 Điện thoại: ${phone}`,
    `✉️ Email: ${email}`,
    company ? `🏢 Công ty: ${company}` : null,
    need    ? `📌 Nhu cầu: ${need}`   : null,
    note    ? `📝 Ghi chú: ${note}`   : null,
    '',
    `⏰ Khung thời gian mong muốn: ${timeFrame} (${timeRange})`,
    '',
    'ℹ️ Khách đã chọn khung thời gian mong muốn. Công ty cần liên hệ lại để xác nhận giờ tư vấn chính thức.',
  ].filter(l => l !== null).join('\n')

  const { GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_CALENDAR_ID } = process.env

  if (!GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY || !GOOGLE_CALENDAR_ID) {
    console.log('[BOOKING]', { date, timeFrame, name, phone, email, company, need })
    return res.json({ ok: true, placeholder: true })
  }

  // Map time frame to a representative time block for the calendar event
  const TIME_MAP = {
    '8-10':  { startH: '08:00', endH: '10:00' },
    '10-12': { startH: '10:00', endH: '12:00' },
    '14-16': { startH: '14:00', endH: '16:00' },
    '16-18': { startH: '16:00', endH: '18:00' },
    '20-22': { startH: '20:00', endH: '22:00' },
    '22-24': { startH: '22:00', endH: '23:59' },
  }
  const times = TIME_MAP[timeFrame] ?? { startH: '09:00', endH: '10:00' }

  try {
    const privateKey = GOOGLE_PRIVATE_KEY.includes('\\n')
      ? GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
      : GOOGLE_PRIVATE_KEY

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: GOOGLE_CLIENT_EMAIL,
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/calendar.events'],
    })

    // ── Conflict check ──────────────────────────────────
    const calendarCheck = google.calendar({ version: 'v3', auth })
    const existing = await calendarCheck.events.list({
      calendarId: GOOGLE_CALENDAR_ID,
      timeMin: `${date}T${times.startH}:00+07:00`,
      timeMax: `${date}T${times.endH}:00+07:00`,
      singleEvents: true,
    })
    if ((existing.data.items ?? []).length > 0) {
      return res.status(409).json({ error: 'Khung thời gian này đã có lịch hẹn. Vui lòng chọn buổi khác.' })
    }
    // ────────────────────────────────────────────────────
    const calendar = google.calendar({ version: 'v3', auth })

    const [y, m, d] = date.split('-')
    const startDateTime = `${date}T${times.startH}:00+07:00`
    const endDateTime   = `${date}T${times.endH}:00+07:00`

    await calendar.events.insert({
      calendarId: GOOGLE_CALENDAR_ID,
      sendUpdates: 'none',
      requestBody: {
        summary: `Yêu cầu tư vấn — ${name} — ${timeFrame} ${d}/${m}/${y}`,
        description,
        start: { dateTime: startDateTime, timeZone: 'Asia/Ho_Chi_Minh' },
        end:   { dateTime: endDateTime,   timeZone: 'Asia/Ho_Chi_Minh' },
        colorId: '5', // banana yellow — easy to spot as "pending"
        reminders: {
          useDefault: false,
          overrides: [{ method: 'popup', minutes: 60 }],
        },
      },
    })

    return res.json({ ok: true })
  } catch (err) {
    const status = err?.response?.status
    const data   = JSON.stringify(err?.response?.data ?? {})
    console.error(`Calendar error ${status}: ${data}`)
    console.error('Calendar error message:', err?.message)
    console.log('[BOOKING FALLBACK]', { date, timeFrame, name, phone, email, company, need, note })
    return res.json({ ok: true, placeholder: true })
  }
}
