import { getPayload } from 'payload'
import config from '../src/payload.config'

const payload = await getPayload({ config })
const sys = { overrideAccess: true as const, context: { seeding: true } }
const text = (t: string, format = 0) => ({ type: 'text', version: 1, text: t, format, detail: 0, mode: 'normal', style: '' })
const para = (...c: any[]) => ({ type: 'paragraph', version: 1, children: c, direction: 'ltr', format: '', indent: 0, textFormat: 0, textStyle: '' })
const rich = (...p: any[]) => ({ root: { type: 'root', version: 1, children: p, direction: 'ltr', format: '', indent: 0 } })
const count = async (c: any) => (await payload.count({ collection: c, ...sys })).totalDocs
const day = (n: number) => new Date(Date.now() + n * 864e5).toISOString()
const pub = { _status: 'published' }

if (!(await count('pages'))) {
  const figs = await payload.find({ collection: 'key-figures', limit: 3, depth: 0, ...sys })
  await payload.create({ collection: 'pages', draft: false, ...sys, data: { ...pub, title: 'Example page', path: '/example-page', layout: [
    { blockType: 'hero', eyebrow: 'Sample', title: 'A page built from blocks', intro: 'Editors build pages like this one without any code.' },
    { blockType: 'richText', heading: 'Plain words', content: rich(para(text('This text keeps '), text('bold', 1), text(' and '), text('italic', 2), text(' formatting.'))) },
    { blockType: 'figures', heading: 'Key figures', items: figs.docs.map((f) => f.id) },
    { blockType: 'callout', tone: 'important', title: 'Good to know', text: 'Every figure shows its source and date.' },
    { blockType: 'cta', title: 'Check your coverage', text: 'Use the calculator.', label: 'Open calculator', url: '/deposit-protection/calculator' },
  ] } as any })
}
if (!(await count('tenders'))) {
  await payload.create({ collection: 'tenders', draft: false, ...sys, data: { ...pub, title: 'Supply of office equipment', slug: 'office-equipment', reference: 'RFP-001-2026', category: 'goods', publishedOn: day(-5), closingDate: day(20), summary: 'Supply and delivery of laptops and printers.', details: rich(para(text('Bidders must be registered in Ethiopia.'))), contactEmail: 'procurement@edif.gov.et' } as any })
  await payload.create({ collection: 'tenders', draft: false, ...sys, data: { ...pub, title: 'Annual audit services', slug: 'audit-services', reference: 'RFP-000-2026', category: 'services', publishedOn: day(-60), closingDate: day(-10), summary: 'External audit of the 2025/26 financial statements.' } as any })
}
if (!(await count('vacancies'))) await payload.create({ collection: 'vacancies', draft: false, ...sys, data: { ...pub, title: 'Senior Risk Analyst', slug: 'senior-risk-analyst', department: 'Risk and Compliance', closingDate: day(14), summary: 'Analyse member institution risk and prepare reports.', details: rich(para(text('Bachelor’s degree and five years’ experience.'))), applyEmail: 'hr@edif.gov.et' } as any })
if (!(await count('events'))) await payload.create({ collection: 'events', draft: false, ...sys, data: { ...pub, title: 'Depositor awareness workshop', slug: 'awareness-workshop', startsAt: day(30), venue: 'Addis Ababa', summary: 'A public workshop on how deposit protection works.' } as any })
if (!(await count('notices'))) await payload.create({ collection: 'notices', draft: false, ...sys, data: { ...pub, message: 'Beware of fake messages asking for your bank details. The Fund never asks for passwords.', severity: 'warning', linkLabel: 'Read more', linkUrl: '/faq' } as any })
console.log('demo content ready')
process.exit(0)
