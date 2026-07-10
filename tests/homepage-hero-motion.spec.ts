import { expect, test } from '@playwright/test'

async function expectHeroCentered(page: import('@playwright/test').Page, width: number, height: number) {
  await page.setViewportSize({ width, height })
  await page.goto('/', { waitUntil: 'domcontentloaded' })

  const hero = page.locator('.home-hero')
  const copy = hero.locator('.home-hero-copy--centered')
  const cta = copy.getByRole('button', { name: 'Schedule Our Date' })
  await expect(copy).toHaveCSS('text-align', 'center')
  await expect(cta).toBeVisible()

  const [heroBox, headingBox, ctaBox] = await Promise.all([
    hero.boundingBox(),
    copy.locator('h1').boundingBox(),
    cta.boundingBox(),
  ])
  expect(heroBox).not.toBeNull()
  expect(headingBox).not.toBeNull()
  expect(ctaBox).not.toBeNull()

  const heroCenter = heroBox!.x + heroBox!.width / 2
  expect(Math.abs(headingBox!.x + headingBox!.width / 2 - heroCenter)).toBeLessThanOrEqual(2)
  expect(Math.abs(ctaBox!.x + ctaBox!.width / 2 - heroCenter)).toBeLessThanOrEqual(2)
}

test.describe('Homepage centered hero and control-free showcases', () => {
  test('centers the hero copy and CTA on mobile and desktop', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await expectHeroCentered(page, 390, 844)
    await expectHeroCentered(page, 1440, 900)
  })

  test('removes autoplay controls while preserving manual case and people selection', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/', { waitUntil: 'domcontentloaded' })

    await expect(page.getByRole('button', { name: /pause featured|play featured|pause people|play people/i })).toHaveCount(0)

    const caseSection = page.locator('#featured-cases')
    const secondCase = caseSection.locator('[data-story-id]').nth(1)
    const secondCaseName = (await secondCase.locator('h3').textContent())?.trim()
    await secondCase.hover()
    await expect(caseSection.locator('.featured-banner-title')).toHaveText(secondCaseName || '')

    const peopleSection = page.getByRole('heading', { name: 'The One People' }).locator('xpath=ancestor::section[1]')
    const secondPerson = peopleSection.locator('[data-person-index="1"]')
    const secondPersonName = (await secondPerson.locator('h3').textContent())?.trim()
    await secondPerson.click()
    await expect(peopleSection.locator('.people-feature-banner h3')).toHaveText(secondPersonName || '')
  })

  test('requests responsive Cloudinary hero renditions and defers the closing video', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' })

    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    await expect(page.locator('.home-hero video source')).toHaveCount(2)
    const desktopSources = await page.locator('.home-hero video source').evaluateAll((sources) => sources.map((source) => source.getAttribute('src') || ''))
    expect(desktopSources.some((source) => source.includes('w_1920'))).toBe(true)
    const desktopPosterSrcSet = await page.locator('.home-hero picture img').getAttribute('srcset')
    expect(desktopPosterSrcSet).toContain(' 3840w')

    await page.setViewportSize({ width: 390, height: 844 })
    await page.reload({ waitUntil: 'domcontentloaded' })
    await expect(page.locator('.home-hero video source')).toHaveCount(2)
    const mobileSources = await page.locator('.home-hero video source').evaluateAll((sources) => sources.map((source) => source.getAttribute('src') || ''))
    expect(mobileSources.some((source) => source.includes('w_1440'))).toBe(true)

    const closing = page.locator('.closing-portal-section')
    await expect(closing.locator('video')).toHaveCount(0)
    await closing.scrollIntoViewIfNeeded()
    await expect(closing.locator('video source')).toHaveCount(2)
    const closingSources = await closing.locator('video source').evaluateAll((sources) => sources.map((source) => source.getAttribute('src') || ''))
    expect(closingSources.every((source) => source.includes('closing-portal-1440.'))).toBe(true)
  })
})
