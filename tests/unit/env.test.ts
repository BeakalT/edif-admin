import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const load = async () => { vi.resetModules(); return (await import('@/lib/env')).readEnv }
const long = 'x'.repeat(40)
beforeEach(() => { vi.stubEnv('PAYLOAD_SECRET', long); vi.stubEnv('DATABASE_URL', 'postgres://u@h/db'); vi.stubEnv('SITE_URL', 'https://edif.example'); vi.stubEnv('SMTP_HOST', 'smtp.example'); vi.stubEnv('TRUSTED_PROXY_HOPS', '1'); vi.stubEnv('COOKIE_SECURE', '') })
afterEach(() => vi.unstubAllEnvs())

describe('readEnv', () => {
  it('accepts a good production configuration and picks Postgres', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    expect((await load())()).toMatchObject({ dialect: 'postgres', site: 'https://edif.example' })
  })
  it('picks SQLite for a file database', async () => {
    vi.stubEnv('DATABASE_URL', 'file:./edif.db')
    expect((await load())().dialect).toBe('sqlite')
  })
  it('refuses an empty secret in every mode', async () => {
    vi.stubEnv('PAYLOAD_SECRET', '')
    expect(() => void 0).not.toThrow()
    await expect((async () => (await load())())()).rejects.toThrow(/PAYLOAD_SECRET is empty/)
  })
  it('refuses a short secret, a non-https site, or missing SMTP in production', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('PAYLOAD_SECRET', 'short'); await expect((async () => (await load())())()).rejects.toThrow(/at least 32/)
    vi.stubEnv('PAYLOAD_SECRET', long); vi.stubEnv('SITE_URL', 'http://edif.example'); await expect((async () => (await load())())()).rejects.toThrow(/https/)
    vi.stubEnv('SITE_URL', 'https://edif.example'); vi.stubEnv('SMTP_HOST', ''); await expect((async () => (await load())())()).rejects.toThrow(/SMTP_HOST/)
  })
  it('refuses a real production deployment with no proxy count, and with insecure cookies', async () => {
    vi.stubEnv('NODE_ENV', 'production'); vi.stubEnv('TRUSTED_PROXY_HOPS', ''); vi.stubEnv('CLIENT_IP_HEADER', '')
    await expect((async () => (await load())())()).rejects.toThrow(/TRUSTED_PROXY_HOPS/)
    vi.stubEnv('TRUSTED_PROXY_HOPS', '0'); await expect((async () => (await load())())()).rejects.toThrow(/TRUSTED_PROXY_HOPS/)
    vi.stubEnv('TRUSTED_PROXY_HOPS', '1'); expect((await load())()).toMatchObject({ site: 'https://edif.example' })
    vi.stubEnv('TRUSTED_PROXY_HOPS', ''); vi.stubEnv('CLIENT_IP_HEADER', 'cf-connecting-ip'); expect((await load())().dialect).toBe('postgres')
    vi.stubEnv('COOKIE_SECURE', 'false'); await expect((async () => (await load())())()).rejects.toThrow(/COOKIE_SECURE/)
  })
  it('exempts only a loopback host, not a name or address that merely starts like one', async () => {
    vi.stubEnv('NODE_ENV', 'production'); vi.stubEnv('TRUSTED_PROXY_HOPS', ''); vi.stubEnv('ALLOW_INSECURE_SITE_URL', 'true')
    for (const site of ['https://localhost.example.com', 'https://127.not-a-number', 'https://127.0.0.1.example.org', 'http://203.0.113.5', 'http://edif.example']) {
      vi.stubEnv('SITE_URL', site)
      await expect((async () => (await load())())(), site).rejects.toThrow(/TRUSTED_PROXY_HOPS/)
    }
    for (const site of ['https://localhost:3100', 'http://localhost:3100', 'http://127.0.0.1:3100', 'http://127.1.2.3', 'http://[::1]:3100']) {
      vi.stubEnv('SITE_URL', site)
      expect((await load())().site, site).toBe(site)
    }
  })
  it('lets a local run on localhost start without a proxy count (./run.sh)', async () => {
    vi.stubEnv('NODE_ENV', 'production'); vi.stubEnv('SITE_URL', 'http://localhost:3100'); vi.stubEnv('ALLOW_INSECURE_SITE_URL', 'true'); vi.stubEnv('TRUSTED_PROXY_HOPS', ''); vi.stubEnv('COOKIE_SECURE', 'false')
    expect((await load())().site).toBe('http://localhost:3100')
  })
  it('refuses a placeholder secret in production', async () => {
    vi.stubEnv('NODE_ENV', 'production'); vi.stubEnv('PAYLOAD_SECRET', 'changeme' + long)
    await expect((async () => (await load())())()).rejects.toThrow(/placeholder/)
  })
})
