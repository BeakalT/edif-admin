import type { CollectionConfig } from 'payload'
import { canDelete, canWriteContent, isStaff } from '../access'
import { reviewFields } from '../fields/review'
import { contentHooks } from '../hooks/publishGuard'
import { listEndpoints } from '../lib/endpoints'

export const Members: CollectionConfig = {
  slug: 'members',
  labels: { singular: 'Member institution', plural: 'Member institutions' },
  admin: { components: { beforeListTable: ['/components/admin/ImportBar#ImportBar'] }, group: 'Content', useAsTitle: 'name', defaultColumns: ['name', 'type', 'location', '_status'] },
  access: { read: isStaff, create: canWriteContent, update: canWriteContent, delete: canDelete, readVersions: isStaff },
  versions: { drafts: { schedulePublish: true }, maxPerDoc: 0 },
  trash: true,
  hooks: contentHooks,
  defaultSort: 'name',
  endpoints: listEndpoints('members', ['name', 'type', 'phone', 'email', 'website', 'location'], ['name', 'type'],
    (r) => (!r.name ? 'name is empty' : !['bank', 'microfinance'].includes(r.type) ? 'type must be bank or microfinance' : r.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r.email) ? 'email is not valid' : null),
    (r) => ({ name: r.name, type: r.type, phone: r.phone, email: r.email || undefined, website: r.website, location: r.location })),
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'type', type: 'select', required: true, options: [{ label: 'Bank', value: 'bank' }, { label: 'Microfinance institution', value: 'microfinance' }], admin: { position: 'sidebar' } },
    { name: 'phone', type: 'text' },
    { name: 'email', type: 'email' },
    { name: 'website', type: 'text' },
    { name: 'location', type: 'text' },
    ...reviewFields,
  ],
}
