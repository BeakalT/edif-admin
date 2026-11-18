import type { Block, Field, FieldAccess } from 'payload'
import { hasRole } from '../access'
import { validateLink } from '../lib/safeUrl'
import { band, homeHero, nextLinks, pageHero, sectionBlock, withLabel } from './design'

/** Settings every section has: where links can jump to it, its background, spacing, and a switch to hide it without deleting it. */
export const sectionFields: Field[] = [
  { name: 'section', type: 'group', label: 'Section settings', admin: { description: 'Optional. Anchor, background, spacing and visibility.' }, fields: [
    { type: 'row', fields: [
      { name: 'anchor', type: 'text', label: 'Anchor (for links like /page#anchor)', validate: (v: unknown) => (!v || (typeof v === 'string' && /^[a-z][a-z0-9-]{0,39}$/.test(v)) ? true : 'Lowercase letters, numbers and hyphens, starting with a letter.') },
      { name: 'background', type: 'select', defaultValue: 'default', options: [{ label: 'Default for this section', value: 'default' }, { label: 'White', value: 'white' }, { label: 'Light blue', value: 'ice' }, { label: 'Cream', value: 'cream' }, { label: 'Dark blue', value: 'navy' }] },
      { name: 'spacing', type: 'select', defaultValue: 'normal', options: [{ label: 'Compact', value: 'compact' }, { label: 'Normal', value: 'normal' }, { label: 'Roomy', value: 'roomy' }] },
    ] },
    { name: 'hidden', type: 'checkbox', label: 'Hide this section (keeps it, visitors do not see it)', defaultValue: false },
  ] },
]
// both: without `create`, Payload accepts these fields from any role on a new page
const superAdminField: FieldAccess = ({ req }) => hasRole(req.user, 'admin')
const superAdminOnly = { create: superAdminField, update: superAdminField }

const link = [
  { name: 'label', type: 'text', required: true },
  { name: 'url', type: 'text', required: true, validate: validateLink, admin: { description: 'Page path such as /about/governance, or a full web address.' } },
] as const

