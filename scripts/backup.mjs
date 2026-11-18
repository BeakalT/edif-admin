// Backup: a consistent copy of the database plus the media folder, kept on a daily / weekly / monthly schedule (see the retention settings below).
// Usage: node scripts/backup.mjs   (schedule it nightly, e.g. with cron:  15 2 * * *  cd /path/to/app && node scripts/backup.mjs)
// Copy the backups/ folder off the server regularly: a backup on the same machine is not protected from that machine failing.
import { createClient } from '@libsql/client'
import { execFileSync } from 'child_process'
import fs from 'fs'
import path from 'path'

const root = process.cwd()
const url = (process.env.DATABASE_URL || fs.readFileSync(path.join(root, '.env'), 'utf8').match(/^DATABASE_URL=(.*)$/m)?.[1] || '').trim()
if (!url.startsWith('file:')) { console.error('This script backs up the SQLite database. For Postgres use pg_dump (see HANDBOOK).'); process.exit(1) }
const dbFile = path.resolve(root, url.replace(/^file:/, ''))
const dir = path.join(root, 'backups'); fs.mkdirSync(dir, { recursive: true, mode: 0o700 })
const stamp = new Date().toISOString().replace(/[:T]/g, '-').slice(0, 19)
const out = path.join(dir, `edif-${stamp}`); fs.mkdirSync(out, { mode: 0o700 })

const db = createClient({ url: 'file:' + dbFile })
await db.execute(`VACUUM INTO '${path.join(out, 'edif.db').replace(/'/g, "''")}'`) // safe copy even while the site is running
db.close()
if (fs.existsSync(path.join(root, 'media'))) execFileSync('tar', ['-czf', path.join(out, 'media.tar.gz'), '-C', root, 'media'])
fs.chmodSync(path.join(out, 'edif.db'), 0o600)
// Retention (grandfather-father-son): keep every backup for KEEP_DAILY days, one per week for KEEP_WEEKLY weeks, one per month for KEEP_MONTHLY months.
// Defaults 14 / 8 / 12. Set them to the period EDIF's records rules require (BACKUP_KEEP_DAILY, BACKUP_KEEP_WEEKLY, BACKUP_KEEP_MONTHLY).
const num = (v, d) => (Number.isFinite(Number(v)) && v !== undefined && v !== '' ? Number(v) : d)
const KEEP = { d: num(process.env.BACKUP_KEEP_DAILY, 14), w: num(process.env.BACKUP_KEEP_WEEKLY, 8), m: num(process.env.BACKUP_KEEP_MONTHLY, 12) }
const names = fs.readdirSync(dir).filter((n) => /^edif-\d{4}-\d{2}-\d{2}-\d{2}-\d{2}(-\d{2})?$/.test(n)).sort().reverse() // newest first
const when = (n) => { const [y, mo, d, h, mi, sec = 0] = n.slice(5).split('-').map(Number); return new Date(Date.UTC(y, mo - 1, d, h, mi, sec)) }
const weekKey = (t) => { const x = new Date(t); x.setUTCDate(x.getUTCDate() - ((x.getUTCDay() + 6) % 7)); return x.toISOString().slice(0, 10) }
const keep = new Set(), weeks = new Set(), months = new Set()
for (const n of names) {
  const t = when(n), age = (Date.now() - t.getTime()) / 864e5
  const wk = weekKey(t), mo = t.toISOString().slice(0, 7)
  if (age <= KEEP.d) keep.add(n)
  if (age <= KEEP.w * 7 && !weeks.has(wk)) { weeks.add(wk); keep.add(n) }
  if (age <= KEEP.m * 31 && !months.has(mo)) { months.add(mo); keep.add(n) }
}
keep.add(path.basename(out)) // never remove the one just written
for (const n of names) if (!keep.has(n)) fs.rmSync(path.join(dir, n), { recursive: true })
console.log('Backup written to', out)
