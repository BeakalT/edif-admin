import type { CollectionConfig } from 'payload'
import { canDelete, canWriteContent, isStaff } from '../access'
import { seoField } from '../fields/seo'
import { reviewFields } from '../fields/review'
import { contentHooks } from '../hooks/publishGuard'

export const Tenders: CollectionConfig = {
  slug: 'tenders',
  labels: { singular: 'Tender', plural: 'Tenders' },
  admin: { preview: (doc: any) => `${process.env.SITE_URL || 'http://localhost:3100'}/preview/tenders/${doc.id}`, group: 'Content', useAsTitle: 'title', defaultColumns: ['title', 'closingDate', '_status'], description: 'Procurement notices, with closing dates. Closed tenders move to the archive automatically.' },
  access: { read: isStaff, create: canWriteContent, update: canWriteContent, delete: canDelete, readVersions: isStaff },
  versions: { drafts: { schedulePublish: true }, maxPerDoc: 0 },
  trash: true,
  hooks: contentHooks,
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true, admin: { position: 'sidebar' } },
    { name: 'reference', type: 'text', admin: { position: 'sidebar', description: 'Tender number, for example RFP-004-2026.' } },
    { name: 'category', type: 'select', defaultValue: 'goods', options: [{ label: 'Goods', value: 'goods' }, { label: 'Services', value: 'services' }, { label: 'Works', value: 'works' }, { label: 'Consultancy', value: 'consultancy' }], admin: { position: 'sidebar' } },
    { name: 'publishedOn', label: 'Published on', type: 'date', admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly' } } },
    { name: 'closingDate', label: 'Closing date', type: 'date', required: true, admin: { position: 'sidebar', description: 'After this moment the tender shows as closed.' } },
    { name: 'summary', type: 'textarea', required: true },
    { name: 'details', type: 'richText' },
    { name: 'documents', type: 'array', fields: [{ name: 'label', type: 'text', required: true }, { name: 'file', type: 'upload', relationTo: 'media', required: true }] },
    { name: 'contactEmail', label: 'Contact email', type: 'email' },
    seoField,
    ...reviewFields,
  ],
}
