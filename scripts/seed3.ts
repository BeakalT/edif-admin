// Turns the coded Home and About pages into editable pages (idempotent: skips paths that already exist).
import { getPayload } from 'payload'
import fs from 'fs'
import path from 'path'
import config from '../src/payload.config'
import { benefits, boardSeats, covered, exclusions, functions, mainExclusions, objectives, payoutSteps, sources, strategicObjectives, themes, uses, values, yearStats } from '../src/site/data/content'

const payload = await getPayload({ config })
const IMG = process.env.IMG_DIR || '/home/claude/edif-site/public/images'
const sys = { overrideAccess: true as const, context: { seeding: true } }
const L = (a: string[]) => a.map((text) => ({ text }))
const mediaId: Record<string, number> = {}
const up = async (file: string, alt = '') => {
  if (mediaId[file]) return mediaId[file]
  const ex = await payload.find({ collection: 'media', where: { filename: { equals: file } }, ...sys })
  if (ex.docs[0]) return (mediaId[file] = ex.docs[0].id as number)
  const buf = fs.readFileSync(path.join(IMG, file))
  const mime = file.endsWith('.png') ? 'image/png' : file.endsWith('.svg') ? 'image/svg+xml' : 'image/jpeg'
  const m = await payload.create({ collection: 'media', data: { alt }, file: { data: buf, mimetype: mime, name: file, size: buf.length }, ...sys })
  return (mediaId[file] = m.id as number)
}
const S = (background: string, head: any, parts: any[], extra: any = {}) => ({ blockType: 'section', head: { center: true, ...head }, parts, section: { background, spacing: 'normal' }, ...extra })
const crumb = { crumbLabel: 'About', crumbUrl: '/about' }
const about = (t: string) => ({ ...crumb, subnav: 'about', ...({} as any), eyebrow: t })

