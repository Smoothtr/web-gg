import type { Metadata } from 'next'
import { createMetadata } from './seo'
import { getServerCmsInsight, getServerCmsPage } from '../cms/serverRepository'
import type { BrandLang, PageMeta } from '../brandContent'

export async function generateCmsPageMetadata(id: string, lang: BrandLang, fallback: PageMeta): Promise<Metadata> {
  const page = await getServerCmsPage(id)
  return createMetadata(page?.meta ?? fallback, lang)
}

export async function generateInsightMetadata(slug: string): Promise<Metadata> {
  const post = await getServerCmsInsight(slug)
  return createMetadata(post?.meta, 'vi')
}
