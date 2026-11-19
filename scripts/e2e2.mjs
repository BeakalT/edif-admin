import fs from 'fs'
import { TOTP, Secret } from 'otpauth'
const U = JSON.parse(fs.readFileSync(new URL('./.test-users.json', import.meta.url)))
const B = 'http://localhost:3100'
const RUN = Math.floor(Math.random() * 200) + 20 // each run uses its own network address so the rate limiter does not carry over
let ipn = 0
const nextIp = () => `10.${RUN}.${++ipn}.1`
let pass = 0, fail = 0
const ok = (n, c, d = '') => { c ? pass++ : fail++; console.log(c ? 'PASS' : 'FAIL', n, d) }
const code = (secret) => new TOTP({ secret: Secret.fromBase32(secret), digits: 6, period: 30, algorithm: 'SHA1' }).generate()
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

class Client {
  constructor(role, ip = nextIp()) { this.role = role; this.ip = ip; this.jar = {} }
  absorb(x) { for (const c of x.headers.getSetCookie?.() || []) { const [kv] = c.split(';'); const i = kv.indexOf('='); this.jar[kv.slice(0, i)] = kv.slice(i + 1) } }
  async raw(method, path, body) {
    const cookie = Object.entries(this.jar).map(([k, v]) => `${k}=${v}`).join('; ')
    const x = await fetch(B + path, { method, redirect: 'manual', headers: { 'content-type': 'application/json', 'x-forwarded-for': this.ip, origin: B, ...(cookie ? { cookie } : {}) }, body: body ? JSON.stringify(body) : undefined })
    this.absorb(x)
    return { s: x.status, j: await x.json().catch(() => ({})) }
  }
  api(method, path, body) { return this.raw(method, '/api' + path, body) }
  async login(email = U[this.role]?.email, password = U[this.role]?.password) { return this.api('POST', '/users/login', { email, password }) }
  async verify(secret = U[this.role].totpSecret) { const r = await this.api('POST', '/verify-totp', { token: code(secret) }); return r.j.ok === false ? { ...r, s: 401 } : r }
  async full() { const l = await this.login(); if (l.s !== 200) throw new Error(`${this.role} login ${l.s}`); const v = await this.verify(); if (v.s !== 200) throw new Error(`${this.role} verify ${v.s} ${JSON.stringify(v.j)}`); return this }
}
const site = async (p) => { const x = await fetch(B + p, { redirect: 'manual' }); return { s: x.status, loc: x.headers.get('location'), t: x.status === 200 ? await x.text() : '' } }
const until = async (fn, ms = 20000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await fn()) return Date.now() - t0; await sleep(400) } return -1 }
const outboxDir = new URL('../outbox/', import.meta.url)
const mails = () => (fs.existsSync(outboxDir) ? fs.readdirSync(outboxDir).sort().map((f) => ({ f, ...JSON.parse(fs.readFileSync(new URL(f, outboxDir))) })) : [])
const mailTo = async (to, sub, since) => { const t = Date.now(); while (Date.now() - t < 8000) { const m = mails().filter((x) => x.f > since && x.to?.includes(to) && x.subject.includes(sub)); if (m.length) return m[m.length - 1]; await sleep(300) } return null }
const mark = () => (mails().at(-1)?.f ?? '0')

