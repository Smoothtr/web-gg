import { compactPackageByLang } from '../../../brandContent'
import { PackageDetailView } from '../../pageViews'
import { generateCmsPageMetadata } from '../../routeMetadata'

export const revalidate = 5

export function generateMetadata() {
  return generateCmsPageMetadata('the-one-system', 'en', compactPackageByLang.en.agency.meta)
}

export default function Page() {
  return <PackageDetailView lang="en" packageKey="agency" pageId="the-one-system" />
}
