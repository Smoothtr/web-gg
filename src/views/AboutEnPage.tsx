import AboutTemplate from './AboutTemplate'
import type { CmsSiteSettings } from '../cms/types'

export default function AboutEnPage({ siteSettings }: { siteSettings?: CmsSiteSettings | null }) {
  return <AboutTemplate lang="en" siteSettings={siteSettings} />
}
