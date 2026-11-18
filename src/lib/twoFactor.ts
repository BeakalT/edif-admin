import type { PayloadRequest, Plugin } from 'payload'
import { clientIp } from '../access'
type WithTotpConfig = { config?: { custom?: { totp?: { pluginOptions?: { disabled?: boolean } } } } } | null | undefined

/**
 * True only when this session has entered its authenticator code (or uses an API key).
 * Payload issues its normal session cookie at the password step, before the code is checked,
 * so any page that reads data with access overridden must check this, not just `user`.
 */
export const passedTwoFactor = (payload: WithTotpConfig, user: unknown): boolean => {
  if (!user) return false
  if (payload?.config?.custom?.totp?.pluginOptions?.disabled) return true
  const strategy = (user as { _strategy?: string })._strategy
  return strategy === 'totp' || strategy === 'api-key'
}

type PluginReq = { user?: { id: string | number; email: string; role?: string }; payload: { create: (args: Record<string, unknown>) => Promise<unknown> } }
type PluginEndpoint = { path: string; method: string; handler: (req: PluginReq) => Promise<Response> }
const WATCHED = ['/verify-totp', '/setup-totp', '/remove-totp']
const WHAT: Record<string, string> = { '/verify-totp': 'wrong or refused authenticator code', '/setup-totp': 'wrong or refused authenticator code while setting up', '/remove-totp': 'wrong or refused authenticator code while turning it off' }

/**
 * Records a wrong or refused authenticator code in the audit log (sign-in, first set-up and turning it off). The plugin answers
 * `{ ok: false }` for those and writes nothing itself, so a guessing attack on the second step would otherwise leave no trace.
 */
export const logFailedCodes: Plugin = (config) => ({
  ...config,
  endpoints: (config.endpoints || []).map((raw) => {
    const e = raw as unknown as PluginEndpoint
    if (!WATCHED.includes(e.path) || String(e.method).toLowerCase() !== 'post') return raw
    const wrapped: PluginEndpoint = {
      ...e,
      handler: async (req) => {
        const res = await e.handler(req)
        try {
          const body = (await res.clone().json().catch(() => null)) as { ok?: boolean } | null
          if (req.user && body && body.ok === false) {
            await req.payload.create({ collection: 'audit-log', overrideAccess: true, data: { action: 'security', resource: 'users', documentId: String(req.user.id), documentTitle: req.user.email, actor: req.user.email, actorRole: req.user.role || '', ip: clientIp(req as unknown as PayloadRequest), changes: { event: { to: WHAT[e.path] } } } })
          }
        } catch { /* logging must never change the sign-in result */ }
        return res
      },
    }
    return wrapped as unknown as typeof raw
  }),
})
