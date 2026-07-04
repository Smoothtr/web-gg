import { revalidatePath, revalidateTag } from 'next/cache'
import { NextResponse, type NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const configuredSecret = process.env.REVALIDATE_SECRET
  const providedSecret = request.headers.get('x-revalidate-secret')

  if (configuredSecret && providedSecret !== configuredSecret) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  const body = (await request.json().catch(() => ({}))) as {
    path?: string
    tag?: string
  }

  if (body.path) revalidatePath(body.path)
  if (body.tag) revalidateTag(body.tag, 'max')

  return NextResponse.json({ ok: true, path: body.path ?? null, tag: body.tag ?? null })
}
