'use client'
import React, { useEffect, useState } from 'react'
import { useAuth, useDocumentInfo } from '@payloadcms/ui'

/**
 * On your own account page: create the one-time recovery codes that let you get back in if your phone is lost, replaced or
 * left behind. The codes are shown once. Creating a new set makes every older code stop working.
 */
export const RecoveryCodes: React.FC = () => {
  const { id } = useDocumentInfo()
  const { user } = useAuth() as { user?: { id?: string | number } }
  const [remaining, setRemaining] = useState<number | null>(null)
  const [password, setPassword] = useState('')
  const [codes, setCodes] = useState<string[] | null>(null)
  const [saved, setSaved] = useState(false)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')
  const own = !!id && String(user?.id) === String(id)

  useEffect(() => {
    if (!own) return
    fetch('/api/users/recovery/status', { credentials: 'same-origin' })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => setRemaining(j ? j.remaining : null))
      .catch(() => {})
  }, [own, codes])

  if (!own) return null

  const create = async () => {
    if (remaining && remaining > 0 && !window.confirm('Create a new set? Your current recovery codes will stop working.')) return
    setBusy(true)
    setMsg('')
    try {
      const r = await fetch('/api/users/recovery/codes', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) })
      const j = await r.json().catch(() => ({}))
      if (r.ok) {
        setCodes(j.codes)
        setSaved(false)
        setPassword('')
      } else setMsg(j.message || j.errors?.[0]?.message || 'Could not create codes.')
    } finally {
      setBusy(false)
    }
  }
  const text = () => `EDIF admin recovery codes\nEach code works once. Keep this file somewhere safe and private, never in email or chat.\n\n${(codes || []).join('\n')}\n`
  const copy = async () => {
    try {
      await navigator.clipboard.writeText((codes || []).join('\n'))
      setMsg('Copied. Paste them into your password manager now.')
    } catch {
      setMsg('Copy did not work here. Select the codes and copy them by hand, or use Download.')
    }
  }
  const download = () => {
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([text()], { type: 'text/plain' }))
    a.download = 'edif-recovery-codes.txt'
    a.click()
    setTimeout(() => URL.revokeObjectURL(a.href), 2000)
  }
  const btn: React.CSSProperties = { padding: '8px 14px', borderRadius: 4, border: '1px solid var(--theme-elevation-300)', background: 'var(--theme-elevation-50)', cursor: 'pointer', marginRight: 8 }

  return (
    <div style={{ margin: '0 0 24px', padding: 12, background: 'var(--theme-elevation-50)', borderRadius: 4 }}>
      <div style={{ fontWeight: 600, marginBottom: 6 }}>Recovery codes (lost phone, new phone, or travelling without it)</div>
      <p style={{ margin: '0 0 8px' }}>
        {remaining === null ? 'Checking…' : remaining > 0 ? `You have ${remaining} unused recovery code${remaining === 1 ? '' : 's'}.` : 'You have no recovery codes yet. Without them, only another Super Admin or the server operator can reset your authenticator.'}
      </p>
      {codes ? (
        <div>
          <p style={{ margin: '0 0 8px', fontWeight: 600 }}>Save these now. They are shown only once.</p>
          <pre style={{ margin: '0 0 8px', padding: 12, background: 'var(--theme-bg)', border: '1px solid var(--theme-elevation-200)', borderRadius: 4, fontSize: 16, lineHeight: 1.7 }}>{codes.join('\n')}</pre>
          <button type="button" style={btn} onClick={copy}>Copy</button>
          <button type="button" style={btn} onClick={download}>Download .txt</button>
          <label style={{ display: 'block', marginTop: 12 }}>
            <input type="checkbox" checked={saved} onChange={(e) => setSaved(e.target.checked)} /> I have saved these codes somewhere safe
          </label>
          <button type="button" style={{ ...btn, marginTop: 8, opacity: saved ? 1 : 0.5 }} disabled={!saved} onClick={() => { setCodes(null); setMsg('') }}>Done</button>
        </div>
      ) : (
        <div>
          <label htmlFor="rc-password" style={{ display: 'block', marginBottom: 4 }}>Your password (to confirm it is you)</label>
          <input id="rc-password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ padding: 8, minWidth: 260, marginRight: 8 }} />
          <button type="button" style={btn} disabled={busy || !password} onClick={create}>{remaining && remaining > 0 ? 'Create a new set' : 'Create recovery codes'}</button>
        </div>
      )}
      {msg && <p style={{ marginTop: 8 }} role="status">{msg}</p>}
    </div>
  )
}
