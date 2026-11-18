import { clientIpFrom } from '@/lib/clientIp'
import type { Access, FieldAccess, PayloadRequest } from 'payload'

export type Role = 'admin' | 'publisher' | 'editor' | 'seo' | 'auditor'

export const ROLES: { label: string; value: Role }[] = [
  { label: 'Super Admin', value: 'admin' },
  { label: 'Publisher', value: 'publisher' },
  { label: 'Editor', value: 'editor' },
  { label: 'SEO Manager', value: 'seo' },
  { label: 'Auditor (read-only)', value: 'auditor' },
]

type U = { role?: Role | null } | null | undefined
export const hasRole = (user: U, ...roles: Role[]) => !!user && !!user.role && roles.includes(user.role)

/** Staff are signed-in users. The public website never uses the REST API: it reads through the server-side Local API. */
export const isStaff: Access = ({ req }) => !!req.user
export const canWriteContent: Access = ({ req }) => hasRole(req.user, 'admin', 'publisher', 'editor')
export const canPublish = (user: U) => hasRole(user, 'admin', 'publisher')
export const canDelete: Access = ({ req }) => hasRole(req.user, 'admin', 'publisher')
export const adminOnly: Access = ({ req }) => hasRole(req.user, 'admin')
export const adminOrAuditor: Access = ({ req }) => hasRole(req.user, 'admin', 'auditor')
export const nobody: Access = () => false

export const seoFieldAccess: FieldAccess = ({ req }) => hasRole(req.user, 'admin', 'publisher', 'editor', 'seo')
export const clientIp = (req: PayloadRequest) => clientIpFrom((n) => req.headers?.get?.(n))
