// Checks for the fixes made after the independent code review (review/grok-findings.md, G-01 to G-13).
import { getPayload } from 'payload'
import config from '../src/payload.config'

const payload = await getPayload({ config })
let pass = 0, fail = 0
const check = (n: string, c: boolean, d = '') => { c ? pass++ : fail++; console.log(c ? 'PASS' : 'FAIL', n, d) }
const refused = async (n: string, fn: () => Promise<unknown>, re?: RegExp) => { try { await fn(); check(n, false, 'was allowed') } catch (e: any) { check(n, !re || re.test(e.message), `refused: ${String(e.message).slice(0, 80)}`) } }
const allowed = async (n: string, fn: () => Promise<unknown>) => { try { await fn(); check(n, true) } catch (e: any) { check(n, false, String(e.message).slice(0, 120)) } }

const user = async (email: string, role: string) => {
  const ex = await payload.find({ collection: 'users', where: { email: { equals: email } }, overrideAccess: true })
  if (ex.docs[0]) return ex.docs[0] as any
  return (await payload.create({ collection: 'users', overrideAccess: true, context: { seeding: true }, data: { email, password: 'Test-' + Math.random().toString(36).slice(2) + 'Aa1!', name: role, role } as any })) as any
}
const U = { admin: await user('admin@edif-cms.org', 'admin'), publisher: await user('publisher@edif-cms.org', 'publisher'), publisher2: await user('publisher2@edif-cms.org', 'publisher'), editor: await user('editor@edif-cms.org', 'editor'), seo: await user('seo@edif-cms.org', 'seo') }
const as = (u: any) => ({ user: { ...u, collection: 'users', _strategy: 'totp' }, overrideAccess: false as const })
const passwordOnly = (u: any) => ({ user: { ...u, collection: 'users', _strategy: 'local-jwt' }, overrideAccess: false as const })
const tag = Date.now()

// G-02: a Publisher cannot slip edits in with unpublish, trash or restore
const n: any = await payload.create({ collection: 'news', draft: true, data: { title: 'Fix test ' + tag, slug: 'fix-' + tag, kind: 'Announcement', date: new Date().toISOString(), summary: 'Original summary text.' } as any, ...as(U.editor), context: { draftSave: true } })
await payload.update({ collection: 'news', id: n.id, data: { _status: 'published' } as any, ...as(U.publisher) })
await refused('G-02 unpublish with an edit is refused', () => payload.update({ collection: 'news', id: n.id, data: { _status: 'draft', summary: 'Replaced by the publisher.' } as any, ...as(U.publisher2) }), /cannot be combined/)
await refused('G-02 trash with an edit is refused', () => payload.update({ collection: 'news', id: n.id, data: { deletedAt: new Date().toISOString(), summary: 'Replaced.' } as any, ...as(U.publisher2) }), /cannot be combined/)
await allowed('G-02 plain trash still works', () => payload.update({ collection: 'news', id: n.id, data: { deletedAt: new Date().toISOString() } as any, ...as(U.publisher2), trash: true }))
await refused('G-02 restore with an edit is refused', () => payload.update({ collection: 'news', id: n.id, data: { deletedAt: null, summary: 'Replaced.' } as any, ...as(U.publisher2), trash: true }), /cannot be combined/)
await allowed('G-02 plain restore still works', () => payload.update({ collection: 'news', id: n.id, data: { deletedAt: null } as any, ...as(U.publisher2), trash: true }))
await allowed('G-02 plain unpublish still works', () => payload.update({ collection: 'news', id: n.id, data: { _status: 'draft' } as any, ...as(U.publisher2) }))
const after: any = await payload.findByID({ collection: 'news', id: n.id, draft: true, overrideAccess: true })
check('G-02 summary is unchanged after all that', after.summary === 'Original summary text.', after.summary)

