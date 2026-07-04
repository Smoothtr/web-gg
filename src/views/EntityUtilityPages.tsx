'use client'

import { BadgeCheck, Mail, Megaphone, Rocket, Workflow } from 'lucide-react'
import {
  contactMeta,
  organizationSchema,
  packagesMetaByLang,
  servicesMeta,
  theOnePackagesByLang,
  websiteSchema,
  type BrandLang,
} from '../brandContent'
import { BrandLayout } from '../components/BrandLayout'
import { openBookingModal } from '../components/openBookingModal'
import { CmsIcon } from '../components/CmsIcon'
import { SeoHead } from '../components/SeoHead'
import { getCmsBlock, splitCmsParagraphs } from '../cms/contentBlocks'
import type { CmsBlockItem, CmsPageContent, CmsSiteSettings } from '../cms/types'

const packageIcons = [Rocket, Workflow, Megaphone]

export function PackagesPage({ lang = 'vi', cmsPage, siteSettings }: { lang?: BrandLang; cmsPage?: CmsPageContent | null; siteSettings?: CmsSiteSettings | null }) {
  const c = theOnePackagesByLang[lang]
  const meta = cmsPage?.meta ?? packagesMetaByLang[lang]
  const introBlock = getCmsBlock(cmsPage, 'intro')
  const packageBlock = getCmsBlock(cmsPage, 'packages')
  const introParagraphs = splitCmsParagraphs(introBlock?.body)
  const packageItems: CmsBlockItem[] = packageBlock?.items?.length
    ? packageBlock.items
    : c.packages.map((item, index) => ({
      title: item.name,
      body: `${item.title}\n${item.text}`,
      icon: ['🚀', '⚙️', '📣'][index],
      href: item.href,
    }))

  return (
    <BrandLayout lang={lang} siteSettings={siteSettings}>
      <SeoHead meta={meta} schema={[organizationSchema, websiteSchema]} lang={lang} />

      <article>
        <section className="relative overflow-hidden px-5 lg:px-10 py-14 md:py-20">
          <div className="absolute inset-0 tech-grid opacity-80 pointer-events-none" aria-hidden="true" />
          <div className="noise-overlay" aria-hidden="true" />
          <div className="relative max-w-5xl mx-auto">
            <h1 className="text-[40px] sm:text-[56px] md:text-[72px] font-extrabold text-on-surface leading-[1.06]">
              {introBlock?.heading ?? c.h1}
            </h1>
            {introParagraphs.length ? (
              <div className="mt-5 grid max-w-2xl gap-3 text-base leading-relaxed text-on-surface-variant md:text-lg">
                {introParagraphs.map((paragraph, index) => (
                  <p key={`${paragraph}-${index}`}>{paragraph}</p>
                ))}
              </div>
            ) : (
              <>
                <p className="mt-5 text-xl md:text-2xl font-bold text-primary">{c.subtitle}</p>
                <p className="mt-5 max-w-2xl text-base md:text-lg text-on-surface-variant leading-relaxed">{c.intro}</p>
              </>
            )}
          </div>
        </section>

        <section className="px-5 lg:px-10 pb-16 md:pb-24">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-5">
            {packageBlock?.body && (
              <div className="md:col-span-3 -mt-4 mb-2 whitespace-pre-line text-sm leading-relaxed text-on-surface-variant">
                {packageBlock.body}
              </div>
            )}
            {packageItems.map((item, index) => {
              const Icon = packageIcons[index]
              const lines = String(item.body || '').split(/\n+/).map((line) => line.trim()).filter(Boolean)
              const subtitle = lines[0] || ''
              const hasPrice = /^price:/i.test(lines[lines.length - 1] || '')
              const price = hasPrice ? lines[lines.length - 1].replace(/^price:\s*/i, '') : ''
              const bullets = lines.slice(1, hasPrice ? -1 : undefined)
              const id = item.title.toLowerCase().replace(/\s+/g, '-')
              return (
                <article id={id} key={`${item.title}-${index}`} className="glass-card card-hover flex flex-col rounded-2xl p-6 scroll-mt-24">
                  <span className="icon-chip h-12 w-12 mb-5">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.imageAlt || item.title} className="h-7 w-7 object-contain" />
                    ) : (
                      <CmsIcon name={item.icon} fallback={Icon} size={22} />
                    )}
                  </span>
                  <h2 className="text-xl font-extrabold text-on-surface">{item.title}</h2>
                  {subtitle && <p className="mt-4 text-sm font-semibold text-on-surface-variant leading-relaxed">{subtitle}</p>}
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
                </article>
              )
            })}
          </div>
        </section>
      </article>
    </BrandLayout>
  )
}

