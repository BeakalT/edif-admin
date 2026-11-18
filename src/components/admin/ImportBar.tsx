'use client'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

/** Download the list as CSV, or import a CSV. Imported rows are saved as drafts for review. */
export function ImportBar() {
  const path = usePathname() || ''
  const slug = path.split('/collections/')[1]?.split('/')[0] || ''
  const [msg, setMsg] = useState<{ ok: boolean; text: string; errors?: string[] } | null>(null)
  const upload = async (file?: File) => {
    if (!file) return
    setMsg({ ok: true, text: 'Importing…' })
    const r = await fetch(`/api/${slug}/import`, { method: 'POST', body: await file.text(), headers: { 'Content-Type': 'text/csv' }, credentials: 'include' })
    const j = await r.json().catch(() => ({ message: 'Import failed.' }))
    setMsg({ ok: r.ok, text: j.message, errors: j.errors })
  }
  return (
    <div style={{ margin: '0 0 20px', padding: 16, border: '1px solid var(--theme-elevation-100)', borderRadius: 6 }}>
      <strong>Spreadsheet import and export</strong>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', margin: '10px 0' }}>
        <a className="btn btn--style-secondary btn--size-medium" href={`/api/${slug}/export`}>Download CSV</a>
        <label>Import CSV (saved as drafts): <input type="file" accept=".csv,text/csv" onChange={(e) => upload(e.target.files?.[0])} /></label>
      </div>
      {msg && <div role="status" style={{ color: msg.ok ? 'inherit' : 'var(--theme-error-500)' }}>{msg.text}{msg.errors && <ul>{msg.errors.map((e) => <li key={e}>{e}</li>)}</ul>}</div>}
    </div>
  )
}