// F-01: a Publisher's own saved draft must not go live through trash/restore or unpublish
const f: any = await payload.create({ collection: 'news', draft: true, data: { title: 'F01 test ' + tag, slug: 'f01-' + tag, kind: 'Announcement', date: new Date().toISOString(), summary: 'Live text.' } as any, ...as(U.editor), context: { draftSave: true } })
await payload.update({ collection: 'news', id: f.id, data: { _status: 'published' } as any, ...as(U.publisher) })
await payload.update({ collection: 'news', id: f.id, draft: true, data: { summary: 'My own unreviewed draft.' } as any, ...as(U.publisher2), context: { draftSave: true } })
await allowed('F-01 plain trash', () => payload.update({ collection: 'news', id: f.id, data: { deletedAt: new Date().toISOString() } as any, ...as(U.publisher2), trash: true }))
await allowed('F-01 plain restore', () => payload.update({ collection: 'news', id: f.id, data: { deletedAt: null } as any, ...as(U.publisher2), trash: true }))
const live: any = await payload.findByID({ collection: 'news', id: f.id, draft: false, overrideAccess: true })
check('F-01 trash and restore did not put the Publisher\'s own draft live', live.summary === 'Live text.', live.summary)
await payload.delete({ collection: 'news', id: f.id, overrideAccess: true, context: { seeding: true } }).catch(() => null)

// G-07: SEO Manager edits search fields on news, not the article
await payload.update({ collection: 'news', id: n.id, draft: true, data: { summary: 'Rewritten by SEO.', seo: { title: 'Better search title' } } as any, ...as(U.seo), context: { draftSave: true } })
const s7: any = await payload.findByID({ collection: 'news', id: n.id, draft: true, overrideAccess: true })
check('G-07 SEO Manager cannot change the article summary', s7.summary === 'Original summary text.', s7.summary)
check('G-07 SEO Manager can still change the search title', s7.seo?.title === 'Better search title', s7.seo?.title)

// G-06: custom HTML/CSS on a new page is Super Admin only
const pg: any = await payload.create({ collection: 'pages', draft: true, data: { title: 'Custom by editor ' + tag, path: '/fix-' + tag, layout: [{ blockType: 'custom', label: 'x', html: '<p>From editor</p>', css: '.a{color:red}' }] } as any, ...as(U.editor), context: { draftSave: true } })
check('G-06 Editor cannot add custom HTML or CSS on a new page', !pg.layout?.[0]?.html && !pg.layout?.[0]?.css, JSON.stringify([pg.layout?.[0]?.html, pg.layout?.[0]?.css]))

// G-08: redirects
await refused('G-08 protocol-relative target is refused', () => payload.create({ collection: 'redirects', data: { from: '/old-a-' + tag, to: '//evil.example' } as any, ...as(U.seo) }), /must be a page path/)
await refused('G-08 Editor cannot redirect to another website', () => payload.create({ collection: 'redirects', data: { from: '/old-b-' + tag, to: 'https://example.org/' } as any, ...as(U.editor) }), /Super Admin/)
await allowed('G-08 Editor can still redirect within the site', () => payload.create({ collection: 'redirects', data: { from: '/old-c-' + tag, to: '/about' } as any, ...as(U.editor) }))
await refused('F-03 SEO Manager cannot redirect to another website', () => payload.create({ collection: 'redirects', data: { from: '/old-d-' + tag, to: 'https://example.org/' } as any, ...as(U.seo) }), /Super Admin/)
await allowed('F-03 Super Admin can redirect to another website', () => payload.create({ collection: 'redirects', data: { from: '/old-e-' + tag, to: 'https://example.org/' } as any, ...as(U.admin) }))

// G-04: link fields
// drafts skip validation in Payload; the check applies when content is published, and the site drops bad links regardless
await refused('G-04 a notice with a javascript: link cannot be published', () => payload.create({ collection: 'notices', data: { message: 'x', linkLabel: 'Go', linkUrl: 'javascript:alert(1)', _status: 'published' } as any, ...as(U.publisher) }), /page path|invalid/i)

