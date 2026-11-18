'use client'
import React, { useEffect, useState } from 'react'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { useConfig, useListQuery } from '@payloadcms/ui'

/**
 * WordPress-style status tabs above a list: All (12) | Published (9) | Draft (2) | In review (1) ...
 * Counts come from the same API the list uses, so they follow the signed-in person's permissions.
 */
type Tab = { label: string; field?: string; value?: string }
const TABS: Tab[] = [
  { label: 'All' },
  { label: 'Published', field: '_status', value: 'published' },
  { label: 'Draft', field: '_status', value: 'draft' },
  { label: 'Ready for review', field: 'reviewStatus', value: 'in_review' },
  { label: 'Changes requested', field: 'reviewStatus', value: 'changes_requested' },
]

export const StatusTabs: React.FC<{ collectionSlug?: string }> = () => {
  const pathname = usePathname()
  const params = useSearchParams()
  const router = useRouter()
  const { config } = useConfig()
  const { data } = useListQuery()
  const slug = pathname.split('/collections/')[1]?.split('/')[0] ?? ''
  const api = config.routes.api
  const [counts, setCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    if (!slug) return
    let alive = true
    ;(async () => {
      const next: Record<string, number> = {}
      await Promise.all(TABS.map(async (t) => {
        const q = new URLSearchParams({ limit: '1', depth: '0', draft: 'true' })
        if (t.field) q.set(`where[${t.field}][equals]`, t.value as string)
        try {
          const r = await fetch(`${api}/${slug}?${q}`, { credentials: 'include' })
          if (r.ok) next[t.label] = (await r.json()).totalDocs
        } catch { /* a missing count just hides the number */ }
      }))
      if (alive) setCounts(next)
    })()
    return () => { alive = false }
  }, [slug, api, data?.totalDocs])

  const raw = decodeURIComponent(params.toString())
  const isActive = (t: Tab) => (t.field ? raw.includes(`[${t.field}][equals]=${t.value}`) : !raw.includes('[equals]='))
  const go = (t: Tab) => {
    const q = new URLSearchParams(params.toString())
    for (const k of [...q.keys()]) if (k.startsWith('where') || k === 'page') q.delete(k)
    if (t.field) q.set(`where[and][0][${t.field}][equals]`, t.value as string)
    router.push(`${pathname}${q.toString() ? '?' + q : ''}`)
  }

  const shown = TABS.filter((t) => !t.field || t.field !== 'reviewStatus' || (counts[t.label] ?? 0) > 0 || isActive(t))
  return (
    <ul className="edif-status-tabs" aria-label="Filter by status">
      {shown.map((t, i) => (
        <li key={t.label}>
          <button type="button" onClick={() => go(t)} aria-pressed={isActive(t)} className={isActive(t) ? 'is-active' : undefined}>
            {t.label}{counts[t.label] !== undefined && <span className="edif-status-tabs__n">{counts[t.label]}</span>}
          </button>
          {i < shown.length - 1 && <span className="edif-status-tabs__sep" aria-hidden="true">|</span>}
        </li>
      ))}
    </ul>
  )
}
