import type { CollectionConfig } from 'payload'
import { APIError } from 'payload'
import { canDelete, isStaff, seoFieldAccess } from '../access'
import { withAudit } from '../hooks/audit'

/** Keeps old links working when pages move. Used by the website at request time. */
export const Redirects: CollectionConfig = {
  slug: 'redirects',
  admin: { group: 'Search (SEO)', useAsTitle: 'from', defaultColumns: ['from', 'to', 'permanent'] },
  access: { read: isStaff, create: ({ req }) => seoFieldAccess({ req } as any), update: ({ req }) => seoFieldAccess({ req } as any), delete: canDelete },
  hooks: {
    ...withAudit,
    beforeValidate: [({ data }) => {
      if (data?.from && !String(data.from).startsWith('/')) throw new APIError('"From" must start with /', 400)
      if (data?.to && !/^(\/|https:\/\/)/.test(String(data.to))) throw new APIError('"To" must start with / or https://', 400)
      if (data?.from && data?.from === data?.to) throw new APIError('A redirect cannot point to itself.', 400)
      return data
    }],
  },
  fields: [
    { name: 'from', type: 'text', required: true, unique: true, admin: { description: 'The old address, e.g. /old-page' } },
    { name: 'to', type: 'text', required: true, admin: { description: 'The new address, e.g. /new-page or https://…' } },
    { name: 'permanent', type: 'checkbox', defaultValue: true, admin: { description: 'Permanent (301) tells search engines to move the old page’s ranking to the new one.' } },
  ],
}