// ---------- two-factor ----------
const ed = new Client('editor')
let r = await ed.login(); ok('password alone signs in (step 1)', r.s === 200)
r = await ed.api('GET', '/news'); ok('…but gives NO access until the code is entered', r.s === 403, r.s)
r = await ed.api('POST', '/verify-totp', { token: '000000' }); ok('wrong code is rejected', r.j.ok === false, JSON.stringify(r.j).slice(0, 80))
r = await ed.verify(); ok('correct code opens the session', r.s === 200, r.s)
r = await ed.api('GET', '/news'); ok('editor can now read content', r.s === 200, r.s)
const [pub, pub2, adm, seo, aud] = await Promise.all(['publisher', 'publisher2', 'admin', 'seo', 'auditor'].map((x) => new Client(x).full()))
ok('all other roles sign in with a code', true)
// review G-01: draft preview needs the code, not just the password
const anyNews = (await ed.api('GET', '/news?limit=1&draft=true')).j.docs?.[0]?.id
if (anyNews) {
  const half = new Client('editor'); await half.login()
  ok('draft preview is refused after the password alone (review G-01)', (await half.raw('GET', `/preview/news/${anyNews}`)).s === 404)
  ok('draft preview opens once the code is entered', (await ed.raw('GET', `/preview/news/${anyNews}`)).s === 200)
}

// ---------- password policy ----------
const weak = ['short1A!', 'alllowercaseletters', 'Password1234!', 'Aaaa1111Bbbb!!', 'MyEditor#Test99']
for (const w of weak) { r = await ed.api('PATCH', `/users/${(await ed.api('GET', '/users/me')).j.user.id}`, { password: w }); ok(`weak password refused: ${w}`, r.s >= 400, r.s) }

// ---------- registration is closed; Super Admin invites ----------
r = await new Client(null).api('POST', '/users', { email: 'x@evil.org', password: 'Zq!8vK2mLp9x', name: 'x', role: 'admin' }); ok('anonymous cannot register', r.s === 403, r.s)
r = await ed.api('POST', '/users', { email: 'x@evil.org', password: 'Zq!8vK2mLp9x', name: 'x', role: 'admin' }); ok('editor cannot create users', r.s === 403, r.s)
r = await new Client(null).api('POST', '/users/first-register', { email: 'x@evil.org', password: 'Zq!8vK2mLp9x' }); ok('first-user sign-up is closed', r.s >= 400, r.s)
const since = mark(), newEmail = `invitee${Date.now()}@edif-cms.org`
r = await adm.api('POST', '/users', { email: newEmail, name: 'New Editor', role: 'editor', password: 'placeholder-ignored' }); ok('Super Admin creates an account', r.s === 201, r.s)
const invite = await mailTo(newEmail, 'Set your password', since); ok('invitation email is sent', !!invite)
const token = (invite?.html || invite?.text || "").match(/reset\/([A-Za-z0-9]+)/)?.[1]; ok('email carries a one-time setup link', !!token)
const inv = new Client(null)
r = await inv.api('POST', '/users/reset-password', { token, password: 'weakpass' }); ok('setting a weak password through the link is refused', r.s >= 400, r.s)
r = await inv.api('POST', '/users/reset-password', { token, password: 'Orange-Tiger-Lamp-49' }); ok('strong password accepted through the link', r.s === 200, r.s + ' ' + JSON.stringify(r.j).slice(0, 100))
r = await inv.api('GET', '/news'); ok('new user is held at two-factor setup until they enrol', r.s === 403, r.s)
r = await inv.api('POST', '/users/reset-password', { token, password: 'Another-Strong-Pass-71' }); ok('setup link works only once', r.s >= 400, r.s)
const newId = (await adm.api('GET', `/users?where[email][equals]=${encodeURIComponent(newEmail)}`)).j.docs?.[0]?.id
r = await adm.api('PATCH', `/users/${newId}`, { password: 'Admin-Sets-Pass-55x' }); ok('Super Admin cannot set someone else’s password', r.s >= 400, r.s)
r = await adm.api('PATCH', `/users/${newId}`, { role: 'seo' }); ok('Super Admin can change a role', r.s === 200, r.s)
ok('role-change notice emailed to the user', !!(await mailTo(newEmail, 'access level', since)))
r = await pub.api('PATCH', `/users/${(await pub.api('GET', '/users/me')).j.user.id}`, { role: 'admin' }); ok('a user cannot promote themselves', (await pub.api('GET', '/users/me')).j.user.role === 'publisher')

