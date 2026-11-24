/** Turns a raw audit entry into one plain sentence, e.g. 'Sara Bekele (Editor) edited the news article "Annual report" – changed title, summary'. Pure, so it is unit tested. */
const AREA: Record<string, string> = {
  pages: 'page', news: 'news article', publications: 'publication', faqs: 'FAQ', members: 'member institution', 'key-figures': 'key figure', people: 'person profile',
  tenders: 'tender', vacancies: 'vacancy', events: 'event', notices: 'notice', messages: 'message', subscribers: 'subscriber', media: 'media file', 'seo-pages': 'SEO page',
  redirects: 'redirect', users: 'user account', 'audit-log': 'audit log', 'site-settings': 'site settings', navigation: 'navigation menu', 'brand-theme': 'brand and theme',
}
const ROLE: Record<string, string> = { admin: 'Super Admin', publisher: 'Publisher', editor: 'Editor', seo: 'SEO', auditor: 'Auditor' }
const FIELD = (k: string) => k.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/[_-]/g, ' ').toLowerCase()
/** Bookkeeping fields nobody chose to edit; left out of the 'changed …' list. */
const NOISE = new Set(['deletedAt', 'updatedAt', 'createdAt', 'sizes', 'filesize', 'url', 'thumbnailURL', 'mimeType', 'filename', 'width', 'height', 'focalX', 'focalY', 'event', '_status'])

type Entry = { action?: string; actor?: string | null; actorRole?: string | null; resource?: string | null; documentTitle?: string | null; changes?: Record<string, { from?: string; to?: string }> | null }

export function summarize(e: Entry): string {
  const who = e.actor ? `${e.actor}${e.actorRole ? ` (${ROLE[e.actorRole] || e.actorRole})` : ''}` : 'The system'
  const area = AREA[e.resource || ''] || e.resource || 'item'
  const what = e.documentTitle ? `${area} “${e.documentTitle}”` : area
  const keys = Object.keys(e.changes || {}).filter((k) => !NOISE.has(k))
  const list = keys.length ? ` – changed ${keys.slice(0, 5).map(FIELD).join(', ')}${keys.length > 5 ? ` and ${keys.length - 5} more` : ''}` : ''
  const event = (e.changes as Record<string, { to?: string }> | null | undefined)?.event?.to
  switch (e.action) {
    case 'create': return `${who} created the ${what}`
    case 'update': return `${who} edited the ${what}${list}`
    case 'submit': return `${who} sent the ${what} for review`
    case 'publish': return `${who} published the ${what}`
    case 'unpublish': return `${who} took the ${what} offline`
    case 'delete': return `${who} deleted the ${what}`
    case 'login': return event ? `${who} entered the correct password (authenticator code still required)` : `${who} signed in`
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

/** The same entry split into parts, so the dashboard can set the person and the object in bold instead of one long sentence. */
export function describe(e: Entry): { who: string; verb: string; what: string; detail: string } {
  const who = e.actor ? e.actor.charAt(0).toUpperCase() + e.actor.slice(1) : 'System'
  const area = AREA[e.resource || ''] || e.resource || 'item'
  const what = e.documentTitle ? `${area} “${e.documentTitle}”` : area
  const keys = Object.keys(e.changes || {}).filter((k) => !NOISE.has(k))
  const verbs: Record<string, string> = { create: 'created', update: 'edited', submit: 'sent for review:', publish: 'published', unpublish: 'took offline:', delete: 'deleted', login: 'signed in', logout: 'signed out' }
  const detail = e.action === 'update' && keys.length ? `Changed ${keys.slice(0, 4).map(FIELD).join(', ')}${keys.length > 4 ? ` and ${keys.length - 4} more` : ''}` : ''
  return { who, verb: verbs[e.action || ''] || e.action || 'changed', what, detail }
}
