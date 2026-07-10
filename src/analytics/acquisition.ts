export const ATTRIBUTION_STORAGE_KEY = 'gg99:first-touch-attribution:v1'

export const ATTRIBUTION_LIMITS = {
  campaign: 120,
  clickId: 256,
  url: 500,
  source: 80,
} as const

export type AcquisitionAttribution = {
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmTerm?: string
  utmContent?: string
  gclid?: string
  fbclid?: string
  landingUrl?: string
  referrer?: string
}

export type BookingAnalyticsEvent =
  | 'booking_open'
  | 'booking_step'
  | 'booking_submit'
  | 'booking_success'

type StorageLike = Pick<Storage, 'getItem' | 'setItem'>

const QUERY_TO_FIELD = {
  utm_source: 'utmSource',
  utm_medium: 'utmMedium',
  utm_campaign: 'utmCampaign',
  utm_term: 'utmTerm',
  utm_content: 'utmContent',
  gclid: 'gclid',
  fbclid: 'fbclid',
} as const

const ATTRIBUTION_FIELDS = Object.values(QUERY_TO_FIELD)

function cleanString(value: unknown, maxLength: number) {
  if (typeof value !== 'string') return ''
  return value
    .normalize('NFKC')
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .trim()
    .slice(0, maxLength)
}

function cleanHttpUrl(value: unknown, maxLength: number, allowedQueryKeys: readonly string[] = []) {
  const clean = cleanString(value, maxLength * 2)
  if (!clean) return ''

  try {
    const parsed = new URL(clean)
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return ''
    parsed.username = ''
    parsed.password = ''
    parsed.hash = ''

    const allowedQuery = new URLSearchParams()
    for (const key of allowedQueryKeys) {
      const queryValue = cleanString(parsed.searchParams.get(key), key === 'gclid' || key === 'fbclid'
        ? ATTRIBUTION_LIMITS.clickId
        : ATTRIBUTION_LIMITS.campaign)
      if (queryValue) allowedQuery.set(key, queryValue)
    }
    parsed.search = allowedQuery.toString()
    return parsed.toString().slice(0, maxLength)
  } catch {
    return ''
  }
}

/**
 * Treat every client-provided attribution value as untrusted input. This is
 * shared by the browser and booking API so stored records have one schema and
 * the same strict size limits on both sides.
 */
export function normalizeAcquisitionAttribution(value: unknown): AcquisitionAttribution {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
  const candidate = value as Record<string, unknown>
  const result: AcquisitionAttribution = {}

  for (const field of ATTRIBUTION_FIELDS) {
    const limit = field === 'gclid' || field === 'fbclid'
      ? ATTRIBUTION_LIMITS.clickId
      : ATTRIBUTION_LIMITS.campaign
    const clean = cleanString(candidate[field], limit)
    if (clean) result[field] = clean
  }

  const landingUrl = cleanHttpUrl(
    candidate.landingUrl,
    ATTRIBUTION_LIMITS.url,
    Object.keys(QUERY_TO_FIELD),
  )
  if (landingUrl) result.landingUrl = landingUrl

  // Referrer query strings and fragments can contain personal data. The
  // source page is still useful for acquisition reporting without them.
  const referrer = cleanHttpUrl(candidate.referrer, ATTRIBUTION_LIMITS.url)
  if (referrer) result.referrer = referrer

  return result
}

function readStoredAttribution(storage: StorageLike | null) {
  if (!storage) return null
  try {
    const raw = storage.getItem(ATTRIBUTION_STORAGE_KEY)
    if (!raw) return null
    return normalizeAcquisitionAttribution(JSON.parse(raw))
  } catch {
    return null
  }
}

export function getSafeSessionStorage(source: unknown = typeof window !== 'undefined' ? window : null): StorageLike | null {
  try {
    return (source as { sessionStorage?: StorageLike } | null)?.sessionStorage ?? null
  } catch {
    return null
  }
}

/** Capture first-touch acquisition values once per browser tab session. */
export function captureAcquisitionAttribution(
  href?: string,
  referrer?: string,
  storage?: StorageLike | null,
): AcquisitionAttribution {
  const browserStorage = storage === undefined && typeof window !== 'undefined'
    ? getSafeSessionStorage(window)
    : storage ?? null
  const stored = readStoredAttribution(browserStorage)
  if (stored) return stored

  const currentHref = href ?? (typeof window !== 'undefined' ? window.location.href : '')
  const currentReferrer = referrer ?? (typeof document !== 'undefined' ? document.referrer : '')
  const candidate: Record<string, unknown> = {
    landingUrl: currentHref,
    referrer: currentReferrer,
  }

  try {
    const parsed = new URL(currentHref)
    for (const [queryKey, field] of Object.entries(QUERY_TO_FIELD)) {
      candidate[field] = parsed.searchParams.get(queryKey)
    }
  } catch {
    // Invalid URLs are discarded by the shared normalizer below.
  }

  const attribution = normalizeAcquisitionAttribution(candidate)
  try {
    browserStorage?.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(attribution))
  } catch {
    // Storage may be disabled; submitting the in-memory result still works.
  }
  return attribution
}

export function getAcquisitionAttribution(): AcquisitionAttribution {
  if (typeof window === 'undefined') return {}
  const storage = getSafeSessionStorage(window)
  return readStoredAttribution(storage) ?? captureAcquisitionAttribution(undefined, undefined, storage)
}

/**
 * GTM-compatible, privacy-safe booking events. No contact details or click IDs
 * are emitted. If GTM is installed later it can consume the queued dataLayer.
 */
export function emitBookingAnalytics(
  event: BookingAnalyticsEvent,
  details: { source?: unknown; step?: 1 | 2 } = {},
) {
  if (typeof window === 'undefined') return
  const source = cleanString(details.source, ATTRIBUTION_LIMITS.source)
  const payload: Record<string, string | number> = { event }
  if (source) payload.booking_source = source
  if (details.step) payload.booking_step = details.step

  const analyticsWindow = window as typeof window & { dataLayer?: Array<Record<string, unknown>> }
  analyticsWindow.dataLayer = analyticsWindow.dataLayer ?? []
  analyticsWindow.dataLayer.push(payload)
}
