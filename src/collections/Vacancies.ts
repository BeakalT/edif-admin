import type { CollectionConfig } from 'payload'
import { canDelete, canWriteContent, isStaff } from '../access'
import { seoField } from '../fields/seo'
import { reviewFields } from '../fields/review'
import { contentHooks } from '../hooks/publishGuard'

export const Vacancies: CollectionConfig = {
  slug: 'vacancies',
  labels: { singular: 'Vacancy', plural: 'Vacancies' },
  admin: { preview: (doc: any) => `${process.env.SITE_URL || 'http://localhost:3100'}/preview/vacancies/${doc.id}`, group: 'Content', useAsTitle: 'title', defaultColumns: ['title', 'closingDate', '_status'], description: 'Job openings. Closed vacancies drop off the public list automatically.' },
  access: { read: isStaff, create: canWriteContent, update: canWriteContent, delete: canDelete, readVersions: isStaff },
  versions: { drafts: { schedulePublish: true }, maxPerDoc: 0 },
  trash: true,
  hooks: contentHooks,
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true, admin: { position: 'sidebar' } },
    { name: 'department', type: 'text', admin: { position: 'sidebar' } },
    { name: 'location', type: 'text', defaultValue: 'Addis Ababa', admin: { position: 'sidebar' } },
    { name: 'employmentType', type: 'select', defaultValue: 'full', options: [{ label: 'Full time', value: 'full' }, { label: 'Contract', value: 'contract' }, { label: 'Internship', value: 'intern' }], admin: { position: 'sidebar' } },
    { name: 'closingDate', label: 'Closing date', type: 'date', required: true, admin: { position: 'sidebar' } },
    { name: 'summary', type: 'textarea', required: true },
    { name: 'details', type: 'richText' },
    { name: 'document', type: 'upload', relationTo: 'media', label: 'Full announcement (PDF)' },
    { name: 'applyEmail', label: 'Application email', type: 'email', admin: { description: 'Where applications are sent.' } },
    seoField,
    ...reviewFields,
  ],
}
