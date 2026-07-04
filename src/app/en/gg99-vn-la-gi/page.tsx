import { absoluteUrl, logoUrl, organizationSchema, siteUrl, websiteSchema, type PageMeta } from '../../../brandContent'
import { getServerCmsSiteSettings } from '../../../cms/serverRepository'
import { Gg99EntityPage } from '../../../views/Gg99EntityPage'
import { createMetadata, JsonLd } from '../../seo'

export const revalidate = 5

const meta: PageMeta = {
  title: 'What is gg99.vn? | The One - GG99',
  description:
    'gg99.vn is the official website of The One - GG99, a growth partner for startups and SMEs across brand, website, CRM, automation and performance marketing. It is not a casino or betting website.',
  path: '/en/gg99-vn-la-gi',
  ogTitle: 'What is gg99.vn? | The One - GG99',
  ogDescription:
    'Official answer: gg99.vn is the website of The One - GG99, not a casino, gambling or betting website.',
  ogImage: '/og-the-one-gg99.jpg',
}

const faq = [
  ['What is gg99.vn?', 'gg99.vn is the official website of The One - GG99, a growth partner for startups and SMEs.'],
  ['Is gg99.vn a casino?', 'No. gg99.vn is not a casino, gambling, betting, slot, deposit/withdrawal or reward game website.'],
  ['What does The One - GG99 do?', 'The One - GG99 helps startups and SMEs build brand, website, CRM, automation and performance marketing in one connected growth system.'],
]

const pageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${siteUrl}/en/gg99-vn-la-gi#webpage`,
  url: absoluteUrl('/en/gg99-vn-la-gi'),
  name: 'What is gg99.vn?',
  headline: 'What is gg99.vn?',
  description: meta.description,
  inLanguage: 'en',
  isPartOf: { '@id': `${siteUrl}/#website` },
  about: { '@id': `${siteUrl}/#organization` },
  primaryImageOfPage: logoUrl,
  mainEntity: {
    '@type': 'Organization',
    '@id': `${siteUrl}/#organization`,
    name: 'The One - GG99',
    url: siteUrl,
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': `${siteUrl}/en/gg99-vn-la-gi#faq`,
  mainEntity: faq.map(([question, answer]) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: answer,
    },
  })),
}

export function generateMetadata() {
  return createMetadata(meta, 'en')
}

export default async function Page() {
  const siteSettings = await getServerCmsSiteSettings()

  return (
    <>
      <JsonLd items={[organizationSchema, websiteSchema, pageSchema, faqSchema]} />
      <Gg99EntityPage lang="en" siteSettings={siteSettings} />
    </>
  )
}
