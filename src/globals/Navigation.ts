import type { GlobalConfig } from 'payload'
import { hasRole, isStaff } from '../access'
import { auditGlobal } from '../hooks/audit'
import { revalidateGlobal } from '../hooks/revalidate'
import { validateLink } from '../lib/safeUrl'

const item = [
  { name: 'label', type: 'text', required: true },
  { name: 'url', type: 'text', required: true, validate: validateLink, admin: { description: 'Page path (/about) or full web address.' } },
] as const

/** Header menu and footer columns. Changes take effect on the site within seconds and are recorded in the activity log. */
export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: 'Menus',
  admin: { group: 'Administration', description: 'Edit the main menu and the footer links.' },
  access: { read: isStaff, update: ({ req }) => hasRole(req.user, 'admin', 'publisher') },
  hooks: { afterChange: [auditGlobal, revalidateGlobal] },
  fields: [
    { name: 'main', type: 'array', label: 'Main menu', maxRows: 8, fields: [...item, { name: 'children', type: 'array', label: 'Drop-down links', maxRows: 12, fields: [...item, { name: 'description', type: 'text' }] }] },
    { name: 'footer', type: 'array', label: 'Footer columns', maxRows: 4, fields: [{ name: 'heading', type: 'text', required: true }, { name: 'links', type: 'array', fields: [...item] }] },
    { name: 'cta', type: 'group', label: 'Header button', fields: [{ name: 'label', type: 'text' }, { name: 'url', type: 'text', validate: validateLink }] },
  ],
}
