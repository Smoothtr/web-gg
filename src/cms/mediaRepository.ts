import { getFirebaseClient } from './firebaseClient'
import { getImageRequirements, getVideoRequirements } from './mediaRequirements'

const MAX_IMAGE_BYTES = 10 * 1024 * 1024
const MAX_VIDEO_BYTES = 25 * 1024 * 1024

export type CmsUploadKind = 'image' | 'video'

type PrepareUploadResponse = {
  ok?: boolean
  error?: string
  uploadUrl?: string
  apiKey?: string
  params?: Record<string, string>
  signature?: string
  intent?: string
}

type CloudinaryUploadResponse = {
  asset_id?: string
  error?: { message?: string }
}

type CompleteUploadResponse = {
  ok?: boolean
  error?: string
  url?: string
}

async function getImageDimensions(file: File) {
  if ('createImageBitmap' in window) {
    const bitmap = await createImageBitmap(file)
    const dimensions = { width: bitmap.width, height: bitmap.height }
    bitmap.close()
    return dimensions
  }

  return await new Promise<{ width: number; height: number }>((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const image = new Image()
    image.onload = () => {
      URL.revokeObjectURL(url)
      resolve({ width: image.naturalWidth, height: image.naturalHeight })
    }
    image.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Could not read image dimensions.'))
    }
    image.src = url
  })
}

async function getVideoDimensions(file: File) {
  return await new Promise<{ width: number; height: number }>((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const video = document.createElement('video')
    const cleanup = () => {
      video.removeAttribute('src')
      video.load()
      URL.revokeObjectURL(url)
    }
    video.preload = 'metadata'
    video.onloadedmetadata = () => {
      const dimensions = { width: video.videoWidth, height: video.videoHeight }
      cleanup()
      resolve(dimensions)
    }
    video.onerror = () => {
      cleanup()
      reject(new Error('Could not read video dimensions.'))
    }
    video.src = url
  })
}

async function validateUploadFile(file: File, kind: CmsUploadKind, folder: string) {
  if (kind === 'video') {
    if (!['video/mp4', 'video/webm', 'video/ogg'].includes(file.type)) {
      throw new Error('Please upload an MP4, WebM, or OGG video.')
    }
    if (file.size > MAX_VIDEO_BYTES) {
      throw new Error('Video files must be 25MB or smaller.')
    }
    const requirements = getVideoRequirements(folder)
    if (requirements) {
      const { width, height } = await getVideoDimensions(file)
      const ratio = width / Math.max(1, height)
      if (width < requirements.minWidth || height < requirements.minHeight) {
        throw new Error(`${requirements.label} must be at least ${requirements.minWidth}x${requirements.minHeight}px. Selected video is ${width}x${height}px.`)
      }
      if (ratio < requirements.minRatio || ratio > requirements.maxRatio) {
        throw new Error(`${requirements.label} has the wrong aspect ratio.`)
      }
    }
    return
  }

  if (!['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(file.type)) {
    throw new Error('Please upload a JPEG, PNG, WebP, or AVIF image.')
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error('Images must be 10MB or smaller.')
  }

  const requirements = getImageRequirements(folder)
  if (requirements) {
    const { width, height } = await getImageDimensions(file)
    const ratio = width / Math.max(1, height)
    if (width < requirements.minWidth || height < requirements.minHeight) {
      throw new Error(`${requirements.label} must be at least ${requirements.minWidth}x${requirements.minHeight}px. Selected image is ${width}x${height}px.`)
    }
    if (ratio < requirements.minRatio || ratio > requirements.maxRatio) {
      throw new Error(`${requirements.label} has the wrong aspect ratio. Please use the crop guidance shown in the editor.`)
    }
  }
}

export async function uploadCmsAsset(file: File, folder = 'cms', kind: CmsUploadKind = 'image') {
  await validateUploadFile(file, kind, folder)

  const { auth } = getFirebaseClient()
  const token = await auth.currentUser?.getIdToken()
  if (!token) {
    throw new Error('Please sign in to the admin before uploading files.')
  }

  const prepareResponse = await fetch('/api/admin/upload', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'prepare',
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      folder,
      kind,
    }),
  })

  const prepared = (await prepareResponse.json().catch(() => null)) as PrepareUploadResponse | null
  if (
    !prepareResponse.ok ||
    !prepared?.ok ||
    !prepared.uploadUrl ||
    !prepared.apiKey ||
    !prepared.params ||
    !prepared.signature ||
    !prepared.intent
  ) {
    throw new Error(prepared?.error || 'Could not prepare a secure Cloudinary upload.')
  }

  const uploadBody = new FormData()
  uploadBody.append('file', file, file.name)
  uploadBody.append('api_key', prepared.apiKey)
  for (const [key, value] of Object.entries(prepared.params)) uploadBody.append(key, value)
  uploadBody.append('signature', prepared.signature)

  const cloudinaryResponse = await fetch(prepared.uploadUrl, { method: 'POST', body: uploadBody })
  const cloudinaryResult = (await cloudinaryResponse.json().catch(() => null)) as CloudinaryUploadResponse | null
  if (!cloudinaryResponse.ok || !cloudinaryResult?.asset_id) {
    throw new Error(cloudinaryResult?.error?.message || 'Cloudinary could not store the uploaded file.')
  }

  const freshToken = await auth.currentUser?.getIdToken()
  if (!freshToken) throw new Error('The admin session expired before the upload could be verified.')
  const completeResponse = await fetch('/api/admin/upload', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${freshToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ action: 'complete', intent: prepared.intent, assetId: cloudinaryResult.asset_id }),
  })
  const completed = (await completeResponse.json().catch(() => null)) as CompleteUploadResponse | null
  if (!completeResponse.ok || !completed?.ok || !completed.url) {
    throw new Error(completed?.error || 'The uploaded file could not be verified.')
  }

  return completed.url
}
