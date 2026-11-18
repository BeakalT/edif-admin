import type { CollectionConfig } from 'payload'
import { canDelete, canWriteContent, isStaff, hasRole } from '../access'
import { seoField } from '../fields/seo'
import { reviewFields } from '../fields/review'
import { contentHooks } from '../hooks/publishGuard'
import { validateLink } from '../lib/safeUrl'

export const News: CollectionConfig = {
  slug: 'news',
  labels: { singular: 'News article', plural: 'News' },
  admin: { preview: (doc: any) => `${process.env.SITE_URL || 'http://localhost:3100'}/preview/news/${doc.id}`, group: 'Content', useAsTitle: 'title', defaultColumns: ['title', 'kind', 'date', '_status'], description: 'News and announcements' },
  access: {
    read: isStaff,
    create: canWriteContent,
    update: ({ req }) => hasRole(req.user, 'admin', 'publisher', 'editor', 'seo'),
    delete: canDelete,
    readVersions: isStaff,
  },
  versions: { drafts: { schedulePublish: true }, maxPerDoc: 0 },
  trash: true,
  hooks: contentHooks,
  fields: [
    { name: 'title', type: 'text', required: true, access: { update: ({ req }) => hasRole(req.user, 'admin', 'publisher', 'editor') } },
    { name: 'slug', type: 'text', required: true, unique: true, index: true, admin: { position: 'sidebar', description: 'Web address, lowercase with hyphens.' }, access: { update: ({ req }) => hasRole(req.user, 'admin', 'publisher') } },
    { name: 'kind', type: 'select', required: true, defaultValue: 'Announcement', options: ['Report', 'Event', 'Results', 'Media', 'Announcement'], admin: { position: 'sidebar' } },
    { name: 'date', type: 'date', required: true, admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly' } } },
    { name: 'short', label: 'Short label', type: 'text', admin: { description: 'Short label for cards.' } },
    { name: 'summary', type: 'textarea', required: true },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'body', type: 'richText' },
    { name: 'gallery', type: 'array', admin: { description: 'Extra photos shown under the article.' }, fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }, { name: 'alt', type: 'text', required: true, admin: { description: 'Describe the photo for visually impaired readers.' } }] },
    { name: 'pdf', type: 'upload', relationTo: 'media', label: 'Attached PDF' },
    { name: 'externalPdf', label: 'PDF link', type: 'text', validate: validateLink, admin: { description: 'Link to a PDF hosted elsewhere. Use the upload above for new files.' } },
    { name: 'sourceUrl', label: 'Source link', type: 'text', validate: validateLink, admin: { position: 'sidebar' } },
    seoField,
    ...reviewFields,
  ],
}
