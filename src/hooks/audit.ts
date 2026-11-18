import { ctxOf, staffOf } from '@/lib/reqTypes'
import { adminUrl } from '@/lib/adminRoute'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, CollectionAfterLoginHook, CollectionAfterLogoutHook, GlobalAfterChangeHook, PayloadRequest } from 'payload'
import { clientIp } from '../access'
import { revalidateChange, revalidateDelete } from './revalidate'
import { notifyRoles } from '../lib/notify'

const SKIP = new Set(['updatedAt', 'createdAt', 'id', 'sizes', 'hash', 'salt', 'password', 'totpSecret', 'hasTotp', 'loginAttempts', 'lockUntil', 'resetPasswordToken', 'resetPasswordExpiration', 'resetPasswordRequestedAt', 'sessions', 'lastSeenAt'])
const short = (v: unknown) => {
  const s = typeof v === 'string' ? v : JSON.stringify(v)
  return s && s.length > 300 ? s.slice(0, 300) + '…' : s
}

const diff = (before: any, after: any) => {
  const out: Record<string, { from?: string; to?: string }> = {}
  for (const k of new Set([...Object.keys(before || {}), ...Object.keys(after || {})])) {
    if (SKIP.has(k)) continue
    if (JSON.stringify(before?.[k]) !== JSON.stringify(after?.[k])) out[k] = { from: short(before?.[k]), to: short(after?.[k]) }
  }
  return out
}

export const liveStatus = async (req: any, collection: string, id: string | number) => {
  const main: any = await req.payload.findByID({ collection, id, draft: false, overrideAccess: true, depth: 0, req }).catch(() => null)
  return main?._status as string | undefined
}

const title = (doc: any) => doc?.title || doc?.question || doc?.name || doc?.slug || doc?.email || doc?.filename || (doc?.id != null ? `#${doc.id}` : '')

async function write(req: PayloadRequest, data: Record<string, unknown>, who?: any) {
  const u: any = who ?? req.user
  await req.payload.create({
    collection: 'audit-log',
    overrideAccess: true,
    // same transaction as the action: if the log entry cannot be written, the change is rolled back (fail closed)
    data: { ...data, actor: u ? `${u.email}` : 'system', actorRole: u?.role || '', ip: clientIp(req) } as any,
    req,
  })
}

export const auditChange: CollectionAfterChangeHook = async ({ collection, doc, previousDoc, operation, req }) => {
  if (collection.slug === 'audit-log') return doc
  const changes = operation === 'create' ? {} : diff(previousDoc, doc)
  let action = operation === 'create' ? 'create' : 'update'
  const ctx = ctxOf(req) || {}
  if (operation === 'update' && ctx.wasPublished !== undefined && !ctx.isDraft) {
    const live = (doc as any)._status
    if (live === 'published') action = 'publish' // first publication, or publishing reviewed changes to a live page
    else if (ctx.wasPublished) action = 'unpublish'
  }
  if (ctx.submittedForReview) action = 'submit'
  if (operation === 'update' && !Object.keys(changes).length && action === 'update') return doc
  await write(req, { action, resource: collection.slug, documentId: String(doc.id), documentTitle: title(doc), changes })
  const who = staffOf(req)?.email
  const path = adminUrl(`/collections/${collection.slug}/${doc.id}`)
  if (collection.slug !== 'users' && collection.slug !== 'media') {
    if (action === 'submit') notifyRoles(req.payload, ['publisher', 'admin'], 'Ready for review', [`${who} submitted "${title(doc)}" (${collection.slug}) for review.`, 'A Publisher other than the author can approve and publish it.'], { except: who, path })
    if (action === 'publish' || action === 'unpublish') notifyRoles(req.payload, ['admin', 'auditor'], action === 'publish' ? 'Content published' : 'Content taken offline', [`${who} ${action === 'publish' ? 'published' : 'unpublished'} "${title(doc)}" (${collection.slug}).`], { except: who, path })
  }
  return doc
}

export const auditDelete: CollectionAfterDeleteHook = async ({ collection, doc, req }) => {
  if (collection.slug === 'audit-log') return doc
  await write(req, { action: 'delete', resource: collection.slug, documentId: String(doc.id), documentTitle: title(doc), changes: {} })
  return doc
}

export const auditGlobal: GlobalAfterChangeHook = async ({ global, doc, previousDoc, req }) => {
  const changes = diff(previousDoc, doc)
  if (!Object.keys(changes).length) return doc
  await write(req, { action: 'update', resource: global.slug, documentId: global.slug, documentTitle: global.slug, changes })
  return doc
}

export const auditLogin: CollectionAfterLoginHook = async ({ user, req }) => {
  // Payload calls this when the password is accepted; the authenticator code is checked after it, so say so
  await write(req, { action: 'login', resource: 'users', documentId: String(user.id), documentTitle: user.email, changes: { event: { to: 'password accepted, authenticator code still required' } } }, user)
  return user
}
export const auditLogout: CollectionAfterLogoutHook = async ({ req }) => {
  if (req.user) await write(req, { action: 'logout', resource: 'users', documentId: String(staffOf(req)?.id), documentTitle: staffOf(req)?.email, changes: {} })
}

export const withAudit = { afterChange: [auditChange, revalidateChange], afterDelete: [auditDelete, revalidateDelete] }
