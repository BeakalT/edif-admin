import type { PayloadRequest } from 'payload'
import type { Role } from '@/access'

/** Typed views of what hooks read from a request, instead of casting to `any` everywhere. */
export type StaffUser = { id: number | string; email: string; name?: string | null; role?: Role | null; hasTotp?: boolean | null }
export type ReqContext = {
  seeding?: boolean
  invited?: boolean
  passwordChanged?: boolean
  draftSave?: boolean
  changesRequested?: boolean
  isDraft?: boolean
  wasPublished?: boolean
  submittedForReview?: boolean
  [key: string]: unknown
}
export const ctxOf = (req: PayloadRequest) => (req.context ?? (req.context = {})) as ReqContext
export const staffOf = (req: PayloadRequest) => (req.user ?? undefined) as StaffUser | undefined
