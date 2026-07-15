export const BOOKING_TIME_ZONE = 'Asia/Ho_Chi_Minh'
export const BOOKING_WINDOW_DAYS = 90
export const SCHEDULE_POLICY_VERSION = 2
export const WEEKLY_BUSY_RATIO = 0.5

export const TIME_FRAMES = [
  { id: 'slot_08_10', label: '8-10', startH: '08:00', endH: '10:00' },
  { id: 'slot_10_12', label: '10-12', startH: '10:00', endH: '12:00' },
  { id: 'slot_14_16', label: '14-16', startH: '14:00', endH: '16:00' },
  { id: 'slot_16_18', label: '16-18', startH: '16:00', endH: '18:00' },
  { id: 'slot_20_22', label: '20-22', startH: '20:00', endH: '22:00' },
  { id: 'slot_22_24', label: '22-24', startH: '22:00', endH: '23:59' },
] as const

export type TimeFrame = (typeof TIME_FRAMES)[number]
export type TimeFrameId = TimeFrame['id']
export type TimeFrameLabel = TimeFrame['label']

export type CalendarEventLike = {
  start?: { dateTime?: string | null; date?: string | null } | null
  end?: { dateTime?: string | null; date?: string | null } | null
}

export type WeekBusyState = {
  weekDates: string[]
  naturalBusy: Set<string>
  capacityBusy: Set<string>
  unavailable: Set<string>
  targetBusy: number
}

const CAPACITY_SEED = 'gg99-weekly-capacity-v1'

export function dateInBookingTimeZone(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: BOOKING_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]))
  return `${value.year}-${value.month}-${value.day}`
}

export function addDays(dateString: string, days: number) {
  const [year, month, day] = dateString.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

export function isRealDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  return date.toISOString().slice(0, 10) === value
}

export function dayOfWeek(dateString: string) {
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay()
}

export function earliestBookingDate(now = new Date()) {
  return addDays(dateInBookingTimeZone(now), 1)
}

export function latestBookingDate(now = new Date()) {
  return addDays(dateInBookingTimeZone(now), BOOKING_WINDOW_DAYS)
}

export function isDateWithinBookingWindow(value: string, now = new Date()) {
  return isRealDate(value) && value >= earliestBookingDate(now) && value <= latestBookingDate(now)
}

export function getWeekDates(dateString: string) {
  const [year, month, day] = dateString.split('-').map(Number)
  const base = new Date(Date.UTC(year, month - 1, day))
  const currentDay = base.getUTCDay()
  const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay
  base.setUTCDate(base.getUTCDate() + mondayOffset)
  const monday = base.toISOString().slice(0, 10)
  return Array.from({ length: 6 }, (_, index) => addDays(monday, index))
}

export function recurringBusyIds(day: number): readonly TimeFrameId[] {
  if (day === 1) return ['slot_08_10', 'slot_10_12']
  if (day === 2) return ['slot_08_10', 'slot_10_12', 'slot_14_16', 'slot_16_18']
  return []
}

export function isRecurringBusy(dateString: string, frameId: TimeFrameId) {
  return recurringBusyIds(dayOfWeek(dateString)).includes(frameId)
}

export function getTimeFrameById(frameId: string) {
  return TIME_FRAMES.find((frame) => frame.id === frameId)
}

export function getTimeFrameByLabel(label: string) {
  return TIME_FRAMES.find((frame) => frame.label === label)
}

export function slotKey(dateString: string, frameId: TimeFrameId) {
  return `${dateString}:${frameId}`
}

function hashString(value: string) {
  let hash = 2166136261
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function overlapsEvent(dateString: string, frame: TimeFrame, event: CalendarEventLike) {
  const frameStart = new Date(`${dateString}T${frame.startH}:00+07:00`).getTime()
  const frameEnd = new Date(`${dateString}T${frame.endH}:00+07:00`).getTime()
  const eventStart = new Date(event.start?.dateTime ?? event.start?.date ?? '').getTime()
  const eventEnd = new Date(event.end?.dateTime ?? event.end?.date ?? '').getTime()
  return Number.isFinite(eventStart) && Number.isFinite(eventEnd) && eventStart < frameEnd && eventEnd > frameStart
}

export function buildWeekBusyState(referenceDate: string, events: CalendarEventLike[] = []): WeekBusyState {
  const weekDates = getWeekDates(referenceDate)
  const allSlots = weekDates.flatMap((date) => TIME_FRAMES.map((frame) => ({ date, frame })))
  const naturalBusy = new Set<string>()

  for (const slot of allSlots) {
    const key = slotKey(slot.date, slot.frame.id)
    if (isRecurringBusy(slot.date, slot.frame.id) || events.some((event) => overlapsEvent(slot.date, slot.frame, event))) {
      naturalBusy.add(key)
    }
  }

  const targetBusy = Math.floor(allSlots.length * WEEKLY_BUSY_RATIO)
  const capacityCount = Math.max(0, targetBusy - naturalBusy.size)
  const weekStart = weekDates[0]
  const capacityBusy = new Set(
    allSlots
      .filter((slot) => !naturalBusy.has(slotKey(slot.date, slot.frame.id)))
      .map((slot) => {
        const key = slotKey(slot.date, slot.frame.id)
        return { key, score: hashString(`${CAPACITY_SEED}:${weekStart}:${key}`) }
      })
      .sort((left, right) => left.score - right.score || left.key.localeCompare(right.key))
      .slice(0, capacityCount)
      .map((slot) => slot.key),
  )
  const unavailable = new Set([...naturalBusy, ...capacityBusy])

  return { weekDates, naturalBusy, capacityBusy, unavailable, targetBusy }
}

export function availabilityFrames(dateString: string, state: WeekBusyState) {
  return TIME_FRAMES.map((frame) => ({
    ...frame,
    available: !state.unavailable.has(slotKey(dateString, frame.id)),
  }))
}

export function isSlotUnavailable(dateString: string, frameId: TimeFrameId, state: WeekBusyState) {
  return state.unavailable.has(slotKey(dateString, frameId))
}
