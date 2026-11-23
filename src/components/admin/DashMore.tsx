'use client'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { cx } from '@/utils/cx'

const SHEET = 'edif-bui edif-rise rounded-[18px] border border-[var(--sheet-line)] bg-[var(--sheet)] p-5 shadow-[0_10px_28px_rgba(16,32,64,.07)]'
const H = 'flex items-center gap-2.5 text-[15px] font-bold text-[var(--navy-t)]'
const Dash = () => <span className="h-0.5 w-3.5 rounded bg-[#C29B38]" aria-hidden />

/** Gives BoardUI's tokens the admin's dark theme: the admin sets data-theme on <html>, BoardUI reads a .dark class. */
export function ThemeSync() {
  useEffect(() => {
    const apply = () => {
      const dark = document.documentElement.getAttribute('data-theme') === 'dark'
      document.querySelectorAll('.edif-bui').forEach((el) => el.classList.toggle('dark', dark))
    }
    apply()
    const mo = new MutationObserver(apply)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    mo.observe(document.body, { childList: true, subtree: true })
    return () => mo.disconnect()
  }, [])
  return null
}

function Emblem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 py-4 text-[14px] text-[var(--ink-2)]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/logoB.svg" alt="" width={34} height={35} className="opacity-60" />
      <p>{text}</p>
    </div>
  )
}

export type ResumeItem = { title: string; kind: string; href: string; ago: string }
export function Resume({ items }: { items: ResumeItem[] }) {
  return (
    <section className={SHEET}>
      <h3 className={H}><Dash />Pick up where you left off</h3>
      {items.length ? (
        <ul className="mt-3 divide-y divide-[var(--hair)]">
          {items.map((r) => (
            <li key={r.href} className="flex items-center justify-between gap-3 py-3">
              <span className="min-w-0"><span className="block truncate text-[15px] font-semibold text-[var(--ink)]">{r.title}</span><span className="text-[13px] text-[var(--ink-2)]">{r.kind} draft, edited {r.ago}</span></span>
              <a href={r.href} className="shrink-0 rounded-full border border-[var(--sheet-line)] px-3.5 py-1.5 text-[13px] font-semibold text-[var(--navy-t)] no-underline hover:bg-[var(--chip)]">Continue</a>
            </li>
          ))}
        </ul>
      ) : <Emblem text="No unfinished drafts. Everything you started has been published." />}
    </section>
  )
}

