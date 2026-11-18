import { ctxOf, staffOf } from '@/lib/reqTypes'
import { adminUrl } from '@/lib/adminRoute'
import crypto from 'crypto'
import { ValidationError } from 'payload'
import type { CollectionConfig, PayloadRequest } from 'payload'
import { ROLES, adminOnly, clientIp, hasRole } from '../access'
import { auditChange, auditDelete, auditLogin, auditLogout } from '../hooks/audit'
import { checkPassword } from '../lib/passwordPolicy'
import { mailHtml, notifyRoles, notifyUser } from '../lib/notify'

const SITE = () => process.env.SITE_URL || 'http://localhost:3100'
const INVITE_MS = 48 * 60 * 60 * 1000
const reject = (message: string) => new ValidationError({ errors: [{ message, path: 'password' }] })
const placeholder = () => crypto.randomBytes(24).toString('base64url') + 'aA1!' // nobody ever knows it: the person sets their own through the emailed link
const recentLock = new Map<string, number>()

async function audit(req: PayloadRequest, data: Record<string, unknown>, actor?: string, role?: string) {
  await req.payload.create({ collection: 'audit-log', overrideAccess: true, data: { resource: 'users', changes: {}, ip: clientIp(req), actor: actor ?? staffOf(req)?.email ?? 'unknown', actorRole: role ?? staffOf(req)?.role ?? '', ...data } as any })
}

/** Super Admin endpoints: both require a session that has passed two-factor. */
const adminEndpoint = (path: string, run: (req: PayloadRequest, id: string, target: any) => Promise<string>) => ({
  path: `/:id/${path}`,
  method: 'post' as const,
  handler: async (req: PayloadRequest) => {
    const u: any = req.user
    if (!hasRole(u, 'admin') || (u._strategy !== 'totp' && u._strategy !== 'api-key')) return Response.json({ message: 'Not allowed.' }, { status: 403 })
    const id = String((req.routeParams as any)?.id || '')
    const target: any = await req.payload.findByID({ collection: 'users', id, overrideAccess: true, depth: 0 }).catch(() => null)
    if (!target) return Response.json({ message: 'User not found.' }, { status: 404 })
    if (String(target.id) === String(u.id)) return Response.json({ message: 'Use your own account page for this.' }, { status: 400 })
    return Response.json({ message: await run(req, id, target) })
  },
})

/**
 * Sends the "set your password" invitation once the new account is committed to the database.
 * forgotPassword() looks the account up outside the current transaction, so on PostgreSQL it cannot see a row that is
 * not committed yet and returns nothing. We therefore retry for a few seconds, off the request path.
 * If it never succeeds, the audit log says so and an admin can use "Send invite" on the account.
 */
function sendInviteAfterCommit(payload: any, email: string) {
  void (async () => {
    for (let i = 0; i < 8; i++) {
      await new Promise((r) => setTimeout(r, 250 * (i + 1)))
      const token = await payload.forgotPassword({ collection: 'users', data: { email }, expiration: INVITE_MS, disableEmail: false }).catch(() => null)
      if (token) return
    }
    payload.logger.warn(`Invitation email for ${email} could not be sent automatically. Use "Send invite" on the account.`)
  })()
}

