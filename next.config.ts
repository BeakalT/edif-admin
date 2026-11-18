import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'
import { ADMIN_ROUTE } from './src/lib/adminRoute'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const isProd = process.env.NODE_ENV === 'production'
const csp = ["default-src 'self'", "img-src 'self' data: blob:", "style-src 'self' 'unsafe-inline'", "script-src 'self' 'unsafe-inline'", "font-src 'self' data:", "frame-src https://www.youtube-nocookie.com https://player.vimeo.com", "connect-src 'self'", "frame-ancestors 'self'", "base-uri 'self'", "form-action 'self'", "object-src 'none'"].join('; ')

const nextConfig: NextConfig = {
  output: 'standalone', // smallest runnable bundle for the container image
  poweredByHeader: false,
  async headers() {
    return [
      // keep the admin out of search results without naming a secret address in robots.txt
      { source: `${ADMIN_ROUTE}/:path*`, headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' }] },
      { source: '/internal/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex' }] },
      {
      source: '/:path*',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
        ...(isProd ? [{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' }, { key: 'Content-Security-Policy', value: csp }] : []),
      ],
      },
    ]
  },
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
