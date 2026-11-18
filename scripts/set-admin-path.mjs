// Usage: node scripts/set-admin-path.mjs console-x7k2     (or ADMIN_PATH=/console-x7k2 node scripts/set-admin-path.mjs)
// Renames the admin route folder so it matches ADMIN_PATH, then you rebuild. Run it once per environment, before the build.
import fs from 'fs'
import path from 'path'

const group = path.resolve('src/app/(payload)')
const wanted = (process.argv[2] || process.env.ADMIN_PATH || '').replace(/^\/+|\/+$/g, '')
if (!/^[a-z0-9][a-z0-9-]{2,39}$/.test(wanted)) {
  console.error('Give one lowercase word (3-40 letters, digits or hyphens), e.g. console-x7k2')
  process.exit(1)
}
const reserved = ['api', 'images', 'fonts', 'media', 'stats', 'news', 'members', 'about', 'contact', 'faq', 'events', 'tenders', 'vacancies', 'publications', 'search', 'preview', 'healthz', 'readyz', 'deposit-protection', 'newsletter']
if (reserved.includes(wanted)) { console.error(`"${wanted}" is already used by the public site`); process.exit(1) }

const dirs = fs.readdirSync(group, { withFileTypes: true }).filter((d) => d.isDirectory() && d.name !== 'api' && fs.existsSync(path.join(group, d.name, '[[...segments]]')))
if (dirs.length !== 1) { console.error('Could not find the admin route folder'); process.exit(1) }
const current = dirs[0].name
if (current !== wanted) fs.renameSync(path.join(group, current), path.join(group, wanted))

const layout = path.join(group, 'layout.tsx')
const src = fs.readFileSync(layout, 'utf8').replace(/from '\.\/[^/']+\/importMap\.js'/, `from './${wanted}/importMap.js'`)
fs.writeFileSync(layout, src)
console.log(`Admin route folder is now "${wanted}". Set ADMIN_PATH=/${wanted} in the environment and rebuild.`)
