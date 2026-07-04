import { absoluteUrl, logoUrl, organizationSchema, siteUrl, websiteSchema, type PageMeta } from '../../brandContent'
import { getServerCmsSiteSettings } from '../../cms/serverRepository'
import { Gg99EntityPage } from '../../views/Gg99EntityPage'
import { createMetadata, JsonLd } from '../seo'

export const revalidate = 5

const meta: PageMeta = {
  title: 'gg99.vn la gi? | The One - GG99',
  description:
    'gg99.vn la website chinh thuc cua The One - GG99, growth partner cho startups va SMEs ve brand, website, CRM, automation va performance marketing. Khong phai casino hay ca cuoc.',
  path: '/gg99-vn-la-gi',
  ogTitle: 'gg99.vn la gi? | The One - GG99',
  ogDescription:
    'Cau tra loi chinh thuc: gg99.vn la website cua The One - GG99, khong phai casino, co bac hay ca cuoc truc tuyen.',
  ogImage: '/og-the-one-gg99.jpg',
}

const faq = [
  ['gg99.vn la gi?', 'gg99.vn la website chinh thuc cua The One - GG99, mot growth partner cho startups va SMEs.'],
  ['gg99.vn co phai casino khong?', 'Khong. gg99.vn khong phai casino, co bac, ca cuoc, slot, nap/rut hay tro choi doi thuong.'],
  ['The One - GG99 lam gi?', 'The One - GG99 giup startups va SMEs xay brand, website, CRM, automation va performance marketing trong mot he tang truong ket noi.'],
]

const pageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${siteUrl}/gg99-vn-la-gi#webpage`,
  url: absoluteUrl('/gg99-vn-la-gi'),
  name: 'gg99.vn la gi?',
  headline: 'gg99.vn la gi?',
  description: meta.description,
  inLanguage: 'vi',
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
  '@id': `${siteUrl}/gg99-vn-la-gi#faq`,
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
  return createMetadata(meta, 'vi')
}

export default async function Page() {
  const siteSettings = await getServerCmsSiteSettings()

  return (
    <>
      <JsonLd items={[organizationSchema, websiteSchema, pageSchema, faqSchema]} />
      <Gg99EntityPage lang="vi" siteSettings={siteSettings} />
    </>
  )
}
