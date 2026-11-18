// CI gate: fails on any high or critical advisory in production dependencies that is not in .github/audit-allowlist.json,
// and on any allow-list row whose review date has passed.   node scripts/audit-gate.mjs
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'

const list = JSON.parse(fs.readFileSync(new URL('../.github/audit-allowlist.json', import.meta.url), 'utf8')).accepted || []
const today = new Date().toISOString().slice(0, 10)
const problems = []

for (const a of list) if (!a.reviewBy || a.reviewBy < today) problems.push(`Allow-list row ${a.advisory} (${a.package}) is past its review date (${a.reviewBy}). Look at it again, then extend the date or remove the row.`)

const r = spawnSync('npm', ['audit', '--omit=dev', '--json'], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
let report
try { report = JSON.parse(r.stdout) } catch { console.error('Could not read the npm audit output:\n' + (r.stdout || r.stderr).slice(0, 500)); process.exit(1) }

const ok = new Set(list.map((a) => `${a.advisory}|${a.package}`))
for (const [name, v] of Object.entries(report.vulnerabilities || {})) {
  if (v.severity !== 'high' && v.severity !== 'critical') continue
  for (const via of v.via || []) {
    if (typeof via === 'string') continue // derived from another package's advisory, checked there
    if (via.severity !== 'high' && via.severity !== 'critical') continue
    const id = String(via.url || '').split('/').pop()
    if (!ok.has(`${id}|${via.name || name}`)) problems.push(`New ${via.severity} advisory ${id} in ${via.name || name}: ${via.title}. Fix it, or add it to .github/audit-allowlist.json with a review date.`)
  }
}
if (problems.length) { console.error(problems.join('\n')); process.exit(1) }
console.log('No new high or critical advisories.')