// G-05: media library listing
const anon = await payload.find({ collection: 'media', limit: 1, overrideAccess: false, user: null as any }).then(() => 'listed', (e) => 'refused: ' + e.message)
check('G-05 visitors cannot list the media library', anon !== 'listed', anon)
const half = await payload.find({ collection: 'media', limit: 1, ...passwordOnly(U.editor) }).then(() => 'listed', (e) => 'refused: ' + e.message)
check('G-05 a password-only session cannot list it either', half !== 'listed', half)
await allowed('G-05 staff who passed two-factor can list it', () => payload.find({ collection: 'media', limit: 1, ...as(U.editor) }))

// G-11: a completed reset link is audited
const token = await payload.forgotPassword({ collection: 'users', data: { email: U.seo.email }, disableEmail: true })
await payload.resetPassword({ collection: 'users', data: { token: token as string, password: 'Reset-' + Math.random().toString(36).slice(2) + 'Bb2!' }, overrideAccess: true })
const audit = await payload.find({ collection: 'audit-log', where: { and: [{ documentTitle: { equals: U.seo.email } }, { action: { equals: 'security' } }] }, sort: '-createdAt', limit: 1, overrideAccess: true })
check('G-11 a password reset writes an audit entry', /reset link/.test(JSON.stringify((audit.docs[0] as any)?.changes || {})), JSON.stringify((audit.docs[0] as any)?.changes))

// S-02: only a Super Admin can point the site-wide banner at another website
const nb = (u: any, linkUrl: string) => payload.create({ collection: 'notices', draft: true, data: { message: 'Test banner ' + tag, linkLabel: 'More', linkUrl } as any, ...as(u) })
await refused('S-02 a Publisher cannot link a banner off-site', () => nb(U.publisher, 'https://evil.example/login'), /Super Admin/)
await allowed('S-02 a Publisher can link a banner to a page on this site', async () => { const d: any = await nb(U.publisher, '/faq'); await payload.delete({ collection: 'notices', id: d.id, overrideAccess: true, context: { seeding: true } }) })
await allowed('S-02 a Super Admin can link a banner off-site', async () => { const d: any = await nb(U.admin, 'https://nbe.gov.et'); await payload.delete({ collection: 'notices', id: d.id, overrideAccess: true, context: { seeding: true } }) })

// S-01: a password change or role change signs the other sessions out
const sess = await user('session-test@edif-cms.org', 'editor')
const sessions = () => payload.db.findOne({ collection: 'users', where: { id: { equals: sess.id } } }).then((u: any) => (u.sessions || []).map((x: any) => x.id))
const exp = new Date(Date.now() + 3600_000).toISOString()
const seed = async () => { const full: any = await payload.db.findOne({ collection: 'users', where: { id: { equals: sess.id } } }); await payload.db.updateOne({ collection: 'users', id: sess.id, data: { ...full, sessions: [{ id: 'sid-a', createdAt: exp, expiresAt: exp }, { id: 'sid-b', createdAt: exp, expiresAt: exp }] } as any }) }
await seed()
const hashBefore = ((await payload.db.findOne({ collection: 'users', where: { id: { equals: sess.id } } })) as any).hash
await payload.update({ collection: 'users', id: sess.id, data: { password: 'Fresh-Long-Passphrase-' + tag + '-Zq9' } as any, user: { ...sess, collection: 'users', _strategy: 'totp', _sid: 'sid-a' } as any, overrideAccess: false })
check('S-01 the new password hash was kept', ((await payload.db.findOne({ collection: 'users', where: { id: { equals: sess.id } } })) as any).hash !== hashBefore)
check('S-01 own password change keeps only the current session', JSON.stringify(await sessions()) === JSON.stringify(['sid-a']), JSON.stringify(await sessions()))
await seed()
await payload.update({ collection: 'users', id: sess.id, data: { role: 'seo' } as any, ...as(U.admin) })
check('S-01 a role change signs the person out everywhere', (await sessions()).length === 0, JSON.stringify(await sessions()))
check('S-01 and the role stays changed (the write did not restore the old row)', ((await payload.db.findOne({ collection: 'users', where: { id: { equals: sess.id } } })) as any).role === 'seo')
await payload.update({ collection: 'users', id: sess.id, data: { role: 'editor' } as any, ...as(U.admin) })

