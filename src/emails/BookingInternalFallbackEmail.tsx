/** @jsxImportSource react */
import type { CSSProperties } from 'react'
import type { BookingNotificationPayload } from '../booking/notifications/types'

export function BookingInternalFallbackEmail({ booking }: { booking: BookingNotificationPayload }) {
  return (
    <html lang="vi">
      <head />
      <body style={bodyStyle}>
        <div style={previewStyle}>Booking mới - Discord không nhận được thông báo.</div>
        <div style={containerStyle}>
          <h1 style={headingStyle}>🔔 Booking mới</h1>
          <p style={warningStyle}>Discord không nhận được thông báo nên hệ thống gửi email dự phòng này.</p>
          <p><strong>Khách hàng:</strong> {booking.name}</p>
          <p><strong>Điện thoại:</strong> {booking.phone}</p>
          <p><strong>Email:</strong> {booking.email}</p>
          <p><strong>Công ty:</strong> {booking.company || '—'}</p>
          <p><strong>Nhu cầu:</strong> {booking.need || '—'}</p>
          <p><strong>Thời gian:</strong> {booking.date}, {booking.timeFrame} ({booking.timeRange})</p>
          <p><strong>Ghi chú:</strong> {booking.note || '—'}</p>
          {booking.calendarUrl ? (
            <p><a href={booking.calendarUrl}>Mở booking trong Google Calendar</a></p>
          ) : null}
          <hr style={dividerStyle} />
          <p style={footerStyle}>Request: {booking.requestId.slice(0, 12)}</p>
        </div>
      </body>
    </html>
  )
}

const previewStyle: CSSProperties = { display: 'none', maxHeight: 0, maxWidth: 0, opacity: 0, overflow: 'hidden' }
const bodyStyle: CSSProperties = { backgroundColor: '#f5f5f5', color: '#242124', fontFamily: 'Arial, Helvetica, sans-serif', padding: '28px 12px' }
const containerStyle: CSSProperties = { backgroundColor: '#ffffff', borderRadius: '14px', margin: '0 auto', maxWidth: '600px', padding: '28px' }
const headingStyle: CSSProperties = { fontSize: '24px', margin: '0 0 18px' }
const warningStyle: CSSProperties = { backgroundColor: '#fff4d6', borderRadius: '8px', color: '#674d00', fontSize: '13px', padding: '12px' }
const dividerStyle: CSSProperties = { borderColor: '#dddddd', margin: '24px 0 12px' }
const footerStyle: CSSProperties = { color: '#777777', fontSize: '11px' }
