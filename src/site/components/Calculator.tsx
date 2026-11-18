'use client'
import { useRef, useState } from 'react'
import { useCms } from '../cms-context'
import { LIMIT } from '../data/content'
import { Tween } from './motion'

const fmt = (n: number) => Math.round(n).toLocaleString('en-US')
type Row = { i: string; b: number }
const EXAMPLE: Row[] = [
  { i: 'Commercial Bank of Ethiopia', b: 65000 },
  { i: 'Commercial Bank of Ethiopia', b: 50000 },
  { i: 'Awash Bank', b: 30000 },
]

export default function Calculator() {
  const { banks, microfinance } = useCms()
  const BANKS = banks.map((b) => b.name)
  const MFIS = microfinance.map((m) => m.name)
  const [rows, setRows] = useState<Row[]>([{ i: '', b: 0 }])
  const [example, setExample] = useState(false)
  const [focusIdx, setFocusIdx] = useState<number | null>(null)
  const box = useRef<HTMLDivElement>(null)
  const calcRef = useRef<HTMLDivElement>(null)

  const update = (n: number, patch: Partial<Row>) => {
    setRows((r) => r.map((x, k) => (k === n ? { ...x, ...patch } : x)))
    setExample(false)
  }
  const focusLast = () => requestAnimationFrame(() => box.current?.querySelector<HTMLSelectElement>('.acct:last-child select')?.focus())

  const groups = new Map<string, { t: number; n: number }>()
  let pending = 0
  rows.forEach((r) => {
    if (!r.b) return
    if (!r.i) { pending++; return }
    const g = groups.get(r.i) || { t: 0, n: 0 }
    g.t += r.b; g.n++; groups.set(r.i, g)
  })
  let prot = 0, over = 0
  const list = [...groups].map(([k, g]) => {
    const p = Math.min(g.t, LIMIT), o = Math.max(0, g.t - LIMIT)
    prot += p; over += o
    const scale = Math.max(LIMIT * 1.25, g.t)
    return { k, g, p, o, pw: (p / scale) * 100, ow: (o / scale) * 100, lim: (LIMIT / scale) * 100 }
  })
  const dirty = rows.length > 1 || rows.some((r) => r.i || r.b)

  return (
    <div className="calc" ref={calcRef}>
      <form className="calc-form" onSubmit={(e) => e.preventDefault()} noValidate>
        <div className="calc-top">
          <span className="legend" id="acc-legend">Your accounts</span>
          <button type="button" className="ex-btn" onClick={() => {
            setRows(EXAMPLE.map((r) => ({ ...r }))); setExample(true)
            calcRef.current?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' })
          }}>Show an example</button>
        </div>
        <div className="row-labels" aria-hidden="true"><span>Bank or microfinance institution</span><span>Balance</span><span /></div>
        <div className="rows" ref={box} role="group" aria-labelledby="acc-legend">
          {rows.map((r, n) => (
            <div key={n} className={'acct' + (r.b > 0 && !r.i ? ' need' : '')}>
              <label className="sr" htmlFor={'inst' + n}>Account {n + 1}: institution</label>
              <select className={'field inst-sel' + (r.i ? '' : ' is-empty')} id={'inst' + n} value={r.i} onChange={(e) => update(n, { i: e.target.value })}>
                <option value="" disabled>Choose bank or MFI</option>
                <optgroup label="Banks">{BANKS.map((b) => <option key={b}>{b}</option>)}</optgroup>
                <optgroup label="Microfinance institutions">{MFIS.map((b) => <option key={b}>{b}</option>)}</optgroup>
              </select>
              <label className="sr" htmlFor={'bal' + n}>Account {n + 1}: balance in Birr</label>
              <span className="money">
                <input className="field num" id={'bal' + n} inputMode="numeric" autoComplete="off" placeholder="0"
                  value={focusIdx === n ? (r.b ? String(r.b) : '') : (r.b ? fmt(r.b) : '')}
                  onFocus={() => setFocusIdx(n)} onBlur={() => setFocusIdx(null)}
                  onChange={(e) => { const d = e.target.value.replace(/\D/g, ''); update(n, { b: d ? Math.min(+d, 999999999) : 0 }) }} />
              </span>
              <button className="rm" type="button" aria-label={'Remove account ' + (n + 1)} disabled={rows.length < 2}
                onClick={() => { setRows((x) => x.filter((_, k) => k !== n)); setExample(false) }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
              </button>
              <p className="hint">Choose the institution for this account.</p>
            </div>
          ))}
        </div>
        <div className="calc-actions">
          <button className="add" type="button" disabled={rows.length >= 8} onClick={() => { setRows((x) => [...x, { i: '', b: 0 }]); focusLast() }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>Add another account
          </button>
          {dirty && <button className="clear" type="button" onClick={() => { setRows([{ i: '', b: 0 }]); setExample(false); focusLast() }}>Clear all</button>}
        </div>
      </form>
      <div className="calc-out" aria-live="polite">
        <div className="out-head"><span className="label">Your result</span>{example && <span className="ex-tag">Example figures</span>}</div>
        <div className="totals">
          <div className="t-main">
            <span className="t-k">Protected</span>
            <b className="num">Birr <Tween value={prot} /></b>
            <small>{groups.size ? (groups.size > 1 ? `Across ${groups.size} institutions` : 'At 1 institution') : 'Up to Birr 100,000 at each institution'}</small>
          </div>
          <div className={'t-side' + (over ? ' warn' : '')}>
            <span className="t-k">Not protected</span>
            <b className="num">Birr <Tween value={over} /></b>
            <small>{over ? 'Above the limit' : 'Nothing above the limit'}</small>
          </div>
        </div>
        {!groups.size && <p className="res-hint">{pending ? 'Choose the institution for each account to see your result.' : 'Enter a balance to see how much is protected.'}</p>}
        {example && <p className="ex-explain">Two accounts at the same bank are added together (Birr 115,000), so Birr 15,000 is above the limit. The account at the second bank is protected separately.</p>}
        {groups.size > 0 && (
          <ul className="groups">
            {list.map(({ k, g, p, o, pw, ow, lim }, i) => (
              <li key={k} className={o ? 'is-over' : 'is-ok'} style={{ ['--i' as string]: i }}>
                <div className="g-top"><strong>{k}</strong><span className="num">Birr {fmt(g.t)}</span></div>
                <small>{g.n > 1 ? `${g.n} accounts added together` : '1 account'}</small>
                <span className="meter" aria-hidden="true">
                  <i className="ok" style={{ width: pw + '%' }} /><i className="over" style={{ left: pw + '%', width: ow + '%' }} /><i className="lim" style={{ left: lim + '%' }}><b>100,000</b></i>
                </span>
                <p className="g-status">
                  {o ? <><span className="warn-t">Birr {fmt(o)} above the limit</span> · Birr {fmt(p)} protected</> : <span className="ok-t">Fully protected</span>}
                </p>
              </li>
            ))}
          </ul>
        )}
        {pending > 0 && groups.size > 0 && <p className="pending">{pending === 1 ? '1 account needs' : pending + ' accounts need'} an institution before it can be counted.</p>}
        <p className="calc-note">An estimate only. At payout, the Fund nets off any matured loans and deposits held as collateral, and confirms each depositor’s amount.</p>
      </div>
    </div>
  )
}
