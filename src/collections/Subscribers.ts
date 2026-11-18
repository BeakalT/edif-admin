import type { CollectionConfig } from 'payload'
import { hasRole } from '../access'
import { withAudit } from '../hooks/audit'

/** Newsletter list with double opt-in: an address only counts after the owner clicks the confirmation link. Sending is done in your mail tool. */
export const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  labels: { singular: 'Subscriber', plural: 'Newsletter subscribers' },
  admin: { hidden: process.env.NEXT_PUBLIC_NEWSLETTER !== 'on', group: 'Inbox', useAsTitle: 'email', defaultColumns: ['email', 'status', 'createdAt'], description: 'People who asked for updates. Only confirmed addresses should be mailed.' },
  access: {
    read: ({ req }) => hasRole(req.user, 'admin', 'publisher'),
    create: () => false,
    update: ({ req }) => hasRole(req.user, 'admin'),
    delete: ({ req }) => hasRole(req.user, 'admin'),
  },
  hooks: withAudit,
  fields: [
    { name: 'email', type: 'email', required: true, unique: true, index: true },
    { name: 'status', type: 'select', defaultValue: 'pending', options: [{ label: 'Waiting for confirmation', value: 'pending' }, { label: 'Confirmed', value: 'confirmed' }, { label: 'Unsubscribed', value: 'unsubscribed' }], admin: { position: 'sidebar' } },
    { name: 'token', type: 'text', index: true, admin: { hidden: true } },
    { name: 'confirmedAt', label: 'Confirmed on', type: 'date', admin: { position: 'sidebar', readOnly: true } },
  ],
}
