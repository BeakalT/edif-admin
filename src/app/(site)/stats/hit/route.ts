import { clientIpFrom } from '@/lib/clientIp'
import { getPayload } from 'payload'
import config from '@payload-config'

const recent = new Map<string, number[]>()

/** Counts one visit to one page for today. Honours Do Not Track, ignores obvious robots, stores nothing about the visitor. */
export async function POST(req: Request) {
  if (req.headers.get('dnt') === '1' || req.headers.get('sec-gpc') === '1') return new Response(null, { status: 204 })
  if (/bot|crawl|spider|slurp|headless|preview/i.test(req.headers.get('user-agent') || '')) return new Response(null, { status: 204 })
  const ip = clientIpFrom((n) => req.headers.get(n))
  const now = Date.now()
  const arr = (recent.get(ip) || []).filter((t) => now - t < 60_000); arr.push(now); recent.set(ip, arr)
  // drop the oldest visitors rather than everyone, so flooding with new addresses cannot reset other visitors' limits
  if (recent.size > 5000) for (const k of [...recent.keys()].slice(0, recent.size - 4000)) recent.delete(k)
  if (arr.length > 40) return new Response(null, { status: 429 })
  let path = ''
  try { path = String((await req.json()).path || '') } catch { return new Response(null, { status: 400 }) }
  if (!/^\/[A-Za-z0-9_\-/]{0,120}$/.test(path) || /^\/(admin|api|preview|stats)/.test(path)) return new Response(null, { status: 204 })
  const day = new Date().toISOString().slice(0, 10)
  const payload = await getPayload({ config })
  const sys = { overrideAccess: true as const, context: { seeding: true } }
  const ex = await payload.find({ collection: 'page-views', where: { and: [{ day: { equals: day } }, { path: { equals: path } }] }, limit: 1, depth: 0, ...sys })
  if (ex.docs[0]) await payload.update({ collection: 'page-views', id: ex.docs[0].id, data: { views: ((ex.docs[0] as any).views || 0) + 1 }, ...sys })
  else {
    // a visitor cannot fill the table with made-up paths: a site has a few hundred real pages, so cap the distinct paths kept per day
    const today = await payload.count({ collection: 'page-views', where: { day: { equals: day } }, ...sys })
    if (today.totalDocs >= 1000) return new Response(null, { status: 204 })
    await payload.create({ collection: 'page-views', data: { day, path, views: 1 }, ...sys })
  }
  return new Response(null, { status: 204 })
}
