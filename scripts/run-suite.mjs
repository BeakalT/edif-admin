// Runs the database-level and API test suites and fails (exit 1) if any check fails or a suite crashes.
// Usage: node scripts/run-suite.mjs payload   → test-stage, test-custom, test-permissions (talk to the database directly)
//        node scripts/run-suite.mjs api       → refreshes test accounts, then drives the running site over HTTP (needs BASE_URL server on :3100)
import { spawnSync } from 'child_process'

const ENV = process.env.TEST_ENV_FILE || '.env'
const suites = {
  payload: [
    ['stage / review / publish rules', ['npx', 'tsx', `--env-file=${ENV}`, 'scripts/test-stage.ts']],
    ['custom HTML/CSS + page builder', ['npx', 'tsx', `--env-file=${ENV}`, 'scripts/test-custom.ts']],
    ['role permissions matrix', ['npx', 'tsx', `--env-file=${ENV}`, 'scripts/test-permissions.ts']],
    ['in-app notifications', ['npx', 'tsx', `--env-file=${ENV}`, 'scripts/test-notifications.ts']],
  ],
  api: [
    ['refresh test accounts', ['npx', 'tsx', `--env-file=${ENV}`, 'scripts/mkusers.ts'], { silent: true }],
    ['end-to-end API (sign-in, 2FA, lockout, publishing, uploads, mail)', ['node', 'scripts/e2e2.mjs']],
  ],
}
const which = process.argv[2]
if (!suites[which]) { console.error('Use: payload | api'); process.exit(2) }

let pass = 0, fail = 0, crashed = 0
for (const [name, cmd, opt = {}] of suites[which]) {
  const r = spawnSync(cmd[0], cmd.slice(1), { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
  const out = (r.stdout || '') + (r.stderr || '')
  const p = (out.match(/^PASS /gm) || []).length, f = (out.match(/^FAIL /gm) || []).length
  if (opt.silent) { if (r.status !== 0) { console.log(`✖ ${name} (exit ${r.status})\n${out.slice(-1500)}`); crashed++ } continue }
  pass += p; fail += f
  const ok = r.status === 0 && f === 0 && p > 0
  if (!ok) crashed += r.status === 0 ? 0 : 1
  console.log(`${ok ? '✔' : '✖'} ${name}: ${p} passed, ${f} failed${r.status ? `, exit ${r.status}` : ''}`)
  if (!ok) console.log(out.split('\n').filter((l) => /^FAIL|Error/.test(l)).slice(0, 15).join('\n') + (r.status ? '\n--- last output ---\n' + out.slice(-1200) : ''))
}
console.log(`\n${which}: ${pass} passed, ${fail} failed${crashed ? `, ${crashed} suite(s) crashed` : ''}`)
process.exit(fail || crashed ? 1 : 0)
