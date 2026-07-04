import { useEffect, useLayoutEffect, useState } from 'react'
import './IntroLoader.css'

/**
 * IntroLoader — The One - GG99
 *
 * Sequence (kiểu KBTG):
 *  1) Logo fade-in.
 *  2) Luồng sáng chạy dọc viền vàng (2 ring) — xuất phát từ chỗ hở trên đỉnh,
 *     chạy vòng quanh logo (~sweep ms).
 *  3) Zoom về phía chữ "GG", màu cam của GG tràn full màn hình.
 *  4) Màn cam mờ đi để lộ website.
 *
 * Mặc định chỉ chạy khi document load trực tiếp vào homepage hoặc refresh homepage.
 *
 * Chỉnh nhanh ở props bên dưới. Tone màu / glow chỉnh trong IntroLoader.css.
 */

type IntroLoaderProps = {
  /** Tổng thời gian loader hiển thị (ms). */
  duration?: number
  /** Thời gian zoom-to-GG + flood cam + reveal (ms). */
  fadeOut?: number
  /** Thời gian luồng sáng chạy dọc viền (ms). */
  sweep?: number
  /** Đường dẫn logo (PNG). TODO: thay nếu đổi logo. */
  logoSrc?: string
  /**
   * true  = chỉ chạy 1 lần / session (sessionStorage), reload không chạy lại.
   * false = (mặc định) chạy MỖI lần tải/reload trang.
   * Lưu ý: chuyển route trong SPA (không reload) KHÔNG chạy lại vì loader
   * mount 1 lần ở App — chỉ full reload mới mount lại và chạy.
   */
  oncePerSession?: boolean
  /** Key sessionStorage (chỉ dùng khi oncePerSession=true). */
  storageKey?: string
  /** Route prefixes that should not show the intro. */
  skipPathPrefixes?: string[]
  /** Exact pathnames where the intro is allowed to run on document load. */
  allowedPathnames?: string[]
  /** Key used to skip the intro after same-site link navigations. */
  internalNavigationKey?: string
}

const SESSION_KEY_DEFAULT = 'gg99_intro_seen'
const INTERNAL_NAVIGATION_KEY_DEFAULT = 'gg99_internal_navigation'
const ALLOWED_PATHNAMES_DEFAULT = ['/', '/en']
const SKIP_PATH_PREFIXES_DEFAULT = ['/admin']
const INTERNAL_NAVIGATION_MAX_AGE = 15_000

function scrollToPageTop() {
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0
}

function normalizePathname(pathname: string) {
  const normalized = pathname.replace(/\/+$/, '')
  return normalized || '/'
}

function isAllowedPathname(pathname: string, allowedPathnames: string[]) {
  const current = normalizePathname(pathname)
  return allowedPathnames.some((allowedPathname) => normalizePathname(allowedPathname) === current)
}

function getNavigationType() {
  const [navigation] = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[]
  return navigation?.type
}

function consumeInternalNavigationMark(storageKey: string, currentPathname: string) {
  try {
    const rawMark = sessionStorage.getItem(storageKey)
    sessionStorage.removeItem(storageKey)
    if (!rawMark) return false

    const mark = JSON.parse(rawMark) as { pathname?: unknown; ts?: unknown }
    if (typeof mark.ts !== 'number' || Date.now() - mark.ts > INTERNAL_NAVIGATION_MAX_AGE) return false
    if (typeof mark.pathname === 'string' && normalizePathname(mark.pathname) !== normalizePathname(currentPathname)) return false
    return true
  } catch {
    return false
  }
}

