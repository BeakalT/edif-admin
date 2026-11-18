'use client'
import React, { useEffect, useState } from 'react'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { useConfig, useListQuery } from '@payloadcms/ui'
import { TABS } from '@/lib/auditSummary'

/** Filter tabs for the audit log: All | Edits | Publishing | Sign-ins | Security | Deletions, each with a count. */
export const AuditTabs: React.FC = () => {
  const pathname = usePathname()
  const params = useSearchParams()
  const router = useRouter()
  const { config } = useConfig()
  const { data } = useListQuery()
  const api = config.routes.api
  const [counts, setCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    let alive = true
    ;(async () => {
      const next: Record<string, number> = {}
      await Promise.all(TABS.map(async (t) => {
        const q = new URLSearchParams({ limit: '1', depth: '0' })
        if (t.actions) q.set('where[action][in]', t.actions.join(','))
        try { const r = await fetch(`${api}/audit-log?${q}`, { credentials: 'include' }); if (r.ok) next[t.label] = (await r.json()).totalDocs } catch { /* count is optional */ }
      }))
      if (alive) setCounts(next)
    })()
    return () => { alive = false }
  }, [api, data?.totalDocs])

  const raw = decodeURIComponent(params.toString())
  const isActive = (t: (typeof TABS)[number]) => (t.actions ? raw.includes(`[action][in]=${t.actions.join(',')}`) : !raw.includes('[action]'))
  const go = (t: (typeof TABS)[number]) => {
    const q = new URLSearchParams(params.toString())
    for (const k of [...q.keys()]) if (k.startsWith('where') || k === 'page') q.delete(k)
    if (t.actions) q.set('where[and][0][action][in]', t.actions.join(','))
    router.push(`${pathname}${q.toString() ? '?' + q : ''}`)
  }
  return (
    <ul className="edif-status-tabs" aria-label="Filter the log">
      {TABS.map((t, i) => (
        <li key={t.label}>
          <button type="button" onClick={() => go(t)} aria-pressed={isActive(t)} className={isActive(t) ? 'is-active' : undefined}>
            {t.label}{counts[t.label] !== undefined && <span className="edif-status-tabs__n">{counts[t.label]}</span>}
          </button>
          {i < TABS.length - 1 && <span className="edif-status-tabs__sep" aria-hidden="true">|</span>}
        </li>
      ))}
    </ul>
  )
}
