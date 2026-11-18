'use client'
import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Link, NavLink, useLocation } from '../router'
import { useCms, type NavItem, type Notice } from '../cms-context'
import { img, tel } from '../data/content'
import { ArrowUpRight, Chevron } from './ui'
import { NewsletterForm } from './Forms'
import { Beacon } from './Beacon'

const NEWSLETTER_ON = process.env.NEXT_PUBLIC_NEWSLETTER === 'on' // hidden for now; set NEXT_PUBLIC_NEWSLETTER=on and rebuild to bring it back

type Item = { to: string; label: string; desc?: string }
type NavEntry = { label: string; to: string; children?: Item[] }
const toEntry = (n: NavItem): NavEntry => ({ label: n.label, to: n.url, children: n.children?.map((c) => ({ to: c.url, label: c.label, desc: c.description })) })
const isExternal = (u: string) => /^https?:\/\//i.test(u)
const DEFAULT_NAV: { label: string; to: string; children?: Item[] }[] = [
  {
    label: 'Deposit protection', to: '/deposit-protection', children: [
      { to: '/deposit-protection', label: 'How protection works', desc: 'The three rules in plain words' },
      { to: '/deposit-protection/coverage', label: 'What’s covered', desc: 'Accounts covered and the 11 exclusions' },
      { to: '/deposit-protection/calculator', label: 'Coverage calculator', desc: 'See how much of your money is protected' },
      { to: '/deposit-protection/payout', label: 'If an institution fails', desc: 'The payout timetable and recovery' },
    ],
  },
  {
    label: 'Members', to: '/members', children: [
      { to: '/members', label: 'Member directory', desc: 'Every bank and microfinance institution covered' },
      { to: '/members/institutions', label: 'For member institutions', desc: 'Membership, premiums and reporting' },
    ],
  },
  {
    label: 'About', to: '/about', children: [
      { to: '/about', label: 'About EDIF', desc: 'Mandate, mission and functions' },
      { to: '/about/governance', label: 'Governance', desc: 'Board of Directors and management' },
      { to: '/about/organization', label: 'Organisation', desc: 'How the Fund is structured' },
      { to: '/about/strategy', label: 'Strategy and finances', desc: 'Objectives, funding and use of funds' },
    ],
  },
  { label: 'News', to: '/news' },
  { label: 'Publications', to: '/publications' },
  { label: 'Contact', to: '/contact' },
]

function Brand() {
  const { logo } = useCms()
  const mark = logo?.color || img('logoB.svg')
  return (
    <Link className="brand" to="/" aria-label="Ethiopian Deposit Insurance Fund, home">
      {!logo?.textOnly && <img src={mark} alt="" />}
      <span>{logo?.wordmark || 'EDIF'}<small>Ethiopian Deposit Insurance Fund</small></span>
    </Link>
  )
}

const isExpired = (iso: string) => new Date(iso).getTime() < Date.now()

function NoticeBar({ n }: { n: Notice }) {
  const [gone, setGone] = useState(false)
  // eslint-disable-next-line react-hooks/set-state-in-effect -- reads sessionStorage, which only exists after hydration
  useEffect(() => { try { if (sessionStorage.getItem('notice:' + n.message) === '1') setGone(true) } catch { /* private mode */ } }, [n.message])
  if (gone || (n.expiresAt && isExpired(n.expiresAt))) return null
  const close = () => { setGone(true); try { sessionStorage.setItem('notice:' + n.message, '1') } catch { /* private mode */ } }
  return (
    <div className={'notice notice--' + n.severity} role={n.severity === 'urgent' ? 'alert' : 'status'}>
      <div className="container">
        <p>{n.message}{n.linkUrl && n.linkLabel && <> <a href={n.linkUrl}>{n.linkLabel}</a></>}</p>
        <button type="button" aria-label="Dismiss this notice" onClick={close}>×</button>
      </div>
    </div>
  )
}

