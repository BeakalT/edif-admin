import { staffOf } from '@/lib/reqTypes'
import type { Field } from 'payload'

/** Two-step review: an Editor prepares and submits, a different Publisher approves and publishes. */
export const reviewFields: Field[] = [
  {
    name: 'reviewStatus',
    type: 'select',
    label: 'Review',
    defaultValue: 'none',
    options: [
      { label: 'Not submitted', value: 'none' },
      { label: 'Ready for review', value: 'in_review' },
      { label: 'Changes requested', value: 'changes_requested' },
    ],
    admin: { position: 'sidebar', description: 'Editors: choose "Ready for review" and save the draft. A different Publisher then checks it and publishes.' },
  },
  {
    name: 'reviewNote',
    type: 'textarea',
    label: 'Note to the editor',
    admin: { position: 'sidebar', description: 'Publishers: when you choose "Changes requested", say what needs fixing. The editor is emailed this note.', condition: (d) => d?.reviewStatus === 'changes_requested' || !!d?.reviewNote },
    access: { update: ({ req }) => ['admin', 'publisher'].includes(staffOf(req)?.role ?? '') },
  },
  {
    name: 'lastEditor',
    type: 'text',
    label: 'Last changed by',
    admin: { position: 'sidebar', readOnly: true, condition: (d) => !!d?.lastEditor, description: 'Set automatically. Whoever last changed this item cannot be the one to publish it.' },
  },
]
