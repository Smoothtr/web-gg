import { cert, initializeApp } from 'firebase-admin/app'
import { FieldValue, getFirestore } from 'firebase-admin/firestore'

const apply = process.argv.includes('--apply')
const requiredEnv = [
  'FIREBASE_ADMIN_PROJECT_ID',
  'FIREBASE_ADMIN_CLIENT_EMAIL',
  'FIREBASE_ADMIN_PRIVATE_KEY',
]
const missingEnv = requiredEnv.filter((key) => !process.env[key])

if (missingEnv.length) {
  throw new Error(`Missing Firebase Admin env: ${missingEnv.join(', ')}`)
}

const app = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
})
const db = getFirestore(app)

function normalizePackagesHref(value) {
  if (typeof value !== 'string') return value
  if (/^\/(?:(?:en|vi|ko)\/)?packages(?:[?#].*)?$/.test(value)) return '/#packages'
  if (/^https:\/\/(?:www\.)?(?:gg99\.vn|theone\.marketing)\/(?:(?:en|vi|ko)\/)?packages(?:[?#].*)?$/.test(value)) {
    const url = new URL(value)
    return `${url.origin}/#packages`
  }
  return value
}

function normalizeDocument(value) {
  if (typeof value === 'string') {
    const next = normalizePackagesHref(value)
    return { value: next, changes: next === value ? 0 : 1 }
  }

  if (Array.isArray(value)) {
    let changes = 0
    const next = value.map((item) => {
      const normalized = normalizeDocument(item)
      changes += normalized.changes
      return normalized.value
    })
    return { value: next, changes }
  }

  if (value && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype) {
    let changes = 0
    const next = Object.fromEntries(
      Object.entries(value).map(([key, item]) => {
        const normalized = normalizeDocument(item)
        changes += normalized.changes
        return [key, normalized.value]
      }),
    )
    return { value: next, changes }
  }

  return { value, changes: 0 }
}

const retiredPageRef = db.collection('sitePages').doc('packages')
const [retiredPage, pages, settings, insights] = await Promise.all([
  retiredPageRef.get(),
  db.collection('sitePages').get(),
  db.collection('siteSettings').get(),
  db.collection('insights').get(),
])

const updates = []
for (const snapshot of [...pages.docs, ...settings.docs, ...insights.docs]) {
  if (snapshot.ref.path === retiredPageRef.path) continue
  const normalized = normalizeDocument(snapshot.data())
  if (normalized.changes > 0) {
    updates.push({ ref: snapshot.ref, data: normalized.value, changes: normalized.changes })
  }
}

const summary = {
  mode: apply ? 'apply' : 'dry-run',
  retiredPageExists: retiredPage.exists,
  documentsToUpdate: updates.length,
  linksToUpdate: updates.reduce((total, item) => total + item.changes, 0),
  documents: updates.map((item) => ({ path: item.ref.path, links: item.changes })),
}

if (!apply) {
  console.log(JSON.stringify(summary, null, 2))
  console.log('Dry run only. Re-run with --apply to archive/delete sitePages/packages and update the listed links.')
  process.exit(0)
}

const batch = db.batch()
const archivedAt = new Date().toISOString()
let archivePath = null

if (retiredPage.exists) {
  const archiveId = `sitePages--packages--${archivedAt.replace(/[:.]/g, '-')}`
  const archiveRef = db.collection('contentArchive').doc(archiveId)
  archivePath = archiveRef.path
  batch.set(archiveRef, {
    sourceCollection: 'sitePages',
    sourceId: 'packages',
    sourcePath: retiredPageRef.path,
    archivedAt,
    archivedAtServer: FieldValue.serverTimestamp(),
    reason: 'Aggregate Packages page retired in favor of the Homepage Packages section.',
    data: retiredPage.data(),
  })
  batch.delete(retiredPageRef)
}

for (const update of updates) {
  batch.set(update.ref, update.data)
}

await batch.commit()

console.log(JSON.stringify({ ...summary, archivePath }, null, 2))
