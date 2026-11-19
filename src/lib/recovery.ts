import crypto from 'crypto'

/**
 * One-time recovery codes for two-factor sign-in.
 *
 * A person who has lost the phone with their authenticator app uses one code, together with their password, to remove the
 * old authenticator and set up a new one. Codes are random (50 bits each), shown to the person once, and stored only as
 * salted scrypt hashes, so a copy of the database does not reveal a usable code. Each code works once.
 */

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // 32 symbols, no 0/O/1/I, so every symbol carries 5 bits
export const CODE_COUNT = 10
const CODE_LEN = 10 // 10 symbols x 5 bits = 50 bits

export type CodeEntry = { s: string; h: string; u?: string }
export type RecoveryState = { codes: CodeEntry[]; at?: string; f?: number; fa?: string }

/** Upper-case, strip spaces and hyphens, so "abcde-fghjk" and "ABCDE FGHJK" are the same code. */
export const normalizeCode = (input: unknown): string => (typeof input === 'string' ? input : '').toUpperCase().replace(/[^A-Z0-9]/g, '')

const hashCode = (code: string, salt: string): string => crypto.scryptSync(code, salt, 32).toString('hex')

export const formatCode = (code: string): string => `${code.slice(0, CODE_LEN / 2)}-${code.slice(CODE_LEN / 2)}`

const randomCode = (): string => {
  let s = ''
  for (let i = 0; i < CODE_LEN; i++) s += ALPHABET[crypto.randomInt(ALPHABET.length)]
  return s
}

/** Makes a fresh set. `plain` goes to the person once; `entries` is what gets stored. */
export function newCodes(count = CODE_COUNT): { plain: string[]; entries: CodeEntry[] } {
  const plain: string[] = []
  const entries: CodeEntry[] = []
  while (plain.length < count) {
    const code = randomCode()
    if (plain.includes(formatCode(code))) continue
    const s = crypto.randomBytes(16).toString('hex')
    plain.push(formatCode(code))
    entries.push({ s, h: hashCode(code, s) })
  }
  return { plain, entries }
}

export const unused = (entries: CodeEntry[] | undefined): number => (entries || []).filter((e) => !e.u).length

/** Reads whatever is stored in the user's `recovery` column and returns a safe shape. */
export function readState(raw: unknown): RecoveryState {
  let v: unknown = raw
  if (typeof v === 'string') {
    try { v = JSON.parse(v) } catch { v = null }
  }
  const o = (v && typeof v === 'object' ? v : {}) as { codes?: unknown; at?: unknown; f?: unknown; fa?: unknown }
  const codes = Array.isArray(o.codes)
    ? (o.codes as CodeEntry[]).filter((e) => e && typeof e.s === 'string' && typeof e.h === 'string').map((e) => ({ s: e.s, h: e.h, ...(typeof e.u === 'string' ? { u: e.u } : {}) }))
    : []
  return { codes, ...(typeof o.at === 'string' ? { at: o.at } : {}), ...(typeof o.f === 'number' && typeof o.fa === 'string' ? { f: o.f, fa: o.fa } : {}) }
}

/** Wrong-code counter, kept apart from the password counter (a correct password resets that one). */
export const MAX_WRONG = 5
export const WRONG_WINDOW_MS = 15 * 60 * 1000
export const isBlocked = (st: RecoveryState, now = Date.now()): boolean => (st.f ?? 0) >= MAX_WRONG && !!st.fa && now - Date.parse(st.fa) < WRONG_WINDOW_MS
export function countWrong(st: RecoveryState, now = Date.now()): RecoveryState {
  const fresh = !st.fa || now - Date.parse(st.fa) >= WRONG_WINDOW_MS
  return { ...st, f: (fresh ? 0 : st.f ?? 0) + 1, fa: new Date(fresh ? now : Date.parse(st.fa as string)).toISOString() }
}
export const clearWrong = (st: RecoveryState): RecoveryState => { const { f: _f, fa: _fa, ...rest } = st; return rest }

/**
 * Checks `input` against the unused codes. On a match the code is marked used and the new list is returned.
 * Every unused code is compared (no early exit) so the time taken does not say which one matched.
 */
export function consumeCode(entries: CodeEntry[], input: unknown, now = new Date()): { ok: boolean; entries: CodeEntry[]; remaining: number } {
  const code = normalizeCode(input)
  if (code.length !== CODE_LEN || [...code].some((c) => !ALPHABET.includes(c))) return { ok: false, entries, remaining: unused(entries) }
  let hit = -1
  entries.forEach((e, i) => {
    if (e.u) return
    const a = Buffer.from(hashCode(code, e.s), 'hex')
    const b = Buffer.from(e.h, 'hex')
    if (a.length === b.length && crypto.timingSafeEqual(a, b) && hit < 0) hit = i
  })
  if (hit < 0) return { ok: false, entries, remaining: unused(entries) }
  const next = entries.map((e, i) => (i === hit ? { ...e, u: now.toISOString() } : e))
  return { ok: true, entries: next, remaining: unused(next) }
}
