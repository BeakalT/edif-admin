// Creates an empty throwaway SQLite database with the full schema so `next build` can pre-render pages inside a Docker build.
// It is never used at runtime: the running container talks to PostgreSQL.
import { getPayload } from 'payload'
import config from '../src/payload.config'
const payload = await getPayload({ config })
await payload.find({ collection: 'users', limit: 1, overrideAccess: true })
console.log('build database ready')
process.exit(0)
