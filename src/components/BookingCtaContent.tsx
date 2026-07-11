import { ArrowUpRight, CalendarDays } from 'lucide-react'

export const BOOKING_CTA_LABEL = 'Schedule Our Date'
export const BOOKING_CTA_NOTE = 'Free 30-min founder call \u00b7 No commitment'

export function BookingCtaContent({ showNote = false }: { showNote?: boolean }) {
  if (!showNote) return <span className="booking-cta-content booking-cta-content--compact">{BOOKING_CTA_LABEL}</span>

  return (
    <span className="booking-cta-content">
      <span className="booking-cta-icon" aria-hidden="true">
        <CalendarDays />
      </span>
      <span className="booking-cta-copy">
        <span className="booking-cta-label">{BOOKING_CTA_LABEL}</span>
        <span aria-hidden="true" className="booking-cta-note">{BOOKING_CTA_NOTE}</span>
      </span>
      <ArrowUpRight className="booking-cta-arrow" aria-hidden="true" />
    </span>
  )
}
