'use client'
import { useSyncExternalStore } from 'react'
import { Link } from '../router'
import { useCms } from '../cms-context'
import { covered, docKinds, exclusions, img, mainExclusions, payoutSteps, type Doc, type Faq } from '../data/content'
import { type Article, fmtDate } from '../data/news'
import { Arrow, Check, Cross, Curves, Download, TLink } from './ui'
import { CountUp, spotlight, useInView } from './motion'

const short = (n: string) => n.replace(/ Institution$/, '').replace(/ Microfinance Institution/, ' Microfinance')

export function Ticker() {
  const { banks, microfinance } = useCms()
  const rows = [banks.map((b) => b.name), microfinance.map((m) => short(m.name))]
  return (
    <div className="ticker" role="group" aria-label="Member institutions">
      <div className="ticker-head">
        <div>
          <b>Is your bank a member?</b>
          <p>Every bank and microfinance institution licensed in Ethiopia is a member of the Fund.</p>
        </div>
        <TLink to="/members">Find your bank</TLink>
      </div>
      {rows.map((list, r) => (
        <div key={r} className={'marquee' + (r ? ' reverse' : '')}>
          <div className="track">
            {list.map((n) => <span key={n}>{n}</span>)}
            {list.map((n) => <span key={n + '2'} aria-hidden="true">{n}</span>)}
          </div>
        </div>
      ))}
    </div>
  )
}

export function Crowd({ photo = 'workshop.jpg' }: { photo?: string }) {
  const [ref, inView] = useInView<HTMLDivElement>(0.3)
  return (
    <div ref={ref} className={'crowd cv' + (inView ? ' cv-in' : '')}>
      <div className="crowd-fig" aria-hidden="true" style={{ ['--crowd-img' as string]: `url(${img(photo)})` }}>
        <span className="ghost">176M</span>
        <span className="live"><CountUp to={176} run={inView} duration={1800} />M</span>
      </div>
      <p className="sr">176 million depositors.</p>
      <div className="crowd-copy">
        <span className="crowd-k">Depositors in Ethiopia</span>
        <p>About 97% of them, 171 million people, are fully covered up to Birr 100,000.</p>
      </div>
    </div>
  )
}

export function Rules() {
  const [ref, inView] = useInView<HTMLDivElement>(0.3)
  return (
    <div ref={ref} className={'rules cv' + (inView ? ' cv-in' : '')} onPointerMove={spotlight}>
      <span className="glow" aria-hidden="true" />
      <div className="rule-lead">
        <span className="lead-rings" aria-hidden="true"><i /><i /><i /></span>
        <span className="rule-seal" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
            <path pathLength={1} d="M12 2.8 4.5 5.6v6c0 4.6 3.2 8.4 7.5 9.6 4.3-1.2 7.5-5 7.5-9.6v-6z" />
            <path pathLength={1} className="tick" d="m8.6 12 2.4 2.4 4.4-4.6" />
          </svg>
        </span>
        <div>
          <span className="rule-k">Coverage limit</span>
          <b><span className="cur">Birr</span> <CountUp to={100000} run={inView} /></b>
          <span className="rule-bar" aria-hidden="true" />
          <span className="rule-d">The most the Fund repays to one depositor at one institution.</span>
        </div>
      </div>
      <div className="rulei" style={{ ['--i' as string]: 1 }}><div><b>Each institution</b><span>Accounts at different banks or MFIs are protected separately.</span></div></div>
      <div className="rulei" style={{ ['--i' as string]: 2 }}><div><b>Added together</b><span>All your accounts at the same institution are combined, including interest.</span></div></div>
    </div>
  )
}

export function Compare({ full = false }: { full?: boolean }) {
  return (
    <div className="cmp">
      <section className="cmp-col cmp-yes" aria-labelledby="cmp-yes-h">
        <header>
          <p className="cmp-kick">Protected</p>
          <h3 id="cmp-yes-h">Covered</h3>
          <p className="cmp-sub">Eligible deposits at any member bank or microfinance institution.</p>
        </header>
        <ul className="cmp-list">
          {covered.map((c) => <li key={c}><span className="cmp-mark" aria-hidden="true"><Check /></span><span>{c}</span></li>)}
        </ul>
        <aside className="cmp-note">
          <strong>Interest-free deposits are covered on the same terms.</strong>
          <p>Their premiums are kept in a separate account and invested in line with Sharia principles.</p>
          {!full && <TLink to="/deposit-protection/coverage#interest-free">Interest-free coverage</TLink>}
        </aside>
      </section>
      <section className="cmp-col cmp-no" aria-labelledby="cmp-no-h">
        <header>
          <p className="cmp-kick">Excluded</p>
          <h3 id="cmp-no-h">Not covered</h3>
          <p className="cmp-sub">The main exclusions under Regulation No. 482/2021.</p>
        </header>
        <ul className="cmp-list cmp-xl">
          {mainExclusions.map((x) => <li key={x.t}><span className="cmp-mark" aria-hidden="true"><Cross /></span><div><strong>{x.t}</strong><span>{x.d}</span></div></li>)}
        </ul>
        <details className="cmp-all" open={full || undefined}>
          <summary>See all {exclusions.length} exclusions</summary>
          <ol>{exclusions.map((x) => <li key={x}>{x}</li>)}</ol>
        </details>
      </section>
    </div>
  )
}

