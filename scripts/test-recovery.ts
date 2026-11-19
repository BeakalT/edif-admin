// Checks for two-factor recovery codes (src/lib/recovery.ts, src/lib/recoveryEndpoints.ts). Talks to the database directly and
// calls the real endpoint handlers, so it covers password checks, hashing, single use, lockout, sign-out and the audit log.
import crypto from 'crypto'
import { Secret } from 'otpauth'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { recoveryEndpoints } from '../src/lib/recoveryEndpoints'

const payload = await getPayload({ config })
let pass = 0, fail = 0
const check = (n: string, c: boolean, d = '') => { c ? pass++ : fail++; console.log(c ? 'PASS' : 'FAIL', n, d) }

const run = async (path: string, method: 'get' | 'post', user: any, body: Record<string, unknown> = {}) => {
  const ep = recoveryEndpoints.find((e) => e.path === path && e.method === method)!
  const req: any = { payload, user, json: async () => body, headers: new Headers({ 'x-forwarded-for': '10.9.9.9' }), context: {} }
  const res = await ep.handler(req)
  return { s: res.status, j: (await res.json()) as any }
}
const row = async (id: any): Promise<any> => payload.db.findOne({ collection: 'users', where: { id: { equals: id } } })
const uniq = Date.now()
const email = `recovery-${uniq}@edif-cms.org`
const password = crypto.randomBytes(14).toString('base64url') + 'Qz7!'
const made: any = await payload.create({ collection: 'users', overrideAccess: true, context: { seeding: true }, data: { email, password, name: 'Recovery test', role: 'editor' } as any })
const secret = new Secret({ size: 20 }).base32
await payload.db.updateOne({ collection: 'users', id: made.id, data: { totpSecret: secret, hasTotp: true, loginAttempts: 0, lockUntil: null } as any })
const twoFactor = { id: made.id, email, role: 'editor', collection: 'users', _strategy: 'totp' }
const passwordOnly = { ...twoFactor, _strategy: 'local-jwt' }

let r = await run('/recovery/codes', 'post', passwordOnly, { password })
check('codes need a session that has entered its authenticator code', r.s === 403, String(r.s))
r = await run('/recovery/codes', 'post', twoFactor, { password: 'wrong' })
check('codes need the password again', r.s === 400, String(r.s))
r = await run('/recovery/status', 'get', twoFactor)
check('a new account has no codes', r.s === 200 && r.j.remaining === 0, JSON.stringify(r.j))
r = await run('/recovery/codes', 'post', twoFactor, { password })
const codes: string[] = r.j.codes || []
check('ten codes are created', r.s === 200 && codes.length === 10, String(r.s))
const stored = JSON.stringify((await row(made.id)).recovery)
check('the stored column holds hashes, not the codes', codes.every((c) => !stored.includes(c.replace('-', ''))) && !stored.includes(codes[0]))
const viaApi: any = await payload.findByID({ collection: 'users', id: made.id, user: twoFactor as any, overrideAccess: false, depth: 0 })
check('the API never returns the stored codes', !('recovery' in viaApi) && !JSON.stringify(viaApi).includes('"codes"'))
const listed: any = await payload.find({ collection: 'users', overrideAccess: true, limit: 200, depth: 0 })
check('…not even with access overridden (hidden field)', !listed.docs.some((d: any) => 'recovery' in d))
r = await run('/recovery/status', 'get', twoFactor)
check('status counts the unused codes', r.j.remaining === 10, JSON.stringify(r.j))

const anon = null
const bad1 = await run('/recovery/use', 'post', anon, { email, password: 'wrong-password', code: codes[0] })
const bad2 = await run('/recovery/use', 'post', anon, { email, password, code: 'AAAAA-AAAAA' })
const bad3 = await run('/recovery/use', 'post', anon, { email: `nobody-${uniq}@edif-cms.org`, password: 'x', code: codes[0] })
check('wrong password, wrong code and unknown email give the same refusal', bad1.s === 400 && bad2.s === 400 && bad3.s === 400 && bad1.j.message === bad2.j.message && bad2.j.message === bad3.j.message, `${bad1.s} ${bad2.s} ${bad3.s}`)
check('a refusal leaves the authenticator in place', !!(await row(made.id)).totpSecret)

await payload.db.updateOne({ collection: 'users', id: made.id, data: { sessions: [{ id: 'keep-me-' + uniq, createdAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 3600_000).toISOString() }] } as any })
const used = await run('/recovery/use', 'post', anon, { email, password, code: codes[0].toLowerCase().replace('-', ' ') })
check('a correct password and code are accepted', used.s === 200 && used.j.ok === true && used.j.remaining === 9, JSON.stringify(used.j).slice(0, 100))
const after = await row(made.id)
check('the authenticator is removed', !after.totpSecret)
check('every session is ended', !(after.sessions || []).some((s: any) => String(s.id).startsWith('keep-me-')))
const again = await run('/recovery/use', 'post', anon, { email, password, code: codes[0] })
check('a code works only once', again.s === 400 && again.j.message === bad1.j.message)
const noTotp = await run('/recovery/use', 'post', anon, { email, password, code: codes[1] })
check('with no authenticator enrolled there is nothing to reset', noTotp.s === 400)
const log: any = await payload.find({ collection: 'audit-log', where: { documentTitle: { equals: email } }, overrideAccess: true, limit: 50, depth: 0 })
const events = JSON.stringify(log.docs.map((d: any) => d.changes))
check('the audit log records creating and using codes and the wrong tries', /recovery codes created/.test(events) && /reset with a recovery code/.test(events) && /wrong or unusable/.test(events))
check('the audit log never contains a code', codes.every((c) => !events.includes(c) && !events.includes(c.replace('-', ''))))

// five wrong codes block further tries, even with a good code
await payload.db.updateOne({ collection: 'users', id: made.id, data: { totpSecret: secret, hasTotp: true, loginAttempts: 0, lockUntil: null } as any })
for (let i = 0; i < 5; i++) await run('/recovery/use', 'post', anon, { email, password, code: 'BBBBB-BBBBB' })
const blocked = await run('/recovery/use', 'post', anon, { email, password, code: codes[2] })
check('five wrong codes block further tries, even with a good code', blocked.s === 400 && !!(await row(made.id)).totpSecret)
const st: any = (await row(made.id)).recovery
const parsed = typeof st === 'string' ? JSON.parse(st) : st
check('the block is kept apart from the password counter', parsed.f >= 5)
await payload.db.updateOne({ collection: 'users', id: made.id, data: { recovery: { ...parsed, fa: new Date(Date.now() - 16 * 60_000).toISOString() } } as any })
const freed = await run('/recovery/use', 'post', anon, { email, password, code: codes[2] })
check('after 15 minutes a good code works again', freed.s === 200 && freed.j.ok === true, JSON.stringify(freed.j).slice(0, 80))

// creating a new set replaces the old one
await payload.db.updateOne({ collection: 'users', id: made.id, data: { totpSecret: secret, hasTotp: true } as any })
const second = await run('/recovery/codes', 'post', twoFactor, { password })
const oldTry = await run('/recovery/use', 'post', anon, { email, password, code: codes[3] })
check('a new set replaces the old one (old codes stop working)', second.s === 200 && oldTry.s === 400)
await payload.delete({ collection: 'users', id: made.id, overrideAccess: true }).catch(() => {})
console.log(`\n${pass}/${pass + fail} passed`)
process.exit(fail ? 1 : 0)
