'use client'

import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, Save, Trash2 } from 'lucide-react'
import { useAdminData } from '../../admin/AdminDataContext'
import { BackLink, Breadcrumbs, Card, EmptyState, Field, TextArea, TextInput } from '../../admin/ui'

export default function InsightSectionEditorScreen({ slug, index }: { slug: string; index: number }) {
  const router = useRouter()
  const { getInsight, updateInsightSection, removeInsightSection, saveInsight, saving } = useAdminData()
  const post = getInsight(slug)
  const section = post?.sections[index]

  if (!post || !section) {
    return (
      <div className="space-y-4">
        <BackLink href={`/admin/insights/${slug}`} label="Về bài viết" />
        <EmptyState title="Không tìm thấy section" description={`Section #${index + 1} không tồn tại trong bài viết này.`} />
      </div>
    )
  }

  const hasPrev = index > 0
  const hasNext = index < post.sections.length - 1

  function handleRemove() {
    if (!window.confirm('Xóa section này khỏi bài viết?')) return
    removeInsightSection(slug, index)
    router.push(`/admin/insights/${slug}`)
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Insights', href: '/admin/insights' },
          { label: post.title, href: `/admin/insights/${slug}` },
          { label: section.heading || `Section ${index + 1}` },
        ]}
      />

      <div className="flex flex-col gap-3 rounded-2xl border border-outline-variant/45 bg-surface/90 p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-widest text-primary">Section {index + 1}/{post.sections.length}</p>
          <h1 className="text-2xl font-extrabold text-on-surface">{section.heading || `Section ${index + 1}`}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => hasPrev && router.push(`/admin/insights/${slug}/sections/${index - 1}`)}
            disabled={!hasPrev}
            className="inline-flex items-center gap-1 rounded-xl border border-outline-variant px-3 py-2.5 text-xs font-extrabold text-on-surface-variant disabled:opacity-40"
          >
            <ChevronLeft size={15} /> Trước
          </button>
          <button
            onClick={() => hasNext && router.push(`/admin/insights/${slug}/sections/${index + 1}`)}
            disabled={!hasNext}
            className="inline-flex items-center gap-1 rounded-xl border border-outline-variant px-3 py-2.5 text-xs font-extrabold text-on-surface-variant disabled:opacity-40"
          >
            Sau <ChevronRight size={15} />
          </button>
          <button
            onClick={() => void saveInsight(slug)}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-extrabold text-on-primary disabled:opacity-60"
          >
            <Save size={17} /> {saving ? 'Đang lưu...' : 'Save insight'}
          </button>
        </div>
      </div>

      <Card>
        <div className="mb-4 flex justify-end">
          <button onClick={handleRemove} className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-bold text-red-700">
            <Trash2 size={13} /> Xóa section
          </button>
        </div>
        <div className="grid gap-5">
          <Field label="Heading">
            <TextInput value={section.heading} onChange={(value) => updateInsightSection(slug, index, { heading: value })} />
          </Field>
          <Field label="Paragraphs" hint="Mỗi đoạn cách nhau bằng một dòng trống.">
            <TextArea
              value={section.paragraphs.join('\n\n')}
              onChange={(value) =>
                updateInsightSection(slug, index, {
                  paragraphs: value.split(/\n{2,}/).map((paragraph) => paragraph.trim()).filter(Boolean),
                })
              }
              minHeight={260}
            />
          </Field>
        </div>
      </Card>
    </div>
  )
}
