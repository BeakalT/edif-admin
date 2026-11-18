import { BACKUP_DIR } from '@/lib/paths'
import { adminUrl } from '@/lib/adminRoute'
import React from 'react'
import fs from 'fs'
import path from 'path'
import { seoHealth } from '../../lib/seoHealth'

const REVIEW = ['pages', 'news', 'publications', 'faqs', 'members', 'key-figures', 'tenders', 'vacancies', 'events', 'notices']
const day = (n: number) => new Date(Date.now() + n * 864e5)

const Li = ({ r }: { r: { slug: string; id: any; title: string; note?: string } }) => <li><a href={adminUrl(`/collections/${r.slug}/${r.id}`)}>{r.title}</a> <span style={{ opacity: 0.6 }}>({r.slug}){r.note ? ` · ${r.note}` : ''}</span></li>
const Tile = ({ n, label, sub, tone, wide, children }: { n?: number | string; label: string; sub?: string; tone?: 'alert' | 'ok'; wide?: boolean; children?: React.ReactNode }) => (
  <section className={'edif-tile' + (tone ? ` edif-tile--${tone}` : '') + (wide ? ' edif-tile--wide' : '')}>
    {n !== undefined && <div className={'edif-tile__n' + (Number(n) === 0 ? ' is-zero' : '')}>{n}</div>}
    <div className="edif-tile__l">{label}</div>
    {sub && <div className="edif-tile__s">{sub}</div>}
    {children}
  </section>
)

const nowMs = () => Date.now()
const addrHour = () => (new Date().getUTCHours() + 3) % 24 // Addis Ababa is UTC+3

export default async function Dashboard(props: any) {
  const { payload, user } = props
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
    role === 'admin' ? payload.find({ collection: 'users', ...sys, limit: 500 }).then((r: any) => ({ totalDocs: r.docs.filter((u: any) => !u.hasTotp).length })) : { totalDocs: 0 },
    ['admin', 'auditor'].includes(role) ? payload.count({ collection: 'audit-log', where: { and: [{ action: { equals: 'security' } }, { createdAt: { greater_than: day(-1).toISOString() } }] }, overrideAccess: true }) : { totalDocs: 0 },
    ['admin', 'publisher', 'auditor'].includes(role) ? payload.find({ collection: 'page-views', where: { day: { greater_than_equal: day(-6).toISOString().slice(0, 10) } }, ...sys, limit: 5000 }) : { docs: [] },
    ['admin', 'auditor'].includes(role) ? payload.find({ collection: 'audit-log', sort: '-createdAt', ...sys, limit: 8 }) : { docs: [] },
  ])
  const seo = ['admin', 'publisher', 'seo'].includes(role) ? await seoHealth(payload).catch(() => []) : []
  const byPath = new Map<string, number>(); let total = 0
  for (const v of (views as any).docs) { byPath.set(v.path, (byPath.get(v.path) || 0) + v.views); total += v.views }
  const top = [...byPath.entries()].sort((x, y) => y[1] - x[1]).slice(0, 5)

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

  return (
    <div className="edif-dash">
      <section className="edif-dash__hero">
        <div className="edif-dash__date">{today}</div>
        <h2>{hello}{user?.name ? `, ${user.name}` : ''}</h2>
        <p>{attention ? `${attention} ${attention === 1 ? 'thing needs' : 'things need'} your attention today.` : canEdit ? 'Nothing is waiting for you. A good day to improve a page.' : 'Nothing is waiting for you.'}</p>
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
      </section>

      <h3 className="edif-dash__h">Needs attention</h3>
      <div className="edif-dash__grid">
        <Tile n={inReview.length} label="Waiting for review" tone={inReview.length ? 'alert' : undefined} sub={inReview.length ? undefined : 'Nothing is waiting.'}>
          {!!inReview.length && <ul>{inReview.slice(0, 5).map((r) => <Li key={r.slug + r.id} r={r} />)}</ul>}
        </Tile>
        <Tile n={changes.length} label="Changes requested" tone={changes.length ? 'alert' : undefined} sub={changes.length ? undefined : 'Nothing sent back.'}>
          {!!changes.length && <ul>{changes.slice(0, 5).map((r) => <Li key={r.slug + r.id} r={r} />)}</ul>}
        </Tile>
        {staffOnly && <Tile n={(msgs as any).totalDocs} label="New contact messages" tone={(msgs as any).totalDocs ? 'alert' : undefined}><a href={adminUrl('/collections/messages')}>Open the inbox</a></Tile>}
        <Tile n={tenders.docs.length + vacs.docs.length} label="Closing within 14 days" tone={tenders.docs.length + vacs.docs.length ? 'alert' : undefined}>
          <ul>{tenders.docs.map((t: any) => <li key={t.id}><a href={adminUrl(`/collections/tenders/${t.id}`)}>{t.title}</a></li>)}{vacs.docs.map((t: any) => <li key={t.id}><a href={adminUrl(`/collections/vacancies/${t.id}`)}>{t.title}</a></li>)}</ul>
        </Tile>
        <Tile n={jobs.docs.length} label="Scheduled to publish or unpublish">
          <ul>{jobs.docs.slice(0, 4).map((j: any) => <li key={j.id}>{j.input?.type || 'publish'} · {j.waitUntil ? new Date(j.waitUntil).toLocaleString('en-GB') : 'soon'}</li>)}</ul>
        </Tile>
      </div>

      {hasHealth && <h3 className="edif-dash__h">Site health</h3>}
      {hasHealth && <div className="edif-dash__grid">
        {(!!(views as any).docs.length || ['admin', 'publisher', 'auditor'].includes(role)) && (
          <Tile n={total} label="Visits, last 7 days" tone="ok">{!!top.length && <ul>{top.map(([p, n]) => <li key={p}>{p} · {n}</li>)}</ul>}</Tile>
        )}
        {['admin', 'publisher', 'seo'].includes(role) && (
          <Tile n={seo.length} label="Search (SEO) checks" tone={seo.length ? 'alert' : 'ok'} sub={seo.length ? undefined : 'No problems found.'}>
            {!!seo.length && <ul>{seo.slice(0, 3).map((i, k) => <li key={k}><a href={i.link}>{i.text}</a></li>)}{seo.length > 3 && <li className="edif-more">and {seo.length - 3} more</li>}</ul>}
          </Tile>
        )}
        {role === 'admin' && <Tile n={(noTotp as any).totalDocs} label="Accounts without two-factor" tone={(noTotp as any).totalDocs ? 'alert' : 'ok'} sub="They must set it up at next sign-in." />}
        {['admin', 'auditor'].includes(role) && <Tile n={(failed as any).totalDocs} label="Security events, last 24 hours" sub="Failed sign-ins, lockouts, exports." tone={(failed as any).totalDocs ? 'alert' : 'ok'} />}
        {role === 'admin' && <Tile label="Last backup" sub={backup} tone={backup.startsWith('No backup') ? 'alert' : 'ok'} />}
      </div>}

      {!!(recent as any).docs.length && (
        <>
          <h3 className="edif-dash__h">Recent activity</h3>
          <section className="edif-tile" style={{ minHeight: 0 }}>
            <ul className="edif-feed">{(recent as any).docs.map((e: any) => <li key={e.id}><span>{e.actor} · {e.action} · {e.resource}{e.documentTitle ? ` · ${e.documentTitle}` : ''}<small>{new Date(e.createdAt).toLocaleString('en-GB')}</small></span></li>)}</ul>
            <a href={adminUrl('/collections/audit-log')} style={{ marginTop: 6 }}>Full activity log</a>
          </section>
        </>
      )}
    </div>
  )
}
