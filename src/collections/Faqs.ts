import type { CollectionConfig } from 'payload'
import { canDelete, canWriteContent, isStaff } from '../access'
import { reviewFields } from '../fields/review'
import { contentHooks } from '../hooks/publishGuard'

export const Faqs: CollectionConfig = {
  slug: 'faqs',
  labels: { singular: 'FAQ', plural: 'FAQs' },
  admin: { group: 'Content', useAsTitle: 'question', defaultColumns: ['question', 'category', 'showOnHome', '_status'] },
  access: { read: isStaff, create: canWriteContent, update: canWriteContent, delete: canDelete, readVersions: isStaff },
  versions: { drafts: { schedulePublish: true }, maxPerDoc: 0 },
  trash: true,
  hooks: contentHooks,
  defaultSort: 'sort',
  fields: [
    { name: 'question', type: 'text', required: true },
    { name: 'answer', type: 'textarea', required: true },
    { name: 'category', type: 'select', required: true, options: ['Protection', 'Payout', 'The Fund'], admin: { position: 'sidebar' } },
    { name: 'showOnHome', label: 'Show on home page', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    { name: 'sort', type: 'number', defaultValue: 100, admin: { position: 'sidebar', description: 'Lower numbers appear first.' } },
    ...reviewFields,
  ],
}
