import { ctxOf, staffOf } from '@/lib/reqTypes'
import { APIError } from 'payload'
import type { CollectionBeforeDeleteHook } from 'payload'
import type { CollectionBeforeChangeHook } from 'payload'
import { canPublish } from '../access'
import { notifyUser } from '../lib/notify'
import { adminUrl } from '@/lib/adminRoute'
import { auditChange, auditDelete, liveStatus } from './audit'
import { revalidateChange, revalidateDelete } from './revalidate'

const NOT_PUBLISHER = 'Only a Publisher can publish, unpublish or change live content. Save as a draft and ask a Publisher to review.'
const OWN_WORK = 'Two-step review: you cannot publish changes you made yourself. Save the draft and ask a different Publisher to approve and publish it.'
const NEW_ITEM = 'Two-step review: save this as a draft first. A different Publisher then approves and publishes it.'
const COMBINED = 'Trashing, restoring or unpublishing cannot be combined with edits. Do that step on its own, then edit the draft and send it for review.'

/** A draft save over a live page leaves the live page untouched. The admin sends ?draft=true for it. */
export const isDraftSave = (req: any) => String(req.query?.draft) === 'true' || req.context?.draftSave === true

const META = new Set(['id', 'createdAt', 'updatedAt', '_status', 'lastEditor', 'reviewStatus', '_verified', 'publishedAt', 'version', 'versionID'])
/** Canonical form for comparing content: ignores empty values, row ids and key order. */
const norm = (v: any): any => {
  if (v == null || v === '') return undefined
  if (Array.isArray(v)) {
    const a = v.map(norm).filter((x) => x !== undefined)
    return a.length ? a : undefined
  }
  if (typeof v === 'object') {
    const o: Record<string, any> = {}
    for (const k of Object.keys(v).sort()) {
      if (k === 'id') continue
      const x = norm(v[k])
      if (x !== undefined) o[k] = x
    }
    return Object.keys(o).length ? o : undefined
  }
  return v
}
const changedContent = (incoming: any, latest: any) =>
  Object.keys(incoming || {}).some((k) => !META.has(k) && JSON.stringify(norm(incoming[k])) !== JSON.stringify(norm(latest?.[k])))

/**
 * Editors can create and save drafts. Anything that changes what visitors see needs a Publisher, and a Publisher
 * cannot approve their own work: the person who last changed the draft is never the person who publishes it.
 */
