import { ADMIN_ROUTE } from '@/lib/adminRoute'
import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/cms'

export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: '*', allow: '/', disallow: [...(ADMIN_ROUTE === '/admin' ? ['/admin'] : []), '/healthz', '/readyz', '/internal', '/api/', '/preview/', '/search'] }], sitemap: `${SITE_URL}/sitemap.xml`, host: SITE_URL }
}
