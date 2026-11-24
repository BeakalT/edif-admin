'use client'
import React, { useEffect, useState } from 'react'
import { useCountUp } from '@/hooks/use-count-up'
import { ThemeSync } from './DashMore'
import { VisitsChartCard } from '@/components/application/dashboard/visits-chart-card'
import type { DayStat } from './dashFormat'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

function Num({ v }: { v: string }) {
  const n = Number(v)
  const [t, setT] = useState(0)
  useEffect(() => { const id = requestAnimationFrame(() => setT(n)); return () => cancelAnimationFrame(id) }, [n])
  const shown = useCountUp(t, 900)
  return <>{Number.isFinite(n) ? shown : v}</>
}

export type DashStat = { label: string; value: string; note: string; href?: string }

/** At a glance: four separate cards. The first is filled navy with a gold marker, the rest are white with large numbers. */
export function DashStats({ stats }: { stats: DashStat[] }) {
  return (
    <section className="edif-bui edif-rise grid grid-cols-2 gap-4 lg:grid-cols-4" aria-label="At a glance">
      <ThemeSync />
      {stats.map((s, i) => {
        const hero = i === 0
        const inner = (
          <>
            <span className="flex items-center justify-between gap-2">
              <span className={'text-[12px] font-bold tracking-[.12em] uppercase ' + (hero ? 'text-[#E6D7A6]' : 'text-[#85660F]')}>{s.label}</span>
              <i className={'size-2.5 rounded-full ' + (hero ? 'bg-[#E6D7A6]' : 'bg-[#C29B38]')} aria-hidden />
            </span>
            <span className={'mt-3 block text-[2.4rem] leading-none font-extrabold tabular-nums ' + (hero ? 'text-white' : 'text-[var(--navy-t)]')}><Num v={s.value} /></span>
            <span className={'mt-3 block text-[14px] leading-snug ' + (hero ? 'text-white/80' : 'text-[var(--ink-2)]')}>{s.note}</span>
          </>
        )
        const cls = 'block h-full rounded-[18px] border p-5 no-underline shadow-[0_12px_30px_rgba(16,32,64,.08)] transition-transform hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:transform-none ' + (hero ? 'border-transparent bg-gradient-to-br from-[#25427F] to-[#14244f]' : 'border-[var(--sheet-line)] bg-[var(--sheet)]')
        return s.href ? <a key={s.label} href={s.href} className={cls}>{inner}</a> : <div key={s.label} className={cls}>{inner}</div>
      })}
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
      <WeeklyBars cur={cur} prev={prev} />
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

/** Visits by week: this period in navy, the one before in gold, side by side. */
function WeeklyBars({ cur, prev }: { cur: DayStat[]; prev: DayStat[] }) {
  const sum = (a: DayStat[]) => a.reduce((n, d) => n + d.n, 0)
  const wk = (d?: DayStat) => (d ? new Date(d.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'Africa/Addis_Ababa' }) : '')
  const weeks = Array.from({ length: Math.ceil(cur.length / 7) }, (_, i) => ({ week: wk(cur[i * 7]), now: sum(cur.slice(i * 7, i * 7 + 7)), before: sum(prev.slice(i * 7, i * 7 + 7)) }))
  if (weeks.length < 2) return null
  return (
    <section className="rounded-[18px] border border-[var(--sheet-line)] bg-[var(--sheet)] p-5 shadow-[0_10px_28px_rgba(16,32,64,.07)]" aria-label="Visits by week">
      <div className="flex items-center justify-between gap-3">
        <h3 className="flex items-center gap-2.5 text-[15px] font-bold text-[var(--navy-t)]"><span className="h-0.5 w-3.5 rounded bg-[#C29B38]" aria-hidden />Visits per week</h3>
        <p className="flex gap-3 text-[12px] text-[var(--ink-2)]"><span className="flex items-center gap-1.5"><i className="size-2.5 rounded-sm bg-[#C29B38]" />Before</span><span className="flex items-center gap-1.5"><i className="size-2.5 rounded-sm bg-[#1E3570]" />Latest</span></p>
      </div>
      <div className="mt-3 h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weeks} barGap={4} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--hair)" />
            <XAxis dataKey="week" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: 'var(--ink-3)' }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: 'var(--ink-3)' }} allowDecimals={false} />
            <Tooltip cursor={{ fill: 'var(--chip)' }} contentStyle={{ borderRadius: 10, border: '1px solid var(--sheet-line)', fontSize: 13 }} />
            <Bar dataKey="before" name="Previous period" fill="#C29B38" radius={[5, 5, 0, 0]} maxBarSize={18} isAnimationActive={false} />
            <Bar dataKey="now" name="This period" fill="#1E3570" radius={[5, 5, 0, 0]} maxBarSize={18} isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
