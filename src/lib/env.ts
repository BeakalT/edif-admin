/** Fails fast on a bad configuration instead of running insecurely. Imported by payload.config. */
const isProd = process.env.NODE_ENV === 'production'
const isBuild = process.env.NEXT_PHASE === 'phase-production-build'

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
  if (problems.length && !(isBuild && process.env.SKIP_ENV_CHECK_AT_BUILD === 'true')) {
    throw new Error('Invalid configuration:\n - ' + problems.join('\n - '))
  }
  const dialect = /^postgres(ql)?:\/\//.test(db) ? ('postgres' as const) : ('sqlite' as const)
  return { secret, db, site, dialect }
}
