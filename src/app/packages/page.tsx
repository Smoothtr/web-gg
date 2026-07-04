import { packagesMetaByLang } from '../../brandContent'
import { PackagesView } from '../pageViews'
import { generateCmsPageMetadata } from '../routeMetadata'

export const revalidate = 5

export function generateMetadata() {
  return generateCmsPageMetadata('packages', 'en', packagesMetaByLang.vi)
}

export default function Page() {
  return <PackagesView lang="en" pageId="packages" />
}
