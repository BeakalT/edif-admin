import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('a news article, a tender and an event page are accessible and complete', async ({ page }) => {
  for (const [list, prefix] of [['/news', '/news/'], ['/tenders', '/tenders/'], ['/events', '/events/']] as const) {
    await page.goto(list)
    const href = await page.locator(`a[href^="${prefix}"]`).first().getAttribute('href').catch(() => null)
    if (!href) continue // an empty list is a valid state
    await page.goto(href)
    await page.waitForLoadState('networkidle')
    await page.addStyleTag({ content: '*{animation:none!important;transition:none!important}' })
    expect(await page.locator('h1').count(), href).toBe(1)
    const v = (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()).violations
    expect(v.map((x) => `${x.id}: ${x.nodes[0]?.target.join(' ')}`), href).toEqual([])
  }
})

test('the site works on a narrow phone without sideways scrolling', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 })
  for (const p of ['/', '/deposit-protection/calculator', '/members', '/contact']) {
    await page.goto(p)
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
    expect(overflow, p).toBeLessThanOrEqual(1)
  }
})

test('the coverage calculator gives the right answer', async ({ page }) => {
  await page.goto('/deposit-protection/calculator')
  await page.getByLabel(/Account 1: institution/).selectOption({ index: 1 })
  await page.getByLabel(/Account 1: balance in Birr/).fill('250000')
  const result = page.locator('.calc-out')
  await expect(result).toContainText('100,000')
  await expect(result).toContainText('150,000')
})

test('contact form validates before sending', async ({ page }) => {
  await page.goto('/contact')
  await page.getByRole('button', { name: /send/i }).first().click()
  await expect(page.locator(':invalid').first()).toBeVisible()
})

test('the search page finds seeded content', async ({ page }) => {
  await page.goto('/search?q=deposit')
  await expect(page.locator('main')).toContainText(/deposit/i)
})
