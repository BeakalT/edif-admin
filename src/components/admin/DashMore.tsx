'use client'
import React, { useEffect } from 'react'
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

export type WeekDay = { label: string; num: string; today: boolean; events: { text: string; kind: 'close' | 'publish' }[] }
export function WeekStrip({ days }: { days: WeekDay[] }) {
  const any = days.some((d) => d.events.length)
  return (
    <section className={SHEET}>
      <h3 className={H}><Dash />This week</h3>
      <ol className="mt-4 grid grid-cols-7 gap-1.5 sm:gap-2">
        {days.map((d) => (
          <li key={d.label + d.num} className={cx('min-h-24 rounded-xl border p-2', d.today ? 'border-[#C29B38] bg-[#C29B38]/10' : 'border-[var(--hair)]')}>
            <span className="block text-[11px] font-bold tracking-wider text-[var(--ink-3)] uppercase">{d.label}</span>
            <span className={cx('block text-[18px] leading-tight font-extrabold tabular-nums', d.today ? 'text-[#85660F]' : 'text-[var(--navy-t)]')}>{d.num}</span>
            <ul className="mt-1.5 space-y-1">
              {d.events.map((e, i) => <li key={i} className={cx('rounded-md px-1.5 py-0.5 text-[11px] leading-tight font-semibold', e.kind === 'close' ? 'bg-[#9B3D32]/12 text-[#9B3D32]' : 'bg-[#2875BA]/14 text-[#2875BA]')}>{e.text}</li>)}
            </ul>
          </li>
        ))}
      </ol>
      {!any && <p className="mt-3 text-[14px] text-[var(--ink-2)]">A quiet week: nothing closes and nothing is scheduled to publish.</p>}
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
