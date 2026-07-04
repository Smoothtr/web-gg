'use client'

import { useRef, useState } from 'react'
import {
  Play,
  Rocket,
  TrendingUp,
  Workflow,
} from 'lucide-react'
import { compactHomeByLang, homeMetaByLang, homeWebPageSchema, localizedPath, organizationSchema, websiteSchema, type BrandLang } from '../brandContent'
import { BrandLayout } from '../components/BrandLayout'
import { openBookingModal } from '../components/openBookingModal'
import { CmsIcon } from '../components/CmsIcon'
import { SeoHead } from '../components/SeoHead'
import { getCmsBlock, splitCmsParagraphs } from '../cms/contentBlocks'
import type { CmsBlockItem, CmsPageContent, CmsSiteSettings } from '../cms/types'
import { getOrderedCaseStudies } from '../data/caseStudyStories'
import type { CaseStudy } from '../data/caseStudies'

const packageIcons = [Rocket, Workflow, TrendingUp]
const primaryBookingCtaLabel = 'Call Your Shot'

function resolvePrimaryBookingCtaLabel(label?: string) {
  const trimmed = label?.trim() ?? ''
  return !trimmed || /book a (free )?consultation/i.test(trimmed) ? primaryBookingCtaLabel : trimmed
}

const storyLogoById: Record<string, string> = {
  phinoi: '/logo-phinoi.png',
  'cota-cuti': '/logo-cotacuti.png',
  inkaholic: '/logo-inkaholic.png',
  'qanda-books': '/logo-qandabook.png',
  curnon: '/logo-curnon.png',
}

const mediaBackdrops = [
  'from-[#120c08] via-[#9a3412] to-[#f08a35]',
  'from-[#16080c] via-[#b91c1c] to-[#db4458]',
  'from-[#120d06] via-[#78350f] to-[#d97706]',
  'from-[#1a0b05] via-[#9a3412] to-[#ea580c]',
  'from-[#160804] via-[#7c2d12] to-[#b45309]',
]

function SectionHeader({ title, intro, dark = false }: { title: string; intro?: string; dark?: boolean }) {
  return (
    <div className="max-w-3xl mb-8">
      <h2 className={`text-[28px] md:text-[36px] font-extrabold leading-tight ${dark ? 'text-white' : 'text-on-surface'}`}>
        {title}
      </h2>
      {intro && <p className={`mt-4 text-[15px] md:text-base leading-relaxed ${dark ? 'text-white/65' : 'text-on-surface-variant'}`}>{intro}</p>}
    </div>
  )
}

function extractIframeSrc(value: string) {
  const match = value.match(/\ssrc=["']([^"']+)["']/i)
  return match?.[1] ?? value
}

function isDirectVideoUrl(value: string) {
  const url = extractIframeSrc(value).trim()
  if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(url)) return true

  try {
    const parsedUrl = new URL(url)
    return parsedUrl.hostname.endsWith('cloudinary.com') && parsedUrl.pathname.includes('/video/upload/')
  } catch {
    return false
  }
}

function isEmbeddableUrl(value: string) {
  const url = value.trim()
  return /youtube\.com|youtu\.be|vimeo\.com|player\.vimeo\.com|tiktok\.com|iframe/i.test(url)
}

function parseYouTubeId(url: URL) {
  if (url.hostname.includes('youtu.be')) return url.pathname.split('/').filter(Boolean)[0]
  if (url.pathname.startsWith('/watch')) return url.searchParams.get('v')
  if (url.pathname.startsWith('/shorts/')) return url.pathname.split('/').filter(Boolean)[1]
  if (url.pathname.startsWith('/embed/')) return url.pathname.split('/').filter(Boolean)[1]
  return url.searchParams.get('v')
}

function withAutoplayParams(rawValue: string, active: boolean) {
  const value = extractIframeSrc(rawValue).trim()
  if (!value) return ''

  try {
    const url = new URL(value)
    const hostname = url.hostname.replace(/^www\./, '')

    if (hostname === 'youtu.be' || hostname.endsWith('youtube.com')) {
      const videoId = parseYouTubeId(url)
      if (videoId) {
        const embed = new URL(`https://www.youtube.com/embed/${videoId}`)
        embed.searchParams.set('autoplay', active ? '1' : '0')
        embed.searchParams.set('mute', '1')
        embed.searchParams.set('playsinline', '1')
        embed.searchParams.set('rel', '0')
        embed.searchParams.set('controls', '0')
        embed.searchParams.set('loop', '1')
        embed.searchParams.set('playlist', videoId)
        return embed.toString()
      }
    }

    if (hostname === 'vimeo.com' || hostname.endsWith('vimeo.com')) {
      const segments = url.pathname.split('/').filter(Boolean)
      const videoId = hostname === 'player.vimeo.com' && segments[0] === 'video' ? segments[1] : segments[0]
      if (videoId) {
        const embed = new URL(`https://player.vimeo.com/video/${videoId}`)
        embed.searchParams.set('autoplay', active ? '1' : '0')
        embed.searchParams.set('muted', '1')
        embed.searchParams.set('loop', '1')
        embed.searchParams.set('title', '0')
        embed.searchParams.set('byline', '0')
        embed.searchParams.set('portrait', '0')
        return embed.toString()
      }
    }

    url.searchParams.set('autoplay', active ? '1' : '0')
    url.searchParams.set('mute', '1')
    url.searchParams.set('muted', '1')
    return url.toString()
  } catch {
    return value
  }
}

