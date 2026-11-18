import type { CollectionConfig } from 'payload'
import { canDelete, canWriteContent, isStaff } from '../access'
import { reviewFields } from '../fields/review'
import { contentHooks } from '../hooks/publishGuard'

/** Site-wide banner for urgent messages (closure, scam warning, payout announcement). A Publisher can switch it on alone, because speed matters. */
export const Notices: CollectionConfig = {
  slug: 'notices',
  labels: { singular: 'Notice banner', plural: 'Notice banners' },
  admin: { group: 'Content', useAsTitle: 'message', defaultColumns: ['message', 'severity', 'expiresAt', '_status'], description: 'A banner across the top of every page. A Publisher can publish it without a second reviewer.' },
  access: { read: isStaff, create: canWriteContent, update: canWriteContent, delete: canDelete, readVersions: isStaff },
  versions: { drafts: { schedulePublish: true }, maxPerDoc: 0 },
  trash: true,
  custom: { selfPublish: true },
  hooks: contentHooks,
  fields: [
    { name: 'message', type: 'text', required: true, maxLength: 220 },
    { name: 'severity', type: 'select', defaultValue: 'info', options: [{ label: 'Information', value: 'info' }, { label: 'Warning', value: 'warning' }, { label: 'Urgent', value: 'urgent' }], admin: { position: 'sidebar' } },
    { name: 'linkLabel', label: 'Link text', type: 'text', admin: { description: 'Optional link text, for example "Read more".' } },
    { name: 'linkUrl', label: 'Link address', type: 'text', admin: { description: 'Where the link goes. Page path (/news/...) or full address.' } },
    { name: 'expiresAt', label: 'Expires', type: 'date', admin: { position: 'sidebar', description: 'Hides itself after this time. Leave blank to keep it until unpublished.', date: { pickerAppearance: 'dayAndTime' } } },
    ...reviewFields,
  ],
}
