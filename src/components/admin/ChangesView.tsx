'use client'
import React from 'react'
import { useFormFields } from '@payloadcms/ui'

/** Shows what changed in an audit entry as a small table (field, before, after) instead of raw JSON. */
export const ChangesView: React.FC = () => {
  const raw = useFormFields(([f]) => f.changes?.value) as Record<string, { from?: string; to?: string }> | undefined
  const rows = Object.entries(raw || {}).filter(([k]) => k !== 'event')
  if (!rows.length) return null
  return (
    <div className="edif-changes">
      <h4>What changed</h4>
      <table>
        <thead><tr><th scope="col">Field</th><th scope="col">Before</th><th scope="col">After</th></tr></thead>
        <tbody>{rows.map(([k, v]) => (
          <tr key={k}><th scope="row">{k.replace(/([A-Z])/g, ' $1').toLowerCase()}</th><td>{v?.from || <em>empty</em>}</td><td>{v?.to || <em>empty</em>}</td></tr>
        ))}</tbody>
      </table>
    </div>
  )
}