const pages: Record<string, { title: string; layout: () => Promise<any[]> }> = {
  '/': { title: 'Home', layout: async () => [
    { blockType: 'homeHero', title: 'Ethiopian Deposit Insurance Fund', tagline: 'Your savings, protected.', image: await up('hallL.jpg'),
      intro: 'If a licensed bank or microfinance institution in Ethiopia fails, EDIF repays each depositor up to Birr 100,000. Protection is automatic: you don’t register for it and you don’t pay for it.',
      partners: L(['Accountable to the National Bank of Ethiopia', 'Regulation No. 482/2021', 'Operating since 2023']),
      buttons: [{ label: 'Check your coverage', url: '/deposit-protection/calculator', style: 'gold' }, { label: 'Find your bank', url: '/members', style: 'outline-light' }],
      ledger: [
        { mode: 'number', value: 97, suffix: '%', tag: 'Depositors', title: 'Fully covered', text: 'About 171 million of 176 million depositors hold balances within the limit.' },
        { mode: 'number', value: 100000, prefix: 'Birr', tag: 'Coverage', title: 'Per depositor', text: 'At each member bank or microfinance institution, separately.' },
        { mode: 'members', tag: 'Members', title: 'Licensed institutions', text: '{banks} banks and {mfis} microfinance institutions, all covered by law.' },
      ] },
    S('ice', {}, [{ blockType: 'splitText', image: await up('stage.jpg', 'Speaker at EDIF’s deposit insurance awareness and dialogue conference, Addis Ababa, March 2024'), eyebrow: 'About EDIF', title: 'Ethiopia’s', em: 'safety net for every depositor',
      paragraphs: L(['EDIF was established under Council of Ministers Regulation No. 482/2021 and began operating in April 2023. It is accountable to the National Bank of Ethiopia, reports to Parliament, and is audited externally every year.', 'A bank run starts with a rumour and a queue at the door. Deposit insurance removes the reason to run: small depositors know their money is safe, the financial system stays steady, and the cost of a failure is carried by the institutions that pay premiums, not by taxpayers.']),
      buttons: [{ label: 'About the Fund', url: '/about', style: 'navy' }, { label: 'Governance', url: '/about/governance', style: 'link' }] }], { section: { anchor: 'about', background: 'ice', spacing: 'normal' } }),
    S('ice', { eyebrow: 'Deposit protection', title: 'What your deposit insurance', em: 'covers', lead: 'The everyday accounts most people hold are covered. A few kinds of deposit are excluded by law.' }, [
      { blockType: 'crowd', photo: await up('workshop.jpg'), number: 176, suffix: 'M', kicker: 'Depositors in Ethiopia', text: 'About 97% of them, 171 million people, are fully covered up to Birr 100,000.' },
      { blockType: 'rules', limit: 100000, currency: 'Birr', label: 'Coverage limit', desc: 'The most the Fund repays to one depositor at one institution.', rules: [{ title: 'Each institution', text: 'Accounts at different banks or MFIs are protected separately.' }, { title: 'Added together', text: 'All your accounts at the same institution are combined, including interest.' }] },
      { blockType: 'compare', coveredTitle: 'Covered', coveredSub: 'Eligible deposits at any member bank or microfinance institution.', covered: L(covered),
        interestTitle: 'Interest-free deposits are covered on the same terms.', interestText: 'Their premiums are kept in a separate account and invested in line with Sharia principles.', interestLabel: 'Interest-free coverage', interestUrl: '/deposit-protection/coverage#interest-free',
        notTitle: 'Not covered', notSub: 'The main exclusions under Regulation No. 482/2021.', main: mainExclusions.map((x) => ({ title: x.t, text: x.d })), all: L(exclusions), seeAll: 'See all {n} exclusions' },
      { blockType: 'ticker', title: 'Is your bank a member?', text: 'Every bank and microfinance institution licensed in Ethiopia is a member of the Fund.', linkLabel: 'Find your bank', linkUrl: '/members' },
    ], { section: { anchor: 'covered', background: 'ice', spacing: 'normal' } }),
    S('default', {}, [{ blockType: 'calcSection', eyebrow: 'Coverage calculator', title: 'How much of your money is', em: 'protected?', lead: 'Enter each account you hold. Accounts at the same institution are added together, and each institution is protected separately, up to Birr 100,000.',
      steps: [{ title: 'Choose the institution', text: 'that holds the account.' }, { title: 'Enter the balance', text: 'in Birr, including interest. Convert foreign currency to Birr first.' }, { title: 'Add every account,', text: 'including several at the same institution.' }],
      autoStrong: 'Protection is automatic.', autoText: 'You don’t need to apply, register or pay anything.', linkLabel: 'How coverage works', linkUrl: '/deposit-protection' }], { section: { anchor: 'estimate', background: 'default', spacing: 'normal' } }),
    S('ice', { eyebrow: 'Deposit payout', title: 'If an institution fails,', em: 'this is what happens', lead: 'The timetable is set by Council of Ministers Regulation No. 482/2021. The failed institution’s own records are used to work out what each depositor is owed.' }, [
      { blockType: 'steps', steps: payoutSteps.map((s) => ({ day: s.day, title: s.t, text: s.d })), lateStrong: 'Missed the 90 days?', lateText: 'You can still claim for up to five years by giving a justifiable reason for the delay.', linkLabel: 'Full payout process', linkUrl: '/deposit-protection/payout' }], { section: { anchor: 'payout', background: 'ice', spacing: 'normal' } }),
    { blockType: 'news', heading: 'Latest from the Fund', count: 3, section: { anchor: 'news', background: 'default', spacing: 'normal' } },
    { blockType: 'publications', heading: 'Official documents', count: 3, section: { anchor: 'publications', background: 'ice', spacing: 'normal' } },
    S('default', {}, [{ blockType: 'faqSplit', eyebrow: 'Questions', title: 'What depositors', em: 'ask us most', lead: 'Short answers to the questions we hear most. The full list is one click away.', helpKicker: 'Still have a question?', helpTitle: 'Speak to the Fund', ctaLabel: 'Contact the Fund', ctaUrl: '/contact', moreLabel: 'All questions and answers', moreUrl: '/faq' }], { section: { anchor: 'faq', background: 'default', spacing: 'normal' } }),
  ] },
}
void sources; void about; void benefits; void functions; void objectives; void strategicObjectives; void themes; void uses; void values; void yearStats; void boardSeats

// About family is added in seed3b (kept in a separate file so each stays readable).
const extra = await import('./seed3-about').then((m) => m.build({ L, up, S, crumb })).catch(() => ({}))
Object.assign(pages, extra)
const prot = await import('./seed3-protect').then((m) => m.build({ L, up, S }))
Object.assign(pages, prot)

for (const [p, def] of Object.entries(pages)) {
  const ex = await payload.find({ collection: 'pages', where: { path: { equals: p } }, limit: 1, ...sys })
  if (ex.docs[0]) { console.log('skip', p); continue }
  await payload.create({ collection: 'pages', draft: false, ...sys, data: { title: def.title, path: p, layout: await def.layout(), _status: 'published' } as any })
  console.log('created', p)
}
process.exit(0)
