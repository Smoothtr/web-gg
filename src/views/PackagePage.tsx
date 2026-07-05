'use client'

import {
  BarChart3,
  CheckCircle2,
  ClipboardCheck,
  Database,
  FileText,
  Flag,
  Gauge,
  Megaphone,
  MousePointerClick,
  PanelsTopLeft,
  PenTool,
  Route,
  Search,
  Settings2,
  ShoppingCart,
  Target,
  Users,
  Workflow,
} from 'lucide-react'
import { compactPackageByLang, localizedPath, organizationSchema, serviceSchemas, type BrandLang, type PackageKey } from '../brandContent'
import { BrandLayout } from '../components/BrandLayout'
import { CmsIcon } from '../components/CmsIcon'
import { SeoHead } from '../components/SeoHead'
import { getLocalizedCmsBlock, getLocalizedPageMeta, splitCmsParagraphs } from '../cms/contentBlocks'
import type { CmsBlockItem, CmsPageContent, CmsSiteSettings } from '../cms/types'

const serviceByPackage: Record<PackageKey, unknown> = {
  consultant: serviceSchemas[0],
  agency: serviceSchemas[1],
  partner: serviceSchemas[2],
}

const packageRouteByKey: Record<PackageKey, string> = {
  consultant: '/the-one-start',
  agency: '/the-one-system',
  partner: '/the-one-scale',
}

const icons = [
  ClipboardCheck,
  Megaphone,
  Users,
  ShoppingCart,
  Target,
  Route,
  PenTool,
  MousePointerClick,
  PanelsTopLeft,
  Settings2,
  Workflow,
  BarChart3,
  Database,
  Gauge,
  Flag,
  FileText,
  Search,
  CheckCircle2,
]

export function PackagePage({ packageKey, lang = 'vi', cmsPage, siteSettings }: { packageKey: PackageKey; lang?: BrandLang; cmsPage?: CmsPageContent | null; siteSettings?: CmsSiteSettings | null }) {
  const page = compactPackageByLang[lang][packageKey]
  const heroBlock = getLocalizedCmsBlock(cmsPage, 'hero', lang) ?? getLocalizedCmsBlock(cmsPage, 'intro', lang)
  const cardsBlock = getLocalizedCmsBlock(cmsPage, 'cards', lang)
  const processBlock = getLocalizedCmsBlock(cmsPage, 'process', lang)
  const heroParagraphs = splitCmsParagraphs(heroBlock?.body)
  const cardItems: CmsBlockItem[] = cardsBlock?.items?.length
    ? cardsBlock.items
    : page.cards.map((card) => ({ title: card.title, body: card.text }))
  const processItems: CmsBlockItem[] = processBlock?.items?.length
    ? processBlock.items
    : page.process.map((step, index) => ({ title: step.title, body: step.text, icon: String(index + 1).padStart(2, '0') }))

  return (
    <BrandLayout lang={lang} siteSettings={siteSettings}>
      <SeoHead meta={getLocalizedPageMeta(cmsPage, lang, page.meta)} schema={[organizationSchema, serviceByPackage[packageKey]]} lang={lang} />

      <article>
        <section className="relative overflow-hidden px-5 lg:px-10 py-14 md:py-20">
          <div className="absolute inset-0 tech-grid opacity-80 pointer-events-none" aria-hidden="true" />
          <div className="noise-overlay" aria-hidden="true" />
          <div className="relative max-w-5xl mx-auto">
            <div className="max-w-3xl">
              <p className="text-sm font-extrabold uppercase tracking-widest text-primary mb-4">The One - GG99</p>
              <h1 className="text-[40px] sm:text-[56px] md:text-[72px] font-extrabold text-on-surface leading-[1.06]">
                {heroBlock?.heading ?? page.h1}
              </h1>
              {heroParagraphs.length ? (
                <div className="mt-5 grid max-w-2xl gap-3 text-base leading-relaxed text-on-surface-variant md:text-lg">
                  {heroParagraphs.map((paragraph, index) => (
                    <p key={`${paragraph}-${index}`}>{paragraph}</p>
                  ))}
                </div>
              ) : (
                <>
                  <p className="mt-5 text-xl md:text-2xl font-bold text-primary">{page.hero}</p>
                  <p className="mt-5 text-base md:text-lg text-on-surface-variant leading-relaxed max-w-2xl">{page.intro}</p>
                </>
              )}
            </div>
          </div>
        </section>

        <section className="px-5 lg:px-10 pb-16 md:pb-24">
          <div className="max-w-6xl mx-auto space-y-10">
            <section>
              <h2 className="text-[28px] md:text-[34px] font-extrabold text-on-surface mb-6">
                {cardsBlock?.heading || (lang === 'vi' ? 'Bạn nhận được gì' : 'What you get')}
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {cardItems.map((card, index) => {
                  const Icon = icons[index]
                  return (
                    <article key={`${card.title}-${index}`} className="glass-card card-hover rounded-2xl p-5">
                      <span className="icon-chip h-11 w-11 mb-4">
                        {card.imageUrl ? (
                          <img src={card.imageUrl} alt={card.imageAlt || card.title} className="h-6 w-6 object-contain" />
                        ) : (
                          <CmsIcon name={card.icon} fallback={Icon} size={20} />
                        )}
                      </span>
                      <h3 className="text-base font-extrabold text-on-surface">{card.title}</h3>
                      <p className="mt-2 text-sm text-on-surface-variant">{card.body}</p>
                    </article>
                  )
                })}
              </div>
            </section>

            <section>
              <h2 className="text-[28px] md:text-[34px] font-extrabold text-on-surface mb-6">
                {processBlock?.heading || (lang === 'vi' ? 'Quy trình' : 'Process')}
              </h2>
              <div className="grid md:grid-cols-4 gap-4">
                {processItems.map((step, index) => (
                  <article key={`${step.title}-${index}`} className="glass-card card-hover rounded-2xl p-5">
                    <div className="text-[11px] font-extrabold tracking-widest text-primary mb-3">{step.icon || String(index + 1).padStart(2, '0')}</div>
                    <h3 className="font-extrabold text-on-surface mb-2">{step.title}</h3>
                    <p className="text-sm text-on-surface-variant">{step.body}</p>
                  </article>
                ))}
              </div>
            </section>

            <nav className="grid sm:grid-cols-3 gap-3">
              {(['consultant', 'agency', 'partner'] as PackageKey[]).map((key) => {
                const item = compactPackageByLang[lang][key]
                return (
                  <a
                    key={key}
                    href={localizedPath(lang, packageRouteByKey[key])}
                    className={`rounded-2xl border px-5 py-4 font-bold transition-colors ${
                      key === packageKey
                        ? 'border-primary bg-primary text-on-primary'
                        : 'border-outline-variant text-on-surface-variant hover:bg-surface-container-low'
                    }`}
                  >
                    {item.h1}
                  </a>
                )
              })}
            </nav>
          </div>
        </section>
      </article>
    </BrandLayout>
  )
}
