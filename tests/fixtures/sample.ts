import type { ActivityItem, DayStat } from '../../src/components/admin/dashFormat'

const now = Date.now()
const iso = (ms: number) => new Date(ms).toISOString()

export const sampleDays = (): DayStat[] =>
  Array.from({ length: 60 }, (_, k) => {
    const d = new Date(now + (-59 + k) * 864e5)
    const paths: Record<string, number> = k % 9 === 4 ? {} : { '/': 4 + (k % 5), '/news': 1 + (k % 3), '/tenders': k % 2 }
    return { key: d.toISOString().slice(0, 10), label: d.toLocaleDateString('en-GB', { weekday: 'short', timeZone: 'UTC' }), date: d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' }), n: Object.values(paths).reduce((a, b) => a + b, 0), paths }
  })

export const sampleActivity = (): ActivityItem[] => [
  { id: 1, action: 'security', text: 'Wrong or refused authenticator code', at: iso(now - 600e3), count: 3 },
  { id: 2, action: 'update', text: 'Demo admin edited page "Home"', at: iso(now - 3 * 3600e3), count: 1 },
  { id: 3, action: 'login', text: 'Demo admin signed in', at: iso(now - 4 * 3600e3), count: 1 },
  { id: 4, action: 'publish', text: 'Demo admin published news "Annual report"', at: iso(now - 27 * 3600e3), count: 1 },
]
