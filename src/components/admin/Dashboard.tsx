import { BACKUP_DIR } from '@/lib/paths'
import { adminUrl } from '@/lib/adminRoute'
import React from 'react'
import fs from 'fs'
import path from 'path'
import { seoHealth } from '../../lib/seoHealth'
import { passedTwoFactor } from '../../lib/twoFactor'
import { summarize } from '../../lib/auditSummary'
import { I } from './dashIcons'
import { fmtDay, daysLeft, ago, ACTION_ICON, byDay, type DayStat } from './dashFormat'
import { VisitsPanel, ActivityFeed, Snoozable } from './DashboardIslands'

const REVIEW = ['pages', 'news', 'publications', 'faqs', 'members', 'key-figures', 'tenders', 'vacancies', 'events', 'notices']
const day = (n: number) => new Date(Date.now() + n * 864e5)

type Row = { href?: string; text: string; meta?: string }
/** One "needs attention" card. Empty shows a calm all-clear; otherwise the count and the first few items. */
const Att = ({ hue, icon, n, label, empty, rows = [], cta }: { hue: string; icon: string; n: number; label: string; empty: string; rows?: Row[]; cta?: { href: string; text: string } }) => (
  <article className={`edif-att edif-att--${hue}${n ? ' has-items' : ''}`}>
    <span className="edif-wm" aria-hidden="true"><I n={icon} /></span>
    <header>
      <span className="edif-att__badge"><I n={icon} /></span>
      <span className="edif-att__n">{n}</span>
    </header>
    <h4>{label}</h4>
    {n === 0 ? (
      <p className="edif-att__ok"><I n="check" />{empty}</p>
    ) : (
      !!rows.length && <ul>{rows.slice(0, 4).map((r, k) => <Snoozable key={k} id={`${hue}:${r.href || r.text}`}>{r.href ? <a href={r.href}><span>{r.text}{r.meta && <small>{r.meta}</small>}</span><I n="arrow" /></a> : <span className="edif-att__plain">{r.text}{r.meta && <small>{r.meta}</small>}</span>}</Snoozable>)}</ul>
    )}
    {cta && <a className="edif-att__cta" href={cta.href}>{cta.text}<I n="arrow" /></a>}
  </article>
)

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
  const edited: { slug: string; id: any; title: string; at: string; status: string }[] = []
  if (canEdit) {
    for (const slug of ['pages', 'news', 'publications', 'tenders', 'vacancies']) {
      const r: any = await payload.find({ collection: slug, sort: '-updatedAt', ...sys, limit: 4, draft: true }).catch(() => ({ docs: [] }))
      for (const d of r.docs) edited.push({ slug, id: d.id, title: d.title || d.label || d.name || `#${d.id}`, at: d.updatedAt, status: d._status || 'published' })
    }
    edited.sort((a, b) => +new Date(b.at) - +new Date(a.at))
  }
  const secDocs: any = ['admin', 'auditor'].includes(role) ? await payload.find({ collection: 'audit-log', where: { and: [{ action: { equals: 'security' } }, { createdAt: { greater_than: day(-6).toISOString().slice(0, 10) } }] }, ...sys, limit: 500, sort: '-createdAt' }).catch(() => ({ docs: [] })) : { docs: [] }
  const secPerDay = new Map<string, number>()
  for (const e of secDocs.docs) { const k = new Date(e.createdAt).toISOString().slice(0, 10); secPerDay.set(k, (secPerDay.get(k) || 0) + 1) }
  const secSeries = Array.from({ length: 7 }, (_, k) => secPerDay.get(day(-6 + k).toISOString().slice(0, 10)) || 0)
  const secPeak = Math.max(1, ...secSeries)
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
  const attention = inReview.length + changes.length + (msgs as any).totalDocs
  const lead = attention ? `${attention} ${attention === 1 ? 'thing needs' : 'things need'} your attention today.` : canEdit ? 'Nothing is waiting for you. A good day to improve a page.' : 'Nothing is waiting for you.'
  const extra: string[] = []
  if (['admin', 'publisher', 'auditor'].includes(role) && total > 0) extra.push(`Your site had ${total} ${total === 1 ? 'visit' : 'visits'} this week${delta !== null && delta !== 0 ? `, ${delta > 0 ? 'up' : 'down'} ${Math.abs(delta)}% on last week` : ''}.`)
  if (seo.length) extra.push(`${seo.length} ${seo.length === 1 ? 'page needs' : 'pages need'} a search fix.`)
  const summary = [lead, ...extra].join(' ')

  return (
    <div className="edif-dash">
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
          {canEdit && <div><dt>Published</dt><dd>{content.reduce((n, c) => n + c.pub, 0)}</dd></div>}
          {canEdit && <div><dt>Drafts</dt><dd>{content.reduce((n, c) => n + c.dr, 0)}</dd></div>}
          <div><dt>In review</dt><dd>{inReview.length}</dd></div>
          {hasHealth && <div><dt>Visits today</dt><dd>{series[series.length - 1].n}</dd></div>}
        </dl>
      </section>


      <h3 className="edif-dash__h">Needs attention<span className="edif-dash__meta">{attention + tenders.docs.length + vacs.docs.length ? `${attention + tenders.docs.length + vacs.docs.length} open` : 'All clear'}</span></h3>
      <div className="edif-att-grid">
        <Att hue="blue" icon="review" n={inReview.length} label="Waiting for review" empty="Nothing is waiting." rows={inReview.map((r) => ({ href: adminUrl(`/collections/${r.slug}/${r.id}`), text: r.title, meta: r.slug }))} cta={inReview.length ? { href: adminUrl(`/collections/${inReview[0].slug}/${inReview[0].id}`), text: 'Review now' } : undefined} />
        <Att hue="amber" icon="changes" n={changes.length} label="Changes requested" empty="Nothing sent back." rows={changes.map((r) => ({ href: adminUrl(`/collections/${r.slug}/${r.id}`), text: r.title, meta: r.note || r.slug }))} cta={changes.length ? { href: adminUrl(`/collections/${changes[0].slug}/${changes[0].id}`), text: 'Open first' } : undefined} />
        {staffOnly && <Att hue="green" icon="inbox" n={(msgs as any).totalDocs} label="New contact messages" empty="Inbox is clear." cta={{ href: adminUrl('/collections/messages'), text: 'Open the inbox' }} />}
        <Att hue="gold" icon="clock" n={tenders.docs.length + vacs.docs.length} label="Closing within 14 days" empty="Nothing closing soon."
          cta={{ href: adminUrl(tenders.docs.length && !vacs.docs.length ? '/collections/tenders' : '/collections/vacancies'), text: tenders.docs.length + vacs.docs.length ? 'See all' : 'Browse vacancies' }}
          rows={[...tenders.docs.map((t: any) => ({ href: adminUrl(`/collections/tenders/${t.id}`), text: `Tender · ${t.title}`, meta: t.closingDate ? `Closes ${fmtDay(t.closingDate)} · ${daysLeft(t.closingDate)}` : undefined })), ...vacs.docs.map((t: any) => ({ href: adminUrl(`/collections/vacancies/${t.id}`), text: `Vacancy · ${t.title}`, meta: t.closingDate ? `Closes ${fmtDay(t.closingDate)} · ${daysLeft(t.closingDate)}` : undefined }))]} />
        <Att hue="violet" icon="calendar" n={jobs.docs.length} label="Scheduled to publish or unpublish" empty="Nothing scheduled."
          rows={jobs.docs.map((j: any) => ({ text: `${j.input?.type || 'publish'}`, meta: j.waitUntil ? new Date(j.waitUntil).toLocaleString('en-GB', { timeZone: 'Africa/Addis_Ababa' }) : 'soon' }))} />
      </div>

      {hasHealth && <h3 className="edif-dash__h">Site health<span className="edif-dash__meta">Last 7 days</span></h3>}
      {hasHealth && <div className="edif-bento">
        {(!!(views as any).docs.length || ['admin', 'publisher', 'auditor'].includes(role)) && (
          <VisitsPanel days={days60} />
        )}
        {['admin', 'publisher', 'seo'].includes(role) && (
          <section className={'edif-pane edif-pane--seo' + (seo.length ? ' is-warn' : ' is-ok')}>
            <header><span className={'edif-pane__badge edif-pane__badge--' + (seo.length ? 'gold' : 'green')}><I n="search" /></span><h4>Search (SEO) checks</h4></header>
            <div className="edif-pane__big">{seo.length}<small>{seo.length === 1 ? 'issue to fix' : 'issues to fix'}</small></div>
            {seo.length === 0 ? <p className="edif-att__ok"><I n="check" />No problems found.</p> : (
              <ul className="edif-issues">{seo.slice(0, 4).map((i, k) => <li key={k}><a href={i.link}><I n="warn" /><span>{i.text}</span></a></li>)}{seo.length > 4 && <li className="edif-issues__more"><a href={adminUrl('/collections/seo-pages')}>and {seo.length - 4} more: open Page search settings<I n="arrow" /></a></li>}</ul>
            )}
            {seo.length > 0 && <a className="edif-att__cta" href={seo[0].link}>Fix the first one<I n="arrow" /></a>}
          </section>
        )}
        {['admin', 'auditor'].includes(role) && (
          <div className="edif-bento__side">
            {role === 'admin' && (
              <section className={'edif-mini ' + ((noTotp as any).totalDocs ? 'is-warn' : 'is-ok')}>
                <span className={'edif-pane__badge edif-pane__badge--' + ((noTotp as any).totalDocs ? 'gold' : 'green')}><I n="lock" /></span>
                <div><h4>Accounts without two-factor</h4>
                  <div className="edif-mini__n">{(noTotp as any).totalDocs}<small>of {(noTotp as any).all}</small></div>
                  <div className="edif-meter" aria-hidden="true"><i style={{ width: `${(noTotp as any).all ? Math.round((1 - (noTotp as any).totalDocs / (noTotp as any).all) * 100) : 100}%` }} /></div>
                  <p>They must set it up at next sign-in.</p><a className="edif-mini__cta" href={adminUrl('/collections/users')}>Manage accounts<I n="arrow" /></a></div>
              </section>
            )}
            <section className={'edif-mini ' + ((failed as any).totalDocs ? 'is-warn' : 'is-ok')}>
              <span className={'edif-pane__badge edif-pane__badge--' + ((failed as any).totalDocs ? 'gold' : 'green')}><I n="shield" /></span>
              <div><h4>Security events, last 24 hours</h4>
                <div className="edif-mini__n">{(failed as any).totalDocs}</div>
                <div className="edif-spark" role="img" aria-label={`Security events per day, last 7 days: ${secSeries.join(', ')}`}>{secSeries.map((n, k) => <i key={k} style={{ height: `${Math.max(n ? 14 : 4, (n / secPeak) * 100)}%` }} className={n ? 'has' : ''} />)}</div>
                <p>Failed sign-ins, lockouts, exports.</p><a className="edif-mini__cta" href={adminUrl('/collections/audit-log')}>Open the audit log<I n="arrow" /></a></div>
            </section>
            {role === 'admin' && (
              <section className={'edif-mini ' + (backup.startsWith('No backup') ? 'is-warn' : 'is-ok')}>
                <span className={'edif-pane__badge edif-pane__badge--' + (backup.startsWith('No backup') ? 'gold' : 'green')}><I n="db" /></span>
                <div><h4>Last backup</h4><p className="edif-mini__t">{backup}</p></div>
              </section>
            )}
          </div>
        )}
      </div>}

      {canEdit && (!!content.length || !!edited.length) && (
        <>
          <h3 className="edif-dash__h">Content<span className="edif-dash__meta">Published and drafts</span></h3>
          <div className="edif-bento">
            {!!content.length && (
              <section className="edif-pane edif-pane--content">
                <header><span className="edif-pane__badge edif-pane__badge--blue"><I n="layers" /></span><h4>Content overview</h4></header>
                <ul className="edif-stack">
                  {content.map((c) => { const t = c.pub + c.dr; return (
                    <li key={c.slug}><a href={adminUrl(`/collections/${c.slug}`)}><span className="edif-stack__l">{c.label}</span><span className="edif-stack__bar" aria-hidden="true"><i className="pub" style={{ width: `${(c.pub / t) * 100}%` }} /><i className="dr" style={{ width: `${(c.dr / t) * 100}%` }} /></span><span className="edif-stack__n"><b>{c.pub}</b> live{c.dr ? <> · <b>{c.dr}</b> draft</> : null}</span></a></li>
                  ) })}
                </ul>
                <p className="edif-legend"><span className="pub">Published</span><span className="dr">Draft</span></p>
              </section>
            )}
            {!!edited.length && (
              <section className="edif-pane edif-pane--edited">
                <header><span className="edif-pane__badge edif-pane__badge--gold"><I n="pen" /></span><h4>Recently edited</h4></header>
                <ul className="edif-recent">
                  {edited.slice(0, 6).map((e) => <li key={e.slug + e.id}><a href={adminUrl(`/collections/${e.slug}/${e.id}`)}><span className="edif-recent__ic"><I n="file" /></span><span className="edif-recent__t">{e.title}<small>{e.slug}</small></span><span className={'edif-recent__s ' + (e.status === 'draft' ? 'is-draft' : 'is-live')}>{e.status === 'draft' ? 'Draft' : 'Live'}</span><time dateTime={e.at}>{ago(e.at)}</time></a></li>)}
                </ul>
              </section>
            )}
          </div>
        </>
      )}

      {!!(recent as any).docs.length && (
        <>
          <h3 className="edif-dash__h">Recent activity<span className="edif-dash__meta">Latest events</span></h3>
          <ActivityFeed items={groupActivity((recent as any).docs).slice(0, 30)} href={adminUrl('/collections/audit-log')} />
        </>
      )}
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
