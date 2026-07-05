import type { CmsPageContent } from './types'
import type { BrandLang } from '../brandContent'
import { getLocalizedCmsBlock } from './contentBlocks'

export function getHomeClosingFaqItems(page?: CmsPageContent | null, lang: BrandLang = 'vi') {
  const closing = getLocalizedCmsBlock(page, 'closing', lang)
  return (closing?.items ?? [])
    .filter((item) => item.published !== false && item.title.trim() && item.body?.trim())
    .slice(0, 6)
    .map((item) => ({
      question: item.title.trim(),
      answer: item.body?.trim() ?? '',
    }))
}

export function buildHomeFaqSchema(page?: CmsPageContent | null, lang: BrandLang = 'vi') {
  const items = getHomeClosingFaqItems(page, lang)
  if (!items.length) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}
