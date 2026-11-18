import type { Block, Field } from 'payload'
import { validateLink } from '../lib/safeUrl'

const t = (name: string, extra: Record<string, unknown> = {}): Field => ({ name, type: 'text', ...extra }) as Field
const ta = (name: string, extra: Record<string, unknown> = {}): Field => ({ name, type: 'textarea', ...extra }) as Field
const lines = (name: string, label: string): Field => ({ name, type: 'array', label, fields: [{ name: 'text', type: 'textarea', required: true }] })
const btns = (name = 'buttons'): Field => ({ name, type: 'array', label: 'Buttons and links', maxRows: 4, fields: [
  { name: 'label', type: 'text', required: true },
  { name: 'url', type: 'text', required: true, validate: validateLink, admin: { description: 'Page path such as /members, or a full web address.' } },
  { name: 'style', type: 'select', defaultValue: 'navy', options: [{ label: 'Gold button', value: 'gold' }, { label: 'Navy button', value: 'navy' }, { label: 'Outline (on dark)', value: 'outline-light' }, { label: 'Text link', value: 'link' }] },
] })
const image = (name = 'image'): Field => ({ name, type: 'upload', relationTo: 'media' })
const link = (p: string): Field[] => [t(p + 'Label'), t(p + 'Url', { validate: validateLink })]

export const homeHero: Block = { slug: 'homeHero', labels: { singular: 'Home page hero', plural: 'Home page heroes' }, fields: [
  t('title', { required: true }), t('tagline'), ta('intro'), image(), { ...lines('partners', 'Lines under the intro'), labels: { singular: 'Badge', plural: 'Badges' } } as Field, btns(),
  { name: 'ledger', type: 'array', label: 'Counters', maxRows: 4, admin: { description: 'The animated numbers. In text use {banks}, {mfis} and {total} for live member counts.' }, fields: [
    { name: 'mode', type: 'select', defaultValue: 'number', options: [{ label: 'Fixed number', value: 'number' }, { label: 'Live count of member institutions', value: 'members' }] },
    { name: 'value', type: 'number' }, t('prefix', { admin: { description: 'Small text before the number, e.g. Birr' } }), t('suffix', { admin: { description: 'e.g. %' } }),
    t('tag'), t('title'), ta('text'),
  ] },
] }

export const pageHero: Block = { slug: 'pageHero', labels: { singular: 'Page banner', plural: 'Page banners' }, fields: [
  t('eyebrow', { required: true }), t('title', { required: true }), t('tagline'), ta('lead'), image(),
  t('pos', { label: 'Image focus (CSS, e.g. 50% 30%)' }), ...link('crumb'),
  { name: 'memberCounts', type: 'checkbox', label: 'Show live member counts in the banner', defaultValue: false },
  { name: 'subnav', type: 'select', defaultValue: 'none', options: [{ label: 'None', value: 'none' }, { label: 'About menu', value: 'about' }, { label: 'Deposit protection menu', value: 'protection' }] },
] }

export const nextLinks: Block = { slug: 'nextLinks', labels: { singular: 'Keep reading links', plural: 'Keep reading links' }, fields: [
  { name: 'items', type: 'array', maxRows: 4, fields: [t('url', { required: true }), t('kicker'), t('title', { required: true }), ta('text')] },
] }

export const band: Block = { slug: 'band', labels: { singular: 'Dark band', plural: 'Dark bands' }, fields: [
  t('eyebrow'), t('title', { required: true }), lines('paragraphs', 'Paragraphs'),
  { name: 'showContact', type: 'checkbox', label: 'Show the Fund’s email and phone', defaultValue: false },
  { name: 'button', type: 'group', fields: [t('label'), t('url')] },
  { name: 'curves', type: 'checkbox', label: 'Decorative curves', defaultValue: true },
] }