function Header() {
  const cms = useCms()
  const NAV: NavEntry[] = cms.nav ? cms.nav.map(toEntry) : DEFAULT_NAV
  const [open, setOpen] = useState(false)
  const [drop, setDrop] = useState<string | null>(null)
  const [find, setFind] = useState(false)
  const { pathname } = useLocation()
  const ref = useRef<HTMLElement>(null)
  const findRef = useRef<HTMLInputElement>(null)
  // eslint-disable-next-line react-hooks/set-state-in-effect -- closes menus when the route changes
  useEffect(() => { setOpen(false); setDrop(null); setFind(false) }, [pathname])
  useEffect(() => {
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === 'Escape' : !ref.current?.contains(e.target as Node)) { setDrop(null); if (e instanceof KeyboardEvent) { setOpen(false); setFind(false) } }
    }
    document.addEventListener('click', close); document.addEventListener('keydown', close)
    return () => { document.removeEventListener('click', close); document.removeEventListener('keydown', close) }
  }, [])
  const section = (to: string) => pathname === to || pathname.startsWith(to + '/')
  return (
    <header className="site-header" ref={ref}>
      <div className="container bar">
        <Brand />
        <ul className="nav">
          {NAV.map((n) => n.children ? (
            <li key={n.label} className={'has-drop' + (drop === n.label ? ' open' : '')}
              onMouseEnter={() => setDrop(n.label)} onMouseLeave={() => setDrop(null)}>
              <button type="button" className={'nav-btn' + (section(n.to) ? ' current' : '')} aria-expanded={drop === n.label}
                onClick={(e) => { e.stopPropagation(); setDrop(drop === n.label ? null : n.label) }}>
                {n.label} <Chevron />
              </button>
              <div className="drop">
                <ul>
                  {n.children.map((c) => (
                    <li key={c.to}><NavLink to={c.to} end><strong>{c.label}</strong><span>{c.desc}</span></NavLink></li>
                  ))}
                </ul>
              </div>
            </li>
          ) : (
            <li key={n.label}><NavLink to={n.to}>{n.label}</NavLink></li>
          ))}
        </ul>
        <div className="actions">
          <button className="search-btn" type="button" aria-label={find ? 'Close search' : 'Search the site'} aria-expanded={find} aria-controls="hsearch"
            onClick={(e) => { e.stopPropagation(); const next = !find; setFind(next); if (next) setTimeout(() => findRef.current?.focus(), 30) }}>
            {find
              ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
              : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>}
          </button>
          <Link className="btn" to={cms.headerCta?.url || '/deposit-protection/calculator'}>{cms.headerCta?.label || 'Check your coverage'} <ArrowUpRight /></Link>
          <button className="menu-btn" type="button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mnav" onClick={() => setOpen(!open)}>
            {open
              ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
              : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg>}
          </button>
        </div>
      </div>
      <div className={'hsearch' + (find ? ' open' : '')} id="hsearch">
        <form className="container" action="/search" method="get" role="search">
          <label className="sr" htmlFor="hq">Search the site</label>
          <input id="hq" ref={findRef} name="q" type="search" minLength={2} maxLength={80} placeholder="Search news, publications, questions…" autoComplete="off" tabIndex={find ? 0 : -1} />
          <button className="btn btn--navy" type="submit" tabIndex={find ? 0 : -1}>Search</button>
        </form>
      </div>
      <nav className={'mnav' + (open ? ' open' : '')} id="mnav" aria-label="Mobile">
        {NAV.map((n) => n.children ? (
          <div className="mgroup" key={n.label}>
            <span className="mk">{n.label}</span>
            {n.children.map((c) => <NavLink key={c.to} to={c.to} end>{c.label}</NavLink>)}
          </div>
        ) : null)}
        <div className="mgroup">
          <span className="mk">More</span>
          {NAV.filter((n) => !n.children).map((n) => <NavLink key={n.to} to={n.to}>{n.label}</NavLink>)}
          <NavLink to="/faq">Questions and answers</NavLink>
        </div>
      </nav>
    </header>
  )
}