// SiteSettings: an SEO Manager can edit search settings but not the maintenance switch or contact details
const ss0: any = await payload.findGlobal({ slug: 'site-settings', overrideAccess: true })
await payload.updateGlobal({ slug: 'site-settings', data: { maintenance: { enabled: true, message: 'x' }, email: 'hacked@example.org', defaultSeo: { title: 'SEO title ' + tag } } as any, ...as(U.seo) }).catch(() => null)
const ss1: any = await payload.findGlobal({ slug: 'site-settings', overrideAccess: true })
check('SEO Manager cannot change maintenance mode or the public email', !!ss1.maintenance?.enabled === !!ss0.maintenance?.enabled && ss1.email === ss0.email, JSON.stringify({ m: ss1.maintenance?.enabled, e: ss1.email }))
check('SEO Manager can change the default search title', ss1.defaultSeo?.title === 'SEO title ' + tag, String(ss1.defaultSeo?.title))
await payload.updateGlobal({ slug: 'site-settings', data: { defaultSeo: { title: ss0.defaultSeo?.title || null } } as any, overrideAccess: true, context: { seeding: true } })

// Contact messages: a Publisher cannot rewrite what a citizen wrote, but can still triage
const msg: any = await payload.create({ collection: 'messages', data: { name: 'Test Sender', email: 'sender@example.org', message: 'Original message ' + tag, topic: 't', subject: 's' } as any, overrideAccess: true, context: { seeding: true } })
await payload.update({ collection: 'messages', id: msg.id, data: { message: 'Rewritten by publisher', status: 'progress' } as any, ...as(U.publisher) }).catch(() => null)
const msg2: any = await payload.findByID({ collection: 'messages', id: msg.id, overrideAccess: true })
check('G-msg a Publisher cannot change the text of a contact message', msg2.message === 'Original message ' + tag, msg2.message)
check('G-msg a Publisher can still change its status', msg2.status === 'progress', msg2.status)
await payload.delete({ collection: 'messages', id: msg.id, overrideAccess: true, context: { seeding: true } })


// Media: replacing a live file needs a Publisher
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64')
const swap = (n: string) => ({ data: PNG, mimetype: 'image/png', name: n, size: PNG.length })
const mf: any = await payload.create({ collection: 'media', data: { alt: 'probe ' + tag }, file: swap('probe-' + tag + '.png'), overrideAccess: true, context: { seeding: true } })
for (const who of ['editor', 'seo'] as const) {
  const r = await payload.update({ collection: 'media', id: mf.id, data: {}, file: swap('swap-' + who + '-' + tag + '.png'), ...as((U as any)[who]) }).then(() => 'replaced', (e: any) => 'refused')
  check('G-media ' + who + ' cannot replace a live file', r === 'refused', r)
}
await allowed('G-media an Editor can still edit alt text', () => payload.update({ collection: 'media', id: mf.id, data: { alt: 'edited ' + tag }, ...as(U.editor) }))
await allowed('G-media a Publisher can replace a file', () => payload.update({ collection: 'media', id: mf.id, data: {}, file: swap('swap-pub-' + tag + '.png'), ...as(U.publisher) }))
await payload.delete({ collection: 'media', id: mf.id, overrideAccess: true, context: { seeding: true } })

// clean up
await payload.delete({ collection: 'news', id: n.id, overrideAccess: true, context: { seeding: true } })
await payload.delete({ collection: 'pages', id: pg.id, overrideAccess: true, context: { seeding: true } })
await payload.delete({ collection: 'redirects', where: { from: { like: '-' + tag } }, overrideAccess: true })
console.log(`${pass}/${pass + fail} checks passed`); process.exit(fail ? 1 : 0)
