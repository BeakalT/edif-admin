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
import { DashStats, DashVisits, type DashStat } from './DashBui'
import { QuickActions, ClosingSoon, HealthRings, Pipeline, Activity, CommandPalette, type Quick, type Cmd } from './DashBlocks'
import { ago } from './dashFormat'
import { Resume, Inbox, DashCalendar, PulseNotes, type ResumeItem, type InboxItem, type CalEvent } from './DashMore'

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
      const [pub, dr, wk] = await Promise.all([
        payload.count({ collection: slug, where: { _status: { equals: 'published' } }, overrideAccess: true }),
        payload.count({ collection: slug, where: { _status: { equals: 'draft' } }, overrideAccess: true }),
        payload.count({ collection: slug, where: { and: [{ _status: { equals: 'published' } }, { updatedAt: { greater_than: day(-7).toISOString() } }] }, overrideAccess: true }),
      ])
      return { slug, label, pub: pub.totalDocs as number, dr: dr.totalDocs as number, wk: wk.totalDocs as number }
    } catch { return null }
  }))).filter((x): x is { slug: string; label: string; pub: number; dr: number; wk: number } => !!x && x.pub + x.dr > 0) : []
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
  if (staffOnly && (msgs as any).totalDocs) rows.push({ href: adminUrl('/collections/messages'), label: 'New messages', count: (msgs as any).totalDocs, detail: 'Unread', tone: 'green', icon: 'inbox' })
  if (seo.length) rows.push({ href: seo[0].link, label: 'Search descriptions', count: seo.length, detail: seo[0].text, tone: 'gold', icon: 'search' })
  if (jobs.docs.length) rows.push({ href: adminUrl('/collections/pages'), label: 'Scheduled', count: jobs.docs.length, detail: 'Publish or unpublish', tone: 'violet', icon: 'calendar' })
  if (['admin', 'auditor'].includes(role) && (failed as any).totalDocs) rows.push({ href: adminUrl('/collections/audit-log'), label: 'Security, last 24 hours', count: (failed as any).totalDocs, detail: 'Sign-ins, lockouts, exports', tone: 'red', icon: 'shield' })
  if (role === 'admin' && (noTotp as any).totalDocs) rows.push({ href: adminUrl('/collections/users'), label: 'Two-factor not set up', count: (noTotp as any).totalDocs, detail: `Of ${(noTotp as any).all} accounts`, tone: 'violet', icon: 'lock' })
  if (role === 'admin' && backup.startsWith('No backup')) rows.push({ href: adminUrl('/collections/audit-log'), label: 'Backup', count: 1, detail: 'No backup recorded yet', tone: 'amber', icon: 'db' })
  const attention = (featured ? 1 : 0) + rows.length
  const lead = attention ? `${attention} ${attention === 1 ? 'item needs' : 'items need'} attention.` : 'Nothing waiting.'
  const extra: string[] = []
  if (featured) extra.push(`${featured.kind} “${featured.title}” closes ${daysLeft(featured.at)}.`)
  const summary = [lead, ...extra].join(' ')
  const activity = groupActivity((recent as any).docs).filter((i) => i.action !== 'login' && i.action !== 'logout' && !/correct password/i.test(i.text))

  const published = content.reduce((n, c) => n + c.pub, 0)
  const drafts = content.reduce((n, c) => n + c.dr, 0)

  const win = { and: [{ _status: { equals: 'published' } }] }
  const range = (f: string) => [{ [f]: { greater_than: day(-40).toISOString() } }, { [f]: { less_than: day(150).toISOString() } }]
  const calFind = (collection: string, f: string) => (canEdit ? payload.find({ collection, where: { and: [...win.and, ...range(f)] }, ...sys, limit: 200 }).then((r: any) => r.docs).catch(() => []) : Promise.resolve([]))
  const [draftDocs, inboxDocs, calT, calV, calE] = await Promise.all([
    canEdit ? Promise.all(CONTENT.map(([slug, label]) => payload.find({ collection: slug, draft: true, where: { _status: { equals: 'draft' } }, sort: '-updatedAt', ...sys, limit: 3 }).then((r: any) => r.docs.map((d: any) => ({ slug, label, id: d.id, title: String(d.title || d.label || d.question || d.name || `Untitled ${label.toLowerCase()}`), at: d.updatedAt as string }))).catch(() => []))) : Promise.resolve([]),
    staffOnly ? payload.find({ collection: 'messages', where: { status: { equals: 'new' } }, sort: '-createdAt', ...sys, limit: 3 }).then((r: any) => r.docs).catch(() => []) : Promise.resolve([]),
    calFind('tenders', 'closingDate'), calFind('vacancies', 'closingDate'), calFind('events', 'startsAt'),
  ])
  const resume: ResumeItem[] = (draftDocs as any[]).flat().sort((a, b) => +new Date(b.at) - +new Date(a.at)).slice(0, 3).map((d) => ({ title: d.title, kind: d.label.replace(/s$/, ''), href: adminUrl(`/collections/${d.slug}/${d.id}`), ago: ago(d.at) }))
  const inbox: InboxItem[] = (inboxDocs as any[]).map((m) => ({ name: String(m.name || 'Someone'), subject: String(m.subject || m.topic || ''), excerpt: String(m.message || '').replace(/\s+/g, ' ').slice(0, 90), ago: ago(m.createdAt), href: adminUrl(`/collections/messages/${m.id}`) }))
  const ethDate = (() => { try { return new Date().toLocaleDateString('am-ET-u-ca-ethiopic', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Africa/Addis_Ababa' }) } catch { return '' } })()
  const dk = (iso: string) => new Date(iso).toLocaleDateString('en-CA', { timeZone: 'Africa/Addis_Ababa' })
  const tm = (iso: string) => new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Addis_Ababa' })
  const calEvents: CalEvent[] = [
    ...(calT as any[]).filter((x) => x.closingDate).map((x) => ({ date: dk(x.closingDate), kind: 'close' as const, label: 'Tender closes', title: String(x.title), href: adminUrl(`/collections/tenders/${x.id}`) })),
    ...(calV as any[]).filter((x) => x.closingDate).map((x) => ({ date: dk(x.closingDate), kind: 'close' as const, label: 'Vacancy closes', title: String(x.title), href: adminUrl(`/collections/vacancies/${x.id}`) })),
    ...(calE as any[]).filter((x) => x.startsAt).map((x) => ({ date: dk(x.startsAt), kind: 'event' as const, label: 'Event', title: String(x.title), href: adminUrl(`/collections/events/${x.id}`), time: tm(x.startsAt) })),
    ...(jobs.docs as any[]).filter((j) => j.waitUntil).map((j) => ({ date: dk(j.waitUntil), kind: 'publish' as const, label: 'Scheduled to publish', title: 'Scheduled publish', href: adminUrl('/collections/pages') })),
  ]
  const todayKey = dk(new Date(nowMs()).toISOString())
  const tally = (prefix: string) => { const m: Record<string, number> = {}; for (const d of days60.slice(-7)) for (const [p, n] of Object.entries(d.paths)) if (p.startsWith(prefix)) m[p] = (m[p] || 0) + n; const top = Object.entries(m).sort((a, b) => b[1] - a[1])[0]; return top ? decodeURIComponent(top[0].replace(prefix, '').split('/')[0]).replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase()) : undefined }
  const pulse = {
    wins: content.reduce((n, c) => n + c.wk, 0),
    topNews: hasHealth ? tally('/news/') : undefined,
    topPub: hasHealth ? tally('/publications/') : undefined,
    backup: role === 'admin' ? { text: backup.startsWith('No backup') ? 'No backup recorded.' : `Last backup ${backup.replace(/^edif-[^ ]+ /, '').replace(/[()]/g, '')}.`, ok: !backup.startsWith('No backup') && !/ days/.test(backup) } : undefined,
  }
  const dayMon = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'Africa/Addis_Ababa' })
  const quick: Quick[] = [
    ...(canEdit ? [
      { href: adminUrl('/collections/pages/create'), title: 'New page', desc: 'Create a page', icon: 'page' },
      { href: adminUrl('/collections/news/create'), title: 'News article', desc: 'Publish an update', icon: 'news' },
      { href: adminUrl('/collections/media/create'), title: 'Upload a file', desc: 'Images, reports, documents', icon: 'media' },
    ] as Quick[] : []),
    { href: '/', title: 'View the website', desc: 'Open the public site', icon: 'web', external: true },
  ]
  const closingItems = closing.slice(0, 5).map((c) => ({ kind: c.kind, title: c.title, href: c.href, when: dayMon(c.at), days: Math.max(0, Math.ceil((new Date(c.at).getTime() - nowMs()) / 864e5)) }))
  const pagesRow = content.find((c) => c.slug === 'pages')
  const health = {
    seo: ['admin', 'publisher', 'seo'].includes(role) && pagesRow ? { total: pagesRow.pub + pagesRow.dr, missing: seo.length, href: seo[0]?.link || adminUrl('/collections/pages') } : undefined,
    security: role === 'admin' && (noTotp as any).all ? { total: (noTotp as any).all as number, without: (noTotp as any).totalDocs as number, href: adminUrl('/collections/users') } : undefined,
  }
  const pipe = { draft: drafts, review: inReview.length, changes: changes.length, published, hrefs: { review: inReview[0] ? adminUrl(`/collections/${inReview[0].slug}/${inReview[0].id}`) : undefined } }
  const acts = activity.map((a) => ({ id: a.id, text: a.text, ago: ago(a.at), count: a.count, kind: (a.action === 'security' ? 'security' : /create|update|publish|unpublish|submit|delete/.test(a.action) ? 'edit' : 'other') as 'security' | 'edit' | 'other' }))
  const cmds: Cmd[] = [
    ...(canEdit ? [{ label: 'New page', href: adminUrl('/collections/pages/create'), group: 'Create' }, { label: 'New news article', href: adminUrl('/collections/news/create'), group: 'Create' }, { label: 'Upload a file', href: adminUrl('/collections/media/create'), group: 'Create' }] : []),
    ...CONTENT.map(([slug, label]) => ({ label, href: adminUrl(`/collections/${slug}`), group: 'Content' })),
    ...(staffOnly ? [{ label: 'Messages', href: adminUrl('/collections/messages'), group: 'Inbox' }] : []),
    ...(role === 'admin' ? [{ label: 'Team and users', href: adminUrl('/collections/users'), group: 'Settings' }] : []),
    ...(['admin', 'auditor'].includes(role) ? [{ label: 'Audit log', href: adminUrl('/collections/audit-log'), group: 'Security' }] : []),
    { label: 'View the website', href: '/', group: 'Site' },
  ]
  const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`
  const dashStats: DashStat[] = [
    ...(canEdit ? [
      { label: 'Published', value: String(published), note: 'Live on the site' },
      { label: 'Drafts', value: String(drafts), note: drafts ? 'Being written' : 'None' },
    ] : []),
    { label: 'In review', value: String(inReview.length), note: inReview.length ? 'Awaiting review' : 'None', href: inReview[0] ? adminUrl(`/collections/${inReview[0].slug}/${inReview[0].id}`) : undefined },
    ...(hasHealth ? [{ label: 'Visits this week', value: String(total), note: delta === null ? 'No earlier week to compare' : delta === 0 ? 'Same as last week' : `${delta > 0 ? 'Up' : 'Down'} ${Math.abs(delta)}% on last week` }] : []),
  ]

  return (
    <div className="edif-board">
      <section className="edif-dash__hero">
        <div className="edif-dash__lead">
          <div className="edif-dash__date">{today}{ethDate ? <> · {ethDate}</> : null}</div>
          <h2>{hello}{user?.name ? `, ${user.name}` : ''}</h2>
          <p className="edif-dash__am" lang="am">እንኳን ደህና መጡ</p>
          <p>{summary}</p>
          <div className="edif-dash__actions">
            {role === 'seo' && <a className="primary" href={adminUrl('/collections/seo-pages')}>Page search settings</a>}
            {role === 'seo' && <a href={adminUrl('/collections/redirects')}>Redirects</a>}
            {role === 'auditor' && <a className="primary" href={adminUrl('/collections/audit-log')}>Audit log</a>}
            {role === 'auditor' && <a href={adminUrl('/collections/page-views')}>Visit statistics</a>}
          </div>
        </div>
      </section>

      <CommandPalette commands={cmds} />
      <QuickActions items={quick} />
      <DashStats stats={dashStats} />
      <PulseNotes p={pulse} />
      {(canEdit || staffOnly) && (
        <div className="edif-board__split edif-board__split--even">
          {canEdit && <Resume items={resume} />}
          {staffOnly && <Inbox items={inbox} total={(msgs as any).totalDocs} href={adminUrl('/collections/messages')} />}
        </div>
      )}

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
        ) : <p className="edif-board__clear">Nothing to do.</p>}
      </section>

      <div className="edif-board__split">
        <ClosingSoon items={closingItems} />
        <HealthRings {...health} />
      </div>

      <DashCalendar events={calEvents} todayKey={todayKey} />

      <Pipeline p={pipe} />

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
        {hasHealth && <DashVisits days={days60} />}
      </div>

      {!!acts.length && <Activity items={acts} href={adminUrl('/collections/audit-log')} />}
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
