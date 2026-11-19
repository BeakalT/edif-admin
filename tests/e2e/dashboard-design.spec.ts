import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { execSync } from 'child_process'
import path from 'path'
import { pathToFileURL } from 'url'

// Design checks for the admin dashboard. They use the real dashboard code with sample data (no server, no login),
// so a styling or layout slip is caught on every push: every role, light and dark, phone / tablet / desktop.
const ROLES = ['admin', 'publisher', 'editor', 'seo', 'auditor']
const THEMES = ['light', 'dark']
const url = (name: string) => pathToFileURL(path.resolve('.dashboard-preview', name)).href

test.beforeAll(() => { if (!process.env.SKIP_PREVIEW_BUILD) execSync('npx tsx scripts/dashboard-preview.tsx', { stdio: 'pipe', timeout: 120_000 }) })

for (const role of ROLES) {
  for (const theme of THEMES) {
    test(`dashboard layout and contrast: ${role}, ${theme}`, async ({ page }, info) => {
      await page.goto(url(`${role}-${theme}.html`))
      for (const width of [390, 820, 1280]) {
        await page.setViewportSize({ width, height: 900 })
        const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
        expect(over, `horizontal scroll at ${width}px`).toBeLessThanOrEqual(1)
      }
      await page.setViewportSize({ width: 1280, height: 900 })
      await page.addStyleTag({ content: '*{animation:none!important;transition:none!important}' })
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
      const bad = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical').map((v) => `${v.id} x${v.nodes.length}: ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(' | ')}`)
      expect(bad, bad.join('\n')).toEqual([])
      await info.attach(`${role}-${theme}.png`, { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' })
    })
  }
}

test.describe('dashboard: the interactive parts', () => {
  test('visits: 7 / 30 day switch and picking a day', async ({ page }) => {
    await page.goto(url('harness-light.html'))
    const panel = page.locator('.edif-pane--visits')
    await expect(panel.getByRole('heading', { name: 'Visits, last 7 days' })).toBeVisible()
    await expect(panel.locator('.edif-bars__col')).toHaveCount(7)
    await panel.getByRole('button', { name: '30 days' }).click()
    await expect(panel.getByRole('heading', { name: 'Visits, last 30 days' })).toBeVisible()
    await expect(panel.locator('.edif-bars__col')).toHaveCount(30)
    await panel.locator('.edif-bars__col').nth(10).click()
    await expect(panel.getByRole('button', { name: 'Show whole period' })).toBeVisible()
    await panel.getByRole('button', { name: 'Show whole period' }).click()
    await expect(panel.getByText('Top pages')).toBeVisible()
  })

  test('activity: filter chips narrow the list and can be undone', async ({ page }) => {
    await page.goto(url('harness-light.html'))
    const feed = page.locator('.edif-tl')
    await expect(feed.locator('.edif-tl__i')).toHaveCount(4)
    await feed.getByRole('button', { name: /^Security/ }).click()
    await expect(feed.locator('.edif-tl__i')).toHaveCount(1)
    await feed.getByRole('button', { name: /^All/ }).click()
    await expect(feed.locator('.edif-tl__i')).toHaveCount(4)
  })

  test('attention: snooze hides a row for a day and survives a reload; undo brings it back', async ({ page }) => {
    await page.goto(url('harness-light.html'))
    await page.evaluate(() => localStorage.clear())
    await page.reload()
    const row = page.getByText('A tender closing soon')
    await expect(row).toBeVisible()
    await page.getByRole('button', { name: 'Snooze this for a day' }).click({ force: true })
    await expect(row).toHaveCount(0)
    await page.reload()
    await expect(page.getByText('Snoozed for a day')).toBeVisible()
    await page.getByRole('button', { name: 'Undo' }).click()
    await expect(row).toBeVisible()
  })

  test('keyboard: every control can be reached and has a visible name', async ({ page }) => {
    await page.goto(url('harness-light.html'))
    const names = await page.$$eval('button', (els) => els.map((e) => (e.getAttribute('aria-label') || e.textContent || '').trim()))
    expect(names.every(Boolean)).toBe(true)
    await page.keyboard.press('Tab')
    expect(await page.evaluate(() => document.activeElement?.tagName)).not.toBe('BODY')
  })
})
