import { getPayload } from 'payload'
import config from '@payload-config'

/** Readiness: the app can serve traffic (database answers). Load balancers use this to route around a broken instance. */
export const dynamic = 'force-dynamic'
export async function GET() {
  const started = Date.now()
  try {
    const payload = await getPayload({ config })
    await payload.find({ collection: 'users', limit: 1, depth: 0, overrideAccess: true, pagination: false })
    return Response.json({ status: 'ready', db: 'ok', ms: Date.now() - started }, { headers: { 'Cache-Control': 'no-store' } })
  } catch {
    return Response.json({ status: 'unavailable', db: 'error' }, { status: 503, headers: { 'Cache-Control': 'no-store' } })
  }
}
