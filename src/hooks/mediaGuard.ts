import { ctxOf } from '@/lib/reqTypes'
import { APIError } from 'payload'
import type { CollectionBeforeDeleteHook } from 'payload'
import { mediaUsage } from '../lib/mediaUsage'

/** A file that is still used somewhere cannot be deleted: that would leave broken images and dead download links. */
export const guardMediaDelete: CollectionBeforeDeleteHook = async ({ id, req }) => {
  if (ctxOf(req)?.seeding) return
  const hits = await mediaUsage(req.payload, id)
  if (hits.length) {
    const list = hits.slice(0, 5).map((h) => `${h.title} (${h.collection})`).join(', ')
    throw new APIError(`This file is still used by: ${list}${hits.length > 5 ? ` and ${hits.length - 5} more` : ''}. Replace it there first, or use "Replace file" to swap it everywhere.`, 409)
  }
}

/** Moving a used file to the trash is blocked for the same reason. */
export const guardMediaTrash = async ({ data, originalDoc, req }: any) => {
  if (ctxOf(req)?.seeding) return data
  if (data?.deletedAt && !originalDoc?.deletedAt) await guardMediaDelete({ id: originalDoc.id, req } as any)
  return data
}