export type InboxItem = { name: string; subject: string; excerpt: string; ago: string; href: string }
export function Inbox({ items, total, href }: { items: InboxItem[]; total: number; href: string }) {
  return (
    <section className={SHEET}>
      <div className="flex items-baseline justify-between gap-3">
        <h3 className={H}><Dash />From the public</h3>
        {total > 0 && <a href={href} className="text-[13px] font-semibold text-[var(--navy-t)] no-underline">{total} new, open inbox →</a>}
      </div>
      {items.length ? (
        <ul className="mt-3 divide-y divide-[var(--hair)]">
          {items.map((m) => (
            <li key={m.href}>
              <a href={m.href} className="flex items-start gap-3 py-3 no-underline">
                <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-[#1E3570] text-[13px] font-bold text-white">{(m.name.trim()[0] || '?').toUpperCase()}</span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline justify-between gap-3"><b className="truncate text-[15px] text-[var(--ink)]">{m.name}</b><span className="shrink-0 text-[13px] text-[var(--ink-3)]">{m.ago}</span></span>
                  <span className="block truncate text-[14px] text-[var(--ink-2)]">{m.subject ? `${m.subject}: ` : ''}{m.excerpt}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      ) : <Emblem text="No new messages. The inbox is clear." />}
    </section>
  )
}

export type CalEvent = { date: string; kind: 'close' | 'event' | 'publish'; label: string; title: string; href: string; time?: string }
const KIND: Record<CalEvent['kind'], { dot: string; name: string }> = {
  close: { dot: '#C29B38', name: 'Closing date' },
  event: { dot: '#2875BA', name: 'Event' },
  publish: { dot: '#1E3570', name: 'Scheduled to publish' },
}
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const DOW = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const key = (y: number, m: number, d: number) => new Date(Date.UTC(y, m, d)).toISOString().slice(0, 10)
const parse = (k: string) => { const [y, m, d] = k.split('-').map(Number); return { y, m: m - 1, d } }
const addDays = (k: string, n: number) => { const { y, m, d } = parse(k); return key(y, m, d + n) }
const pretty = (k: string) => { const { y, m, d } = parse(k); return new Date(Date.UTC(y, m, d)).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }) }

/** A month calendar: dots show what falls on each day, a click (or arrow keys) opens that day's list. Closing dates, events and scheduled publishes. */
export function DashCalendar({ events, todayKey }: { events: CalEvent[]; todayKey: string }) {
  const t = parse(todayKey)
  const [view, setView] = useState({ y: t.y, m: t.m })
  const [sel, setSel] = useState(todayKey)
  const grid = useRef<HTMLDivElement>(null)
  const byDay = useMemo(() => { const m = new Map<string, CalEvent[]>(); for (const e of events) m.set(e.date, [...(m.get(e.date) || []), e]); return m }, [events])
  const first = new Date(Date.UTC(view.y, view.m, 1))
  const lead = (first.getUTCDay() + 6) % 7
  const total = new Date(Date.UTC(view.y, view.m + 1, 0)).getUTCDate()
  const cells = Array.from({ length: Math.ceil((lead + total) / 7) * 7 }, (_, i) => key(view.y, view.m, i - lead + 1))
  const inMonth = (k: string) => parse(k).m === view.m
  const monthCount = cells.filter((k) => inMonth(k)).reduce((n, k) => n + (byDay.get(k)?.length || 0), 0)
  const go = (n: number) => setView((v) => { const d = new Date(Date.UTC(v.y, v.m + n, 1)); return { y: d.getUTCFullYear(), m: d.getUTCMonth() } })
  const pick = (k: string) => { setSel(k); const p = parse(k); if (p.m !== view.m || p.y !== view.y) setView({ y: p.y, m: p.m }); requestAnimationFrame(() => grid.current?.querySelector<HTMLButtonElement>(`[data-k="${k}"]`)?.focus()) }
  const onKey = (e: React.KeyboardEvent) => {
    const step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key as 'ArrowLeft']
    if (step) { e.preventDefault(); pick(addDays(sel, step)) }
  }
  const chosen = byDay.get(sel) || []
  const nav = 'flex size-9 cursor-pointer items-center bg-transparent p-0 shadow-none justify-center rounded-full border border-[var(--sheet-line)] text-[var(--navy-t)] outline-none hover:bg-[var(--chip)] focus-visible:ring-2 focus-visible:ring-[#2875BA]'
  return (
    <section className={SHEET} aria-label="Calendar">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className={H}><Dash />Calendar</h3>
        <div className="flex items-center gap-2">
          <button type="button" className={nav} onClick={() => go(-1)} aria-label="Previous month">‹</button>
          <span className="min-w-36 text-center text-[15px] font-bold text-[var(--ink)]" aria-live="polite">{MONTHS[view.m]} {view.y}</span>
          <button type="button" className={nav} onClick={() => go(1)} aria-label="Next month">›</button>
          <button type="button" onClick={() => { setView({ y: t.y, m: t.m }); setSel(todayKey) }} className="ms-1 cursor-pointer rounded-full border border-[var(--sheet-line)] bg-transparent px-3.5 py-1.5 text-[13px] font-semibold text-[var(--navy-t)] outline-none hover:bg-[var(--chip)] focus-visible:ring-2 focus-visible:ring-[#2875BA]">Today</button>
        </div>
      </div>
      <div className="mt-4 grid gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div>
          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold tracking-wider text-[var(--ink-3)] uppercase" aria-hidden>{DOW.map((d) => <span key={d} className="py-1">{d}</span>)}</div>
          <div ref={grid} role="group" aria-label={`${MONTHS[view.m]} ${view.y}`} onKeyDown={onKey} className="grid grid-cols-7 gap-1">
            {cells.map((k) => {
              const ev = byDay.get(k) || []
              const isSel = k === sel, isToday = k === todayKey, mine = inMonth(k)
              const kinds = [...new Set(ev.map((e) => e.kind))]
              return (
                <button key={k} type="button" data-k={k} tabIndex={isSel ? 0 : -1} onClick={() => setSel(k)} aria-pressed={isSel}
                  aria-label={`${pretty(k)}${isToday ? ', today' : ''}, ${ev.length ? `${ev.length} ${ev.length === 1 ? 'item' : 'items'}` : 'nothing scheduled'}`}
                  className={cx('relative m-0 flex h-12 w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-0 bg-transparent p-0 text-[14px] shadow-none font-semibold tabular-nums outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#2875BA]',
                    isSel ? 'bg-[#1E3570] text-white' : mine ? 'text-[var(--ink)] hover:bg-[var(--chip)]' : 'text-[var(--ink-3)] opacity-50 hover:bg-[var(--chip)]',
                    isToday && !isSel && 'ring-2 ring-[#C29B38]')}>
                  <span>{parse(k).d}</span>
                  <span className="flex h-1.5 gap-0.5" aria-hidden>{kinds.map((kd) => <i key={kd} className="size-1.5 rounded-full" style={{ background: isSel ? '#E6D7A6' : KIND[kd].dot }} />)}</span>
                </button>
              )
            })}
          </div>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-[var(--ink-2)]">
            {(Object.keys(KIND) as CalEvent['kind'][]).map((kd) => <li key={kd} className="flex items-center gap-1.5"><i className="size-2 rounded-full" style={{ background: KIND[kd].dot }} aria-hidden />{KIND[kd].name}</li>)}
          </ul>
        </div>
        <div className="rounded-xl border border-[var(--hair)] p-4" aria-live="polite">
          <p className="text-[12px] font-bold tracking-[.12em] text-[#85660F] uppercase">{sel === todayKey ? 'Today' : 'Selected day'}</p>
          <p className="mt-0.5 text-[16px] font-bold text-[var(--ink)]">{pretty(sel)}</p>
          {chosen.length ? (
            <ul className="mt-3 divide-y divide-[var(--hair)]">
              {chosen.map((e, i) => (
                <li key={i} className="flex gap-3 py-2.5">
                  <i className="mt-1.5 size-2.5 shrink-0 rounded-full" style={{ background: KIND[e.kind].dot }} aria-hidden />
                  <a href={e.href} className="min-w-0 no-underline"><span className="block text-[12px] font-semibold text-[var(--ink-2)]">{e.label}{e.time ? `, ${e.time}` : ''}</span><span className="block text-[14px] font-semibold text-[var(--ink)]">{e.title}</span></a>
                </li>
              ))}
            </ul>
          ) : <p className="mt-3 text-[14px] text-[var(--ink-2)]">{monthCount ? 'Nothing on this day.' : 'A quiet month: no closing dates, events or scheduled publishes.'}</p>}
        </div>
      </div>
    </section>
  )
}

export type Pulse = { wins: number; topNews?: string; topPub?: string; backup?: { text: string; ok: boolean } }
export function PulseNotes({ p }: { p: Pulse }) {
  const notes: { k: string; v: React.ReactNode; tone?: 'ok' | 'warn' }[] = []
  notes.push({ k: 'Your week', v: p.wins > 0 ? `${p.wins} ${p.wins === 1 ? 'item was' : 'items were'} published or updated on the site.` : 'Nothing new went live this week yet.' })
  if (p.topNews || p.topPub) notes.push({ k: 'Most read', v: [p.topNews && `News: ${p.topNews}`, p.topPub && `Publication: ${p.topPub}`].filter(Boolean).join('. ') + '.' })
  if (p.backup) notes.push({ k: 'Safety net', v: p.backup.text, tone: p.backup.ok ? 'ok' : 'warn' })
  return (
    <section className={cx(SHEET, '!py-4')}>
      <dl className="grid gap-4 md:grid-cols-3 md:gap-0">
        {notes.map((n, i) => (
          <div key={n.k} className={cx('md:px-5', i === 0 && 'md:ps-0', i > 0 && 'md:border-s md:border-[var(--hair)]')}>
            <dt className="flex items-center gap-2 text-[12px] font-bold tracking-[.12em] text-[#85660F] uppercase">{n.tone && <span className={cx('size-2 rounded-full', n.tone === 'ok' ? 'bg-[#3E8E5A]' : 'bg-[#9B3D32]')} aria-hidden />}{n.k}</dt>
            <dd className="mt-1 text-[14px] leading-snug text-[var(--ink)]">{n.v}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
