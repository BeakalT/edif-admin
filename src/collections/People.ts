import type { CollectionConfig } from 'payload'
import { canDelete, canWriteContent, isStaff } from '../access'
import { seoField } from '../fields/seo'
import { reviewFields } from '../fields/review'
import { contentHooks } from '../hooks/publishGuard'

export const People: CollectionConfig = {
  slug: 'people',
  labels: { singular: 'Person', plural: 'People' },
  admin: { group: 'Content', useAsTitle: 'name', defaultColumns: ['name', 'jobTitle', 'group', '_status'], description: 'Board members, management and staff profiles.' },
  access: { read: isStaff, create: canWriteContent, update: canWriteContent, delete: canDelete, readVersions: isStaff },
  versions: { drafts: { schedulePublish: true }, maxPerDoc: 0 },
  trash: true,
  hooks: contentHooks,
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'jobTitle', label: 'Job title', type: 'text', required: true },
    { name: 'group', type: 'select', required: true, defaultValue: 'management', options: [{ label: 'Board of Directors', value: 'board' }, { label: 'Management', value: 'management' }, { label: 'Staff', value: 'staff' }], admin: { position: 'sidebar' } },
    { name: 'sort', type: 'number', defaultValue: 100, admin: { position: 'sidebar', description: 'Lower numbers appear first.' } },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    { name: 'bio', type: 'richText' },
    ...reviewFields,
  ],
}
