import { compactTheOneByLang } from '../../brandContent'
import { TheOneView } from '../pageViews'
import { generateCmsPageMetadata } from '../routeMetadata'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export function generateMetadata() {
  return generateCmsPageMetadata('the-one', 'en', compactTheOneByLang.en.meta)
}

export default function Page() {
  return <TheOneView lang="en" pageId="the-one" />
}
