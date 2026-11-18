import type { CollectionConfig } from 'payload'

/** The bell inside the admin. Each row belongs to one person; only the server creates them. */
export const KINDS = [
  { label: 'Review', value: 'review' },
  { label: 'Security', value: 'security' },
  { label: 'Inbox', value: 'inbox' },
  { label: 'Deadline', value: 'deadline' },
  { label: 'Account', value: 'account' },
  { label: 'System', value: 'system' },
]

const mine = ({ req }: { req: { user?: { id?: string | number } | null } }) => (req.user ? { recipient: { equals: req.user.id } } : false)

export const Notifications: CollectionConfig = {
  slug: 'notifications',
  labels: { singular: 'Notification', plural: 'Notifications' },
  admin: {
    group: 'Inbox',
    useAsTitle: 'title',
    defaultColumns: ['title', 'kind', 'createdAt', 'readAt'],
    description: 'Things that need your attention. You only ever see your own.',
  },
  defaultSort: '-createdAt',
  access: {
    read: mine,
    create: () => false, // created by the system only
    update: mine,
    delete: mine,
  },
  timestamps: true,
  fields: [
    { name: 'recipient', type: 'relationship', relationTo: 'users', required: true, index: true, access: { update: () => false } },
    { name: 'kind', type: 'select', options: KINDS, defaultValue: 'system', required: true, access: { update: () => false } },
    { name: 'title', type: 'text', required: true, access: { update: () => false } },
    { name: 'body', type: 'textarea', access: { update: () => false } },
    { name: 'link', type: 'text', access: { update: () => false }, admin: { description: 'Where this takes you.' } },
    { name: 'dedupeKey', type: 'text', index: true, admin: { hidden: true }, access: { update: () => false } },
    { name: 'readAt', label: 'Read', type: 'date', admin: { date: { pickerAppearance: 'dayAndTime' } } },
  ],
}
