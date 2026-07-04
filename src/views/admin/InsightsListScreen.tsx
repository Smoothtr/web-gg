'use client'

import Link from 'next/link'
import { Layers3, Sparkles } from 'lucide-react'
import { useAdminData } from '../../admin/AdminDataContext'
import { Card, StatusBadge } from '../../admin/ui'

export default function InsightsListScreen() {
  const { insights } = useAdminData()

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-extrabold uppercase tracking-widest text-primary">Insights</p>
        <h1 className="text-2xl font-extrabold text-on-surface">Bài viết ({insights.length})</h1>
        <p className="mt-1 text-sm text-on-surface-variant">Mở một bài viết để sửa nội dung, ảnh cover, SEO và từng section.</p>
      </div>

      <Card className="!p-0">
        <div className="divide-y divide-outline-variant/35">
          {insights.map((post) => (
            <Link
              key={post.slug}
              href={`/admin/insights/${post.slug}`}
              className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-surface-container-low"
            >
              <span className="flex min-w-0 items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Sparkles size={18} />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-extrabold text-on-surface">{post.title}</span>
                  <span className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant">
                    <span className="truncate">{post.category}</span>
                    <span className="flex items-center gap-1">
                      <Layers3 size={11} /> {post.sections.length} sections
                    </span>
                  </span>
                </span>
              </span>
              <StatusBadge value={post.status} />
            </Link>
          ))}
          {insights.length === 0 && <p className="px-5 py-6 text-sm text-on-surface-variant">Chưa có bài viết nào.</p>}
        </div>
      </Card>
    </div>
  )
}
