import PageEditorScreen from '../../../../views/admin/PageEditorScreen'
import { adminMetadata } from '../../adminMetadata'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return adminMetadata(id)
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <PageEditorScreen pageId={id} />
}
