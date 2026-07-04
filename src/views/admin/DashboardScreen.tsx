'use client'

import Link from 'next/link'
import { AlertTriangle, FileText, Settings2, Sparkles, UploadCloud } from 'lucide-react'
import { useAdminData } from '../../admin/AdminDataContext'
import { Card, StatusBadge } from '../../admin/ui'
import { pageGroups } from '../../cms/adminNav'
import type { CmsInsightContent, CmsPageContent } from '../../cms/types'

function formatDate(value?: string) {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleString('vi-VN', { dateStyle: 'medium', timeStyle: 'short' })
}

type ContentDebtItem = {
  label: string
  detail: string
  href: string
}

function buildContentDebtItems(pages: CmsPageContent[], insights: CmsInsightContent[]) {
  const items: ContentDebtItem[] = []
  const theOnePage = pages.find((page) => page.id === 'the-one')
  const storiesBlock = theOnePage?.blocks.find((block) => block.id === 'stories')

  ;(storiesBlock?.items ?? []).forEach((story, index) => {
    const label = story.title || story.displayName || story.id || `Story ${index + 1}`
    if (!(story.videoUrl?.trim() || story.embedUrl?.trim())) {
      items.push({
        label: `${label}: preview video`,
        detail: 'Missing MP4/WebM/OGG preview video for homepage hover/tap.',
        href: '/admin/pages/the-one/sections/stories',
      })
    }
    if (!(story.backgroundImages ?? []).some((url) => url.trim())) {
      items.push({
        label: `${label}: background carousel`,
        detail: 'Missing carousel images for The One Stories post background.',
        href: '/admin/pages/the-one/sections/stories',
      })
    }
    const socialLinks = story.socialLinks ?? {}
    const missingSocials = (['facebook', 'instagram', 'tiktok', 'website'] as const).filter((key) => !socialLinks[key]?.trim())
    if (missingSocials.length) {
      items.push({
        label: `${label}: social links`,
        detail: `Missing ${missingSocials.join(', ')}.`,
        href: '/admin/pages/the-one/sections/stories',
      })
    }
  })

  const homepage = pages.find((page) => page.id === 'homepage')
  const closingFaqCount =
    homepage?.blocks.find((block) => block.id === 'closing')?.items?.filter((item) => item.title.trim() && item.body?.trim()).length ?? 0
  if (closingFaqCount < 4) {
    items.push({
      label: 'Homepage Closing + FAQ',
      detail: `Only ${closingFaqCount}/4 recommended FAQ items are ready.`,
      href: '/admin/pages/homepage/sections/closing',
    })
  }

  insights.forEach((post) => {
    if (post.coverImageUrl?.trim() || post.coverImage?.trim()) return
    items.push({
      label: `${post.title}: insight cover`,
      detail: 'Missing cover image for insight listing and social sharing.',
      href: `/admin/insights/${post.slug}`,
    })
  })

  return items
}

