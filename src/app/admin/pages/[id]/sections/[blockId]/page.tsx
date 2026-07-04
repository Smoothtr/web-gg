import SectionEditorScreen from '../../../../../../views/admin/SectionEditorScreen'
import { adminMetadata } from '../../../../adminMetadata'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ id: string; blockId: string }> }) {
  const { id, blockId } = await params
  return adminMetadata(`${id} / ${blockId}`)
}

export default async function Page({ params }: { params: Promise<{ id: string; blockId: string }> }) {
  const { id, blockId } = await params
  return <SectionEditorScreen pageId={id} blockId={blockId} />
}
