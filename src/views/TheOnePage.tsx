'use client'

import { useEffect } from 'react'
import { compactTheOneByLang, organizationSchema, websiteSchema, type BrandLang } from '../brandContent'
import { BrandLayout } from '../components/BrandLayout'
import { SeoHead } from '../components/SeoHead'
import { getCmsBlock, getCmsBlocks, splitCmsParagraphs } from '../cms/contentBlocks'
import type { CmsPageContent, CmsSiteSettings } from '../cms/types'
import { getOrderedCaseStudies } from '../data/caseStudyStories'
import type { CaseStudy } from '../data/caseStudies'

type SocialKey = 'instagram' | 'facebook' | 'tiktok'

const socialPlatforms: Array<{ key: SocialKey; label: string }> = [
  { key: 'instagram', label: 'Instagram' },
  { key: 'facebook', label: 'Facebook' },
  { key: 'tiktok', label: 'TikTok' },
]

const metricSlots = Array.from({ length: 9 }, (_, index) => index + 1)

function SocialGlyph({ type }: { type: SocialKey }) {
  if (type === 'instagram') {
    return (
      <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.15" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    )
  }

  if (type === 'facebook') {
    return (
      <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true">
        <path d="M14.2 8.2V6.7c0-.8.5-1 1.1-1h1.4V3.2c-.7-.1-1.5-.2-2.3-.2-2.4 0-4 1.5-4 4.1v1.1H7.8V11h2.6v10h3.1V11h2.6l.4-2.8h-3.0Z" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true">
      <path d="M15.1 3c.3 2.3 1.6 3.8 3.9 4v3.1a7.1 7.1 0 0 1-3.8-1.1v6.4c0 3.3-2.2 5.6-5.4 5.6A5.1 5.1 0 0 1 4.5 16c0-3.4 2.9-5.8 6.5-5.2v3.2c-1.7-.5-3.2.3-3.2 1.9 0 1.2.9 2.1 2.1 2.1 1.4 0 2.2-.8 2.2-2.4V3h3Z" />
    </svg>
  )
}

function BrandSocialLinks({ story }: { story: CaseStudy }) {
  return (
    <div className="flex flex-wrap gap-2" aria-label={`${story.brandName} social links`}>
      {socialPlatforms.map((platform) => {
        const href = story.socialLinks?.[platform.key]?.trim()
        const className = 'inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary/35 bg-primary/10 text-primary shadow-sm transition-colors hover:border-primary hover:bg-primary hover:text-on-primary'

        return href ? (
          <a key={platform.key} href={href} target="_blank" rel="noreferrer" aria-label={`${story.brandName} ${platform.label}`} className={className}>
            <SocialGlyph type={platform.key} />
          </a>
        ) : (
          <span key={platform.key} aria-label={`${platform.label} link not set`} className={`${className} cursor-not-allowed opacity-80`}>
            <SocialGlyph type={platform.key} />
          </span>
        )
      })}
    </div>
  )
}

function ClientStoryBanner({
  heading,
  body,
  imageUrl,
  imageAlt,
  ctaLabel,
  ctaHref,
  metrics,
  reversed,
}: {
  heading: string
  body: string
  imageUrl?: string
  imageAlt?: string
  ctaLabel?: string
  ctaHref?: string
  metrics: Array<{ label: string; value: string }>
  reversed: boolean
}) {
  return (
    <section className="grid overflow-hidden rounded-[28px] border border-outline-variant/40 bg-surface shadow-sm lg:grid-cols-2">
      <div
        className={`relative min-h-[240px] lg:min-h-[380px] ${reversed ? 'lg:order-2' : ''}`}
        style={imageUrl ? { backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
      >
        {!imageUrl && (
          <div className="absolute inset-0 flex items-center justify-center bg-inverse-surface">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/25 blur-3xl" aria-hidden="true" />
            <div className="absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
            <p className="relative text-xs font-extrabold uppercase tracking-[0.2em] text-white/60">Case study coming soon</p>
          </div>
        )}
        {imageUrl && <span className="sr-only">{imageAlt || heading}</span>}
      </div>
      <div className="flex flex-col justify-center gap-4 p-6 md:p-10">
        <span className="badge w-fit">Client story</span>
        <h2 className="text-2xl font-extrabold text-on-surface md:text-3xl">{heading}</h2>
        {body && <p className="text-sm leading-relaxed text-on-surface-variant md:text-base">{body}</p>}
        {metrics.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {metrics.map((metric) => (
              <div key={metric.label} className="rounded-xl bg-surface-container-low px-4 py-3">
                <p className="text-lg font-extrabold text-primary">{metric.value}</p>
                <p className="text-xs font-bold text-on-surface-variant">{metric.label}</p>
              </div>
            ))}
          </div>
        )}
        {ctaHref && (
          <a
            href={ctaHref}
            target={ctaHref.startsWith('http') ? '_blank' : undefined}
            rel={ctaHref.startsWith('http') ? 'noreferrer' : undefined}
            className="mt-2 inline-flex w-fit items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-on-primary gg-btn-primary glow-orange hover:opacity-90"
          >
            {ctaLabel || 'View case study'}
          </a>
        )}
      </div>
    </section>
  )
}

function StoryMetricTile({
  metric,
}: {
  metric?: { value: string; label: string }
}) {
  const value = metric?.value?.trim().replace(/\s+/g, ' ').replace(/\s*-\s*>\s*/g, '->')
  const label = metric?.label?.trim()

  return (
    <div className="flex aspect-square min-h-[118px] flex-col items-center justify-center rounded-2xl border border-outline-variant/45 bg-surface/85 p-4 text-center shadow-sm">
      <div className="w-full text-center">
        <p className="whitespace-nowrap text-[28px] font-extrabold leading-none text-primary md:text-[36px] xl:text-[40px]">
          {value || ''}
        </p>
        <p className="mt-3 text-[11px] font-extrabold uppercase leading-snug tracking-[0.06em] text-on-surface-variant">
          {label || ''}
        </p>
      </div>
    </div>
  )
}

function CaseStudyStoryZone({ story, index }: { story: CaseStudy; index: number }) {
  const metrics = metricSlots.map((slot) => story.keyMetrics[slot] ?? { value: '', label: '' })

  return (
    <article
      id={story.id}
      className="relative isolate scroll-mt-24 overflow-hidden rounded-[28px] border border-outline-variant/50 bg-surface/95 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg"
    >
      {story.backgroundImageUrl && (
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-[0.32]"
            style={{ backgroundImage: `url(${story.backgroundImageUrl})` }}
          />
          <div className="absolute inset-0 bg-surface/68" />
        </div>
      )}
      <div className="relative z-10 grid lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <div className="flex flex-col gap-6 border-b border-outline-variant/40 bg-surface-container-low/45 p-5 md:p-8 lg:border-b-0 lg:border-r lg:p-9">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-outline-variant/50 bg-surface px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.08em] text-primary">
              Story {String(index + 1).padStart(2, '0')}
            </span>
            <span className="text-xs font-bold text-on-surface-variant/70">{story.period}</span>
          </div>

          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-on-surface-variant">{story.brandName}</p>
            <h2 className="mt-3 text-2xl font-extrabold leading-tight text-on-surface md:text-3xl">{story.headline}</h2>
            <p className="mt-3 text-sm font-bold text-primary">{story.category}</p>
          </div>

          <BrandSocialLinks story={story} />

          <p className="max-w-[54ch] text-sm leading-relaxed text-on-surface-variant md:text-base">{story.shortDescription}</p>

          <div className="mt-auto flex flex-wrap content-start gap-2 border-t border-outline-variant/35 pt-5">
            {story.services.map((service) => (
              <span
                key={`${story.id}-${service}`}
                className="rounded-full border border-outline-variant/65 bg-surface/80 px-3 py-1.5 text-[11px] font-bold text-on-surface-variant"
              >
                {service}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 p-5 md:grid-cols-3 md:p-8 lg:p-9">
          {metrics.map((metric, metricIndex) => (
            <StoryMetricTile key={`${story.id}-metric-${metricIndex + 1}`} metric={metric} />
          ))}
        </div>
      </div>
    </article>
  )
}

function CaseStudyStoriesStack({ stories }: { stories: CaseStudy[] }) {
  return (
    <div className="space-y-5 md:space-y-6">
      {stories.map((story, index) => (
        <CaseStudyStoryZone key={story.id} story={story} index={index} />
      ))}
    </div>
  )
}

export default function TheOnePage({ lang = 'vi', cmsPage, siteSettings }: { lang?: BrandLang; cmsPage?: CmsPageContent | null; siteSettings?: CmsSiteSettings | null }) {
  const c = compactTheOneByLang[lang]
  const heroBlock = getCmsBlock(cmsPage, 'hero')
  const heroParagraphs = splitCmsParagraphs(heroBlock?.body)
  const storiesBlock = getCmsBlock(cmsPage, 'stories')
  const orderedCaseStudies = getOrderedCaseStudies(storiesBlock)
  const clientBlocks = getCmsBlocks(cmsPage, ['hero', 'stories'])

  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash
      if (!hash) return

      const id = decodeURIComponent(hash.slice(1))
      const timers: number[] = []
      const tryScroll = (attempts = 0) => {
        const target = document.getElementById(id)
        if (target) {
          target.scrollIntoView({ block: 'start', behavior: attempts === 0 ? 'auto' : 'smooth' })
          if (attempts === 0) {
            ;[120, 360, 900, 1800, 3400, 6200].forEach((delay, index) => {
              timers.push(window.setTimeout(() => tryScroll(index + 1), delay))
            })
          }
        } else if (attempts < 10) {
          timers.push(window.setTimeout(() => tryScroll(attempts + 1), 80))
        }
      }

      tryScroll()
      return timers
    }

    let activeTimers = scrollToHash() ?? []
    const handleHashChange = () => {
      activeTimers.forEach((timer) => window.clearTimeout(timer))
      activeTimers = scrollToHash() ?? []
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => {
      activeTimers.forEach((timer) => window.clearTimeout(timer))
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  return (
    <BrandLayout lang={lang} siteSettings={siteSettings}>
      <SeoHead meta={cmsPage?.meta ?? c.meta} schema={[organizationSchema, websiteSchema]} lang={lang} />

      <article>
        <section className="relative overflow-hidden px-5 py-14 md:py-20 lg:px-10">
          <div className="absolute inset-0 tech-grid opacity-80 pointer-events-none" aria-hidden="true" />
          <div className="noise-overlay" aria-hidden="true" />
          <div className="relative mx-auto max-w-3xl text-center">
            <h1 className="text-[40px] font-extrabold leading-[1.06] text-on-surface sm:text-[56px] md:text-[64px]">
              {heroBlock?.heading ?? c.hero.h1}
            </h1>
            {heroParagraphs.length ? (
              <div className="mt-6 grid gap-3 text-lg leading-relaxed text-on-surface-variant">
                {heroParagraphs.map((paragraph, index) => (
                  <p key={`${paragraph}-${index}`}>{paragraph}</p>
                ))}
              </div>
            ) : (
              <p className="mt-6 text-lg leading-relaxed text-on-surface-variant">{c.hero.intro}</p>
            )}
          </div>
        </section>

        <section className="px-5 pb-16 md:pb-24 lg:px-10">
          <div className="mx-auto max-w-6xl space-y-6">
            {clientBlocks.length > 0 ? (
              clientBlocks.map((block, index) => (
                <ClientStoryBanner
                  key={block.id}
                  heading={block.heading}
                  body={block.body}
                  imageUrl={block.imageUrl}
                  imageAlt={block.imageAlt}
                  ctaLabel={block.ctaLabel}
                  ctaHref={block.ctaHref}
                  reversed={index % 2 === 1}
                  metrics={(block.items ?? [])
                    .filter((item) => item.title || item.body)
                    .map((item) => ({ label: item.title, value: item.body || '' }))}
                />
              ))
            ) : null}
            <CaseStudyStoriesStack stories={orderedCaseStudies} />

          </div>
        </section>
      </article>
    </BrandLayout>
  )
}
