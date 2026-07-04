import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { AdminDataProvider } from '../../admin/AdminDataContext'
import AdminShell from '../../admin/AdminShell'

export const metadata: Metadata = {
  title: { default: 'GG99 CMS', template: '%s · GG99 CMS' },
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminDataProvider>
      <AdminShell>{children}</AdminShell>
    </AdminDataProvider>
  )
}
