import { getServerCmsSiteSettings } from '../../cms/serverRepository'
import AboutPage from '../../views/AboutPage'
import { createMetadata } from '../seo'

export const revalidate = 5

export function generateMetadata() {
  return createMetadata({
    title: 'Gioi thieu The One - GG99',
    description: 'Tim hieu ve The One - GG99 va he sinh thai van hanh, toi uu, marketing, ecommerce va du lieu.',
    path: '/gioi-thieu',
  })
}

export default async function Page() {
  const siteSettings = await getServerCmsSiteSettings()
  return <AboutPage siteSettings={siteSettings} />
}
