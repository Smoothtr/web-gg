import { compactPackageByLang } from '../../brandContent'
import { PackageDetailView } from '../pageViews'
import { generateCmsPageMetadata } from '../routeMetadata'

export const revalidate = 5

export function generateMetadata() {
  return generateCmsPageMetadata('the-one-start', 'en', compactPackageByLang.en.consultant.meta)
}

export default function Page() {
  return <PackageDetailView lang="en" packageKey="consultant" pageId="the-one-start" />
}
