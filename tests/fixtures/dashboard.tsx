import { renderToStaticMarkup } from 'react-dom/server'
import Dashboard from '../../src/components/admin/Dashboard'

export const ROLES = ['admin', 'publisher', 'editor', 'seo', 'auditor'] as const
const now = Date.now()
const iso = (ms: number) => new Date(ms).toISOString()
const dayKey = (n: number) => new Date(now + n * 864e5).toISOString().slice(0, 10)

const views = Array.from({ length: 30 }, (_, k) => ['/', '/tenders', '/news'].map((path, j) => ({ day: dayKey(-29 + k), path, views: 3 + ((k * 7 + j * 5) % 9) }))).flat()
const rows: Record<string, unknown[]> = {
  tenders: [],
  vacancies: [{ id: 1, title: 'Senior Risk Analyst', closingDate: iso(now + 9 * 864e5) }],
  'page-views': views,
  users: Array.from({ length: 11 }, (_, i) => ({ hasTotp: i < 4 })),
  'audit-log': [
    { id: 1, action: 'security', summary: 'admin@edif-demo.test (Super Admin) entered the correct password (authenticator code still required)', createdAt: iso(now - 600e3) },
    { id: 2, action: 'security', summary: 'admin@edif-demo.test (Super Admin) entered the correct password (authenticator code still required)', createdAt: iso(now - 700e3) },
    { id: 3, action: 'update', summary: 'Demo admin edited page "Home"', createdAt: iso(now - 3 * 3600e3) },
    { id: 4, action: 'login', summary: 'Demo admin signed in', createdAt: iso(now - 4 * 3600e3) },
    { id: 5, action: 'publish', summary: 'Demo admin published news "Annual report"', createdAt: iso(now - 27 * 3600e3) },
  ],
}
const docsFor = (collection: string) =>
  rows[collection] ?? (['pages', 'news', 'publications'].includes(collection)
    ? [{ id: 1, title: collection === 'pages' ? 'Home' : `Annual report (${collection})`, updatedAt: iso(now - 5 * 3600e3), _status: collection === 'news' ? 'draft' : 'published' }, { id: 2, title: 'About EDIF', updatedAt: iso(now - 30 * 3600e3), _status: 'published' }]
    : [])

export const fakePayload = (): any => ({
  find: async ({ collection }: { collection: string }) => ({ docs: docsFor(collection) }),
  count: async ({ collection, where }: { collection: string; where?: unknown }) => {
    const w = JSON.stringify(where ?? {})
    if (collection === 'messages') return { totalDocs: 3 }
    return { totalDocs: w.includes('draft') ? 2 : w.includes('published') ? 9 : 3 }
  },
})

/** The real dashboard, rendered with sample data for one role. Returns null when two-factor is not complete. */
export async function renderDashboard(role: string, twoFactor = true): Promise<string | null> {
  const el = await (Dashboard as any)({ payload: fakePayload(), user: { role, name: 'Demo admin', _strategy: twoFactor ? 'totp' : 'local' } })
  return el ? renderToStaticMarkup(el) : null
}

export { sampleDays, sampleActivity } from './sample'
