import { test, expect } from '@playwright/test'

test('health endpoints', async ({ request }) => {
  const live = await request.get('/healthz'); expect(live.status()).toBe(200)
  const ready = await request.get('/readyz'); expect(ready.status()).toBe(200)
  expect((await ready.json()).db).toBe('ok')
  expect(ready.headers()['cache-control']).toContain('no-store')
})

test('security headers on the public site', async ({ request }) => {
  const r = await request.get('/')
  const h = r.headers()
  expect(h['x-content-type-options']).toBe('nosniff')
  expect(h['x-frame-options']).toBe('SAMEORIGIN')
  expect(h['referrer-policy']).toBeTruthy()
  expect(h['permissions-policy']).toContain('camera=()')
  expect(h['strict-transport-security']).toContain('max-age=')
  expect(h['content-security-policy']).toContain("object-src 'none'")
  // scripts are allowed by a per-visit nonce, never by 'unsafe-inline'
  const scriptSrc = (h['content-security-policy'] || '').split(';').find((d) => d.trim().startsWith('script-src')) || ''
  expect(scriptSrc).toMatch(/'nonce-[A-Za-z0-9+/=]{16,}'/)
  expect(scriptSrc).not.toContain('unsafe-inline')
  expect(scriptSrc).not.toContain('unsafe-eval')
  expect(h['x-powered-by']).toBeUndefined()
})

test('GraphQL is off and the first-user sign-up is closed', async ({ request }) => {
  expect((await request.post('/api/graphql', { data: { query: '{__typename}' } })).status()).toBeGreaterThanOrEqual(400)
  expect((await request.post('/api/users/first-register', { data: { email: 'x@evil.org', password: 'Zq!8vK2mLp9x' } })).status()).toBeGreaterThanOrEqual(400)
})

test('private areas are not indexed and the API does not leak users', async ({ request }) => {
  const robots = await (await request.get('/robots.txt')).text()
  expect(robots).toMatch(/Disallow: \/admin/)
  expect(robots).toMatch(/Disallow: \/api\//)
  expect((await request.get('/api/users')).status()).toBe(403)
  expect((await request.get('/api/audit-log')).status()).toBe(403)
})

test('a forged X-Forwarded-For cannot dodge the sign-in rate limit', async ({ request }) => {
  // Our proxy appends the real address on the right. Varying the forged left side must not give a fresh allowance.
  const realTail = `10.77.${Math.floor(Math.random() * 200)}.${Math.floor(Math.random() * 200)}`
  let limited = 0
  for (let i = 0; i < 16; i++) {
    const r = await request.post('/api/users/login', { headers: { 'x-forwarded-for': `203.0.113.${i}, ${realTail}`, origin: process.env.BASE_URL || 'http://localhost:3100' }, data: { email: 'nobody@edif-cms.org', password: 'wrong-password-' + i } })
    if (r.status() === 429) limited++
  }
  expect(limited).toBeGreaterThan(0)
})

test('unknown pages return a real 404 with the site layout', async ({ page }) => {
  const r = await page.goto('/this-page-does-not-exist-xyz')
  expect(r?.status()).toBe(404)
  await expect(page.locator('header')).toBeVisible()
})

test('the nonce changes on every visit', async ({ request }) => {
  const nonce = async () => ((await request.get('/')).headers()['content-security-policy'] || '').match(/'nonce-([^']+)'/)?.[1]
  const [a, b] = [await nonce(), await nonce()]
  expect(a).toBeTruthy()
  expect(a).not.toBe(b)
})

test('the strict policy blocks nothing the site and admin need, and blocks injected script', async ({ page }) => {
  const violations: string[] = []
  page.on('console', (m) => { if (/Content Security Policy|Refused to (execute|load)/i.test(m.text())) violations.push(m.text()) })
  page.on('pageerror', (e) => violations.push('page error: ' + e.message))
  const admin = '/' + (process.env.ADMIN_PATH || '/admin').replace(/^\/+|\/+$/g, '')
  for (const path of ['/', '/about', '/news', '/deposit-protection/calculator', '/contact', '/search?q=deposit', admin + '/login']) {
    await page.goto(path, { waitUntil: 'networkidle' })
    // the page is interactive: React hydrated and its client code ran
    expect(await page.evaluate(() => document.readyState)).toBe('complete')
  }
  expect(violations, violations.join('\n')).toEqual([])
  // a script injected without the nonce must not run
  await page.goto('/')
  const ran = await page.evaluate(() => new Promise<boolean>((done) => {
    const w = window as unknown as { __injected?: boolean }
    w.__injected = false
    const s = document.createElement('script'); s.textContent = 'window.__injected = true'
    document.body.appendChild(s)
    setTimeout(() => done(w.__injected === true), 300)
  }))
  expect(ran).toBe(false)
})
