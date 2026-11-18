import type { CollectionConfig } from 'payload'
import { canDelete, isStaff, seoFieldAccess } from '../access'
import { withAudit } from '../hooks/audit'
import { seoField } from '../fields/seo'

/** Search settings for fixed pages (home, about, and so on). */
export const SeoPages: CollectionConfig = {
  slug: 'seo-pages',
  labels: { singular: 'Page search settings', plural: 'Page search settings' },
  admin: { group: 'Search (SEO)', useAsTitle: 'path', defaultColumns: ['path', 'label'] },
  access: { read: isStaff, create: ({ req }) => seoFieldAccess({ req } as any), update: ({ req }) => seoFieldAccess({ req } as any), delete: canDelete },
  hooks: withAudit,
  fields: [
    { name: 'path', type: 'text', required: true, unique: true, admin: { description: 'The page address, e.g. / for the homepage or /about.' } },
    { name: 'label', type: 'text', admin: { description: 'A name for your own reference, e.g. About page.' } },
    seoField,
  ],
}
