import { useState, useEffect, useCallback } from 'react'
import { type Lang } from '../i18n'

/* ─── Types ─────────────────────────────────────────── */
interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  lang?: Lang
}

/* ─── i18n ──────────────────────────────────────────── */
const STR = {
  vi: {
    locale: 'vi-VN',
    title: 'Đặt lịch tư vấn miễn phí',
    subtitle: 'Đăng ký lịch tư vấn · The One - GG99',
    intro: 'Chọn ngày và khung thời gian bạn mong muốn. The One - GG99 sẽ liên hệ để xác nhận lịch tư vấn phù hợp.',
    frameLabel: 'Khung thời gian mong muốn',
    checking: 'Đang kiểm tra lịch…',
    booked: 'Đã kín lịch',
    continue: 'Tiếp tục đăng ký tư vấn →',
    continueDisabled: 'Chọn ngày và khung thời gian để tiếp tục',
    change: 'Đổi',
    name: 'Họ và tên',
    namePh: 'Nguyễn Văn A',
    phone: 'Số điện thoại',
    phonePh: '0912345678',
    phoneTitle: 'Số điện thoại phải đủ 10 chữ số',
    phoneErr: (n: number) => `Cần đủ 10 số (${n}/10)`,
    email: 'Email',
    emailPh: 'email@congty.vn',
    company: 'Tên công ty / doanh nghiệp',
    companyPh: 'Công ty ABC',
    need: 'Nhu cầu tư vấn',
    needPlaceholder: '-- Chọn nhu cầu --',
    note: 'Ghi chú thêm',
    notePh: 'Mô tả ngắn về tình trạng doanh nghiệp hiện tại…',
    back: '‹ Quay lại',
    submit: 'Gửi đăng ký →',
    submitting: 'Đang gửi…',
    errUnknown: 'Lỗi không xác định',
    errGeneric: 'Đã có lỗi xảy ra. Vui lòng thử lại.',
    thanks: 'Cảm ơn bạn!',
    success1: 'The One - GG99 đã nhận thông tin đăng ký tư vấn.',
    success2: 'Đội ngũ của chúng tôi sẽ liên hệ lại để xác nhận lịch phù hợp.',
    addMore: 'Đăng ký thêm',
    close: 'Đóng',
    days: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
    needs: [
      'Tư vấn tổng quát',
      'Vận hành thương mại điện tử (Shopee, TikTok Shop…)',
      'Mạng xã hội & tăng trưởng (TikTok, nội dung, KOC)',
      'Vận hành doanh nghiệp (quy trình, nhân sự)',
      'Website & hệ thống số',
      'Quản trị dữ liệu & bảng báo cáo',
      'Khác',
    ],
  },
  en: {
    locale: 'en-US',
    title: 'Book a free consultation',
    subtitle: 'Schedule a consultation · The One - GG99',
    intro: 'Choose your preferred date and time. The One - GG99 will reach out to confirm a suitable consultation slot.',
    frameLabel: 'Preferred time slot',
    checking: 'Checking availability…',
    booked: 'Fully booked',
    continue: 'Continue to register →',
    continueDisabled: 'Select a date and time slot to continue',
    change: 'Change',
    name: 'Full name',
    namePh: 'John Smith',
    phone: 'Phone number',
    phonePh: '0912345678',
    phoneTitle: 'Phone number must be 10 digits',
    phoneErr: (n: number) => `Needs 10 digits (${n}/10)`,
    email: 'Email',
    emailPh: 'email@company.com',
    company: 'Company / business name',
    companyPh: 'ABC Company',
    need: 'Consultation need',
    needPlaceholder: '-- Select a need --',
    note: 'Additional note',
    notePh: 'Briefly describe your current business situation…',
    back: '‹ Back',
    submit: 'Submit →',
    submitting: 'Sending…',
    errUnknown: 'Unknown error',
    errGeneric: 'Something went wrong. Please try again.',
    thanks: 'Thank you!',
    success1: 'The One - GG99 has received your consultation request.',
    success2: 'Our team will contact you to confirm a suitable time.',
    addMore: 'Book another',
    close: 'Close',
    days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    needs: [
      'General consultation',
      'Ecommerce Operation (Shopee, TikTok Shop…)',
      'Social & Growth (TikTok, Content, KOC)',
      'Business Operation (Process, HR)',
      'Website & Digital System',
      'Data Management & Dashboard',
      'Other',
    ],
  },
  ko: {
    locale: 'ko-KR',
    title: '무료 상담 예약',
    subtitle: '상담 신청 · The One - GG99',
    intro: '원하시는 날짜와 시간대를 선택하세요. The One - GG99이 적합한 상담 일정을 확인하기 위해 연락드립니다.',
    frameLabel: '희망 시간대',
    checking: '예약 가능 여부 확인 중…',
    booked: '예약 마감',
    continue: '상담 신청 계속하기 →',
    continueDisabled: '계속하려면 날짜와 시간대를 선택하세요',
    change: '변경',
    name: '이름',
    namePh: '홍길동',
    phone: '전화번호',
    phonePh: '01012345678',
    phoneTitle: '전화번호는 숫자 10자리여야 합니다',
    phoneErr: (n: number) => `10자리가 필요합니다 (${n}/10)`,
    email: '이메일',
    emailPh: 'email@company.com',
    company: '회사 / 사업체명',
    companyPh: 'ABC 회사',
    need: '상담 분야',
    needPlaceholder: '-- 상담 분야 선택 --',
    note: '추가 메모',
    notePh: '현재 비즈니스 상황을 간단히 설명해 주세요…',
    back: '‹ 뒤로',
    submit: '신청 제출 →',
    submitting: '전송 중…',
    errUnknown: '알 수 없는 오류',
    errGeneric: '오류가 발생했습니다. 다시 시도해 주세요.',
    thanks: '감사합니다!',
    success1: 'The One - GG99이 상담 신청 정보를 받았습니다.',
    success2: '저희 팀이 적합한 일정을 확인하기 위해 연락드리겠습니다.',
    addMore: '추가 예약',
    close: '닫기',
    days: ['일', '월', '화', '수', '목', '금', '토'],
    needs: [
      '일반 상담',
      'Ecommerce 운영 (Shopee, TikTok Shop…)',
      'Social & Growth (TikTok, Content, KOC)',
      'Business 운영 (프로세스, 인사)',
      'Website & 디지털 시스템',
      '데이터 관리 & 대시보드',
      '기타',
    ],
  },
} as const

