import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const load = async () => { vi.resetModules(); return (await import('@/lib/env')).readEnv }
const long = 'x'.repeat(40)
beforeEach(() => { vi.stubEnv('PAYLOAD_SECRET', long); vi.stubEnv('DATABASE_URL', 'postgres://u@h/db'); vi.stubEnv('SITE_URL', 'https://edif.example'); vi.stubEnv('SMTP_HOST', 'smtp.example') })
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
  it('refuses a placeholder secret in production', async () => {
    vi.stubEnv('NODE_ENV', 'production'); vi.stubEnv('PAYLOAD_SECRET', 'changeme' + long)
    await expect((async () => (await load())())()).rejects.toThrow(/placeholder/)
  })
})
