import { google } from 'googleapis'
import { NextResponse, type NextRequest } from 'next/server'
import {
  SCHEDULE_POLICY_VERSION,
  availabilityFrames,
  buildWeekBusyState,
  dayOfWeek,
  getWeekDates,
  isDateWithinBookingWindow,
} from '../../../booking/schedulePolicy'
import { getFirebaseAdminDb } from '../../../cms/firebaseAdmin'
import { checkRateLimit, rateLimitResponse } from '../../../security/serverRateLimit'

export const runtime = 'nodejs'

function jsonError(status: number, error: string) {
  return NextResponse.json({ ok: false, error }, { status, headers: { 'Cache-Control': 'no-store' } })
}

export async function GET(request: NextRequest) {
  const rateLimit = await checkRateLimit(request, { scope: 'availability-ip', limit: 30, windowSeconds: 60 })
  if (!rateLimit.allowed) return rateLimitResponse(rateLimit)

  const date = request.nextUrl.searchParams.get('date') ?? ''
  if (!isDateWithinBookingWindow(date)) return jsonError(400, 'Bookings must be scheduled from tomorrow onward.')

  if (dayOfWeek(date) === 0) {
    return NextResponse.json({ frames: [] }, { headers: { 'Cache-Control': 'private, max-age=30' } })
  }

  const db = getFirebaseAdminDb()
  const { GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_CALENDAR_ID } = process.env
  if (!db || !GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY || !GOOGLE_CALENDAR_ID) {
    return jsonError(503, 'Availability is temporarily unavailable.')
  }

  const cacheRef = db.collection('bookingAvailabilityCache').doc(date)
  const cached = await cacheRef.get()
  const cachedData = cached.data()
  const cacheExpiry = cachedData?.expiresAt?.toDate?.().getTime?.() ?? 0
  if (cachedData?.policyVersion === SCHEDULE_POLICY_VERSION && cacheExpiry > Date.now() && Array.isArray(cachedData?.frames)) {
    return NextResponse.json(
      { frames: cachedData.frames },
      { headers: { 'Cache-Control': 'private, max-age=20', 'X-Availability-Cache': 'HIT' } },
    )
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: GOOGLE_CLIENT_EMAIL,
        private_key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
    })
    const calendar = google.calendar({ version: 'v3', auth })
    const weekDates = getWeekDates(date)
    const eventsResult = await calendar.events.list({
      calendarId: GOOGLE_CALENDAR_ID,
      timeMin: `${weekDates[0]}T00:00:00+07:00`,
      timeMax: `${weekDates[weekDates.length - 1]}T23:59:59+07:00`,
      singleEvents: true,
    })
    const events = eventsResult.data.items ?? []
    const frames = availabilityFrames(date, buildWeekBusyState(date, events))

    await cacheRef.set({
      frames,
      policyVersion: SCHEDULE_POLICY_VERSION,
      expiresAt: new Date(Date.now() + 30_000),
      updatedAt: new Date(),
    })
    return NextResponse.json(
      { frames },
      { headers: { 'Cache-Control': 'private, max-age=20', 'X-Availability-Cache': 'MISS' } },
    )
  } catch (error) {
    console.error(JSON.stringify({ event: 'availability_failed', date, error: error instanceof Error ? error.message : 'unknown' }))
    return jsonError(503, 'Availability is temporarily unavailable.')
  }
}
