import { adminUrl } from '@/lib/adminRoute'
import type { Payload } from 'payload'

export type Issue = { level: 'problem' | 'tip'; text: string; link: string }

/** Plain checks an SEO manager would do by hand. Looks at live and draft content. */
export async function seoHealth(payload: Payload): Promise<Issue[]> {
  const out: Issue[] = []
  const get = (collection: any) => payload.find({ collection, depth: 0, limit: 500, pagination: false, overrideAccess: true, draft: true }).then((r: any) => r.docs as any[])
  const [pages, news, tenders, vacancies, events, media, redirects] = await Promise.all([get('pages'), get('news'), get('tenders'), get('vacancies'), get('events'), payload.find({ collection: 'media', depth: 0, limit: 1000, pagination: false, overrideAccess: true }).then((r: any) => r.docs as any[]), get('redirects')])
  const check = (label: string, slug: string, docs: any[]) => {
    for (const d of docs) {
      const t = d.title, link = adminUrl(`/collections/${slug}/${d.id}`), seo = d.seo || {}
      if (seo.noindex) continue
      const desc = (seo.description || d.summary || '').trim()
      if (!desc) out.push({ level: 'problem', text: `${label} "${t}" has no description for search results.`, link })
      else if (desc.length < 70) out.push({ level: 'tip', text: `${label} "${t}": the description is short (${desc.length} characters; 120 to 160 is best).`, link })
      if ((seo.title || t || '').length > 60) out.push({ level: 'tip', text: `${label} "${t}": the search title is over 60 characters and may be cut off.`, link })
    }
  }
  check('Page', 'pages', pages); check('News', 'news', news); check('Tender', 'tenders', tenders); check('Vacancy', 'vacancies', vacancies); check('Event', 'events', events)
  for (const n of news) if (!n.image && n._status === 'published') out.push({ level: 'tip', text: `News "${n.title}" has no image, so shared links show no picture.`, link: adminUrl(`/collections/news/${n.id}`) })
  for (const m of media) if (/^image\//.test(m.mimeType || '') && !(m.alt || '').trim()) out.push({ level: 'problem', text: `Image "${m.filename}" has no description (alt text), which blind readers and Google need.`, link: adminUrl(`/collections/media/${m.id}`) })
  const from = new Set(redirects.map((r) => r.from))
  for (const r of redirects) if (from.has(r.to)) out.push({ level: 'problem', text: `Redirect ${r.from} leads to ${r.to}, which redirects again (a chain).`, link: adminUrl(`/collections/redirects/${r.id}`) })
  return out
}
