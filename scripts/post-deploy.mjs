// Run by the pipeline after a new version starts and BEFORE it receives public traffic.
// Usage: BASE_URL=https://staging.edif.gov.et REVALIDATE_TOKEN=... node scripts/post-deploy.mjs
// 1) waits until the app and database are ready, 2) refreshes every page from the live database, 3) checks key pages answer.
const base = (process.env.BASE_URL || '').replace(/\/$/, '')
const token = process.env.REVALIDATE_TOKEN || ''
if (!base || !token) { console.error('Set BASE_URL and REVALIDATE_TOKEN'); process.exit(2) }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

let ready = false
for (let i = 0; i < 60 && !ready; i++) {
  try { ready = (await fetch(base + '/readyz')).status === 200 } catch { /* not up yet */ }
  if (!ready) await sleep(2000)
}
if (!ready) { console.error('App did not become ready within 2 minutes'); process.exit(1) }

const r = await fetch(base + '/internal/revalidate', { method: 'POST', headers: { authorization: `Bearer ${token}` } })
if (r.status !== 200) { console.error('Revalidate failed:', r.status); process.exit(1) }

let bad = 0
for (const p of ['/', '/about', '/deposit-protection', '/deposit-protection/calculator', '/members', '/news', '/publications', '/contact', '/faq', '/sitemap.xml']) {
  const x = await fetch(base + p)
  if (x.status !== 200) { console.error('FAIL', p, x.status); bad++ } else await x.arrayBuffer()
}
if (bad) process.exit(1)
console.log('Post-deploy checks passed: pages refreshed and key pages answer 200.')
