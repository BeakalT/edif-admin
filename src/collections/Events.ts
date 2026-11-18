import type { CollectionConfig } from 'payload'
import { canDelete, canWriteContent, isStaff } from '../access'
import { seoField } from '../fields/seo'
import { reviewFields } from '../fields/review'
import { contentHooks } from '../hooks/publishGuard'

export const Events: CollectionConfig = {
  slug: 'events',
  labels: { singular: 'Event', plural: 'Events' },
  admin: { preview: (doc: any) => `${process.env.SITE_URL || 'http://localhost:3100'}/preview/events/${doc.id}`, group: 'Content', useAsTitle: 'title', defaultColumns: ['title', 'startsAt', '_status'], description: 'Conferences, workshops and public events.' },
  access: { read: isStaff, create: canWriteContent, update: canWriteContent, delete: canDelete, readVersions: isStaff },
  versions: { drafts: { schedulePublish: true }, maxPerDoc: 0 },
  trash: true,
  hooks: contentHooks,
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true, admin: { position: 'sidebar' } },
    { name: 'startsAt', label: 'Starts', type: 'date', required: true, admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } } },
    { name: 'endsAt', label: 'Ends', type: 'date', admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } } },
    { name: 'venue', type: 'text' },
    { name: 'summary', type: 'textarea', required: true },
    { name: 'details', type: 'richText' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'registerUrl', label: 'Registration link', type: 'text', admin: { description: 'Optional registration link.' } },
    seoField,
    ...reviewFields,
  ],
}
