'use client'

import type { ReactNode } from 'react'
import IntroLoader from '../components/IntroLoader'

export function AppShell({ children, introLoaderEnabled = false }: { children: ReactNode; introLoaderEnabled?: boolean }) {
  return (
    <>
      {introLoaderEnabled && <IntroLoader />}
      {children}
    </>
  )
}
