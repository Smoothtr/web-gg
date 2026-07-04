import type { Metadata } from 'next'

export function adminMetadata(title: string): Metadata {
  return {
    title,
    robots: { index: false, follow: false },
  }
}
