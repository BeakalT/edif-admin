// One-time update of an EXISTING database after the November 2026 review (new installs get the same result from seed3.ts).
//   npx payload run scripts/apply-review-changes.ts
// Safe to run twice. It does not delete anything: test items are moved to the trash, which can be restored.
//   1. Home page: restores the original design (crowd photo, rules, bank ticker, section colours).
//   2. Payout wording limited to what EDIF publishes; scam warning moved from the site-wide banner to the payout page and a new FAQ entry; Kenya visit article unpublished.
//   3. Moves the test news article "Draft title change" and the test page "Custom test…" to the trash.
import { getPayload } from 'payload'
import config from '../src/payload.config'
import fs from 'fs'
import path from 'path'
import { articles } from './seed-data/news'

const payload = await getPayload({ config })
const sys = { overrideAccess: true as const, context: { seeding: true } }
const DROP = new Set(['crowd', 'rules', 'ticker'])

// Homepage: restores the design elements that an earlier version of this script removed (crowd photo, coverage rules, bank
// ticker) and the original section colours. Nothing is created twice: blocks that are already there are left alone.
const home = (await payload.find({ collection: 'pages', where: { path: { equals: '/' } }, limit: 1, depth: 0, ...sys })).docs[0] as any
if (!home) console.log('No Home page found: nothing to change on the homepage.')
else {
  const photo = (await payload.find({ collection: 'media', where: { filename: { equals: 'workshop.jpg' } }, limit: 1, depth: 0, ...sys })).docs[0] as any
  const crowd = photo ? { blockType: 'crowd', photo: photo.id, number: 176, suffix: 'M', kicker: 'Depositors in Ethiopia', text: 'About 97% of them, 171 million people, are fully covered up to Birr 100,000.' } : null
  const rules = { blockType: 'rules', limit: 100000, currency: 'Birr', label: 'Coverage limit', desc: 'The most the Fund repays to one depositor at one institution.', rules: [{ title: 'Each institution', text: 'Accounts at different banks or MFIs are protected separately.' }, { title: 'Added together', text: 'All your accounts at the same institution are combined, including interest.' }] }
  const ticker = { blockType: 'ticker', title: 'Is your bank a member?', text: 'Every bank and microfinance institution licensed in Ethiopia is a member of the Fund.', linkLabel: 'Find your bank', linkUrl: '/members' }
  const COLOURS: Record<string, string> = { about: 'ice', covered: 'ice', estimate: 'default', faq: 'default' }
  let changed = 0
  const layout = (home.layout || []).map((b: any) => {
    if (b.blockType !== 'section') return b
    const anchor = b.section?.anchor
    let out = b
    if (anchor && COLOURS[anchor] && b.section?.background !== COLOURS[anchor]) { out = { ...out, section: { ...out.section, background: COLOURS[anchor] } }; changed++ }
    if (anchor === 'covered') {
      const has = (t: string) => (out.parts || []).some((p: any) => p.blockType === t)
      let parts = [...(out.parts || [])]
      if (!has('crowd') && crowd) { parts = [crowd, ...parts]; changed++ }
      if (!has('rules')) { const i = parts.findIndex((p: any) => p.blockType === 'crowd'); parts.splice(i + 1, 0, rules); changed++ }
      if (!has('ticker')) { parts.push(ticker); changed++ }
      out = { ...out, parts }
    }
    return out
  })
  if (!photo) console.log('Note: the crowd photo (workshop.jpg) is not in the media library, so that block was not restored.')
  if (changed) {
    await payload.update({ collection: 'pages', id: home.id, data: { layout, _status: 'published' } as any, ...sys })
    console.log(`Home page: restored ${changed} design element(s) / colour(s).`)
  } else console.log('Home page: already has its original design.')
}

// Payout wording (payout page callout + FAQ) limited to what EDIF itself publishes; scam warning added there.
const OLD_CALL = 'The pay-agent bank is chosen for its wide branch network across Ethiopia, its strong financial position and its administrative capacity.'
const NEW_CALL = 'The pay-agent bank is chosen for its wide branch network across Ethiopia. Beware of fake messages asking for your bank details: the Fund never asks for passwords.'
const swap = (v: any): any => Array.isArray(v) ? v.map(swap) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, swap(x)])) : v === OLD_CALL ? NEW_CALL : v
const pages = (await payload.find({ collection: 'pages', limit: 200, depth: 0, ...sys })).docs as any[]
for (const pg of pages) {
  if (!JSON.stringify(pg.layout || []).includes(OLD_CALL)) continue
  await payload.update({ collection: 'pages', id: pg.id, data: { layout: swap(pg.layout), _status: 'published' } as any, ...sys })
  console.log(`Page ${pg.path}: payout note updated.`)
}
const faq = (await payload.find({ collection: 'faqs', where: { question: { equals: 'Where would I receive my payment?' } }, limit: 1, depth: 0, ...sys })).docs[0] as any
if (faq && /administrative capacity/.test(faq.answer)) {
  await payload.update({ collection: 'faqs', id: faq.id, data: { answer: 'Through a pay-agent bank that the Fund appoints in advance, with a wide branch network across Ethiopia. The Fund announces which bank, and when payment starts.', _status: 'published' } as any, ...sys })
  console.log('FAQ "Where would I receive my payment?" updated.')
}
const hasFake = (await payload.find({ collection: 'faqs', where: { question: { equals: 'How can I tell a fake message?' } }, limit: 1, depth: 0, ...sys })).docs.length
if (!hasFake) {
  await payload.create({ collection: 'faqs', ...sys, data: { _status: 'published', question: 'How can I tell a fake message?', answer: 'Be careful with any message that asks for your bank details or passwords. The Fund never asks for passwords. If you are unsure, contact the Fund using the telephone number or email on the Contact page.', category: 'Payout', showOnHome: false, sort: (faq?.sort ?? 100) + 1 } as any })
  console.log('Added FAQ "How can I tell a fake message?".')
}
// Site-wide scam banner: unpublished (not deleted), so it can be restored from the admin.
for (const n of (await payload.find({ collection: 'notices', where: { message: { like: 'Beware of fake messages' } }, limit: 10, depth: 0, ...sys })).docs as any[]) {
  if (n._status === 'draft') continue
  await payload.update({ collection: 'notices', id: n.id, data: { _status: 'draft' } as any, ...sys })
  console.log('Site-wide scam banner unpublished.')
}
// Kenya visit article: unpublished (not deleted).
for (const a of (await payload.find({ collection: 'news', where: { slug: { equals: 'kenya-deposit-insurance-corporation-visit' } }, limit: 5, depth: 0, ...sys })).docs as any[]) {
  if (a._status === 'draft') continue
  await payload.update({ collection: 'news', id: a.id, data: { _status: 'draft' } as any, ...sys })
  console.log('Kenya visit article unpublished.')
}

