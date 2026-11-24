'use client'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { RiArrowRightLine, RiSearchLine } from '@remixicon/react'
import { cx } from '@/utils/cx'

/* EDIF palette: navy #1E3570, blue #2875BA, gold #C29B38. */
const SHEET = 'edif-bui edif-rise rounded-[18px] border border-[var(--sheet-line)] bg-[var(--sheet)] p-5 shadow-[0_10px_28px_rgba(16,32,64,.07)]'
const H = 'flex items-center gap-2.5 text-[15px] font-bold text-[var(--navy-t)]'
const Dash = () => <span className="h-0.5 w-3.5 rounded bg-[#C29B38]" aria-hidden />
type IconKey = string

export type Quick = { href: string; title: string; desc: string; icon: IconKey; external?: boolean }
export function QuickActions({ items }: { items: Quick[] }) {
  if (!items.length) return null
  return (
    <section className="edif-bui flex flex-wrap items-center gap-2.5" aria-label="Quick actions">
      <span className="me-1 text-[13px] text-[var(--ink-2)]">Create:</span>
      {items.map((q, i) => (
        <a key={q.title} href={q.href} title={q.desc} {...(q.external ? { target: '_blank', rel: 'noreferrer' } : {})}
          className={cx('rounded-full px-4 py-2 text-[14px] font-semibold no-underline outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#2875BA]', i === 0 ? 'bg-[#1E3570] text-white hover:bg-[#162858]' : 'border border-[var(--sheet-line)] bg-[var(--sheet)] text-[var(--navy-t)] hover:bg-[var(--chip)]')}>
          {i === 0 || q.title === 'News article' || q.title === 'Upload a file' ? '+ ' : ''}{q.title}{q.external ? ' ↗' : ''}
        </a>
      ))}
    </section>
  )
}

export type Closing = { kind: string; title: string; href: string; days: number; when: string }
export function ClosingSoon({ items }: { items: Closing[] }) {
  const word = (d: number) => (d <= 0 ? 'today' : d === 1 ? 'tomorrow' : `in ${d} days`)
  return (
    <section className={SHEET}>
      <h3 className={H}><Dash />Coming up</h3>
      {items.length ? (
        <ul className="mt-3 divide-y divide-[var(--hair)]">
          {items.map((c) => (
            <li key={c.href} className="flex items-baseline justify-between gap-4 py-3">
              <a href={c.href} className="min-w-0 no-underline">
                <span className="block truncate text-[15px] font-semibold text-[var(--ink)]">{c.title}</span>
                <span className="text-[13px] text-[var(--ink-2)]">{c.kind}, closes {c.when}</span>
              </a>
              <span className={cx('shrink-0 text-[13px] font-semibold', c.days <= 3 ? 'text-[#9B3D32]' : 'text-[#85660F]')}>{word(c.days)}</span>
            </li>
          ))}
        </ul>
      ) : <p className="mt-3 text-[14px] text-[var(--ink-2)]">No closing dates in the next 14 days.</p>}
    </section>
  )
}

function Ring({ pct, color = '#1E3570', children }: { pct: number; color?: string; children?: React.ReactNode }) {
  const r = 34, c = 2 * Math.PI * r, p = Math.max(0, Math.min(100, pct))
  return (
    <div className="relative size-24 shrink-0">
      <svg viewBox="0 0 80 80" className="size-24 -rotate-90" aria-hidden>
        <circle cx="40" cy="40" r={r} fill="none" stroke="#E6EBF5" strokeWidth="8" />
        <circle cx="40" cy="40" r={r} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - p / 100)} style={{ transition: 'stroke-dashoffset .9s cubic-bezier(.22,1,.36,1)' }} />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-body-medium text-text-primary tabular-nums">{children}</span>
    </div>
  )
}

