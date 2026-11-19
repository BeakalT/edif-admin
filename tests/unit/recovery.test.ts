import { describe, expect, it } from 'vitest'
import { CODE_COUNT, consumeCode, formatCode, newCodes, normalizeCode, readState, unused } from '../../src/lib/recovery'

describe('recovery codes', () => {
  it('makes ten distinct codes shaped like ABCDE-FGHJK', () => {
    const { plain, entries } = newCodes()
    expect(plain).toHaveLength(CODE_COUNT)
    expect(new Set(plain).size).toBe(CODE_COUNT)
    expect(entries).toHaveLength(CODE_COUNT)
    for (const c of plain) expect(c).toMatch(/^[A-HJ-NP-Z2-9]{5}-[A-HJ-NP-Z2-9]{5}$/)
  })

  it('stores only salted hashes, never the code', () => {
    const { plain, entries } = newCodes()
    const stored = JSON.stringify(entries)
    for (const c of plain) expect(stored).not.toContain(normalizeCode(c))
    expect(new Set(entries.map((e) => e.s)).size).toBe(CODE_COUNT)
  })

  it('accepts a code once, in any letter case, with or without the hyphen or spaces', () => {
    const { plain, entries } = newCodes()
    const first = consumeCode(entries, plain[0].toLowerCase())
    expect(first.ok).toBe(true)
    expect(first.remaining).toBe(CODE_COUNT - 1)
    expect(unused(first.entries)).toBe(CODE_COUNT - 1)
    expect(consumeCode(first.entries, plain[0]).ok).toBe(false)
    const second = consumeCode(first.entries, plain[1].replace('-', ' '))
    expect(second.ok).toBe(true)
    expect(second.remaining).toBe(CODE_COUNT - 2)
  })

  it('refuses a wrong code, a code of the wrong length and junk, and leaves the list unchanged', () => {
    const { entries } = newCodes()
    for (const bad of ['AAAAA-AAAAA', 'ABC', '', null, undefined, 123456, '!!!!!-!!!!!', 'ABCDE-FGHJK-LMNPQ']) {
      const r = consumeCode(entries, bad)
      expect(r.ok).toBe(false)
      expect(r.entries).toBe(entries)
      expect(r.remaining).toBe(CODE_COUNT)
    }
  })

  it('does not accept a code from an older set after a new set replaces it', () => {
    const old = newCodes()
    const fresh = newCodes()
    expect(consumeCode(fresh.entries, old.plain[0]).ok).toBe(false)
  })

  it('reads the stored column safely whatever it holds', () => {
    expect(readState(null)).toEqual({ codes: [] })
    expect(readState('not json')).toEqual({ codes: [] })
    expect(readState({ codes: 'x' })).toEqual({ codes: [] })
    const { entries } = newCodes(2)
    expect(readState(JSON.stringify({ codes: entries, at: '2026-11-19T00:00:00.000Z' }))).toEqual({ codes: entries, at: '2026-11-19T00:00:00.000Z' })
    expect(readState({ codes: [{ s: 1 }, entries[0]] }).codes).toEqual([entries[0]])
  })

  it('formats and normalises consistently', () => {
    expect(formatCode('ABCDEFGHJK')).toBe('ABCDE-FGHJK')
    expect(normalizeCode(' abcde-fghjk ')).toBe('ABCDEFGHJK')
  })
})

import { MAX_WRONG, clearWrong, countWrong, isBlocked } from '../../src/lib/recovery'

describe('wrong-code counter', () => {
  it('blocks after five wrong codes inside 15 minutes, and lets go after the window', () => {
    let st = readState({ codes: [] })
    const t0 = Date.parse('2026-11-19T10:00:00.000Z')
    for (let i = 0; i < MAX_WRONG; i++) { expect(isBlocked(st, t0 + i * 1000)).toBe(false); st = countWrong(st, t0 + i * 1000) }
    expect(isBlocked(st, t0 + 10_000)).toBe(true)
    expect(isBlocked(st, t0 + 16 * 60_000)).toBe(false)
    expect(countWrong(st, t0 + 16 * 60_000).f).toBe(1)
    expect(isBlocked(clearWrong(st), t0 + 10_000)).toBe(false)
  })
})