// ---------- two-step review ----------
const stamp = Date.now(), slug = 'e2e-' + stamp, title = 'Review test ' + stamp
const since2 = mark()
r = await pub.api('POST', '/news?draft=true', { title: 'Self ' + stamp, slug: slug + '-self', kind: 'Announcement', date: new Date().toISOString(), summary: 's' }); const selfId = r.j.doc?.id
r = await pub.api('PATCH', `/news/${selfId}`, { _status: 'published' }); ok('a Publisher cannot publish their own new draft', r.s === 403, r.s)
r = await pub.api('POST', '/news', { title: 'Direct ' + stamp, slug: slug + '-direct', kind: 'Announcement', date: new Date().toISOString(), summary: 's', _status: 'published' }); ok('create-and-publish in one step is refused', r.s === 403, r.s)
r = await pub2.api('PATCH', `/news/${selfId}`, { _status: 'published' }); ok('a different Publisher can approve it', r.s === 200, r.s)
r = await ed.api('POST', '/news?draft=true', { title, slug, kind: 'Announcement', date: new Date().toISOString(), summary: 'Two-step review test.', reviewStatus: 'in_review' }); ok('editor submits a draft for review', r.s === 201, r.s); const id = r.j.doc?.id
ok('publishers are emailed that a review is waiting', !!(await mailTo(U.publisher.email, 'Ready for review', since2)))
ok('draft not visible on the website', (await site('/news/' + slug)).s === 404)
r = await ed.api('PATCH', `/news/${id}`, { _status: 'published' }); ok('editor cannot publish', r.s === 403, r.s)
r = await pub.api('PATCH', `/news/${id}`, { _status: 'published', title: 'Changed on the way ' + stamp }); ok('publisher cannot slip in changes while approving', r.s === 403, r.s)
r = await pub.api('PATCH', `/news/${id}`, { _status: 'published' }); ok('publisher approves the editor’s draft', r.s === 200, r.s)
let ms = await until(async () => (await site('/news/' + slug)).s === 200); ok('approved article is live', ms >= 0, ms >= 0 ? `after ${ms} ms` : 'timed out')
r = await pub.api('PATCH', `/news/${id}?draft=true`, { summary: 'Edited by publisher one' }); ok('publisher saves a change as draft', r.s === 200, r.s)
r = await pub.api('PATCH', `/news/${id}`, { _status: 'published' }); ok('…but cannot publish that change themself', r.s === 403, r.s)
r = await pub2.api('PATCH', `/news/${id}`, { _status: 'published' }); ok('second Publisher approves it', r.s === 200, r.s)
ms = await until(async () => (await site('/news/' + slug)).t.includes('Edited by publisher one')); ok('change goes live', ms >= 0, ms >= 0 ? `after ${ms} ms` : 'timed out')
r = await pub.api('PATCH', `/news/${id}`, { _status: 'draft' }); ok('one Publisher can take content offline quickly', r.s === 200, r.s)
ms = await until(async () => (await site('/news/' + slug)).s === 404); ok('article leaves the website', ms >= 0, ms >= 0 ? `after ${ms} ms` : 'timed out')
r = await adm.api('POST', '/news', { title: 'SA ' + stamp, slug: slug + '-sa', kind: 'Announcement', date: new Date().toISOString(), summary: 's', _status: 'published' }); ok('Super Admin publishes directly, no second approver', r.s === 201, r.s)
ok('admins are emailed about publishing', !!(await mailTo(U.admin.email, 'Content published', since2)))

