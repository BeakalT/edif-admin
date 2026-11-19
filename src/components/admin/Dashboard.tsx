import { BACKUP_DIR } from '@/lib/paths'
import { adminUrl } from '@/lib/adminRoute'
import React from 'react'
import fs from 'fs'
import path from 'path'
import { seoHealth } from '../../lib/seoHealth'
import { passedTwoFactor } from '../../lib/twoFactor'
import { summarize } from '../../lib/auditSummary'
import { daysLeft, type DayStat } from './dashFormat'
import { I } from './dashIcons'
import { VisitsPanel, ActivityFeed } from './DashboardIslands'

const REVIEW = ['pages', 'news', 'publications', 'faqs', 'members', 'key-figures', 'tenders', 'vacancies', 'events', 'notices']
const day = (n: number) => new Date(Date.now() + n * 864e5)

const nowMs = () => Date.now()
const addrHour = () => (new Date().getUTCHours() + 3) % 24 // Addis Ababa is UTC+3

export default async function Dashboard(props: any) {
  const { payload, user } = props
  // The dashboard renders right after the password step, before the redirect to the code screen. It reads with access overridden, so show nothing until two-factor is done.
  if (!passedTwoFactor(payload, user)) return null
  const role = user?.role
  const sys = { overrideAccess: true as const, depth: 0, limit: 50, pagination: false as const }
  const staffOnly = ['admin', 'publisher'].includes(role)
  const canEdit = ['admin', 'publisher', 'editor'].includes(role)
  const hasHealth = ['admin', 'publisher', 'auditor', 'seo'].includes(role)

  const reviews: { slug: string; id: any; title: string; status: string; note?: string }[] = []
  for (const slug of REVIEW) {
    const r: any = await payload.find({ collection: slug, draft: true, where: { reviewStatus: { in: ['in_review', 'changes_requested'] } }, ...sys }).catch(() => ({ docs: [] }))
    for (const d of r.docs) reviews.push({ slug, id: d.id, title: d.title || d.label || d.question || d.name || d.message || `#${d.id}`, status: d.reviewStatus, note: d.reviewNote })
  }
  const inReview = reviews.filter((r) => r.status === 'in_review'), changes = reviews.filter((r) => r.status === 'changes_requested')

  const [msgs, tenders, vacs, jobs, noTotp, failed, views, recent] = await Promise.all([
    staffOnly ? payload.count({ collection: 'messages', where: { status: { equals: 'new' } }, overrideAccess: true }) : { totalDocs: 0 },
    payload.find({ collection: 'tenders', where: { and: [{ _status: { equals: 'published' } }, { closingDate: { greater_than: new Date().toISOString() } }, { closingDate: { less_than: day(14).toISOString() } }] }, ...sys }),
    payload.find({ collection: 'vacancies', where: { and: [{ _status: { equals: 'published' } }, { closingDate: { greater_than: new Date().toISOString() } }, { closingDate: { less_than: day(14).toISOString() } }] }, ...sys }),
    payload.find({ collection: 'payload-jobs', where: { and: [{ taskSlug: { equals: 'schedulePublish' } }, { hasError: { not_equals: true } }, { completedAt: { exists: false } }] }, ...sys, limit: 20 }).catch(() => ({ docs: [] })),
    role === 'admin' ? payload.find({ collection: 'users', ...sys, limit: 500 }).then((r: any) => ({ totalDocs: r.docs.filter((u: any) => !u.hasTotp).length, all: r.docs.length })) : { totalDocs: 0, all: 0 },
    ['admin', 'auditor'].includes(role) ? payload.count({ collection: 'audit-log', where: { and: [{ action: { equals: 'security' } }, { createdAt: { greater_than: day(-1).toISOString() } }] }, overrideAccess: true }) : { totalDocs: 0 },
    ['admin', 'publisher', 'auditor'].includes(role) ? payload.find({ collection: 'page-views', where: { day: { greater_than_equal: day(-59).toISOString().slice(0, 10) } }, ...sys, limit: 20000 }) : { docs: [] },
    ['admin', 'auditor'].includes(role) ? payload.find({ collection: 'audit-log', sort: '-createdAt', ...sys, limit: 40 }) : { docs: [] },
  ])
  const seo = ['admin', 'publisher', 'seo'].includes(role) ? await seoHealth(payload).catch(() => []) : []
  const CONTENT: [string, string][] = [['pages', 'Pages'], ['news', 'News'], ['publications', 'Publications'], ['tenders', 'Tenders'], ['vacancies', 'Vacancies'], ['events', 'Events'], ['faqs', 'FAQs']]
  const content = canEdit ? (await Promise.all(CONTENT.map(async ([slug, label]) => {
    try {
      const [pub, dr] = await Promise.all([
        payload.count({ collection: slug, where: { _status: { equals: 'published' } }, overrideAccess: true }),
        payload.count({ collection: slug, where: { _status: { equals: 'draft' } }, overrideAccess: true }),
      ])
      return { slug, label, pub: pub.totalDocs as number, dr: dr.totalDocs as number }
    } catch { return null }
  }))).filter((x): x is { slug: string; label: string; pub: number; dr: number } => !!x && x.pub + x.dr > 0) : []
  const perDay = new Map<string, Record<string, number>>()
  for (const v of (views as any).docs) { const k = String(v.day).slice(0, 10); const m = perDay.get(k) || {}; m[v.path] = (m[v.path] || 0) + v.views; perDay.set(k, m) }
  const days60: DayStat[] = Array.from({ length: 60 }, (_, k) => {
    const d = day(-59 + k); const key = d.toISOString().slice(0, 10); const paths = perDay.get(key) || {}
    return { key, label: d.toLocaleDateString('en-GB', { weekday: 'short', timeZone: 'UTC' }), date: d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' }), n: Object.values(paths).reduce((x, y) => x + y, 0), paths }
  })
  const series = days60.slice(-7)
  const total = series.reduce((x, y) => x + y.n, 0)
  const prev = days60.slice(-14, -7).reduce((x, y) => x + y.n, 0)
  const delta = prev > 0 ? Math.round(((total - prev) / prev) * 100) : null

  let backup = 'No backup found yet'
  try {
    const dir = BACKUP_DIR
    const f = fs.readdirSync(dir).filter((n) => n.startsWith('edif-')).sort().pop()
    if (f) { const ageH = Math.round((nowMs() - fs.statSync(path.join(dir, f)).mtimeMs) / 3600_000); backup = `${f} (${ageH < 48 ? ageH + ' hours' : Math.round(ageH / 24) + ' days'} ago)` }
  } catch { /* no backups folder */ }

  const hour = addrHour()
  const hello = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Africa/Addis_Ababa' })
  const closing = [
    ...tenders.docs.map((t: any) => ({ kind: 'Tender', title: t.title as string, href: adminUrl(`/collections/tenders/${t.id}`), at: t.closingDate as string })),
    ...vacs.docs.map((t: any) => ({ kind: 'Vacancy', title: t.title as string, href: adminUrl(`/collections/vacancies/${t.id}`), at: t.closingDate as string })),
  ].filter((x) => x.at).sort((a, b) => +new Date(a.at) - +new Date(b.at))
  const featured = closing[0]
  const chip = featured ? new Date(featured.at) : null
  const rows: { href: string; label: string; count: number; detail: string; tone: string; icon: string }[] = []
  if (inReview.length) rows.push({ href: adminUrl(`/collections/${inReview[0].slug}/${inReview[0].id}`), label: 'Waiting for review', count: inReview.length, detail: inReview[0].title, tone: 'blue', icon: 'review' })
  if (changes.length) rows.push({ href: adminUrl(`/collections/${changes[0].slug}/${changes[0].id}`), label: 'Changes requested', count: changes.length, detail: changes[0].note || changes[0].title, tone: 'amber', icon: 'changes' })
  if (staffOnly && (msgs as any).totalDocs) rows.push({ href: adminUrl('/collections/messages'), label: 'New messages', count: (msgs as any).totalDocs, detail: 'Unread contact messages', tone: 'green', icon: 'inbox' })
  if (seo.length) rows.push({ href: seo[0].link, label: 'Search descriptions', count: seo.length, detail: seo[0].text, tone: 'gold', icon: 'search' })
  if (jobs.docs.length) rows.push({ href: adminUrl('/collections/pages'), label: 'Scheduled', count: jobs.docs.length, detail: 'Pages set to publish or unpublish', tone: 'violet', icon: 'calendar' })
  if (['admin', 'auditor'].includes(role) && (failed as any).totalDocs) rows.push({ href: adminUrl('/collections/audit-log'), label: 'Security, last 24 hours', count: (failed as any).totalDocs, detail: 'Sign-ins, lockouts, and exports', tone: 'red', icon: 'shield' })
  if (role === 'admin' && (noTotp as any).totalDocs) rows.push({ href: adminUrl('/collections/users'), label: 'Two-factor not set up', count: (noTotp as any).totalDocs, detail: `Of ${(noTotp as any).all} accounts`, tone: 'violet', icon: 'lock' })
  if (role === 'admin' && backup.startsWith('No backup')) rows.push({ href: adminUrl('/collections/audit-log'), label: 'Backup', count: 1, detail: 'No backup recorded yet', tone: 'amber', icon: 'db' })
  const attention = (featured ? 1 : 0) + rows.length
  const lead = attention ? `${attention} ${attention === 1 ? 'thing needs' : 'things need'} your attention today.` : canEdit ? 'Nothing is waiting for you. A good day to improve a page.' : 'Nothing is waiting for you.'
  const extra: string[] = []
  if (['admin', 'publisher', 'auditor'].includes(role) && total > 0) extra.push(`Your site had ${total} ${total === 1 ? 'visit' : 'visits'} this week${delta !== null && delta !== 0 ? `, ${delta > 0 ? 'up' : 'down'} ${Math.abs(delta)}% on last week` : ''}.`)
  if (seo.length) extra.push(`${seo.length} ${seo.length === 1 ? 'page needs' : 'pages need'} a search fix.`)
  const summary = [lead, ...extra].join(' ')
  const activity = groupActivity((recent as any).docs).filter((i) => i.action !== 'login' && i.action !== 'logout' && !/correct password/i.test(i.text))

  const published = content.reduce((n, c) => n + c.pub, 0)
  const drafts = content.reduce((n, c) => n + c.dr, 0)

  return (
    <div className="edif-board">
      <section className="edif-dash__hero">
        <div className="edif-dash__lead">
          <div className="edif-dash__date">{today}</div>
          <h2>{hello}{user?.name ? `, ${user.name}` : ''}</h2>
          <p>{summary}</p>
          <div className="edif-dash__actions">
            {canEdit && <a className="primary" href={adminUrl('/collections/pages/create')}>+ New page</a>}
            {canEdit && <a href={adminUrl('/collections/news/create')}>+ News article</a>}
            {canEdit && <a href={adminUrl('/collections/media/create')}>Upload a file</a>}
            {canEdit && <a href={adminUrl('/collections/pages')}>Edit a page</a>}
            {role === 'seo' && <a className="primary" href={adminUrl('/collections/seo-pages')}>Page search settings</a>}
            {role === 'seo' && <a href={adminUrl('/collections/redirects')}>Redirects</a>}
            {role === 'auditor' && <a className="primary" href={adminUrl('/collections/audit-log')}>Audit log</a>}
            {role === 'auditor' && <a href={adminUrl('/collections/page-views')}>Visit statistics</a>}
            <a href="/" target="_blank" rel="noreferrer">View the website ↗</a>
          </div>
        </div>
        <dl className="edif-dash__stats">
          {canEdit && <div><dt>Published</dt><dd>{published}</dd></div>}
          {canEdit && <div><dt>Drafts</dt><dd>{drafts}</dd></div>}
          <div><dt>In review</dt><dd>{inReview.length}</dd></div>
          {hasHealth && <div><dt>Visits today</dt><dd>{series[series.length - 1].n}</dd></div>}
        </dl>
      </section>

      <section className="edif-board__sheet">
        <h3>To do</h3>
        {(featured || rows.length) ? (
          <div className="edif-board__todo">
            {featured && (
              <a className="edif-board__card edif-board__card--gold edif-board__feat" href={featured.href}>
                <span className="edif-board__chip"><b>{chip!.toLocaleDateString('en-GB', { day: 'numeric', timeZone: 'Africa/Addis_Ababa' })}</b><small>{chip!.toLocaleDateString('en-GB', { month: 'short', timeZone: 'Africa/Addis_Ababa' })}</small></span>
                <span className="edif-board__cardcopy"><strong>{featured.title}</strong><em>{featured.kind} · closes {daysLeft(featured.at)}</em></span>
              </a>
            )}
            {rows.map((r) => (
              <a className={`edif-board__card edif-board__card--${r.tone}`} href={r.href} key={r.label}>
                <span className="edif-board__mark"><I n={r.icon} /></span>
                <span className="edif-board__cardcopy"><b>{r.count}</b><strong>{r.label}</strong><em>{r.detail}</em></span>
              </a>
            ))}
          </div>
        ) : <p className="edif-board__clear">Nothing is waiting.</p>}
      </section>

      <div className="edif-board__split">
        {!!content.length && (
          <section className="edif-board__sheet">
            <h3>Content</h3>
            <ul className="edif-board__meters">
              {content.map((c) => {
                const t = c.pub + c.dr
                return (
                  <li key={c.slug}><a href={adminUrl(`/collections/${c.slug}`)}>
                    <span>{c.label}</span>
                    <span className="edif-board__track" aria-hidden="true"><i className="pub" style={{ width: `${(c.pub / t) * 100}%` }} /><i className="dr" style={{ width: `${(c.dr / t) * 100}%` }} /></span>
                    <span className="edif-board__count"><b>{c.pub}</b> published{c.dr ? <> · <b>{c.dr}</b> draft</> : null}</span>
                  </a></li>
                )
              })}
            </ul>
            <p className="edif-board__key"><i className="pub" />Published<i className="dr" />Draft</p>
          </section>
        )}
        {hasHealth && <VisitsPanel days={days60} />}
      </div>

      {!!activity.length && <ActivityFeed items={activity} href={adminUrl('/collections/audit-log')} />}
    </div>
  )
}

/** Plain sentences for the dashboard: the audit log's own summary, with identical neighbouring rows collapsed into one line. */
function groupActivity(docs: any[]): { id: string | number; text: string; at: string; count: number; action: string }[] {
  const out: { id: string | number; text: string; at: string; count: number; action: string }[] = []
  for (const e of docs) {
    const text: string = e.summary || summarize(e)
    const last = out[out.length - 1]
    if (last && last.text === text) last.count++
    else out.push({ id: e.id, text, at: e.createdAt, count: 1, action: String(e.action || '') })
  }
  return out
}
