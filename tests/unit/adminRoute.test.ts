import { afterEach, describe, expect, it, vi } from 'vitest'
const load = async () => { vi.resetModules(); return import('@/lib/adminRoute') }
afterEach(() => vi.unstubAllEnvs())

describe('admin route', () => {
  it('defaults to /admin', async () => { expect((await load()).ADMIN_ROUTE).toBe('/admin') })
  it('follows ADMIN_PATH and normalises slashes', async () => {
    vi.stubEnv('ADMIN_PATH', 'console-x7k2/')
    const m = await load()
    expect(m.ADMIN_ROUTE).toBe('/console-x7k2')
    expect(m.adminUrl('/collections/news/3')).toBe('/console-x7k2/collections/news/3')
    expect(m.adminUrl('reset/abc')).toBe('/console-x7k2/reset/abc')
    expect(m.adminUrl()).toBe('/console-x7k2')
  })
})
