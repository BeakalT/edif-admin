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
  return (await payload.create({ collection: 'users', overrideAccess: true, data: { email, password: 'Test-' + Math.random().toString(36).slice(2) + 'Aa1!', name: role, role: role.replace(/\d+$/, '') } as any })) as any
}
const U: any = {}
for (const r of ['admin', 'publisher', 'publisher2', 'editor', 'seo', 'auditor']) U[r] = await mk(r)
const as = (u: any) => ({ user: { ...u, collection: 'users', _strategy: 'totp' }, overrideAccess: false as const })

// content
const base = { title: 'Permission test article', slug: 'perm-test-' + Date.now(), kind: 'Announcement', date: new Date().toISOString(), summary: 'x' }
let id: any

const tag = Date.now()
const news = { title: 'Stage test ' + tag, slug: 'stage-' + tag, kind: 'Announcement', date: new Date().toISOString(), summary: 'Summary long enough for the test.' }
let nid: any
await expectOk('editor creates draft', async () => { nid = (await payload.create({ collection: 'news', data: news as any, draft: true, ...as(U.editor) })).id })
await expectOk('editor submits for review', () => payload.update({ collection: 'news', id: nid, data: { reviewStatus: 'in_review' } as any, draft: true, ...as(U.editor) }))
await expectFail('editor cannot request changes', () => payload.update({ collection: 'news', id: nid, data: { reviewStatus: 'changes_requested', reviewNote: 'x' } as any, draft: true, ...as(U.editor) }))
await expectFail('request changes needs a note', () => payload.update({ collection: 'news', id: nid, data: { reviewStatus: 'changes_requested', reviewNote: '' } as any, draft: true, ...as(U.publisher) }))
await expectOk('publisher requests changes with note', () => payload.update({ collection: 'news', id: nid, data: { reviewStatus: 'changes_requested', reviewNote: 'Please shorten the summary.' } as any, draft: true, ...as(U.publisher) }))
const d1: any = await payload.findByID({ collection: 'news', id: nid, draft: true, overrideAccess: true })
check('requesting changes does not make the reviewer the last editor', d1.lastEditor === U.editor.email, d1.lastEditor)
await expectOk('editor fixes and resubmits', () => payload.update({ collection: 'news', id: nid, data: { summary: 'A better, shorter summary for the test.', reviewStatus: 'in_review' } as any, draft: true, ...as(U.editor) }))
await expectOk('the reviewer who asked for changes can approve the corrected draft', () => payload.update({ collection: 'news', id: nid, data: { _status: 'published' } as any, ...as(U.publisher) }))
const d2: any = await payload.findByID({ collection: 'news', id: nid, draft: false, overrideAccess: true })
check('review status and note cleared on publish', d2.reviewStatus === 'none' && !d2.reviewNote, `${d2.reviewStatus}/${d2.reviewNote}`)

// trash
await expectFail('editor cannot move an article to the trash', () => payload.update({ collection: 'news', id: nid, data: { deletedAt: new Date().toISOString() } as any, trash: true, ...as(U.editor) }))
await expectFail('publisher cannot delete permanently', () => payload.delete({ collection: 'news', id: nid, ...as(U.publisher) }))
await expectOk('publisher moves article to trash', () => payload.update({ collection: 'news', id: nid, data: { deletedAt: new Date().toISOString() } as any, trash: true, ...as(U.publisher) }))
const live = await payload.find({ collection: 'news', where: { slug: { equals: news.slug } }, overrideAccess: true })
check('trashed article is hidden from normal lists', live.totalDocs === 0)
const tr = await payload.find({ collection: 'news', where: { slug: { equals: news.slug } }, trash: true, overrideAccess: true })
check('trashed article can be found in the trash', tr.totalDocs === 1)
await expectOk('article restored from trash', () => payload.update({ collection: 'news', id: nid, data: { deletedAt: null } as any, trash: true, overrideAccess: true, context: { seeding: true } }))

// key figures always two-step
await expectFail('key figure cannot be created and published in one step', () => payload.create({ collection: 'key-figures', data: { label: 'T', key: 'k' + tag, value: '1', source: 's', asOf: new Date().toISOString(), _status: 'published' } as any, ...as(U.publisher) }))
// Super Admin: no second approver needed
await expectOk('Super Admin can create and publish in one step', async () => { const k = await payload.create({ collection: 'key-figures', data: { label: 'SA', key: 'sa' + tag, value: '1', source: 's', asOf: new Date().toISOString(), _status: 'published' } as any, ...as(U.admin) }); await payload.update({ collection: 'key-figures', id: k.id, data: { value: '2', _status: 'published' } as any, ...as(U.admin) }); await payload.delete({ collection: 'key-figures', id: k.id, overrideAccess: true, context: { seeding: true } }) })
// notices: a publisher can publish alone
await expectOk('publisher can publish a notice banner alone', async () => { const n = await payload.create({ collection: 'notices', data: { message: 'Test notice ' + tag, _status: 'published' } as any, ...as(U.publisher) }); await payload.delete({ collection: 'notices', id: n.id, overrideAccess: true, context: { seeding: true } }) })
await expectFail('editor cannot publish a notice', () => payload.create({ collection: 'notices', data: { message: 'x', _status: 'published' } as any, ...as(U.editor) }))
// contact inbox privacy
await expectFail('editor cannot read contact messages', () => payload.find({ collection: 'messages', ...as(U.editor) }))
await expectFail('nobody can create a message through the API', () => payload.create({ collection: 'messages', data: { name: 'a', email: 'a@b.co', message: 'hello hello' } as any, ...as(U.admin) }))
await expectFail('publisher cannot read subscribers? (admin/publisher only: editor blocked)', () => payload.find({ collection: 'subscribers', ...as(U.editor) }))

// media guard
const png = await (await import('sharp')).default({ create: { width: 8, height: 8, channels: 3, background: '#123' } }).png().toBuffer()
const m: any = await payload.create({ collection: 'media', data: { alt: 'test' }, file: { data: png, mimetype: 'image/png', name: `guard-${tag}.png`, size: png.length }, overrideAccess: true })
const n2: any = await payload.create({ collection: 'news', data: { ...news, slug: news.slug + 'm', image: m.id } as any, draft: true, ...as(U.editor) })
await expectFail('a file in use cannot be deleted', () => payload.delete({ collection: 'media', id: m.id, ...as(U.admin) }))
await expectFail('a file in use cannot be moved to trash', () => payload.update({ collection: 'media', id: m.id, data: { deletedAt: new Date().toISOString() } as any, trash: true, ...as(U.admin) }))
await payload.update({ collection: 'news', id: n2.id, data: { image: null } as any, draft: true, ...as(U.editor) })
await expectOk('an unused file can be deleted', () => payload.delete({ collection: 'media', id: m.id, ...as(U.admin) }))
await payload.delete({ collection: 'news', id: n2.id, overrideAccess: true, context: { seeding: true } })

const bad = results.filter((r) => !r[1])
console.log(`\n${results.length - bad.length}/${results.length} checks passed`)
process.exit(bad.length ? 1 : 0)
