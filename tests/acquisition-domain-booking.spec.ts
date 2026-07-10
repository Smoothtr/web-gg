import { readFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'
import nextConfig, {
  buildContentSecurityPolicy,
  trustedCmsImageSources,
} from '../next.config'
import {
  ATTRIBUTION_LIMITS,
  ATTRIBUTION_STORAGE_KEY,
  captureAcquisitionAttribution,
  getSafeSessionStorage,
  normalizeAcquisitionAttribution,
} from '../src/analytics/acquisition'

test('keeps first-touch attribution bounded and removes private URL data', () => {
  const values = new Map<string, string>()
  const storage = {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value) },
  }

  const firstTouch = captureAcquisitionAttribution(
    'https://theone.marketing/landing?utm_source=Google&utm_campaign=Launch&gclid=click-123&email=private%40example.com#secret',
    'https://partner.example/article?customer=private#profile',
    storage,
  )

  expect(firstTouch).toEqual({
    utmSource: 'Google',
    utmCampaign: 'Launch',
    gclid: 'click-123',
    landingUrl: 'https://theone.marketing/landing?utm_source=Google&utm_campaign=Launch&gclid=click-123',
    referrer: 'https://partner.example/article',
  })
  expect(values.get(ATTRIBUTION_STORAGE_KEY)).not.toContain('private')

  const laterPage = captureAcquisitionAttribution(
    'https://theone.marketing/the-one-stories?utm_source=Other',
    '',
    storage,
  )
  expect(laterPage).toEqual(firstTouch)

  const bounded = normalizeAcquisitionAttribution({
    utmSource: 'x'.repeat(500),
    gclid: 'y'.repeat(1000),
    landingUrl: 'javascript:alert(1)',
    referrer: 'data:text/html,unsafe',
  })
  expect(bounded.utmSource).toHaveLength(ATTRIBUTION_LIMITS.campaign)
  expect(bounded.gclid).toHaveLength(ATTRIBUTION_LIMITS.clickId)
  expect(bounded.landingUrl).toBeUndefined()
  expect(bounded.referrer).toBeUndefined()

  const storageDenied = Object.defineProperty({}, 'sessionStorage', {
    get() { throw new DOMException('Storage is disabled', 'SecurityError') },
  })
  expect(getSafeSessionStorage(storageDenied)).toBeNull()
  expect(captureAcquisitionAttribution('https://theone.marketing/?utm_source=privacy', '', getSafeSessionStorage(storageDenied))).toMatchObject({
    utmSource: 'privacy',
  })
})

test('serves The One directly and limits host redirects to canonical aliases', async () => {
  const redirects = await nextConfig.redirects?.() ?? []
  const hostRedirects = redirects.filter((redirect) => redirect.has?.some((condition) => condition.type === 'host'))

  expect(hostRedirects).toEqual(expect.arrayContaining([
    expect.objectContaining({
      destination: 'https://www.gg99.vn/:path*',
      has: [expect.objectContaining({ value: 'gg99.vn' })],
    }),
    expect.objectContaining({
      destination: 'https://theone.marketing/:path*',
      has: [expect.objectContaining({ value: 'www.theone.marketing' })],
    }),
  ]))
  expect(hostRedirects.some((redirect) => redirect.has?.some((condition) => condition.value === 'theone.marketing'))).toBe(false)

  const vercelConfig = JSON.parse(readFileSync('vercel.json', 'utf8')) as {
    redirects: Array<{ has?: Array<{ value?: string }>; destination: string }>
    headers: Array<{ headers: Array<{ key: string }> }>
  }
  expect(vercelConfig.redirects.some((redirect) => redirect.has?.some((condition) => condition.value === 'theone.marketing'))).toBe(false)
  expect(vercelConfig.redirects).toContainEqual(expect.objectContaining({
    destination: 'https://theone.marketing/:path*',
    has: [expect.objectContaining({ value: 'www.theone.marketing' })],
  }))
  expect(vercelConfig.headers.flatMap((entry) => entry.headers).some((header) => header.key === 'Content-Security-Policy')).toBe(false)
})