function resolveStoryHref(lang: BrandLang, href: string, storyId?: string) {
  const candidate = href.trim()
  if (/^https?:\/\//i.test(candidate) || candidate.startsWith('/')) return candidate
  const targetId = !candidate || candidate === '#' ? storyId : candidate.replace(/^#/, '')
  return `${localizedPath(lang, '/the-one')}${targetId ? `#${encodeURIComponent(targetId)}` : ''}`
}

function normalizeStoryKey(value: unknown) {
  return String(value || '').trim().replace(/^#/, '').toLowerCase()
}

function StoryMediaCard({
  stage,
  story,
  index,
  lang,
}: {
  stage: {
    label: string
    detail: string
    href: string
    imageUrl?: string
    imageAlt: string
    videoUrl?: string
    embedUrl?: string
  }
  story?: CaseStudy
  index: number
  lang: BrandLang
}) {
  const [active, setActive] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const rawVideoUrl = stage.videoUrl?.trim() || stage.embedUrl?.trim() || ''
  const imageLooksLikeVideo = stage.imageUrl ? isEmbeddableUrl(stage.imageUrl) || isDirectVideoUrl(stage.imageUrl) : false
  const mediaUrl = rawVideoUrl || (imageLooksLikeVideo ? stage.imageUrl || '' : '')
  const posterUrl = imageLooksLikeVideo ? '' : stage.imageUrl || (story?.id ? storyLogoById[story.id] : '') || '/logo-gg.png'
  const directVideo = Boolean(mediaUrl && isDirectVideoUrl(mediaUrl))
  const embedSrc = mediaUrl && !directVideo ? withAutoplayParams(mediaUrl, active) : ''
  const storyHref = resolveStoryHref(lang, stage.href, story?.id)
  const backdrop = mediaBackdrops[index % mediaBackdrops.length]
  const posterIsLogo = /(^|\/)logo[-_]/i.test(posterUrl)

  function activatePreview() {
    setActive(true)
    const video = videoRef.current
    if (!video) return
    video.muted = true
    void video.play().catch(() => {
      setActive(false)
    })
  }

  function deactivatePreview() {
    setActive(false)
    const video = videoRef.current
    if (!video) return
    video.pause()
    try {
      video.currentTime = 0
    } catch {
      // Some remote streams do not allow seeking before metadata is ready.
    }
  }

  return (
    <a
      href={storyHref}
      aria-label={`${stage.label}${story ? ` - ${story.brandName}` : ''}`}
      onMouseEnter={activatePreview}
      onMouseLeave={deactivatePreview}
      onFocus={activatePreview}
      onBlur={deactivatePreview}
      className="group block text-left transition duration-300 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
    >
      <div className={`relative aspect-[4/3] overflow-hidden rounded-xl bg-gradient-to-br ${backdrop} shadow-[0_18px_42px_rgba(0,0,0,0.28)] ring-1 ring-white/10 transition duration-300 group-hover:ring-white/35`}>
        {directVideo ? (
          <>
            <video
              ref={videoRef}
              src={mediaUrl}
              poster={posterUrl || undefined}
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
              className="h-full w-full object-cover"
            />
            {posterUrl && (
              <img
                src={posterUrl}
                alt=""
                className={`pointer-events-none absolute inset-0 h-full w-full transition-opacity duration-300 ${
                  active ? 'opacity-0' : 'opacity-100'
                } ${posterIsLogo ? 'object-contain p-8' : 'object-cover'}`}
              />
            )}
          </>
        ) : embedSrc ? (
          <iframe
            key={embedSrc}
            src={embedSrc}
            title={stage.imageAlt}
            loading="lazy"
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
            className="pointer-events-none h-full w-full border-0"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center p-8">
            <img
              src={posterUrl}
              alt=""
              className="max-h-20 max-w-[66%] object-contain opacity-95 drop-shadow-[0_14px_24px_rgba(0,0,0,0.34)] transition duration-300 group-hover:scale-105"
            />
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20" aria-hidden="true" />
        <span className="absolute right-3 top-3 inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-black/55 px-2 text-primary shadow-lg backdrop-blur-md ring-1 ring-white/10">
          <Play size={15} fill="currentColor" strokeWidth={2.2} aria-hidden="true" />
        </span>
      </div>
      <div className="px-1 pt-4">
        <h3 className="text-[20px] font-extrabold leading-tight text-on-surface md:text-[23px]">{stage.label}</h3>
        {stage.detail && <p className="mt-2 max-w-[32rem] text-[13px] font-semibold leading-relaxed text-on-surface-variant md:text-sm">{stage.detail}</p>}
      </div>
    </a>
  )
}

function SystemMap({ labels, lang, items, storyTargets }: { labels: string[]; lang: BrandLang; items?: CmsBlockItem[]; storyTargets: CaseStudy[] }) {
  const detailText = [
    'Brand identity and messaging.',
    'Launch-ready websites and landing pages.',
    'CRM systems and customer journeys.',
    'Automation workflows that reduce manual work.',
    'Performance marketing and growth operations.',
  ]

  const fallbackItems: CmsBlockItem[] = labels.map((label, index) => ({
    title: label,
    body: detailText[index],
    href: '',
    imageUrl: '',
    imageAlt: '',
  }))
  const sourceItems = items?.length ? items : fallbackItems
  const itemsByStoryId = new Map<string, CmsBlockItem>()

  sourceItems.forEach((item) => {
    ;[item.href, item.id].map(normalizeStoryKey).filter(Boolean).forEach((key) => {
      if (!itemsByStoryId.has(key)) itemsByStoryId.set(key, item)
    })
  })

  const orderedItems = storyTargets.length
    ? storyTargets.map((story, index) => itemsByStoryId.get(normalizeStoryKey(story.id)) ?? sourceItems[index] ?? fallbackItems[index])
    : sourceItems

  const stages = orderedItems.map((item, index) => {
    const story = storyTargets[index]
    return {
      label: item.title,
      detail: item.body ?? '',
      href: item.href ?? story?.id ?? '',
      imageUrl: story?.backgroundImageUrl || item.imageUrl,
      imageAlt: item.imageAlt || item.title,
      videoUrl: item.videoUrl || story?.videoUrl,
      embedUrl: item.embedUrl || story?.embedUrl,
      story,
    }
  })

  const topStages = stages.slice(0, 2)
  const bottomStages = stages.slice(2)

  return (
    <div className="space-y-12">
      <div className="grid gap-8 lg:grid-cols-2">
        {topStages.map((stage, index) => (
          <StoryMediaCard key={`${stage.label}-${index}`} stage={stage} story={stage.story} index={index} lang={lang} />
        ))}
      </div>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {bottomStages.map((stage, index) => (
          <StoryMediaCard key={`${stage.label}-${index + 2}`} stage={stage} story={stage.story} index={index + 2} lang={lang} />
        ))}
      </div>
    </div>
  )
}

export default function BrandHomePage({
  lang = 'vi',
  cmsPage,
  theOnePage,
  siteSettings,
}: {
  lang?: BrandLang
  cmsPage?: CmsPageContent | null
  theOnePage?: CmsPageContent | null
  siteSettings?: CmsSiteSettings | null
}) {
  const c = compactHomeByLang[lang]
  const homeMeta = cmsPage?.meta ?? homeMetaByLang[lang]
  const heroBlock = getCmsBlock(cmsPage, 'hero')
  const whatIsBlock = getCmsBlock(cmsPage, 'what-is')
  const packagesBlock = getCmsBlock(cmsPage, 'packages')
  const storiesBlock = getCmsBlock(theOnePage, 'stories')
  const storyTargets = getOrderedCaseStudies(storiesBlock)
  const heroLines = splitCmsParagraphs(heroBlock?.body)
  const heroLineOne = heroBlock?.heading?.trim() || 'The One by gg99'
  const heroLineTwo = heroLines[0] || 'The only one digital agency you needed'
  const isDefaultHeroTitle = heroLineOne.toLowerCase() === 'the one by gg99'
  const packageItems: CmsBlockItem[] = packagesBlock?.items?.length
    ? packagesBlock.items
    : c.packages.map((item, index) => ({
      title: item.name,
      body: `${item.title}\n${item.text}`,
      icon: ['Rocket', 'Workflow', 'TrendingUp'][index],
      href: item.href,
    }))

  return (
    <BrandLayout lang={lang} siteSettings={siteSettings}>
      <SeoHead meta={homeMeta} schema={[organizationSchema, websiteSchema, homeWebPageSchema]} lang={lang} />

      <section className="relative overflow-hidden bg-gradient-to-b from-surface-container-low via-surface to-surface">
        <div className="absolute inset-0 tech-grid opacity-60 pointer-events-none" aria-hidden="true" />
        <div className="noise-overlay" aria-hidden="true" />
        <div className="absolute -top-32 left-1/2 h-[420px] w-[620px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" aria-hidden="true" />
        <div className="absolute -right-24 top-8 h-72 w-72 rounded-full bg-tertiary/15 blur-[100px]" aria-hidden="true" />
        <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-secondary/20 blur-[100px]" aria-hidden="true" />
        <div className="relative mx-auto flex min-h-[440px] max-w-4xl flex-col items-center justify-center px-5 py-16 text-center lg:px-10">
          <h1 className={`gg-hero-title text-[40px] font-extrabold not-italic leading-[1.08] text-on-surface sm:text-[56px] md:text-[68px] ${isDefaultHeroTitle ? 'md:whitespace-nowrap' : ''}`}>
            {heroLineOne}
          </h1>
          <p className="mt-5 max-w-2xl text-base font-medium leading-relaxed text-on-surface-variant sm:text-lg">
            {heroLineTwo}
          </p>
          <button
            type="button"
            onClick={openBookingModal}
            className="btn-shine cta-idle mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-on-primary gg-btn-primary glow-orange hover:opacity-90"
          >
            {resolvePrimaryBookingCtaLabel(heroBlock?.ctaLabel)}
          </button>
        </div>
      </section>

      <section className="bg-surface-container px-5 py-14 md:py-20 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <SystemMap labels={c.whatIs.labels} lang={lang} items={whatIsBlock?.items} storyTargets={storyTargets} />
        </div>
      </section>

      <section id="packages" className="py-10 md:py-14 px-5 lg:px-10">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            title="The One Packages"
            intro={lang === 'vi' ? 'Chọn hệ tăng trưởng phù hợp với giai đoạn của bạn.' : 'Choose the growth system that fits your stage.'}
          />
          {packagesBlock?.body && (
            <div className="mb-6 max-w-3xl whitespace-pre-line text-sm leading-relaxed text-on-surface-variant">
              {packagesBlock.body}
            </div>
          )}
          <div className="grid md:grid-cols-3 gap-5">
            {packageItems.map((item, index) => {
              const lines = String(item.body || '').split(/\n+/).map((line) => line.trim()).filter(Boolean)
              const subtitle = lines[0] || ''
              const hasPrice = /^price:/i.test(lines[lines.length - 1] || '')
              const price = hasPrice ? lines[lines.length - 1].replace(/^price:\s*/i, '') : ''
              const bullets = lines.slice(1, hasPrice ? -1 : undefined)
              return (
                <div key={`${item.title}-${index}`} className="glass-card card-hover flex flex-col rounded-2xl p-6">
                  <span className="icon-chip h-12 w-12 mb-5">
                    <CmsIcon name={item.icon} fallback={packageIcons[index]} size={22} />
                  </span>
                  <h3 className="text-xl font-extrabold text-on-surface">{item.title}</h3>
                  {subtitle && <p className="mt-3 text-sm font-semibold text-on-surface-variant leading-relaxed">{subtitle}</p>}
                  {bullets.length > 0 && (
                    <ul className="mt-4 space-y-2 text-sm leading-relaxed text-on-surface-variant">
                      {bullets.map((line, lineIndex) => (
                        <li key={lineIndex} className="flex gap-2">
                          <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {price && <p className="mt-5 text-lg font-extrabold text-primary">{price}</p>}
                  <button
                    type="button"
                    onClick={openBookingModal}
                    className="btn-shine cta-idle mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-on-primary gg-btn-primary glow-orange hover:opacity-90"
                  >
                    Choose This Package
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-10 md:py-12 px-5 lg:px-10">
        <div className="max-w-6xl mx-auto bg-primary rounded-2xl p-8 md:p-10 text-center">
          <Rocket size={30} className="mx-auto mb-4 text-white" />
          <h2 className="text-[26px] md:text-[34px] font-extrabold text-white">So, ready to be our plus one?</h2>
          <button
            type="button"
            onClick={openBookingModal}
            className="mt-6 inline-flex px-6 py-3 rounded-xl bg-white text-primary font-bold hover:bg-surface-container-low transition-colors"
          >
            {primaryBookingCtaLabel}
          </button>
        </div>
      </section>
    </BrandLayout>
  )
}
