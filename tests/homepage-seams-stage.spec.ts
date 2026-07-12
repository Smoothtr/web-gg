import { expect, test } from '@playwright/test'

test('keeps Homepage seams soft and the Sounds Familiar stage media-free', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/', { waitUntil: 'domcontentloaded' })

  const stage = page.getByTestId('red-flags-stage')
  const motion = stage.locator('.red-flags-stage-motion')
  await expect(stage).toBeAttached()
  await expect(motion).toHaveAttribute('aria-hidden', 'true')
  await expect(motion.locator('video, canvas, img')).toHaveCount(0)
  await expect(motion.locator(':scope > span')).toHaveCount(2)
  await expect(page.locator('.flow-wave-canvas--home')).toHaveCount(1)

  const runningMotion = await motion.locator(':scope > span').evaluateAll((layers) => layers.map((layer) => {
    const style = getComputedStyle(layer)
    return {
      name: style.animationName,
      duration: Number.parseFloat(style.animationDuration) || 0,
    }
  }))
  expect(runningMotion.map(({ name }) => name)).toEqual(['redFlagsAuroraDrift', 'redFlagsOrbitDust'])
  expect(runningMotion.every(({ duration }) => duration >= 22)).toBe(true)

  await page.emulateMedia({ reducedMotion: 'reduce' })
  const reducedMotion = await motion.locator(':scope > span').evaluateAll((layers) => layers.map((layer) => getComputedStyle(layer).animationName))
  expect(reducedMotion).toEqual(['none', 'none'])

  await expect(page.locator('.featured-top-bridge')).toBeAttached()
  await expect(page.getByTestId('site-footer')).toHaveCSS('border-top-width', '0px')

  const portalFadeHeight = await page.locator('.closing-portal-section').evaluate((element) => Number.parseFloat(getComputedStyle(element, '::after').height))
  expect(portalFadeHeight).toBeGreaterThan(120)

  const legalRule = await page.locator('.brand-footer-legal').evaluate((element) => {
    const style = getComputedStyle(element, '::before')
    return { height: Number.parseFloat(style.height), background: style.backgroundImage }
  })
  expect(legalRule.height).toBe(1)
  expect(legalRule.background).toContain('linear-gradient')
})
