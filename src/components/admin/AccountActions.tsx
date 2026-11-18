'use client'
import React, { useState } from 'react'
import { useAuth, useDocumentInfo } from '@payloadcms/ui'

/** Super Admin tools on another person's account: send a password setup email, or reset their two-factor device. */
export const AccountActions: React.FC = () => {
  const { id } = useDocumentInfo()
  const { user } = useAuth() as any
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)
  if (user?.role !== 'admin') return null
  if (!id)
    return (
      <p style={{ margin: '0 0 24px', padding: 12, background: 'var(--theme-elevation-50)', borderRadius: 4 }}>
        <strong>Password:</strong> type anything in the password boxes above, it is ignored. The person receives an email with a link to choose their own password, then sets up their authenticator app at first sign-in. Nobody else ever knows it.
      </p>
    )
  if (String(user.id) === String(id)) return null

  const run = async (path: string, confirmText: string) => {
    if (!window.confirm(confirmText)) return
    setBusy(true)
    setMsg('')
    try {
      const r = await fetch(`/api/users/${id}/${path}`, { method: 'POST', credentials: 'same-origin' })
      const j = await r.json().catch(() => ({}))
      setMsg(r.ok ? j.message || 'Done.' : j.message || j.errors?.[0]?.message || 'Could not complete that.')
    } finally {
      setBusy(false)
    }
  }
  const btn: React.CSSProperties = { padding: '8px 14px', borderRadius: 4, border: '1px solid var(--theme-elevation-300)', background: 'var(--theme-elevation-50)', cursor: 'pointer', marginRight: 8 }
  return (
    <div style={{ margin: '0 0 24px' }}>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>Account security</div>
      <button type="button" style={btn} disabled={busy} onClick={() => run('send-invite', 'Email this person a link to set a new password? Links last 48 hours and their current sessions end.')}>Send password setup email</button>
      <button type="button" style={btn} disabled={busy} onClick={() => run('reset-2fa', 'Remove this person’s authenticator? They must set up two-factor again at their next login. Do this only after confirming who they are.')}>Reset two-factor</button>
      {msg && <p style={{ marginTop: 8 }} role="status">{msg}</p>}
    </div>
  )
}
