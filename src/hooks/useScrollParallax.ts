import { useEffect } from 'react'

/**
 * Scroll parallax (depth + scroll-linked) bằng JS thuần — nhẹ, mượt.
 * Gắn `data-parallax="0.2"` lên element trang trí: nó trôi theo độ cuộn
 * (tỉ lệ với khoảng cách tới tâm viewport) -> nhiều lớp tốc độ khác nhau = chiều sâu.
 *
 * - Chỉ dùng transform (GPU), scroll passive + rAF.
 * - Tôn trọng prefers-reduced-motion (tắt). Mobile: biên độ nhỏ hơn.
 */
export function useScrollParallax() {
  useEffect(() => {
    const reduced =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const isMobile = window.matchMedia && window.matchMedia('(max-width: 640px)').matches
    const mult = isMobile ? 0.5 : 1

    let raf = 0
    let els: HTMLElement[] = []

    const collect = () => {
      els = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'))
    }

    const update = () => {
      raf = 0
      const vh = window.innerHeight || document.documentElement.clientHeight
      const mid = vh / 2
      for (const el of els) {
        const rect = el.getBoundingClientRect()
        const center = rect.top + rect.height / 2
        const speed = (parseFloat(el.dataset.parallax || '0') || 0) * mult
        const ty = -(center - mid) * speed
        el.style.transform = `translate3d(0, ${ty.toFixed(1)}px, 0)`
      }
    }

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    collect()
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    // Phòng trường hợp DOM đổi (ảnh load, font…): cập nhật lại danh sách & vị trí
    const t = window.setTimeout(() => {
      collect()
      update()
    }, 600)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.clearTimeout(t)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])
}
