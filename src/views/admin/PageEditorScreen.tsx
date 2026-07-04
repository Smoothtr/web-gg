'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, Layers3, Plus, Save, Search, Trash2, Type } from 'lucide-react'
import { useAdminData } from '../../admin/AdminDataContext'
import { BackLink, Breadcrumbs, Card, EmptyState, Field, StatusBadge, StatusSelect, TextArea, TextInput } from '../../admin/ui'
import { getAdminSectionLabel } from '../../cms/adminSectionLabels'

export default function PageEditorScreen({ pageId }: { pageId: string }) {
  const router = useRouter()
  const { getPage, updatePageField, updatePageMeta, addBlock, removeBlock, savePage, saving } = useAdminData()
  const page = getPage(pageId)

  if (!page) {
    return (
      <div className="space-y-4">
        <BackLink href="/admin/pages" label="Về danh sách trang" />
        <EmptyState title="Không tìm thấy trang" description={`Trang "${pageId}" không tồn tại.`} />
      </div>
    )
  }

  function handleAddBlock() {
    const id = addBlock(pageId)
    router.push(`/admin/pages/${pageId}/sections/${id}`)
  }

  function handleRemoveBlock(blockId: string) {
    if (!window.confirm('Xóa section này khỏi trang?')) return
    removeBlock(pageId, blockId)
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Pages', href: '/admin/pages' }, { label: page.title }]} />

      <div className="flex flex-col gap-3 rounded-2xl border border-outline-variant/45 bg-surface/90 p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-extrabold text-on-surface">{page.title}</h1>
            <p className="text-xs font-semibold text-on-surface-variant">{page.meta.path}</p>
          </div>
          <StatusBadge value={page.status} />
        </div>
        <button
          onClick={() => void savePage(pageId)}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-extrabold text-on-primary disabled:opacity-60"
        >
          <Save size={17} /> {saving ? 'Đang lưu...' : 'Save page'}
        </button>
      </div>

      <Card title="Thông tin trang" action={<Type size={18} className="text-primary" />}>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Page ID">
            <TextInput value={page.id} onChange={() => undefined} readOnly />
          </Field>
          <Field label="Trạng thái">
            <StatusSelect value={page.status} onChange={(value) => updatePageField(pageId, 'status', value)} />
          </Field>
          <Field label="Tên trong CMS">
            <TextInput value={page.title} onChange={(value) => updatePageField(pageId, 'title', value)} />
          </Field>
          <Field label="Canonical path">
            <TextInput value={page.meta.path} onChange={(value) => updatePageMeta(pageId, 'path', value)} />
          </Field>
        </div>
      </Card>

      <Card title="SEO" action={<Search size={18} className="text-primary" />}>
        <div className="grid gap-4">
          <Field label="Meta title">
            <TextInput value={page.meta.title} onChange={(value) => updatePageMeta(pageId, 'title', value)} />
          </Field>
          <Field label="Meta description">
            <TextArea value={page.meta.description} onChange={(value) => updatePageMeta(pageId, 'description', value)} minHeight={88} />
          </Field>
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="OG title">
              <TextInput value={page.meta.ogTitle ?? ''} onChange={(value) => updatePageMeta(pageId, 'ogTitle', value)} />
            </Field>
            <Field label="OG description">
              <TextInput value={page.meta.ogDescription ?? ''} onChange={(value) => updatePageMeta(pageId, 'ogDescription', value)} />
            </Field>
            <Field label="OG image">
              <TextInput value={page.meta.ogImage ?? ''} onChange={(value) => updatePageMeta(pageId, 'ogImage', value)} placeholder="/og-image.jpg" />
            </Field>
          </div>
        </div>
      </Card>

      <Card
        title="Sections"
        description="Mỗi section là một khối nội dung riêng trên trang — bấm để sửa chi tiết."
        action={
          <button onClick={handleAddBlock} className="inline-flex items-center justify-center gap-2 rounded-xl border border-outline-variant px-4 py-2 text-sm font-extrabold text-primary">
            <Plus size={16} /> Thêm section
          </button>
        }
      >
        {page.blocks.length === 0 ? (
          <EmptyState title="Chưa có section nào" description="Bấm 'Thêm section' để tạo section đầu tiên." />
        ) : (
          <div className="space-y-2">
            {page.blocks.map((block, index) => (
              <div
                key={block.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-outline-variant/45 bg-surface px-4 py-3"
              >
                <Link href={`/admin/pages/${pageId}/sections/${block.id}`} className="flex min-w-0 flex-1 items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-xs font-extrabold text-primary">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-extrabold text-on-surface">{getAdminSectionLabel(pageId, block, index)}</span>
                    <span className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant">
                      <Layers3 size={11} /> {block.id}
                      {block.items?.length ? ` · ${block.items.length} items` : ''}
                    </span>
                  </span>
                </Link>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    onClick={() => handleRemoveBlock(block.id)}
                    className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-bold text-red-700"
                  >
                    <Trash2 size={13} />
                  </button>
                  <Link
                    href={`/admin/pages/${pageId}/sections/${block.id}`}
                    className="inline-flex items-center gap-1 rounded-lg border border-outline-variant px-2.5 py-1.5 text-xs font-bold text-on-surface-variant"
                  >
                    Sửa <ChevronRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
