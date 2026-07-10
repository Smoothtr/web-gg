'use client'

import { useState } from 'react'
import { BrandFooter } from '../components/BrandFooter'
import { BookingModal } from '../components/BookingModal'
import { getLocalizedSiteSettings } from '../cms/siteSettings'
import type { CmsSiteSettings } from '../cms/types'

interface Section {
  title: string
  content: React.ReactNode
}

interface LegalPageProps {
  title: string
  sections: Section[]
  siteSettings?: CmsSiteSettings | null
}

function LegalPage({ title, sections, siteSettings }: LegalPageProps) {
  const [bookingOpen, setBookingOpen] = useState(false)
  const localizedSettings = getLocalizedSiteSettings(siteSettings, 'en')
  const { header } = localizedSettings
  const showHeaderCopy = Boolean(header.brandName.trim() || header.tagline.trim())

  return (
    <>
      <BookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} lang="en" copy={localizedSettings.booking} />
      {/* Navbar minimal */}
      <header className="fixed w-full top-0 z-50 bg-surface/92 border-b border-outline-variant/30 shadow-sm">
        <nav className="flex justify-between items-center px-5 lg:px-10 max-w-6xl mx-auto h-14">
          <a href="/" className="flex items-center gap-2.5">
            {header.logoSrc && <img src={header.logoSrc} alt={header.logoAlt || header.brandName} className="h-16 w-auto" />}
            {showHeaderCopy && (
              <div className="hidden sm:block">
                {header.brandName && <div className="font-extrabold text-base text-primary leading-tight">{header.brandName}</div>}
                {header.tagline && <div className="text-[10px] text-on-surface/50 tracking-wider uppercase">{header.tagline}</div>}
              </div>
            )}
          </a>
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="/"
              className="text-sm font-semibold text-primary hover:opacity-70 transition-opacity flex items-center gap-1"
            >
              ← Home
            </a>
          </div>
        </nav>
      </header>

      <main className="pt-14 bg-gradient-to-b from-[#fff5f7] via-surface to-surface-container-low">
        {/* Hero */}
        <div className="max-w-3xl mx-auto px-5 lg:px-10 pt-12 pb-6">
          <div className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest mb-4 bg-secondary-container/20 text-secondary">
            The One — GG99 · gg99.vn
          </div>
          <h1 className="bg-gradient-to-r from-primary via-tertiary to-secondary bg-clip-text text-[26px] font-extrabold leading-tight text-transparent md:text-[34px]">{title}</h1>
          <p className="text-sm text-on-surface/50 mt-2">
            Last updated: July 2026 · Golden Generation Vietnam One Member Company Limited
          </p>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-5 lg:px-10 pb-16">
          <div className="bg-surface/70 backdrop-blur-sm rounded-2xl border border-outline-variant/40 p-6 md:p-10 space-y-8">
            {sections.map((s, i) => (
              <div key={i}>
                <h2 className="text-base font-bold text-primary mb-3 flex items-start gap-2">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-secondary-container/20 text-secondary text-[11px] font-extrabold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  {s.title}
                </h2>
                <div className="text-sm text-on-surface/75 leading-relaxed pl-8 space-y-2">
                  {s.content}
                </div>
              </div>
            ))}
          </div>

          {/* Company info */}
          <div className="mt-6 px-6 py-4 rounded-xl border border-outline-variant/40 bg-surface/80">
            <p className="text-[11px] font-bold text-on-surface/70 uppercase tracking-wide mb-1">
              Golden Generation Vietnam One Member Company Limited
            </p>
            <p className="text-xs text-on-surface/55 leading-relaxed">
              Tax ID: 0111274327
            </p>
            <p className="text-xs text-on-surface/55 leading-relaxed">
              Registered address: No. 4/146 Pham Ngoc Thach Street, Dong Da Ward, Hanoi, Vietnam
            </p>
            <p className="text-xs text-on-surface/55 mt-0.5">Email: smooth@gg99.vn</p>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 mt-8">
            <a
              href="/"
              className="px-6 py-2.5 rounded-xl border-2 border-primary/20 text-sm font-semibold text-primary hover:bg-surface-container-low transition-colors"
            >
              ← Back to homepage
            </a>
            <button
              type="button"
              onClick={() => setBookingOpen(true)}
              className="px-6 py-2.5 rounded-xl bg-primary text-on-primary gg-btn-primary text-sm font-bold hover:opacity-90 transition-opacity"
            >
              Contact us →
            </button>
          </div>
        </div>
      </main>

      <BrandFooter siteSettings={siteSettings} />
    </>
  )
}

