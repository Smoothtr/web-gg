import { getServerCmsSiteSettings } from '../../cms/serverRepository'
import { TermsPage } from '../../views/LegalPage'
import { createMetadata } from '../seo'

export const revalidate = 5

export function generateMetadata() {
  return createMetadata({
    title: 'Dieu khoan dich vu - GG99',
    description: 'Dieu khoan dich vu cua The One - GG99.',
    path: '/dieu-khoan-dich-vu',
  })
}

export default async function Page() {
  const siteSettings = await getServerCmsSiteSettings()
  return <TermsPage siteSettings={siteSettings} />
}