export type Health = { seo?: { total: number; missing: number; href: string }; security?: { total: number; without: number; href: string } }
export function HealthRings({ seo, security }: Health) {
  if (!seo && !security) return null
  return (
    <section className={SHEET}>
      <h3 className={H}><Dash />Site health</h3>
      <div className="mt-4 flex flex-col gap-5">
        {seo && (() => { const done = Math.max(0, seo.total - seo.missing); const pct = seo.total ? Math.round((done / seo.total) * 100) : 100
          return (
            <div className="flex items-center gap-4">
              <Ring pct={pct} color="#C29B38">{pct}%</Ring>
              <div className="min-w-0 text-[14px] leading-snug text-[var(--ink-2)]">
                <p className="text-[15px] font-semibold text-[var(--ink)]">Search descriptions</p>
                <p>{seo.missing === 0 ? 'All pages have one.' : `${done} of ${seo.total} pages have a description.`}</p>
                {seo.missing > 0 && <a href={seo.href} className="mt-1 inline-block font-semibold text-[var(--navy-t)]">Fix next →</a>}
              </div>
            </div>
          ) })()}
        {security && (() => { const done = security.total - security.without; const pct = security.total ? Math.round((done / security.total) * 100) : 100
          return (
            <div className="flex items-center gap-4">
              <Ring pct={pct} color="#1E3570">{done}/{security.total}</Ring>
              <div className="min-w-0 text-[14px] leading-snug text-[var(--ink-2)]">
                <p className="text-[15px] font-semibold text-[var(--ink)]">Two-factor sign-in</p>
                <p>{security.without === 0 ? 'Enabled for everyone.' : `${security.without} of ${security.total} accounts without it.`}</p>
                {security.without > 0 && <a href={security.href} className="mt-1 inline-block font-semibold text-[var(--navy-t)]">View users →</a>}
              </div>
            </div>
          ) })()}
      </div>
    </section>
  )
}

export type Pipe = { draft: number; review: number; changes: number; published: number; hrefs: { review?: string } }
export function Pipeline({ p }: { p: Pipe }) {
  const steps = [
    { n: p.draft, label: p.draft === 1 ? 'Draft' : 'Drafts' },
    { n: p.review, label: p.changes ? `In review, ${p.changes} sent back` : 'In review', href: p.hrefs.review },
    { n: p.published, label: 'Live' },
  ]
  return (
    <section className={SHEET}>
      <h3 className={H}><Dash />Content pipeline</h3>
      <ol className="mt-4 grid grid-cols-1 items-stretch gap-0 sm:grid-cols-3">
        {steps.map((s, i) => {
          const body = (<><span className="block font-[family-name:var(--edif-display,inherit)] text-[2rem] leading-none font-extrabold tabular-nums text-[var(--navy-t)]">{s.n}</span><span className="mt-1.5 block text-[14px] text-[var(--ink-2)]">{s.label}</span></>)
          return <li key={i} className={cx('px-5 py-1', i > 0 && 'sm:border-s sm:border-[var(--hair)]', i === 0 && 'sm:ps-0')}>{s.href ? <a href={s.href} className="block no-underline">{body}</a> : body}</li>
        })}
      </ol>
    </section>
  )
}

export type Act = { id: string | number; text: string; ago: string; kind: 'security' | 'edit' | 'other'; count: number; parts?: { who: string; verb: string; what: string; detail: string } }
export function Activity({ items, href }: { items: Act[]; href: string }) {
  const [tab, setTab] = useState<'all' | 'security' | 'edit'>('all')
  const shown = items.filter((i) => tab === 'all' || i.kind === tab).slice(0, 7)
  const tabs: ['all' | 'security' | 'edit', string][] = [['all', 'Everything'], ['edit', 'Edits'], ['security', 'Security']]
  return (
    <section className={SHEET}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className={H}><Dash />Recent activity</h3>
        <div className="flex gap-1" role="group" aria-label="Filter activity">
          {tabs.map(([k, l]) => <button key={k} type="button" aria-pressed={tab === k} onClick={() => setTab(k)} className={cx('rounded-full px-3 py-1 text-[13px] font-semibold outline-none focus-visible:ring-2 focus-visible:ring-[#2875BA]', tab === k ? 'bg-[#1E3570] text-white' : 'text-[var(--ink-2)] hover:bg-[var(--chip)]')}>{l}</button>)}
        </div>
      </div>
      <ul className="mt-2">
        {shown.map((a) => (
          <li key={a.id} className="flex items-baseline gap-3 border-b border-[var(--hair)] py-2.5 last:border-0">
            <span className={cx('size-1.5 shrink-0 translate-y-[-2px] rounded-full', a.kind === 'security' ? 'bg-[#C29B38]' : 'bg-[#2875BA]')} aria-hidden />
            <div className="min-w-0 flex-1">
              {a.parts ? <p className="text-[14px] text-[var(--ink)]"><b className="font-semibold">{a.parts.who}</b> {a.parts.verb} <span className="font-semibold">{a.parts.what}</span></p> : <p className="text-[14px] text-[var(--ink)]">{a.text}</p>}
              {a.parts?.detail && <p className="mt-0.5 text-[13px] text-[var(--ink-2)]">{a.parts.detail}</p>}
            </div>
            {a.count > 1 && <span className="shrink-0 rounded-full bg-[var(--chip)] px-2 py-0.5 text-[12px] font-semibold text-[var(--navy-t)]">×{a.count}</span>}
            <span className="shrink-0 text-[13px] text-[var(--ink-3)]">{a.ago}</span>
          </li>
        ))}
        {!shown.length && <li className="py-3 text-[14px] text-[var(--ink-2)]">No activity.</li>}
      </ul>
      <a href={href} className="mt-2 inline-block text-[14px] font-semibold text-[var(--navy-t)]">View audit log →</a>
    </section>
  )
}

