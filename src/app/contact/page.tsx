import { contactMeta } from '../../brandContent'
import { ContactView } from '../pageViews'
import { generateCmsPageMetadata } from '../routeMetadata'

export const revalidate = 5

export function generateMetadata() {
  return generateCmsPageMetadata('contact', 'en', contactMeta)
}

export default function Page() {
  return <ContactView />
}
