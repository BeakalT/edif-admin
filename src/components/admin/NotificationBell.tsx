'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useConfig } from '@payloadcms/ui'

type N = { id: string | number; kind: string; title: string; body?: string; link?: string; readAt?: string | null; createdAt: string }

const ago = (iso: string) => {
  const m = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000))
  if (m < 1) return 'just now'
  if (m < 60) return `${m} min ago`
  const h = Math.round(m / 60)
  if (h < 24) return `${h} h ago`
  const d = Math.round(h / 24)
  return d === 1 ? 'yesterday' : `${d} days ago`
}

/** The bell in the admin header: unread count, latest notifications, mark as read. Polls once a minute. */
export const NotificationBell: React.FC = () => {
  const { config } = useConfig()
  const api = config.routes.api
  const admin = config.routes.admin
  const [items, setItems] = useState<N[]>([])
  const [unread, setUnread] = useState(0)
  const [open, setOpen] = useState(false)
  const box = useRef<HTMLDivElement>(null)

  const load = useCallback(async () => {
    try {
      const [list, count] = await Promise.all([
        fetch(`${api}/notifications?limit=15&depth=0&sort=-createdAt`, { credentials: 'include' }).then((r) => (r.ok ? r.json() : null)),
        fetch(`${api}/notifications?limit=1&depth=0&where[readAt][exists]=false`, { credentials: 'include' }).then((r) => (r.ok ? r.json() : null)),
      ])
      if (list) setItems(list.docs)
      if (count) setUnread(count.totalDocs)
    } catch { /* offline: keep what we have */ }
  }, [api])

  useEffect(() => {
    const first = setTimeout(load, 0)
    const t = setInterval(load, 60000)
    const f = () => document.visibilityState === 'visible' && load()
    document.addEventListener('visibilitychange', f)
    return () => { clearTimeout(first); clearInterval(t); document.removeEventListener('visibilitychange', f) }
  }, [load])

  useEffect(() => {
    if (!open) return
    const out = (e: MouseEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false) }
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', out); document.addEventListener('keydown', esc)
    return () => { document.removeEventListener('mousedown', out); document.removeEventListener('keydown', esc) }
  }, [open])

  const markRead = async (n: N) => {
    if (n.readAt) return
    setItems((l) => l.map((x) => (x.id === n.id ? { ...x, readAt: new Date().toISOString() } : x)))
    setUnread((u) => Math.max(0, u - 1))
    await fetch(`${api}/notifications/${n.id}`, { method: 'PATCH', credentials: 'include', keepalive: true, headers: { 'content-type': 'application/json' }, body: JSON.stringify({ readAt: new Date().toISOString() }) }).catch(() => {})
  }
  const markAll = async () => {
    setItems((l) => l.map((x) => ({ ...x, readAt: x.readAt ?? new Date().toISOString() })))
    setUnread(0)
    await fetch(`${api}/notifications?where[readAt][exists]=false`, { method: 'PATCH', credentials: 'include', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ readAt: new Date().toISOString() }) }).catch(() => {})
  }

  return (
    <div className="edif-bell" ref={box}>
      <button type="button" className="edif-bell__btn" aria-haspopup="dialog" aria-expanded={open} onClick={() => { setOpen((o) => !o); if (!open) load() }}
        aria-label={unread ? `Notifications, ${unread} unread` : 'Notifications'}>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z" /><path d="M10 21h4" /></svg>
        {unread > 0 && <span className="edif-bell__n" aria-hidden="true">{unread > 99 ? '99+' : unread}</span>}
      </button>
      {open && (
        <div className="edif-bell__panel" role="dialog" aria-label="Notifications">
          <div className="edif-bell__head">
            <strong>Notifications</strong>
            <button type="button" onClick={markAll} disabled={!unread}>Mark all as read</button>
          </div>
          {items.length === 0 ? (
            <p className="edif-bell__empty">You’re all caught up.</p>
          ) : (
            <ul className="edif-bell__list">
              {items.map((n) => {
                const inner = (
                  <>
                    <span className={`edif-bell__dot edif-bell__dot--${n.kind}`} aria-hidden="true" />
                    <span className="edif-bell__text">
                      <span className="edif-bell__title">{n.title}{!n.readAt && <span className="sr-only"> (unread)</span>}</span>
                      {n.body && <span className="edif-bell__body">{n.body}</span>}
                      <span className="edif-bell__time">{ago(n.createdAt)}</span>
                    </span>
                  </>
                )
                return (
                  <li key={n.id} className={n.readAt ? 'is-read' : 'is-unread'}>
                    {n.link ? <a href={n.link} onClick={() => markRead(n)}>{inner}</a> : <button type="button" onClick={() => markRead(n)}>{inner}</button>}
                  </li>
                )
              })}
            </ul>
          )}
          <a className="edif-bell__all" href={`${admin}/collections/notifications`}>See all notifications</a>
        </div>
      )}
    </div>
  )
}
