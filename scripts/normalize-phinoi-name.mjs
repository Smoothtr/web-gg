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

const canonicalName = 'PHINƠI'
const displayVariants = /PHIN(?:O\u031b|Ơ|O|Æ(?:\u00a0|\s)?)I|\bPHI[ -]NOI\b/gi

function normalizeName(value) {
  return value.normalize('NFC').replace(displayVariants, (match) => (
    match === match.toLowerCase() ? match : canonicalName
  ))
}

function normalizeNode(value, path = '') {
  if (typeof value === 'string') {
    const next = normalizeName(value)
    return { value: next, paths: next === value ? [] : [path] }
  }

  if (Array.isArray(value)) {
    const paths = []
    const next = value.map((item, index) => {
      const result = normalizeNode(item, `${path}[${index}]`)
      paths.push(...result.paths)
      return result.value
    })
    return { value: next, paths }
  }

  if (!value || typeof value !== 'object' || Object.getPrototypeOf(value) !== Object.prototype) {
    return { value, paths: [] }
  }

  const paths = []
  const next = Object.fromEntries(
    Object.entries(value).map(([key, item]) => {
      const result = normalizeNode(item, path ? `${path}.${key}` : key)
      paths.push(...result.paths)
      return [key, result.value]
    }),
  )
  return { value: next, paths }
}

const collections = ['sitePages', 'siteSettings', 'insights']
const snapshots = await Promise.all(collections.map((collection) => db.collection(collection).get()))
const updates = snapshots.flatMap((snapshot) =>
  snapshot.docs.flatMap((document) => {
    const result = normalizeNode(document.data())
    return result.paths.length ? [{ document, data: result.value, paths: result.paths }] : []
  }),
)

const summary = {
  mode: apply ? 'apply' : 'dry-run',
  documentsScanned: snapshots.reduce((total, snapshot) => total + snapshot.size, 0),
  documentsToUpdate: updates.length,
  fieldsToUpdate: updates.reduce((total, update) => total + update.paths.length, 0),
  documents: updates.map((update) => ({
    path: update.document.ref.path,
    fields: update.paths,
  })),
}

console.log(JSON.stringify(summary, null, 2))

if (!apply) {
  console.log('Dry run only. Re-run with --apply after reviewing the field list.')
  process.exit(0)
}

if (!updates.length) process.exit(0)

const batch = db.batch()
const archivedAt = new Date().toISOString()
const archiveSuffix = archivedAt.replace(/[:.]/g, '-')

for (const update of updates) {
  const archiveRef = db
    .collection('contentArchive')
    .doc(`${update.document.ref.path.replaceAll('/', '--')}--phinoi-name--${archiveSuffix}`)
  batch.set(archiveRef, {
    sourceCollection: update.document.ref.parent.id,
    sourceId: update.document.id,
    sourcePath: update.document.ref.path,
    archivedAt,
    archivedAtServer: FieldValue.serverTimestamp(),
    reason: 'Canonical PHINƠI display-name migration.',
    data: update.document.data(),
  })
  batch.set(update.document.ref, { ...update.data, updatedAt: archivedAt })
}

await batch.commit()
console.log(JSON.stringify({ ...summary, archivedAt }, null, 2))