/* ─── Privacy Policy ────────────────────────────────── */
export function PrivacyPage({ siteSettings }: { siteSettings?: CmsSiteSettings | null }) {
  return (
    <LegalPage
      siteSettings={siteSettings}
      title="Privacy Policy"
      sections={[
        {
          title: 'Information we collect',
          content: (
            <>
              <p>When you contact us, request a consultation, or book a call through this website, we may collect:</p>
              <ul className="list-disc pl-4 space-y-1 mt-2">
                <li>Your name, phone number, and email address</li>
                <li>Your company or brand name</li>
                <li>Your consultation needs and preferred booking time</li>
                <li>Other information you choose to provide</li>
              </ul>
              <p className="mt-2">We may also record limited technical and acquisition data, including browser or device information, access time, campaign parameters, advertising click identifiers, the landing page, and a referrer with its query string and fragment removed.</p>
            </>
          ),
        },
        {
          title: 'How we use information',
          content: (
            <ul className="list-disc pl-4 space-y-1">
              <li>Respond to consultation and support requests</li>
              <li>Confirm and manage consultation bookings</li>
              <li>Send quotations, service proposals, or relevant materials</li>
              <li>Measure campaign effectiveness and improve the website and our services</li>
              <li>Handle customer requests or complaints</li>
              <li>Meet legal obligations or respond to a lawful request from a competent authority</li>
            </ul>
          ),
        },
        {
          title: 'Campaign attribution and analytics',
          content: (
            <>
              <p>The website keeps first-touch campaign attribution in browser session storage and may submit it with a consultation request. Booking lifecycle events can be placed in a privacy-safe data layer for analytics.</p>
              <p className="mt-2">Contact form values and advertising click identifiers are not included in those lifecycle events. If an analytics or tag-management service is enabled, that provider may process limited technical data under its own terms and privacy policy.</p>
            </>
          ),
        },
        {
          title: 'Storage and security',
          content: (
            <>
              <p>We retain information only for as long as reasonably necessary for consultation, customer care, contract management, security, or applicable legal requirements.</p>
              <p className="mt-2">The One — GG99 applies reasonable safeguards to protect personal information. No method of transmitting or storing data over the Internet can be guaranteed to be completely secure.</p>
            </>
          ),
        },
        {
          title: 'How information is shared',
          content: (
            <>
              <p>We do not sell or trade your personal information.</p>
              <p className="mt-2">Information may be shared only as needed with authorized team members and service providers supporting hosting, booking, email, CRM, analytics, or service delivery, or when disclosure is legally required.</p>
            </>
          ),
        },
        {
          title: 'Your choices and rights',
          content: (
            <>
              <p>You may ask us to review, correct, update, or delete personal information you have provided, unless we must retain it for a lawful reason.</p>
              <p className="mt-2">Send privacy requests to <a href="mailto:smooth@gg99.vn" className="text-primary underline underline-offset-2">smooth@gg99.vn</a>.</p>
            </>
          ),
        },
        {
          title: 'Cookies, session storage, and third-party links',
          content: (
            <>
              <p>The website may use session storage, cookies, or analytics tools to operate the site, remember campaign attribution during a session, and measure performance.</p>
              <p className="mt-2">The website may link to services such as Google Calendar, Zalo, or social networks. Their own privacy policies apply when you visit those services.</p>
            </>
          ),
        },
        {
          title: 'Policy updates',
          content: (
            <p>We may update this Privacy Policy when necessary. The revised version will be published on this website and will apply from its stated update date.</p>
          ),
        },
      ]}
    />
  )
}

