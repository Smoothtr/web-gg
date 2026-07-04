import { useEffect } from 'react'
import { absoluteUrl, logoUrl, type BrandLang, type PageMeta } from '../brandContent'

function upsertMeta(selector: string, attrs: Record<string, string>) {
  let el = document.head.querySelector<HTMLMetaElement>(selector)
  if (!el) {
    el = document.createElement('meta')
    document.head.appendChild(el)
  }
  Object.entries(attrs).forEach(([key, value]) => el?.setAttribute(key, value))
}

function upsertLink(selector: string, attrs: Record<string, string>) {
  let el = document.head.querySelector<HTMLLinkElement>(selector)
  if (!el) {
    el = document.createElement('link')
    document.head.appendChild(el)
  }
  Object.entries(attrs).forEach(([key, value]) => el?.setAttribute(key, value))
}

export function SeoHead({ meta, schema, lang = 'vi' }: { meta: PageMeta; schema?: unknown[]; lang?: BrandLang }) {
  useEffect(() => {
    const canonical = absoluteUrl(meta.path)
    const ogTitle = meta.ogTitle ?? meta.title
    const ogDescription = meta.ogDescription ?? meta.description
    const ogImage = meta.ogImage ? absoluteUrl(meta.ogImage) : logoUrl

    document.documentElement.lang = lang
    document.title = meta.title

    upsertMeta('meta[name="description"]', { name: 'description', content: meta.description })
    upsertMeta('meta[name="robots"]', { name: 'robots', content: 'index, follow' })
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: ogTitle })
    upsertMeta('meta[property="og:description"]', {
      property: 'og:description',
      content: ogDescription,
    })
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: ogImage })
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' })
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonical })
    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' })
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: ogTitle })
    upsertMeta('meta[name="twitter:description"]', {
      name: 'twitter:description',
      content: ogDescription,
    })
    upsertLink('link[rel="canonical"]', { rel: 'canonical', href: canonical })

    document.head.querySelectorAll('script[data-gg99-schema="true"]').forEach((node) => node.remove())
    schema?.forEach((item) => {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.setAttribute('data-gg99-schema', 'true')
      script.textContent = JSON.stringify(item)
      document.head.appendChild(script)
    })
  }, [meta, schema, lang])

  return null
}
