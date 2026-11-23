'use client'
import { useEffect, useRef } from 'react'
import { Link } from '../router'
import Calculator from './Calculator'
import DepositTypes from './DepositTypes'
import { Arrow, Bank, Calc, Check, Clock, Cross, Curves, DocIcon, Download, NextLinks, PageHero, SecHead, Shield, SubNav, TLink, aboutNav, protectionNav } from './ui'
import { MemberDirectory as Directory } from '../pages/Members'
import { CountUp, spotlight, useInView } from './motion'
import { useCms } from '../cms-context'
import { tel } from '../data/content'
import { FaqList } from './sections'
import { safeHref } from '../../lib/safeUrl'

/**
 * Design sections whose text, numbers, images and links are edited in the admin.
 * Each one keeps the markup and animation of the original page; only the content now comes from props.
 */
type Img = { src: string; alt?: string } | null | undefined
type Btn = { label: string; url: string; style?: string }
const T = (a?: { text: string }[]) => (a || []).map((x) => x.text)
const ext = (u: string) => /^(https?:|mailto:|tel:)/.test(u)
const Button = ({ b }: { b: Btn }) => {
  const cls = 'btn btn--' + (b.style || 'navy'), url = safeHref(b.url) || '#'
  return ext(url) ? <a className={cls} href={url}>{b.label}</a> : <Link className={cls} to={url}>{b.label} <Arrow /></Link>
}
const Buttons = ({ list }: { list?: Btn[] }) => (list?.length ? <div className="btn-row">{list.map((b, i) => (b.style === 'link' ? <TLink key={i} to={safeHref(b.url) || '#'}>{b.label}</TLink> : <Button key={i} b={b} />))}</div> : null)
const Em = ({ title, em }: { title?: string; em?: string }) => <>{title}{em ? <> <em>{em}</em></> : null}</>

function Count({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = ref.current!, fmt = (n: number) => Math.round(n).toLocaleString('en-US')
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { el.textContent = fmt(to) + suffix; return }
    let raf = 0
    const id = setTimeout(() => {
      const t0 = performance.now(), d = 1600
      const f = (t: number) => { const k = Math.min(1, (t - t0) / d), e = 1 - Math.pow(1 - k, 4); el.textContent = fmt(to * e) + suffix; if (k < 1) raf = requestAnimationFrame(f) }
      raf = requestAnimationFrame(f)
    }, 0)
    return () => { clearTimeout(id); cancelAnimationFrame(raf) }
  }, [to, suffix])
  return <span ref={ref}>{to.toLocaleString('en-US') + suffix}</span>
}

