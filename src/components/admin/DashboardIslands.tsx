'use client'
import React, { useMemo, useState, useSyncExternalStore } from 'react'
import { I } from './dashIcons'
import { ACTION_ICON, byDay, hhmm, type ActivityItem, type DayStat } from './dashFormat'

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
  return (
    <section className="edif-pane edif-pane--visits">
      <header>
        <span className="edif-pane__badge edif-pane__badge--blue"><I n="chart" /></span>
        <h4>Visits, last {range} days</h4>
        <div className="edif-seg" role="group" aria-label="Time range">
          {([7, 30] as const).map((r) => <button key={r} type="button" aria-pressed={range === r} onClick={() => { setRange(r); setSel(null) }}>{r} days</button>)}
        </div>
      </header>
      <div className="edif-pane__big">{v.total}<small>visits</small>
        {v.delta !== null && <span className={'edif-delta ' + (v.delta >= 0 ? 'is-up' : 'is-down')}><I n={v.delta >= 0 ? 'up' : 'down'} />{Math.abs(v.delta)}%<em>vs previous {range} days</em></span>}
      </div>
      <div className={'edif-bars' + (dense ? ' is-dense' : '')} style={{ gridTemplateColumns: `repeat(${v.cur.length}, 1fr)` }} role="group" aria-label="Visits per day. Choose a day to see its top pages.">
        {v.cur.map((d, k) => (
          <button type="button" key={d.key} aria-pressed={sel === d.key} aria-label={`${d.label} ${d.date}: ${d.n} visits`} title={`${d.label} ${d.date}: ${d.n}`}
            className={'edif-bars__col' + (k === v.cur.length - 1 ? ' is-today' : '') + (sel === d.key ? ' is-picked' : '')} onClick={() => setSel(sel === d.key ? null : d.key)}>
            <span className="edif-bars__n">{d.n || ''}</span>
            <i style={{ height: `${Math.max(d.n ? 8 : 3, (d.n / v.peak) * 100)}%` }} />
            <em>{dense ? (k % 5 === 0 || k === v.cur.length - 1 ? d.date.split(' ')[0] : '') : d.label}</em>
          </button>
        ))}
      </div>
      <p className="edif-pane__sub" aria-live="polite">
        {picked ? <><strong>{picked.label} {picked.date}</strong> · {picked.n} {picked.n === 1 ? 'visit' : 'visits'}<button type="button" onClick={() => setSel(null)}>Show whole period</button></> : 'Top pages'}
      </p>
      {top.length ? <ul className="edif-top">{top.map(([p, n]) => <li key={p}><span>{p}</span><b>{n}</b><i style={{ width: `${Math.max(3, (n / max) * 100)}%` }} /></li>)}</ul> : <p className="edif-att__ok">No visits recorded for this period.</p>}
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
  const shown = items.filter((i) => active.test(i.action))
  return (
    <section className="edif-tl">
      <div className="edif-chips" role="group" aria-label="Filter activity">
        {chips.map((c) => <button key={c.k} type="button" aria-pressed={active.k === c.k} onClick={() => setF(c.k)}>{c.l}<b>{c.n}</b></button>)}
      </div>
      {byDay(shown).map((d) => (
        <div className="edif-tl__day" key={d.label}>
          <h4>{d.label}</h4>
          <ol>{d.items.map((g) => (
            <li key={g.id} className={`edif-tl__i edif-tl__i--${g.action}`}>
              <span className="edif-tl__dot"><I n={ACTION_ICON[g.action] || 'changes'} /></span>
              <div><p>{g.text}{g.count > 1 && <b className="edif-tl__x">×{g.count}</b>}</p><time dateTime={g.at}>{hhmm(g.at)}</time></div>
            </li>
          ))}</ol>
        </div>
      ))}
      {!shown.length && <p className="edif-att__ok">Nothing of this kind in the latest events.</p>}
      <a className="edif-tl__all" href={href}>Full activity log<I n="arrow" /></a>
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