export default function DashboardScreen() {
  const { pages, insights, seed, saving, message } = useAdminData()

  const publishedPages = pages.filter((page) => page.status === 'published').length
  const draftPages = pages.length - publishedPages
  const publishedInsights = insights.filter((post) => post.status === 'published').length
  const contentDebtItems = buildContentDebtItems(pages, insights)

  const recentlyUpdated = [...pages, ...insights]
    .filter((item) => item.updatedAt)
    .sort((a, b) => new Date(b.updatedAt ?? 0).getTime() - new Date(a.updatedAt ?? 0).getTime())
    .slice(0, 5)

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-extrabold uppercase tracking-widest text-primary">Tổng quan</p>
        <h1 className="text-2xl font-extrabold text-on-surface">Chào mừng trở lại</h1>
        <p className="mt-1 text-sm text-on-surface-variant">Chọn một trang hoặc bài viết bên trái để chỉnh sửa. Mọi thay đổi được lưu lên Firestore và tự động cập nhật lên web.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="!p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-on-surface-variant">Trang web</p>
          <p className="mt-1 text-3xl font-extrabold text-on-surface">{pages.length}</p>
          <p className="mt-1 text-xs font-semibold text-on-surface-variant">{publishedPages} published · {draftPages} draft</p>
        </Card>
        <Card className="!p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-on-surface-variant">Insights</p>
          <p className="mt-1 text-3xl font-extrabold text-on-surface">{insights.length}</p>
          <p className="mt-1 text-xs font-semibold text-on-surface-variant">{publishedInsights} published</p>
        </Card>
        <Card className="!p-4 sm:col-span-2 xl:col-span-2">
          <p className="text-xs font-bold uppercase tracking-wide text-on-surface-variant">Công cụ</p>
          <button
            onClick={() => void seed()}
            disabled={saving}
            className="mt-2 inline-flex items-center gap-2 rounded-xl border border-outline-variant px-3 py-2 text-xs font-extrabold text-primary disabled:opacity-60"
          >
            <UploadCloud size={14} /> {saving ? 'Đang seed...' : 'Seed lại nội dung mặc định'}
          </button>
          {message && <p className="mt-2 text-xs font-semibold text-green-700">{message}</p>}
        </Card>
      </div>

      <Card
        title="Cần hoàn thiện nội dung"
        description="Các mục này không chặn code deploy, nhưng cần team nội dung cập nhật để live site khớp acceptance."
        action={<AlertTriangle size={18} className={contentDebtItems.length ? 'text-primary' : 'text-green-700'} />}
      >
        {contentDebtItems.length === 0 ? (
          <p className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-bold text-green-800">
            Không thấy thiếu video, carousel, social link hoặc insight cover trong dữ liệu hiện tại.
          </p>
        ) : (
          <div className="grid gap-2">
            {contentDebtItems.slice(0, 12).map((item) => (
              <Link
                key={`${item.href}-${item.label}`}
                href={item.href}
                className="rounded-xl border border-outline-variant/45 bg-surface px-3 py-2.5 transition-colors hover:border-primary/50"
              >
                <span className="block text-sm font-extrabold text-on-surface">{item.label}</span>
                <span className="mt-0.5 block text-xs font-semibold leading-relaxed text-on-surface-variant">{item.detail}</span>
              </Link>
            ))}
            {contentDebtItems.length > 12 && (
              <p className="px-1 text-xs font-semibold text-on-surface-variant">
                +{contentDebtItems.length - 12} mục khác. Hoàn thiện các mục trên rồi refresh dashboard để xem tiếp.
              </p>
            )}
          </div>
        )}
      </Card>

      <Card title="Trang web" description="Nhóm theo khu vực, giống cấu trúc menu trên web.">
        <div className="grid gap-4 md:grid-cols-2">
          {pageGroups.map((group) => (
            <div key={group.label}>
              <p className="mb-2 text-xs font-extrabold uppercase tracking-widest text-on-surface-variant/70">{group.label}</p>
              <div className="space-y-2">
                {group.pageIds.map((pageId) => {
                  const page = pages.find((item) => item.id === pageId)
                  if (!page) return null
                  return (
                    <Link
                      key={pageId}
                      href={`/admin/pages/${pageId}`}
                      className="flex items-center justify-between gap-2 rounded-xl border border-outline-variant/45 bg-surface px-3 py-2.5 text-sm font-bold text-on-surface transition-colors hover:border-primary/50"
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        <FileText size={14} className="shrink-0 text-primary" />
                        <span className="truncate">{page.title}</span>
                      </span>
                      <StatusBadge value={page.status} />
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Site settings" description="Chinh header, menu, footer, contact va legal links.">
        <Link
          href="/admin/settings"
          className="inline-flex items-center gap-2 rounded-xl border border-outline-variant px-4 py-2 text-sm font-extrabold text-primary transition-colors hover:bg-primary/10"
        >
          <Settings2 size={16} /> Header / Footer
        </Link>
      </Card>

      <Card
        title="Insights gần đây"
        description="5 mục cập nhật gần nhất."
        action={
          <Link href="/admin/insights" className="text-xs font-extrabold text-primary">
            Xem tất cả →
          </Link>
        }
      >
        {recentlyUpdated.length === 0 ? (
          <p className="text-sm text-on-surface-variant">Chưa có dữ liệu updatedAt — hãy lưu một trang để bắt đầu theo dõi.</p>
        ) : (
          <div className="space-y-2">
            {recentlyUpdated.map((item) => {
              const isInsight = 'slug' in item
              const href = isInsight ? `/admin/insights/${item.slug}` : `/admin/pages/${item.id}`
              return (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center justify-between gap-2 rounded-xl border border-outline-variant/45 bg-surface px-3 py-2.5 text-sm font-bold text-on-surface transition-colors hover:border-primary/50"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    {isInsight ? <Sparkles size={14} className="shrink-0 text-primary" /> : <FileText size={14} className="shrink-0 text-primary" />}
                    <span className="truncate">{item.title}</span>
                  </span>
                  <span className="shrink-0 text-xs font-semibold text-on-surface-variant">{formatDate(item.updatedAt)}</span>
                </Link>
              )
            })}
          </div>
        )}
      </Card>
    </div>
  )
}
