import { getPayload } from 'payload'
import config from '@payload-config'
import { cache } from 'react'
import type { Media } from '../payload-types'
import type { Contact, Doc, Faq } from '../site/data/content'
import type { Article } from '../site/data/news'
import type { Member } from '../site/data/members'
import type { Cms, NavItem } from '../site/cms-context'
import { safeHref, webAddress } from './safeUrl'

/** Used only until an admin fills in Site settings. */
const FALLBACK_CONTACT = { email: 'ediinfo@edif.gov.et', phones: ['+251 115 57 60 15', '+251 115 57 15 97', '+251 115 57 85 34'], poBox: '4735', address: ['Zemen Bank building, 22nd floor', 'Sengatera, Addis Ababa, Ethiopia'] }

export const SITE_URL = (process.env.SITE_URL || 'http://localhost:3100').replace(/\/$/, '')
const sys = { overrideAccess: true as const, depth: 1, draft: false, pagination: false as const }
const live = { _status: { equals: 'published' } }

const url = (m: unknown) => (m && typeof m === 'object' ? (m as Media).url || undefined : undefined)
const day = (d: string) => String(d).slice(0, 10)
const monthLabel = (d: string) => new Date(d).toLocaleDateString('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' })

/** Lexical rich text to the simple block list the article page renders. */
type Node = { type: string; tag?: string; listType?: string; children?: Node[]; text?: string }
const plain = (n?: Node): string => (n?.type === 'text' ? n.text || '' : n?.type === 'linebreak' ? ' ' : (n?.children || []).map(plain).join(''))
export function toBlocks(state: any): Article['body'] {
  const out: Article['body'] = []
  for (const n of (state?.root?.children || []) as Node[]) {
    if (n.type === 'heading') out.push({ h: plain(n) })
    else if (n.type === 'list') out.push({ list: (n.children || []).map(plain).filter(Boolean) })
    else if (n.type === 'quote') { const [quote, by] = plain(n).split(' — '); out.push({ quote, by: by || '' }) }
    else if (plain(n).trim()) out.push(plain(n))
  }
  return out
}

