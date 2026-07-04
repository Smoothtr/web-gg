import { getServerCmsSiteSettings } from '../../cms/serverRepository'
import { PrivacyPage } from '../../views/LegalPage'
import { createMetadata } from '../seo'

export const revalidate = 5

export function generateMetadata() {
  return createMetadata({
    title: 'Chinh sach bao mat - GG99',
    description: 'Chinh sach bao mat cua The One - GG99.',
    path: '/chinh-sach-bao-mat',
  })
}

export default async function Page() {
  const siteSettings = await getServerCmsSiteSettings()
  return <PrivacyPage siteSettings={siteSettings} />
}
