import { getFirebaseClient } from './firebaseClient'

const MAX_IMAGE_BYTES = 10 * 1024 * 1024
const MAX_VIDEO_BYTES = 25 * 1024 * 1024

export type CmsUploadKind = 'image' | 'video'

type UploadResponse = {
  ok?: boolean
  error?: string
  url?: string
}

type CloudinaryUploadResponse = {
  secure_url?: string
  error?: {
    message?: string
  }
}

const cloudinaryClientEnv: Record<string, string | undefined> = {
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME:
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || import.meta.env?.VITE_CLOUDINARY_CLOUD_NAME,
  NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET:
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || import.meta.env?.VITE_CLOUDINARY_UPLOAD_PRESET,
}

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

function sanitizeFolder(value: string) {
  const path = value
    .split('/')
    .map((segment) => slugify(segment))
    .filter(Boolean)
    .join('/')
  return path || 'cms'
}

function getCloudinaryPresetConfig() {
  const cloudName = cloudinaryClientEnv.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim()
  const uploadPreset = cloudinaryClientEnv.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET?.trim()
  if (!cloudName || !uploadPreset) return null
  return { cloudName, uploadPreset }
}

function getUploadResourceType(kind: CmsUploadKind) {
  return kind === 'video' ? 'video' : 'image'
}

function validateUploadFile(file: File, kind: CmsUploadKind) {
  if (kind === 'video') {
    if (!file.type.startsWith('video/')) {
      throw new Error('File upload phai la video.')
    }
    if (file.size > MAX_VIDEO_BYTES) {
      throw new Error('Video preview toi da 25MB.')
    }
    return
  }

  if (!file.type.startsWith('image/')) {
    throw new Error('File upload phai la anh.')
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error('Anh upload toi da 10MB.')
  }
}

async function uploadWithCloudinaryPreset(file: File, folder: string, kind: CmsUploadKind) {
  const config = getCloudinaryPresetConfig()
  if (!config) return null

  const body = new FormData()
  body.append('file', file)
  body.append('upload_preset', config.uploadPreset)
  body.append('folder', sanitizeFolder(folder))
  body.append('tags', 'gg99-cms')

  const response = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(config.cloudName)}/${getUploadResourceType(kind)}/upload`, {
    method: 'POST',
    body,
  })
  const payload = (await response.json().catch(() => null)) as CloudinaryUploadResponse | null

  if (!response.ok) {
    throw new Error(payload?.error?.message || `Cloudinary upload loi ${response.status}.`)
  }
  if (!payload?.secure_url) {
    throw new Error('Cloudinary khong tra ve URL file.')
  }

  return payload.secure_url
}

export async function uploadCmsAsset(file: File, folder = 'cms', kind: CmsUploadKind = 'image') {
  validateUploadFile(file, kind)

  const { auth } = getFirebaseClient()
  const token = await auth.currentUser?.getIdToken()
  if (!token) {
    throw new Error('Ban can dang nhap admin truoc khi upload file.')
  }

  const presetUploadUrl = await uploadWithCloudinaryPreset(file, folder, kind)
  if (presetUploadUrl) return presetUploadUrl

  const body = new FormData()
  body.append('file', file)
  body.append('folder', folder)
  body.append('kind', kind)

  const response = await fetch('/api/admin/upload', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body,
  })

  const payload = (await response.json().catch(() => null)) as UploadResponse | null
  if (!response.ok || !payload?.ok || !payload.url) {
    throw new Error(payload?.error || 'Khong upload duoc file len Cloudinary.')
  }

  return payload.url
}