const base: Block[] = [
  { slug: 'hero', labels: { singular: 'Page heading', plural: 'Page headings' }, fields: [
    { name: 'eyebrow', type: 'text' }, { name: 'title', type: 'text', required: true }, { name: 'intro', type: 'textarea' },
  ] },
  { slug: 'richText', labels: { singular: 'Text', plural: 'Text sections' }, fields: [
    { name: 'heading', type: 'text' }, { name: 'content', type: 'richText', required: true },
  ] },
  { slug: 'cards', labels: { singular: 'Cards', plural: 'Card grids' }, fields: [
    { name: 'heading', type: 'text' },
    { name: 'columns', type: 'select', defaultValue: '3', options: ['2', '3', '4'] },
    { name: 'items', type: 'array', minRows: 1, fields: [{ name: 'title', type: 'text', required: true }, { name: 'text', type: 'textarea' }, { name: 'image', type: 'upload', relationTo: 'media' }, { name: 'linkLabel', type: 'text' }, { name: 'linkUrl', type: 'text', validate: validateLink }] },
  ] },
  { slug: 'figures', labels: { singular: 'Key figures', plural: 'Key figure rows' }, fields: [
    { name: 'heading', type: 'text' },
    { name: 'items', type: 'relationship', relationTo: 'key-figures', hasMany: true, required: true, admin: { description: 'Each figure shows its own source and date.' } },
  ] },
  { slug: 'faqs', labels: { singular: 'Questions and answers', plural: 'FAQ lists' }, fields: [
    { name: 'heading', type: 'text' }, { name: 'category', type: 'select', options: ['Protection', 'Payout', 'The Fund'], admin: { description: 'Leave empty to show all.' } },
  ] },
  { slug: 'news', labels: { singular: 'Latest news', plural: 'Latest news lists' }, fields: [
    { name: 'heading', type: 'text', defaultValue: 'Latest news' }, { name: 'count', type: 'number', defaultValue: 3, min: 1, max: 12 },
  ] },
  { slug: 'publications', labels: { singular: 'Publications', plural: 'Publication lists' }, fields: [
    { name: 'heading', type: 'text' }, { name: 'kind', type: 'text', admin: { description: 'Optional: show only one kind, for example report.' } }, { name: 'count', type: 'number', defaultValue: 6, min: 1, max: 30 },
  ] },
  { slug: 'people', labels: { singular: 'People', plural: 'People grids' }, fields: [
    { name: 'heading', type: 'text' }, { name: 'group', type: 'select', required: true, options: [{ label: 'Board of Directors', value: 'board' }, { label: 'Management', value: 'management' }, { label: 'Staff', value: 'staff' }] },
  ] },
  { slug: 'gallery', labels: { singular: 'Photo gallery', plural: 'Photo galleries' }, fields: [
    { name: 'heading', type: 'text' },
    { name: 'images', type: 'array', minRows: 1, fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }, { name: 'caption', type: 'text' }] },
  ] },
  { slug: 'video', labels: { singular: 'Video', plural: 'Videos' }, fields: [
    { name: 'heading', type: 'text' },
    { name: 'url', type: 'text', required: true, admin: { description: 'A YouTube or Vimeo address. Other sites are not allowed.' },
      validate: (v: unknown) => (typeof v === 'string' && /^https:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|vimeo\.com\/)[\w-]+/i.test(v) ? true : 'Use a YouTube or Vimeo link.') },
    { name: 'caption', type: 'text' },
  ] },
  { slug: 'downloads', labels: { singular: 'Downloads', plural: 'Download lists' }, fields: [
    { name: 'heading', type: 'text' },
    { name: 'files', type: 'array', minRows: 1, fields: [{ name: 'label', type: 'text', required: true }, { name: 'file', type: 'upload', relationTo: 'media', required: true }] },
  ] },
  { slug: 'callout', labels: { singular: 'Highlighted note', plural: 'Highlighted notes' }, fields: [
    { name: 'tone', type: 'select', defaultValue: 'info', options: [{ label: 'Information', value: 'info' }, { label: 'Important', value: 'important' }] },
    { name: 'title', type: 'text' }, { name: 'text', type: 'textarea', required: true },
  ] },
  { slug: 'cta', labels: { singular: 'Call to action', plural: 'Calls to action' }, fields: [
    { name: 'title', type: 'text', required: true }, { name: 'text', type: 'textarea' }, ...link,
  ] },
  { slug: 'table', labels: { singular: 'Table', plural: 'Tables' }, fields: [
    { name: 'heading', type: 'text' },
    { name: 'columns', type: 'array', minRows: 1, fields: [{ name: 'label', type: 'text', required: true }] },
    { name: 'rows', type: 'array', fields: [{ name: 'cells', type: 'array', fields: [{ name: 'text', type: 'text' }] }] },
  ] },
]

export const customBlock: Block = {
  slug: 'custom', labels: { singular: 'Custom HTML and CSS', plural: 'Custom sections' },
  fields: [
    { name: 'label', type: 'text', admin: { description: 'A name so editors recognise this section. Not shown to visitors.' } },
    { name: 'html', type: 'code', label: 'HTML', admin: { language: 'html', description: 'Super Admin only. Allowed: headings, paragraphs, lists, links, images, tables, simple containers. Scripts, frames, forms, inline styles and event handlers are removed automatically.' }, access: superAdminOnly },
    { name: 'css', type: 'code', label: 'CSS', admin: { language: 'css', description: 'Super Admin only. Applies to this section only. Fixed positioning, external files and imports are removed automatically.' }, access: superAdminOnly },
  ],
}

export const blocks: Block[] = [homeHero, pageHero, band, sectionBlock([]), nextLinks, ...base, customBlock].map((b) => withLabel({ ...b, fields: [...b.fields, ...sectionFields] }))
