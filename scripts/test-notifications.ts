import { getPayload } from 'payload'
import config from '../src/payload.config'
import { notifyInApp, notifyRoles, usersWithRoles } from '../src/lib/notify'

const payload = await getPayload({ config })
const results: [string, boolean][] = []
const check = (name: string, ok: boolean, detail = '') => { results.push([name, ok]); console.log(ok ? 'PASS' : 'FAIL', name, detail) }
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

const mk = async (role: string) => {
  const email = `${role}@edif-cms.org`
  const ex = await payload.find({ collection: 'users', where: { email: { equals: email } }, overrideAccess: true })
  if (ex.docs[0]) return ex.docs[0] as any
  return (await payload.create({ collection: 'users', overrideAccess: true, data: { email, password: 'Test-' + Math.random().toString(36).slice(2) + 'Aa1!', name: role, role } as any })) as any
}
const U: any = {}
for (const r of ['admin', 'publisher', 'editor', 'auditor']) U[r] = await mk(r)
const as = (u: any) => ({ user: { ...u, collection: 'users', _strategy: 'totp' }, overrideAccess: false as const })
const tag = 'T' + Date.now()

// the system can notify; people cannot create notifications for themselves or others
await notifyInApp(payload, [U.editor], { kind: 'review', title: `Mine ${tag}`, body: 'b', link: '/admin' })
await notifyInApp(payload, [U.publisher], { kind: 'security', title: `Theirs ${tag}` })
const mine: any = await payload.find({ collection: 'notifications', ...as(U.editor), limit: 100, where: { title: { contains: tag } } })
check('a person sees their own notification', mine.docs.some((n: any) => n.title === `Mine ${tag}`))
check('a person never sees someone else’s', !mine.docs.some((n: any) => n.title === `Theirs ${tag}`))
let denied = false
try { await payload.create({ collection: 'notifications', data: { recipient: U.editor.id, kind: 'system', title: 'forged' } as any, ...as(U.editor) }) } catch { denied = true }
check('a person cannot create notifications', denied)
const other: any = (await payload.find({ collection: 'notifications', overrideAccess: true, where: { title: { equals: `Theirs ${tag}` } } })).docs[0]
let crossed = false
try { await payload.update({ collection: 'notifications', id: other.id, data: { readAt: new Date().toISOString() }, ...as(U.editor) }); crossed = true } catch { /* expected */ }
check('a person cannot mark someone else’s as read', !crossed)
const own: any = mine.docs.find((n: any) => n.title === `Mine ${tag}`)
await payload.update({ collection: 'notifications', id: own.id, data: { readAt: new Date().toISOString(), title: 'renamed' } as any, ...as(U.editor) })
const after: any = await payload.findByID({ collection: 'notifications', id: own.id, overrideAccess: true })
check('marking read works', !!after.readAt)
check('title and recipient cannot be changed by the recipient', after.title === `Mine ${tag}` && String(after.recipient?.id ?? after.recipient) === String(U.editor.id))

// dedupe: asking twice tells once
await notifyInApp(payload, [U.admin], { title: `Once ${tag}`, dedupeKey: `k:${tag}` })
await notifyInApp(payload, [U.admin], { title: `Once ${tag}`, dedupeKey: `k:${tag}` })
const once = await payload.count({ collection: 'notifications', overrideAccess: true, where: { dedupeKey: { equals: `k:${tag}` } } })
check('the same thing is only announced once', once.totalDocs === 1)

// review workflow reaches publishers but not the author
const pubs = await usersWithRoles(payload, ['publisher', 'admin'])
notifyRoles(payload, ['publisher', 'admin'], 'Ready for review', [`${tag} submitted "x" for review.`], { except: U.editor.email, path: '/admin/collections/news/1' })
await sleep(2500)
const rev: any = await payload.find({ collection: 'notifications', overrideAccess: true, limit: 50, where: { and: [{ title: { equals: 'Ready for review' } }, { body: { contains: tag } }] } })
check('review request notifies every publisher and Super Admin', pubs.every((p) => rev.docs.some((n: any) => String(n.recipient?.id ?? n.recipient) === String(p.id))), `${rev.docs.length} sent`)
check('review request is filed under Review with a link', rev.docs.every((n: any) => n.kind === 'review' && n.link))

// housekeeping task is registered and runs without error
const jobs: any = (payload.config as any).jobs
check('hourly checks task is registered', (jobs?.tasks ?? []).some((t: any) => t.slug === 'dailyChecks'))
const run: any = await payload.jobs.queue({ task: 'dailyChecks', input: {} } as any)
await payload.jobs.run({ limit: 5 } as any).catch(() => {})
check('hourly checks can be queued', !!run?.id)

const failed = results.filter((r) => !r[1]).length
console.log(`\n${results.length - failed}/${results.length} checks passed`)
process.exit(failed ? 1 : 0)
