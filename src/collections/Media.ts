import { ctxOf } from '@/lib/reqTypes'
import type { CollectionConfig } from 'payload'
import { canDelete, canWriteContent, hasRole } from '../access'
import { withAudit } from '../hooks/audit'
import { adminOnlyDelete } from '../hooks/publishGuard'
import { sanitizeUpload } from '../lib/uploadSafety'
import { guardMediaDelete, guardMediaTrash } from '../hooks/mediaGuard'
import { passedTwoFactor } from '../lib/twoFactor'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: { group: 'Content', description: 'Images and PDF documents' },
  access: {
    // Visitors may download a file by its exact address (the website links to them), but only signed-in staff
    // may list or search the library, so files that no published page links to yet cannot be discovered.
    read: ({ req, isReadingStaticFile }: any) => isReadingStaticFile === true || passedTwoFactor(req.payload, req.user),
    create: ({ req }) => hasRole(req.user, 'admin', 'publisher', 'editor', 'seo'),
    update: canWriteContent,
    delete: canDelete,
  },
  hooks: { ...withAudit, beforeOperation: [async ({ req, operation }: any) => { if ((operation === 'create' || operation === 'update') && req.file?.data && !ctxOf(req)?.seeding) await sanitizeUpload(req.file) }], beforeDelete: [adminOnlyDelete, guardMediaDelete], beforeChange: [guardMediaTrash] },
  trash: true,
  custom: { totp: { disableAccessWrapper: { read: true } } }, // file downloads are public by design; listing is checked in read above
  upload: {
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'application/pdf'],
    imageSizes: [
      { name: 'card', width: 640 },
      { name: 'share', width: 1200, height: 630, fit: 'cover' },
    ],
    adminThumbnail: 'card',
  },
  fields: [{ name: 'alt', type: 'text', admin: { description: 'Describe the image for visually impaired readers. Required for images.' } }],
}