/* ─── Terms of Service ──────────────────────────────── */
export function TermsPage({ siteSettings }: { siteSettings?: CmsSiteSettings | null }) {
  return (
    <LegalPage
      siteSettings={siteSettings}
      title="Terms of Use"
      sections={[
        {
          title: 'Website purpose',
          content: (
            <>
              <p>This website introduces The One — GG99 and services including:</p>
              <ul className="list-disc pl-4 space-y-1 mt-2">
                <li>Ecommerce Operation</li>
                <li>Social Growth</li>
                <li>Business Operation</li>
                <li>Website & Digital System</li>
                <li>Consulting, operations, marketing, and other business growth solutions</li>
              </ul>
              <p className="mt-2">Website information is for general introduction and reference. Detailed scope, fees, deliverables, and responsibilities are established only in a separate quotation, agreement, or contract.</p>
            </>
          ),
        },
        {
          title: 'Consultation requests',
          content: (
            <>
              <p>You may submit contact information or request a consultation through the website.</p>
              <p className="mt-2">Submitting a form or choosing a time does not create a contract. A service relationship begins only after separate confirmation and an agreed quotation, agreement, or contract.</p>
            </>
          ),
        },
        {
          title: 'Your responsibilities',
          content: (
            <ul className="list-disc pl-4 space-y-1">
              <li>Provide accurate information when contacting us</li>
              <li>Do not use the website for fraud, disruption, spam, or unlawful activity</li>
              <li>Do not copy or misuse website content, images, or interface</li>
              <li>Do not ask The One — GG99 to perform work that violates the law or third-party rights</li>
            </ul>
          ),
        },
        {
          title: 'Service fees and payment',
          content: (
            <p>Any pricing shown on the website is indicative only. Final pricing depends on scope, timing, and specific requirements. Payment methods, milestones, and financial terms are defined in a separate quotation or contract.</p>
          ),
        },
        {
          title: 'Cancellation, refunds, and service changes',
          content: (
            <>
              <p>Because consulting, operations, design, and marketing services are tailored to each client, cancellation and refund terms are governed by the applicable quotation or contract.</p>
              <p className="mt-2">Work outside the agreed scope requires written confirmation of the additional scope and terms before it begins.</p>
            </>
          ),
        },
        {
          title: 'Intellectual property',
          content: (
            <>
              <p>Website text, images, logos, interface, and design are owned by or lawfully licensed to The One — GG99.</p>
              <p className="mt-2">You may not copy, modify, or reuse this material for commercial purposes without prior written permission.</p>
            </>
          ),
        },
        {
          title: 'Disclaimer and limitation',
          content: (
            <p>The One — GG99 takes reasonable care to keep website information accurate, but does not guarantee that all content will always be complete, current, or error-free. To the extent permitted by applicable law, we are not responsible for losses caused by misuse of website information, technical faults, service interruption, or content on linked third-party websites.</p>
          ),
        },
        {
          title: 'Questions, complaints, and contact',
          content: (
            <>
              <p>Send questions, requests, or complaints to <a href="mailto:smooth@gg99.vn" className="text-primary underline underline-offset-2">smooth@gg99.vn</a>.</p>
              <p className="mt-2">The One — GG99 will review and respond within a reasonable time. Both parties should first try to resolve any dispute through good-faith discussion.</p>
            </>
          ),
        },
        {
          title: 'Changes to these terms',
          content: (
            <p>We may update these Terms of Use when necessary. The revised version will be published on this website and will apply from its stated update date.</p>
          ),
        },
      ]}
    />
  )
}
