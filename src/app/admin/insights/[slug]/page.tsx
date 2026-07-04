import InsightEditorScreen from '../../../../views/admin/InsightEditorScreen'
import { adminMetadata } from '../../adminMetadata'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return adminMetadata(slug)
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <InsightEditorScreen slug={slug} />
}
