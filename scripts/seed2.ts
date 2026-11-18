import { getPayload } from 'payload'
import fs from 'fs'
import path from 'path'
import config from '../src/payload.config'
import { board, management, yearStats } from '../src/site/data/content'

const payload = await getPayload({ config })
const IMG = process.env.IMG_DIR || '/home/claude/edif-site/public/images'
const sys = { overrideAccess: true as const, context: { seeding: true } }
const count = async (c: any) => (await payload.count({ collection: c, ...sys })).totalDocs

const text = (t: string) => ({ type: 'text', version: 1, text: t, format: 0, detail: 0, mode: 'normal', style: '' })
const para = (t: string) => ({ type: 'paragraph', version: 1, children: [text(t)], direction: 'ltr', format: '', indent: 0, textFormat: 0, textStyle: '' })
const rich = (t: string) => ({ root: { type: 'root', version: 1, children: [para(t)], direction: 'ltr', format: '', indent: 0 } })

const mediaId: Record<string, number> = {}
const upload = async (file: string, alt: string) => {
  if (mediaId[file]) return mediaId[file]
  const ex = await payload.find({ collection: 'media', where: { filename: { equals: file } }, ...sys })
  if (ex.docs[0]) return (mediaId[file] = ex.docs[0].id as number)
  const buf = fs.readFileSync(path.join(IMG, file))
  const mime = file.endsWith('.png') ? 'image/png' : file.endsWith('.svg') ? 'image/svg+xml' : 'image/jpeg'
  const m = await payload.create({ collection: 'media', data: { alt }, file: { data: buf, mimetype: mime, name: file, size: buf.length }, ...sys })
  return (mediaId[file] = m.id as number)
}

// ---- menus (same as the site had hard-coded) ----
await payload.updateGlobal({ slug: 'navigation', ...sys, data: {
  main: [
    { label: 'Deposit protection', url: '/deposit-protection', children: [
      { label: 'How protection works', url: '/deposit-protection', description: 'The three rules in plain words' },
      { label: 'What’s covered', url: '/deposit-protection/coverage', description: 'Accounts covered and the 11 exclusions' },
      { label: 'Coverage calculator', url: '/deposit-protection/calculator', description: 'See how much of your money is protected' },
      { label: 'If an institution fails', url: '/deposit-protection/payout', description: 'The payout timetable and recovery' },
    ] },
    { label: 'Members', url: '/members', children: [
      { label: 'Member directory', url: '/members', description: 'Every bank and microfinance institution covered' },
      { label: 'For member institutions', url: '/members/institutions', description: 'Membership, premiums and reporting' },
    ] },
    { label: 'About', url: '/about', children: [
      { label: 'About EDIF', url: '/about', description: 'Mandate, mission and functions' },
      { label: 'Governance', url: '/about/governance', description: 'Board of Directors and management' },
      { label: 'Organisation', url: '/about/organization', description: 'How the Fund is structured' },
      { label: 'Strategy and finances', url: '/about/strategy', description: 'Objectives, funding and use of funds' },
    ] },
    { label: 'News', url: '/news' }, { label: 'Publications', url: '/publications' }, { label: 'Tenders', url: '/tenders' }, { label: 'Contact', url: '/contact' },
  ],
  footer: [
    { heading: 'Deposit protection', links: [
      { label: 'How protection works', url: '/deposit-protection' }, { label: 'What’s covered', url: '/deposit-protection/coverage' }, { label: 'Coverage calculator', url: '/deposit-protection/calculator' },
      { label: 'If an institution fails', url: '/deposit-protection/payout' }, { label: 'Questions and answers', url: '/faq' } ] },
    { heading: 'The Fund', links: [
      { label: 'About EDIF', url: '/about' }, { label: 'Governance', url: '/about/governance' }, { label: 'Member institutions', url: '/members' },
      { label: 'For member institutions', url: '/members/institutions' }, { label: 'Publications and laws', url: '/publications' }, { label: 'News', url: '/news' } ] },
    { heading: 'Work with us', links: [{ label: 'Tenders', url: '/tenders' }, { label: 'Vacancies', url: '/vacancies' }, { label: 'Events', url: '/events' }] },
  ],
  cta: { label: 'Check your coverage', url: '/deposit-protection/calculator' },
} as any })
await payload.updateGlobal({ slug: 'brand-theme', ...sys, data: { wordmark: 'EDIF' } as any })

// ---- key figures (every one carries its source and date) ----
if (!(await count('key-figures'))) {
  const src = 'EDIF Annual Report 2024/25'
  const asOf = '2025-07-07T00:00:00.000Z'
  const figs: any[] = [
    { key: 'coverage-limit', label: 'Coverage limit', value: 'Birr 100,000', numeric: 100000, note: 'Per depositor, per institution.', source: 'Regulation No. 482/2021' },
    ...yearStats.map((s, i) => ({ key: ['investment-portfolio', 'premiums', 'surplus', 'investment-income', 'depositors', 'deposits'][i], label: s.k, value: `${s.pre ? s.pre + ' ' : ''}${s.v}`, note: s.d, source: src })),
  ]
  for (const f of figs) await payload.create({ collection: 'key-figures', draft: false, ...sys, data: { ...f, asOf: f.asOf || asOf, _status: 'published' } })
}

// ---- people ----
if (!(await count('people'))) {
  let n = 1
  for (const b of board) await payload.create({ collection: 'people', draft: false, ...sys, data: { name: b.name, jobTitle: b.role + (b.org ? ', ' + b.org : ''), group: 'board', sort: n++, photo: b.photo ? await upload(b.photo, b.name) : undefined, _status: 'published' } as any })
  for (const m of management) await payload.create({ collection: 'people', draft: false, ...sys, data: { name: m.name, jobTitle: m.role, group: 'management', sort: n++, photo: await upload(m.photo, m.name), bio: rich(m.bio), _status: 'published' } as any })
}
console.log('seed2 done')
process.exit(0)
