// Emergency unlock, run on the server by whoever controls it (use when every Super Admin is locked out after failed sign-ins).
// Usage: npx payload run scripts/unlock-account.ts you@example.org
// Clears the password lock AND the authenticator-code lock (they are stored in two places). Does not change the password or the authenticator.
// The action is written to the audit log.
import { getPayload } from 'payload'
import config from '../src/payload.config'

const email = (process.argv.find((a) => a.includes('@')) || '').trim().toLowerCase()
if (!email) { console.error('Give the account email, e.g. npx payload run scripts/unlock-account.ts you@example.org'); process.exit(1) }
const payload = await getPayload({ config })
const u = (await payload.find({ collection: 'users', where: { email: { equals: email } }, overrideAccess: true, limit: 1 })).docs[0] as any
if (!u) { console.error('No account with that email.'); process.exit(1) }
await payload.db.updateOne({ collection: 'users', id: u.id, data: { loginAttempts: 0, lockUntil: null, updatedAt: new Date().toISOString() } as any })
await (payload.db as any).updateOne({ collection: 'totp-attempts', id: String(u.id), data: { attempts: 0, lockUntil: null } }).catch(() => { /* no code attempts recorded yet */ })
await payload.create({ collection: 'audit-log', overrideAccess: true, data: { action: 'security', actor: 'server console', actorRole: '', resource: 'users', documentId: String(u.id), documentTitle: email, changes: { event: { to: 'account unlocked from the server' } }, ip: '' } as any })
console.log(`Unlocked ${email}. They can try again now.`)
process.exit(0)