/* ---------- parts that live inside a Section ---------- */
export const parts: Block[] = [
  { slug: 'splitText', labels: { singular: 'Photo and text', plural: 'Photo and text' }, fields: [image(), t('eyebrow'), t('title'), t('em', { label: 'Highlighted words in the title' }), lines('paragraphs', 'Paragraphs'), lines('bullets', 'Bullet points'), btns()] },
  { slug: 'visionMission', labels: { singular: 'Vision, mission and values panels', plural: 'Vision panels' }, fields: [
    { name: 'items', type: 'array', maxRows: 3, fields: [t('eyebrow', { required: true }), ta('big', { label: 'Large statement' }), ta('text'), lines('bullets', 'List')] },
  ] },
  { slug: 'pcards', labels: { singular: 'Cards (plain or numbered)', plural: 'Cards' }, fields: [
    { name: 'numbered', type: 'checkbox', label: 'Show numbers instead of small labels', defaultValue: false },
    { name: 'items', type: 'array', fields: [t('kicker'), t('title', { required: true }), ta('text')] },
  ] },
  { slug: 'iCards', labels: { singular: 'Icon cards (three columns)', plural: 'Icon cards' }, fields: [
    { name: 'numbered', type: 'checkbox', label: 'Show numbers', defaultValue: false },
    { name: 'darkMiddle', type: 'checkbox', label: 'Dark middle card', defaultValue: false },
    { name: 'items', type: 'array', fields: [t('title', { required: true }), ta('text')] }, btns(),
  ] },
  { slug: 'numberedList', labels: { singular: 'Title with numbered list', plural: 'Numbered lists' }, fields: [
    { name: 'variant', type: 'select', defaultValue: 'fns', options: [{ label: 'Numbered functions', value: 'fns' }, { label: 'Chain of steps', value: 'chain' }, { label: 'Grid of objectives (no title)', value: 'grid' }, { label: 'Bullet list', value: 'uses' }] },
    t('eyebrow'), t('title'), t('em'), ta('lead'), ta('text'), lines('items', 'List items'),
  ] },
  { slug: 'statGrid', labels: { singular: 'Numbers grid', plural: 'Numbers grids' }, fields: [
    { name: 'columns', type: 'select', defaultValue: '6', options: ['6', '4'] },
    { name: 'items', type: 'array', fields: [t('prefix'), t('value', { admin: { description: 'e.g. 97% or 7.34bn' } }), t('label'), ta('text'), t('figure', { label: 'Or use a Key figure (its key)', admin: { description: 'If set, the number and label come from Key figures, so they stay in sync.' } })] },
    btns(),
  ] },
  { slug: 'orgChart', labels: { singular: 'Organisation chart', plural: 'Organisation charts' }, fields: [
    t('board', { required: true }), t('side'), lines('chain', 'Reporting chain, top to bottom'),
    { name: 'branches', type: 'array', fields: [t('directorate', { required: true }), lines('teams', 'Teams')] },
  ] },
  { slug: 'board', labels: { singular: 'Board of Directors', plural: 'Board' }, fields: [
    { name: 'group', type: 'select', defaultValue: 'board', options: [{ label: 'Board of Directors', value: 'board' }, { label: 'Management', value: 'management' }] },
    t('seatsTitle'), lines('seats', 'Seats'), ta('note'),
  ] },
  { slug: 'profiles', labels: { singular: 'People profiles', plural: 'People profiles' }, fields: [
    { name: 'group', type: 'select', defaultValue: 'management', options: [{ label: 'Board of Directors', value: 'board' }, { label: 'Management', value: 'management' }, { label: 'Staff', value: 'staff' }] },
  ] },
  { slug: 'crowd', labels: { singular: 'Big number with photo', plural: 'Big numbers' }, fields: [image('photo'), { name: 'number', type: 'number', required: true }, t('suffix'), t('kicker'), ta('text')] },
  { slug: 'rules', labels: { singular: 'Coverage limit panel', plural: 'Coverage limit panels' }, fields: [
    { name: 'limit', type: 'number', required: true }, t('currency', { defaultValue: 'Birr' }), t('label'), t('desc'),
    { name: 'rules', type: 'array', maxRows: 4, fields: [t('title', { required: true }), ta('text')] },
  ] },
  { slug: 'compare', labels: { singular: 'Covered / not covered', plural: 'Covered / not covered' }, fields: [
    { name: 'full', type: 'checkbox', label: 'Show the full exclusion list opened', defaultValue: false },
    t('coveredTitle'), ta('coveredSub'), lines('covered', 'Covered items'), t('interestTitle'), ta('interestText'), ...link('interest'),
    t('notTitle'), ta('notSub'),
    { name: 'main', type: 'array', label: 'Main exclusions', fields: [t('title', { required: true }), ta('text')] },
    lines('all', 'All exclusions'), t('seeAll', { admin: { description: 'Use {n} for the number of exclusions.' } }),
  ] },
  { slug: 'ticker', labels: { singular: 'Member names ticker', plural: 'Member tickers' }, fields: [t('title'), ta('text'), ...link('link')] },
  { slug: 'steps', labels: { singular: 'Payout timeline', plural: 'Payout timelines' }, fields: [
    { name: 'steps', type: 'array', fields: [t('day'), t('title', { required: true }), ta('text')] },
    t('lateStrong'), ta('lateText'), ...link('link'),
  ] },
  { slug: 'calcSection', labels: { singular: 'Coverage calculator', plural: 'Calculators' }, fields: [
    t('eyebrow'), t('title'), t('em'), ta('lead'),
    { name: 'steps', type: 'array', fields: [t('title', { required: true }), ta('text')] },
    t('autoStrong'), ta('autoText'), ...link('link'), t('source', { label: 'Small note under the steps' }),
  ] },
  { slug: 'linkCards', labels: { singular: 'Link cards with icons', plural: 'Link cards' }, fields: [
    { name: 'items', type: 'array', fields: [
      { name: 'icon', type: 'select', defaultValue: 'none', options: ['none', 'check', 'calc', 'clock', 'bank', 'shield'] },
      t('title', { required: true }), ta('text'), t('linkLabel'), t('url'), { name: 'dark', type: 'checkbox', label: 'Dark highlight card', defaultValue: false },
    ] },
  ] },
  { slug: 'typeCards', labels: { singular: 'Tick cards', plural: 'Tick cards' }, fields: [{ name: 'items', type: 'array', fields: [t('title', { required: true }), ta('text')] }] },
  { slug: 'exclPanel', labels: { singular: 'Numbered list panel (dark)', plural: 'Numbered list panels' }, fields: [lines('items', 'Items')] },
  { slug: 'worked', labels: { singular: 'Worked examples', plural: 'Worked examples' }, fields: [
    { name: 'items', type: 'array', fields: [
      t('title', { required: true }),
      { name: 'rows', type: 'array', fields: [t('label'), { name: 'amount', type: 'number' }] },
      { name: 'protectedAmount', type: 'number', label: 'Protected (Birr)' }, { name: 'notProtected', type: 'number', label: 'Not protected (Birr)' }, ta('note'),
    ] },
  ] },
  { slug: 'faqPart', labels: { singular: 'Questions and answers', plural: 'Questions and answers' }, fields: [
    { name: 'category', type: 'select', options: ['Protection', 'Payout', 'The Fund'], admin: { description: 'Shows the first questions of this group. Leave empty to use the list below.' } },
    { name: 'count', type: 'number', defaultValue: 4, min: 1, max: 20 }, lines('questions', 'Or pick questions by their exact wording'), t('moreLabel'), t('moreUrl'),
  ] },
  { slug: 'premiumCards', labels: { singular: 'Premium cards', plural: 'Premium cards' }, fields: [
    { name: 'items', type: 'array', fields: [t('kicker'), t('big'), ta('text'), { name: 'separate', type: 'checkbox', label: 'Highlighted (text instead of number)', defaultValue: false }] },
  ] },
  { slug: 'memberDirectory', labels: { singular: 'Member directory (search and list)', plural: 'Member directory' }, fields: [ta('source', { label: 'Source note under the list' })] },
  { slug: 'ledeSplit', labels: { singular: 'Title with side content', plural: 'Title with side content' }, fields: [
    t('eyebrow'), t('title'), t('em'), ta('lead'), ta('text'), { name: 'sticky', type: 'checkbox', label: 'Keep title in view while scrolling', defaultValue: false }, btns(),
    { name: 'calloutSide', type: 'select', defaultValue: 'right', options: [{ label: 'Note under the title', value: 'left' }, { label: 'Note under the side content', value: 'right' }] },
    { name: 'calloutIcon', type: 'select', defaultValue: 'shield', options: ['shield', 'bank', 'check', 'calc', 'clock'] }, t('calloutStrong', { label: 'Note, bold part' }), ta('calloutText', { label: 'Note, rest of text' }),
    { name: 'right', type: 'select', defaultValue: 'rules', label: 'Content on the right', options: [{ label: 'Coverage limit panel', value: 'rules' }, { label: 'Small number cards', value: 'miniStats' }, { label: 'Timeline', value: 'timeline' }, { label: 'Live member counts', value: 'memberCounts' }, { label: 'Member documents (from Publications)', value: 'memberDocs' }, { label: 'Nothing', value: 'none' }] },
    { name: 'rulesLimit', type: 'number', admin: { condition: (_: unknown, s: any) => s?.right === 'rules' } }, { name: 'rulesCurrency', type: 'text', defaultValue: 'Birr', admin: { condition: (_: unknown, s: any) => s?.right === 'rules' } }, { name: 'rulesLabel', type: 'text', admin: { condition: (_: unknown, s: any) => s?.right === 'rules' } }, { name: 'rulesDesc', type: 'textarea', admin: { condition: (_: unknown, s: any) => s?.right === 'rules' } },
    { name: 'rules', type: 'array', maxRows: 4, admin: { condition: (_: unknown, s: any) => s?.right === 'rules' }, fields: [t('title', { required: true }), ta('text')] },
    { name: 'miniStats', type: 'array', admin: { condition: (_: unknown, s: any) => s?.right === 'miniStats' }, fields: [t('prefix'), t('value'), t('label'), ta('text')] },
    { name: 'timeline', type: 'array', admin: { condition: (_: unknown, s: any) => s?.right === 'timeline' }, fields: [t('kicker'), t('title', { required: true }), ta('text')] },
  ] },
  { slug: 'faqSplit', labels: { singular: 'Questions with help box', plural: 'Questions with help box' }, fields: [
    t('eyebrow'), t('title'), t('em'), ta('lead'), t('helpKicker'), t('helpTitle'), ...link('cta'), ...link('more'),
  ] },
]

export const withLabel = (b: Block): Block => ({ ...b, imageURL: `/admin-blocks/${b.slug}.svg`, imageAltText: `${b.labels?.singular ?? b.slug} section layout`, admin: { ...(b.admin || {}), components: { Label: '/components/admin/BlockRowLabel#default' } } })

export const sectionBlock = (sectionFields: Field[]): Block => ({
  slug: 'section', labels: { singular: 'Designed section', plural: 'Designed sections' },
  fields: [
    { name: 'head', type: 'group', label: 'Section heading (optional)', fields: [t('eyebrow'), t('title'), t('em', { label: 'Highlighted words' }), ta('lead'), { name: 'center', type: 'checkbox', defaultValue: true, label: 'Centre the heading' }] },
    { name: 'flush', type: 'checkbox', label: 'No top and bottom padding (for panels that sit between sections)', defaultValue: false },
    { name: 'parts', type: 'blocks', label: 'Content in this section', blocks: parts.map(withLabel) },
    ...sectionFields,
  ],
})
