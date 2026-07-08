import type { Metadata } from 'next'
import { createMetadata } from './seo'
import { getServerCmsInsight, getServerCmsPage } from '../cms/serverRepository'
import { getLocalizedPageMeta } from '../cms/contentBlocks'
import type { BrandLang, PageMeta } from '../brandContent'

export async function generateCmsPageMetadata(id: string, lang: BrandLang, fallback: PageMeta): Promise<Metadata> {
  const page = await getServerCmsPage(id)
  return createMetadata(getLocalizedPageMeta(page, lang, fallback), lang)
}

export async function generateInsightMetadata(slug: string): Promise<Metadata> {
  const post = await getServerCmsInsight(slug)
  if (!post) return createMetadata(undefined, 'en')
  const coverImage = post.coverImageUrl || post.coverImage
  return createMetadata({ ...post.meta, ogImage: post.meta.ogImage || coverImage }, 'en')
}
