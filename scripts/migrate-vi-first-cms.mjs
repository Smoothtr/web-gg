import { mkdir, rm } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { FieldValue, getFirestore } from 'firebase-admin/firestore'
import * as esbuild from 'esbuild'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const tempDir = path.join(rootDir, '.next', 'migrate-vi-first-cms')
const compiledPath = path.join(tempDir, 'defaultContent.mjs')

const required = [
  'FIREBASE_ADMIN_PROJECT_ID',
  'FIREBASE_ADMIN_CLIENT_EMAIL',
  'FIREBASE_ADMIN_PRIVATE_KEY',
]

const missing = required.filter((key) => !process.env[key])
if (missing.length) {
  throw new Error(`Missing Firebase Admin env: ${missing.join(', ')}`)
}

await mkdir(tempDir, { recursive: true })
await esbuild.build({
  entryPoints: [path.join(rootDir, 'src', 'cms', 'defaultContent.ts')],
  bundle: true,
  platform: 'node',
  format: 'esm',
  outfile: compiledPath,
  logLevel: 'silent',
})

const { defaultCmsPages, defaultCmsSiteSettings } = await import(pathToFileURL(compiledPath).href)
await rm(tempDir, { recursive: true, force: true })

const app =
  getApps()[0] ??
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  })

const db = getFirestore(app)
const now = new Date().toISOString()

const blockMediaFields = [
  'imageUrl',
  'imageAlt',
  'backgroundImageUrl',
  'backgroundGradient',
  'backgroundOverlayOpacity',
  'textColor',
  'dividerShow',
  'icon',
  'ctaHref',
]

const itemPreserveFields = [
  'id',
  'icon',
  'accountName',
  'displayName',
  'logoUrl',
  'verified',
  'likesSeed',
  'imageUrl',
  'imageAlt',
  'avatarImages',
  'thumbnailUrl',
  'homepageGalleryImages',
  'videoUrl',
  'videoPoster',
  'embedUrl',
  'backgroundImageUrl',
  'backgroundImages',
  'funPhotoUrl',
  'photoUrl',
  'screenBackground',
  'socialLinks',
  'href',
  'caseStudyLink',
  'showOnHomepage',
  'homepageOrder',
  'published',
]

const settingPreserveFields = new Set([
  'logoSrc',
  'logoAlt',
  'email',
  'chatUrl',
  'chatLabel',
  'privacyHref',
  'termsHref',
])

function stripUndefined(value) {
  return JSON.parse(JSON.stringify(value))
}

function hasValue(value) {
  if (Array.isArray(value)) return value.length > 0
  if (value && typeof value === 'object') return Object.keys(value).length > 0
  return value !== undefined && value !== null && value !== ''
}

function itemKey(item, index) {
  return String(item?.id || item?.href || item?.title || index).trim().toLowerCase()
}

function mergeLocales(defaultLocales, currentLocales) {
  return {
    ...(currentLocales ?? {}),
    ...(defaultLocales ?? {}),
  }
}

function preserveKnownFields(next, current, fields) {
  for (const field of fields) {
    if (hasValue(current?.[field])) next[field] = current[field]
  }
}

function mergeItem(defaultItem, currentItem) {
  const next = {
    ...(currentItem ?? {}),
    ...defaultItem,
    locales: mergeLocales(defaultItem.locales, currentItem?.locales),
  }
  preserveKnownFields(next, currentItem, itemPreserveFields)
  return stripUndefined(next)
}

function mergeItems(defaultItems = [], currentItems = []) {
  const currentByKey = new Map(currentItems.map((item, index) => [itemKey(item, index), item]))
  return defaultItems.map((item, index) => mergeItem(item, currentByKey.get(itemKey(item, index)) ?? currentItems[index]))
}

function mergeBlock(defaultBlock, currentBlock) {
  const next = {
    ...(currentBlock ?? {}),
    ...defaultBlock,
    locales: mergeLocales(defaultBlock.locales, currentBlock?.locales),
    items: mergeItems(defaultBlock.items ?? [], currentBlock?.items ?? []),
  }
  preserveKnownFields(next, currentBlock, blockMediaFields)
  return stripUndefined(next)
}

function mergeBlocks(defaultBlocks = [], currentBlocks = []) {
  const currentById = new Map(currentBlocks.map((block) => [String(block.id || '').trim().toLowerCase(), block]))
  return defaultBlocks.map((block) => mergeBlock(block, currentById.get(String(block.id || '').trim().toLowerCase())))
}

function mergePage(defaultPage, currentPage) {
  const data = stripUndefined({
    ...(currentPage ?? {}),
    ...defaultPage,
    meta: defaultPage.meta,
    metaLocales: mergeLocales(defaultPage.metaLocales, currentPage?.metaLocales),
    blocks: mergeBlocks(defaultPage.blocks, currentPage?.blocks),
    updatedAt: now,
  })
  return {
    ...data,
    updatedAtServer: FieldValue.serverTimestamp(),
  }
}

function mergeObject(defaultObject, currentObject) {
  if (!defaultObject || typeof defaultObject !== 'object' || Array.isArray(defaultObject)) {
    return defaultObject
  }
  const next = { ...(currentObject ?? {}) }
  for (const [key, value] of Object.entries(defaultObject)) {
    if (Array.isArray(value)) {
      next[key] = value
      continue
    }
    if (value && typeof value === 'object') {
      next[key] = mergeObject(value, currentObject?.[key])
      continue
    }
    next[key] = settingPreserveFields.has(key) && hasValue(currentObject?.[key]) ? currentObject[key] : value
  }
  return next
}

function mergeSiteSettings(defaultSettings, currentSettings) {
  const data = stripUndefined({
    ...(currentSettings ?? {}),
    ...mergeObject(defaultSettings, currentSettings),
    id: 'global',
    updatedAt: now,
  })
  return {
    ...data,
    updatedAtServer: FieldValue.serverTimestamp(),
  }
}

const batch = db.batch()
let sitePages = 0

for (const page of defaultCmsPages) {
  const ref = db.collection('sitePages').doc(page.id)
  const snap = await ref.get()
  batch.set(ref, mergePage(page, snap.exists ? snap.data() : undefined), { merge: false })
  sitePages += 1
}

const settingsRef = db.collection('siteSettings').doc('global')
const settingsSnap = await settingsRef.get()
batch.set(settingsRef, mergeSiteSettings(defaultCmsSiteSettings, settingsSnap.exists ? settingsSnap.data() : undefined), { merge: false })

await batch.commit()

console.log(
  JSON.stringify(
    {
      ok: true,
      sitePages,
      siteSettings: 1,
      migratedAt: now,
    },
    null,
    2,
  ),
)
