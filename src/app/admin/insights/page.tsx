import InsightsListScreen from '../../../views/admin/InsightsListScreen'
import { adminMetadata } from '../adminMetadata'

export const dynamic = 'force-dynamic'
export const metadata = adminMetadata('Insights')

export default function Page() {
  return <InsightsListScreen />
}