const DEFAULT_FOOT: { heading: string; links: NavItem[] }[] = [
  { heading: 'Deposit protection', links: [{ label: 'How protection works', url: '/deposit-protection' }, { label: 'What’s covered', url: '/deposit-protection/coverage' }, { label: 'Coverage calculator', url: '/deposit-protection/calculator' }, { label: 'If an institution fails', url: '/deposit-protection/payout' }, { label: 'Questions and answers', url: '/faq' }] },
  { heading: 'The Fund', links: [{ label: 'About EDIF', url: '/about' }, { label: 'Governance', url: '/about/governance' }, { label: 'Member institutions', url: '/members' }, { label: 'Publications and laws', url: '/publications' }, { label: 'News', url: '/news' }] },
]
const contactLogo = (cms: ReturnType<typeof useCms>) =>
  cms.logo?.textOnly ? <strong className="wordmark-w">{cms.logo.wordmark}</strong> : <img src={cms.logo?.white || img('logoW.svg')} alt="Ethiopian Deposit Insurance Fund" />

function Footer() {
  const cms = useCms()
  const { contact } = cms
  return (
    <footer className="site-footer" id="contact">
      <div className="bgimg"><img src={img('teamL.jpg')} alt="" /></div>
      <div className="container">
        <div className="foot-cta">
          <div>
            <h2>Not sure if your deposit is covered? <em>Ask us.</em></h2>
            <p>Call or write to the Fund, or send us a message.</p>
          </div>
          <div className="btn-row">
            <a className="btn btn--gold" href={tel(contact.phones[0])}>Call {contact.phones[0]}</a>
            <Link className="btn btn--outline-light" to="/contact">Send a message</Link>
          </div>
        </div>
        <div className="foot" style={{ ['--fc' as string]: (cms.footerNav || DEFAULT_FOOT).length + 1 }}>
          <div className="about-f">
            {contactLogo(cms)}
            <p>Protecting depositors and contributing to the stability of Ethiopia’s financial system.</p>
          </div>
          {(cms.footerNav || DEFAULT_FOOT).map((col) => (
            <div key={col.heading}>
              <h4>{col.heading}</h4>
              <ul>{col.links.map((l) => <li key={l.url + l.label}>{isExternal(l.url) ? <a href={l.url} target="_blank" rel="noopener noreferrer">{l.label}</a> : <Link to={l.url}>{l.label}</Link>}</li>)}</ul>
            </div>
          ))}
          <div>
            <h4>Contact</h4>
            <ul>
              <li>{contact.address[0]}<br />Sengatera, Addis Ababa</li>
              <li>P.O. Box {contact.poBox}</li>
              <li><a href={'mailto:' + contact.email}>{contact.email}</a></li>
              {contact.phones.map((p) => <li key={p}><a href={tel(p)}>{p}</a></li>)}
            </ul>
          </div>
        </div>
        {NEWSLETTER_ON && (
          <div className="foot-news">
            <div><strong>Email updates</strong><p>News, reports and notices from the Fund. We confirm your address first and you can leave at any time.</p></div>
            <NewsletterForm />
          </div>
        )}
        <div className="foot-bottom">
          <span>© 2026 Ethiopian Deposit Insurance Fund. All rights reserved.</span>
          <span>Accountable to the <a href="https://nbe.gov.et/" target="_blank" rel="noreferrer">National Bank of Ethiopia</a></span>
        </div>
      </div>
    </footer>
  )
}

const REVEAL = ['.sec-head', '.ticker-head', '.rules', '.cmp-col', '.calc-copy', '.calc', '.steps-line', '.step', '.late', '.photo', '.about-copy', '.stat', '.ncard', '.faq-more', '.inst > div:first-child', '.doc', '.foot-cta',
  '.icard', '.pcard', '.vmv > *', '.nextcard', '.split > *', '.org', '.tl-item', '.ycard', '.fn', '.feature', '.cinfo', '.cform', '.board-seats', '.lede', '.mcard-hero', '.quote', '.gallery figure', '.excl-row']

