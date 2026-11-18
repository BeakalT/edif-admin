// Captures the admin screens for a design review. Usage: node scripts/admin-shots.mjs <outDir> [roles=admin] [themes=light,dark]
// Needs the site running on :3100 and test accounts (npx tsx scripts/mkusers.ts).
import fs from 'fs'
import { chromium } from 'playwright'
import { TOTP, Secret } from 'otpauth'

const OUT = process.argv[2] || '/tmp/shots'
const ROLES = (process.argv[3] || 'admin').split(',')
const THEMES = (process.argv[4] || 'light,dark').split(',')
const B = process.env.BASE_URL || 'http://localhost:3100'
const ADMIN = process.env.ADMIN_PATH || '/admin'
const U = JSON.parse(fs.readFileSync(new URL('./.test-users.json', import.meta.url)))
const code = (s) => new TOTP({ secret: Secret.fromBase32(s), digits: 6, period: 30, algorithm: 'SHA1' }).generate()
fs.mkdirSync(OUT, { recursive: true })

async function session(role, ip) {
  const jar = {}
  const call = async (path, body) => {
    const x = await fetch(B + '/api' + path, { method: 'POST', headers: { 'content-type': 'application/json', origin: B, 'x-forwarded-for': ip, cookie: Object.entries(jar).map(([k, v]) => `${k}=${v}`).join('; ') }, body: JSON.stringify(body) })
    for (const c of x.headers.getSetCookie?.() || []) { const [kv] = c.split(';'); const i = kv.indexOf('='); jar[kv.slice(0, i)] = kv.slice(i + 1) }
    return x.status
  }
  if ((await call('/users/login', { email: U[role].email, password: U[role].password })) !== 200) throw new Error('login failed ' + role)
  if ((await call('/verify-totp', { token: code(U[role].totpSecret) })) !== 200) throw new Error('2fa failed ' + role)
  return jar
}

const SCREENS = {
  'dashboard': '',
  'pages-list': '/collections/pages',
  'news-list': '/collections/news',
  'news-create': '/collections/news/create',
  'media-list': '/collections/media',
  'media-create': '/collections/media/create',
  'users-list': '/collections/users',
  'users-create': '/collections/users/create',
  'audit-log': '/collections/audit-log',
  'messages': '/collections/messages',
  'key-figures': '/collections/key-figures',
  'notices': '/collections/notices',
  'redirects': '/collections/redirects',
  'tenders-list': '/collections/tenders',
  'brand-theme': '/globals/brand-theme',
  'navigation': '/globals/navigation',
  'site-settings': '/globals/site-settings',
  'account': '/account',
}

const browser = await chromium.launch()
let n = 0
for (const role of ROLES) {
  const jar = await session(role, `10.${100 + n++}.1.1`)
  for (const theme of THEMES) {
    const ctx = await browser.newContext({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1, colorScheme: theme })
    await ctx.addCookies([...Object.entries(jar).map(([name, value]) => ({ name, value, domain: 'localhost', path: '/' })), { name: 'payload-theme', value: theme, domain: 'localhost', path: '/' }])
    const page = await ctx.newPage()
    const targets = { ...SCREENS }
    // first page and first article, for the real edit screens
    for (const [key, list, slug] of [['page-edit', 'pages', 'pages'], ['news-edit', 'news', 'news']]) {
      const r = await fetch(`${B}/api/${slug}?limit=1&depth=0`, { headers: { origin: B, 'x-forwarded-for': '10.200.1.1', cookie: Object.entries(jar).map(([k, v]) => `${k}=${v}`).join('; ') } })
      const j = await r.json().catch(() => ({}))
      if (j.docs?.[0]?.id) targets[key] = `/collections/${list}/${j.docs[0].id}`
    }
    for (const [name, p] of Object.entries(targets)) {
      try {
        await page.goto(B + ADMIN + p, { waitUntil: 'domcontentloaded', timeout: 90000 })
        await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {})
        await page.waitForTimeout(700)
        await page.screenshot({ path: `${OUT}/${role}-${theme}-${name}.png`, fullPage: false })
      } catch (e) { console.log('skip', role, theme, name, String(e).slice(0, 80)) }
    }
    await ctx.close()
  }
}
// logged-out screens
for (const theme of THEMES) {
  const ctx = await browser.newContext({ viewport: { width: 1600, height: 900 }, colorScheme: theme })
  await ctx.addCookies([{ name: 'payload-theme', value: theme, domain: 'localhost', path: '/' }])
  const page = await ctx.newPage()
  await page.goto(B + ADMIN + '/login', { waitUntil: 'networkidle' }); await page.waitForTimeout(500)
  await page.screenshot({ path: `${OUT}/anon-${theme}-login.png` })
  await ctx.close()
}
await browser.close()
console.log('shots in', OUT, fs.readdirSync(OUT).length)
