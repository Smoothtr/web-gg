import { timingSafeEqual } from 'node:crypto'
import { NextResponse, type NextRequest } from 'next/server'
import { retryPendingBookingNotifications } from '../../../../../booking/notifications/service'
import { getFirebaseAdminDb } from '../../../../../cms/firebaseAdmin'

export const runtime = 'nodejs'
export const maxDuration = 60

function authorized(request: NextRequest) {
  const secret = process.env.CRON_SECRET ?? ''
  const provided = request.headers.get('authorization') ?? ''
  const expected = `Bearer ${secret}`
  if (!secret || provided.length !== expected.length) return false
  return timingSafeEqual(Buffer.from(provided), Buffer.from(expected))
}

export async function GET(request: NextRequest) {
  if (!authorized(request)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401, headers: { 'Cache-Control': 'no-store' } })
  }
  const db = getFirebaseAdminDb()
  if (!db) {
    return NextResponse.json({ ok: false, error: 'Firestore Admin is not configured.' }, { status: 503, headers: { 'Cache-Control': 'no-store' } })
  }
  try {
    const result = await retryPendingBookingNotifications(db)
    return NextResponse.json({ ok: true, ...result }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error(JSON.stringify({
      event: 'booking_notification_retry_failed',
      errorCode: 'notification_retry_unexpected_error',
      errorType: error instanceof Error ? error.name : 'unknown',
    }))
    return NextResponse.json({ ok: false, error: 'Notification retry failed.' }, { status: 500, headers: { 'Cache-Control': 'no-store' } })
  }
}
