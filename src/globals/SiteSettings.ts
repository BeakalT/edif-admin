import { DATA_DIR } from '@/lib/paths'
import type { FieldAccess, GlobalConfig } from 'payload'
import { hasRole, isStaff } from '../access'
import { auditGlobal } from '../hooks/audit'
import { revalidateGlobal } from '../hooks/revalidate'
import fs from 'fs'
import path from 'path'

// Contact details and the maintenance switch change what every visitor sees, so an SEO Manager (who may edit search settings only) cannot touch them.
const siteFields: { update: FieldAccess } = { update: ({ req }) => hasRole(req.user, 'admin', 'publisher') }

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site settings',
  admin: { group: 'Administration' },
  access: { read: isStaff, update: ({ req }) => hasRole(req.user, 'admin', 'publisher', 'seo') },
  hooks: {
    afterChange: [auditGlobal, revalidateGlobal, async ({ doc }) => {
      // the proxy reads this small file on each request, so maintenance mode needs no database call
      const dir = DATA_DIR
      fs.mkdirSync(dir, { recursive: true })
      fs.writeFileSync(path.join(dir, 'maintenance.json'), JSON.stringify({ enabled: !!doc.maintenance?.enabled, message: doc.maintenance?.message || '' }))
      return doc
    }],
  },
  fields: [
    { type: 'row', fields: [{ name: 'email', type: 'email', required: true, access: siteFields }, { name: 'poBox', type: 'text', access: siteFields }] },
    { name: 'phones', type: 'array', access: siteFields, fields: [{ name: 'number', type: 'text', required: true }] },
    { name: 'address', type: 'array', access: siteFields, fields: [{ name: 'line', type: 'text', required: true }] },
    {
      name: 'maintenance',
      type: 'group',
      access: siteFields,
      label: 'Maintenance mode',
      admin: { description: 'When on, visitors see a "back soon" page. The admin stays reachable so you can switch it off again.' },
      fields: [
        { name: 'enabled', type: 'checkbox', label: 'Show the maintenance page to visitors', defaultValue: false },
        { name: 'message', type: 'textarea', label: 'Message', admin: { description: 'For example: We are updating the website and will be back by 3 pm.' } },
      ],
    },
    { name: 'notifyEmail', type: 'email', access: siteFields, label: 'Extra address for new contact messages', admin: { description: 'Optional. Admins and Publishers are always notified in the admin.' } },
    {
      name: 'defaultSeo',
      type: 'group',
      label: 'Default search settings',
      admin: { description: 'Used when a page has none of its own.' },
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}
