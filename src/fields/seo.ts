import type { Field } from 'payload'
import { seoFieldAccess } from '../access'

/** Search and share settings, editable by SEO Managers as well as content roles. */
export const seoField: Field = {
  name: 'seo',
  type: 'group',
  label: 'Search and sharing',
  admin: { description: 'How this page appears in Google and when a link is shared.' },
  fields: [
    {
      name: 'title',
      type: 'text',
      maxLength: 70,
      admin: { description: 'Under 60 characters is best. Leave blank to use the page title.' },
      access: { update: seoFieldAccess },
    },
    {
      name: 'description',
      type: 'textarea',
      maxLength: 200,
      admin: { description: '120 to 160 characters is best.' },
      access: { update: seoFieldAccess },
    },
    { name: 'image', type: 'upload', relationTo: 'media', admin: { description: 'Image shown when the link is shared. 1200 x 630 works best.' }, access: { update: seoFieldAccess } },
    { name: 'noindex', type: 'checkbox', label: 'Hide from search engines', defaultValue: false, access: { update: seoFieldAccess } },
  ],
}
