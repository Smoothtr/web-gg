'use client'

import { ArrowDown, ArrowUp, Plus, Save, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useAdminData } from '../../admin/AdminDataContext'
import { Breadcrumbs, Card, Field, TextArea, TextInput } from '../../admin/ui'
import type { BrandLang } from '../../brandContent'
import type { CmsLink, CmsLocalizedSiteSettings } from '../../cms/types'

type HeaderSettings = CmsLocalizedSiteSettings['header']
type BookingSettings = CmsLocalizedSiteSettings['booking']
type FooterSettings = CmsLocalizedSiteSettings['footer']

const languages: Array<{ label: string; value: BrandLang }> = [
  { label: 'VI', value: 'vi' },
  { label: 'EN', value: 'en' },
]

const emptyLink: CmsLink = { label: 'New link', href: '/' }

function setAt<T>(items: T[], index: number, value: T) {
  return items.map((item, itemIndex) => (itemIndex === index ? value : item))
}

function moveItem<T>(items: T[], index: number, direction: -1 | 1) {
  const next = [...items]
  const targetIndex = index + direction
  if (index < 0 || index >= next.length || targetIndex < 0 || targetIndex >= next.length) return next

  const [item] = next.splice(index, 1)
  next.splice(targetIndex, 0, item)
  return next
}

function LinkListEditor({
  items,
  onChange,
  label,
}: {
  items: CmsLink[]
  onChange: (items: CmsLink[]) => void
  label: string
}) {
  return (
    <div className="rounded-xl border border-outline-variant/45 bg-surface-container-low p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-sm font-extrabold text-on-surface">{label}</h3>
        <button
          type="button"
          onClick={() => onChange([...items, { ...emptyLink }])}
          className="inline-flex items-center gap-2 rounded-xl border border-outline-variant bg-surface px-3 py-2 text-xs font-extrabold text-primary"
        >
          <Plus size={14} /> Add link
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={`${label}-${index}`} className="grid gap-2 rounded-xl border border-outline-variant/40 bg-surface p-3 md:grid-cols-[1fr_1fr_auto]">
            <TextInput value={item.label} onChange={(value) => onChange(setAt(items, index, { ...item, label: value }))} placeholder="Label" />
            <TextInput value={item.href} onChange={(value) => onChange(setAt(items, index, { ...item, href: value }))} placeholder="/path" />
            <div className="flex items-center gap-1">
              <label className="inline-flex h-9 items-center gap-2 rounded-lg border border-outline-variant px-2.5 text-xs font-extrabold text-on-surface-variant">
                <input
                  type="checkbox"
                  checked={item.visible !== false}
                  onChange={(event) => onChange(setAt(items, index, { ...item, visible: event.target.checked }))}
                  className="h-4 w-4 accent-primary"
                />
                Show
              </label>
              <button
                type="button"
                onClick={() => onChange(moveItem(items, index, -1))}
                disabled={index === 0}
                className="rounded-lg border border-outline-variant px-2.5 py-2 text-on-surface-variant disabled:opacity-40"
                aria-label="Move up"
              >
                <ArrowUp size={14} />
              </button>
              <button
                type="button"
                onClick={() => onChange(moveItem(items, index, 1))}
                disabled={index === items.length - 1}
                className="rounded-lg border border-outline-variant px-2.5 py-2 text-on-surface-variant disabled:opacity-40"
                aria-label="Move down"
              >
                <ArrowDown size={14} />
              </button>
              <button
                type="button"
                onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}
                className="rounded-lg border border-red-200 px-2.5 py-2 text-red-700"
                aria-label="Remove link"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="rounded-xl border border-dashed border-outline-variant/50 bg-surface px-4 py-3 text-xs font-semibold text-on-surface-variant">
            No links. Add one or leave empty to hide this group.
          </p>
        )}
      </div>
    </div>
  )
}

