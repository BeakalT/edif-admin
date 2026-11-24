// Creates the first Super Admin on an empty database. There is no public sign-up, so a new install needs this once.
// You type the email, name and password yourself; the password is never shown or stored anywhere but the database.
// Refuses to run if any user already exists. Two-factor is set up by the person on their first sign-in, as for everyone.
import readline from 'readline'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { checkPassword } from '../src/lib/passwordPolicy'

const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true })
const ask = (q: string, hidden = false) => new Promise<string>((resolve) => {
  if (!hidden) return rl.question(q, (a) => resolve(a.trim()))
  const w = (rl as any).output
  ;(rl as any)._writeToOutput = (s: string) => { if (s.includes(q) || s === '\r\n' || s === '\n') w.write(s) }
  rl.question(q, (a) => { (rl as any)._writeToOutput = (s: string) => w.write(s); w.write('\n'); resolve(a) })
})

const payload = await getPayload({ config })
const existing = await payload.count({ collection: 'users', overrideAccess: true })
if (existing.totalDocs > 0) { console.error('Refusing to run: this database already has users. Create more from Team and users in the admin.'); process.exit(1) }

const email = (await ask('Email: ')).toLowerCase()
const name = await ask('Full name: ')
let password = ''
for (;;) {
  password = await ask('Password (12+ characters, hidden): ', true)
  const problem = checkPassword(password, { email, name })
  if (problem) { console.log(problem); continue }
  if (password !== (await ask('Repeat password: ', true))) { console.log('The two passwords do not match.'); continue }
  break
}
await payload.create({ collection: 'users', overrideAccess: true, data: { email, password, name, role: 'admin' } as any, context: { seeding: true } })
console.log(`Super Admin created for ${email}. Sign in at /admin; you will set up your authenticator app on first sign-in.`)
rl.close()
process.exit(0)
