import type { CmsPageContent } from './types'

export function getHomeClosingFaqItems(page?: CmsPageContent | null) {
  const closing = page?.blocks.find((block) => block.id === 'closing')
  return (closing?.items ?? [])
    .filter((item) => item.published !== false && item.title.trim() && item.body?.trim())
    .slice(0, 6)
    .map((item) => ({
      question: item.title.trim(),
      answer: item.body?.trim() ?? '',
    }))
}

export function buildHomeFaqSchema(page?: CmsPageContent | null) {
  const items = getHomeClosingFaqItems(page)
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
