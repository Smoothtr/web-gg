import { createHash } from 'node:crypto'
import { NextResponse, type NextRequest } from 'next/server'
import { getAdminEmails } from '../../../../cms/firebaseClient'
import { getFirebaseAdminAuth, isFirebaseAdminConfigured } from '../../../../cms/firebaseAdmin'

export const runtime = 'nodejs'

const MAX_IMAGE_BYTES = 10 * 1024 * 1024
const MAX_VIDEO_BYTES = 25 * 1024 * 1024

type UploadKind = 'image' | 'video'

type CloudinaryUploadResponse = {
  secure_url?: string
  public_id?: string
  error?: {
    message?: string
  }
}

function isCloudinaryConfigured() {
  return Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET)
}

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

function sanitizeFolder(value: FormDataEntryValue | null) {
  const folder = typeof value === 'string' ? value : 'cms'
  const path = folder
    .split('/')
    .map((segment) => slugify(segment))
    .filter(Boolean)
    .join('/')
  return path || 'cms'
}

function buildPublicId(fileName: string) {
  const dotIndex = fileName.lastIndexOf('.')
  const base = dotIndex >= 0 ? fileName.slice(0, dotIndex) : fileName
  return `${Date.now()}-${slugify(base) || 'image'}`
}

function getUploadKind(value: FormDataEntryValue | null): UploadKind {
  return value === 'video' ? 'video' : 'image'
}

function validateFile(file: File, kind: UploadKind) {
  if (kind === 'video') {
    if (!file.type.startsWith('video/')) {
      return 'File upload phai la video.'
    }
    if (file.size > MAX_VIDEO_BYTES) {
      return 'Video preview toi da 25MB.'
    }
    return ''
  }

  if (!file.type.startsWith('image/')) {
    return 'File upload phai la anh.'
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return 'Anh upload toi da 10MB.'
  }
  return ''
}

function createSignature(params: Record<string, string>, apiSecret: string) {
  const payload = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join('&')
  return createHash('sha1').update(`${payload}${apiSecret}`).digest('hex')
}

async function getAdminError(request: NextRequest) {
  if (!isFirebaseAdminConfigured()) {
    return NextResponse.json({ ok: false, error: 'Firebase admin chua duoc cau hinh tren server.' }, { status: 503 })
  }

  const authHeader = request.headers.get('authorization') ?? ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice('Bearer '.length) : ''
  if (!token) {
    return NextResponse.json({ ok: false, error: 'Thieu token dang nhap.' }, { status: 401 })
  }

  const auth = await getFirebaseAdminAuth()
  if (!auth) {
    return NextResponse.json({ ok: false, error: 'Firebase admin chua duoc cau hinh tren server.' }, { status: 503 })
  }

  let email = ''
  try {
    const decoded = await auth.verifyIdToken(token)
    email = (decoded.email ?? '').toLowerCase()
  } catch {
    return NextResponse.json({ ok: false, error: 'Token khong hop le.' }, { status: 401 })
  }

  const adminEmails = getAdminEmails()
  if (!email || !adminEmails.includes(email)) {
    return NextResponse.json({ ok: false, error: 'Tai khoan khong co quyen admin.' }, { status: 403 })
  }

  return null
}

export async function POST(request: NextRequest) {
  const adminError = await getAdminError(request)
  if (adminError) return adminError

  if (!isCloudinaryConfigured()) {
    return NextResponse.json({ ok: false, error: 'Cloudinary chua duoc cau hinh tren server.' }, { status: 503 })
  }

  const contentType = request.headers.get('content-type') ?? ''
  if (!contentType.includes('multipart/form-data')) {
    return NextResponse.json({ ok: false, error: 'Request upload khong dung dinh dang.' }, { status: 400 })
  }

  const body = await request.formData()
  const file = body.get('file')
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: 'Thieu file upload.' }, { status: 400 })
  }
  const kind = getUploadKind(body.get('kind'))
  const validationError = validateFile(file, kind)
  if (validationError) return NextResponse.json({ ok: false, error: validationError }, { status: 400 })

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME as string
  const apiKey = process.env.CLOUDINARY_API_KEY as string
  const apiSecret = process.env.CLOUDINARY_API_SECRET as string
  const uploadParams = {
    folder: sanitizeFolder(body.get('folder')),
    public_id: buildPublicId(file.name),
    tags: 'gg99-cms',
    timestamp: String(Math.floor(Date.now() / 1000)),
  }
  const signature = createSignature(uploadParams, apiSecret)

  const cloudinaryBody = new FormData()
  cloudinaryBody.append('file', file, file.name)
  cloudinaryBody.append('api_key', apiKey)
  cloudinaryBody.append('folder', uploadParams.folder)
  cloudinaryBody.append('public_id', uploadParams.public_id)
  cloudinaryBody.append('tags', uploadParams.tags)
  cloudinaryBody.append('timestamp', uploadParams.timestamp)
  cloudinaryBody.append('signature', signature)

  const response = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/${kind}/upload`, {
    method: 'POST',
    body: cloudinaryBody,
  })
  const result = (await response.json().catch(() => null)) as CloudinaryUploadResponse | null

  if (!response.ok) {
    return NextResponse.json(
      { ok: false, error: result?.error?.message || `Cloudinary upload loi ${response.status}.` },
      { status: response.status },
    )
  }

  if (!result?.secure_url) {
    return NextResponse.json({ ok: false, error: 'Cloudinary khong tra ve URL file.' }, { status: 502 })
  }

  return NextResponse.json({ ok: true, url: result.secure_url, publicId: result.public_id })
}