export function Steps({ more = true }: { more?: boolean }) {
  const [ref, inView] = useInView<HTMLDivElement>(0.25)
  const last = payoutSteps.length - 1
  return (
    <div ref={ref} className={'po cv' + (inView ? ' cv-in' : '')}>
      <div className="po-tl">
        <span className="po-track" aria-hidden="true"><span /></span>
        <ol className="po-steps">
          {payoutSteps.map((s, i) => (
            <li className={'po-step' + (i === last ? ' is-last' : '')} key={s.t} style={{ ['--i' as string]: i }}>
              <span className="po-day">{s.day}</span>
              <span className="po-node" aria-hidden="true">{i + 1}</span>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </li>
          ))}
        </ol>
      </div>
      <div className="po-late">
        <p><strong>Missed the 90 days?</strong> You can still claim for up to five years by giving a justifiable reason for the delay.</p>
        {more && <TLink to="/deposit-protection/payout">Full payout process</TLink>}
      </div>
    </div>
  )
}

/** Wraps matches of the search words in a gold <mark>. Built from text nodes, so nothing is ever injected as HTML. */
function Mark({ text, words }: { text: string; words: string[] }) {
  if (!words.length) return <>{text}</>
  const re = new RegExp('(' + words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')', 'ig')
  return <>{text.split(re).map((part, i) => (i % 2 ? <mark key={i}>{part}</mark> : part))}</>
}

const noopSub = () => () => {}
/** The ?q= search term in the address bar, read without Next's useSearchParams (which would force a Suspense boundary). Empty on the server. */
const useUrlQuery = () => useSyncExternalStore(noopSub, () => new URLSearchParams(window.location.search).get('q') || '', () => '')

/** `highlight` is the /faq page's own search box. Anywhere else (CMS blocks, home, protection pages) the ?q= term from the address bar is used, and matching answers open. */
export function FaqList({ items, openFirst = true, highlight }: { items: Faq[]; openFirst?: boolean; highlight?: string }) {
  const urlQ = useUrlQuery()
  const term = highlight ?? urlQ
  const words = term.trim().split(/\s+/).filter((w) => w.length > 1)
  const hit = (f: Faq) => words.some((w) => (f.q + ' ' + f.a).toLowerCase().includes(w.toLowerCase()))
  const fromUrl = highlight === undefined && words.length > 0
  return (
    <div className="faq">
      {items.map((f, i) => (
        <details key={f.q + (fromUrl ? term : '')} open={(fromUrl ? hit(f) : openFirst && i === 0) ? true : undefined}>
          <summary><span><Mark text={f.q} words={words} /></span><i /></summary>
          <p><Mark text={f.a} words={words} /></p>
        </details>
      ))}
    </div>
  )
}

export function NewsCard({ a }: { a: Article }) {
  return (
    <Link className="ncard" to={'/news/' + a.slug}>
      {a.image ? (
        <div className="img"><img src={img(a.image)} alt={a.imageAlt || ''} loading="lazy" /></div>
      ) : (
        <div className="report">
          <Curves variant="b" />
          <small>{a.kind}</small>
          {a.kind === 'Report'
            ? <strong>2024/25<em>Annual Report</em></strong>
            : a.kind === 'Results'
              ? <strong>Birr 5.2bn<em>in nine months</em></strong>
              : <strong>{a.kind}</strong>}
        </div>
      )}
      <div className="body">
        <time dateTime={a.date}>{fmtDate(a.date)}</time>
        <h3>{a.short}</h3>
        <p>{a.summary}</p>
        <span className="tlink">{a.kind === 'Report' ? 'Read the report' : 'Read story'} <Arrow /></span>
      </div>
    </Link>
  )
}

export function PubCard({ d }: { d: Doc }) {
  return (
    <a className="pub" href={d.url} target="_blank" rel="noreferrer">
      <span className="pub-k">{docKinds[d.kind]}{d.date ? ' · ' + d.date : ''}</span>
      <strong>{d.title}</strong>
      <span className="pub-d">{d.desc}</span>
      <span className="pub-dl">Download PDF <Download /></span>
    </a>
  )
}
