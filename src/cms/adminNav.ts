// Central map of CMS page ids -> public routes + admin grouping.
// Keep in sync with src/app/**/page.tsx pageId props when routes change.

export const hiddenCmsPageIds = new Set([
  'the-one-consultant',
  'the-one-agency',
  'the-one-partner',
  'the-one-start',
  'the-one-system',
  'the-one-scale',
])

export const pageGroups: Array<{ label: string; pageIds: string[] }> = [
  { label: 'Trang chinh', pageIds: ['homepage', 'the-one', 'packages'] },
  { label: 'Trang khac', pageIds: ['about', 'services', 'contact'] },
]

export const pageRevalidatePaths: Record<string, string[]> = {
  homepage: ['/', '/en'],
  'the-one': ['/the-one', '/en/the-one', '/', '/en'],
  packages: ['/packages', '/en/packages'],
  about: ['/about', '/en/about'],
  services: ['/services'],
  contact: ['/contact'],
}

export const siteSettingsRevalidatePaths = [
  '/',
  '/en',
  '/vi',
  '/ko',
  '/about',
  '/en/about',
  '/gioi-thieu',
  '/the-one',
  '/en/the-one',
  '/packages',
  '/en/packages',
  '/the-one-start',
  '/en/the-one-start',
  '/the-one-system',
  '/en/the-one-system',
  '/the-one-scale',
  '/en/the-one-scale',
  '/services',
  '/contact',
  '/insights',
  '/gg99-vn-la-gi',
  '/en/gg99-vn-la-gi',
  '/chinh-sach-bao-mat',
  '/dieu-khoan-dich-vu',
]

export function getPageRevalidatePaths(pageId: string) {
  return pageRevalidatePaths[pageId] ?? []
}

export function getInsightRevalidatePaths(slug: string) {
  return [`/insights/${slug}`, '/insights']
}
