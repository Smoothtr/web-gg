import { useEffect } from 'react'

/**
 * Card 3D: spotlight (--mx/--my) + nghiêng 3D theo vị trí chuột (--rx/--ry).
 * 1 listener delegated + throttle rAF, chỉ thiết bị hover (desktop), tôn trọng reduced-motion.
 * Reset khi con trỏ rời card để card trở về phẳng mượt.
 */
export function useCardSpotlight() {
  useEffect(() => {
    const canHover = window.matchMedia && window.matchMedia('(hover: hover)').matches
    const reduced =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!canHover || reduced) return

    let raf = 0
    let pending: { card: HTMLElement; x: number; y: number; w: number; h: number } | null = null
    let current: HTMLElement | null = null

    const maxTilt = 7 // độ

    const reset = (card: HTMLElement) => {
      card.style.removeProperty('--rx')
      card.style.removeProperty('--ry')
    }

    const apply = () => {
      raf = 0
      if (!pending) return
      const { card, x, y, w, h } = pending
      card.style.setProperty('--mx', `${x}px`)
      card.style.setProperty('--my', `${y}px`)
      const px = x / w - 0.5 // -0.5..0.5
      const py = y / h - 0.5
      card.style.setProperty('--ry', `${(px * maxTilt * 2).toFixed(2)}deg`)
      card.style.setProperty('--rx', `${(-py * maxTilt * 2).toFixed(2)}deg`)
    }

    const onMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      const card = target?.closest<HTMLElement>('.card-hover') || null
      if (card !== current) {
        if (current) reset(current)
        current = card
      }
      if (!card) return
      const rect = card.getBoundingClientRect()
      pending = { card, x: e.clientX - rect.left, y: e.clientY - rect.top, w: rect.width, h: rect.height }
      if (!raf) raf = requestAnimationFrame(apply)
    }

    document.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      document.removeEventListener('mousemove', onMove)
      if (current) reset(current)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])
}
