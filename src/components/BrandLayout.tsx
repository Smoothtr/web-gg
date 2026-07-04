import { useEffect, useState, type ReactNode } from 'react'
import { BookingModal } from './BookingModal'
import { ThemeToggle } from './ThemeToggle'
import { BrandFooter } from './BrandFooter'
import { localizedPath, type BrandLang } from '../brandContent'
import { getLocalizedSiteSettings } from '../cms/siteSettings'
import type { CmsSiteSettings } from '../cms/types'

export function BrandLayout({ children, lang = 'en', siteSettings }: { children: ReactNode; lang?: BrandLang; siteSettings?: CmsSiteSettings | null }) {
  const [bookingOpen, setBookingOpen] = useState(false)
  const [showTop, setShowTop] = useState(false)
  const localizedSettings = getLocalizedSiteSettings(siteSettings, lang)
  const header = localizedSettings.header
  const navItems = header.navLinks.filter((item) => item.label.trim() && item.href.trim())
  const homeHref = localizedPath(lang, '/')
  const headerCtaLabel = /book a (free )?consultation|đặt lịch tư vấn/i.test(header.ctaLabel)
    ? 'Call Your Shot'
    : header.ctaLabel.trim() || 'Call Your Shot'
  const showHeaderCopy = Boolean(header.brandName.trim() || header.tagline.trim())

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const openBooking = () => setBookingOpen(true)
    window.addEventListener('gg99:open-booking', openBooking)
    return () => window.removeEventListener('gg99:open-booking', openBooking)
  }, [])

  return (
    <>
      <BookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} lang={lang === 'vi' ? 'vi' : 'en'} />

      <header className="fixed w-full top-0 z-50 bg-surface/92 border-b border-outline-variant/30 shadow-sm">
        <nav className="flex items-center gap-8 px-5 lg:px-10 max-w-6xl mx-auto h-14">
          <a href={homeHref} className="flex items-center gap-2.5">
            {header.logoSrc && <img src={header.logoSrc} alt={header.logoAlt || header.brandName} className="h-16 w-auto" />}
            {showHeaderCopy && (
              <div className="hidden sm:block">
                {header.brandName && <div className="font-extrabold text-base text-primary leading-tight">{header.brandName}</div>}
                {header.tagline && (
                  <div className="text-[10px] text-on-surface-variant tracking-wider uppercase opacity-70">
                    {header.tagline}
                  </div>
                )}
              </div>
            )}
          </a>

          <div className="hidden lg:flex items-center gap-7">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={localizedPath(lang, item.href)}
                className="text-on-surface-variant text-sm font-medium hover:text-primary transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <ThemeToggle lang={lang} />
            <button
              onClick={() => setBookingOpen(true)}
              className="btn-shine bg-primary text-on-primary gg-btn-primary text-xs px-3 py-2 sm:text-sm sm:px-4 rounded-lg font-bold glow-orange hover:opacity-90 whitespace-nowrap"
            >
              {headerCtaLabel}
            </button>
          </div>
        </nav>
      </header>

      <main className="pt-14 mesh">{children}</main>
      <BrandFooter lang={lang} siteSettings={siteSettings} />

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label={lang === 'vi' ? 'Lên đầu trang' : 'Back to top'}
        className={[
          'fixed bottom-6 right-5 z-50 w-11 h-11 rounded-full bg-primary text-on-primary gg-btn-primary shadow-lg flex items-center justify-center transition-all duration-300',
          showTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none',
        ].join(' ')}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>
    </>
  )
}
