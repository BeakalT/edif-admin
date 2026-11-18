// Walks every admin screen as every role at desktop, tablet and phone sizes; reports console errors, failed requests, horizontal overflow and blank pages.
import fs from 'fs'
import { chromium } from 'playwright'
import { TOTP, Secret } from 'otpauth'
const B = process.env.BASE_URL || 'http://localhost:3100'
const U = JSON.parse(fs.readFileSync(new URL('./.test-users.json', import.meta.url)))
const code = (s) => new TOTP({ secret: Secret.fromBase32(s), digits: 6, period: 30, algorithm: 'SHA1' }).generate()
async function session(role, ip) {
  const jar = {}
  const call = async (path, body) => {
    const x = await fetch(B + '/api' + path, { method: 'POST', headers: { 'content-type': 'application/json', origin: B, 'x-forwarded-for': ip, cookie: Object.entries(jar).map(([k, v]) => `${k}=${v}`).join('; ') }, body: JSON.stringify(body) })
    for (const c of x.headers.getSetCookie?.() || []) { const [kv] = c.split(';'); const i = kv.indexOf('='); jar[kv.slice(0, i)] = kv.slice(i + 1) }
    return x.status
  }
  if ((await call('/users/login', { email: U[role].email, password: U[role].password })) !== 200) throw new Error('login ' + role)
  if ((await call('/verify-totp', { token: code(U[role].totpSecret) })) !== 200) throw new Error('2fa ' + role)
  return jar
}
const PATHS = ['', '/collections/pages', '/collections/news', '/collections/news/create', '/collections/media', '/collections/users', '/collections/audit-log', '/collections/messages', '/collections/notifications', '/collections/tenders', '/collections/vacancies', '/collections/events', '/collections/key-figures', '/collections/notices', '/collections/redirects', '/collections/subscribers', '/globals/brand-theme', '/globals/navigation', '/globals/site-settings', '/account']
const SIZES = { desktop: [1600, 900], tablet: [820, 1100], phone: [390, 800] }
const ROLES = (process.argv[2] || 'admin,publisher,editor,seo,auditor').split(',')
const browser = await chromium.launch()
const problems = []
let n = 0
for (const role of ROLES) {
  const jar = await session(role, `10.${150 + n++}.2.2`)
  for (const [sz, [w, h]] of Object.entries(SIZES)) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h } })
    await ctx.addCookies(Object.entries(jar).map(([name, value]) => ({ name, value, domain: 'localhost', path: '/' })))
    const page = await ctx.newPage()
    let cur = ''
    const note = (m) => problems.push(`${role}/${sz} ${cur}: ${m}`)
    page.on('console', (m) => { if (m.type() === 'error' && !/favicon|Failed to load resource.*(40[13])/.test(m.text())) note('console: ' + m.text().slice(0, 140)) })
    page.on('pageerror', (e) => note('pageerror: ' + String(e).slice(0, 140)))
    page.on('response', (r) => { if (r.status() >= 500) note(`HTTP ${r.status()} ${r.url().slice(0, 100)}`) })
    for (const p of PATHS) {
      cur = p || '/'
      try {
        const r = await page.goto(B + '/admin' + p, { waitUntil: 'domcontentloaded', timeout: 90000 })
        await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {})
        await page.waitForTimeout(300)
        const st = r?.status()
        if (st && st >= 500) note('status ' + st)
        const info = await page.evaluate(() => ({ over: document.documentElement.scrollWidth - document.documentElement.clientWidth, text: document.body.innerText.length, url: location.pathname, err: /something went wrong|application error/i.test(document.body.innerText) }))
        if (info.over > 2) note(`horizontal overflow ${info.over}px`)
        if (info.text < 20) note('blank page')
        if (info.err) note('error text on page')
      } catch (e) { note('nav: ' + String(e).slice(0, 100)) }
    }
    await ctx.close()
  }
}
await browser.close()
const uniq = [...new Set(problems)]
console.log(uniq.length ? uniq.join('\n') : 'sweep: clean')
console.log(`${uniq.length} issue(s)`)
