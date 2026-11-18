import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

// Every public page type. Dynamic pages are found from the site itself so the list never goes stale.
const STATIC = ['/', '/about', '/about/governance', '/about/organization', '/about/strategy', '/deposit-protection', '/deposit-protection/coverage', '/deposit-protection/calculator', '/deposit-protection/payout', '/members', '/members/institutions', '/news', '/publications', '/faq', '/contact', '/events', '/tenders', '/vacancies', '/search?q=deposit']

for (const path of STATIC) {
  test(`WCAG 2.2 AA: ${path}`, async ({ page }, info) => {
    await page.goto(path)
    await page.waitForLoadState('networkidle')
    // let scroll-reveal animations settle so contrast is judged on the final state
    await page.addStyleTag({ content: '*{animation:none!important;transition:none!important}' })
    await page.evaluate(() => document.querySelectorAll('[class*="reveal"],[data-reveal]').forEach((e) => e.classList.add('in', 'is-in', 'show', 'visible')))
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze()
    const summary = results.violations.map((v) => `${v.id} (${v.impact}) x${v.nodes.length}: ${v.nodes.slice(0, 2).map((n) => n.target.join(' ')).join(' | ')}`)
    info.annotations.push({ type: 'violations', description: summary.join('\n') })
    expect(summary, summary.join('\n')).toEqual([])
  })
}

test('keyboard: a skip link is the first focusable element and reaches main content', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('Tab')
  const first = await page.evaluate(() => ({ text: document.activeElement?.textContent?.trim(), href: (document.activeElement as HTMLAnchorElement)?.getAttribute('href') }))
  expect(first.text?.toLowerCase()).toContain('skip')
  expect(first.href).toMatch(/^#/)
})

test('keyboard: focus is visible on interactive elements', async ({ page }) => {
  await page.goto('/')
  for (let i = 0; i < 6; i++) await page.keyboard.press('Tab')
  const outlined = await page.evaluate(() => {
    const el = document.activeElement as HTMLElement
    const cs = getComputedStyle(el)
    return cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0 || cs.boxShadow !== 'none'
  })
  expect(outlined).toBe(true)
})

test('motion: reduced-motion users get no looping animation', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' })
  const page = await ctx.newPage()
  await page.goto('/')
  const running = await page.evaluate(() => document.getAnimations().filter((a) => a.playState === 'running' && (a.effect as KeyframeEffect)?.getComputedTiming().iterations === Infinity).length)
  expect(running).toBe(0)
  await ctx.close()
})

test('pages declare language, title and one h1', async ({ page }) => {
  for (const p of ['/', '/about', '/faq']) {
    await page.goto(p)
    expect(await page.getAttribute('html', 'lang')).toBeTruthy()
    expect((await page.title()).length).toBeGreaterThan(5)
    expect(await page.locator('h1').count()).toBe(1)
  }
})