export default function IntroLoader({
  duration = 5700,
  fadeOut = 2200,
  sweep = 3000,
  logoSrc = '/logo-gg.png',
  oncePerSession = false,
  storageKey = SESSION_KEY_DEFAULT,
  skipPathPrefixes = SKIP_PATH_PREFIXES_DEFAULT,
  allowedPathnames = ALLOWED_PATHNAMES_DEFAULT,
  internalNavigationKey = INTERNAL_NAVIGATION_KEY_DEFAULT,
}: IntroLoaderProps) {
  const [mounted, setMounted] = useState(false)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    const markInternalNavigation = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

      const target = event.target
      if (!(target instanceof Element)) return

      const anchor = target.closest('a[href]')
      if (!(anchor instanceof HTMLAnchorElement)) return
      if (anchor.target && anchor.target !== '_self') return
      if (anchor.hasAttribute('download')) return

      const href = anchor.getAttribute('href')
      if (!href || href.startsWith('mailto:') || href.startsWith('tel:')) return

      const url = new URL(anchor.href, window.location.href)
      if (url.origin !== window.location.origin) return
      if (normalizePathname(url.pathname) === normalizePathname(window.location.pathname) && url.search === window.location.search) return

      const mark = JSON.stringify({ pathname: url.pathname, ts: Date.now() })
      try {
        sessionStorage.setItem(internalNavigationKey, mark)
        window.setTimeout(() => {
          try {
            if (sessionStorage.getItem(internalNavigationKey) === mark) {
              sessionStorage.removeItem(internalNavigationKey)
            }
          } catch {
            /* sessionStorage có thể bị chặn — bỏ qua */
          }
        }, 4_000)
      } catch {
        /* sessionStorage có thể bị chặn — bỏ qua */
      }
    }

    document.addEventListener('click', markInternalNavigation, true)
    return () => document.removeEventListener('click', markInternalNavigation, true)
  }, [internalNavigationKey])

  useLayoutEffect(() => {
    document.documentElement.classList.remove('gg99-preboot')
    document.getElementById('gg99-preboot')?.remove()
    const pathname = window.location.pathname
    if (skipPathPrefixes.some((prefix) => pathname.startsWith(prefix))) return
    if (!isAllowedPathname(pathname, allowedPathnames)) return
    if (getNavigationType() === 'back_forward') return
    if (consumeInternalNavigationMark(internalNavigationKey, pathname)) return

    if (!oncePerSession) {
      setMounted(true)
      return
    }
    try {
      setMounted(sessionStorage.getItem(storageKey) !== '1')
    } catch {
      setMounted(true)
    }
  }, [allowedPathnames, internalNavigationKey, oncePerSession, skipPathPrefixes, storageKey])

  useEffect(() => {
    if (!mounted) return

    // Khoá scroll trong lúc hiển thị intro
    const prevOverflow = document.body.style.overflow
    const prevScrollRestoration = 'scrollRestoration' in window.history
      ? window.history.scrollRestoration
      : null

    if (prevScrollRestoration) {
      window.history.scrollRestoration = 'manual'
    }

    scrollToPageTop()
    window.requestAnimationFrame(scrollToPageTop)
    document.body.style.overflow = 'hidden'

    const exitTimer = window.setTimeout(() => {
      setExiting(true)
    }, Math.max(0, duration - fadeOut))

    const unmountTimer = window.setTimeout(() => {
      if (oncePerSession) {
        try {
          sessionStorage.setItem(storageKey, '1')
        } catch {
          /* sessionStorage có thể bị chặn (private mode) — bỏ qua */
        }
      }
      scrollToPageTop()
      setMounted(false)
      document.body.style.overflow = prevOverflow
      window.requestAnimationFrame(scrollToPageTop)
      if (prevScrollRestoration) {
        window.history.scrollRestoration = prevScrollRestoration
      }
    }, duration)

    return () => {
      window.clearTimeout(exitTimer)
      window.clearTimeout(unmountTimer)
      document.body.style.overflow = prevOverflow
      if (prevScrollRestoration) {
        window.history.scrollRestoration = prevScrollRestoration
      }
    }
  }, [mounted, duration, fadeOut, oncePerSession, storageKey])

  if (!mounted) return null

  return (
    <div
      className="intro-loader"
      data-state={exiting ? 'done' : 'active'}
      style={
        {
          '--intro-duration': `${duration}ms`,
          '--intro-fadeout': `${fadeOut}ms`,
          '--intro-sweep': `${sweep}ms`,
        } as React.CSSProperties
      }
      aria-hidden="true"
      role="presentation"
    >
      <div className="intro-loader__grid" />
      <div className="intro-loader__sweep" />

      <div className="intro-loader__inner">
        <div className="intro-loader__glow" />

        <div className="intro-loader__logo-wrap">
          {/* Logo tách 2 nửa (clip-path): khi thoát zoom giữa rồi 2 số 9 tách 2 bên.
              2 nửa chồng khít nhau nên lúc đầu trông như 1 logo nguyên vẹn. */}
          <img
            className="intro-loader__logo intro-loader__logo--left"
            src={logoSrc}
            alt="The One - GG99"
            draggable={false}
          />
          <img
            className="intro-loader__logo intro-loader__logo--right"
            src={logoSrc}
            alt=""
            aria-hidden="true"
            draggable={false}
          />

          {/* 1 luồng sáng chạy dọc viền vàng.
              Path liên tục ôm trọn cả 2 ring (giao nhau tại điểm hở trên đỉnh U),
              vẽ full ring trái -> full ring phải nên 1 beam chạy quanh toàn bộ logo.
              viewBox khớp pixel PNG (800x800) để vòng sáng nằm đúng trên band.
              Căn chỉnh hình học: sửa path d (tâm ring trái 271,359 / phải 524,359 / r=215). */}
          <svg
            className="intro-loader__rings"
            viewBox="0 0 800 800"
            aria-hidden="true"
            focusable="false"
          >
            <defs>
              <linearGradient id="ggRingLight" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fff6d0" />
                <stop offset="45%" stopColor="#ffd76b" />
                <stop offset="100%" stopColor="#ff9a2e" />
              </linearGradient>
            </defs>

            <path
              className="intro-loader__ring"
              d="M397.5 185.2
                 A215 215 0 0 1 144.5 532.8
                 A215 215 0 0 1 397.5 185.2
                 A215 215 0 0 1 650.5 532.8
                 A215 215 0 0 1 397.5 185.2"
              pathLength={100}
            />
          </svg>
        </div>

        <div className="intro-loader__wordmark">
          <span className="intro-loader__brand">The One - GG99</span>
        </div>

        <div className="intro-loader__bar" />
      </div>
    </div>
  )
}
