// Restore: node scripts/restore.mjs backups/edif-YYYY-MM-DD-HH-MM-SS   (stop the site first)
import fs from 'fs'
import path from 'path'
import { execFileSync } from 'child_process'
const src = process.argv[2]
if (!src || !fs.existsSync(path.join(src, 'edif.db'))) { console.error('Give the backup folder, e.g. backups/edif-2026-11-14-02-15'); process.exit(1) }
const root = process.cwd()
const url = (process.env.DATABASE_URL || fs.readFileSync(path.join(root, '.env'), 'utf8').match(/^DATABASE_URL=(.*)$/m)?.[1] || '').trim().replace(/^file:/, '')
const dbFile = path.resolve(root, url)
if (fs.existsSync(dbFile)) fs.copyFileSync(dbFile, dbFile + '.before-restore') // never lose the current state
for (const ext of ['-wal', '-shm']) fs.rmSync(dbFile + ext, { force: true })
fs.copyFileSync(path.join(src, 'edif.db'), dbFile)
if (fs.existsSync(path.join(src, 'media.tar.gz'))) execFileSync('tar', ['-xzf', path.join(src, 'media.tar.gz'), '-C', root])
console.log('Restored from', src, '(previous database kept as', dbFile + '.before-restore)')
