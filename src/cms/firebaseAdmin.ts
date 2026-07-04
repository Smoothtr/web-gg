import 'server-only'

import { cert, getApps, initializeApp, type App } from 'firebase-admin/app'
import { getFirestore, type Firestore } from 'firebase-admin/firestore'

let adminApp: App | null = null
let adminDb: Firestore | null = null
let adminAuth: import('firebase-admin/auth').Auth | null = null

export function isFirebaseAdminConfigured() {
  return Boolean(
    process.env.FIREBASE_ADMIN_PROJECT_ID &&
      process.env.FIREBASE_ADMIN_CLIENT_EMAIL &&
      process.env.FIREBASE_ADMIN_PRIVATE_KEY,
  )
}

function getAdminApp() {
  if (!isFirebaseAdminConfigured()) return null
  if (adminApp) return adminApp

  const existingApp = getApps().find((app) => app.name === 'gg99-admin')
  adminApp =
    existingApp ??
    initializeApp(
      {
        credential: cert({
          projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
          clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      },
      'gg99-admin',
    )

  return adminApp
}

export function getFirebaseAdminDb() {
  const app = getAdminApp()
  if (!app) return null
  if (!adminDb) adminDb = getFirestore(app)
  return adminDb
}

export async function getFirebaseAdminAuth() {
  const app = getAdminApp()
  if (!app) return null
  if (!adminAuth) {
    const { getAuth } = await import('firebase-admin/auth')
    adminAuth = getAuth(app)
  }
  return adminAuth
}
