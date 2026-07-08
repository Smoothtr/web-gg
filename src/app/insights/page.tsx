import { insightsIndexMeta } from '../../brandContent'
import { InsightsIndexView } from '../pageViews'
import { createMetadata } from '../seo'

export const revalidate = 5

export function generateMetadata() {
  return createMetadata(insightsIndexMeta, 'en')
}

export default function Page() {
  return <InsightsIndexView />
}
