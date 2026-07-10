import { expect, test } from '@playwright/test'

const retiredPackagePaths = ['/packages', '/en/packages', '/vi/packages', '/ko/packages']

test.describe('aggregate Packages page retirement', () => {
  for (const path of retiredPackagePaths) {
    test(`${path} redirects directly to the Homepage Packages section`, async ({ request, baseURL }) => {
      const response = await request.get(path, { maxRedirects: 0 })

      expect(response.status()).toBe(308)
      const location = response.headers().location
      expect(location).toBeTruthy()
      const destination = new URL(location!, baseURL)
      expect(destination.pathname).toBe('/')
      expect(destination.hash).toBe('#packages')
    })
  }

  test('preserves campaign query parameters when retiring the Packages URL', async ({ request, baseURL }) => {
    const response = await request.get('/packages?utm_source=google&foo=bar', { maxRedirects: 0 })
    expect(response.status()).toBe(308)

    const destination = new URL(response.headers().location!, baseURL)
    expect(destination.pathname).toBe('/')
    expect(destination.searchParams.get('utm_source')).toBe('google')
    expect(destination.searchParams.get('foo')).toBe('bar')
    expect(destination.hash).toBe('#packages')
  })

  test('published pages no longer expose obsolete Packages links', async ({ page }) => {
    for (const path of ['/', '/about', '/insights', '/gg99-vn-la-gi']) {
      await page.goto(path)
      const hrefs = await page.locator('a[href]').evaluateAll((anchors) =>
        anchors.map((anchor) => anchor.getAttribute('href') ?? ''),
      )
      expect(hrefs.filter((href) => /^\/(?:(?:en|vi|ko)\/)?packages(?:[?#]|$)/.test(href))).toEqual([])
    }

    await page.goto('/#packages')
    await expect(page.locator('section#packages')).toBeVisible()
    await expect(page.locator('[id="packages"]')).toHaveCount(1)
  })

  test('sitemap and llms point to the Homepage Packages section', async ({ request }) => {
    const [sitemapResponse, llmsResponse] = await Promise.all([
      request.get('/sitemap.xml'),
      request.get('/llms.txt'),
    ])
    expect(sitemapResponse.ok()).toBeTruthy()
    expect(llmsResponse.ok()).toBeTruthy()

    const sitemap = await sitemapResponse.text()
    const llms = await llmsResponse.text()
    expect(sitemap).not.toMatch(/<loc>https?:\/\/[^<]+\/packages<\/loc>/)
    expect(llms).not.toContain('https://www.gg99.vn/packages')
    expect(llms).toContain('https://www.gg99.vn/#packages')
  })
})
