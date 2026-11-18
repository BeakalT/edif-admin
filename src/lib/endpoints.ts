import { staffOf } from '@/lib/reqTypes'
import type { Endpoint } from 'payload'
import { hasRole } from '../access'
import { toCsv, parseCsv } from './csv'

const verified = (u: any) => u && (u._strategy === 'totp' || u._strategy === 'api-key')
const deny = () => Response.json({ message: 'Not allowed.' }, { status: 403 })

/** Audit log CSV with filters: ?actor=&action=&resource=&from=YYYY-MM-DD&to=YYYY-MM-DD. Admins and auditors only. */
export const auditExport: Endpoint = {
  path: '/export', method: 'get',
  handler: async (req) => {
    if (!hasRole(staffOf(req), 'admin', 'auditor') || !verified(req.user)) return deny()
    const q = req.query as Record<string, string>
    const and: any[] = []
    if (q.actor) and.push({ actor: { contains: q.actor } })
    if (q.action) and.push({ action: { equals: q.action } })
    if (q.resource) and.push({ resource: { equals: q.resource } })
    if (/^\d{4}-\d{2}-\d{2}$/.test(q.from || '')) and.push({ createdAt: { greater_than_equal: q.from + 'T00:00:00.000Z' } })
    if (/^\d{4}-\d{2}-\d{2}$/.test(q.to || '')) and.push({ createdAt: { less_than_equal: q.to + 'T23:59:59.999Z' } })
    const r = await req.payload.find({ collection: 'audit-log', where: and.length ? { and } : undefined, sort: '-createdAt', limit: 20000, depth: 0, overrideAccess: true, pagination: false })
    const cols = ['createdAt', 'actor', 'actorRole', 'action', 'resource', 'documentId', 'documentTitle', 'ip', 'changes']
    await req.payload.create({ collection: 'audit-log', overrideAccess: true, data: { action: 'security', actor: staffOf(req)?.email, actorRole: staffOf(req)?.role, resource: 'audit-log', documentTitle: `Exported ${r.docs.length} entries`, changes: q } as any, req })
    return new Response(toCsv(cols, r.docs as any), { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="edif-activity-log.csv"', 'Cache-Control': 'no-store' } })
  },
}

/** Export and import for simple list collections. Imports are saved as DRAFTS, so they still go through two-step review. */
export const listEndpoints = (collection: 'members' | 'publications', cols: string[], required: string[], validate: (row: Record<string, string>) => string | null, prepare: (row: Record<string, string>) => Record<string, unknown>): Endpoint[] => [
  {
    path: '/export', method: 'get',
    handler: async (req) => {
      if (!hasRole(staffOf(req), 'admin', 'publisher', 'editor', 'auditor') || !verified(req.user)) return deny()
      const r = await req.payload.find({ collection, draft: false, limit: 5000, depth: 0, overrideAccess: true, pagination: false })
      return new Response(toCsv(cols, r.docs as any), { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="edif-${collection}.csv"`, 'Cache-Control': 'no-store' } })
    },
  },
  {
    path: '/import', method: 'post',
    handler: async (req) => {
      if (!hasRole(staffOf(req), 'admin', 'publisher', 'editor') || !verified(req.user)) return deny()
      const text = await req.text?.()
      if (!text || text.length > 2_000_000) return Response.json({ message: 'Empty or too large (2 MB maximum).' }, { status: 400 })
      const rows = parseCsv(text)
      const head = rows.shift()?.map((h) => h.trim()) || []
      const miss = required.filter((c) => !head.includes(c))
      if (miss.length) return Response.json({ message: `Missing column(s): ${miss.join(', ')}. Expected: ${cols.join(', ')}` }, { status: 400 })
      const objs = rows.map((r) => Object.fromEntries(head.map((h, i) => [h, (r[i] ?? '').trim()])))
      const errors: string[] = []
      objs.forEach((o, i) => { const e = validate(o); if (e) errors.push(`Row ${i + 2}: ${e}`) })
      if (errors.length) return Response.json({ message: 'Nothing was imported. Fix these rows and try again.', errors: errors.slice(0, 20) }, { status: 400 })
      let created = 0, updated = 0
      for (const o of objs) {
        const key = collection === 'members' ? { name: { equals: o.name } } : { title: { equals: o.title } }
        const ex = await req.payload.find({ collection, where: key as any, draft: true, limit: 1, depth: 0, overrideAccess: true })
        const data = { ...prepare(o), _status: 'draft' }
        if (ex.docs[0]) { await req.payload.update({ collection, id: ex.docs[0].id, data: data as any, draft: true, user: req.user, overrideAccess: false, context: { draftSave: true } }); updated++ }
        else { await req.payload.create({ collection, data: data as any, draft: true, user: req.user, overrideAccess: false, context: { draftSave: true } }); created++ }
      }
      return Response.json({ message: `Imported as drafts: ${created} new, ${updated} updated. Review and publish them in the list.`, created, updated })
    },
  },
]
