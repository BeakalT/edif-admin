import { getPayload } from 'payload'
import fs from 'fs'
import crypto from 'crypto'
import { Secret } from 'otpauth'
import config from '../src/payload.config'
import { checkPassword } from '../src/lib/passwordPolicy'

// Creates throwaway accounts for automated tests only, each with a known two-factor secret. Never used on the live site.
const payload = await getPayload({ config })
const out: Record<string, { email: string; password: string; totpSecret: string }> = {}
const roles = ['admin', 'publisher', 'publisher2', 'editor', 'seo', 'auditor']
for (const key of roles) {
  const role = key.replace(/\d$/, '')
  const email = `${key}@edif-cms.org`
  let password = ''
  do password = crypto.randomBytes(14).toString('base64url') + 'Qz7!'
  while (checkPassword(password, { email, name: `Test ${key}` }))
  const totpSecret = new Secret({ size: 20 }).base32
  const ex = await payload.find({ collection: 'users', where: { email: { equals: email } }, overrideAccess: true })
  let id: any = ex.docs[0]?.id
  if (id) await payload.update({ collection: 'users', id, data: { password, role } as any, overrideAccess: true, context: { seeding: true } })
  else id = (await payload.create({ collection: 'users', overrideAccess: true, data: { email, password, name: `Test ${key}`, role } as any, context: { seeding: true } })).id
  await payload.db.updateOne({ collection: 'users', id, data: { totpSecret, hasTotp: true, loginAttempts: 0, lockUntil: null } as any })
  out[key] = { email, password, totpSecret }
}
fs.writeFileSync('scripts/.test-users.json', JSON.stringify(out, null, 2), { mode: 0o600 })
console.log('users ready')
process.exit(0)
