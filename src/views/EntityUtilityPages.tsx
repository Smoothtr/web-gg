'use client'

import { BadgeCheck, Mail } from 'lucide-react'
import {
  contactMeta,
  organizationSchema,
  servicesMeta,
  websiteSchema,
  type BrandLang,
} from '../brandContent'
import { BrandLayout } from '../components/BrandLayout'
import { SeoHead } from '../components/SeoHead'
import { getLocalizedCmsBlock, getLocalizedPageMeta } from '../cms/contentBlocks'
import { getLocalizedSiteSettings } from '../cms/siteSettings'
import type { CmsBlockItem, CmsPageContent, CmsSiteSettings } from '../cms/types'

const defaultServiceItems: CmsBlockItem[] = [
  { title: 'Brand', body: 'Identity, positioning and campaign direction.', icon: 'BadgeCheck' },
  { title: 'Website development', body: 'Landing pages, booking flows and sales-ready web systems.', icon: 'PanelsTopLeft' },
  { title: 'CRM', body: 'Customer data, forms and lifecycle workflows.', icon: 'Users' },
  { title: 'Marketing automation', body: 'Connected journeys, reminders and operating workflows.', icon: 'Workflow' },
  { title: 'Performance marketing', body: 'Paid media planning, reporting and optimization.', icon: 'Megaphone' },
]

const defaultContactItems: CmsBlockItem[] = [
  { title: 'Email', body: 'smooth@gg99.vn', href: 'mailto:smooth@gg99.vn', icon: 'Mail' },
  { title: 'Chat', body: 'Zalo', href: 'https://zalo.me/smoothgg', icon: 'MessageCircle' },
  { title: 'Office', body: 'Hanoi, Vietnam', icon: 'Target' },
]

export function ServicesPage({ lang = 'en', cmsPage, siteSettings }: { lang?: BrandLang; cmsPage?: CmsPageContent | null; siteSettings?: CmsSiteSettings | null }) {
  const introBlock = getLocalizedCmsBlock(cmsPage, 'intro', lang)
  const serviceItems = introBlock?.items?.length ? introBlock.items : defaultServiceItems
  return (
    <BrandLayout lang={lang} siteSettings={siteSettings}>
      <SeoHead meta={getLocalizedPageMeta(cmsPage, lang, servicesMeta)} schema={[organizationSchema, websiteSchema]} lang={lang} />
      <section className="relative overflow-hidden px-5 lg:px-10 py-14 md:py-20">
        <div className="absolute inset-0 tech-grid opacity-80 pointer-events-none" aria-hidden="true" />
        <div className="relative max-w-5xl mx-auto">
          <h1 className="text-[40px] sm:text-[56px] md:text-[72px] font-extrabold text-on-surface leading-[1.06]">{introBlock?.heading || 'Services'}</h1>
          <p className="mt-5 max-w-2xl whitespace-pre-line text-lg text-on-surface-variant leading-relaxed">
            {introBlock?.body || servicesMeta.description}
          </p>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {serviceItems.map((item, index) => (
              <article key={`${item.title}-${index}`} className="glass-card rounded-2xl p-4">
                <BadgeCheck size={18} className="text-primary mb-3" />
                <h2 className="text-sm font-extrabold text-on-surface">{item.title}</h2>
                {item.body && <p className="mt-2 text-xs font-semibold leading-relaxed text-on-surface-variant">{item.body}</p>}
              </article>
            ))}
          </div>
        </div>
      </section>
    </BrandLayout>
  )
}

export function ContactPage({ lang = 'en', cmsPage, siteSettings }: { lang?: BrandLang; cmsPage?: CmsPageContent | null; siteSettings?: CmsSiteSettings | null }) {
  const introBlock = getLocalizedCmsBlock(cmsPage, 'intro', lang)
  const footer = getLocalizedSiteSettings(siteSettings, lang).footer
  const contactItems = introBlock?.items?.length ? introBlock.items : defaultContactItems
  const email = footer.email || 'smooth@gg99.vn'
  return (
    <BrandLayout lang={lang} siteSettings={siteSettings}>
      <SeoHead meta={getLocalizedPageMeta(cmsPage, lang, contactMeta)} schema={[organizationSchema, websiteSchema]} lang={lang} />
      <section className="relative overflow-hidden px-5 lg:px-10 py-14 md:py-20">
        <div className="absolute inset-0 tech-grid opacity-80 pointer-events-none" aria-hidden="true" />
        <div className="relative max-w-5xl mx-auto">
          <h1 className="text-[40px] sm:text-[56px] md:text-[72px] font-extrabold text-on-surface leading-[1.06]">{introBlock?.heading || 'Contact GG99'}</h1>
          <p className="mt-5 max-w-2xl whitespace-pre-line text-lg text-on-surface-variant leading-relaxed">
            {introBlock?.body || contactMeta.description}
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {contactItems.map((item, index) => (
              <article key={`${item.title}-${index}`} className="glass-card rounded-2xl p-4">
                <BadgeCheck size={18} className="mb-3 text-primary" />
                <h2 className="text-sm font-extrabold text-on-surface">{item.title}</h2>
                {item.href ? (
                  <a href={item.href} className="mt-2 block text-xs font-bold leading-relaxed text-primary hover:underline">{item.body || item.href}</a>
                ) : (
                  <p className="mt-2 text-xs font-semibold leading-relaxed text-on-surface-variant">{item.body}</p>
                )}
              </article>
            ))}
          </div>
          <a href={`mailto:${email}`} className="mt-7 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-bold text-on-primary gg-btn-primary">
            <Mail size={18} /> {email}
          </a>
        </div>
      </section>
    </BrandLayout>
  )
}
