'use client'

import AboutTemplate from './AboutTemplate'
import type { CmsSiteSettings } from '../cms/types'

export default function AboutPage({ siteSettings }: { siteSettings?: CmsSiteSettings | null }) {
  return <AboutTemplate lang="vi" siteSettings={siteSettings} />
}
