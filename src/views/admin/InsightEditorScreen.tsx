'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, FileText, ImageIcon, Link as LinkIcon, Plus, Save, Search, Sparkles, Trash2 } from 'lucide-react'
import { useAdminData } from '../../admin/AdminDataContext'
import {
  BackLink,
  Breadcrumbs,
  Card,
  EmptyState,
  Field,
  ImageUploadButton,
  MediaPreview,
  StatusBadge,
  StatusSelect,
  TextArea,
  TextInput,
} from '../../admin/ui'

export default function InsightEditorScreen({ slug }: { slug: string }) {
  const router = useRouter()
  const {
    getInsight,
    updateInsightField,
    updateInsightMeta,
    updateInsightSlug,
    addInsightSection,
    removeInsightSection,
    saveInsight,
    saving,
  } = useAdminData()
  const post = getInsight(slug)
  const [slugDraft, setSlugDraft] = useState(slug)
  const [uploadError, setUploadError] = useState('')

  useEffect(() => {
    setSlugDraft(slug)
  }, [slug])

  if (!post) {
    return (
      <div className="space-y-4">
        <BackLink href="/admin/insights" label="Về danh sách bài viết" />
        <EmptyState title="Không tìm thấy bài viết" description={`Slug "${slug}" không tồn tại.`} />
      </div>
    )
  }

  function commitSlug() {
    const nextSlug = updateInsightSlug(slug, slugDraft)
    if (nextSlug !== slug) router.replace(`/admin/insights/${nextSlug}`)
  }

  function handleAddSection() {
    const index = addInsightSection(slug)
    router.push(`/admin/insights/${slug}/sections/${index}`)
  }

  function handleRemoveSection(index: number) {
    if (!window.confirm('Xóa section này khỏi bài viết?')) return
    removeInsightSection(slug, index)
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Insights', href: '/admin/insights' }, { label: post.title }]} />

      <div className="flex flex-col gap-3 rounded-2xl border border-outline-variant/45 bg-surface/90 p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-extrabold text-on-surface">{post.title}</h1>
            <p className="text-xs font-semibold text-on-surface-variant">{post.meta.path}</p>
          </div>
          <StatusBadge value={post.status} />
        </div>
        <button
          onClick={() => void saveInsight(slug)}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-extrabold text-on-primary disabled:opacity-60"
        >
          <Save size={17} /> {saving ? 'Đang lưu...' : 'Save insight'}
        </button>
      </div>

      <Card title="Thông tin bài viết" action={<FileText size={18} className="text-primary" />}>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Slug" hint="Đổi slug sẽ đổi cả URL /insights/...">
            <div className="flex gap-2">
              <TextInput value={slugDraft} onChange={setSlugDraft} />
              {slugDraft !== slug && (
                <button onClick={commitSlug} className="shrink-0 rounded-xl border border-outline-variant px-3 text-xs font-extrabold text-primary">
                  Áp dụng
                </button>
              )}
            </div>
          </Field>
          <Field label="Trạng thái">
            <StatusSelect value={post.status} onChange={(value) => updateInsightField(slug, 'status', value)} />
          </Field>
          <Field label="Title">
            <TextInput value={post.title} onChange={(value) => updateInsightField(slug, 'title', value)} />
          </Field>
          <Field label="Category">
            <TextInput value={post.category} onChange={(value) => updateInsightField(slug, 'category', value)} />
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Excerpt">
            <TextArea value={post.excerpt} onChange={(value) => updateInsightField(slug, 'excerpt', value)} minHeight={90} />
          </Field>
        </div>
      </Card>

      <Card title="Cover image" action={<ImageIcon size={18} className="text-primary" />}>
        <div className="grid gap-4 md:grid-cols-[1fr_260px]">
          <div className="grid gap-4">
            <Field label="Cover URL">
              <div className="grid gap-2">
                <TextInput value={post.coverImage} onChange={(value) => updateInsightField(slug, 'coverImage', value)} />
                <ImageUploadButton
                  folder={`cms/insights/${slug}`}
                  onUploaded={(url) => updateInsightField(slug, 'coverImage', url)}
                  onError={setUploadError}
                />
              </div>
            </Field>
            <Field label="Cover alt">
              <TextInput value={post.coverAlt} onChange={(value) => updateInsightField(slug, 'coverAlt', value)} />
            </Field>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Date published">
                <TextInput value={post.datePublished} onChange={(value) => updateInsightField(slug, 'datePublished', value)} />
              </Field>
              <Field label="Date modified">
                <TextInput value={post.dateModified} onChange={(value) => updateInsightField(slug, 'dateModified', value)} />
              </Field>
            </div>
            {uploadError && <p className="text-xs font-bold text-red-700">{uploadError}</p>}
          </div>
          <MediaPreview url={post.coverImage} alt={post.coverAlt} />
        </div>
      </Card>

      <Card title="SEO" action={<Search size={18} className="text-primary" />}>
        <div className="grid gap-4">
          <Field label="Meta title">
            <TextInput value={post.meta.title} onChange={(value) => updateInsightMeta(slug, 'title', value)} />
          </Field>
          <Field label="Meta description">
            <TextArea value={post.meta.description} onChange={(value) => updateInsightMeta(slug, 'description', value)} minHeight={88} />
          </Field>
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Canonical path">
              <TextInput value={post.meta.path} onChange={(value) => updateInsightMeta(slug, 'path', value)} />
            </Field>
            <Field label="OG title">
              <TextInput value={post.meta.ogTitle ?? ''} onChange={(value) => updateInsightMeta(slug, 'ogTitle', value)} />
            </Field>
            <Field label="OG image">
              <TextInput value={post.meta.ogImage ?? ''} onChange={(value) => updateInsightMeta(slug, 'ogImage', value)} />
            </Field>
          </div>
        </div>
      </Card>

      <Card title="CTA" action={<LinkIcon size={18} className="text-primary" />}>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="CTA label">
            <TextInput value={post.ctaLabel} onChange={(value) => updateInsightField(slug, 'ctaLabel', value)} />
          </Field>
          <Field label="CTA href">
            <TextInput value={post.ctaHref} onChange={(value) => updateInsightField(slug, 'ctaHref', value)} />
          </Field>
        </div>
      </Card>

      <Card title="Related slugs" action={<Sparkles size={18} className="text-primary" />}>
        <Field label="Related" hint="Mỗi slug một dòng.">
          <TextArea
            value={(post.related ?? []).join('\n')}
            onChange={(value) => updateInsightField(slug, 'related', value.split('\n').map((item) => item.trim()).filter(Boolean))}
            minHeight={100}
          />
        </Field>
      </Card>

      <Card
        title="Sections"
        description="Nội dung bài viết, chia theo từng đoạn."
        action={
          <button onClick={handleAddSection} className="inline-flex items-center justify-center gap-2 rounded-xl border border-outline-variant px-4 py-2 text-sm font-extrabold text-primary">
            <Plus size={16} /> Thêm section
          </button>
        }
      >
        {post.sections.length === 0 ? (
          <EmptyState title="Chưa có section nào" description="Bấm 'Thêm section' để tạo section đầu tiên." />
        ) : (
          <div className="space-y-2">
            {post.sections.map((section, index) => (
              <div key={`${slug}-section-${index}`} className="flex items-center justify-between gap-3 rounded-xl border border-outline-variant/45 bg-surface px-4 py-3">
                <Link href={`/admin/insights/${slug}/sections/${index}`} className="flex min-w-0 flex-1 items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-xs font-extrabold text-primary">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-extrabold text-on-surface">{section.heading || `Section ${index + 1}`}</span>
                    <span className="block truncate text-xs font-semibold text-on-surface-variant">{section.paragraphs.length} đoạn</span>
                  </span>
                </Link>
                <div className="flex shrink-0 items-center gap-1">
                  <button onClick={() => handleRemoveSection(index)} className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-bold text-red-700">
                    <Trash2 size={13} />
                  </button>
                  <Link href={`/admin/insights/${slug}/sections/${index}`} className="inline-flex items-center gap-1 rounded-lg border border-outline-variant px-2.5 py-1.5 text-xs font-bold text-on-surface-variant">
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
