import type { Endpoint, PayloadRequest, Where } from 'payload'
import { clientIp } from '../access'
import { notifyRoles, notifyUser } from './notify'
import { clearWrong, consumeCode, countWrong, isBlocked, newCodes, readState, unused } from './recovery'

/**
 * Recovery codes for two-factor sign-in (see lib/recovery.ts).
 *   GET  /api/users/recovery/status   how many unused codes the signed-in person has
 *   POST /api/users/recovery/codes    {password}: make a new set, replacing the old one (the codes are shown once)
 *   POST /api/users/recovery/use      {email, password, code}: for someone without their phone. Removes the authenticator and
 *                                     signs the person out everywhere; they sign in with the password and scan a new QR code.
 * All three live under /api/users/, so the proxy rule that limits sign-in to staff networks covers them too.
 */

const NO_STORE = { 'Cache-Control': 'no-store' }
const json = (body: unknown, status = 200) => Response.json(body, { status, headers: NO_STORE })
const FAIL = 'Those details did not work. Check the email, password and recovery code. After five wrong codes this is blocked for 15 minutes.'

const readBody = async (req: PayloadRequest): Promise<Record<string, unknown>> => {
  try {
    const b = req.json ? await req.json() : null
    return b && typeof b === 'object' ? (b as Record<string, unknown>) : {}
  } catch {
    return {}
  }
}
const str = (v: unknown, max = 300) => (typeof v === 'string' && v.length <= max ? v : '')
const twoFactorUser = (req: PayloadRequest) => {
  const u = req.user as { id: string | number; email: string; role?: string; collection?: string; _strategy?: string } | null
  return u && u.collection === 'users' && u._strategy === 'totp' ? u : null
}
const full = (req: PayloadRequest, where: Where) => req.payload.db.findOne({ collection: 'users', where }) as Promise<any>
const audit = (req: PayloadRequest, actor: string, role: string, doc: { id: string | number; email: string }, event: string) =>
  req.payload.create({ collection: 'audit-log', overrideAccess: true, data: { resource: 'users', changes: { event: { to: event } }, ip: clientIp(req), actor, actorRole: role, action: 'security', documentId: String(doc.id), documentTitle: doc.email } as any })

/** Checks the password the same way sign-in does (so the normal lock after five wrong passwords applies). */
async function passwordOk(req: PayloadRequest, email: string, password: string): Promise<{ id: string | number; email: string; role?: string } | null> {
  if (!email || !password) return null
  try {
    const r = await req.payload.login({ collection: 'users', data: { email, password } })
    return r.user as unknown as { id: string | number; email: string; role?: string }
  } catch {
    return null
  }
}

export const recoveryEndpoints: Endpoint[] = [
  {
    path: '/recovery/status',
    method: 'get',
    handler: async (req) => {
      const u = twoFactorUser(req)
      if (!u) return json({ message: 'Not allowed.' }, 403)
      const row = await full(req, { id: { equals: u.id } })
      const st = readState(row?.recovery)
      return json({ remaining: unused(st.codes), total: st.codes.length, createdAt: st.at ?? null })
    },
  },
  {
    path: '/recovery/codes',
    method: 'post',
    handler: async (req) => {
      const u = twoFactorUser(req)
      if (!u) return json({ message: 'Not allowed.' }, 403)
      const body = await readBody(req)
      // typing the password again means a copied session cookie alone cannot mint codes
      if (!(await passwordOk(req, u.email, str(body.password)))) return json({ message: 'That password is not right.' }, 400)
      const row = await full(req, { id: { equals: u.id } })
      if (!row?.totpSecret) return json({ message: 'Set up your authenticator app first, then create recovery codes.' }, 400)
      const { plain, entries } = newCodes()
      const at = new Date().toISOString()
      await req.payload.db.updateOne({ collection: 'users', id: u.id, data: { recovery: { codes: entries, at }, updatedAt: at } as any })
      await audit(req, u.email, u.role ?? '', u, `two-factor recovery codes created (${plain.length}; any older set no longer works)`)
      notifyUser(req.payload, u.email, 'Two-factor recovery codes were created', ['A new set of recovery codes was created for your account. Any older set no longer works.', 'If this was not you, tell your Super Admin immediately.'])
      return json({ codes: plain, createdAt: at })
    },
  },
  {
    path: '/recovery/use',
    method: 'post',
    handler: async (req) => {
      const body = await readBody(req)
      const email = str(body.email).trim().toLowerCase()
      const user = await passwordOk(req, email, str(body.password))
      if (!user) return json({ message: FAIL }, 400)
      const row = await full(req, { id: { equals: user.id } })
      if (!row) return json({ message: FAIL }, 400)
      const st = readState(row.recovery)
      if (isBlocked(st)) return json({ message: FAIL }, 400)
      const r = row.totpSecret ? consumeCode(st.codes, body.code) : { ok: false, entries: st.codes, remaining: 0 }
      const now = new Date().toISOString()
      if (!r.ok) {
        await req.payload.db.updateOne({ collection: 'users', id: user.id, data: { recovery: countWrong(st), updatedAt: now } as any })
        await audit(req, user.email, user.role ?? '', user, 'wrong or unusable two-factor recovery code')
        return json({ message: FAIL }, 400)
      }
      // same full-document write as the Super Admin reset: removes the authenticator and signs the person out everywhere
      await req.payload.db.updateOne({ collection: 'users', id: user.id, data: { ...row, totpSecret: null, hasTotp: false, sessions: [], loginAttempts: 0, lockUntil: null, recovery: clearWrong({ ...st, codes: r.entries }), updatedAt: now } as any })
      await audit(req, user.email, user.role ?? '', user, `two-factor reset with a recovery code (${r.remaining} left)`)
      notifyUser(req.payload, user.email, 'Two-factor was reset with a recovery code', ['A recovery code was used to remove the authenticator from your account. You will set up a new one at your next sign-in.', `Recovery codes left: ${r.remaining}.`, 'If this was not you, tell your Super Admin immediately and change your password.'])
      notifyRoles(req.payload, ['admin'], 'Two-factor was reset with a recovery code', [`${user.email} used a recovery code to reset their authenticator (${r.remaining} codes left).`, 'If they did not do this, lock the account and reset their password.'], { except: user.email })
      return json({ ok: true, remaining: r.remaining, message: 'Your authenticator was removed. Sign in with your password and scan the new QR code with your phone.' })
    },
  },
]
