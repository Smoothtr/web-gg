import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore'
import { getFirebaseClient } from './firebaseClient'
import { defaultCmsInsights, defaultCmsPages, defaultCmsSiteSettings } from './defaultContent'
import { mergeCmsSiteSettings } from './siteSettings'
import type { CmsInsightContent, CmsPageContent, CmsSiteSettings } from './types'

const PAGE_COLLECTION = 'sitePages'
const INSIGHT_COLLECTION = 'insights'
const SITE_SETTINGS_COLLECTION = 'siteSettings'
const SITE_SETTINGS_DOC = 'global'

function stripUndefined<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

export async function listCmsPages() {
  const { db } = getFirebaseClient()
  const snapshot = await getDocs(query(collection(db, PAGE_COLLECTION), orderBy('title')))
  const pages = snapshot.docs.map((item) => item.data() as CmsPageContent)
  return pages.length ? pages : defaultCmsPages
}

export async function getCmsPage(id: string) {
  const { db } = getFirebaseClient()
  const snapshot = await getDoc(doc(db, PAGE_COLLECTION, id))
  return snapshot.exists() ? (snapshot.data() as CmsPageContent) : defaultCmsPages.find((page) => page.id === id)
}

export async function saveCmsPage(page: CmsPageContent) {
  const { db } = getFirebaseClient()
  await setDoc(doc(db, PAGE_COLLECTION, page.id), {
    ...stripUndefined(page),
    updatedAt: new Date().toISOString(),
    updatedAtServer: serverTimestamp(),
  })
}

export async function listCmsInsights() {
  const { db } = getFirebaseClient()
  const snapshot = await getDocs(query(collection(db, INSIGHT_COLLECTION), orderBy('dateModified', 'desc')))
  const posts = snapshot.docs.map((item) => item.data() as CmsInsightContent)
  return posts.length ? posts : defaultCmsInsights
}

export async function getCmsInsight(slug: string) {
  const { db } = getFirebaseClient()
  const snapshot = await getDoc(doc(db, INSIGHT_COLLECTION, slug))
  return snapshot.exists()
    ? (snapshot.data() as CmsInsightContent)
    : defaultCmsInsights.find((post) => post.slug === slug)
}

export async function saveCmsInsight(post: CmsInsightContent) {
  const { db } = getFirebaseClient()
  await setDoc(doc(db, INSIGHT_COLLECTION, post.slug), {
    ...stripUndefined(post),
    updatedAt: new Date().toISOString(),
    updatedAtServer: serverTimestamp(),
  })
}

export async function getCmsSiteSettings() {
  const { db } = getFirebaseClient()
  const snapshot = await getDoc(doc(db, SITE_SETTINGS_COLLECTION, SITE_SETTINGS_DOC))
  return snapshot.exists()
    ? mergeCmsSiteSettings(snapshot.data() as CmsSiteSettings)
    : defaultCmsSiteSettings
}

export async function saveCmsSiteSettings(settings: CmsSiteSettings) {
  const { db } = getFirebaseClient()
  await setDoc(doc(db, SITE_SETTINGS_COLLECTION, SITE_SETTINGS_DOC), {
    ...stripUndefined(mergeCmsSiteSettings(settings)),
    updatedAt: new Date().toISOString(),
    updatedAtServer: serverTimestamp(),
  })
}

export async function seedDefaultContent() {
  await Promise.all([
    ...defaultCmsPages.map((page) => saveCmsPage(page)),
    ...defaultCmsInsights.map((post) => saveCmsInsight(post)),
    saveCmsSiteSettings(defaultCmsSiteSettings),
  ])
}