function useEffects(pathname: string) {
  useEffect(() => {
    const RM = matchMedia('(prefers-reduced-motion: reduce)').matches
    const root = document.documentElement
    if (!RM) root.classList.add('motion')
    const items = [...document.querySelectorAll<HTMLElement>('main ' + REVEAL.join(',main ') + ',.foot-cta')]
      .filter((el) => !el.classList.contains('done'))
    items.forEach((el) => {
      el.classList.add('reveal')
      const sib = [...(el.parentElement?.children || [])].filter((c) => c.classList.contains('reveal'))
      el.style.setProperty('--d', Math.min(sib.indexOf(el), 6) * 70 + 'ms')
    })
    document.querySelectorAll('main .curves').forEach((c) => c.classList.add('reveal'))
    let io: IntersectionObserver | undefined
    if ('IntersectionObserver' in window && !RM) {
      io = new IntersectionObserver((es) => es.forEach((e) => {
        if (!e.isIntersecting) return
        const el = e.target as HTMLElement
        el.classList.add('in'); io!.unobserve(el)
        if (!el.matches('.curves,.steps-line')) setTimeout(() => { el.classList.remove('reveal', 'in'); el.classList.add('done') }, 900 + parseInt(el.style.getPropertyValue('--d') || '0'))
      }), { rootMargin: '0px 0px -8% 0px', threshold: 0.12 })
      document.querySelectorAll('.reveal').forEach((el) => io!.observe(el))
    } else document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in'))
    return () => io?.disconnect()
  }, [pathname])
}

function ScrollUI() {
  const [y, setY] = useState(0)
  const [k, setK] = useState(0)
  useEffect(() => {
    let t = false
    const on = () => {
      if (t) return; t = true
      requestAnimationFrame(() => {
        const h = document.documentElement.scrollHeight - innerHeight
        setY(scrollY); setK(h > 0 ? scrollY / h : 0); t = false
        document.querySelector('.site-header')?.classList.toggle('scrolled', scrollY > 40)
      })
    }
    addEventListener('scroll', on, { passive: true }); on()
    return () => removeEventListener('scroll', on)
  }, [])
  const [vh, setVh] = useState(800)
  // eslint-disable-next-line react-hooks/set-state-in-effect -- window size is only known after hydration
  useEffect(() => { setVh(innerHeight) }, [])
  return (
    <>
      <div className="progress" aria-hidden="true"><span style={{ transform: `scaleX(${k})` }} /></div>
      <button className={'totop' + (y > vh * 0.8 ? ' show' : '')} aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })}>
        <svg className="ring" viewBox="0 0 52 52" aria-hidden="true"><circle cx="26" cy="26" r="24" /><circle className="ring-fill" cx="26" cy="26" r="24" pathLength={1} style={{ strokeDashoffset: 1 - k }} /></svg>
        <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6" /></svg>
      </button>
    </>
  )
}

export default function Layout({ children }: { children: ReactNode }) {
  const cms = useCms()
  const { pathname } = useLocation()
  useEffect(() => {
    const hash = window.location.hash
    if (hash) { const el = document.getElementById(hash.slice(1)); if (el) { el.scrollIntoView(); return } }
    window.scrollTo(0, 0)
  }, [pathname])
  useEffects(pathname)
  return (
    <>
      <a className="skip" href="#main" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus() }}>Skip to main content</a>
      <ScrollUI />
      <Beacon />
      {cms.notice && <NoticeBar n={cms.notice} />}
      <Header />
      <main id="main" tabIndex={-1} key={pathname}>
        {children}
      </main>
      <Footer />
    </>
  )
}
