/**
 * Works out the visitor's network address without trusting what the visitor sends.
 *
 * Anyone can send their own X-Forwarded-For header, so the LEFT side of that list is untrusted.
 * Our own proxy / CDN appends the real address on the RIGHT. TRUSTED_PROXY_HOPS says how many of
 * our proxies sit in front of the app (default 1); the address that many places from the right is the visitor.
 * If the CDN or proxy supplies a single trusted header (e.g. cf-connecting-ip, or x-real-ip from nginx), set CLIENT_IP_HEADER to its name instead.
 * TRUSTED_PROXY_HOPS must match the real number of proxies: if the app is reachable directly, a visitor can fill the header themselves.
 * With TRUSTED_PROXY_HOPS=0 no header is believed and every visitor shares one bucket ("direct").
 */
type Get = (name: string) => string | null | undefined

export function clientIpFrom(get: Get): string {
  const custom = process.env.CLIENT_IP_HEADER?.trim().toLowerCase()
  if (custom) {
    const v = get(custom)?.trim()
    if (v) return v
  }
  const hops = Math.max(0, Number(process.env.TRUSTED_PROXY_HOPS ?? '1') || 0)
  if (hops === 0) return 'direct'
  const xff = (get('x-forwarded-for') || '').split(',').map((s) => s.trim()).filter(Boolean)
  if (xff.length >= hops) return xff[xff.length - hops]
  // X-Real-IP is only believed when named in CLIENT_IP_HEADER: without a proxy that overwrites it, the visitor can set it.
  if (xff.length === 0) return 'unknown'
  return xff[0]
}
