/** Turns a raw audit entry into one plain sentence, e.g. 'Sara Bekele (Editor) edited the news article "Annual report" – changed title, summary'. Pure, so it is unit tested. */
const AREA: Record<string, string> = {
  pages: 'page', news: 'news article', publications: 'publication', faqs: 'FAQ', members: 'member institution', 'key-figures': 'key figure', people: 'person profile',
  tenders: 'tender', vacancies: 'vacancy', events: 'event', notices: 'notice', messages: 'message', subscribers: 'subscriber', media: 'media file', 'seo-pages': 'SEO page',
  redirects: 'redirect', users: 'user account', 'audit-log': 'audit log', 'site-settings': 'site settings', navigation: 'navigation menu', 'brand-theme': 'brand and theme',
}
const ROLE: Record<string, string> = { admin: 'Super Admin', publisher: 'Publisher', editor: 'Editor', seo: 'SEO', auditor: 'Auditor' }
const FIELD = (k: string) => k.replace(/([A-Z])/g, ' $1').replace(/[_-]/g, ' ').toLowerCase()

type Entry = { action?: string; actor?: string | null; actorRole?: string | null; resource?: string | null; documentTitle?: string | null; changes?: Record<string, { from?: string; to?: string }> | null }

export function summarize(e: Entry): string {
  const who = e.actor ? `${e.actor}${e.actorRole ? ` (${ROLE[e.actorRole] || e.actorRole})` : ''}` : 'The system'
  const area = AREA[e.resource || ''] || e.resource || 'item'
  const what = e.documentTitle ? `${area} “${e.documentTitle}”` : area
  const keys = Object.keys(e.changes || {}).filter((k) => k !== 'event')
  const list = keys.length ? ` – changed ${keys.slice(0, 5).map(FIELD).join(', ')}${keys.length > 5 ? ` and ${keys.length - 5} more` : ''}` : ''
  const event = (e.changes as Record<string, { to?: string }> | null | undefined)?.event?.to
  switch (e.action) {
    case 'create': return `${who} created the ${what}`
    case 'update': return `${who} edited the ${what}${list}`
    case 'submit': return `${who} sent the ${what} for review`
    case 'publish': return `${who} published the ${what}`
    case 'unpublish': return `${who} took the ${what} offline`
    case 'delete': return `${who} deleted the ${what}`
    case 'login': return `${who} signed in`
    case 'logout': return `${who} signed out`
    case 'security': return event ? `${event.charAt(0).toUpperCase()}${event.slice(1)} – ${e.documentTitle || e.actor || 'account'}${e.actor && e.documentTitle && e.actor !== e.documentTitle ? ` (by ${e.actor})` : ''}` : `${who}: ${e.documentTitle || 'security event'}`
    default: return `${who}: ${e.action || 'change'} ${what}`
  }
}

export const TABS: { label: string; actions?: string[] }[] = [
  { label: 'All' },
  { label: 'Edits', actions: ['create', 'update'] },
  { label: 'Publishing', actions: ['submit', 'publish', 'unpublish'] },
  { label: 'Sign-ins', actions: ['login', 'logout'] },
  { label: 'Security', actions: ['security'] },
  { label: 'Deletions', actions: ['delete'] },
]