export function HomeHero(p: { title: string; tagline?: string; intro?: string; image?: Img; partners?: { text: string }[]; buttons?: Btn[]; ledger?: { mode?: string; value?: number; prefix?: string; suffix?: string; tag?: string; title?: string; text?: string }[] }) {
  const { banks, microfinance } = useCms()
  const fill = (s = '') => s.replace('{banks}', String(banks.length)).replace('{mfis}', String(microfinance.length)).replace('{total}', String(banks.length + microfinance.length))
  return (
    <section className="hero" id="top">
      {p.image && <div className="hero-bg"><img src={p.image.src} alt={p.image.alt || ''} /></div>}
      <div className="container hero-inner">
        <h1>{p.title}</h1>
        {p.tagline && <span className="tagline">{p.tagline}</span>}
        {p.intro && <p className="intro">{p.intro}</p>}
        {!!p.partners?.length && <div className="partners">{p.partners.map((x, i) => <span key={i}>{x.text}</span>)}</div>}
        <Buttons list={p.buttons} />
        {!!p.ledger?.length && (
          <div className="ledger">
            {p.ledger.map((l, i) => (
              <div key={i}>
                <div className="big"><b className="num">{l.prefix ? <small>{l.prefix}</small> : null}<Count to={l.mode === 'members' ? banks.length + microfinance.length : l.value || 0} suffix={l.suffix || ''} /></b><span className="tag">{l.tag}</span></div>
                <strong>{l.title}</strong><p>{fill(l.text)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function HeroFigs() {
  const { banks, microfinance } = useCms()
  return (
    <div className="hero-figs">
      <div><b className="num">{banks.length}</b><span>Commercial banks</span></div>
      <div><b className="num">{microfinance.length}</b><span>Microfinance institutions</span></div>
      <div><b className="num">{banks.length + microfinance.length}</b><span>Members in total</span></div>
    </div>
  )
}

export function PageHeroPart(p: { memberCounts?: boolean; eyebrow: string; title: string; tagline?: string; lead?: string; image?: Img; pos?: string; crumbLabel?: string; crumbUrl?: string; subnav?: string }) {
  return (
    <>
      <PageHero eyebrow={p.eyebrow} title={p.title} tagline={p.tagline} lead={p.lead} image={p.image?.src ? p.image.src.replace(/^\/images\//, '') : undefined} pos={p.pos}
        crumbs={p.crumbLabel && p.crumbUrl ? [{ to: p.crumbUrl, label: p.crumbLabel }] : undefined}>
        {p.memberCounts ? <HeroFigs /> : null}
      </PageHero>
      {p.subnav === 'about' && <SubNav label="About" items={aboutNav} />}
      {p.subnav === 'protection' && <SubNav label="Deposit protection" items={protectionNav} />}
    </>
  )
}

export function SplitText(p: { image?: Img; eyebrow?: string; title?: string; em?: string; paragraphs?: { text: string }[]; bullets?: { text: string }[]; buttons?: Btn[] }) {
  return (
    <div className="about">
      <div><div className="photo">{p.image && <img src={p.image.src} alt={p.image.alt || ''} />}</div></div>
      <div className="about-copy">
        {p.eyebrow && <span className="eyebrow left">{p.eyebrow}</span>}
        <h2 className="h2"><Em title={p.title} em={p.em} /></h2>
        {T(p.paragraphs).map((t, i) => <p key={i}>{t}</p>)}
        {!!p.bullets?.length && <ul className="objs">{T(p.bullets).map((t, i) => <li key={i}>{t}</li>)}</ul>}
        <Buttons list={p.buttons} />
      </div>
    </div>
  )
}

export function VisionMission({ items }: { items?: { eyebrow: string; big?: string; text?: string; bullets?: { text: string }[] }[] }) {
  return (
    <div className="vmv">
      {(items || []).map((v, i) => (
        <div key={i} className={'vm' + (i === 2 ? ' values' : '')}>
          {i === 0 && <Curves />}
          <span className="eyebrow left light">{v.eyebrow}</span>
          {v.big && <p className="big">{v.big}</p>}
          {v.text && <p>{v.text}</p>}
          {!!v.bullets?.length && <ul>{T(v.bullets).map((b, j) => <li key={j}>{b}</li>)}</ul>}
        </div>
      ))}
    </div>
  )
}

export function PCards({ items, numbered }: { items?: { kicker?: string; title: string; text?: string }[]; numbered?: boolean }) {
  return (
    <div className="pcards">
      {(items || []).map((b, i) => (
        <div className="pcard" key={i}>
          {numbered ? <span className="n num">{String(i + 1).padStart(2, '0')}</span> : b.kicker ? <span className="k">{b.kicker}</span> : null}
          <h3>{b.title}</h3><p>{b.text}</p>
        </div>
      ))}
    </div>
  )
}

export function ICards({ items, darkMiddle, numbered, buttons }: { items?: { title: string; text?: string }[]; darkMiddle?: boolean; numbered?: boolean; buttons?: Btn[] }) {
  return (
    <>
      <div className="icards">
        {(items || []).map((t, i) => {
          const dark = darkMiddle && i === 1
          return (
            <div className={'icard' + (dark ? ' feature-dark' : '')} key={i}>
              {dark && <Curves />}
              {numbered && <span className="ic num">{i + 1}</span>}<h3>{t.title}</h3><p>{t.text}</p>
            </div>
          )
        })}
      </div>
      {!!buttons?.length && <div className="faq-more">{buttons.map((b, i) => <Button key={i} b={b} />)}</div>}
    </>
  )
}

export function NumberedList(p: { variant?: string; eyebrow?: string; title?: string; em?: string; lead?: string; text?: string; items?: { text: string }[] }) {
  const items = T(p.items)
  const lede = (
    <div className={'lede' + (p.variant === 'fns' ? ' sticky' : '')}>
      {p.eyebrow && <span className="eyebrow left">{p.eyebrow}</span>}
      <h2 className="h2"><Em title={p.title} em={p.em} /></h2>
      {p.lead && <p className="lead">{p.lead}</p>}
      {p.text && <p>{p.text}</p>}
    </div>
  )
  if (p.variant === 'grid') return <ol className="objgrid">{items.map((o, i) => <li key={i}><b className="num">{String(i + 1).padStart(2, '0')}</b>{o}</li>)}</ol>
  return (
    <div className="split">
      {lede}
      {p.variant === 'chain' ? <ol className="gov-chain">{items.map((g, i) => <li key={i}><b className="num">{i + 1}</b><span>{g}</span></li>)}</ol>
        : p.variant === 'uses' ? <ul className="uses">{items.map((u, i) => <li key={i}>{u}</li>)}</ul>
          : <ol className="fns">{items.map((f, i) => <li className="fn" key={i}><b className="num">{String(i + 1).padStart(2, '0')}</b><span>{f}</span></li>)}</ol>}
    </div>
  )
}

export function StatGrid({ items, columns, buttons, figures }: { items?: { prefix?: string; value?: string; label: string; text?: string; figure?: string }[]; columns?: string; buttons?: Btn[]; figures?: Record<string, { value: string; label: string; note?: string }> }) {
  return (
    <>
      <div className={'stats six' + (columns === '4' ? ' four' : '')}>
        {(items || []).map((s, i) => {
          const f = s.figure && figures?.[s.figure]
          return <div className="stat" key={i}><b className="num">{!f && s.prefix && <small>{s.prefix}</small>}{f ? f.value : s.value}</b><span>{s.label || (f ? f.label : '')}</span><p>{s.text || (f ? f.note : '')}</p></div>
        })}
      </div>
      {!!buttons?.length && <div className="faq-more">{buttons.map((b, i) => <Button key={i} b={b} />)}</div>}
    </>
  )
}

export function OrgChart(p: { board: string; side: string; chain: { text: string }[]; branches: { directorate: string; teams: { text: string }[] }[] }) {
  const chain = T(p.chain)
  return (
    <div className="org" role="img" aria-label={`Organisation chart: ${p.board}, ${p.side}, ${chain.join(', ')}`}>
      <div className="org-row top"><div className="node lead">{p.board}</div><div className="node side">{p.side}</div></div>
      {chain.map((c, i) => (
        <div key={i} style={{ display: 'contents' }}><div className="org-line" /><div className={'node' + (i === 0 ? ' lead' : '')}>{c}</div></div>
      ))}
      <div className="org-line" />
      <div className="org-split">
        {(p.branches || []).map((b, i) => (
          <div className="branch" key={i}><div className="node dir">{b.directorate}</div><div className="teams">{T(b.teams).map((t, j) => <div className="node team" key={j}>{t}</div>)}</div></div>
        ))}
      </div>
    </div>
  )
}

export function Board(p: { people: { name: string; jobTitle: string; photo?: string }[]; seatsTitle?: string; seats?: { text: string }[]; note?: string }) {
  const [first, ...rest] = p.people
  const [role, ...org] = (first?.jobTitle || '').split(', ')
  return (
    <>
      {first && (
        <div className="board">
          <div className="mcard-hero">
            <div className="pimg">{first.photo && <img src={first.photo} alt={first.name} />}</div>
            <div><span className="k">{role}</span><h3>{first.name}</h3><p>{org.join(', ')}</p></div>
          </div>
          <ul className="members-list">
            {rest.map((b) => (
              <li key={b.name}>
                {b.photo
                  ? <span className="initials has-photo"><img src={b.photo} alt={b.name} loading="lazy" /></span>
                  : <span className="initials">{b.name.replace('Ato ', '').split(' ').map((w) => w[0]).join('')}</span>}
                <div><strong>{b.name}</strong><span>{b.jobTitle}</span></div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {!!p.seats?.length && (
        <div className="board-seats"><h3>{p.seatsTitle || 'Seats on the Board'}</h3><ul>{T(p.seats).map((s, i) => <li key={i}>{s}</li>)}</ul>{p.note && <p className="source">{p.note}</p>}</div>
      )}
    </>
  )
}

export function Profiles({ people }: { people: { name: string; jobTitle: string; photo?: string; bio?: React.ReactNode }[] }) {
  return (
    <div className="people">
      {people.map((m) => (
        <article className="person" key={m.name}>
          <div className="pimg">{m.photo && <img src={m.photo} alt={m.name} />}</div>
          <div className="pbody"><span className="k">{m.jobTitle}</span><h3>{m.name}</h3><div className="prose">{m.bio}</div></div>
        </article>
      ))}
    </div>
  )
}

export function Crowd(p: { photo?: Img; number?: number; suffix?: string; kicker?: string; text?: string }) {
  const [ref, inView] = useInView<HTMLDivElement>(0.3)
  const n = p.number ?? 0
  return (
    <div ref={ref} className={'crowd cv' + (inView ? ' cv-in' : '')}>
      <div className="crowd-fig" aria-hidden="true" style={p.photo ? { ['--crowd-img' as string]: `url(${p.photo.src})` } : undefined}>
        <span className="ghost">{n}{p.suffix}</span>
        <span className="live"><CountUp to={n} run={inView} duration={1800} />{p.suffix}</span>
      </div>
      <p className="sr">{n}{p.suffix} {p.kicker}.</p>
      <div className="crowd-copy"><span className="crowd-k">{p.kicker}</span><p>{p.text}</p></div>
    </div>
  )
}

export function Rules(p: { limit?: number; currency?: string; label?: string; desc?: string; rules?: { title: string; text: string }[] }) {
  const [ref, inView] = useInView<HTMLDivElement>(0.3)
  return (
    <div ref={ref} className={'rules cv' + (inView ? ' cv-in' : '')} onPointerMove={spotlight}>
      <span className="glow" aria-hidden="true" />
      <div className="rule-lead">
        <span className="lead-rings" aria-hidden="true"><i /><i /><i /></span>
        <span className="rule-seal" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
            <path pathLength={1} d="M12 2.8 4.5 5.6v6c0 4.6 3.2 8.4 7.5 9.6 4.3-1.2 7.5-5 7.5-9.6v-6z" /><path pathLength={1} className="tick" d="m8.6 12 2.4 2.4 4.4-4.6" />
          </svg>
        </span>
        <div><span className="rule-k">{p.label}</span><b><span className="cur">{p.currency}</span> <CountUp to={p.limit || 0} run={inView} /></b><span className="rule-bar" aria-hidden="true" /><span className="rule-d">{p.desc}</span></div>
      </div>
      {(p.rules || []).map((r, i) => <div className="rulei" key={i} style={{ ['--i' as string]: i + 1 }}><div><b>{r.title}</b><span>{r.text}</span></div></div>)}
    </div>
  )
}

export function Compare(p: { full?: boolean; coveredTitle?: string; coveredSub?: string; covered?: { text: string }[]; interestTitle?: string; interestText?: string; interestLabel?: string; interestUrl?: string; notTitle?: string; notSub?: string; main?: { title: string; text: string }[]; all?: { text: string }[]; seeAll?: string }) {
  const all = T(p.all)
  return (
    <div className="cmp">
      <section className="cmp-col cmp-yes" aria-labelledby="cmp-yes-h">
        <header>
          <p className="cmp-kick">Protected</p>
          <h3 id="cmp-yes-h">{p.coveredTitle}</h3>
          <p className="cmp-sub">{p.coveredSub}</p>
        </header>
        <ul className="cmp-list">{T(p.covered).map((c, i) => <li key={i}><span className="cmp-mark" aria-hidden="true"><Check /></span><span>{c}</span></li>)}</ul>
        {p.interestTitle && (
          <aside className="cmp-note"><strong>{p.interestTitle}</strong><p>{p.interestText}</p>{p.interestLabel && p.interestUrl && <TLink to={p.interestUrl}>{p.interestLabel}</TLink>}</aside>
        )}
      </section>
      <section className="cmp-col cmp-no" aria-labelledby="cmp-no-h">
        <header>
          <p className="cmp-kick">Excluded</p>
          <h3 id="cmp-no-h">{p.notTitle}</h3>
          <p className="cmp-sub">{p.notSub}</p>
        </header>
        <ul className="cmp-list cmp-xl">{(p.main || []).map((x, i) => <li key={i}><span className="cmp-mark" aria-hidden="true"><Cross /></span><div><strong>{x.title}</strong><span>{x.text}</span></div></li>)}</ul>
        {!!all.length && <details className="cmp-all" open={p.full || undefined}><summary>{(p.seeAll || 'See all {n} exclusions').replace('{n}', String(all.length))}</summary><ol>{all.map((x, i) => <li key={i}>{x}</li>)}</ol></details>}
      </section>
    </div>
  )
}

export function Steps(p: { steps?: { day: string; title: string; text: string }[]; lateStrong?: string; lateText?: string; linkLabel?: string; linkUrl?: string }) {
  const [ref, inView] = useInView<HTMLDivElement>(0.25)
  const steps = p.steps || []
  return (
    <div ref={ref} className={'po cv' + (inView ? ' cv-in' : '')}>
      <div className="po-tl">
        <span className="po-track" aria-hidden="true"><span /></span>
        <ol className="po-steps">
          {steps.map((s, i) => (
            <li className={'po-step' + (i === steps.length - 1 ? ' is-last' : '')} key={i} style={{ ['--i' as string]: i }}>
              <span className="po-day">{s.day}</span><span className="po-node" aria-hidden="true">{i + 1}</span><h3>{s.title}</h3><p>{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
      {(p.lateStrong || p.lateText) && <div className="po-late"><p><strong>{p.lateStrong}</strong> {p.lateText}</p>{p.linkLabel && p.linkUrl && <TLink to={p.linkUrl}>{p.linkLabel}</TLink>}</div>}
    </div>
  )
}

export function Ticker(p: { title?: string; text?: string; linkLabel?: string; linkUrl?: string }) {
  const { banks, microfinance } = useCms()
  const short = (n: string) => n.replace(/ Institution$/, '').replace(/ Microfinance Institution/, ' Microfinance')
  const rows = [banks.map((b) => b.name), microfinance.map((m) => short(m.name))]
  return (
    <div className="ticker" role="group" aria-label="Member institutions">
      <div className="ticker-head">
        <div><b>{p.title}</b><p>{p.text}</p></div>
        {p.linkLabel && p.linkUrl && <TLink to={p.linkUrl}>{p.linkLabel}</TLink>}
      </div>
      {rows.map((list, r) => (
        <div key={r} className={'marquee' + (r ? ' reverse' : '')}>
          <div className="track">{list.map((n) => <span key={n}>{n}</span>)}{list.map((n) => <span key={n + '2'} aria-hidden="true">{n}</span>)}</div>
        </div>
      ))}
    </div>
  )
}

export function CalcSection(p: { eyebrow?: string; title?: string; em?: string; lead?: string; steps?: { title: string; text: string }[]; autoStrong?: string; autoText?: string; linkLabel?: string; linkUrl?: string; source?: string }) {
  return (
    <div className="calc-wrap">
      <div className="calc-copy">
        {p.eyebrow && <span className="eyebrow left">{p.eyebrow}</span>}
        <h2 className="h2"><Em title={p.title} em={p.em} /></h2>
        {p.lead && <p className="lead">{p.lead}</p>}
        <ol className="how">{(p.steps || []).map((s, i) => <li key={i}><b>{String(i + 1).padStart(2, '0')}</b><span><strong>{s.title}</strong> {s.text}</span></li>)}</ol>
        {(p.autoStrong || p.autoText) && <div className="calc-auto"><p><strong>{p.autoStrong}</strong> {p.autoText}</p>{p.linkLabel && p.linkUrl && <TLink to={p.linkUrl}>{p.linkLabel}</TLink>}</div>}
        {p.source && <p className="source">{p.source}</p>}
      </div>
      <Calculator />
    </div>
  )
}

export function FaqSplit(p: { eyebrow?: string; title?: string; em?: string; lead?: string; helpKicker?: string; helpTitle?: string; ctaLabel?: string; ctaUrl?: string; moreLabel?: string; moreUrl?: string }) {
  const { faqs, contact } = useCms()
  return (
    <div className="faq-split">
      <div className="faq-side">
        {p.eyebrow && <span className="eyebrow left">{p.eyebrow}</span>}
        <h2 className="h2"><Em title={p.title} em={p.em} /></h2>
        {p.lead && <p className="lead">{p.lead}</p>}
        <div className="faq-help">
          <span className="faq-help-k">{p.helpKicker}</span><b>{p.helpTitle}</b>
          <a href={tel(contact.phones[0])}>{contact.phones[0]}</a><a href={'mailto:' + contact.email}>{contact.email}</a>
          {p.ctaLabel && p.ctaUrl && <Link className="btn btn--gold" to={p.ctaUrl}>{p.ctaLabel} <Arrow /></Link>}
        </div>
      </div>
      <div className="faq-main">
        <FaqList items={faqs.filter((f) => f.home)} />
        {p.moreLabel && p.moreUrl && <div className="faq-more"><TLink to={p.moreUrl}>{p.moreLabel}</TLink></div>}
      </div>
    </div>
  )
}

export function NextLinksPart({ items }: { items?: { url: string; kicker: string; title: string; text: string }[] }) {
  return <NextLinks items={(items || []).map((i) => ({ to: safeHref(i.url) || '#', k: i.kicker, t: i.title, d: i.text }))} />
}

export { SecHead }

const ICONS: Record<string, () => React.ReactElement> = { check: Check, calc: Calc, clock: Clock, bank: Bank, shield: Shield }

export function LinkCards({ items }: { items?: { icon?: string; title: string; text?: string; linkLabel?: string; url?: string; dark?: boolean }[] }) {
  return (
    <div className="icards">
      {(items || []).map((c, i) => {
        const Icon = c.icon && ICONS[c.icon]
        const inner = (
          <>
            {c.dark && <Curves />}
            {Icon && <span className="ic"><Icon /></span>}
            <h3>{c.title}</h3><p>{c.text}</p>
            {c.linkLabel && <span className="tlink">{c.linkLabel} <Arrow /></span>}
          </>
        )
        const cls = 'icard' + (c.dark ? ' feature-dark' : '')
        return c.url && !ext(c.url) ? <Link key={i} className={cls} to={c.url}>{inner}</Link> : c.url ? <a key={i} className={cls} href={c.url}>{inner}</a> : <div key={i} className={cls}>{inner}</div>
      })}
    </div>
  )
}

export function TypeCards({ items }: { items?: { title: string; text?: string }[] }) {
  return <DepositTypes items={(items || []).map((c) => ({ title: c.title, text: c.text }))} />
}

export function ExclPanel({ items }: { items?: { text: string }[] }) {
  return (
    <div className="excl-panel">
      <Curves />
      <ol className="excl-grid">{T(items).map((x, i) => <li className="excl-row" key={i}><b>{String(i + 1).padStart(2, '0')}</b><span>{x}</span></li>)}</ol>
    </div>
  )
}

export function Worked({ items }: { items?: { title: string; rows?: { label: string; amount: number }[]; protectedAmount?: number; notProtected?: number; note?: string }[] }) {
  const f = (n = 0) => n.toLocaleString('en-US')
  return (
    <div className="ycards">
      {(items || []).map((e, i) => (
        <div className="ycard" key={i}>
          <h3>{e.title}</h3>
          <ul>{(e.rows || []).map((r, j) => <li key={j}><span>{r.label}</span><b className="num">Birr {f(r.amount)}</b></li>)}</ul>
          <div className="yres">
            <div><span>Protected</span><b className="num">Birr {f(e.protectedAmount)}</b></div>
            <div className={e.notProtected ? 'warn' : ''}><span>Not protected</span><b className="num">Birr {f(e.notProtected)}</b></div>
          </div>
          <p>{e.note}</p>
        </div>
      ))}
    </div>
  )
}

export function FaqPart(p: { category?: string; count?: number; questions?: { text: string }[]; moreLabel?: string; moreUrl?: string }) {
  const { faqs } = useCms()
  const qs = T(p.questions)
  const list = qs.length ? faqs.filter((f) => qs.includes(f.q)) : faqs.filter((f) => !p.category || f.cat === p.category).slice(0, p.count || 4)
  return (
    <>
      <FaqList items={list} />
      {p.moreLabel && p.moreUrl && <div className="faq-more"><TLink to={p.moreUrl}>{p.moreLabel}</TLink></div>}
    </>
  )
}

export function PremiumCards({ items }: { items?: { kicker: string; big: string; text?: string; separate?: boolean }[] }) {
  return (
    <div className="mi-prem">
      {(items || []).map((m, i) => (
        <div className={'mi-p' + (m.separate ? ' mi-p--if' : '')} key={i}>
          <span className="k">{m.kicker}</span>{m.separate ? <b>{m.big}</b> : <b className="num">{m.big}</b>}<p>{m.text}</p>
        </div>
      ))}
    </div>
  )
}

export function MemberDirectory(p: { source?: string }) {
  return <Directory source={p.source} />
}

export function LedeSplit(p: {
  eyebrow?: string; title?: string; em?: string; lead?: string; text?: string; sticky?: boolean; buttons?: Btn[]
  calloutSide?: string; calloutIcon?: string; calloutStrong?: string; calloutText?: string
  right?: string; rulesLimit?: number; rulesCurrency?: string; rulesLabel?: string; rulesDesc?: string; rules?: { title: string; text: string }[]
  miniStats?: { prefix?: string; value: string; label: string; text?: string }[]
  timeline?: { kicker?: string; title: string; text?: string }[]
}) {
  const { banks, microfinance, docs } = useCms()
  const Icon = ICONS[p.calloutIcon || 'shield'] || Shield
  const callout = (p.calloutStrong || p.calloutText) ? <div className="callout"><Icon /><p><strong>{p.calloutStrong}</strong> {p.calloutText}</p></div> : null
  const memberDocs = docs.filter((d) => ['Regulation', 'Directive', 'Reporting'].includes(d.kind))
  return (
    <div className="split">
      <div className={'lede' + (p.sticky ? ' sticky' : '')}>
        {p.eyebrow && <span className="eyebrow left">{p.eyebrow}</span>}
        <h2 className="h2"><Em title={p.title} em={p.em} /></h2>
        {p.lead && <p className="lead">{p.lead}</p>}
        {p.text && <p>{p.text}</p>}
        {p.calloutSide === 'left' && callout}
        {!!p.buttons?.length && <Buttons list={p.buttons} />}
      </div>
      {p.right === 'rules' && <div><Rules limit={p.rulesLimit} currency={p.rulesCurrency} label={p.rulesLabel} desc={p.rulesDesc} rules={p.rules} />{p.calloutSide !== 'left' && callout}</div>}
      {p.right === 'miniStats' && <div className="mini-stats">{(p.miniStats || []).map((s, i) => <div className="stat" key={i}><b className="num">{s.prefix && <small>{s.prefix}</small>}{s.value}</b><span>{s.label}</span><p>{s.text}</p></div>)}</div>}
      {p.right === 'timeline' && <ol className="timeline">{(p.timeline || []).map((s, i) => <li className="tl-item" key={i}><span className="tl-dot">{i + 1}</span><span className="k">{s.kicker}</span><h3>{s.title}</h3><p>{s.text}</p></li>)}</ol>}
      {p.right === 'memberCounts' && (
        <ul className="mi-figs">
          <li><b className="num">{banks.length}</b><span>Commercial banks</span></li>
          <li><b className="num">{microfinance.length}</b><span>Microfinance institutions</span></li>
          <li><b className="num">{banks.length + microfinance.length}</b><span>Members in total</span></li>
        </ul>
      )}
      {p.right === 'memberDocs' && (
        <ul className="docs">
          {memberDocs.map((d) => (
            <li key={d.url}><a className="doc" href={d.url} target="_blank" rel="noreferrer">
              <span className="ic"><DocIcon /></span>
              <span><span className="k">{d.kind}</span><strong>{d.title}</strong><span className="d">{d.desc}</span></span>
              <span className="dl"><Download /></span>
            </a></li>
          ))}
        </ul>
      )}
    </div>
  )
}
