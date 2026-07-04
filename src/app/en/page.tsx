import { homeMetaByLang } from '../../brandContent'
import { HomeView } from '../pageViews'
import { generateCmsPageMetadata } from '../routeMetadata'

export const revalidate = 5

export function generateMetadata() {
  return generateCmsPageMetadata('homepage', 'en', homeMetaByLang.en)
}

export default function Page() {
  return <HomeView lang="en" pageId="homepage" />
}
