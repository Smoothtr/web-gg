import { compactPackageByLang } from '../../brandContent'
import { PackageDetailView } from '../pageViews'
import { generateCmsPageMetadata } from '../routeMetadata'

export const revalidate = 5

export function generateMetadata() {
  return generateCmsPageMetadata('the-one-scale', 'vi', compactPackageByLang.vi.partner.meta)
}

export default function Page() {
  return <PackageDetailView lang="vi" packageKey="partner" pageId="the-one-scale" />
}