type Str = (typeof STR)[Lang]

/* ─── Constants ─────────────────────────────────────── */
const TIME_FRAMES = [
  { id: 'slot_08_10', label: '8-10',   range: '08:00 – 10:00', icon: '🕗' },
  { id: 'slot_10_12', label: '10-12',  range: '10:00 – 12:00', icon: '🕙' },
  { id: 'slot_14_16', label: '14-16',  range: '14:00 – 16:00', icon: '🕑' },
  { id: 'slot_16_18', label: '16-18',  range: '16:00 – 18:00', icon: '🕓' },
  { id: 'slot_20_22', label: '20-22',  range: '20:00 – 22:00', icon: '🕗' },
  { id: 'slot_22_24', label: '22-24',  range: '22:00 – 24:00', icon: '🕙' },
]
const VISITOR_ID_KEY = 'gg99_booking_visitor_id'

/* ─── Helpers ───────────────────────────────────────── */
function toDateStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}
function isPast(d: Date) {
  const today = new Date(); today.setHours(0,0,0,0)
  return d < today
}
function isSunday(d: Date) { return d.getDay() === 0 }

function formatDate(ds: string, locale: string) {
  const [y, m, d] = ds.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return date.toLocaleDateString(locale, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })
}

function readOrCreateVisitorId() {
  try {
    const existing = localStorage.getItem(VISITOR_ID_KEY)
    if (existing) return existing

    const id = crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`
    localStorage.setItem(VISITOR_ID_KEY, id)
    document.cookie = `${VISITOR_ID_KEY}=${encodeURIComponent(id)}; Max-Age=31536000; Path=/; SameSite=Lax`
    return id
  } catch {
    return 'stable-fallback'
  }
}

/* ─── Calendar ──────────────────────────────────────── */
function CalendarPicker({ selected, onSelect, locale, days }: { selected: string | null; onSelect: (d: string) => void; locale: string; days: readonly string[] }) {
  const today = new Date()
  const [year, setYear]   = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1) } else setMonth(m => m - 1) }
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1) } else setMonth(m => m + 1) }

  const firstDay   = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const atMinMonth  = year === today.getFullYear() && month === today.getMonth()
  const monthLabel = new Date(year, month, 1).toLocaleDateString(locale, { month: 'long', year: 'numeric' })

  const cells: (Date | null)[] = Array(firstDay).fill(null)
  for (let i = 1; i <= daysInMonth; i++) cells.push(new Date(year, month, i))

  return (
    <div className="select-none">
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={prevMonth}
          disabled={atMinMonth}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-low disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-primary text-lg"
        >‹</button>
        <span className="font-bold text-sm text-on-surface capitalize">{monthLabel}</span>
        <button
          onClick={nextMonth}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-low transition-colors text-primary text-lg"
        >›</button>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {days.map(d => (
          <div key={d} className="text-center text-[11px] font-semibold text-primary/50 py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((date, i) => {
          if (!date) return <div key={i} />
          const ds = toDateStr(date)
          const disabled = isPast(date) || isSunday(date)
          const isSelected = ds === selected
          const isToday = toDateStr(date) === toDateStr(today)
          return (
            <button
              key={ds}
              onClick={() => !disabled && onSelect(ds)}
              disabled={disabled}
              className={[
                'h-9 w-full rounded-lg text-sm font-medium transition-all',
                disabled ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-surface-container-low cursor-pointer',
                isSelected ? '!bg-primary !text-on-primary shadow-md' : '',
                isToday && !isSelected ? 'ring-1 ring-primary/40 text-primary font-bold' : '',
                !disabled && !isSelected ? 'text-on-surface' : '',
              ].join(' ')}
            >
              {date.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ─── Main modal ────────────────────────────────────── */
export function BookingModal({ isOpen, onClose, lang = 'vi' }: BookingModalProps) {
  const t: Str = STR[lang] ?? STR.vi
  const [step, setStep]         = useState<1 | 2 | 3>(1)
  const [selectedDate, setDate] = useState<string | null>(null)
  const [selectedFrame, setFrame] = useState<string | null>(null)
  const [availability, setAvailability] = useState<Record<string, boolean>>({})
  const [availLoading, setAvailLoading] = useState(false)

  const [form, setForm] = useState({ name: '', phone: '', email: '', company: '', need: '', note: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [visitorId] = useState(readOrCreateVisitorId)

  // Fetch availability when date changes
  useEffect(() => {
    if (!selectedDate) return
    const controller = new AbortController()
    setAvailability({})
    setAvailLoading(true)
    fetch(`/api/availability?date=${selectedDate}&visitorId=${encodeURIComponent(visitorId)}`, {
      signal: controller.signal,
    })
      .then(r => r.json())
      .then(data => {
        const map: Record<string, boolean> = {}
        ;(data.frames ?? []).forEach((f: { id: string; available: boolean }) => {
          map[f.id] = f.available
        })
        setAvailability(map)
      })
      .catch(err => {
        if (err?.name === 'AbortError') return
        // On error, assume all available
        const map: Record<string, boolean> = {}
        TIME_FRAMES.forEach(f => { map[f.id] = true })
        setAvailability(map)
      })
      .finally(() => {
        if (!controller.signal.aborted) setAvailLoading(false)
      })

    return () => controller.abort()
  }, [selectedDate, visitorId])

  const handleKey = useCallback((e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }, [onClose])
  useEffect(() => {
    if (isOpen) document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, handleKey])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  const canContinue = !!selectedDate && !!selectedFrame
  const frameObj = TIME_FRAMES.find(f => f.id === selectedFrame)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedDate || !selectedFrame || !frameObj) return
    setSubmitting(true)
    setSubmitError('')
    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          date: selectedDate,
          timeFrame: frameObj.label,
          timeRange: frameObj.range,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || t.errUnknown)
      setStep(3)
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : t.errGeneric)
    } finally {
      setSubmitting(false)
    }
  }

  function reset() {
    setStep(1); setDate(null); setFrame(null)
    setForm({ name: '', phone: '', email: '', company: '', need: '', note: '' })
    setSubmitError('')
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div
        className="relative w-full sm:max-w-lg bg-surface rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden"
        style={{ maxHeight: '92dvh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-[rgba(226,191,176,0.3)] bg-surface/80 backdrop-blur-sm">
          <div>
            <div className="font-extrabold text-base text-on-surface">{t.title}</div>
            <div className="text-xs text-primary/70 mt-0.5">{t.subtitle}</div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-low text-primary transition-colors text-xl flex-shrink-0 mt-0.5"
          >×</button>
        </div>

        {/* Step bar */}
        {step < 3 && (
          <div className="flex gap-1.5 px-6 pt-4">
            {[1, 2].map(s => (
              <div key={s} className={['h-1 flex-1 rounded-full transition-all', step >= s ? 'bg-primary' : 'bg-primary/15'].join(' ')} />
            ))}
          </div>
        )}

        {/* Body */}
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(92dvh - 76px)' }}>

          {/* ── Step 1: Date + Time frame ── */}
          {step === 1 && (
            <div className="px-6 pb-6 pt-4">
              <p className="text-xs text-on-surface/60 mb-4 leading-relaxed">
                {t.intro}
              </p>

              <CalendarPicker selected={selectedDate} onSelect={(d) => { setDate(d); setFrame(null); setAvailability({}) }} locale={t.locale} days={t.days} />

              {selectedDate && (
                <div className="mt-5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-primary/60 mb-3">
                    {t.frameLabel} — {formatDate(selectedDate, t.locale)}
                  </div>
                  {availLoading ? (
                    <div className="flex items-center justify-center gap-2 py-6 text-primary/60 text-sm">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="30 70" />
                      </svg>
                      {t.checking}
                    </div>
                  ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {TIME_FRAMES.map(tf => {
                      const isSel = selectedFrame === tf.id
                      const isBooked = availability[tf.id] === false
                      return (
                        <button
                          key={tf.id}
                          onClick={() => !isBooked && setFrame(tf.id)}
                          disabled={isBooked}
                          className={[
                            'flex flex-col items-center gap-1.5 py-4 px-2 rounded-2xl border-2 transition-all text-center',
                            isBooked
                              ? 'border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed'
                              : isSel
                              ? 'bg-primary border-primary text-on-primary shadow-md'
                              : 'border-outline-variant/50 bg-surface hover:border-primary/40 hover:bg-surface-container-low text-on-surface',
                          ].join(' ')}
                        >
                          <span className={['text-2xl', isBooked ? 'grayscale opacity-40' : ''].join(' ')}>{tf.icon}</span>
                          <span className="font-bold text-sm leading-tight">{tf.label}</span>
                          <span className={['text-[10px] leading-tight', isBooked ? 'text-gray-300' : isSel ? 'text-on-primary/80' : 'text-on-surface/50'].join(' ')}>
                            {isBooked ? t.booked : tf.range}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                  )}
                </div>
              )}

              <button
                onClick={() => setStep(2)}
                disabled={!canContinue}
                className={[
                  'mt-6 w-full py-3.5 rounded-xl font-bold text-sm transition-all',
                  canContinue
                    ? 'bg-primary text-on-primary gg-btn-primary shadow-md hover:opacity-90'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed',
                ].join(' ')}
              >
                {canContinue ? t.continue : t.continueDisabled}
              </button>
            </div>
          )}

          {/* ── Step 2: Form ── */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="px-6 pb-6 pt-4">
              {/* Summary chip */}
              <div className="flex items-center gap-3 mb-5 p-3 bg-surface-container-low rounded-xl border border-primary/15">
                <span className="text-xl">{frameObj?.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-on-surface truncate">{formatDate(selectedDate!, t.locale)}</div>
                  <div className="text-xs text-primary font-semibold">{frameObj?.label} · {frameObj?.range}</div>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-primary underline underline-offset-2 hover:opacity-70 flex-shrink-0"
                >{t.change}</button>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <label className="block col-span-2 sm:col-span-1">
                    <span className="text-xs font-semibold text-on-surface/70 mb-1 block">{t.name} <span className="text-primary">*</span></span>
                    <input
                      required
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder={t.namePh}
                      className="w-full px-3 py-2.5 rounded-xl border border-outline-variant/50 bg-surface text-sm focus:outline-none focus:border-primary transition-colors"
                    />
                  </label>
                  <label className="block col-span-2 sm:col-span-1">
                    <span className="text-xs font-semibold text-on-surface/70 mb-1 block">{t.phone} <span className="text-primary">*</span></span>
                    <input
                      required
                      type="tel"
                      value={form.phone}
                      onChange={e => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 10)
                        setForm(f => ({ ...f, phone: val }))
                      }}
                      pattern="\d{10}"
                      title={t.phoneTitle}
                      placeholder={t.phonePh}
                      className={[
                        'w-full px-3 py-2.5 rounded-xl border bg-surface text-sm focus:outline-none transition-colors',
                        form.phone.length > 0 && form.phone.length < 10
                          ? 'border-red-300 focus:border-red-400'
                          : 'border-outline-variant/50 focus:border-primary',
                      ].join(' ')}
                    />
                    {form.phone.length > 0 && form.phone.length < 10 && (
                      <span className="text-[11px] text-red-400 mt-0.5 block">{t.phoneErr(form.phone.length)}</span>
                    )}
                  </label>
                </div>

                <label className="block">
                  <span className="text-xs font-semibold text-on-surface/70 mb-1 block">{t.email} <span className="text-primary">*</span></span>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder={t.emailPh}
                    className="w-full px-3 py-2.5 rounded-xl border border-outline-variant/50 bg-surface text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-semibold text-on-surface/70 mb-1 block">{t.company}</span>
                  <input
                    value={form.company}
                    onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                    placeholder={t.companyPh}
                    className="w-full px-3 py-2.5 rounded-xl border border-outline-variant/50 bg-surface text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-semibold text-on-surface/70 mb-1 block">{t.need}</span>
                  <select
                    value={form.need}
                    onChange={e => setForm(f => ({ ...f, need: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-outline-variant/50 bg-surface text-sm focus:outline-none focus:border-primary transition-colors text-on-surface"
                  >
                    <option value="">{t.needPlaceholder}</option>
                    {t.needs.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </label>

                <label className="block">
                  <span className="text-xs font-semibold text-on-surface/70 mb-1 block">{t.note}</span>
                  <textarea
                    rows={3}
                    value={form.note}
                    onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                    placeholder={t.notePh}
                    className="w-full px-3 py-2.5 rounded-xl border border-outline-variant/50 bg-surface text-sm focus:outline-none focus:border-primary transition-colors resize-none"
                  />
                </label>
              </div>

              {submitError && (
                <div className="mt-3 px-4 py-2.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                  {submitError}
                </div>
              )}

              <div className="flex gap-2 mt-5">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-3 rounded-xl border-2 border-outline-variant/50 text-sm font-semibold text-on-surface/60 hover:border-primary/30 transition-colors"
                >
                  {t.back}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 rounded-xl bg-primary text-on-primary gg-btn-primary font-bold text-sm shadow-md hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeDasharray="30 70" />
                      </svg>
                      {t.submitting}
                    </>
                  ) : t.submit}
                </button>
              </div>
            </form>
          )}

          {/* ── Step 3: Success ── */}
          {step === 3 && (
            <div className="px-6 py-10 text-center">
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4 text-3xl">
                ✅
              </div>
              <h3 className="text-xl font-extrabold text-on-surface mb-3">{t.thanks}</h3>
              <p className="text-sm text-on-surface/60 leading-relaxed mb-2">
                {t.success1}
              </p>
              <p className="text-sm text-on-surface/60 leading-relaxed mb-5">
                {t.success2}
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-surface-container-low rounded-xl mb-6">
                <span className="text-lg">{frameObj?.icon}</span>
                <span className="text-sm font-semibold text-primary">
                  {frameObj?.label} · {formatDate(selectedDate!, t.locale)}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <button
                  onClick={reset}
                  className="px-6 py-2.5 rounded-xl border-2 border-primary/20 text-sm font-semibold text-primary hover:bg-surface-container-low transition-colors"
                >
                  {t.addMore}
                </button>
                <button
                  onClick={() => { reset(); onClose() }}
                  className="px-6 py-2.5 rounded-xl bg-primary text-on-primary gg-btn-primary text-sm font-bold hover:opacity-90 transition-opacity"
                >
                  {t.close}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
