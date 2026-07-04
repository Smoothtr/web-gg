import PagesListScreen from '../../../views/admin/PagesListScreen'
import { adminMetadata } from '../adminMetadata'

export const dynamic = 'force-dynamic'
export const metadata = adminMetadata('Pages')

export default function Page() {
  return <PagesListScreen />
}
