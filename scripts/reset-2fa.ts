// Emergency two-factor reset, run on the server by whoever controls it (use when the only Super Admin lost their phone).
// Usage: npx payload run scripts/reset-2fa.ts you@example.org      (also unlocks the account and ends its sessions)
// The person scans a new QR code at their next sign-in. The action is written to the audit log.
import { getPayload } from 'payload'
import config from '../src/payload.config'

const email = (process.argv.find((a) => a.includes('@')) || '').trim().toLowerCase()
if (!email) { console.error('Give the account email, e.g. npx payload run scripts/reset-2fa.ts you@example.org'); process.exit(1) }
const payload = await getPayload({ config })
const u = (await payload.find({ collection: 'users', where: { email: { equals: email } }, overrideAccess: true, limit: 1 })).docs[0] as any
if (!u) { console.error('No account with that email.'); process.exit(1) }
const full: any = await payload.db.findOne({ collection: 'users', where: { id: { equals: u.id } } })
await payload.db.updateOne({ collection: 'users', id: u.id, data: { ...full, totpSecret: null, hasTotp: false, loginAttempts: 0, lockUntil: null, sessions: [], updatedAt: new Date().toISOString() } as any })
await payload.create({ collection: 'audit-log', overrideAccess: true, data: { action: 'security', actor: 'server console', actorRole: '', resource: 'users', documentId: String(u.id), documentTitle: email, changes: { event: { to: 'two-factor reset from the server console' } } } as any })
console.log(`Two-factor reset and account unlocked for ${email}. Sign in with the password; you will be asked to scan a new QR code.`)
process.exit(0)
