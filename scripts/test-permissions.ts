import { getPayload } from 'payload'
import config from '../src/payload.config'

const payload = await getPayload({ config })
const results: [string, boolean, string][] = []
const check = (name: string, ok: boolean, detail = '') => { results.push([name, ok, detail]); console.log(ok ? 'PASS' : 'FAIL', name, detail) }
const expectFail = async (name: string, fn: () => Promise<unknown>) => { try { await fn(); check(name, false, 'was allowed') } catch (e: any) { check(name, true, `blocked: ${String(e.message).slice(0, 70)}`) } }
const expectOk = async (name: string, fn: () => Promise<unknown>) => { try { await fn(); check(name, true) } catch (e: any) { check(name, false, String(e.message).slice(0, 120)) } }

const mk = async (role: string) => {
  const email = `${role}@edif-cms.org`
  const ex = await payload.find({ collection: 'users', where: { email: { equals: email } }, overrideAccess: true })
  if (ex.docs[0]) return ex.docs[0] as any
  return (await payload.create({ collection: 'users', overrideAccess: true, data: { email, password: 'Test-' + Math.random().toString(36).slice(2) + 'Aa1!', name: role, role } as any })) as any
}
const U: any = {}
for (const r of ['admin', 'publisher', 'editor', 'seo', 'auditor']) U[r] = await mk(r)
const as = (u: any) => ({ user: { ...u, collection: 'users', _strategy: 'totp' }, overrideAccess: false as const })

// content
const base = { title: 'Permission test article', slug: 'perm-test-' + Date.now(), kind: 'Announcement', date: new Date().toISOString(), summary: 'x' }
let id: any
await expectOk('editor can create a draft', async () => { id = (await payload.create({ collection: 'news', data: base as any, draft: true, ...as(U.editor) })).id })
await expectFail('editor cannot publish', () => payload.update({ collection: 'news', id, data: { _status: 'published' } as any, ...as(U.editor) }))
await expectFail('editor cannot delete', () => payload.delete({ collection: 'news', id, ...as(U.editor) }))
await expectFail('editor cannot create users', () => payload.create({ collection: 'users', data: { email: 'x@y.org', password: 'Aa1!aaaaaaaa', name: 'x', role: 'admin' } as any, ...as(U.editor) }))
await expectFail('editor cannot read audit log', () => payload.find({ collection: 'audit-log', ...as(U.editor) }))
await expectOk('publisher can publish', () => payload.update({ collection: 'news', id, data: { _status: 'published' } as any, ...as(U.publisher) }))
await expectFail('publisher cannot manage users', () => payload.create({ collection: 'users', data: { email: 'x2@y.org', password: 'Aa1!aaaaaaaa', name: 'x', role: 'editor' } as any, ...as(U.publisher) }))
await expectFail('seo manager cannot create news', () => payload.create({ collection: 'news', data: { ...base, slug: base.slug + '2' } as any, draft: true, context: { draftSave: true }, ...as(U.seo) }))
await expectOk('seo manager can edit SEO fields', () => payload.update({ collection: 'news', id, data: { seo: { title: 'SEO title', description: 'SEO description' } } as any, draft: true, context: { draftSave: true }, ...as(U.seo) }))
await expectOk('published page stays published after an SEO draft save', async () => { const m: any = await payload.findByID({ collection: 'news', id, draft: false, overrideAccess: true }); if (m._status !== 'published') throw new Error('status is ' + m._status) })
await expectFail('editor cannot overwrite live content (non-draft save)', () => payload.update({ collection: 'news', id, data: { title: 'Changed live title' }, ...as(U.editor) }))
await expectOk('editor can save a draft over live content', () => payload.update({ collection: 'news', id, data: { title: 'Draft title change' }, draft: true, context: { draftSave: true }, ...as(U.editor) }))
await expectFail('editor cannot unpublish', () => payload.update({ collection: 'news', id, data: { _status: 'draft' } as any, ...as(U.editor) }))
await expectOk('publisher can unpublish', () => payload.update({ collection: 'news', id, data: { _status: 'draft' } as any, ...as(U.publisher) }))
await expectOk('publisher can republish', () => payload.update({ collection: 'news', id, data: { _status: 'published' } as any, ...as(U.publisher) }))
await expectOk('main record still published after blocked changes', async () => { const m: any = await payload.findByID({ collection: 'news', id, draft: false, overrideAccess: true }); if (m._status !== 'published') throw new Error('status is ' + m._status) })
await expectOk('seo manager can create a redirect', () => payload.create({ collection: 'redirects', data: { from: '/old-' + Date.now(), to: '/new', permanent: true }, ...as(U.seo) }))
await expectFail('redirect to javascript: URL rejected', () => payload.create({ collection: 'redirects', data: { from: '/bad-' + Date.now(), to: 'javascript:alert(1)' } as any, ...as(U.seo) }))
await expectOk('auditor can read audit log', () => payload.find({ collection: 'audit-log', ...as(U.auditor) }))
await expectFail('auditor cannot edit content', () => payload.update({ collection: 'news', id, data: { title: 'hacked' }, ...as(U.auditor) }))
await expectFail('nobody can edit an audit entry (even admin)', async () => { const e = await payload.find({ collection: 'audit-log', limit: 1, overrideAccess: true }); return payload.update({ collection: 'audit-log', id: e.docs[0].id, data: { actor: 'forged' }, ...as(U.admin) }) })
await expectFail('nobody can delete an audit entry (even admin)', async () => { const e = await payload.find({ collection: 'audit-log', limit: 1, overrideAccess: true }); return payload.delete({ collection: 'audit-log', id: e.docs[0].id, ...as(U.admin) }) })
await expectFail('anonymous cannot read news', () => payload.find({ collection: 'news', overrideAccess: false }))

// audit trail contents
const log = await payload.find({ collection: 'audit-log', sort: '-createdAt', limit: 12, overrideAccess: true })
console.log('\nLatest audit entries:'); for (const l of log.docs.reverse() as any[]) console.log(' ', l.createdAt.slice(11, 19), l.actor.padEnd(24), l.action.padEnd(10), l.resource, '|', l.documentTitle)
check('audit log recorded publish by publisher', (log.docs as any[]).some((l) => l.action === 'publish' && l.actor.startsWith('publisher')))
check('audit log recorded SEO change by seo manager', (log.docs as any[]).some((l) => l.actor.startsWith('seo') && l.changes && JSON.stringify(l.changes).includes('SEO title')))
const failed = results.filter((r) => !r[1]).length
console.log(`\n${results.length - failed}/${results.length} checks passed`)
process.exit(failed ? 1 : 0)
