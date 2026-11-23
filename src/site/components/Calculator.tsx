'use client'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { useCms } from '../cms-context'
import { LIMIT } from '../data/content'
import { Tween } from './motion'

const fmt = (n: number) => Math.round(n).toLocaleString('en-US')
type Row = { i: string; b: number }
/** Example accounts use real members: Commercial Bank of Ethiopia and Awash Bank when listed, otherwise the first two names. */
function exampleRows(names: string[]): Row[] {
  const a = names.find((n) => /commercial bank of ethiopia/i.test(n)) ?? names[0] ?? 'Commercial Bank of Ethiopia'
  const b = names.find((n) => /awash/i.test(n)) ?? names.find((n) => n !== a) ?? a
  return [{ i: a, b: 65000 }, { i: a, b: 50000 }, { i: b, b: 30000 }]
}

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
  const total = prot + over
  const settled = total > 0 && pending === 0
  useEffect(() => {
    if (!settled) return
    const t = setTimeout(() => toast.success(`Birr ${fmt(prot)} protected` + (over ? `, Birr ${fmt(over)} not protected` : ', nothing above the limit'), { id: 'calc-result', duration: 5000 }), 1400)
    return () => clearTimeout(t)
  }, [settled, prot, over])
  const copyResult = async () => {
    const lines = list.map(({ k, g, p, o }) => `${k}: Birr ${fmt(g.t)} (protected Birr ${fmt(p)}${o ? `, not protected Birr ${fmt(o)}` : ''})`)
    const text = `EDIF coverage estimate\n${lines.join('\n')}\nProtected: Birr ${fmt(prot)}. Not protected: Birr ${fmt(over)}.\nAn estimate only: the Fund confirms each depositor's amount at payout.`
    try { await navigator.clipboard.writeText(text); toast.success('Result copied', { id: 'calc-copy', duration: 3000 }) }
    catch { toast.error('Could not copy. You can select the figures and copy them instead.', { id: 'calc-copy' }) }
  }
  const dirty = rows.length > 1 || rows.some((r) => r.i || r.b)

  return (
    <div className="calc" ref={calcRef}>
      <form className="calc-form" onSubmit={(e) => e.preventDefault()} noValidate>
        <div className="calc-top">
          <span className="legend" id="acc-legend">Your accounts</span>
          <button type="button" className="ex-btn" onClick={() => {
            setRows(exampleRows(BANKS.length ? BANKS : MFIS)); setExample(true)
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
        {groups.size > 0 ? (
          <>
            <div className="totals">
              <div className="t-main">
                <span className="t-k">Protected</span>
                <b className="num">Birr <Tween value={prot} /></b>
                <small>{groups.size > 1 ? `Across ${groups.size} institutions` : 'At 1 institution'}</small>
              </div>
              <div className={'t-side' + (over ? ' warn' : '')}>
                <span className="t-k">Not protected</span>
                <b className="num">Birr <Tween value={over} /></b>
                <small>{over ? 'Above the limit' : 'Nothing above the limit'}</small>
              </div>
            </div>
            <div className="split" aria-hidden="true">
              <i className="split-ok" style={{ width: (total ? (prot / total) * 100 : 0) + '%' }} />
              <i className="split-over" style={{ width: (total ? (over / total) * 100 : 0) + '%' }} />
            </div>
          </>
        ) : (
          <div className="calc-empty">
            <p className="empty-lead">Each depositor is protected up to <strong>Birr {fmt(LIMIT)}</strong> at each member institution.</p>
            <div className="split is-empty" aria-hidden="true"><i className="split-lim" /></div>
            <p className="empty-key"><span>Birr 0</span><span>Birr {fmt(LIMIT)} limit</span></p>
          </div>
        )}
        {!groups.size && <p className="res-hint">{pending ? 'Choose the institution for each account to see your result.' : 'Enter a balance to see how much is protected.'}</p>}
        {example && list.length > 1 && <p className="ex-explain">Two accounts at the same bank are added together (Birr {fmt(list[0].g.t)}), so Birr {fmt(list[0].o)} is above the limit. The account at the second bank is protected separately.</p>}
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
        {groups.size > 0 && <button type="button" className="calc-copybtn" onClick={copyResult}>Copy result</button>}
        <p className="calc-note">An estimate only. At payout, the Fund nets off any matured loans and deposits held as collateral, and confirms each depositor’s amount.</p>
      </div>
    </div>
  )
}