const guardPublish: CollectionBeforeChangeHook = async ({ data, req, collection, originalDoc, operation }) => {
  if (ctxOf(req)?.seeding) return data // trusted server-side import scripts only; the REST API cannot set context
  const user: any = req.user
  const isDraft = isDraftSave(req)
  let wasPublished: boolean | undefined
  if (operation === 'update' && originalDoc?.id != null) wasPublished = (await liveStatus(req, collection.slug, originalDoc.id)) === 'published'
  const submitted = data?.reviewStatus === 'in_review' && originalDoc?.reviewStatus !== 'in_review'
  // set after the lookup: Payload replaces req.context when a Local API call receives req
  Object.assign(ctxOf(req), { isDraft, wasPublished, submittedForReview: submitted })

  if (data?.deletedAt && !originalDoc?.deletedAt && !canPublish(user)) throw new APIError('Only a Publisher can move items to the trash.', 403)
  // Trashing takes content offline and restoring brings back what was already reviewed, so one Publisher can do either,
  // but only as a step on its own: content changes in the same request would skip the two-step review.
  if ((data?.deletedAt && !originalDoc?.deletedAt) || (data?.deletedAt === null && originalDoc?.deletedAt)) {
    if (!canPublish(user)) throw new APIError('Only a Publisher can restore items from the trash.', 403)
    if (user?.role !== 'admin' && originalDoc?.id != null) {
      const { deletedAt: _skip, ...rest } = data
      const latest: any = await req.payload.findByID({ collection: collection.slug as any, id: originalDoc.id, draft: true, overrideAccess: true, depth: 0, trash: true })
      if (changedContent(rest, latest)) throw new APIError(COMBINED, 400)
    }
    return data
  }
  const requested = data?.reviewStatus === 'changes_requested' && originalDoc?.reviewStatus !== 'changes_requested'
  if (requested) {
    if (!canPublish(user)) throw new APIError('Only a Publisher can request changes.', 403)
    if (!String(data.reviewNote || '').trim()) throw new APIError('Please write a short note saying what needs to change.', 400)
    Object.assign(ctxOf(req), { changesRequested: true })
  }
  const touchesLive = data?._status === 'published' || (!isDraft && wasPublished)
  if (touchesLive && !canPublish(user)) throw new APIError(NOT_PUBLISHER, 403)

  const unpublishing = !isDraft && wasPublished && data?._status === 'draft'
  // Unpublishing takes content offline. Edits sent with it would be saved without review, so refuse them.
  if (unpublishing && user?.role !== 'admin') {
    const latest: any = await req.payload.findByID({ collection: collection.slug as any, id: originalDoc.id, draft: true, overrideAccess: true, depth: 0 })
    if (changedContent(data, latest)) throw new APIError(COMBINED, 400)
  }
  if (touchesLive && !unpublishing && !(collection as any).custom?.selfPublish) {
    // Super Admins have full rights: they may create, edit and publish directly. Every action is still written to the audit log.
    if (user?.role === 'admin') {
      data.lastEditor = user.email
      data.reviewStatus = 'none'
      data.reviewNote = ''
      return data
    }
    // approver must be someone other than the last editor
    if (operation === 'create') throw new APIError(NEW_ITEM, 403)
    const latest: any = await req.payload.findByID({ collection: collection.slug as any, id: originalDoc.id, draft: true, overrideAccess: true, depth: 0 })
    if (latest?.lastEditor && latest.lastEditor === user.email) throw new APIError(OWN_WORK, 403)
    if (changedContent(data, latest)) throw new APIError(OWN_WORK, 403) // they altered the content in this very request
    data.reviewStatus = 'none'
    data.reviewNote = ''
  } else if (!unpublishing) {
    // asking for changes is feedback, not an edit: the reviewer stays eligible to approve the corrected draft
    if (!requested) data.lastEditor = user?.email || data.lastEditor // always overwritten server-side, so it cannot be forged
    if (requested && originalDoc?.lastEditor) data.lastEditor = originalDoc.lastEditor
    // a content change invalidates any approved schedule: it must be scheduled again by a reviewer
    if (operation === 'update' && originalDoc?.id != null && !requested) {
      const latest: any = await req.payload.findByID({ collection: collection.slug as any, id: originalDoc.id, draft: true, overrideAccess: true, depth: 0 })
      if (changedContent(data, latest)) {
        await req.payload.delete({ collection: 'payload-jobs' as any, where: { and: [{ taskSlug: { equals: 'schedulePublish' } }, { 'input.doc.value': { equals: String(originalDoc.id) } }, { 'input.doc.relationTo': { equals: collection.slug } }, { type: { equals: 'publish' } }] } as any, overrideAccess: true }).catch(() => null)
      }
    }
  }
  return data
}

/** Moving to the trash goes through the normal update. Permanent deletion (emptying the trash) is for Super Admins only. */
export const adminOnlyDelete: CollectionBeforeDeleteHook = ({ req }) => {
  if (ctxOf(req)?.seeding) return
  if (staffOf(req)?.role !== 'admin') throw new APIError('Only a Super Admin can delete permanently. Use the trash instead, which can be restored.', 403)
}

/** Tell the editor their work came back with a note. */
export const notifyChangesRequested: import('payload').CollectionAfterChangeHook = async ({ doc, req, collection }) => {
  if (ctxOf(req)?.changesRequested && doc.lastEditor) {
    const t = doc.title || doc.question || doc.name || doc.slug || `#${doc.id}`
    notifyUser(req.payload, doc.lastEditor, 'Changes requested', [`${staffOf(req)?.email} asked for changes to "${t}" (${collection.slug}).`, `Note: ${doc.reviewNote}`, 'Open it, make the changes and choose "Ready for review" again.'], { path: adminUrl(`/collections/${collection.slug}/${doc.id}`) })
  }
  return doc
}

/** Hooks for every draft-enabled content collection: publish rules plus the audit trail. */
export const contentHooks = { beforeDelete: [adminOnlyDelete], beforeChange: [guardPublish], afterChange: [auditChange, notifyChangesRequested, revalidateChange], afterDelete: [auditDelete, revalidateDelete] }