export type Cmd = { label: string; href: string; group: string }
export function CommandPalette({ commands }: { commands: Cmd[] }) {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [i, setI] = useState(0)
  const input = useRef<HTMLInputElement>(null)
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setOpen((o) => !o); setQ(''); setI(0) }
      else if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k)
  }, [])
  useEffect(() => { if (open) setTimeout(() => input.current?.focus(), 20) }, [open])
  const list = useMemo(() => commands.filter((c) => (c.label + ' ' + c.group).toLowerCase().includes(q.trim().toLowerCase())).slice(0, 9), [commands, q])
  const go = (c?: Cmd) => { if (c) window.location.href = c.href }
  return (
    <div className="edif-bui">
      <button type="button" onClick={() => { setOpen(true); setQ(''); setI(0) }} className="flex w-full max-w-md items-center gap-2 rounded-full border border-[var(--sheet-line)] bg-[var(--sheet)] px-4 py-2 text-start text-[14px] text-[var(--ink-2)] outline-none hover:bg-[var(--chip)] focus-visible:ring-2 focus-visible:ring-[#2875BA]">
        <RiSearchLine className="size-4" aria-hidden /><span className="flex-1">Find a page, tender, setting…</span><kbd className="rounded-md bg-background-tertiary-default px-1.5 py-0.5 text-[11px]">⌘ K</kbd>
      </button>
      {open && (
        <div className="fixed inset-0 z-[9999] flex items-start justify-center bg-black/40 p-4 pt-[12vh]" onMouseDown={(e) => { if (e.target === e.currentTarget) setOpen(false) }}>
          <div role="dialog" aria-modal="true" aria-label="Quick find" className="w-full max-w-lg overflow-hidden rounded-2xl bg-background-primary-default shadow-xl">
            <div className="flex items-center gap-2 border-b border-separator-border px-4 py-3"><RiSearchLine className="size-5 text-foreground-icon-tertiary" aria-hidden />
              <input ref={input} value={q} onChange={(e) => { setQ(e.target.value); setI(0) }} placeholder="Type to search…" aria-label="Search the admin"
                onKeyDown={(e) => { if (e.key === 'ArrowDown') { e.preventDefault(); setI((x) => Math.min(list.length - 1, x + 1)) } else if (e.key === 'ArrowUp') { e.preventDefault(); setI((x) => Math.max(0, x - 1)) } else if (e.key === 'Enter') go(list[i]) }}
                className="flex-1 bg-transparent text-body-medium text-text-primary outline-none placeholder:text-text-placeholder" /></div>
            <ul className="max-h-80 overflow-auto p-2" role="listbox">
              {list.map((c, n) => (
                <li key={c.href + c.label} role="option" aria-selected={n === i}>
                  <a href={c.href} onMouseEnter={() => setI(n)} className={cx('flex items-center justify-between rounded-xl px-3 py-2 no-underline', n === i ? 'bg-[#1E3570] text-white' : 'text-text-primary')}>
                    <span className="text-body-2-medium">{c.label}</span><span className={cx('text-body-2-regular', n === i ? 'text-white/70' : 'text-text-tertiary')}>{c.group}</span>
                  </a>
                </li>
              ))}
              {!list.length && <li className="px-3 py-6 text-center text-body-2-regular text-text-secondary">Nothing matches “{q}”.</li>}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
