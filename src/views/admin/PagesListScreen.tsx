'use client'

import Link from 'next/link'
import { FileText, Layers3 } from 'lucide-react'
import { useAdminData } from '../../admin/AdminDataContext'
import { Card, StatusBadge } from '../../admin/ui'

export default function PagesListScreen() {
  const { pages } = useAdminData()

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-extrabold uppercase tracking-widest text-primary">Pages</p>
        <h1 className="text-2xl font-extrabold text-on-surface">Trang web ({pages.length})</h1>
        <p className="mt-1 text-sm text-on-surface-variant">Mở một trang để sửa thông tin chung, SEO và từng section riêng biệt.</p>
      </div>

      <Card className="!p-0">
        <div className="divide-y divide-outline-variant/35">
          {pages.map((page) => (
            <Link
              key={page.id}
              href={`/admin/pages/${page.id}`}
              className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-surface-container-low"
            >
              <span className="flex min-w-0 items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <FileText size={18} />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-extrabold text-on-surface">{page.title}</span>
                  <span className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant">
                    <span className="truncate">{page.meta.path}</span>
                    <span className="flex items-center gap-1">
                      <Layers3 size={11} /> {page.blocks.length} sections
                    </span>
                  </span>
                </span>
              </span>
              <StatusBadge value={page.status} />
            </Link>
          ))}
        </div>
      </Card>
    </div>
  )
}
