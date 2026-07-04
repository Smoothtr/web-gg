import 'server-only'

import { hiddenCmsPageIds } from './adminNav'
import { defaultCmsInsights, defaultCmsPages, defaultCmsSiteSettings } from './defaultContent'
import { getFirebaseAdminDb } from './firebaseAdmin'
import { mergeCmsBlockWithTemplate } from './mergeDefaults'
import { mergeCmsSiteSettings } from './siteSettings'
import type { CmsInsightContent, CmsPageContent, CmsSiteSettings } from './types'

const PAGE_COLLECTION = 'sitePages'
const INSIGHT_COLLECTION = 'insights'
const SITE_SETTINGS_COLLECTION = 'siteSettings'
const SITE_SETTINGS_DOC = 'global'

export type ServerInsightPost = CmsInsightContent & {
  path: string
}

type TimestampLike = {
  toDate?: () => Date
}

function timestampToIso(value: unknown) {
  if (typeof value === 'string') return value
  if (value && typeof value === 'object' && typeof (value as TimestampLike).toDate === 'function') {
    return (value as TimestampLike).toDate?.().toISOString()
  }
  return undefined
}

function stripServerFields<T extends Record<string, unknown>>(value: T) {
  const next = { ...value }
  delete next.updatedAtServer
  return next
}

function normalizePage(id: string, data: FirebaseFirestore.DocumentData): CmsPageContent {
  const page = stripServerFields(data as Record<string, unknown>) as CmsPageContent
  const normalized = {
    ...page,
    id: page.id || id,
    updatedAt: timestampToIso(data.updatedAt) ?? page.updatedAt,
  }

  const template = defaultCmsPages.find((item) => item.id === normalized.id)
  if (!template) return normalized

  const currentBlocks = normalized.blocks ?? []
  const currentById = new Map(currentBlocks.map((block) => [block.id, block]))
  const templateIds = new Set(template.blocks.map((block) => block.id))
  const mergedBlocks = template.blocks.map((templateBlock) => mergeCmsBlockWithTemplate(templateBlock, currentById.get(templateBlock.id)))
  const extraBlocks = currentBlocks.filter((block) => !templateIds.has(block.id))

  return {
    ...template,
    ...normalized,
    meta: { ...template.meta, ...normalized.meta },
    blocks: [...mergedBlocks, ...extraBlocks],
  }
}

function normalizeInsight(slug: string, data: FirebaseFirestore.DocumentData): ServerInsightPost {
  const post = stripServerFields(data as Record<string, unknown>) as CmsInsightContent
  const coverImage = post.coverImageUrl || post.coverImage
  return {
    ...post,
    coverImage,
    coverImageUrl: post.coverImageUrl || coverImage,
    slug: post.slug || slug,
    path: `/insights/${post.slug || slug}`,
    updatedAt: timestampToIso(data.updatedAt) ?? post.updatedAt,
  }
}

function normalizeSiteSettings(data: FirebaseFirestore.DocumentData): CmsSiteSettings {
  return mergeCmsSiteSettings(stripServerFields(data as Record<string, unknown>) as CmsSiteSettings)
}

function fallbackInsight(post: CmsInsightContent): ServerInsightPost {
  const coverImage = post.coverImageUrl || post.coverImage
  return {
    ...post,
    coverImage,
    coverImageUrl: post.coverImageUrl || coverImage,
    path: `/insights/${post.slug}`,
  }
}

function publishedPage(page: CmsPageContent) {
  return page.status === 'published' && !hiddenCmsPageIds.has(page.id)
}

function publishedInsight(post: CmsInsightContent) {
  return post.status === 'published'
}

function getDbOrNull() {
  try {
    return getFirebaseAdminDb()
  } catch {
    return null
  }
}

export async function getServerCmsPage(id: string) {
  const fallback = defaultCmsPages.find((page) => page.id === id)
  const db = getDbOrNull()
  if (!db) return fallback

  try {
    const snapshot = await db.collection(PAGE_COLLECTION).doc(id).get()
    if (!snapshot.exists) return fallback
    const page = normalizePage(snapshot.id, snapshot.data() ?? {})
    return publishedPage(page) ? page : fallback
  } catch {
    return fallback
  }
}

export async function listServerCmsPages() {
  const db = getDbOrNull()
  if (!db) return defaultCmsPages.filter(publishedPage)

  try {
    const snapshot = await db.collection(PAGE_COLLECTION).orderBy('title').get()
    const pages = snapshot.docs.map((doc) => normalizePage(doc.id, doc.data())).filter(publishedPage)
    return pages.length ? pages : defaultCmsPages.filter(publishedPage)
  } catch {
    return defaultCmsPages.filter(publishedPage)
  }
}

export async function getServerCmsInsight(slug: string) {
  const fallback = defaultCmsInsights.find((post) => post.slug === slug)
  const db = getDbOrNull()
  if (!db) return fallback ? fallbackInsight(fallback) : undefined

  try {
    const snapshot = await db.collection(INSIGHT_COLLECTION).doc(slug).get()
    if (!snapshot.exists) return fallback ? fallbackInsight(fallback) : undefined
    const post = normalizeInsight(snapshot.id, snapshot.data() ?? {})
    return publishedInsight(post) ? post : fallback ? fallbackInsight(fallback) : undefined
  } catch {
    return fallback ? fallbackInsight(fallback) : undefined
  }
}

export async function listServerCmsInsights() {
  const db = getDbOrNull()
  if (!db) return defaultCmsInsights.filter(publishedInsight).map(fallbackInsight)

  try {
    const snapshot = await db.collection(INSIGHT_COLLECTION).orderBy('dateModified', 'desc').get()
    const posts = snapshot.docs.map((doc) => normalizeInsight(doc.id, doc.data())).filter(publishedInsight)
    return posts.length ? posts : defaultCmsInsights.filter(publishedInsight).map(fallbackInsight)
  } catch {
    return defaultCmsInsights.filter(publishedInsight).map(fallbackInsight)
  }
}

export async function getServerCmsSiteSettings() {
  const db = getDbOrNull()
  if (!db) return defaultCmsSiteSettings

  try {
    const snapshot = await db.collection(SITE_SETTINGS_COLLECTION).doc(SITE_SETTINGS_DOC).get()
    if (!snapshot.exists) return defaultCmsSiteSettings
    return normalizeSiteSettings(snapshot.data() ?? {})
  } catch {
    return defaultCmsSiteSettings
  }
}
