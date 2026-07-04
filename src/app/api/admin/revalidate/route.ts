import { revalidatePath } from 'next/cache'
import { NextResponse, type NextRequest } from 'next/server'
import { getAdminEmails } from '../../../../cms/firebaseClient'
import { getFirebaseAdminAuth, isFirebaseAdminConfigured } from '../../../../cms/firebaseAdmin'

export async function POST(request: NextRequest) {
  if (!isFirebaseAdminConfigured()) {
    return NextResponse.json({ ok: false, error: 'Firebase admin chưa được cấu hình trên server.' }, { status: 503 })
  }

  const authHeader = request.headers.get('authorization') ?? ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice('Bearer '.length) : ''
  if (!token) {
    return NextResponse.json({ ok: false, error: 'Thiếu token đăng nhập.' }, { status: 401 })
  }

  const auth = await getFirebaseAdminAuth()
  if (!auth) {
    return NextResponse.json({ ok: false, error: 'Firebase admin chưa được cấu hình trên server.' }, { status: 503 })
  }

  let email = ''
  try {
    const decoded = await auth.verifyIdToken(token)
    email = (decoded.email ?? '').toLowerCase()
  } catch {
    return NextResponse.json({ ok: false, error: 'Token không hợp lệ.' }, { status: 401 })
  }

  const adminEmails = getAdminEmails()
  if (!email || !adminEmails.includes(email)) {
    return NextResponse.json({ ok: false, error: 'Tài khoản không có quyền admin.' }, { status: 403 })
  }

  const body = (await request.json().catch(() => ({}))) as { paths?: unknown }
  const paths = Array.isArray(body.paths)
    ? body.paths.filter((path): path is string => typeof path === 'string' && path.startsWith('/')).slice(0, 80)
    : []

  for (const path of paths) revalidatePath(path)

  return NextResponse.json({ ok: true, paths })
}
