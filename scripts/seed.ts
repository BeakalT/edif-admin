import { getPayload } from 'payload'
import fs from 'fs'
import path from 'path'
import config from '../src/payload.config'
import { articles } from './seed-data/news'
import { contact, docs, faqs } from './seed-data/content'
import { banks, microfinance } from './seed-data/members'

const payload = await getPayload({ config })
const IMG = process.env.IMG_DIR || '/home/claude/edif-site/public/images'
const sys = { overrideAccess: true as const, context: { seeding: true } }

// ---- rich text helpers (Lexical) ----
const text = (t: string, format = 0) => ({ type: 'text', version: 1, text: t, format, detail: 0, mode: 'normal', style: '' })
const block = (type: string, children: any[], extra: any = {}) => ({ type, version: 1, children, direction: 'ltr', format: '', indent: 0, ...extra })
const para = (t: string) => block('paragraph', [text(t)], { textFormat: 0, textStyle: '' })
const toLexical = (body: any[]) => ({
  root: block('root', body.map((b) => {
    if (typeof b === 'string') return para(b)
    if ('h' in b) return block('heading', [text(b.h)], { tag: 'h3' })
    if ('list' in b) return block('list', b.list.map((li: string, i: number) => block('listitem', [text(li)], { value: i + 1 })), { listType: 'bullet', start: 1, tag: 'ul' })
    if ('quote' in b) return block('quote', [text(`${b.quote} — ${b.by}`)])
    return para('')
  })),
})

// ---- media ----
const mediaId: Record<string, number> = {}
const upload = async (file: string, alt: string) => {
  if (mediaId[file]) return mediaId[file]
  const ex = await payload.find({ collection: 'media', where: { filename: { equals: file } }, ...sys })
  if (ex.docs[0]) return (mediaId[file] = ex.docs[0].id as number)
  const buf = fs.readFileSync(path.join(IMG, file))
  const mime = file.endsWith('.png') ? 'image/png' : 'image/jpeg'
  const m = await payload.create({ collection: 'media', data: { alt }, file: { data: buf, mimetype: mime, name: file, size: buf.length }, ...sys })
  return (mediaId[file] = m.id as number)
}

const count = async (c: any) => (await payload.count({ collection: c, ...sys })).totalDocs

// ---- news ----
if (!(await count('news'))) {
  for (const a of articles) {
    await payload.create({
      collection: 'news', draft: false, ...sys,
      data: {
        _status: 'published', title: a.title, slug: a.slug, kind: a.kind, date: new Date(a.date).toISOString(), short: a.short, summary: a.summary,
        image: a.image ? await upload(a.image, a.imageAlt || a.title) : undefined,
        gallery: a.gallery ? await (async () => { const g = []; for (const x of a.gallery!) g.push({ image: await upload(x.src, x.alt), alt: x.alt }); return g })() : undefined, body: toLexical(a.body) as any, externalPdf: a.pdf, sourceUrl: a.source,
      } as any,
    })
  }
  console.log('news', articles.length)
}

