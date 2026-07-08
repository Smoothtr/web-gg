// Full Firestore export for safekeeping before destructive migrations.
// Usage: node --env-file=.env.local scripts/backup-firestore.mjs
import { writeFileSync, mkdirSync } from 'node:fs'
import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

const app = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
})
const db = getFirestore(app)

const backup = {}
for (const col of await db.listCollections()) {
  const snapshot = await col.get()
  backup[col.id] = {}
  snapshot.forEach((doc) => {
    backup[col.id][doc.id] = doc.data()
  })
}

mkdirSync('backups', { recursive: true })
const stamp = new Date().toISOString().replace(/[:.]/g, '-')
const file = `backups/firestore-backup-${stamp}.json`
writeFileSync(file, JSON.stringify(backup, null, 2))
console.log(`Backed up ${Object.entries(backup).map(([k, v]) => `${k}(${Object.keys(v).length})`).join(', ')} -> ${file}`)
