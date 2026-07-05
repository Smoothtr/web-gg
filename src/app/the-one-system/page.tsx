import { compactPackageByLang } from '../../brandContent'
import { PackageDetailView } from '../pageViews'
import { generateCmsPageMetadata } from '../routeMetadata'

export const revalidate = 5

export function generateMetadata() {
  return generateCmsPageMetadata('the-one-system', 'vi', compactPackageByLang.vi.agency.meta)
}

export default function Page() {
  return <PackageDetailView lang="vi" packageKey="agency" pageId="the-one-system" />
}
