import type { Metadata } from 'next'
import { SITE_URL, getSeo } from './cms'

const NAME = 'Ethiopian Deposit Insurance Fund'
const abs = (u?: string) => (u ? (u.startsWith('http') ? u : SITE_URL + u) : undefined)

type Seo = { title?: string | null; description?: string | null; image?: any; noindex?: boolean | null }

export function toMetadata(path: string, seo: Seo, fallback: { title: string; description?: string; image?: string }, extra: Metadata = {}): Metadata {
  const title = seo.title || fallback.title
  const description = seo.description || fallback.description
  const image = abs((seo.image && typeof seo.image === 'object' ? seo.image.sizes?.share?.url || seo.image.url : undefined) || fallback.image)
  return {
    title, description,
    alternates: { canonical: abs(path) },
    robots: seo.noindex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: { title, description, url: abs(path), siteName: NAME, type: 'website', locale: 'en_ET', images: image ? [{ url: image }] : undefined },
    twitter: { card: image ? 'summary_large_image' : 'summary', title, description, images: image ? [image] : undefined },
    ...extra,
  }
}

/** Search and share settings for a fixed page, edited in the admin under Search (SEO). */
export async function pageMetadata(path: string): Promise<Metadata> {
  const { page, defaults } = await getSeo(path)
  return toMetadata(path, page?.seo || {}, { title: defaults?.title || NAME, description: defaults?.description || undefined, image: abs((defaults?.image as any)?.url) })
}
