/** @jsxImportSource react */
import type { CSSProperties } from 'react'
import type { BookingLocale, BookingNotificationPayload } from '../booking/notifications/types'

const COPY = {
  vi: {
    preview: 'The One - GG99 đã nhận yêu cầu đặt lịch của bạn.',
    heading: 'Chúng tôi đã nhận yêu cầu của bạn',
    greeting: (name: string) => `Xin chào ${name},`,
    body: 'Cảm ơn bạn đã đăng ký tư vấn cùng The One - GG99. Đội ngũ của chúng tôi sẽ liên hệ để xác nhận lịch phù hợp.',
    date: 'Ngày mong muốn',
    time: 'Khung giờ mong muốn',
    note: 'Lưu ý: đây là yêu cầu đặt lịch, lịch hẹn chỉ được xác nhận sau khi đội ngũ liên hệ lại với bạn.',
    zalo: 'Nhắn The One - GG99 trên Zalo',
    footer: 'Nếu bạn không thực hiện yêu cầu này, bạn có thể bỏ qua email.',
    subject: 'The One - GG99 đã nhận yêu cầu đặt lịch của bạn',
    locale: 'vi-VN',
  },
  en: {
    preview: 'The One - GG99 received your consultation request.',
    heading: 'We received your request',
    greeting: (name: string) => `Hello ${name},`,
    body: 'Thank you for requesting a consultation with The One - GG99. Our team will contact you to confirm a suitable appointment.',
    date: 'Preferred date',
    time: 'Preferred time',
    note: 'Please note: this is a booking request. The appointment is confirmed only after our team contacts you.',
    zalo: 'Message The One - GG99 on Zalo',
    footer: 'If you did not make this request, you can ignore this email.',
    subject: 'The One - GG99 received your booking request',
    locale: 'en-US',
  },
  ko: {
    preview: 'The One - GG99이 상담 예약 요청을 받았습니다.',
    heading: '예약 요청을 받았습니다',
    greeting: (name: string) => `${name}님, 안녕하세요.`,
    body: 'The One - GG99 상담을 신청해 주셔서 감사합니다. 담당자가 연락드려 적합한 일정을 확인해 드립니다.',
    date: '희망 날짜',
    time: '희망 시간',
    note: '안내: 현재는 예약 요청 단계이며, 담당자가 연락드린 후 일정이 최종 확정됩니다.',
    zalo: 'Zalo로 The One - GG99에 문의하기',
    footer: '본인이 요청하지 않았다면 이 이메일을 무시하셔도 됩니다.',
    subject: 'The One - GG99이 예약 요청을 받았습니다',
    locale: 'ko-KR',
  },
} as const

function copyFor(locale: BookingLocale) {
  return COPY[locale] ?? COPY.en
}

function formattedDate(payload: BookingNotificationPayload) {
  const copy = copyFor(payload.locale)
  return new Intl.DateTimeFormat(copy.locale, {
    timeZone: 'Asia/Ho_Chi_Minh',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(`${payload.date}T12:00:00+07:00`))
}

export function bookingCustomerEmailSubject(locale: BookingLocale) {
  return copyFor(locale).subject
}

export function BookingCustomerEmail({ booking }: { booking: BookingNotificationPayload }) {
  const copy = copyFor(booking.locale)
  return (
    <html lang={booking.locale}>
      <head />
      <body style={bodyStyle}>
        <div style={previewStyle}>{copy.preview}</div>
        <div style={containerStyle}>
          <p style={eyebrowStyle}>THE ONE · GG99</p>
          <h1 style={headingStyle}>{copy.heading}</h1>
          <p style={textStyle}>{copy.greeting(booking.name)}</p>
          <p style={textStyle}>{copy.body}</p>

          <div style={summaryStyle}>
            <p style={labelStyle}>{copy.date}</p>
            <p style={valueStyle}>{formattedDate(booking)}</p>
            <hr style={summaryDividerStyle} />
            <p style={labelStyle}>{copy.time}</p>
            <p style={valueStyle}>{booking.timeFrame} · {booking.timeRange}</p>
          </div>

          <p style={noteStyle}>{copy.note}</p>
          <a href="https://zalo.me/smoothgg" style={buttonStyle}>{copy.zalo}</a>
          <hr style={dividerStyle} />
          <p style={footerStyle}>{copy.footer}</p>
        </div>
      </body>
    </html>
  )
}

const previewStyle: CSSProperties = { display: 'none', maxHeight: 0, maxWidth: 0, opacity: 0, overflow: 'hidden' }
const bodyStyle: CSSProperties = {
  backgroundColor: '#fff7fb',
  color: '#2d2028',
  fontFamily: 'Arial, Helvetica, sans-serif',
  margin: 0,
  padding: '32px 12px',
}
const containerStyle: CSSProperties = {
  backgroundColor: '#ffffff',
  border: '1px solid #f1cfdf',
  borderRadius: '20px',
  margin: '0 auto',
  maxWidth: '560px',
  padding: '36px 32px',
}
const eyebrowStyle: CSSProperties = { color: '#df2676', fontSize: '12px', fontWeight: 700, letterSpacing: '1.5px', margin: 0 }
const headingStyle: CSSProperties = { color: '#2d2028', fontSize: '26px', lineHeight: 1.25, margin: '12px 0 24px' }
const textStyle: CSSProperties = { fontSize: '15px', lineHeight: 1.7, margin: '0 0 14px' }
const summaryStyle: CSSProperties = { backgroundColor: '#fff4f9', borderRadius: '14px', margin: '24px 0', padding: '18px 20px' }
const labelStyle: CSSProperties = { color: '#9c6b82', fontSize: '11px', fontWeight: 700, letterSpacing: '0.7px', margin: '0 0 4px', textTransform: 'uppercase' }
const valueStyle: CSSProperties = { color: '#2d2028', fontSize: '16px', fontWeight: 700, margin: 0 }
const summaryDividerStyle: CSSProperties = { borderColor: '#f1cfdf', margin: '14px 0' }
const noteStyle: CSSProperties = { color: '#765464', fontSize: '13px', lineHeight: 1.6, margin: '0 0 22px' }
const buttonStyle: CSSProperties = { backgroundColor: '#df2676', borderRadius: '999px', color: '#ffffff', display: 'inline-block', fontSize: '14px', fontWeight: 700, padding: '13px 22px', textDecoration: 'none' }
const dividerStyle: CSSProperties = { borderColor: '#f1cfdf', margin: '28px 0 18px' }
const footerStyle: CSSProperties = { color: '#987788', fontSize: '11px', lineHeight: 1.6, margin: 0 }