test('uses upgrade-insecure-requests only on production deployments and keeps CMS image hosts explicit', async ({ request }) => {
  expect(buildContentSecurityPolicy(false)).not.toContain('upgrade-insecure-requests')
  expect(buildContentSecurityPolicy(true)).toContain('upgrade-insecure-requests')
  expect(buildContentSecurityPolicy(false, false)).not.toContain('googletagmanager.com')
  expect(buildContentSecurityPolicy(false, true)).toContain('googletagmanager.com')
  expect(trustedCmsImageSources).toEqual(['https://res.cloudinary.com'])

  const localResponse = await request.get('/')
  const localPolicy = localResponse.headers()['content-security-policy']
  expect(localPolicy).toBeTruthy()
  expect(localPolicy).not.toContain('upgrade-insecure-requests')
  expect(localPolicy).toContain('https://res.cloudinary.com')
  const imageDirective = localPolicy.split(';').find((directive) => directive.trim().startsWith('img-src')) ?? ''
  expect(imageDirective).not.toContain('*')
})

test('accepts production booking origins for both domains but rejects insecure or hostile origins', async ({ request }) => {
  const allowedOrigins = [
    'https://www.gg99.vn',
    'https://gg99.vn',
    'https://theone.marketing',
    'https://www.theone.marketing',
  ]
  for (const [index, origin] of allowedOrigins.entries()) {
    const response = await request.post('/api/book', {
      data: {},
      headers: {
        'Content-Type': 'application/json',
        Origin: origin,
        'X-Forwarded-For': `198.51.100.${index + 1}`,
      },
    })
    expect(response.status(), origin).toBe(400)
  }

  for (const origin of ['http://theone.marketing', 'https://attacker.example']) {
    const response = await request.post('/api/book', {
      data: {},
      headers: { 'Content-Type': 'application/json', Origin: origin },
    })
    expect(response.status(), origin).toBe(403)
  }
})

test('booking keeps the mobile header visible and emits optional dataLayer lifecycle events', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 640 })
  await page.route('**/api/availability?*', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({
        frames: ['slot_08_10', 'slot_10_12', 'slot_14_16', 'slot_16_18', 'slot_20_22', 'slot_22_24']
          .map((id) => ({ id, available: true })),
      }),
    })
  })
  await page.route('**/api/book', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) })
  })

  await page.goto('/?utm_source=google&utm_medium=cpc&utm_campaign=the-one&gclid=test-click&email=private')
  await page.getByRole('button', { name: 'Schedule Our Date' }).first().click()

  const dialog = page.getByRole('dialog', { name: /Congratulations/i })
  await expect(dialog).toBeVisible()
  const calendar = dialog.getByRole('group', { name: 'Choose a consultation date' })
  await calendar.locator('button[aria-pressed="false"]:not([disabled])').first().click()
  await dialog.getByRole('button', { name: /^8-10,/ }).click()

  const scrollBody = dialog.getByTestId('booking-scroll-body')
  await scrollBody.evaluate((element) => { element.scrollTop = element.scrollHeight })
  await dialog.getByRole('button', { name: /^Continue/i }).click()
  await expect(dialog.getByLabel(/Full name/i)).toBeFocused()
  await expect.poll(() => scrollBody.evaluate((element) => element.scrollTop)).toBe(0)

  const modalTitle = dialog.getByRole('heading', { name: /Congratulations/i })
  const titleBox = await modalTitle.boundingBox()
  expect(titleBox?.y ?? -1).toBeGreaterThanOrEqual(0)

  await dialog.getByLabel(/Full name/i).fill('Test User')
  await dialog.getByLabel(/Phone number/i).fill('0912345678')
  await dialog.getByLabel(/^Email/i).fill('test@example.com')
  await dialog.getByRole('checkbox').check()
  await dialog.getByRole('button', { name: /^Submit/i }).click()
  await expect(dialog.getByRole('heading', { name: 'Thank you!' })).toBeVisible()

  const browserState = await page.evaluate((storageKey) => {
    const state = window as typeof window & { dataLayer?: Array<Record<string, unknown>> }
    return {
      attribution: JSON.parse(sessionStorage.getItem(storageKey) ?? '{}'),
      events: (state.dataLayer ?? []).map((entry) => entry.event),
      payloads: state.dataLayer ?? [],
    }
  }, ATTRIBUTION_STORAGE_KEY)

  expect(browserState.attribution).toMatchObject({
    utmSource: 'google',
    utmMedium: 'cpc',
    utmCampaign: 'the-one',
    gclid: 'test-click',
  })
  expect(browserState.attribution.landingUrl).not.toContain('email=')
  expect(browserState.events).toEqual(expect.arrayContaining([
    'booking_open',
    'booking_step',
    'booking_submit',
    'booking_success',
  ]))
  expect(JSON.stringify(browserState.payloads)).not.toContain('test@example.com')
  expect(JSON.stringify(browserState.payloads)).not.toContain('test-click')
})
