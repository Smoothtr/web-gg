import { packagesMetaByLang } from '../../brandContent'
import { PackagesView } from '../pageViews'
import { generateCmsPageMetadata } from '../routeMetadata'

export const revalidate = 5

export function generateMetadata() {
  return generateCmsPageMetadata('packages', 'vi', packagesMetaByLang.vi)
}

export default function Page() {
  return <PackagesView lang="vi" pageId="packages" />
}
