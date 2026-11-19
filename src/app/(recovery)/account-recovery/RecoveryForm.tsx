'use client'
import React, { useState } from 'react'

export default function RecoveryForm({ loginHref }: { loginHref: string }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState<{ remaining: number; message: string } | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      const r = await fetch('/api/users/recovery/use', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password, code }) })
      const j = await r.json().catch(() => ({}))
      if (r.ok && j.ok) {
        setDone({ remaining: j.remaining, message: j.message })
        setPassword('')
        setCode('')
      } else if (r.status === 429) setError('Too many attempts. Please wait a while and try again.')
      else setError(j.message || 'Those details did not work.')
    } catch {
      setError('Could not reach the server. Check your connection and try again.')
    } finally {
      setBusy(false)
    }
  }

  const field: React.CSSProperties = { display: 'block', width: '100%', boxSizing: 'border-box', padding: 10, fontSize: 16, margin: '4px 0 16px', border: '1px solid #9aa3b2', borderRadius: 4 }

  if (done)
    return (
      <div role="status" style={{ background: '#fff', padding: 20, borderRadius: 6, border: '1px solid #cfd5df' }}>
        <p style={{ marginTop: 0, fontWeight: 600 }}>{done.message}</p>
        <p>Recovery codes left: {done.remaining}. {done.remaining <= 3 ? 'Create a new set from your account page after you sign in.' : ''}</p>
        <a href={loginHref} style={{ display: 'inline-block', padding: '10px 16px', background: '#14213d', color: '#fff', borderRadius: 4, textDecoration: 'none' }}>Go to sign in</a>
      </div>
    )

  return (
    <form onSubmit={submit} style={{ background: '#fff', padding: 20, borderRadius: 6, border: '1px solid #cfd5df' }}>
      <label htmlFor="rc-email">Email</label>
      <input id="rc-email" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} style={field} />
      <label htmlFor="rc-password">Password</label>
      <input id="rc-password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} style={field} />
      <label htmlFor="rc-code">Recovery code</label>
      <input id="rc-code" type="text" autoComplete="off" autoCapitalize="characters" spellCheck={false} placeholder="ABCDE-FGHJK" required value={code} onChange={(e) => setCode(e.target.value)} style={field} />
      {error && <p role="alert" style={{ color: '#b00020', margin: '0 0 16px' }}>{error}</p>}
      <button type="submit" disabled={busy} style={{ padding: '10px 16px', fontSize: 16, background: '#14213d', color: '#fff', border: 0, borderRadius: 4, cursor: 'pointer' }}>{busy ? 'Checking…' : 'Remove my authenticator'}</button>
      <p style={{ fontSize: 14, margin: '16px 0 0', lineHeight: 1.5 }}>No codes either? Ask another Super Admin to reset your two-factor, or ask whoever runs the server.</p>
    </form>
  )
}
