'use client'

import type { ReactNode } from 'react'
import IntroLoader from '../components/IntroLoader'

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <>
      <IntroLoader />
      {children}
    </>
  )
}
