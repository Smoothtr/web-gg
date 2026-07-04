import { useEffect, useRef, useState } from 'react'
import { whenIntroGone } from '../hooks/useIntroGate'

type CountUpProps = {
  /** Giá trị cuối, có thể kèm tiền tố/hậu tố: "50+", "6 lĩnh vực", "4.2×", "Theo tháng". */
  value: string
  /** Thời lượng đếm (ms). */
  duration?: number
  className?: string
}

/**
 * Đếm số từ 0 -> giá trị thật khi cuộn tới (IntersectionObserver), chạy sau intro.
 * Giữ nguyên phần chữ (tiền tố/hậu tố). Nếu không có số -> hiện tĩnh.
 * Tôn trọng prefers-reduced-motion.
 */
export function CountUp({ value, duration = 1300, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement | null>(null)
  const match = String(value).match(/^(\D*)(\d[\d.,]*)(\D*)$/)
  const decimals = match && match[2].includes('.') ? match[2].split('.')[1].length : 0

  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const [text, setText] = useState<string>(() => {
    if (!match || reduced) return value
    return match[1] + (0).toFixed(decimals) + match[3]
  })

  useEffect(() => {
    if (!match || reduced) {
      setText(value)
      return
    }
    const el = ref.current
    if (!el) return

    const target = parseFloat(match[2].replace(/,/g, ''))
    let raf = 0
    let started = false

    const run = () => {
      const t0 = performance.now()
      const tick = (now: number) => {
        const p = Math.min(1, (now - t0) / duration)
        const eased = 1 - Math.pow(1 - p, 3) // easeOutCubic
        setText(match[1] + (target * eased).toFixed(decimals) + match[3])
        if (p < 1) raf = requestAnimationFrame(tick)
        else setText(match[1] + target.toFixed(decimals) + match[3])
      }
      raf = requestAnimationFrame(tick)
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started) {
          started = true
          io.disconnect()
          whenIntroGone(run)
        }
      },
      { threshold: 0.4 },
    )
    io.observe(el)

    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return (
    <span ref={ref} className={className}>
      {text}
    </span>
  )
}

export default CountUp
