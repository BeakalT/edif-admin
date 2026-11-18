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
