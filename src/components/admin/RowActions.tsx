'use client'
import React, { useEffect } from 'react'
import { useConfig } from '@payloadcms/ui'

/**
 * WordPress-style row actions: hover a row in any list and "Edit | Preview | Trash" appear under the title.
 * Trash is the recoverable kind (it goes to the Trash tab); the server still decides who may do it.
 */
const PREVIEWABLE = new Set(['pages', 'news', 'tenders', 'vacancies', 'events'])

export const RowActions: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { config } = useConfig()
  const api = config.routes.api

  useEffect(() => {
    const decorate = () => {
      const canTrash = [...document.querySelectorAll('.list-header a, .list-header button')].some((e) => e.textContent?.trim() === 'Trash')
      document.querySelectorAll('.table tbody td.cell-title, .table tbody td.cell-name, .table tbody td.cell-label, .table tbody td.cell-subject').forEach((td) => {
        if (td.querySelector('.edif-row-actions')) return
        const a = td.querySelector('a[href*="/collections/"]') as HTMLAnchorElement | null
        const m = a?.getAttribute('href')?.match(/\/collections\/([^/]+)\/([^/?#]+)/)
        if (!a || !m || m[2] === 'create' || m[2] === 'trash') return
        const [, slug, id] = m
        const box = document.createElement('div')
        box.className = 'edif-row-actions'
        const link = (label: string, href: string, extra = '') => {
          const el = document.createElement('a'); el.href = href; el.textContent = label; if (extra) el.className = extra
          box.append(el); return el
        }
        link('Edit', a.getAttribute('href') as string)
        if (PREVIEWABLE.has(slug)) { const p = link('Preview', `/preview/${slug}/${id}`); p.target = '_blank'; p.rel = 'noopener' }
        if (canTrash) {
          const t = document.createElement('button'); t.type = 'button'; t.textContent = 'Trash'; t.className = 'is-danger'
          t.addEventListener('click', async () => {
            t.textContent = 'Moving…'; t.disabled = true
            const r = await fetch(`${api}/${slug}/${id}`, { method: 'PATCH', credentials: 'include', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ deletedAt: new Date().toISOString() }) })
            if (r.ok) location.reload(); else { t.textContent = 'Not allowed'; setTimeout(() => { t.textContent = 'Trash'; t.disabled = false }, 2500) }
          })
          box.append(t)
        }
        td.append(box)
      })
    }
    decorate()
    let queued = false
    const mo = new MutationObserver(() => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; decorate() }) })
    mo.observe(document.body, { childList: true, subtree: true })
    return () => mo.disconnect()
  }, [api])

  return <>{children}</>
}
