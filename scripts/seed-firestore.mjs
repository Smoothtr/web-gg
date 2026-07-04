import { mkdir, rm } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { cert, initializeApp } from 'firebase-admin/app'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'
import * as esbuild from 'esbuild'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const tempDir = path.join(rootDir, '.next', 'seed-cms')
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

const { defaultCmsInsights, defaultCmsPages, defaultCmsSiteSettings } = await import(pathToFileURL(compiledPath).href)
await rm(tempDir, { recursive: true, force: true })

function stripUndefined(value) {
  return JSON.parse(JSON.stringify(value))
}

const app = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
})

const db = getFirestore(app)
const batch = db.batch()
const now = new Date().toISOString()

for (const page of defaultCmsPages) {
  batch.set(db.collection('sitePages').doc(page.id), {
    ...stripUndefined(page),
    updatedAt: now,
    updatedAtServer: FieldValue.serverTimestamp(),
  })
}

for (const post of defaultCmsInsights) {
  batch.set(db.collection('insights').doc(post.slug), {
    ...stripUndefined(post),
    updatedAt: now,
    updatedAtServer: FieldValue.serverTimestamp(),
  })
}

batch.set(db.collection('siteSettings').doc('global'), {
  ...stripUndefined(defaultCmsSiteSettings),
  updatedAt: now,
  updatedAtServer: FieldValue.serverTimestamp(),
})

await batch.commit()

console.log(
  JSON.stringify({
    ok: true,
    sitePages: defaultCmsPages.length,
    insights: defaultCmsInsights.length,
    siteSettings: 1,
  }),
)
