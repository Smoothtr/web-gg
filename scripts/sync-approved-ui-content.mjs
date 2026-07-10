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

const approvedFooter = {
  brandName: 'The One — GG99',
  tagline: 'One partner. One system. One growth direction.',
  description: 'One partner. One system. One growth direction.',
  solutionsHeading: 'Solutions',
  solutionLinks: [
    { label: 'The One Start', href: '/#packages', visible: true },
    { label: 'The One System', href: '/#packages', visible: true },
    { label: 'The One Scale', href: '/#packages', visible: true },
  ],
  navigationHeading: 'Explore',
  navigationLinks: [
    { label: 'About The One', href: '/about', visible: true },
    { label: 'The One Stories', href: '/the-one', visible: true },
    { label: 'Insights', href: '/insights', visible: true },
  ],
  contactHeading: 'Contact',
  copyright: '© 2026 The One — GG99. All rights reserved.',
  privacyLabel: 'Privacy',
  termsLabel: 'Terms',
  address: '',
  companyAddress: '',
  ctaHeading: '',
  qrCaption: '',
  socials: {},
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype
}

function normalizePhinoiNode(value) {
  if (Array.isArray(value)) {
    let changes = 0
    const next = value.map((item) => {
      const result = normalizePhinoiNode(item)
      changes += result.changes
      return result.value
    })
    return { value: next, changes }
  }

  if (!isPlainObject(value)) return { value, changes: 0 }

  let changes = 0
  let next = Object.fromEntries(
    Object.entries(value).map(([key, item]) => {
      const result = normalizePhinoiNode(item)
      changes += result.changes
      return [key, result.value]
    }),
  )

  if (String(next.id ?? '').toLowerCase() !== 'phinoi') return { value: next, changes }

  for (const field of ['featuredStats', 'keyMetrics']) {
    if (!Array.isArray(next[field])) continue
    const metrics = [...next[field]]
    for (const [index, metricValue] of ['≈50%', '×3'].entries()) {
      if (!isPlainObject(metrics[index]) || metrics[index].value === metricValue) continue
      metrics[index] = { ...metrics[index], value: metricValue }
      changes += 1
    }
    next = { ...next, [field]: metrics }
  }

  if (isPlainObject(next.storyDetail) && typeof next.storyDetail.result === 'string') {
    const result = next.storyDetail.result.replace(/(?:×|x)\s*2(?=\b|\.)/gi, 'x3')
    if (result !== next.storyDetail.result) {
      next = { ...next, storyDetail: { ...next.storyDetail, result } }
      changes += 1
    }
  }

  return { value: next, changes }
}

const settingsRef = db.collection('siteSettings').doc('global')
const pageRefs = [
  db.collection('sitePages').doc('homepage'),
  db.collection('sitePages').doc('the-one'),
]
const [settingsSnapshot, ...pageSnapshots] = await Promise.all([
  settingsRef.get(),
  ...pageRefs.map((ref) => ref.get()),
])

if (!settingsSnapshot.exists) throw new Error('siteSettings/global does not exist')

const settings = settingsSnapshot.data()
const currentFooter = settings?.locales?.en?.footer ?? {}
const nextFooter = { ...currentFooter, ...approvedFooter }
const footerChanged = JSON.stringify(currentFooter) !== JSON.stringify(nextFooter)
const pageUpdates = pageSnapshots
  .filter((snapshot) => snapshot.exists)
  .map((snapshot) => {
    const result = normalizePhinoiNode(snapshot.data())
    return { snapshot, data: result.value, changes: result.changes }
  })
  .filter((item) => item.changes > 0)

const summary = {
  mode: apply ? 'apply' : 'dry-run',
  footerChanged,
  phinoiDocumentsToUpdate: pageUpdates.length,
  phinoiFieldsToUpdate: pageUpdates.reduce((total, item) => total + item.changes, 0),
  documents: pageUpdates.map((item) => ({ path: item.snapshot.ref.path, fields: item.changes })),
}

if (!apply) {
  console.log(JSON.stringify(summary, null, 2))
  console.log('Dry run only. Re-run with --apply to archive and apply the approved UI content.')
  process.exit(0)
}

if (!footerChanged && pageUpdates.length === 0) {
  console.log(JSON.stringify(summary, null, 2))
  process.exit(0)
}

const batch = db.batch()
const archivedAt = new Date().toISOString()
const archiveSuffix = archivedAt.replace(/[:.]/g, '-')

if (footerChanged) {
  const archiveRef = db.collection('contentArchive').doc(`siteSettings--global--ui-sync--${archiveSuffix}`)
  batch.set(archiveRef, {
    sourceCollection: 'siteSettings',
    sourceId: 'global',
    sourcePath: settingsRef.path,
    archivedAt,
    archivedAtServer: FieldValue.serverTimestamp(),
    reason: 'Approved compact footer UI content sync.',
    data: settings,
  })
  batch.update(settingsRef, {
    'locales.en.footer': nextFooter,
    updatedAt: archivedAt,
  })
}

for (const update of pageUpdates) {
  const archiveRef = db.collection('contentArchive').doc(`${update.snapshot.ref.path.replace('/', '--')}--ui-sync--${archiveSuffix}`)
  batch.set(archiveRef, {
    sourceCollection: update.snapshot.ref.parent.id,
    sourceId: update.snapshot.id,
    sourcePath: update.snapshot.ref.path,
    archivedAt,
    archivedAtServer: FieldValue.serverTimestamp(),
    reason: 'Approved PHINƠI metric consistency sync.',
    data: update.snapshot.data(),
  })
  batch.set(update.snapshot.ref, {
    ...update.data,
    updatedAt: archivedAt,
  })
}

await batch.commit()
console.log(JSON.stringify({ ...summary, archivedAt }, null, 2))
