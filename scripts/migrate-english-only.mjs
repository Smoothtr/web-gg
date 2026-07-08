// One-time migration: promote English locale content over the Vietnamese base
// fields in every sitePages doc, then drop the bilingual locale maps.
// Site settings keep only the "en" locale. Run backup-firestore.mjs FIRST.
// Usage: node --env-file=.env.local scripts/migrate-english-only.mjs [--dry-run]
import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

const dryRun = process.argv.includes('--dry-run')

const app = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
})
const db = getFirestore(app)

function hasText(value) {
  return typeof value === 'string' ? value.trim().length > 0 : value !== undefined && value !== null
}

// Same override semantics as src/cms/contentBlocks.ts mergeLocalizedFields:
// strings only when non-blank, arrays only when non-empty, objects shallow-merged.
function mergeLocalizedFields(base, localized) {
  if (!localized) return base
  const next = { ...base }
  for (const [key, value] of Object.entries(localized)) {
    if (Array.isArray(value)) {
      if (value.length) next[key] = value
      continue
    }
    if (value && typeof value === 'object') {
      next[key] = { ...(next[key] ?? {}), ...value }
      continue
    }
    if (hasText(value)) next[key] = value
  }
  return next
}

function stripEnPrefix(path) {
  if (typeof path !== 'string') return path
  const stripped = path.replace(/^\/en(?=\/|$)/, '')
  return stripped || '/'
}

function migrateItem(item) {
  const merged = mergeLocalizedFields(item, item.locales?.en)
  delete merged.locales
  return merged
}

function migrateBlock(block) {
  const merged = mergeLocalizedFields(block, block.locales?.en)
  delete merged.locales
  if (Array.isArray(merged.items)) merged.items = merged.items.map(migrateItem)
  return merged
}

const pagesSnapshot = await db.collection('sitePages').get()
for (const doc of pagesSnapshot.docs) {
  const data = doc.data()
  const next = { ...data }
  next.meta = { ...(data.meta ?? {}), ...(data.metaLocales?.en ?? {}) }
  next.meta.path = stripEnPrefix(next.meta.path)
  delete next.metaLocales
  next.blocks = (data.blocks ?? []).map(migrateBlock)

  if (dryRun) {
    console.log(`[dry-run] sitePages/${doc.id}: meta.title -> "${next.meta.title}" | path -> ${next.meta.path}`)
    continue
  }
  await db.collection('sitePages').doc(doc.id).set(next)
  console.log(`migrated sitePages/${doc.id} (${next.blocks.length} blocks)`)
}

const settingsRef = db.collection('siteSettings').doc('global')
const settingsSnapshot = await settingsRef.get()
if (settingsSnapshot.exists) {
  const settings = settingsSnapshot.data()
  const next = { ...settings, locales: { en: settings.locales?.en ?? {} } }
  if (dryRun) {
    console.log('[dry-run] siteSettings/global: keep locales.en only, drop locales.vi')
  } else {
    await settingsRef.set(next)
    console.log('migrated siteSettings/global (dropped vi locale)')
  }
}

console.log(dryRun ? 'Dry run complete.' : 'Migration complete.')
