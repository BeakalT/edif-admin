'use client'
import { useState } from 'react'

/** Download the activity log as CSV, optionally filtered. */
export function ExportBar() {
  const [f, setF] = useState({ actor: '', action: '', resource: '', from: '', to: '' })
  const href = '/api/audit-log/export?' + new URLSearchParams(Object.entries(f).filter(([, v]) => v)).toString()
  const inp = { padding: '6px 8px', border: '1px solid var(--theme-elevation-150)', borderRadius: 4, background: 'var(--theme-input-bg)', color: 'inherit' } as const
  return (
    <details style={{ margin: '0 0 20px', padding: 16, border: '1px solid var(--theme-elevation-100)', borderRadius: 6 }}>
      <summary style={{ cursor: 'pointer', fontWeight: 600 }}>Download as spreadsheet (CSV)</summary>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '10px 0' }}>
        <input style={inp} placeholder="Person (email)" value={f.actor} onChange={(e) => setF({ ...f, actor: e.target.value })} aria-label="Person" />
        <select style={inp} value={f.action} onChange={(e) => setF({ ...f, action: e.target.value })} aria-label="Action">
          <option value="">Any action</option>{['create', 'update', 'publish', 'unpublish', 'submit', 'delete', 'login', 'logout', 'security'].map((a) => <option key={a}>{a}</option>)}
        </select>
        <input style={inp} placeholder="Area (e.g. news)" value={f.resource} onChange={(e) => setF({ ...f, resource: e.target.value })} aria-label="Area" />
        <label>From <input style={inp} type="date" value={f.from} onChange={(e) => setF({ ...f, from: e.target.value })} /></label>
        <label>To <input style={inp} type="date" value={f.to} onChange={(e) => setF({ ...f, to: e.target.value })} /></label>
      </div>
      <a className="btn btn--style-primary btn--size-medium" href={href}>Download CSV</a>
      <span style={{ marginLeft: 12, opacity: 0.7, fontSize: 13 }}>Each download is itself recorded in the log.</span>
    </details>
  )
}
