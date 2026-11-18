import type { CollectionConfig } from 'payload'
import { adminOrAuditor, nobody } from '../access'
import { auditExport } from '../lib/endpoints'
import { summarize } from '../lib/auditSummary'

/** Append-only record of every change. Nobody can edit or delete entries through the application. */
export const AuditLog: CollectionConfig = {
  slug: 'audit-log',
  labels: { singular: 'Audit entry', plural: 'Audit log' },
  admin: {
    group: 'Administration',
    useAsTitle: 'documentTitle',
    defaultColumns: ['createdAt', 'summary', 'ip'],
    description: 'Who changed what, and when. Entries cannot be edited or deleted.',
    listSearchableFields: ['actor', 'documentTitle', 'resource'],
    components: { beforeListTable: ['/components/admin/AuditTabs#AuditTabs', '/components/admin/ExportBar#ExportBar'] },
  },
  defaultSort: '-createdAt',
  endpoints: [auditExport],
  access: { read: adminOrAuditor, create: nobody, update: nobody, delete: nobody },
  timestamps: true,
  fields: [
    { name: 'summary', label: 'What happened', type: 'text', virtual: true, admin: { readOnly: true }, hooks: { afterRead: [({ data }) => (data ? summarize(data as Parameters<typeof summarize>[0]) : '')] } },
    { name: 'changesView', type: 'ui', admin: { components: { Field: '/components/admin/ChangesView#ChangesView' } } },
    { name: 'action', type: 'select', required: true, options: ['create', 'update', 'publish', 'unpublish', 'submit', 'delete', 'login', 'logout', 'security'], index: true },
    { name: 'actor', type: 'text', index: true },
    { name: 'actorRole', label: 'Role', type: 'text' },
    { name: 'resource', type: 'text', index: true },
    { name: 'documentId', label: 'Document ID', type: 'text' },
    { name: 'documentTitle', label: 'Document', type: 'text' },
    { name: 'changes', type: 'json', admin: { description: 'The same record in raw form, for export and technical review.', hidden: true } },
    { name: 'ip', type: 'text', label: 'IP address' },
  ],
}
