import fs from 'fs'
import path from 'path'
import type { TaskConfig } from 'payload'
import { adminUrl } from '@/lib/adminRoute'
import { BACKUP_DIR } from '@/lib/paths'
import { notifyInApp, usersWithRoles } from '@/lib/notify'

/**
 * Runs hourly. Everything here is idempotent: a dedupe key means each person is told once per thing.
 *  - tenders and vacancies closing within 3 days
 *  - scheduled publish/unpublish jobs that failed
 *  - backups older than 48 hours (only when a backup folder is in use)
 *  - tidy-up: read notifications older than 30 days, and visit counts older than PAGEVIEW_KEEP_DAYS (default 400)
 */
export const dailyChecks: TaskConfig<'dailyChecks'> = {
  slug: 'dailyChecks',
  schedule: [{ cron: '0 * * * *', queue: 'default' }],
  inputSchema: [],
  outputSchema: [],
  handler: async ({ req }) => {
    const payload = req.payload
    const staff = await usersWithRoles(payload, ['admin', 'publisher'])
    const admins = await usersWithRoles(payload, ['admin'])
    const now = new Date(), soon = new Date(Date.now() + 3 * 864e5)

    for (const [slug, noun] of [['tenders', 'Tender'], ['vacancies', 'Vacancy']] as const) {
      const r = await payload.find({ collection: slug, overrideAccess: true, depth: 0, limit: 50, pagination: false, where: { and: [{ _status: { equals: 'published' } }, { closingDate: { greater_than: now.toISOString() } }, { closingDate: { less_than: soon.toISOString() } }] } })
      for (const d of r.docs as unknown as { id: string | number; title?: string; closingDate?: string }[]) {
        const when = d.closingDate ? new Date(d.closingDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Africa/Addis_Ababa' }) : 'soon'
        await notifyInApp(payload, staff, { kind: 'deadline', title: `${noun} closes ${when}`, body: d.title, link: adminUrl(`/collections/${slug}/${d.id}`), dedupeKey: `closing:${slug}:${d.id}:${d.closingDate}` })
      }
    }

    const failed = await payload.find({ collection: 'payload-jobs', overrideAccess: true, depth: 0, limit: 20, pagination: false, where: { and: [{ taskSlug: { equals: 'schedulePublish' } }, { hasError: { equals: true } }] } }).catch(() => ({ docs: [] as { id: string | number }[] }))
    for (const j of failed.docs) await notifyInApp(payload, admins, { kind: 'system', title: 'A scheduled publish failed', body: 'An item did not go live or offline at its scheduled time. Open it and publish it by hand.', link: adminUrl('/'), dedupeKey: `jobfail:${j.id}` })

    try {
      const files = fs.readdirSync(BACKUP_DIR).filter((n) => n.startsWith('edif-')).sort()
      const newest = files.pop()
      if (newest) {
        const ageH = (Date.now() - fs.statSync(path.join(BACKUP_DIR, newest)).mtimeMs) / 3600_000
        if (ageH > 48) await notifyInApp(payload, admins, { kind: 'system', title: 'Backups are falling behind', body: `The latest backup is ${Math.round(ageH / 24)} days old.`, link: adminUrl('/'), dedupeKey: `backup:${newest}` })
      }
    } catch { /* no backup folder here: backups may be handled by the hosting platform */ }

    await payload.delete({ collection: 'notifications', overrideAccess: true, where: { and: [{ readAt: { less_than: new Date(Date.now() - 30 * 864e5).toISOString() } }] } }).catch(() => {})
    const keepDays = Math.max(30, Number(process.env.PAGEVIEW_KEEP_DAYS) || 400)
    await payload.delete({ collection: 'page-views', overrideAccess: true, where: { day: { less_than: new Date(Date.now() - keepDays * 864e5).toISOString().slice(0, 10) } } }).catch(() => {})
    return { output: {} }
  },
}
