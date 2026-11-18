import { APIError } from 'payload'
import type { CollectionConfig } from 'payload'
import { canDelete, canWriteContent, isStaff } from '../access'
import { seoField } from '../fields/seo'
import { reviewFields } from '../fields/review'
import { contentHooks } from '../hooks/publishGuard'
import { blocks } from '../blocks'
import { cleanHtml, scopeCss } from '../lib/customCode'

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: 'Page', plural: 'Pages' },
  admin: { preview: (doc: any) => `${process.env.SITE_URL || 'http://localhost:3100'}/preview/pages/${doc.id}`, group: 'Content', useAsTitle: 'title', defaultColumns: ['title', 'path', '_status'], description: 'Build pages from blocks. Two-step review applies, and you can preview a draft before it goes live.' },
  access: { read: isStaff, create: canWriteContent, update: canWriteContent, delete: canDelete, readVersions: isStaff },
  versions: { drafts: { schedulePublish: true }, maxPerDoc: 0 },
  trash: true,
  hooks: {
    ...contentHooks,
    // custom HTML and CSS are cleaned when saved, so what the editor sees is what is kept
    beforeChange: [({ data }: any) => {
      if (Array.isArray(data?.layout)) for (const b of data.layout) if (b.blockType === 'custom') { if (b.html != null) b.html = cleanHtml(b.html); if (b.css && !scopeCss(b.css, 'x')) throw new APIError('None of this CSS is allowed (imports, fixed positioning and external files are removed). Nothing was saved.', 400) }
      return data
    }, ...contentHooks.beforeChange],
  },
  defaultSort: 'path',
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'path', type: 'text', required: true, unique: true, index: true, admin: { position: 'sidebar', description: 'Web address, for example /about/our-history. Lowercase, hyphens, starts with /.' },
      validate: (v: unknown) => (v === '/' || typeof v === 'string' && /^\/[a-z0-9-]+(\/[a-z0-9-]+)*$/.test(v) && !/^\/(admin|api|news|publications|faq|contact|search|preview)(\/|$)/.test(v) ? true : 'Use lowercase letters, numbers and hyphens, start with /, and avoid reserved words (admin, api, news, publications, faq, contact, search, preview).'),
    },
    { name: 'layout', label: 'Page sections', labels: { singular: 'Section', plural: 'Sections' }, type: 'blocks', blocks, required: true, minRows: 1, admin: { description: 'The sections of this page, top to bottom. Drag to reorder; open a section to edit it; use Section settings to hide it.' } },
    seoField,
    ...reviewFields,
  ],
}