// ---- publications (date from the upload folder in the URL, e.g. 2024/07) ----
if (!(await count('publications'))) {
  for (const d of docs) {
    const m = d.url.match(/\/(\d{4})\/(\d{2})\//)
    await payload.create({
      collection: 'publications', ...sys,
      data: { _status: 'published', title: d.title, kind: d.kind, description: d.desc, externalUrl: d.url, date: new Date(`${m?.[1] ?? '2024'}-${m?.[2] ?? '07'}-01`).toISOString(), featured: !!d.stats, stats: d.stats?.map((s) => ({ value: s.v, label: s.l })) } as any,
    })
  }
  console.log('publications', docs.length)
}

// ---- faqs ----
const homeFaqs = ['Do I need to register for protection?', 'Why is the limit Birr 100,000?', 'Where would I receive my payment?', 'Where does the Fund’s money come from?', 'Who oversees the Fund?']
if (!(await count('faqs'))) {
  let i = 0
  for (const f of faqs) await payload.create({ collection: 'faqs', ...sys, data: { _status: 'published', question: f.q, answer: f.a, category: f.cat, showOnHome: homeFaqs.includes(f.q), sort: ++i * 10 } as any })
  console.log('faqs', faqs.length)
}

// ---- members ----
if (!(await count('members'))) {
  for (const [list, type] of [[banks, 'bank'], [microfinance, 'microfinance']] as const)
    for (const m of list) await payload.create({ collection: 'members', ...sys, data: { _status: 'published', type, name: m.name, phone: m.phone || undefined, email: m.email || undefined, website: m.website || undefined, location: m.location || undefined } as any })
  console.log('members', banks.length + microfinance.length)
}

// ---- globals and SEO ----
await payload.updateGlobal({
  slug: 'site-settings', ...sys,
  data: { email: contact.email, poBox: contact.poBox, phones: contact.phones.map((number) => ({ number })), address: contact.address.map((line) => ({ line })), defaultSeo: { image: await upload('hero.jpg', 'Participants at an EDIF conference in Addis Ababa'), title: 'Ethiopian Deposit Insurance Fund', description: 'Your deposits at licensed banks and microfinance institutions are protected up to Birr 100,000 by the Ethiopian Deposit Insurance Fund.' } },
})
const N = 'Ethiopian Deposit Insurance Fund'
const pages: [string, string, string, string][] = [
  ['/', 'Home', `Ethiopian Deposit Insurance Fund | Your deposits are protected`, 'Deposits at every licensed bank and microfinance institution in Ethiopia are protected up to Birr 100,000 per depositor. See how protection and payout work.'],
  ['/deposit-protection', 'How protection works', `How deposit protection works | EDIF`, 'Three simple rules explain how the Fund protects your savings at licensed banks and microfinance institutions in Ethiopia.'],
  ['/deposit-protection/coverage', 'What is covered', `What deposits are covered | EDIF`, 'Eight kinds of account are protected at every member institution, up to Birr 100,000. See what is and is not covered.'],
  ['/deposit-protection/calculator', 'Coverage calculator', `Coverage calculator | EDIF`, 'Add your accounts and see how much of your money is protected if a bank or microfinance institution fails.'],
  ['/deposit-protection/payout', 'If an institution fails', `If a bank or microfinance institution fails | EDIF`, 'How and when depositors are repaid, and where to collect payment, if a member institution fails.'],
  ['/members', 'Member directory', `Member banks and microfinance institutions | EDIF`, 'Search all 93 licensed banks and microfinance institutions that are members of the Fund.'],
  ['/members/institutions', 'For member institutions', `For member institutions | EDIF`, 'Membership, premiums and reporting: what the Fund requires of the institutions it protects.'],
  ['/about', 'About EDIF', `About EDIF | EDIF`, 'EDIF protects depositors and supports the stability of Ethiopia’s financial system. Learn about our mandate, mission and functions.'],
  ['/about/governance', 'Governance', `Governance | EDIF`, 'The Board of Directors and management of the Ethiopian Deposit Insurance Fund.'],
  ['/about/organization', 'Organisation', `Organisation | EDIF`, 'How the Ethiopian Deposit Insurance Fund is structured.'],
  ['/about/strategy', 'Strategy and finances', `Strategy and finances | EDIF`, 'EDIF’s strategic objectives, how the Fund is financed, and how its money is used.'],
  ['/publications', 'Publications', `Publications | EDIF`, 'Annual reports, laws, regulations and directives of the Ethiopian Deposit Insurance Fund, newest first.'],
  ['/news', 'News', `News and announcements | EDIF`, 'The latest news, reports and events from the Ethiopian Deposit Insurance Fund.'],
  ['/faq', 'FAQ', `Questions and answers | EDIF`, 'Clear answers on deposit protection, payout and how the Fund works.'],
  ['/contact', 'Contact', `Contact the Fund | EDIF`, 'Call, write or visit the Ethiopian Deposit Insurance Fund in Addis Ababa.'],
]
for (const [p, label, title, description] of pages) {
  const ex = await payload.find({ collection: 'seo-pages', where: { path: { equals: p } }, ...sys })
  if (!ex.docs[0]) await payload.create({ collection: 'seo-pages', ...sys, data: { path: p, label, seo: { title, description } } as any })
}
console.log('seeded')
process.exit(0)
