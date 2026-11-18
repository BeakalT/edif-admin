import { getPayload } from 'payload'
import config from '@payload-config'
import { SITE_URL } from './cms'
import { cached } from './siteCache'

const sys = { overrideAccess: true as const, depth: 1, draft: false, pagination: false as const }
const live = { _status: { equals: 'published' } }
const P = () => getPayload({ config })
export const SITE = SITE_URL

// Lookups keyed by an address the visitor typed only reach the cache when that address exists, so requests
// for random URLs cannot fill the cache. The lists of existing addresses are small and cached as one entry each.
const loadPagePaths = cached('page-paths', async () => (await (await P()).find({ collection: 'pages', where: live, ...sys, depth: 0 })).docs.map((d) => d.path as string))
const loadPage = cached('page', async (path: string) => (await (await P()).find({ collection: 'pages', where: { and: [live, { path: { equals: path } }] }, limit: 1, ...sys, pagination: undefined as any })).docs[0])
export const getPage = async (path: string) => ((await loadPagePaths()).includes(path) ? loadPage(path) : undefined)
export const getPeople = cached('people', async () => (await (await P()).find({ collection: 'people', where: live, sort: 'sort', ...sys })).docs)
export const getList = cached('list', async (collection: 'tenders' | 'vacancies' | 'events', sort: string) => (await (await P()).find({ collection, where: live, sort, ...sys })).docs as any[])
const loadSlugs = cached('slugs', async (collection: 'tenders' | 'vacancies' | 'events') => (await (await P()).find({ collection, where: live, ...sys, depth: 0 })).docs.map((d) => (d as { slug: string }).slug))
const loadOne = cached('one', async (collection: 'tenders' | 'vacancies' | 'events', slug: string) => (await (await P()).find({ collection, where: { and: [live, { slug: { equals: slug } }] }, limit: 1, ...sys, pagination: undefined as any })).docs[0] as any)
export const getOne = async (collection: 'tenders' | 'vacancies' | 'events', slug: string) => ((await loadSlugs(collection)).includes(slug) ? loadOne(collection, slug) : undefined)

export const fmt = (d?: string | null, time = false) => d ? new Date(d).toLocaleString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', ...(time ? { hour: '2-digit', minute: '2-digit' } : {}), timeZone: 'Africa/Addis_Ababa' }) : ''
export const isClosed = (d?: string | null) => !!d && new Date(d).getTime() < Date.now()

/** Plain-text search across everything public. Parameters are bound by the database layer, never concatenated. */
export async function search(q: string) {
  const term = q.trim().slice(0, 80)
  if (term.length < 2) return []
  const payload = await P()
  const like = (f: string) => ({ [f]: { like: term } })
  const run = (collection: any, fields: string[], map: (d: any) => { title: string; url: string; kind: string; text?: string }) =>
    payload.find({ collection, where: { and: [live, { or: fields.map(like) }] }, limit: 8, depth: 0, overrideAccess: true, pagination: false as const }).then((r: any) => r.docs.map(map)).catch(() => [])
  const parts = await Promise.all([
    run('pages', ['title'], (d) => ({ title: d.title, url: d.path, kind: 'Page' })),
    run('news', ['title', 'summary'], (d) => ({ title: d.title, url: `/news/${d.slug}`, kind: 'News', text: d.summary })),
    run('publications', ['title', 'description'], (d) => ({ title: d.title, url: '/publications', kind: 'Publication', text: d.description })),
    run('faqs', ['question', 'answer'], (d) => ({ title: d.question, url: '/faq', kind: 'Question', text: d.answer })),
    run('tenders', ['title', 'summary'], (d) => ({ title: d.title, url: `/tenders/${d.slug}`, kind: 'Tender', text: d.summary })),
    run('vacancies', ['title', 'summary'], (d) => ({ title: d.title, url: `/vacancies/${d.slug}`, kind: 'Vacancy', text: d.summary })),
    run('events', ['title', 'summary'], (d) => ({ title: d.title, url: `/events/${d.slug}`, kind: 'Event', text: d.summary })),
    run('members', ['name'], (d) => ({ title: d.name, url: '/members', kind: 'Member institution' })),
  ])
  return parts.flat()
}
