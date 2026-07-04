import { google } from 'googleapis'

const TIME_FRAMES = [
  { id: 'slot_08_10', label: '8-10',   startH: '08:00', endH: '10:00' },
  { id: 'slot_10_12', label: '10-12',  startH: '10:00', endH: '12:00' },
  { id: 'slot_14_16', label: '14-16',  startH: '14:00', endH: '16:00' },
  { id: 'slot_16_18', label: '16-18',  startH: '16:00', endH: '18:00' },
  { id: 'slot_20_22', label: '20-22',  startH: '20:00', endH: '22:00' },
  { id: 'slot_22_24', label: '22-24',  startH: '22:00', endH: '23:59' },
]
const INTERNAL_BUSY_RATIO = 0.5
const MANUAL_BUSY_SLOTS = {
  '2026-05-19': ['slot_20_22', 'slot_22_24'],
}

function hashString(value) {
  let hash = 2166136261
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function addDays(date, days) {
  const next = new Date(date)
  next.setUTCDate(next.getUTCDate() + days)
  return next
}

function toDateStr(date) {
  return date.toISOString().slice(0, 10)
}

function getWeekDates(date) {
  const [y, m, d] = date.split('-').map(Number)
  const base = new Date(Date.UTC(y, m - 1, d))
  const dow = base.getUTCDay()
  const mondayOffset = dow === 0 ? -6 : 1 - dow
  const monday = addDays(base, mondayOffset)

  return Array.from({ length: 6 }, (_, i) => toDateStr(addDays(monday, i)))
}

function getRecurringBusyIds(dow) {
  const recurringBusy = {
    1: ['slot_08_10', 'slot_10_12'], // Thứ 2: sáng
    2: ['slot_08_10', 'slot_10_12', 'slot_14_16', 'slot_16_18'], // Thứ 3: sáng + chiều
  }
  return recurringBusy[dow] ?? []
}

function getManualBusyIds(date) {
  return MANUAL_BUSY_SLOTS[date] ?? []
}

function overlapsEvent(date, frame, evt) {
  const frameStart = new Date(`${date}T${frame.startH}:00+07:00`).getTime()
  const frameEnd = new Date(`${date}T${frame.endH}:00+07:00`).getTime()
  const evtStart = new Date(evt.start?.dateTime ?? evt.start?.date ?? '').getTime()
  const evtEnd = new Date(evt.end?.dateTime ?? evt.end?.date ?? '').getTime()
  return evtStart < frameEnd && evtEnd > frameStart
}

function buildInternalBusySet({ date, visitorId, events = [] }) {
  const weekDates = getWeekDates(date)
  const allSlots = weekDates.flatMap(day => TIME_FRAMES.map(frame => ({ day, frame })))
  const realBusy = new Set()

  for (const slot of allSlots) {
    const [y, m, d] = slot.day.split('-').map(Number)
    const dow = new Date(Date.UTC(y, m - 1, d)).getUTCDay()
    const key = `${slot.day}:${slot.frame.id}`

    if (getRecurringBusyIds(dow).includes(slot.frame.id) || getManualBusyIds(slot.day).includes(slot.frame.id)) {
      realBusy.add(key)
      continue
    }

    if (events.some(evt => overlapsEvent(slot.day, slot.frame, evt))) {
      realBusy.add(key)
    }
  }

  const targetBusy = Math.floor(allSlots.length * INTERNAL_BUSY_RATIO)
  const internalCount = Math.max(0, targetBusy - realBusy.size)
  const salt = visitorId || 'anonymous'

  return new Set(
    allSlots
      .filter(slot => !realBusy.has(`${slot.day}:${slot.frame.id}`))
      .map(slot => ({
        key: `${slot.day}:${slot.frame.id}`,
        score: hashString(`${salt}:${weekDates[0]}:${slot.day}:${slot.frame.id}`),
      }))
      .sort((a, b) => a.score - b.score)
      .slice(0, internalCount)
      .map(slot => slot.key)
  )
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const { date, visitorId = '' } = req.query
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ error: 'Missing or invalid date param (YYYY-MM-DD)' })
  }

  // Check if Sunday
  const [y, m, d] = date.split('-').map(Number)
  const dow = new Date(Date.UTC(y, m - 1, d)).getUTCDay()
  if (dow === 0) return res.json({ frames: [] }) // Sunday — closed

  const recurringBusyIds = getRecurringBusyIds(dow)
  const manualBusyIds = getManualBusyIds(date)

  // If no Google credentials → apply only recurring rules
  const { GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_CALENDAR_ID } = process.env
  if (!GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY || !GOOGLE_CALENDAR_ID) {
    const internalBusy = buildInternalBusySet({ date, visitorId })
    return res.json({
      frames: TIME_FRAMES.map(f => ({
        ...f,
        available: !recurringBusyIds.includes(f.id) && !manualBusyIds.includes(f.id) && !internalBusy.has(`${date}:${f.id}`),
      })),
      placeholder: true,
    })
  }

  try {
    const privateKey = GOOGLE_PRIVATE_KEY.includes('\\n')
      ? GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
      : GOOGLE_PRIVATE_KEY

    const auth = new google.auth.GoogleAuth({
      credentials: { client_email: GOOGLE_CLIENT_EMAIL, private_key: privateKey },
      scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
    })
    const calendar = google.calendar({ version: 'v3', auth })

    // Fetch all events this week so internal busy slots keep the week near 50% busy.
    const weekDates = getWeekDates(date)
    const weekStart = `${weekDates[0]}T00:00:00+07:00`
    const weekEnd = `${weekDates[weekDates.length - 1]}T23:59:59+07:00`

    const eventsRes = await calendar.events.list({
      calendarId: GOOGLE_CALENDAR_ID,
      timeMin: weekStart,
      timeMax: weekEnd,
      singleEvents: true,
    })

    const events = eventsRes.data.items ?? []
    const internalBusy = buildInternalBusySet({ date, visitorId, events })

    // Mark each frame as available or booked
    const frames = TIME_FRAMES.map(frame => {
      // Recurring rule takes priority
      if (recurringBusyIds.includes(frame.id) || manualBusyIds.includes(frame.id) || internalBusy.has(`${date}:${frame.id}`)) {
        return { ...frame, available: false }
      }

      const frameStart = new Date(`${date}T${frame.startH}:00+07:00`).getTime()
      const frameEnd   = new Date(`${date}T${frame.endH}:00+07:00`).getTime()

      const booked = events.some(evt => {
        const evtStart = new Date(evt.start?.dateTime ?? evt.start?.date ?? '').getTime()
        const evtEnd   = new Date(evt.end?.dateTime   ?? evt.end?.date   ?? '').getTime()
        return evtStart < frameEnd && evtEnd > frameStart
      })

      return { ...frame, available: !booked }
    })

    return res.json({ frames })
  } catch (err) {
    console.error('Availability error:', err?.message)
    const internalBusy = buildInternalBusySet({ date, visitorId })
    return res.json({
      frames: TIME_FRAMES.map(f => ({
        ...f,
        available: !recurringBusyIds.includes(f.id) && !manualBusyIds.includes(f.id) && !internalBusy.has(`${date}:${f.id}`),
      })),
      error: true,
    })
  }
}
