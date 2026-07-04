import InsightSectionEditorScreen from '../../../../../../views/admin/InsightSectionEditorScreen'
import { adminMetadata } from '../../../../adminMetadata'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string; index: string }> }) {
  const { slug, index } = await params
  return adminMetadata(`${slug} / section ${Number(index) + 1}`)
}

export default async function Page({ params }: { params: Promise<{ slug: string; index: string }> }) {
  const { slug, index } = await params
  return <InsightSectionEditorScreen slug={slug} index={Number(index)} />
}
