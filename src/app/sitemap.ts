import type { MetadataRoute } from 'next'
import { SITE_URL, getSitemapData } from '@/lib/cms'

const FIXED = ['/', '/deposit-protection', '/deposit-protection/coverage', '/deposit-protection/calculator', '/deposit-protection/payout', '/members', '/members/institutions', '/about', '/about/governance', '/about/organization', '/about/strategy', '/news', '/publications', '/faq', '/contact', '/tenders', '/vacancies', '/events']

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { news, pages, built, tenders, vacancies, events } = await getSitemapData()
  const hidden = new Set(pages.filter((p) => p.seo?.noindex).map((p) => p.path))
  return [
    ...FIXED.filter((p) => !hidden.has(p)).map((p) => ({ url: SITE_URL + (p === '/' ? '' : p), changeFrequency: 'weekly' as const, priority: p === '/' ? 1 : 0.7 })),
    ...news.filter((n) => !n.seo?.noindex).map((n) => ({ url: `${SITE_URL}/news/${n.slug}`, lastModified: n.updatedAt, changeFrequency: 'monthly' as const, priority: 0.6 })),
    ...built.filter((n) => !n.seo?.noindex).map((n) => ({ url: SITE_URL + n.path, lastModified: n.updatedAt, changeFrequency: 'monthly' as const, priority: 0.6 })),
    ...tenders.filter((n) => !n.seo?.noindex && new Date(n.closingDate) > new Date()).map((n) => ({ url: `${SITE_URL}/tenders/${n.slug}`, lastModified: n.updatedAt, changeFrequency: 'weekly' as const, priority: 0.5 })),
    ...vacancies.filter((n) => !n.seo?.noindex && new Date(n.closingDate) > new Date()).map((n) => ({ url: `${SITE_URL}/vacancies/${n.slug}`, lastModified: n.updatedAt, changeFrequency: 'weekly' as const, priority: 0.5 })),
    ...events.filter((n) => !n.seo?.noindex).map((n) => ({ url: `${SITE_URL}/events/${n.slug}`, lastModified: n.updatedAt, changeFrequency: 'weekly' as const, priority: 0.5 })),
  ]
}
