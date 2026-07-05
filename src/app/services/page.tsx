import { servicesMeta } from '../../brandContent'
import { ServicesView } from '../pageViews'
import { generateCmsPageMetadata } from '../routeMetadata'

export const revalidate = 5

export function generateMetadata() {
  return generateCmsPageMetadata('services', 'vi', servicesMeta)
}

export default function Page() {
  return <ServicesView lang="vi" />
}