// News: the March 2024 awareness and dialogue conference (first published by the National Bank of Ethiopia), dated 22 March 2024.
{
  const a = articles.find((x) => x.slug === 'edif-awareness-dialogue-conference-2024')!
  const exists = (await payload.find({ collection: 'news', where: { slug: { equals: a.slug } }, limit: 1, depth: 0, trash: true, ...sys })).docs.length
  if (exists) console.log('News: the awareness conference article is already there.')
  else {
    const text = (t: string) => ({ type: 'text', version: 1, text: t, format: 0, detail: 0, mode: 'normal', style: '' })
    const block = (type: string, children: any[], extra: any = {}) => ({ type, version: 1, children, direction: 'ltr', format: '', indent: 0, ...extra })
    const lexical = { root: block('root', a.body.map((b: any) => typeof b === 'string' ? block('paragraph', [text(b)], { textFormat: 0, textStyle: '' }) : 'h' in b ? block('heading', [text(b.h)], { tag: 'h3' }) : block('list', b.list.map((li: string, i: number) => block('listitem', [text(li)], { value: i + 1 })), { listType: 'bullet', start: 1, tag: 'ul' }))) }
    const img = a.image ? (await payload.find({ collection: 'media', where: { filename: { equals: a.image } }, limit: 1, depth: 0, ...sys })).docs[0] as any : null
    await payload.create({ collection: 'news', draft: false, ...sys, data: { _status: 'published', title: a.title, slug: a.slug, kind: a.kind, date: new Date(a.date).toISOString(), short: a.short, summary: a.summary, image: img?.id, body: lexical, sourceUrl: a.source } as any })
    console.log('News: added "' + a.title + '" dated 22 March 2024.')
  }
}

// Media: the conference photo "stage.jpg" was replaced in public/images with a new photo. The site reads pictures from the media
// library, not from that folder, so copy the new file into the existing library entry (the About section and the March 2024 article both use it).
{
  const NEW_ALT = 'Speaker at EDIF’s deposit insurance awareness and dialogue conference, Addis Ababa, March 2024'
  const m = (await payload.find({ collection: 'media', where: { or: [{ filename: { equals: 'stage.jpg' } }, { alt: { equals: NEW_ALT } }] }, limit: 1, depth: 0, ...sys })).docs[0] as any
  const file = [process.env.IMG_DIR, 'public/images'].filter(Boolean).map((d) => path.resolve(String(d), 'stage.jpg')).find((f) => fs.existsSync(f))
  if (!m || !file) console.log('Media: no stage.jpg in the library or in public/images, nothing to replace.')
  else if (m.alt === NEW_ALT) console.log('Media: stage.jpg was already replaced.')
  else {
    const buf = fs.readFileSync(file)
    await payload.update({ collection: 'media', id: m.id, data: { alt: NEW_ALT }, file: { data: buf, mimetype: 'image/jpeg', name: 'stage.jpg', size: buf.length }, ...sys })
    console.log('Media: replaced stage.jpg with the new photo from public/images.')
  }
}

const trash = async (collection: 'news' | 'pages', where: any, label: string) => {
  const found = await payload.find({ collection, where, limit: 20, depth: 0, ...sys })
  for (const d of found.docs as any[]) {
    await payload.update({ collection, id: d.id, data: { deletedAt: new Date().toISOString() } as any, trash: true, ...sys })
    console.log(`Moved ${label} "${d.title}" to the trash.`)
  }
  if (!found.docs.length) console.log(`No ${label} to move.`)
}
await trash('news', { title: { equals: 'Draft title change' } }, 'test article')
await trash('pages', { title: { like: 'Custom test' } }, 'test page')

// The website keeps published content in a cache that scripts cannot clear directly. Ask the running site to clear it
// when a REVALIDATE_TOKEN is configured; otherwise say what to do.
const site = process.env.SITE_URL || 'http://localhost:3100', token = process.env.REVALIDATE_TOKEN || ''
let refreshed = false
if (token.length >= 32) {
  try { refreshed = (await fetch(site + '/internal/revalidate', { method: 'POST', headers: { authorization: 'Bearer ' + token } })).ok } catch { /* site not running */ }
}
console.log(refreshed ? 'The website cache was cleared: changes are live now.' : 'To show the changes on the website now: sign in to the admin, open Pages > Home and press Publish changes once (or wait up to an hour).')
process.exit(0)
