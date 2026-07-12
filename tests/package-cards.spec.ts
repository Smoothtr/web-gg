import { expect, test } from '@playwright/test'
import {
  getPackageFeaturePresentation,
  resolvePackageTone,
  type PackageFeatureRow,
} from '../src/components/PackageCards'

test.describe('package feature semantics', () => {
  test('resolves package tone from stable identity before display order', () => {
    expect(resolvePackageTone({ title: 'The One Scale' }, 'package-scale', 0)).toBe('scale')
    expect(resolvePackageTone({ title: 'The One System' }, 'package-system', 2)).toBe('system')
    expect(resolvePackageTone({ title: 'The One Start' }, 'package-start', 1)).toBe('start')
  })

  test('uses an explicit CMS label as emphasis only when a semantic group exists', () => {
    const row: PackageFeatureRow = {
      group: 'Website system',
      label: 'booking/sales website',
      text: 'Booking/sales website, unlimited landing pages.',
      featured: true,
    }
    const presentation = getPackageFeaturePresentation(row)

    expect(presentation.group).toBe('Website System')
    expect(presentation.emphasisSource).toBe('explicit')
    expect(presentation.parts.emphasis).toBe('Booking/sales website')
    expect(Object.values(presentation.parts).join('')).toBe(row.text)
  })

  test('safely emphasizes a featured leading clause while preserving exact text', () => {
    const row: PackageFeatureRow = {
      group: 'Campaign growth',
      text: 'Campaign strategy, creative direction, media planning',
      featured: true,
    }
    const presentation = getPackageFeaturePresentation(row)

    expect(presentation.emphasisSource).toBe('leading')
    expect(presentation.parts.emphasis).toBe('Campaign strategy')
    expect(Object.values(presentation.parts).join('')).toBe(row.text)
  })

  test('keeps a legacy label as its group rather than treating it as inline markup', () => {
    const row: PackageFeatureRow = {
      label: 'CONTENT ENGINE',
      text: 'Content strategy, calendar and production',
      featured: true,
    }
    const presentation = getPackageFeaturePresentation(row)

    expect(presentation.group).toBe('Content Engine')
    expect(presentation.emphasisSource).toBe('leading')
    expect(presentation.parts.emphasis).toBe('Content strategy')
    expect(Object.values(presentation.parts).join('')).toBe(row.text)
  })

  test('leaves an ordinary feature row untouched', () => {
    const row: PackageFeatureRow = {
      group: 'Reporting',
      text: 'Weekly performance reporting',
    }
    const presentation = getPackageFeaturePresentation(row)

    expect(presentation.emphasisSource).toBe('none')
    expect(Object.values(presentation.parts).join('')).toBe(row.text)
  })
})

test.describe('homepage package card selection', () => {
  test('keeps exactly one package selected with native mouse and keyboard controls', async ({ page }) => {
    test.setTimeout(60_000)
    page.on('console', (message) => console.log(`[browser:${message.type()}] ${message.text()}`))
    page.on('pageerror', (error) => console.log(`[browser:error] ${error.message}`))
    await page.emulateMedia({ reducedMotion: 'reduce' })
    const response = await page.goto('/#packages')
    await page.waitForLoadState('networkidle')
    const initialHtml = await response?.text()

    const cards = page.getByTestId('package-card')
    const radios = page.getByTestId('package-radio')
    await expect(cards).toHaveCount(3)
    await expect(radios).toHaveCount(3)
    await expect(cards.nth(0)).toHaveAttribute('data-package-tone', 'start')
    await expect(cards.nth(1)).toHaveAttribute('data-package-tone', 'system')
    await expect(cards.nth(2)).toHaveAttribute('data-package-tone', 'scale')
    expect(initialHtml).toBeDefined()
    expect(initialHtml).not.toContain('From 0 VND/month')
    await expect(page.getByText('From 0 VND/month', { exact: true })).toHaveCount(0)
    expect(await page.content()).not.toContain('From 0 VND/month')
    await expect(page.locator('[data-testid="package-card"] article[role="button"]')).toHaveCount(0)
    const packageTerms = page.getByRole('note', { name: 'Important package terms' })
    await expect(packageTerms).toBeVisible()
    await expect(packageTerms.locator('.package-terms-emphasis')).not.toHaveCount(0)

    for (let index = 0; index < 3; index += 1) {
      const featureRows = cards.nth(index).locator('.package-card-features').getByTestId('package-feature-row')
      const featureCount = await featureRows.count()
      expect(featureCount).toBeGreaterThan(0)
      await expect(featureRows.locator('.package-feature-group')).toHaveCount(featureCount)
      await expect(featureRows.locator('.package-feature-group[aria-hidden="true"]')).toHaveCount(0)
      expect(await featureRows.getByTestId('package-feature-emphasis').count()).toBeGreaterThan(0)

      const expanderGroups = cards.nth(index).locator('section[aria-labelledby]')
      const expanderGroupCount = await expanderGroups.count()
      await expect(expanderGroups.locator('h4[id]')).toHaveCount(expanderGroupCount)
    }

    const radioTarget = await radios.first().locator('..').boundingBox()
    expect(radioTarget?.height).toBeGreaterThanOrEqual(44)

    async function expectSelected(expectedIndex: number) {
      for (let index = 0; index < 3; index += 1) {
        await expect(cards.nth(index)).toHaveAttribute('data-selected', index === expectedIndex ? 'true' : 'false')
        if (index === expectedIndex) await expect(radios.nth(index)).toBeChecked()
        else await expect(radios.nth(index)).not.toBeChecked()
      }
      await expect(page.locator('[data-testid="package-card"][data-selected="true"]')).toHaveCount(1)
      await expect(page.locator('[data-testid="package-radio"]:checked')).toHaveCount(1)
    }

    await expectSelected(1)

    await radios.nth(0).click()
    await expectSelected(0)

    await radios.nth(2).focus()
    await page.keyboard.press('Space')
    await expectSelected(2)

    await page.keyboard.press('ArrowRight')
    await expectSelected(0)

    await page.keyboard.press('ArrowLeft')
    await expectSelected(2)
  })
})