// ---------- audit + lockout + rate limit ----------
r = await aud.api('GET', '/audit-log?limit=60&sort=-createdAt'); ok('auditor reads the log', r.s === 200 && r.j.docs?.length > 0, r.s)
ok('log records review submissions', r.j.docs.some((d) => d.action === 'submit' && d.documentTitle === title))
ok('log records who published', r.j.docs.some((d) => d.action === 'publish' && d.actor.startsWith('publisher')))
ok('editor cannot read the log', (await ed.api('GET', '/audit-log')).s === 403)
const lk = new Client(null)
for (let i = 0; i < 5; i++) await lk.login(U.seo.email, 'wrong-password-' + i)
r = await lk.login(U.seo.email, U.seo.password); ok('account locks after repeated wrong passwords', r.s !== 200, r.s)
await sleep(1500)
r = await aud.api('GET', '/audit-log?limit=30&sort=-createdAt'); ok('failed sign-ins are logged', r.j.docs.some((d) => d.action === 'security' && d.documentTitle === U.seo.email), '')
ok('admins are emailed about the lock', !!(await mailTo(U.admin.email, 'Account locked', since2)))
for (const [who, c] of [['admin', adm], ['auditor', aud]]) { r = await c.api('GET', '/notifications?limit=20&sort=-createdAt&depth=0'); ok(`${who} gets an in-app alert about the lock`, r.s === 200 && r.j.docs.some((d) => d.title === 'Account locked' && d.kind === 'security' && /audit-log/.test(d.link || '')), r.s) }
ok('editor gets no lock alert', !((await ed.api('GET', '/notifications?limit=20&depth=0')).j.docs || []).some((d) => d.title === 'Account locked'))
r = await aud.api('GET', '/audit-log?limit=20&sort=-createdAt&where[action][in]=security'); ok('audit tab filter returns only security entries', r.s === 200 && r.j.docs.length > 0 && r.j.docs.every((d) => d.action === 'security'), r.s)
ok('audit entries carry a readable summary', r.j.docs.every((d) => typeof d.summary === 'string' && d.summary.length > 8) && r.j.docs.some((d) => /locked/i.test(d.summary)), r.j.docs[0]?.summary)
r = await adm.api('POST', `/users/unlock`, { email: U.seo.email }); ok('only Super Admin can unlock (admin does)', r.s === 200, r.s)
r = await ed.api('POST', '/users/unlock', { email: U.seo.email }); ok('an editor cannot unlock accounts', r.s === 403, r.s)
const rl = new Client(null); let got429 = false
for (let i = 0; i < 35; i++) { const x = await rl.login('nobody@edif-cms.org', 'x'); if (x.s === 429) got429 = true } // limit is 30 per 15 minutes per address (src/proxy.ts)
ok('rapid sign-in attempts from one address are throttled (429)', got429)

// ---------- reset two-factor ----------
r = await adm.api('POST', `/users/${newId}/reset-2fa`); ok('Super Admin can reset a person’s two-factor', r.s === 200, r.s)
r = await ed.api('POST', `/users/${newId}/reset-2fa`); ok('others cannot reset two-factor', r.s === 403, r.s)
const p2id = (await pub2.api('GET', '/users/me')).j.user.id
r = await adm.api('POST', `/users/${p2id}/reset-2fa`); ok('reset signs the person out everywhere', r.s === 200 && (await pub2.api('GET', '/news')).s === 403, r.s)
const p2 = new Client('publisher2'); await p2.login()
ok('after a reset they must enrol again before getting access', (await p2.api('GET', '/news')).s === 403)

// ---------- public site still fine ----------
ok('home page loads', (await site('/')).s === 200)
const med = await fetch(B + '/api/media?limit=1', { headers: { 'x-forwarded-for': nextIp() } }); ok('visitors cannot list the media library (review G-05)', med.status === 403, med.status)
const fileUrl = ((await site('/about')).t || '').match(/\/api\/media\/file\/[^"?&) ]+/)?.[0]
if (fileUrl) { const f = await fetch(B + fileUrl, { headers: { 'x-forwarded-for': nextIp() } }); ok('visitors can still open a file the site links to', f.status === 200, f.status) }
ok('anonymous cannot read news through the API', (await new Client(null).api('GET', '/news')).s === 403)
console.log(`\n${pass}/${pass + fail} passed`); process.exit(fail ? 1 : 0)
