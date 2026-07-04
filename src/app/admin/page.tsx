import DashboardScreen from '../../views/admin/DashboardScreen'
import { adminMetadata } from './adminMetadata'

export const dynamic = 'force-dynamic'
export const metadata = adminMetadata('Dashboard')

export default function Page() {
  return <DashboardScreen />
}
