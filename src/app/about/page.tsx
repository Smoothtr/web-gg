import { aboutMetaByLang } from '../../brandContent'
import { AboutView } from '../pageViews'
import { generateCmsPageMetadata } from '../routeMetadata'

export const revalidate = 5

export function generateMetadata() {
  return generateCmsPageMetadata('about', 'vi', aboutMetaByLang.vi)
}

export default function Page() {
  return <AboutView lang="vi" pageId="about" />
}
