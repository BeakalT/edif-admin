import { ctxOf } from '@/lib/reqTypes'
import type { CollectionConfig } from 'payload'
import { canDelete, canWriteContent, hasRole } from '../access'
import { withAudit } from '../hooks/audit'
import { adminOnlyDelete } from '../hooks/publishGuard'
import { sanitizeUpload } from '../lib/uploadSafety'
import { guardMediaDelete, guardMediaTrash } from '../hooks/mediaGuard'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: { group: 'Content', description: 'Images and PDF documents' },
  access: {
    // Files are public once uploaded (the website links to them); only signed-in staff can upload.
    read: () => true,
    create: ({ req }) => hasRole(req.user, 'admin', 'publisher', 'editor', 'seo'),
    update: canWriteContent,
    delete: canDelete,
  },
  hooks: { ...withAudit, beforeOperation: [async ({ req, operation }: any) => { if ((operation === 'create' || operation === 'update') && req.file?.data && !ctxOf(req)?.seeding) await sanitizeUpload(req.file) }], beforeDelete: [adminOnlyDelete, guardMediaDelete], beforeChange: [guardMediaTrash] },
  trash: true,
  custom: { totp: { disableAccessWrapper: { read: true } } }, // images and PDFs are public by design
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
