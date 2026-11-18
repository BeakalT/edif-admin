import crypto from 'crypto'
import { revalidatePath, revalidateTag } from 'next/cache'
import { CONTENT_TAG } from '@/lib/siteCache'

/**
 * Called by the deployment pipeline right after a new version starts, so pages built from an empty
 * build database are replaced with real content before visitors see them.
 * POST /internal/revalidate   Authorization: Bearer <REVALIDATE_TOKEN>
 */
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const token = process.env.REVALIDATE_TOKEN || ''
  if (token.length < 32) return new Response('Not found', { status: 404 }) // switched off unless a strong token is configured
  const given = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '')
  const a = Buffer.from(given), b = Buffer.from(token)
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return new Response('Unauthorized', { status: 401 })
  revalidateTag(CONTENT_TAG, { expire: 0 })
  revalidatePath('/', 'layout')
  return Response.json({ revalidated: true, at: new Date().toISOString() }, { headers: { 'Cache-Control': 'no-store' } })
}
