import type { CollectionConfig } from 'payload'
import { canDelete, canWriteContent, isStaff } from '../access'
import { reviewFields } from '../fields/review'
import { contentHooks } from '../hooks/publishGuard'
import { listEndpoints } from '../lib/endpoints'
import { validateLink } from '../lib/safeUrl'

export const Publications: CollectionConfig = {
  slug: 'publications',
  admin: { components: { beforeListTable: ['/components/admin/ImportBar#ImportBar'] }, group: 'Content', useAsTitle: 'title', defaultColumns: ['title', 'kind', 'date', 'featured', '_status'], description: 'Reports, laws, regulations and directives. Upload the PDF and set the date; the site sorts them.' },
  access: { read: isStaff, create: canWriteContent, update: canWriteContent, delete: canDelete, readVersions: isStaff },
  versions: { drafts: { schedulePublish: true }, maxPerDoc: 0 },
  trash: true,
  hooks: contentHooks,
  endpoints: listEndpoints('publications', ['title', 'kind', 'date', 'description', 'externalUrl'], ['title', 'kind', 'date'],
    (r) => (!r.title ? 'title is empty' : !['Report', 'Law', 'Regulation', 'Directive', 'Reporting'].includes(r.kind) ? 'kind must be Report, Law, Regulation, Directive or Reporting' : isNaN(Date.parse(r.date)) ? 'date must look like 2025-07-01' : r.externalUrl && !/^https:\/\//.test(r.externalUrl) ? 'externalUrl must start with https://' : null),
    (r) => ({ title: r.title, kind: r.kind, date: new Date(r.date).toISOString(), description: r.description, externalUrl: r.externalUrl || undefined })),
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'kind', type: 'select', required: true, options: ['Report', 'Law', 'Regulation', 'Directive', 'Reporting'], admin: { position: 'sidebar' } },
    { name: 'date', type: 'date', required: true, admin: { position: 'sidebar', date: { pickerAppearance: 'monthOnly', displayFormat: 'MMM yyyy' } } },
    { name: 'featured', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar', description: 'Show first on the homepage.' } },
    { name: 'description', type: 'textarea' },
    { name: 'file', type: 'upload', relationTo: 'media', admin: { description: 'Upload the PDF.' } },
    { name: 'externalUrl', label: 'External link', type: 'text', validate: validateLink, admin: { description: 'Use instead of a file if the document lives elsewhere.' } },
    { name: 'stats', type: 'array', admin: { description: 'Key figures shown with a featured report.' }, fields: [{ name: 'value', type: 'text', required: true }, { name: 'label', type: 'text', required: true }] },
    ...reviewFields,
  ],
}