export const getCms = cache(async (): Promise<Cms> => {
  const payload = await getPayload({ config })
  const [news, pubs, faqs, members, settings, nav, theme, notices, figs] = await Promise.all([
    payload.find({ collection: 'news', where: live, sort: '-date', ...sys }),
    payload.find({ collection: 'publications', where: live, sort: '-date', ...sys }),
    payload.find({ collection: 'faqs', where: live, sort: 'sort', ...sys }),
    payload.find({ collection: 'members', where: live, sort: 'name', ...sys }),
    payload.findGlobal({ slug: 'site-settings', ...sys }),
    payload.findGlobal({ slug: 'navigation', ...sys }),
    payload.findGlobal({ slug: 'brand-theme', ...sys }),
    payload.find({ collection: 'notices', where: live, sort: '-updatedAt', limit: 1, ...sys }),
    payload.find({ collection: 'key-figures', where: live, ...sys }),
  ])
  const item = (n: any): NavItem => ({ label: n.label, url: safeHref(n.url) || '#', description: n.description || undefined, children: n.children?.length ? n.children.map(item) : undefined })
  const figures = Object.fromEntries(figs.docs.map((f) => [f.key, { label: f.label, value: f.value, numeric: f.numeric ?? undefined, note: f.note || undefined, source: f.source, asOf: day(f.asOf) }]))
  const nt: any = notices.docs[0]
  const articles: Article[] = news.docs.map((a) => ({
    slug: a.slug, date: day(a.date), kind: a.kind as Article['kind'], title: a.title, short: a.short || a.title, summary: a.summary,
    image: url(a.image), imageAlt: a.image && typeof a.image === 'object' ? (a.image.alt || a.title) : undefined,
    gallery: a.gallery?.map((g) => ({ src: url(g.image) || '', alt: g.alt })),
    body: toBlocks(a.body), rich: a.body, pdf: url(a.pdf) || safeHref(a.externalPdf), source: safeHref(a.sourceUrl) || '',
  }))
  const docs: Doc[] = pubs.docs.map((d) => ({
    kind: d.kind as Doc['kind'], title: d.title, desc: d.description || '', date: monthLabel(d.date), sortKey: day(d.date),
    url: url(d.file) || safeHref(d.externalUrl) || '#', featured: !!d.featured, stats: d.stats?.length ? d.stats.map((s) => ({ v: s.value, l: s.label })) : undefined,
  }))
  const faqList: Faq[] = faqs.docs.map((f) => ({ q: f.question, a: f.answer, cat: f.category as Faq['cat'], home: !!f.showOnHome }))
  const member = (t: string): Member[] => members.docs.filter((m) => m.type === t).map((m) => ({ name: m.name, phone: m.phone || '', email: m.email || '', website: webAddress(m.website) || '', location: m.location || '' }))
  // A brand-new environment has no Site settings yet; fall back to the published contact details so the footer never breaks.
  const phones = (settings.phones || []).map((p) => p.number).filter(Boolean), address = (settings.address || []).map((l) => l.line).filter(Boolean)
  const contact: Contact = {
    email: settings.email || FALLBACK_CONTACT.email,
    phones: phones.length ? phones : FALLBACK_CONTACT.phones,
    poBox: settings.poBox || FALLBACK_CONTACT.poBox,
    address: address.length ? address : FALLBACK_CONTACT.address,
  }
  return {
    nav: nav.main?.length ? nav.main.map(item) : undefined,
    footerNav: nav.footer?.length ? nav.footer.map((c: any) => ({ heading: c.heading, links: (c.links || []).map(item) })) : undefined,
    headerCta: nav.cta?.label && safeHref(nav.cta?.url) ? { label: nav.cta.label, url: safeHref(nav.cta.url)! } : undefined,
    logo: { color: url(theme.logo), white: url(theme.logoWhite), wordmark: theme.wordmark || 'EDIF', textOnly: !!theme.useTextLogo } as any,
    notice: nt ? { message: nt.message, severity: nt.severity, linkLabel: nt.linkLabel || undefined, linkUrl: safeHref(nt.linkUrl), expiresAt: nt.expiresAt || undefined } : null,
    figures,
    articles, docs, faqs: faqList, banks: member('bank'), microfinance: member('microfinance'), contact }
})

export const getSeo = cache(async (path: string) => {
  const payload = await getPayload({ config })
  const [page, settings] = await Promise.all([
    payload.find({ collection: 'seo-pages', where: { path: { equals: path } }, limit: 1, ...sys }),
    payload.findGlobal({ slug: 'site-settings', ...sys }),
  ])
  return { page: page.docs[0], defaults: settings.defaultSeo }
})

export const getRedirect = async (path: string) => {
  const payload = await getPayload({ config })
  const r = await payload.find({ collection: 'redirects', where: { from: { equals: path } }, limit: 1, ...sys })
  return r.docs[0]
}

export const getNewsDoc = async (slug: string) => {
  const payload = await getPayload({ config })
  const r = await payload.find({ collection: 'news', where: { and: [live, { slug: { equals: slug } }] }, limit: 1, ...sys })
  return r.docs[0]
}

export const getSitemapData = async () => {
  const payload = await getPayload({ config })
  const q = (collection: any) => payload.find({ collection, where: live, ...sys, depth: 0 })
  const [news, pages, built, tenders, vacancies, events] = await Promise.all([
    q('news'), payload.find({ collection: 'seo-pages', ...sys, depth: 0 }), q('pages'), q('tenders'), q('vacancies'), q('events'),
  ])
  return { news: news.docs, pages: pages.docs, built: built.docs as any[], tenders: tenders.docs as any[], vacancies: vacancies.docs as any[], events: events.docs as any[] }
}
