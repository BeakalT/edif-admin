'use client'
import React, { useMemo, useState, useSyncExternalStore } from 'react'
import { I } from './dashIcons'
import { byDay, hhmm, type ActivityItem, type DayStat } from './dashFormat'

const pageName = (p: string) => {
  if (!p || p === '/') return 'Home'
  const seg = decodeURIComponent(p.replace(/^\//, '').split('/')[0] || '')
  if (!seg) return 'Home'
  return seg.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

const sum = (l: DayStat[]) => l.reduce((a, d) => a + d.n, 0)
const topOf = (list: DayStat[]) => {
  const m: Record<string, number> = {}
  for (const d of list) for (const [p, n] of Object.entries(d.paths)) m[p] = (m[p] || 0) + n
  return Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, 5)
}

/** Visits: 7 or 30 days, with a click on any bar to see that day's top pages. */
export const VisitsPanel: React.FC<{ days: DayStat[] }> = ({ days }) => {
  const [range, setRange] = useState<7 | 30>(7)
  const [sel, setSel] = useState<string | null>(null)
  const v = useMemo(() => {
    const cur = days.slice(-range)
    const prev = sum(days.slice(-2 * range, -range))
    const total = sum(cur)
    return { cur, total, delta: prev > 0 ? Math.round(((total - prev) / prev) * 100) : null, peak: Math.max(1, ...cur.map((d) => d.n)), top: topOf(cur) }
  }, [days, range])
  const picked = sel ? v.cur.find((d) => d.key === sel) : undefined
  const top = picked ? topOf([picked]) : v.top
  const max = top[0]?.[1] || 1
  const dense = v.cur.length > 7
  const peakAt = v.cur.reduce((best, d, i) => (d.n >= v.cur[best].n ? i : best), 0)
  return (
    <section className="edif-pane edif-pane--visits edif-board__sheet">
      <header className="edif-board__vhead">
        <h3>Visits</h3>
        <span className="edif-board__total">{v.total} this {range === 7 ? 'week' : 'month'}</span>
        <div className="edif-seg" role="group" aria-label="Time range">
          <button type="button" aria-pressed={range === 7} onClick={() => { setRange(7); setSel(null) }}>Week</button>
          <button type="button" aria-pressed={range === 30} onClick={() => { setRange(30); setSel(null) }}>30 days</button>
        </div>
      </header>
      <div className={'edif-bars' + (dense ? ' is-dense' : '')} style={{ gridTemplateColumns: `repeat(${v.cur.length}, 1fr)` }} role="group" aria-label="Visits per day. Choose a day to see its top pages.">
        {v.cur.map((d, k) => (
          <button type="button" key={d.key} aria-pressed={sel === d.key} aria-label={`${d.label} ${d.date}: ${d.n} visits`} title={`${d.label} ${d.date}: ${d.n}`}
            className={'edif-bars__col' + (k === peakAt && d.n > 0 ? ' is-peak' : '') + (!d.n ? ' is-empty' : '') + (sel === d.key ? ' is-picked' : '')} onClick={() => setSel(sel === d.key ? null : d.key)}>
            <i style={{ height: d.n ? `${Math.max(8, (d.n / v.peak) * 100)}%` : undefined }} />
            <em>{dense ? (k % 5 === 0 || k === v.cur.length - 1 ? d.date.split(' ')[0] : '') : d.label}</em>
          </button>
        ))}
      </div>
      <p className="edif-pane__sub" aria-live="polite">
        {picked ? <><strong>{picked.label} {picked.date}</strong> · {picked.n} {picked.n === 1 ? 'visit' : 'visits'}<button type="button" onClick={() => setSel(null)}>Show whole period</button></> : 'Top pages'}
      </p>
      {top.length ? <ul className="edif-board__ranks">{top.map(([p, n]) => <li key={p}><span>{pageName(p)}</span><i><b style={{ width: `${Math.max(4, (n / max) * 100)}%` }} /></i><b>{n}</b></li>)}</ul> : <p className="edif-board__clear">No visits recorded for this period.</p>}
    </section>
  )
}

const FILTERS: { k: string; l: string; test: (a: string) => boolean }[] = [
  { k: 'all', l: 'All', test: () => true },
  { k: 'security', l: 'Security', test: (a) => a === 'security' },
  { k: 'signins', l: 'Sign-ins', test: (a) => a === 'login' || a === 'logout' },
  { k: 'edits', l: 'Edits', test: (a) => ['create', 'update', 'delete', 'submit'].includes(a) },
  { k: 'publishing', l: 'Publishing', test: (a) => a === 'publish' || a === 'unpublish' },
]

/** Recent activity with filter chips, so security events do not get lost among routine edits. */
export const ActivityFeed: React.FC<{ items: ActivityItem[]; href: string }> = ({ items, href }) => {
  const [f, setF] = useState('all')
  const chips = FILTERS.map((x) => ({ ...x, n: items.filter((i) => x.test(i.action)).length })).filter((x) => x.k === 'all' || x.n > 0)
  const active = chips.find((c) => c.k === f) || chips[0]
  const shown = items.filter((i) => active.test(i.action)).slice(0, 6)
  return (
    <section className="edif-tl edif-board__sheet">
      <header className="edif-board__acthead">
        <h3>Recent activity</h3>
        <div className="edif-seg" role="group" aria-label="Filter activity">
          {chips.map((c) => <button key={c.k} type="button" aria-pressed={active.k === c.k} onClick={() => setF(c.k)}>{c.l}<b>{c.n}</b></button>)}
        </div>
      </header>
      {byDay(shown).map((d) => (
        <div className="edif-tl__day" key={d.label}>
          <h4>{d.label}</h4>
          <ol>{d.items.map((g) => (
            <li key={g.id} className={`edif-tl__i edif-tl__i--${g.action}`}>
              <p>{g.text}{g.count > 1 ? ` (${g.count})` : ''}</p>
              <time dateTime={g.at}>{hhmm(g.at)}</time>
            </li>
          ))}</ol>
        </div>
      ))}
      {!shown.length && <p className="edif-board__clear">Nothing of this kind in the latest events.</p>}
      <a className="edif-board__more" href={href}>Full activity log</a>
    </section>
  )
}

const listeners = new Set<() => void>()
const subscribe = (cb: () => void) => { listeners.add(cb); window.addEventListener('storage', cb); return () => { listeners.delete(cb); window.removeEventListener('storage', cb) } }
const isSnoozed = (key: string) => { try { return Number(localStorage.getItem(key)) > Date.now() } catch { return false } /* storage blocked: never hide */ }
const notify = () => listeners.forEach((f) => f())

/** A row on an attention card that can be hidden for a day on this browser. The count above it is unchanged. */
export const Snoozable: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => {
  const key = `edif-snooze:${id}`
  const snoozed = useSyncExternalStore(subscribe, () => isSnoozed(key), () => false)
  const snooze = () => { try { localStorage.setItem(key, String(Date.now() + 864e5)) } catch { /* ignore */ } notify() }
  const undo = () => { try { localStorage.removeItem(key) } catch { /* ignore */ } notify() }
  if (snoozed) return <li className="edif-snz is-snoozed"><span>Snoozed for a day</span><button type="button" onClick={undo}>Undo</button></li>
  return (
    <li className="edif-snz">
      {children}
      <button type="button" className="edif-snz__btn" onClick={snooze} aria-label="Snooze this for a day" title="Snooze for a day"><I n="clock" /></button>
    </li>
  )
}
