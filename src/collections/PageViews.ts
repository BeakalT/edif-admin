import type { CollectionConfig } from 'payload'
import { hasRole, nobody } from '../access'

/** Privacy-friendly visit counts: one number per page per day. No cookies, no IP addresses, no personal data is stored. */
export const PageViews: CollectionConfig = {
  slug: 'page-views',
  labels: { singular: 'Page views', plural: 'Visit statistics' },
  admin: { group: 'Administration', useAsTitle: 'path', defaultColumns: ['day', 'path', 'views'], description: 'Daily visits per page. Counted without cookies or personal data.' },
  defaultSort: '-day',
  access: { read: ({ req }) => hasRole(req.user, 'admin', 'publisher', 'auditor'), create: nobody, update: nobody, delete: ({ req }) => hasRole(req.user, 'admin') },
  fields: [
    { name: 'day', type: 'text', required: true, index: true },
    { name: 'path', type: 'text', required: true, index: true },
    { name: 'views', type: 'number', required: true, defaultValue: 0 },
  ],
}
