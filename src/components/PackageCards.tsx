'use client'

import { useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type MouseEvent } from 'react'
import { ArrowRight, Megaphone, Rocket, Workflow } from 'lucide-react'
import type { BrandLang } from '../brandContent'
import type { CmsBlockItem } from '../cms/types'
import { CmsIcon } from './CmsIcon'
import { openBookingModal } from './openBookingModal'

const packageIcons = [Rocket, Workflow, Megaphone]
const fallbackCaseStudyLinks: Record<string, string> = {
  'the-one-start': '/the-one#cota-cuti',
  'the-one-system': '/the-one#curnon',
  'the-one-scale': '/the-one#inkaholic',
}

function resolvePackageId(item: CmsBlockItem) {
  const hash = item.href?.match(/#([^#?]+)/)?.[1]
  if (hash) return decodeURIComponent(hash)
  return item.title
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function parsePackageBody(body: string | undefined) {
  const lines = String(body || '').split(/\n+/).map((line) => line.trim()).filter(Boolean)
  const subtitle = lines[0] || ''
  const hasPrice = /^price:/i.test(lines[lines.length - 1] || '')
  const price = hasPrice ? lines[lines.length - 1].replace(/^price:\s*/i, '') : ''
  const bullets = lines.slice(1, hasPrice ? -1 : undefined)
  return { subtitle, price, bullets }
}

function packageDeliverableTitle(line: string) {
  if (/content strategy|content calendar|production/i.test(line)) return 'Content engine'
  if (/booking|sales website|landing pages|website/i.test(line)) return 'Website system'
  if (/performance marketing|ad spend|media planning/i.test(line)) return 'Performance media'
  if (/everything included/i.test(line)) return 'System base'
  if (/on-site events|event execution/i.test(line)) return 'Event ops'
  if (/campaign strategy|creative direction/i.test(line)) return 'Campaign growth'
  return 'Growth task'
}

type NormalizedPackageDeliverable =
  | { type: 'metric'; value: string; body: string }
  | { type: 'task'; title: string; body: string }

function normalizePackageDeliverables(lines: string[]): NormalizedPackageDeliverable[] {
  return lines.map((line) => {
    const metricMatch = line.match(/^(\d+\s+content units\/month)(?:\s+\((.+)\))?$/i)
    if (metricMatch) {
      return {
        type: 'metric' as const,
        value: metricMatch[1],
        body: metricMatch[2] ?? '',
      }
    }
    return {
      type: 'task' as const,
      title: packageDeliverableTitle(line),
      body: line.replace(/\.$/, ''),
    }
  })
}

function isMetricDeliverable(deliverable: NormalizedPackageDeliverable): deliverable is Extract<NormalizedPackageDeliverable, { type: 'metric' }> {
  return deliverable.type === 'metric'
}

function isTaskDeliverable(deliverable: NormalizedPackageDeliverable): deliverable is Extract<NormalizedPackageDeliverable, { type: 'task' }> {
  return deliverable.type === 'task'
}

function isSystemPackage(item: CmsBlockItem, index: number) {
  return index === 1 || /system/i.test(item.title)
}

function PriceText({ price }: { price: string }) {
  const ref = useRef<HTMLSpanElement | null>(null)
  const match = price.match(/^([^0-9]*)([\d,.]+)(.*)$/)
  const prefix = match?.[1] ?? ''
  const suffix = match?.[3] ?? ''
  const target = match ? Number.parseFloat(match[2].replace(/,/g, '')) : Number.NaN
  const [value, setValue] = useState(match && Number.isFinite(target) ? `${prefix}0${suffix}` : price)

  useEffect(() => {
    if (!match || !Number.isFinite(target)) {
      setValue(price)
      return
    }

    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduced || !('IntersectionObserver' in window)) {
      setValue(`${prefix}${new Intl.NumberFormat('en-US').format(target)}${suffix}`)
      return
    }

    const el = ref.current
    if (!el) return
    let raf = 0
    let started = false
    const formatter = new Intl.NumberFormat('en-US')

    const run = () => {
      const start = performance.now()
      const tick = (now: number) => {
        const progress = Math.min(1, (now - start) / 1050)
        const eased = 1 - Math.pow(1 - progress, 3)
        setValue(`${prefix}${formatter.format(Math.round(target * eased))}${suffix}`)
        if (progress < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          started = true
          observer.disconnect()
          run()
        }
      },
      { threshold: 0.35 },
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [prefix, price, suffix, target])

  return <span ref={ref}>{value}</span>
}

export function PackageCards({
  items,
  lang = 'vi',
  className = '',
}: {
  items: CmsBlockItem[]
  lang?: BrandLang
  className?: string
}) {
  const cardIds = useMemo(() => items.map(resolvePackageId), [items])
  const systemIndex = Math.max(0, items.findIndex(isSystemPackage))
  const [selectedIndex, setSelectedIndex] = useState(systemIndex)
  const [highlightedId, setHighlightedId] = useState('')
  const chooseLabel = lang === 'vi' ? 'Choose this package' : 'Choose this package'
  const caseStudyLabel = lang === 'vi' ? 'See case studies' : 'See case studies'

  useEffect(() => {
    setSelectedIndex(systemIndex)
  }, [systemIndex])

  useEffect(() => {
    const syncHash = () => {
      const hash = decodeURIComponent(window.location.hash.replace(/^#/, ''))
      if (!hash) return
      const nextIndex = cardIds.indexOf(hash)
      if (nextIndex < 0) return
      setSelectedIndex(nextIndex)
      setHighlightedId(hash)
      window.setTimeout(() => setHighlightedId(''), 800)
    }

    syncHash()
    window.addEventListener('hashchange', syncHash)
    return () => window.removeEventListener('hashchange', syncHash)
  }, [cardIds])

  function handleCardClick(event: MouseEvent<HTMLElement>, index: number) {
    const target = event.target as HTMLElement
    if (target.closest('a,button')) return
    setSelectedIndex(index)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLElement>, index: number) {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    setSelectedIndex(index)
  }

  return (
    <div className={`grid gap-5 md:grid-cols-3 ${className}`}>
      {items.map((item, index) => {
        const { subtitle, price, bullets } = parsePackageBody(item.body)
        const deliverables = normalizePackageDeliverables(bullets)
        const metricDeliverables = deliverables.filter(isMetricDeliverable)
        const taskDeliverables = deliverables.filter(isTaskDeliverable)
        const selected = selectedIndex === index
        const system = isSystemPackage(item, index)
        const id = cardIds[index]
        const highlight = highlightedId === id
        const Icon = packageIcons[index] ?? Rocket
        const caseStudyLink = item.caseStudyLink?.trim() || fallbackCaseStudyLinks[id] || ''

        return (
          <div
            key={`${item.title}-${index}`}
            data-reveal="scale"
            style={{ '--ri': index } as CSSProperties}
          >
          <article
            id={id}
            tabIndex={0}
            role="button"
            aria-pressed={selected}
            onClick={(event) => handleCardClick(event, index)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={[
              'home-package-card package-card glass-card card-hover relative flex scroll-mt-32 flex-col overflow-hidden rounded-2xl p-6 outline-none transition duration-300 focus-visible:ring-2 focus-visible:ring-primary',
              selected ? 'is-selected' : '',
              system ? 'home-package-featured md:-translate-y-2' : '',
              highlight ? 'is-anchor-highlighted' : '',
            ].join(' ')}
          >
            {system && (
              <span className="absolute right-4 top-4 rounded-full bg-gradient-to-r from-primary via-tertiary to-secondary px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.08em] text-white shadow-lg">
                {item.label || 'Most Popular'}
              </span>
            )}
            <span className="icon-chip mb-5 h-12 w-12">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.imageAlt || item.title} className="h-7 w-7 object-contain" />
              ) : (
                <CmsIcon name={item.icon} fallback={Icon} size={22} />
              )}
            </span>
            <h3 className="text-xl font-extrabold text-on-surface">{item.title}</h3>
            {subtitle && <p className="mt-3 text-sm font-semibold leading-relaxed text-on-surface-variant">{subtitle}</p>}
            {metricDeliverables.length > 0 && (
              <div className="mt-4 grid gap-2">
                {metricDeliverables.map((metric, metricIndex) => (
                  <div key={`${item.title}-metric-${metricIndex}`} className="rounded-2xl border border-primary/15 bg-gradient-to-r from-primary/12 via-tertiary/10 to-secondary/12 p-3">
                    <p className="text-[22px] font-black leading-none text-primary">{metric.value}</p>
                    {metric.body && <p className="mt-1 text-[11px] font-extrabold leading-tight text-on-surface-variant">{metric.body}</p>}
                  </div>
                ))}
              </div>
            )}
            {taskDeliverables.length > 0 && (
              <div className="mt-4 grid gap-2">
                {taskDeliverables.map((task, taskIndex) => (
                  <div key={`${item.title}-task-${taskIndex}`} className="group/task rounded-2xl border border-outline-variant/45 bg-white/60 p-3 transition hover:border-primary/30 hover:bg-primary/5">
                    <p className="text-[11px] font-black uppercase tracking-[0.14em] text-primary">{task.title}</p>
                    <p className="mt-1 text-[12px] font-semibold leading-relaxed text-on-surface-variant">{task.body}</p>
                  </div>
                ))}
              </div>
            )}
            {price && (
              <div className="mt-5 rounded-2xl border border-primary/20 bg-gradient-to-r from-white via-primary/5 to-secondary/10 p-3">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-on-surface-variant">Monthly setup</p>
                <p className="home-price-shimmer mt-1 text-lg font-black text-primary">
                  <PriceText price={price} />
                </p>
              </div>
            )}
            <div className="mt-auto flex flex-col gap-2 pt-5">
              <button
                type="button"
                onClick={openBookingModal}
                className="btn-shine cta-idle inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-bold text-on-primary gg-btn-primary glow-orange hover:opacity-90"
              >
                {item.ctaText || chooseLabel}
              </button>
              {caseStudyLink && (
                <a
                  href={caseStudyLink}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/25 px-4 py-2.5 text-sm font-extrabold text-primary transition-colors hover:bg-primary/10"
                >
                  {item.caseStudyLabel || caseStudyLabel}
                  <ArrowRight size={15} />
                </a>
              )}
            </div>
          </article>
          </div>
        )
      })}
    </div>
  )
}
