import { afterEach, describe, expect, it, vi } from 'vitest'
import { clientIpFrom } from '@/lib/clientIp'

const h = (o: Record<string, string>) => (n: string) => o[n] ?? null
afterEach(() => vi.unstubAllEnvs())

describe('clientIpFrom', () => {
  it('uses the address our own proxy appended (right-most), not what the visitor claims', () => {
    vi.stubEnv('TRUSTED_PROXY_HOPS', '1')
    expect(clientIpFrom(h({ 'x-forwarded-for': '6.6.6.6, 1.2.3.4' }))).toBe('1.2.3.4')
  })
  it('a visitor cannot dodge a rate limit by sending a fake first entry', () => {
    vi.stubEnv('TRUSTED_PROXY_HOPS', '1')
    const a = clientIpFrom(h({ 'x-forwarded-for': '7.7.7.7, 1.2.3.4' }))
    const b = clientIpFrom(h({ 'x-forwarded-for': '8.8.8.8, 1.2.3.4' }))
    expect(a).toBe(b)
  })
  it('counts several trusted proxies from the right', () => {
    vi.stubEnv('TRUSTED_PROXY_HOPS', '2')
    expect(clientIpFrom(h({ 'x-forwarded-for': 'fake, 1.2.3.4, 10.0.0.9' }))).toBe('1.2.3.4')
  })
  it('prefers a single trusted CDN header when configured', () => {
    vi.stubEnv('CLIENT_IP_HEADER', 'CF-Connecting-IP')
    expect(clientIpFrom(h({ 'cf-connecting-ip': '9.9.9.9', 'x-forwarded-for': '1.1.1.1' }))).toBe('9.9.9.9')
  })
  it('trusts no forwarding header until TRUSTED_PROXY_HOPS is set (safe default)', () => {
    vi.stubEnv('TRUSTED_PROXY_HOPS', '')
    expect(clientIpFrom(h({ 'x-forwarded-for': '6.6.6.6' }))).toBe('direct')
  })
  it('trusts no header at all when there is no proxy (hops = 0)', () => {
    vi.stubEnv('TRUSTED_PROXY_HOPS', '0')
    expect(clientIpFrom(h({ 'x-forwarded-for': '1.2.3.4' }))).toBe('direct')
  })
  it('ignores x-real-ip unless it is the configured header (a visitor can send it)', () => {
    vi.stubEnv('TRUSTED_PROXY_HOPS', '1')
    expect(clientIpFrom(h({ 'x-real-ip': '5.5.5.5' }))).toBe('unknown')
    expect(clientIpFrom(h({}))).toBe('unknown')
    vi.stubEnv('CLIENT_IP_HEADER', 'x-real-ip')
    expect(clientIpFrom(h({ 'x-real-ip': '5.5.5.5' }))).toBe('5.5.5.5')
  })
})
