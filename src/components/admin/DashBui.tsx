'use client'
import './dash.css'
import React, { useEffect, useState } from 'react'
import { useCountUp } from '@/hooks/use-count-up'
import { ThemeSync } from './DashMore'
import { VisitsChartCard } from '@/components/application/dashboard/visits-chart-card'
import type { DayStat } from './dashFormat'

function Num({ v }: { v: string }) {
  const n = Number(v)
  const [t, setT] = useState(0)
  useEffect(() => { const id = requestAnimationFrame(() => setT(n)); return () => cancelAnimationFrame(id) }, [n])
  const shown = useCountUp(t, 900)
  return <>{Number.isFinite(n) ? shown : v}</>
}

export type DashStat = { label: string; value: string; note: string; href?: string }

/** At a glance: four numbers, each with a plain sentence, in one calm card. */
export function DashStats({ stats }: { stats: DashStat[] }) {
  return (
    <section className="edif-bui edif-rise rounded-[18px] border border-[var(--sheet-line)] bg-[var(--sheet)] p-5 shadow-[0_10px_28px_rgba(16,32,64,.07)]" aria-label="At a glance">
      <ThemeSync />
      <dl className="grid grid-cols-2 gap-y-5 lg:grid-cols-4">
        {stats.map((s, i) => {
          const inner = (<><dt className="text-[12px] font-bold tracking-[.12em] text-[#85660F] uppercase">{s.label}</dt><dd className="mt-1.5 text-[2.1rem] leading-none font-extrabold tabular-nums text-[var(--navy-t)]"><Num v={s.value} /></dd><dd className="mt-2 text-[14px] leading-snug text-[var(--ink-2)]">{s.note}</dd></>)
          return <div key={s.label} className={'px-5 ' + (i > 0 ? 'lg:border-s lg:border-[var(--hair)] ' : 'lg:ps-0 ') + (i % 2 === 1 ? 'border-s border-[var(--hair)] lg:border-s' : '')}>{s.href ? <a href={s.href} className="block no-underline">{inner}</a> : inner}</div>
        })}
      </dl>
    </section>
  )
}

const pageName = (p: string) => {
  if (!p || p === '/') return 'Home'
  const seg = decodeURIComponent(p.replace(/^\//, '').split('/')[0] || '')
  return seg ? seg.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : 'Home'
}

/** Visits: last 30 days against the 30 before, with BoardUI's hover-readout area chart, plus the most visited pages. */
export function DashVisits({ days }: { days: DayStat[] }) {
  const cur = days.slice(-30)
  const prev = days.slice(-60, -30)
  const data = cur.map((d, i) => ({ label: d.date, current: d.n, previous: prev[i]?.n ?? 0 }))
  const m: Record<string, number> = {}
  for (const d of cur) for (const [p, n] of Object.entries(d.paths)) m[p] = (m[p] || 0) + n
  const top = Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, 5)
  const max = Math.max(1, ...top.map((t) => t[1]))
  return (
    <div className="edif-bui flex flex-col gap-4">
      <VisitsChartCard data={data} />
      {top.length > 0 && (
        <section className="rounded-[18px] border border-[var(--sheet-line)] bg-[var(--sheet)] p-5 shadow-[0_10px_28px_rgba(16,32,64,.07)]">
          <h3 className="flex items-center gap-2.5 text-[15px] font-bold text-[var(--navy-t)]"><span className="h-0.5 w-3.5 rounded bg-[#C29B38]" aria-hidden />Most visited pages, last 30 days</h3>
          <ul className="mt-3 flex flex-col gap-3">
            {top.map(([p, n]) => (
              <li key={p} className="grid grid-cols-[110px_1fr_auto] items-center gap-3 text-body-2-medium text-text-primary">
                <span className="truncate">{pageName(p)}</span>
                <span className="h-2 rounded-full bg-background-tertiary-default"><span className="block h-2 rounded-full bg-chart-2-active" style={{ width: `${(n / max) * 100}%` }} /></span>
                <span className="tabular-nums text-text-secondary">{n}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
