import type { CmsBlock } from './types'

const homepageSectionLabels: Record<string, string> = {
  hero: 'Hero - The One by gg99',
  'what-is': 'Explore - The One Services',
  packages: 'Packages',
  'red-flags': 'Red Flags',
  people: 'People',
  closing: 'Closing + FAQ',
}

export function getAdminSectionLabel(pageId: string, block: Pick<CmsBlock, 'id' | 'heading'>, index: number) {
  const mapped = pageId === 'homepage' ? homepageSectionLabels[block.id] : ''
  const label = mapped || block.heading || block.id || 'Untitled section'
  return `${String(index + 1).padStart(2, '0')} ${label}`
}
