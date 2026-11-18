import { getPayload } from 'payload'
import config from '../src/payload.config'
import { cleanHtml, scopeCss } from '../src/lib/customCode'
const payload = await getPayload({ config })
let pass = 0, fail = 0
const ok = (n: string, c: boolean, d = '') => { c ? pass++ : fail++; console.log(c ? 'PASS' : 'FAIL', n, d) }
// sanitizer
const h = cleanHtml('<div class="a" onclick="x()"><script>alert(1)</script><iframe src="https://evil.test"></iframe><form action="https://evil.test"><input name=p></form><a href="javascript:alert(1)">x</a><a href="https://ok.test">y</a><img src="https://a.test/i.png" onerror="x()"><p style="position:fixed">t</p></div>')
ok('script removed', !/script|alert/.test(h)); ok('iframe and form removed', !/iframe|<form|<input/.test(h)); ok('event handlers removed', !/onclick|onerror/.test(h))
ok('javascript link removed', !/javascript:/.test(h)); ok('https link kept with noopener', /href="https:\/\/ok.test"[^>]*noopener/.test(h)); ok('inline style removed', !/style=/.test(h))
const c = scopeCss('@import url(https://evil.test/x.css); .box{color:red;position:fixed;background:url(https://evil.test/a.png)} body{padding:4px} h2,.x{margin:0;z-index:999} @font-face{src:url(/a)} @media (max-width:600px){.box{width:10px}}', 's1')
ok('rules are scoped', /#s1 \.box\{color:red\}/.test(c) && /#s1\{padding:4px\}/.test(c)); ok('import, fixed, external url dropped', !/import|fixed|evil/.test(c)); ok('z-index capped', !/999/.test(c)); ok('font-face dropped', !/font-face/.test(c)); ok('media kept', /@media/.test(c) && /#s1 \.box\{width:10px\}/.test(c))
// roles
const find = async (e: string) => (await payload.find({ collection: 'users', where: { email: { equals: e } }, overrideAccess: true })).docs[0] as any
const as = (u: any) => ({ user: { ...u, collection: 'users', _strategy: 'totp' }, overrideAccess: false as const })
const admin = await find('admin@edif-cms.org'), editor = await find('editor@edif-cms.org')
const path = '/ct-' + Date.now()
const pg: any = await payload.create({ collection: 'pages', draft: true, data: { title: 'Custom test', path, layout: [{ blockType: 'custom', label: 't', html: '<p onclick="x()">Hello</p><script>1</script>', css: '.p{color:red}' }] } as any, ...as(admin), context: { draftSave: true } })
const row = pg.layout[0]
ok('saved html is cleaned', row.html === '<p>Hello</p>', row.html)
const upd: any = await payload.update({ collection: 'pages', id: pg.id, draft: true, data: { layout: [{ id: row.id, blockType: 'custom', label: 'edited by editor', html: '<p>Hacked</p>', css: '.p{color:blue}' }] } as any, ...as(editor), context: { draftSave: true } })
const r2 = upd.layout?.[0] || {}
ok('editor cannot change custom html or css', r2.html === '<p>Hello</p>' && r2.css === '.p{color:red}', JSON.stringify([r2.html, r2.css]))
let bad = ''
try { await payload.update({ collection: 'pages', id: pg.id, draft: true, data: { layout: [{ id: row.id, blockType: 'custom', html: '<p>x</p>', css: '@import url(https://evil.test/a.css);' }] } as any, ...as(admin), context: { draftSave: true } }) } catch (e: any) { bad = e.message }
ok('css with nothing allowed is refused', /None of this CSS/.test(bad), bad.slice(0, 60))
await payload.delete({ collection: 'pages', id: pg.id, overrideAccess: true, context: { seeding: true } })
console.log(`${pass}/${pass + fail} checks passed`); process.exit(fail ? 1 : 0)