export default function SiteSettingsScreen() {
  const { siteSettings, updateSiteSettings, saveSiteSettings, saving } = useAdminData()
  const [activeLang, setActiveLang] = useState<BrandLang>('vi')
  const locale = siteSettings.locales[activeLang]

  function updateLocale(patch: Partial<CmsLocalizedSiteSettings>) {
    updateSiteSettings((current) => ({
      ...current,
      locales: {
        ...current.locales,
        [activeLang]: {
          ...current.locales[activeLang],
          ...patch,
        },
      },
    }))
  }

  function updateHeader<K extends keyof HeaderSettings>(key: K, value: HeaderSettings[K]) {
    updateLocale({ header: { ...locale.header, [key]: value } })
  }

  function updateBooking<K extends keyof BookingSettings>(key: K, value: BookingSettings[K]) {
    updateLocale({ booking: { ...locale.booking, [key]: value } })
  }

  function updateFooter<K extends keyof FooterSettings>(key: K, value: FooterSettings[K]) {
    updateLocale({ footer: { ...locale.footer, [key]: value } })
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Settings' }, { label: 'Header / Footer' }]} />

      <div className="flex flex-col gap-3 rounded-2xl border border-outline-variant/45 bg-surface/90 p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-widest text-primary">Site settings</p>
          <h1 className="text-2xl font-extrabold text-on-surface">Header / Footer</h1>
          <p className="mt-1 text-sm text-on-surface-variant">Edit menu, brand text, contact and footer links without touching code.</p>
        </div>
        <button
          onClick={() => void saveSiteSettings()}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-extrabold text-on-primary disabled:opacity-60"
        >
          <Save size={17} /> {saving ? 'Saving...' : 'Save settings'}
        </button>
      </div>

      <div className="inline-flex rounded-xl border border-outline-variant/45 bg-surface-container-low p-1">
        {languages.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setActiveLang(item.value)}
            className={`rounded-lg px-4 py-2 text-xs font-extrabold transition-colors ${
              activeLang === item.value ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <Card title="Header" description="Leave Header subtitle blank if you want to remove the company line under the logo.">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Logo URL">
            <TextInput value={locale.header.logoSrc} onChange={(value) => updateHeader('logoSrc', value)} placeholder="/logo-gg.png" />
          </Field>
          <Field label="Logo alt">
            <TextInput value={locale.header.logoAlt} onChange={(value) => updateHeader('logoAlt', value)} />
          </Field>
          <Field label="Header brand name">
            <TextInput value={locale.header.brandName} onChange={(value) => updateHeader('brandName', value)} placeholder="The One" />
          </Field>
          <Field label="Header subtitle">
            <TextInput value={locale.header.tagline} onChange={(value) => updateHeader('tagline', value)} placeholder="Blank = hidden" />
          </Field>
          <Field label="CTA label">
            <TextInput value={locale.header.ctaLabel} onChange={(value) => updateHeader('ctaLabel', value)} placeholder="Call Your Shot" />
          </Field>
        </div>
        <div className="mt-5">
          <LinkListEditor items={locale.header.navLinks} onChange={(items) => updateHeader('navLinks', items)} label="Header nav links" />
        </div>
      </Card>

      <Card title="Booking modal" description="Text shown after users click Schedule Our Date / booking CTA. Time-slot logic is still controlled by the booking API.">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Modal title">
            <TextInput value={locale.booking.title} onChange={(value) => updateBooking('title', value)} />
          </Field>
          <Field label="Modal subtitle">
            <TextInput value={locale.booking.subtitle} onChange={(value) => updateBooking('subtitle', value)} />
          </Field>
          <Field label="Time-frame label">
            <TextInput value={locale.booking.frameLabel} onChange={(value) => updateBooking('frameLabel', value)} />
          </Field>
          <Field label="Continue button">
            <TextInput value={locale.booking.continueLabel} onChange={(value) => updateBooking('continueLabel', value)} />
          </Field>
          <Field label="Disabled continue text">
            <TextInput value={locale.booking.continueDisabledLabel} onChange={(value) => updateBooking('continueDisabledLabel', value)} />
          </Field>
          <Field label="Submit button">
            <TextInput value={locale.booking.submitLabel} onChange={(value) => updateBooking('submitLabel', value)} />
          </Field>
          <Field label="Success title">
            <TextInput value={locale.booking.successTitle} onChange={(value) => updateBooking('successTitle', value)} />
          </Field>
          <Field label="Success message">
            <TextInput value={locale.booking.successMessage} onChange={(value) => updateBooking('successMessage', value)} />
          </Field>
        </div>
        <div className="mt-4 grid gap-4">
          <Field label="Intro copy">
            <TextArea value={locale.booking.intro} onChange={(value) => updateBooking('intro', value)} minHeight={78} />
          </Field>
          <Field label="Success follow-up">
            <TextArea value={locale.booking.successFollowup} onChange={(value) => updateBooking('successFollowup', value)} minHeight={70} />
          </Field>
          <Field label="Consultation needs" hint="One option per line. These options appear in the booking form select.">
            <TextArea
              value={locale.booking.needs.join('\n')}
              onChange={(value) => updateBooking('needs', value.split('\n').map((item) => item.trim()).filter(Boolean))}
              minHeight={126}
            />
          </Field>
        </div>
      </Card>

      <Card title="Footer brand">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Footer logo URL">
            <TextInput value={locale.footer.logoSrc} onChange={(value) => updateFooter('logoSrc', value)} placeholder="/logo-gg.png" />
          </Field>
          <Field label="Footer logo alt">
            <TextInput value={locale.footer.logoAlt} onChange={(value) => updateFooter('logoAlt', value)} />
          </Field>
          <Field label="Footer brand name">
            <TextInput value={locale.footer.brandName} onChange={(value) => updateFooter('brandName', value)} />
          </Field>
          <Field label="Footer tagline">
            <TextInput value={locale.footer.tagline} onChange={(value) => updateFooter('tagline', value)} />
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Footer description">
            <TextArea value={locale.footer.description} onChange={(value) => updateFooter('description', value)} minHeight={86} />
          </Field>
        </div>
      </Card>

      <Card title="Footer links">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Solutions heading">
            <TextInput value={locale.footer.solutionsHeading} onChange={(value) => updateFooter('solutionsHeading', value)} />
          </Field>
          <Field label="Navigation heading">
            <TextInput value={locale.footer.navigationHeading} onChange={(value) => updateFooter('navigationHeading', value)} />
          </Field>
        </div>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <LinkListEditor items={locale.footer.solutionLinks} onChange={(items) => updateFooter('solutionLinks', items)} label="Solution links" />
          <LinkListEditor items={locale.footer.navigationLinks} onChange={(items) => updateFooter('navigationLinks', items)} label="Navigation links" />
        </div>
      </Card>

      <Card title="Contact / Legal">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Contact heading">
            <TextInput value={locale.footer.contactHeading} onChange={(value) => updateFooter('contactHeading', value)} />
          </Field>
          <Field label="Email">
            <TextInput value={locale.footer.email} onChange={(value) => updateFooter('email', value)} />
          </Field>
          <Field label="Chat URL">
            <TextInput value={locale.footer.chatUrl} onChange={(value) => updateFooter('chatUrl', value)} />
          </Field>
          <Field label="Chat label">
            <TextInput value={locale.footer.chatLabel} onChange={(value) => updateFooter('chatLabel', value)} />
          </Field>
          <Field label="Address">
            <TextInput value={locale.footer.address} onChange={(value) => updateFooter('address', value)} />
          </Field>
          <Field label="Company name">
            <TextInput value={locale.footer.companyName} onChange={(value) => updateFooter('companyName', value)} />
          </Field>
          <Field label="Tax code">
            <TextInput value={locale.footer.taxCode} onChange={(value) => updateFooter('taxCode', value)} />
          </Field>
          <Field label="Company address">
            <TextInput value={locale.footer.companyAddress} onChange={(value) => updateFooter('companyAddress', value)} />
          </Field>
          <Field label="Copyright">
            <TextInput value={locale.footer.copyright} onChange={(value) => updateFooter('copyright', value)} />
          </Field>
          <Field label="Privacy label">
            <TextInput value={locale.footer.privacyLabel} onChange={(value) => updateFooter('privacyLabel', value)} />
          </Field>
          <Field label="Privacy href">
            <TextInput value={locale.footer.privacyHref} onChange={(value) => updateFooter('privacyHref', value)} />
          </Field>
          <Field label="Terms label">
            <TextInput value={locale.footer.termsLabel} onChange={(value) => updateFooter('termsLabel', value)} />
          </Field>
          <Field label="Terms href">
            <TextInput value={locale.footer.termsHref} onChange={(value) => updateFooter('termsHref', value)} />
          </Field>
        </div>
      </Card>
    </div>
  )
}
