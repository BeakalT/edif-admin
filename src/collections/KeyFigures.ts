import type { CollectionConfig } from 'payload'
import { canDelete, canWriteContent, isStaff } from '../access'
import { seoField } from '../fields/seo'
import { reviewFields } from '../fields/review'
import { contentHooks } from '../hooks/publishGuard'

export const KeyFigures: CollectionConfig = {
  slug: 'key-figures',
  labels: { singular: 'Key figure', plural: 'Key figures' },
  admin: { group: 'Content', useAsTitle: 'label', defaultColumns: ['label', 'value', 'asOf', '_status'], description: 'Headline numbers (coverage limit, depositors, premiums). Always needs a second person approving it, and always shows its source and date.' },
  access: { read: isStaff, create: canWriteContent, update: canWriteContent, delete: canDelete, readVersions: isStaff },
  versions: { drafts: { schedulePublish: true }, maxPerDoc: 0 },
  trash: true,
  hooks: contentHooks,
  fields: [
    { name: 'label', type: 'text', required: true },
    { name: 'key', type: 'text', required: true, unique: true, index: true, admin: { position: 'sidebar', description: 'Short unique code used by pages, for example depositors-total.' } },
    { type: 'row', fields: [{ name: 'value', type: 'text', required: true, admin: { description: 'As shown, for example 176 million or Birr 100,000.' } }, { name: 'numeric', type: 'number', admin: { description: 'Number used for the count-up animation (optional).' } }] },
    { name: 'note', type: 'text', admin: { description: 'One line of context under the number.' } },
    { name: 'source', type: 'text', required: true, admin: { description: 'Where the number comes from, for example NBE Annual Report 2024/25.' } },
    { name: 'asOf', type: 'date', required: true, label: 'As of', admin: { date: { pickerAppearance: 'dayOnly' } } },
    ...reviewFields,
  ],
}
