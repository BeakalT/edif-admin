'use client'
import { Link, NavLink } from '../router'
import type { ReactNode } from 'react'
import { img } from '../data/content'

const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 2.2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

export const Arrow = () => <svg viewBox="0 0 24 24" {...S} aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
export const ArrowUpRight = () => <svg viewBox="0 0 24 24" {...S} aria-hidden="true"><path d="M7 17 17 7M8 7h9v9" /></svg>
export const Check = () => <svg viewBox="0 0 24 24" {...S} strokeWidth={2.4} aria-hidden="true"><path d="m5 12 4.5 4.5L19 7" /></svg>
export const Cross = () => <svg viewBox="0 0 24 24" {...S} strokeWidth={2.4} aria-hidden="true"><path d="M7 7l10 10M17 7 7 17" /></svg>
export const DocIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinejoin="round" aria-hidden="true"><path d="M7 3h7l5 5v13H7z" /><path d="M14 3v5h5M10 13h6M10 17h6" /></svg>
export const Download = () => <svg viewBox="0 0 24 24" {...S} strokeWidth={2} aria-hidden="true"><path d="M12 4v12M6 11l6 6 6-6M5 20h14" /></svg>
export const Phone = () => <svg viewBox="0 0 24 24" {...S} strokeWidth={1.9} aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" /></svg>
export const Mail = () => <svg viewBox="0 0 24 24" {...S} strokeWidth={1.9} aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
export const Globe = () => <svg viewBox="0 0 24 24" {...S} strokeWidth={1.9} aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></svg>
export const Pin = () => <svg viewBox="0 0 24 24" {...S} strokeWidth={1.9} aria-hidden="true"><path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z" /><circle cx="12" cy="9" r="2.5" /></svg>
export const Search = () => <svg viewBox="0 0 24 24" {...S} strokeWidth={2} aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
export const Chevron = () => <svg viewBox="0 0 24 24" {...S} strokeWidth={2} aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
export const Shield = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinejoin="round" aria-hidden="true"><path d="M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6z" /><path d="m8.5 12 2.5 2.5 4.5-5" strokeLinecap="round" /></svg>
export const Calc = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" aria-hidden="true"><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M8 7h8M8.5 11h.01M12 11h.01M15.5 11h.01M8.5 14.5h.01M12 14.5h.01M15.5 14.5h.01M8.5 18h.01M12 18h.01M15.5 18h.01" /></svg>
export const Clock = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
export const Bank = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinejoin="round" strokeLinecap="round" aria-hidden="true"><path d="M3 9 12 4l9 5M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18" /></svg>

export function Curves({ variant = 'a' }: { variant?: 'a' | 'b' | 'c' }) {
  const d = {
    a: ['M470 380 C 520 450, 560 520, 640 560', 'M400 420 C 470 500, 540 570, 620 640'],
    b: ['M250 -20 C 300 80, 350 160, 430 210', 'M190 -20 C 270 100, 340 200, 400 270'],
    c: ['M380 -40 C 430 120, 520 220, 640 260', 'M300 -40 C 380 160, 500 280, 640 340'],
  }[variant]
  const vb = variant === 'b' ? '0 0 400 250' : '0 0 600 600'
  return (
    <svg className="curves" viewBox={vb} preserveAspectRatio="none" aria-hidden="true">
      {d.map((p) => <path key={p} pathLength={1} d={p} />)}
    </svg>
  )
}

export function SecHead({ eyebrow, title, em, lead, center = true, after }: { eyebrow: string; title: ReactNode; em?: ReactNode; lead?: ReactNode; center?: boolean; after?: ReactNode }) {
  return (
    <div className={'sec-head' + (center ? ' center' : '')}>
      <span className={'eyebrow' + (center ? '' : ' left')}>{eyebrow}</span>
      <h2 className="h2">{title}{em && <> <em>{em}</em></>}</h2>
      {lead && <p className="lead">{lead}</p>}
      {after}
    </div>
  )
}

export type Crumb = { to: string; label: string }

export function PageHero({ eyebrow, title, tagline, lead, image, crumbs, children, pos }: {
  eyebrow: string; title: ReactNode; tagline?: ReactNode; lead?: ReactNode; image?: string; crumbs?: Crumb[]; children?: ReactNode; pos?: string
}) {
  return (
    <section className={'page-hero' + (image ? ' has-img' : '')}>
      {image && <div className="hero-bg"><img src={img(image)} alt="" style={pos ? { objectPosition: pos } : undefined} /></div>}
      <Curves variant="c" />
      <div className="container page-hero-inner">
        {crumbs && (
          <nav className="crumbs" aria-label="Breadcrumb">
            <ol>
              <li><Link to="/">Home</Link></li>
              {crumbs.map((c) => <li key={c.to}><Link to={c.to}>{c.label}</Link></li>)}
            </ol>
          </nav>
        )}
        <span className="eyebrow left light">{eyebrow}</span>
        <h1>{title}</h1>
        {tagline && <span className="tagline">{tagline}</span>}
        {lead && <p className="intro">{lead}</p>}
        {children}
      </div>
    </section>
  )
}

export function TLink({ to, children, external }: { to: string; children: ReactNode; external?: boolean }) {
  if (external || /^(https?:|mailto:|tel:)/.test(to))
    return <a className="tlink" href={to} target={to.startsWith('http') ? '_blank' : undefined} rel="noreferrer">{children} <Arrow /></a>
  return <Link className="tlink" to={to}>{children} <Arrow /></Link>
}

export function NextLinks({ title = 'Keep reading', items }: { title?: string; items: { to: string; k: string; t: string; d: string }[] }) {
  return (
    <section className="section next-sec">
      <div className="container">
        <SecHead eyebrow={title} title="Where to" em="next" />
        <div className="next">
          {items.map((i) => (
            <Link key={i.to} className="nextcard" to={i.to}>
              <span className="k">{i.k}</span>
              <strong>{i.t}</strong>
              <p>{i.d}</p>
              <span className="go"><Arrow /></span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export function SubNav({ label, items }: { label: string; items: { to: string; label: string }[] }) {
  return (
    <nav className="subnav" aria-label={label}>
      <div className="container subnav-inner">
        <span className="subnav-k">{label}</span>
        <ul>
          {items.map((i) => (
            <li key={i.to}><NavLink to={i.to} end>{i.label}</NavLink></li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

export const aboutNav = [
  { to: '/about', label: 'About EDIF' },
  { to: '/about/governance', label: 'Governance' },
  { to: '/about/organization', label: 'Organisation' },
  { to: '/about/strategy', label: 'Strategy and finances' },
]

export const protectionNav = [
  { to: '/deposit-protection', label: 'Overview' },
  { to: '/deposit-protection/coverage', label: 'What’s covered' },
  { to: '/deposit-protection/calculator', label: 'Coverage calculator' },
  { to: '/deposit-protection/payout', label: 'If an institution fails' },
]
