// Emergency static copy of the public site. Usage: node scripts/static-mirror.mjs [outDir=mirror] [baseUrl=$SITE_URL or http://localhost:3100]
// Crawls the sitemap, saves each page as plain HTML with every file it needs (scripts, styles, fonts, images, documents).
// Upload the folder to any static host (object storage, nginx, a second provider) and point DNS there if the main site is down.
// Forms and search need the live server and are replaced by a short notice in the copy.
import fs from 'fs'
import path from 'path'

const out = path.resolve(process.argv[2] || 'mirror')
const base = (process.argv[3] || process.env.SITE_URL || 'http://localhost:3100').replace(/\/$/, '')
const NOTICE = '<div style="position:sticky;top:0;z-index:99999;background:#7a1f1f;color:#fff;padding:8px 16px;font:14px/1.4 system-ui,sans-serif;text-align:center">This is a temporary copy of the EDIF website. Forms, search and live updates are unavailable until the main site is back.</div>'
const seen = new Set(), queue = []
const getBuf = async (u) => { const r = await fetch(u, { headers: { 'user-agent': 'edif-static-mirror' }, redirect: 'follow' }); return r.ok ? { buf: Buffer.from(await r.arrayBuffer()), type: r.headers.get('content-type') || '' } : null }
const save = (rel, buf) => { const f = path.join(out, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, buf) }
const local = (u) => { try { const x = new URL(u, base); return x.origin === new URL(base).origin ? x : null } catch { return null } }
const addAsset = (u) => { const x = local(u); if (x && !x.pathname.endsWith('/') && (!x.pathname.startsWith('/api') || x.pathname.startsWith('/api/media/file/')) && !seen.has(x.pathname + x.search)) { seen.add(x.pathname + x.search); queue.push(x) } }

const sm = await getBuf(base + '/sitemap.xml')
if (!sm) { console.error('Could not read', base + '/sitemap.xml'); process.exit(1) }
const pages = [...sm.buf.toString().matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => local(m[1])?.pathname).filter(Boolean)
for (const p of new Set(['/', '/404-not-found', ...pages])) {
  const r = await getBuf(base + p)
  if (!r || !r.type.includes('html')) continue
  let html = r.buf.toString().replace(/\/_next\/image\?url=([^&"' ]+)(?:&amp;|&)[^"' ,]*/g, (_, u) => decodeURIComponent(u)) // use the original image, not the resized variant
  for (const m of html.matchAll(/(?:src|href|poster|data-src)="(\/[^"#]*)"|url\((\/[^)"']+)\)|srcset="([^"]+)"/g)) {
    if (m[3]) m[3].split(',').forEach((s) => addAsset(s.trim().split(' ')[0]))
    else if (m[1] && !/^\/(api(?!\/media\/file\/)|admin)/.test(m[1])) { if (/\.[a-z0-9]{2,5}(\?|$)/i.test(m[1]) || m[1].startsWith('/_next/')) addAsset(m[1]) }
    else if (m[2]) addAsset(m[2])
  }
  for (const m of html.matchAll(/["'](\/_next\/static\/[^"']+)["']/g)) addAsset(m[1])
  html = html.replace(/<form[\s\S]*?<\/form>/gi, '<p><em>This form is unavailable in the temporary copy.</em></p>').replace(/<body([^>]*)>/i, `<body$1>${NOTICE}`)
  save(p === '/' ? 'index.html' : path.join(p, 'index.html'), html)
  console.log('page', p)
}
let n = 0
while (queue.length) {
  const x = queue.shift()
  const r = await getBuf(x.href).catch(() => null)
  if (!r) continue
  try { save(decodeURIComponent(x.pathname).replace(/^\//, ''), r.buf); n++ } catch { /* skip a path that cannot be a file */ }
  if (r.type.includes('css')) for (const m of r.buf.toString().matchAll(/url\((?!data:)["']?([^)"']+)["']?\)/g)) addAsset(new URL(m[1], x).pathname + new URL(m[1], x).search)
}
console.log(`Mirror written to ${out}: ${seen.size} files + pages`)
