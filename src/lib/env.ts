/** Fails fast on a bad configuration instead of running insecurely. Imported by payload.config. */
const isProd = process.env.NODE_ENV === 'production'
const isBuild = process.env.NEXT_PHASE === 'phase-production-build'

/** True only when the host itself is loopback: `localhost`, `::1`, or four numbers in 127.0.0.0/8. `localhost.example.com` is not. */
export function isLoopbackHost(url: string): boolean {
  let host: string
  try { host = new URL(url).hostname.toLowerCase() } catch { return false }
  if (host === 'localhost' || host === '[::1]' || host === '::1') return true
  const m = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(host)
  return !!m && m.slice(1).every((n) => Number(n) <= 255) && Number(m[1]) === 127
}

export function readEnv() {
  const problems: string[] = []
  const secret = process.env.PAYLOAD_SECRET || ''
  const db = process.env.DATABASE_URL || ''
  const site = process.env.SITE_URL || (isProd ? '' : 'http://localhost:3100')

  if (!secret) problems.push('PAYLOAD_SECRET is empty')
  else if (isProd && secret.length < 32) problems.push('PAYLOAD_SECRET must be at least 32 characters in production')
  if (!db) problems.push('DATABASE_URL is empty')
  if (isProd && !isBuild) {
    if (!/^https:\/\//.test(site) && process.env.ALLOW_INSECURE_SITE_URL !== 'true') problems.push('SITE_URL must start with https:// in production')
    if (!process.env.SMTP_HOST && process.env.ALLOW_OUTBOX !== 'true') problems.push('SMTP_HOST is not set: password-reset and alert emails would never be delivered')
    if (/^(changeme|secret|password)/i.test(secret)) problems.push('PAYLOAD_SECRET looks like a placeholder')
  }
  // A real deployment: production, not the build step, and any host except a loopback one. A local run on localhost (./run.sh) is exempt.
  const realDeployment = isProd && !isBuild && !isLoopbackHost(site)
  if (realDeployment) {
    if (!process.env.CLIENT_IP_HEADER?.trim() && !(Number(process.env.TRUSTED_PROXY_HOPS) > 0)) problems.push('Set TRUSTED_PROXY_HOPS to the number of proxies in front of the app (or CLIENT_IP_HEADER). With 0, every visitor shares one rate-limit bucket and anyone can block staff sign-in')
    if (process.env.COOKIE_SECURE === 'false') problems.push('COOKIE_SECURE=false is not allowed in production: remove it so the session cookie is sent only over https')
  }
  if (problems.length && !(isBuild && process.env.SKIP_ENV_CHECK_AT_BUILD === 'true')) {
    throw new Error('Invalid configuration:\n - ' + problems.join('\n - '))
  }
  const dialect = /^postgres(ql)?:\/\//.test(db) ? ('postgres' as const) : ('sqlite' as const)
  return { secret, db, site, dialect }
}
