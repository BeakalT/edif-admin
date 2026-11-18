// WCAG 2.2 AA scan of the admin screens (light + dark). Usage: node scripts/admin-axe.mjs
import fs from 'fs'
import { chromium } from 'playwright'
import AxeBuilder from '@axe-core/playwright'
import { TOTP, Secret } from 'otpauth'
const B = process.env.BASE_URL || 'http://localhost:3100', A = process.env.ADMIN_PATH || '/admin'
const U = JSON.parse(fs.readFileSync(new URL('./.test-users.json', import.meta.url)))
const jar = {}
const call = async (p, b) => { const x = await fetch(B + '/api' + p, { method: 'POST', headers: { 'content-type': 'application/json', origin: B, 'x-forwarded-for': '10.210.1.1', cookie: Object.entries(jar).map(([k, v]) => `${k}=${v}`).join('; ') }, body: JSON.stringify(b) }); for (const c of x.headers.getSetCookie()) { const [kv] = c.split(';'); const i = kv.indexOf('='); jar[kv.slice(0, i)] = kv.slice(i + 1) } return x.status }
if (await call('/users/login', { email: U.admin.email, password: U.admin.password }) !== 200) throw new Error('login')
if (await call('/verify-totp', { token: new TOTP({ secret: Secret.fromBase32(U.admin.totpSecret) }).generate() }) !== 200) throw new Error('2fa')
const screens = ['', '/collections/pages', '/collections/news', '/collections/news/create', '/collections/media', '/collections/users', '/collections/audit-log', '/globals/site-settings', '/globals/brand-theme', '/account']
const br = await chromium.launch(); let bad = 0
for (const theme of (process.env.THEMES || 'light,dark').split(',')) {
  const ctx = await br.newContext({ viewport: { width: 1600, height: 900 }, colorScheme: theme })
  await ctx.addCookies([...Object.entries(jar).map(([name, value]) => ({ name, value, domain: 'localhost', path: '/' })), { name: 'payload-theme', value: theme, domain: 'localhost', path: '/' }])
  const page = await ctx.newPage()
  for (const s of screens) {
    await page.goto(B + A + s, { waitUntil: 'networkidle' }); await page.waitForTimeout(600)
    const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()
    for (const v of r.violations) { bad++; console.log(theme, s || '/', v.id, v.impact, v.nodes.length, process.env.DETAIL ? v.nodes.slice(0,2).map(n => n.html.slice(0, 220)).join(' || ') + ' :: ' + (v.nodes[0].any[0]?.message || '') : v.nodes[0].target.join(' ').slice(0, 90)) }
  }
  await ctx.close()
}
await br.close(); console.log(bad ? `${bad} violation groups` : 'admin axe: clean')
process.exit(bad ? 1 : 0)
