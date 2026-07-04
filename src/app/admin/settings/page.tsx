import SiteSettingsScreen from '../../../views/admin/SiteSettingsScreen'
import { adminMetadata } from '../adminMetadata'

export const dynamic = 'force-dynamic'
export const metadata = adminMetadata('Header / Footer')

export default function Page() {
  return <SiteSettingsScreen />
}