export const Users: CollectionConfig = {
  slug: 'users',
  admin: { useAsTitle: 'email', defaultColumns: ['name', 'email', 'role', 'lastLoginAt'], group: 'Administration', description: 'Accounts are created by a Super Admin only. New people get an email to set their own password and then set up two-factor sign-in.' },
  auth: {
    tokenExpiration: 60 * 60 * 2, // two hours; the admin offers to extend while you are working
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000,
    useSessions: true,
    cookies: { sameSite: 'Strict', secure: process.env.NODE_ENV === 'production' && process.env.COOKIE_SECURE !== 'false' },
    forgotPassword: {
      expiration: 60 * 60 * 1000,
      minRequestInterval: 60 * 1000,
      generateEmailSubject: () => '[EDIF Admin] Set your password',
      generateEmailHTML: (args: any) =>
        mailHtml('Set your password', ['Use the button below to choose a password for the EDIF website administration. The link works once and expires.', 'If you did not ask for this, ignore this email; nothing changes.'], { href: `${SITE()}${adminUrl('/reset/' + args?.token)}`, label: 'Choose a password' }),
    },
  },
  access: {
    // Everyone can see their own profile; only Super Admins manage accounts. Auditors can list users to read the log.
    read: ({ req }) => (hasRole(req.user, 'admin', 'auditor') ? true : req.user ? { id: { equals: req.user.id } } : false),
    create: adminOnly, // there is no public registration
    delete: adminOnly,
    update: ({ req }) => (hasRole(req.user, 'admin') ? true : req.user ? { id: { equals: req.user.id } } : false),
    unlock: adminOnly,
    admin: ({ req }) => !!req.user,
  },
  endpoints: [
    adminEndpoint('send-invite', async (req, id, target) => {
      await req.payload.forgotPassword({ collection: 'users', data: { email: target.email }, expiration: INVITE_MS, disableEmail: false })
      await audit(req, { action: 'security', documentId: id, documentTitle: target.email, changes: { event: { to: 'password setup email sent' } } })
      return `A password setup email was sent to ${target.email}.`
    }),
    adminEndpoint('reset-2fa', async (req, id, target) => {
      // direct write: the plugin's own hooks would otherwise keep the old "enrolled" flag
      // (same full-document write Payload itself uses when a password is reset), which also signs the person out everywhere
      const full: any = await req.payload.db.findOne({ collection: 'users', where: { id: { equals: id } } })
      await req.payload.db.updateOne({ collection: 'users', id, data: { ...full, totpSecret: null, hasTotp: false, sessions: [], updatedAt: new Date().toISOString() } as any })
      await audit(req, { action: 'security', documentId: id, documentTitle: target.email, changes: { event: { to: 'two-factor reset' } } })
      notifyUser(req.payload, target.email, 'Two-factor sign-in was reset', [`A Super Admin (${staffOf(req)?.email}) reset the authenticator on your account. You will be asked to set it up again the next time you sign in.`, 'If you did not request this, tell your Super Admin immediately.'])
      return `Two-factor was reset for ${target.email}. They will set it up again at next login.`
    }),
  ],
  hooks: {
    beforeOperation: [
      async ({ args, operation }: any) => {
        if (operation === 'resetPassword') {
          const msg = checkPassword(args?.data?.password)
          if (msg) throw reject(msg)
        }
        return args
      },
    ],
    beforeValidate: [
      async ({ data, operation, originalDoc, req }) => {
        if (!data) return data
        const seeding = ctxOf(req)?.seeding
        if (operation === 'create') {
          if (!seeding) {
            data.password = placeholder()
            ;ctxOf(req).invited = true
          }
          return data
        }
        if (operation === 'update' && typeof data.password === 'string') {
          const own = req.user && String(staffOf(req)?.id) === String(originalDoc?.id)
          if (!own && !seeding) throw reject('Nobody can set another person’s password. Use “Send password setup email” on their account instead.')
          const msg = checkPassword(data.password, { email: data.email || originalDoc?.email, name: data.name || originalDoc?.name })
          if (msg) throw reject(msg)
          ;ctxOf(req).passwordChanged = true
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc, previousDoc, operation, req }) => {
        const ctx: any = req.context || {}
        if (operation === 'create' && ctx.invited) sendInviteAfterCommit(req.payload, doc.email)
        if (operation === 'create' && staffOf(req)?.email) notifyRoles(req.payload, ['admin'], 'New account created', [`${staffOf(req)?.email} created an account for ${doc.email} (${ROLES.find((r) => r.value === doc.role)?.label || doc.role}).`], { except: staffOf(req)?.email, path: adminUrl(`/collections/users/${doc.id}`) })
        if (operation === 'update') {
          if (ctx.passwordChanged) notifyUser(req.payload, doc.email, 'Your password was changed', ['The password for your EDIF admin account was just changed.', 'If this was not you, contact your Super Admin immediately.'])
          if (previousDoc?.role && previousDoc.role !== doc.role) {
            notifyUser(req.payload, doc.email, 'Your access level changed', [`Your role is now ${ROLES.find((r) => r.value === doc.role)?.label || doc.role}.`])
            notifyRoles(req.payload, ['admin'], 'Role changed', [`${staffOf(req)?.email} changed ${doc.email} from ${previousDoc.role} to ${doc.role}.`], { except: staffOf(req)?.email })
          }
        }
        return doc
      },
      auditChange,
    ],
    afterDelete: [auditDelete],
    afterLogin: [
      async ({ user, req }) => {
        await auditLogin({ user, req } as any)
        const ip = clientIp(req)
        const prev = (user as any).lastLoginIp
        const upd: any = { lastLoginAt: new Date().toISOString(), lastLoginIp: ip }
        await req.payload.db.updateOne({ collection: 'users', id: user.id, data: upd, req })
        if (prev && ip && prev !== ip) notifyUser(req.payload, user.email, 'New sign-in location', [`Your account signed in from a different network address (${ip}) than last time.`, 'If this was not you, change your password and tell your Super Admin.'])
        return user
      },
    ],
    afterLogout: [auditLogout],
    afterError: [
      async ({ error, req, collection }: any) => {
        if (collection?.slug !== 'users') return
        const name = error?.name
        if (name !== 'AuthenticationError' && name !== 'LockedAuth') return
        const email = String((req as any).data?.email || '').toLowerCase()
        if (!email) return
        try {
          await req.payload.create({ collection: 'audit-log', overrideAccess: true, data: { action: 'security', resource: 'users', documentTitle: email, actor: email, actorRole: '', ip: clientIp(req), changes: { event: { to: name === 'LockedAuth' ? 'sign-in refused: account locked' : 'failed sign-in' } } } as any })
          if (name === 'LockedAuth' && Date.now() - (recentLock.get(email) || 0) > 15 * 60 * 1000) {
            recentLock.set(email, Date.now())
            notifyRoles(req.payload, ['admin', 'auditor'], 'Account locked', [`${email} is locked after repeated failed sign-ins. Check the audit log for the address the attempts came from.`], { path: adminUrl('/collections/audit-log') })
            notifyUser(req.payload, email, 'Your account was locked', ['There were several failed sign-in attempts on your account, so it is locked for 15 minutes.', 'If this was not you, tell your Super Admin.'])
          }
        } catch {
          // logging must not mask the original error
        }
      },
    ],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'jobTitle', label: 'Job title', type: 'text' },
    { name: 'phone', type: 'text' },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: ROLES,
      saveToJWT: true,
      access: { update: ({ req }) => hasRole(req.user, 'admin'), create: ({ req }) => hasRole(req.user, 'admin') },
      admin: { description: 'Controls what this person can see and do. Only Super Admins can change it.' },
    },
    { name: 'lastLoginAt', label: 'Last sign-in', type: 'date', admin: { readOnly: true, position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } }, access: { update: () => false, create: () => false } },
    { name: 'lastLoginIp', label: 'Last sign-in address', type: 'text', admin: { readOnly: true, position: 'sidebar' }, access: { read: ({ req }) => hasRole(req.user, 'admin', 'auditor'), update: () => false, create: () => false } },
    { name: 'accountActions', type: 'ui', admin: { components: { Field: '/components/admin/AccountActions#AccountActions' } } },
  ],
}
