import type { CollectionConfig } from 'payload'
import { hasRole } from '../access'
import { withAudit } from '../hooks/audit'

/** Messages sent through the contact form. Created only by the website's server route; staff read and triage them here. */
export const Messages: CollectionConfig = {
  slug: 'messages',
  labels: { singular: 'Message', plural: 'Contact messages' },
  admin: { group: 'Inbox', useAsTitle: 'subject', defaultColumns: ['subject', 'name', 'topic', 'status', 'createdAt'], description: 'Enquiries from the website contact form.' },
  access: {
    read: ({ req }) => hasRole(req.user, 'admin', 'publisher'),
    create: () => false,
    update: ({ req }) => hasRole(req.user, 'admin', 'publisher'),
    delete: ({ req }) => hasRole(req.user, 'admin'),
  },
  trash: true,
  hooks: withAudit,
  fields: [
    { name: 'name', type: 'text', required: true, access: { update: () => false }, admin: { readOnly: true } },
    { name: 'email', type: 'email', required: true, access: { update: () => false }, admin: { readOnly: true } },
    { name: 'topic', type: 'text', access: { update: () => false }, admin: { readOnly: true } },
    { name: 'subject', type: 'text', access: { update: () => false }, admin: { readOnly: true } },
    { name: 'message', type: 'textarea', required: true, access: { update: () => false }, admin: { readOnly: true } },
    { name: 'status', type: 'select', defaultValue: 'new', options: [{ label: 'New', value: 'new' }, { label: 'In progress', value: 'progress' }, { label: 'Answered', value: 'answered' }, { label: 'Spam', value: 'spam' }], admin: { position: 'sidebar' } },
    { name: 'assignedTo', label: 'Assigned to', type: 'text', admin: { position: 'sidebar', description: 'Who is handling it.' } },
    { name: 'notes', type: 'textarea', admin: { description: 'Internal notes. Never shown to the sender.' } },
  ],
}
