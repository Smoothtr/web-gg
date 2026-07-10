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
const homepageRef = db.collection('sitePages').doc('homepage')
const homepageSnapshot = await homepageRef.get()

if (!homepageSnapshot.exists) throw new Error('sitePages/homepage does not exist')

const homepage = homepageSnapshot.data()
const changedPaths = []
const closingMobileSources = {
  backgroundVideoMobileUrl: '/closing/closing-portal-1440.mp4',
  backgroundVideoMobileWebmUrl: '/closing/closing-portal-1440.webm',
}
const blocks = Array.isArray(homepage.blocks)
  ? homepage.blocks.map((block, index) => {
      if (!block || typeof block !== 'object') return block

      let next = block
      if (block.id === 'hero' && block.heroTextAlign !== 'center') {
        next = { ...next, heroTextAlign: 'center' }
        changedPaths.push(`blocks[${index}].heroTextAlign`)
      }

      const englishLocale = next.locales?.en
      if (block.id === 'hero' && englishLocale && englishLocale.heroTextAlign !== 'center') {
        next = {
          ...next,
          locales: {
            ...next.locales,
            en: { ...englishLocale, heroTextAlign: 'center' },
          },
        }
        changedPaths.push(`blocks[${index}].locales.en.heroTextAlign`)
      }

      if (block.id === 'closing') {
        for (const [field, source] of Object.entries(closingMobileSources)) {
          if (next[field] && next[field] !== '/closing/closing-portal-1280.mp4' && next[field] !== '/closing/closing-portal-1280.webm') continue
          if (next[field] !== source) {
            next = { ...next, [field]: source }
            changedPaths.push(`blocks[${index}].${field}`)
          }
        }

        const closingEnglish = next.locales?.en
        if (closingEnglish) {
          let nextEnglish = closingEnglish
          for (const [field, source] of Object.entries(closingMobileSources)) {
            if (nextEnglish[field] && nextEnglish[field] !== '/closing/closing-portal-1280.mp4' && nextEnglish[field] !== '/closing/closing-portal-1280.webm') continue
            if (nextEnglish[field] !== source) {
              nextEnglish = { ...nextEnglish, [field]: source }
              changedPaths.push(`blocks[${index}].locales.en.${field}`)
            }
          }
          if (nextEnglish !== closingEnglish) {
            next = { ...next, locales: { ...next.locales, en: nextEnglish } }
          }
        }
      }
      return next
    })
  : []

const summary = {
  mode: apply ? 'apply' : 'dry-run',
  document: homepageRef.path,
  fieldsToUpdate: changedPaths,
}

console.log(JSON.stringify(summary, null, 2))

if (!apply) {
  console.log('Dry run only. Re-run with --apply after reviewing the field list.')
  process.exit(0)
}

if (!changedPaths.length) process.exit(0)

const archivedAt = new Date().toISOString()
const archiveSuffix = archivedAt.replace(/[:.]/g, '-')
const archiveRef = db.collection('contentArchive').doc(`sitePages--homepage--presentation--${archiveSuffix}`)
const batch = db.batch()

batch.set(archiveRef, {
  sourceCollection: 'sitePages',
  sourceId: 'homepage',
  sourcePath: homepageRef.path,
  archivedAt,
  archivedAtServer: FieldValue.serverTimestamp(),
  reason: 'Approved homepage hero alignment and adaptive closing-media migration.',
  data: homepage,
})
batch.set(homepageRef, { ...homepage, blocks, updatedAt: archivedAt })

await batch.commit()
console.log(JSON.stringify({ ...summary, archivedAt }, null, 2))
