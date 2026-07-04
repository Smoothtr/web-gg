import { useEffect } from 'react'
import { whenIntroGone } from './useIntroGate'

/**
 * Scroll reveal bằng IntersectionObserver (nhẹ, không re-render React).
 * Gắn `data-reveal` (hoặc data-reveal="left|right|scale") + class `reveal`
 * lên element muốn animate. Stagger bằng inline style transitionDelay.
 *
 * - Chỉ dùng transform/opacity (GPU), mượt trên mobile.
 * - Tôn trọng prefers-reduced-motion (hiện ngay, không animate).
 * - Bắt đầu quan sát sau khi intro biến mất (qua whenIntroGone).
 */
export function useScrollReveal() {
  useEffect(() => {
    const reduced =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const revealAll = () =>
      document
        .querySelectorAll('[data-reveal]')
        .forEach((el) => el.classList.add('is-visible'))

    if (reduced || !('IntersectionObserver' in window)) {
      revealAll()
      return
    }

    let cancelled = false
    let io: IntersectionObserver | null = null

    whenIntroGone(() => {
      if (cancelled) return
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible')
              io?.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.1, rootMargin: '0px 0px -6% 0px' },
      )
      document
        .querySelectorAll('[data-reveal]:not(.is-visible)')
        .forEach((el) => io!.observe(el))
    })

    return () => {
      cancelled = true
      io?.disconnect()
    }
  }, [])
}
