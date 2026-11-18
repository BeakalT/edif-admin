import { getPayload } from 'payload'
import config from '../src/payload.config'
// Local demo accounts. Each person sets up their own authenticator app the first time they sign in.
const demo: Record<string, string> = {
  admin: 'Orange-Tiger-Lamp-49x',
  publisher: 'Silver-Maple-River-83q',
  publisher2: 'Quiet-Harbor-Stone-27k',
  editor: 'Brave-Cedar-Window-65m',
  seo: 'Golden-Falcon-Bridge-31v',
  auditor: 'Calm-Meadow-Anchor-58t',
}
// These passwords are in the repository: never run this against a real database.
if (process.env.NODE_ENV === 'production' || !/^file:/.test(process.env.DATABASE_URL || '')) {
  console.error('Refusing to run: this script creates accounts with known passwords. It only runs against the local SQLite demo database (DATABASE_URL=file:…) and never in production.')
  process.exit(1)
}
const payload = await getPayload({ config })
for (const [key, password] of Object.entries(demo)) {
  const role = key.replace(/\d$/, '')
  const email = `${key}@edif-demo.test`
  const ex = await payload.find({ collection: 'users', where: { email: { equals: email } }, overrideAccess: true })
  if (ex.docs[0]) await payload.update({ collection: 'users', id: ex.docs[0].id, data: { password, role } as any, overrideAccess: true, context: { seeding: true } })
  else await payload.create({ collection: 'users', overrideAccess: true, data: { email, password, name: `Demo ${key}`, role } as any, context: { seeding: true } })
}
console.log('demo users ready')
process.exit(0)
