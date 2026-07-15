import { expect, test } from '@playwright/test'
import {
  addDays,
  availabilityFrames,
  buildWeekBusyState,
  dateInBookingTimeZone,
  dayOfWeek,
  earliestBookingDate,
  isDateWithinBookingWindow,
  isSlotUnavailable,
  type CalendarEventLike,
  type TimeFrameId,
} from '../src/booking/schedulePolicy'

function calendarEvent(date: string, startH: string, endH: string): CalendarEventLike {
  return {
    start: { dateTime: `${date}T${startH}:00+07:00` },
    end: { dateTime: `${date}T${endH}:00+07:00` },
  }
}

function bookingPayload(date: string, timeFrame: string, idempotencyKey: string) {
  return {
    date,
    timeFrame,
    timeRange: timeFrame,
    name: 'Policy Test',
    phone: '0912345678',
    email: 'policy-test@example.com',
    company: '',
    need: '',
    note: '',
    website: '',
    consent: true,
    startedAt: Date.now() - 2_000,
    idempotencyKey,
    challengeToken: '',
    attribution: {},
  }
}

test('only allows booking from the next Vietnam calendar day', () => {
  const now = new Date('2026-07-15T06:42:00.000Z') // 13:42 in Vietnam

  expect(earliestBookingDate(now)).toBe('2026-07-16')
  expect(isDateWithinBookingWindow('2026-07-15', now)).toBe(false)
  expect(isDateWithinBookingWindow('2026-07-16', now)).toBe(true)
})

test('keeps exactly half of a quiet week unavailable', () => {
  const state = buildWeekBusyState('2026-07-22')

  expect(state.weekDates).toEqual([
    '2026-07-20',
    '2026-07-21',
    '2026-07-22',
    '2026-07-23',
    '2026-07-24',
    '2026-07-25',
  ])
  expect(state.targetBusy).toBe(18)
  expect(state.naturalBusy.size).toBe(6)
  expect(state.capacityBusy.size).toBe(12)
  expect(state.unavailable.size).toBe(18)
})

test('reduces internal holds when real bookings increase', () => {
  const events = [
    calendarEvent('2026-07-22', '08:00', '10:00'),
    calendarEvent('2026-07-23', '10:00', '12:00'),
    calendarEvent('2026-07-24', '14:00', '16:00'),
  ]
  const state = buildWeekBusyState('2026-07-22', events)

  expect(state.naturalBusy.size).toBe(9)
  expect(state.capacityBusy.size).toBe(9)
  expect(state.unavailable.size).toBe(18)
})

test('uses one stable weekly capacity plan for every visitor', () => {
  const mondayState = buildWeekBusyState('2026-07-20')
  const saturdayState = buildWeekBusyState('2026-07-25')

  expect([...mondayState.capacityBusy].sort()).toEqual([...saturdayState.capacityBusy].sort())
})

test('enforces recurring and capacity holds through the shared policy', () => {
  const state = buildWeekBusyState('2026-07-22')
  const capacityKey = [...state.capacityBusy][0]
  const [capacityDate, capacityFrameId] = capacityKey.split(':') as [string, TimeFrameId]

  expect(isSlotUnavailable('2026-07-20', 'slot_08_10', state)).toBe(true)
  expect(isSlotUnavailable('2026-07-21', 'slot_16_18', state)).toBe(true)
  expect(isSlotUnavailable(capacityDate, capacityFrameId, state)).toBe(true)
  expect(availabilityFrames(capacityDate, state).find((frame) => frame.id === capacityFrameId)?.available).toBe(false)
})

test('book API rejects today and recurring holds before external writes', async ({ request }) => {
  const today = dateInBookingTimeZone()
  const sameDayResponse = await request.post('/api/book', {
    data: bookingPayload(today, '14-16', 'same-day-policy-test-key'),
    headers: { 'X-Forwarded-For': '198.51.100.201' },
  })
  expect(sameDayResponse.status()).toBe(400)

  let monday = addDays(today, 1)
  while (dayOfWeek(monday) !== 1) monday = addDays(monday, 1)
  const recurringResponse = await request.post('/api/book', {
    data: bookingPayload(monday, '8-10', 'recurring-policy-test-key'),
    headers: { 'X-Forwarded-For': '198.51.100.202' },
  })
  expect(recurringResponse.status()).toBe(409)
})