export function ServicesPage({ cmsPage, siteSettings }: { cmsPage?: CmsPageContent | null; siteSettings?: CmsSiteSettings | null }) {
  const introBlock = getCmsBlock(cmsPage, 'intro')
  return (
    <BrandLayout lang="en" siteSettings={siteSettings}>
      <SeoHead meta={cmsPage?.meta ?? servicesMeta} schema={[organizationSchema, websiteSchema]} lang="en" />
      <section className="relative overflow-hidden px-5 lg:px-10 py-14 md:py-20">
        <div className="absolute inset-0 tech-grid opacity-80 pointer-events-none" aria-hidden="true" />
        <div className="relative max-w-5xl mx-auto">
          {introBlock && (
            <div className="mb-8 rounded-2xl border border-outline-variant/40 bg-surface/70 p-5">
              <h1 className="text-3xl font-extrabold text-on-surface md:text-5xl">{introBlock.heading}</h1>
              <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-on-surface-variant">{introBlock.body}</p>
            </div>
          )}
          <h1 className="text-[40px] sm:text-[56px] md:text-[72px] font-extrabold text-on-surface leading-[1.06]">Services</h1>
          <p className="mt-5 max-w-2xl text-lg text-on-surface-variant leading-relaxed">
            GG99 provides brand identity, website development, CRM, marketing automation and performance marketing through the The One growth system.
          </p>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {['Brand', 'Website development', 'CRM', 'Marketing automation', 'Performance marketing'].map((item) => (
              <article key={item} className="glass-card rounded-2xl p-4">
                <BadgeCheck size={18} className="text-primary mb-3" />
                <h2 className="text-sm font-extrabold text-on-surface">{item}</h2>
              </article>
            ))}
          </div>
        </div>
      </section>
    </BrandLayout>
  )
}

export function ContactPage({ cmsPage, siteSettings }: { cmsPage?: CmsPageContent | null; siteSettings?: CmsSiteSettings | null }) {
  const introBlock = getCmsBlock(cmsPage, 'intro')
  return (
    <BrandLayout lang="en" siteSettings={siteSettings}>
      <SeoHead meta={cmsPage?.meta ?? contactMeta} schema={[organizationSchema, websiteSchema]} lang="en" />
      <section className="relative overflow-hidden px-5 lg:px-10 py-14 md:py-20">
        <div className="absolute inset-0 tech-grid opacity-80 pointer-events-none" aria-hidden="true" />
        <div className="relative max-w-5xl mx-auto">
          {introBlock && (
            <div className="mb-8 rounded-2xl border border-outline-variant/40 bg-surface/70 p-5">
              <h1 className="text-3xl font-extrabold text-on-surface md:text-5xl">{introBlock.heading}</h1>
              <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-on-surface-variant">{introBlock.body}</p>
            </div>
          )}
          <h1 className="text-[40px] sm:text-[56px] md:text-[72px] font-extrabold text-on-surface leading-[1.06]">Contact GG99</h1>
          <p className="mt-5 max-w-2xl text-lg text-on-surface-variant leading-relaxed">
            Contact GG99, also known as The One, to build your brand, website, CRM, automation and performance marketing in one ecosystem.
          </p>
          <a href="mailto:smooth@gg99.vn" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-bold text-on-primary gg-btn-primary">
            <Mail size={18} /> smooth@gg99.vn
          </a>
        </div>
      </section>
    </BrandLayout>
  )
}
