import { describe, expect, it } from 'vitest'
import { checkPassword } from '@/lib/passwordPolicy'

describe('password policy', () => {
  it('accepts a long mixed password', () => expect(checkPassword('Orange-Tiger-Lamp-49')).toBeNull())
  it.each([
    ['short1A!', /12 characters/],
    ['alllowercaseletters', /mix/],
    ['Password!xKz#Qw9L', /common word/],
    ['Aaaa1111Bbbb!!zz', /repeat/],
    ['Zq!8vKabcd2mLp9x', /runs/],
    ['EDIF-Secure-Pass-77!', /common word/],
  ])('rejects %s', (pw, why) => expect(checkPassword(pw)).toMatch(why))
  it('rejects a password built from the email or name', () => {
    expect(checkPassword('Beakalteshome#2026Xq', { email: 'beakalteshome@example.org' })).toMatch(/name or email/)
    expect(checkPassword('Teshome-Zr8-Quill!', { name: 'Beakal Teshome' })).toMatch(/name or email/)
  })
  it('rejects non-strings and very long input', () => {
    expect(checkPassword(undefined)).toMatch(/Enter/)
    expect(checkPassword('Aa1!' + 'x'.repeat(200))).toMatch(/at most/)
  })
})
