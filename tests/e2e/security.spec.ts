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
