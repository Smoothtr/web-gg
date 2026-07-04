import type { CmsPageContent } from './types'

export function getCmsBlock(page: CmsPageContent | null | undefined, id: string) {
  return page?.blocks.find((block) => block.id === id)
}

export function getCmsBlocks(page: CmsPageContent | null | undefined, excludeIds: string[] = []) {
  const excluded = new Set(excludeIds)
  return page?.blocks.filter((block) => !excluded.has(block.id)) ?? []
}

export function splitCmsParagraphs(body: string | null | undefined) {
  return String(body || '')
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
}
