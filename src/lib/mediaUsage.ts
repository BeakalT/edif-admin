import type { Payload } from 'payload'

type Hit = { collection: string; id: string | number; title: string }

/** Walk a document using its field config and collect every media id it points at. */
function collect(fields: any[], data: any, out: Set<string>) {
  if (!data || typeof data !== 'object') return
  for (const f of fields || []) {
    if (f.type === 'row' || f.type === 'collapsible') { collect(f.fields, data, out); continue }
    if (f.type === 'tabs') { for (const t of f.tabs) collect(t.fields, t.name ? data[t.name] : data, out); continue }
    const v = f.name ? data[f.name] : undefined
    if (v == null) continue
    if ((f.type === 'upload' || f.type === 'relationship') && (f.relationTo === 'media' || (Array.isArray(f.relationTo) && f.relationTo.includes('media')))) {
      for (const x of Array.isArray(v) ? v : [v]) {
        const id = x && typeof x === 'object' ? (x.value?.id ?? x.value ?? x.id) : x
        if (id != null) out.add(String(id))
      }
    } else if (f.type === 'group') collect(f.fields, v, out)
    else if (f.type === 'array') for (const row of v) collect(f.fields, row, out)
    else if (f.type === 'blocks') for (const row of v) collect(f.blocks.find((b: any) => b.slug === row.blockType)?.fields || [], row, out)
    else if (f.type === 'richText' && v?.root) {
      // images embedded in rich text
      const walk = (n: any) => { if (n?.type === 'upload' && n.value != null) out.add(String(n.value?.id ?? n.value)); (n?.children || []).forEach(walk) }
      walk(v.root)
    }
  }
}

/** Every page, article or setting that currently uses this file (live content and drafts). */
export async function mediaUsage(payload: Payload, mediaId: string | number): Promise<Hit[]> {
  const id = String(mediaId)
  const hits: Hit[] = []
  for (const c of payload.config.collections) {
    if (c.slug === 'media' || c.slug.startsWith('payload-') || c.slug === 'audit-log') continue
    const drafts = !!c.versions?.drafts
    let page = 1
    for (;;) {
      const r: any = await payload.find({ collection: c.slug as any, depth: 0, limit: 200, page, draft: drafts, overrideAccess: true, pagination: true })
      for (const d of r.docs) {
        const out = new Set<string>()
        collect(c.fields as any[], d, out)
        if (out.has(id)) hits.push({ collection: c.slug, id: d.id, title: d.title || d.name || d.question || d.slug || `#${d.id}` })
      }
      if (!r.hasNextPage) break
      page++
    }
  }
  for (const g of payload.config.globals) {
    const d: any = await payload.findGlobal({ slug: g.slug as any, depth: 0, overrideAccess: true }).catch(() => null)
    const out = new Set<string>()
    collect(g.fields as any[], d, out)
    if (out.has(id)) hits.push({ collection: g.slug, id: g.slug, title: g.label ? String(g.label) : g.slug })
  }
  return hits
}
