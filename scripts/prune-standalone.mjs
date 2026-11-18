// Next's standalone bundle traces the whole project folder, so it can pick up local secrets, databases, uploads and backups.
// This removes everything that must never ship inside a production image, then FAILS if any of it is still there.
import fs from 'fs'
import path from 'path'

const root = path.resolve('.next/standalone')
if (!fs.existsSync(root)) { console.error('Run the build first (.next/standalone is missing).'); process.exit(1) }

const REMOVE = ['.env', '.env.local', '.env.e2e', '.env.production', 'test.env', 'edif.db', 'edif.db-shm', 'edif.db-wal', 'backups', 'media', 'outbox', 'data', 'tests', 'scripts', 'test-results', 'playwright-report', 'AGENTS.md', 'HANDBOOK.md', 'README.md', 'docker-compose.yml', 'Dockerfile', 'playwright.config.ts', 'vitest.config.mts', 'eslint.config.mjs', 'tsconfig.tsbuildinfo']
for (const f of REMOVE) fs.rmSync(path.join(root, f), { recursive: true, force: true })
for (const f of fs.readdirSync(root)) if (/^\.env/.test(f) || /\.(db|sqlite)(-\w+)?$/.test(f)) fs.rmSync(path.join(root, f), { recursive: true, force: true })

const left = fs.readdirSync(root).filter((f) => /^\.env|\.db|backup|media|outbox/.test(f))
if (left.length) { console.error('Sensitive files still in the bundle:', left); process.exit(1) }
console.log('Standalone bundle pruned. Contents:', fs.readdirSync(root).join(', '))
