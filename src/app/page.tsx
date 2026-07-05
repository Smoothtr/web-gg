import { homeMetaByLang } from '../brandContent'
import { generateCmsPageMetadata } from './routeMetadata'
import { HomeView } from './pageViews'

export const revalidate = 5

export function generateMetadata() {
  return generateCmsPageMetadata('homepage', 'vi', homeMetaByLang.vi)
}

export default function Page() {
  return <HomeView lang="vi" pageId="homepage" />
}
