import { unstable_cache } from 'next/cache'

/** Tag on every cached piece of published content. Any change in the admin clears it (hooks/revalidate.ts). */
export const CONTENT_TAG = 'site-content'

/**
 * Pages render on every visit (they need a fresh CSP nonce each time), so the published content they read
 * is cached across visits instead: the database is asked again only after something is published, or after
 * an hour as a safety net. Arguments become part of the cache key.
 */
export const cached = <A extends unknown[], R>(key: string, fn: (...args: A) => Promise<R>) =>
  unstable_cache(fn, ['edif', key], { tags: [CONTENT_TAG], revalidate: 3600 })
