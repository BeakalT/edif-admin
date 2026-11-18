// Brings a local SQLite demo database up to the current version (adds any new tables/columns). Safe to run any time; run.sh runs it before every start.
import { getPayload } from 'payload'
import config from '../src/payload.config'
const payload = await getPayload({ config })
await payload.find({ collection: 'users', limit: 1, overrideAccess: true })
console.log('Database is up to date.')
process.exit(0)
