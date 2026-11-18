/**
 * Password rules for every staff account. Applied when a password is set, changed or reset.
 * Length matters most, so the minimum is 12; the character mix and the blocklist stop the usual guesses.
 */
const COMMON = [
  'password', 'passw0rd', 'p@ssw0rd', 'p@ssword', 'welcome', 'letmein', 'qwerty', 'qwertyuiop', 'asdfgh', 'zxcvbn', 'admin', 'administrator',
  'iloveyou', 'monkey', 'dragon', 'football', 'baseball', 'abc123', '123456', '654321', '111111', '000000', 'changeme', 'default', 'secret',
  'ethiopia', 'addis', 'addisababa', 'edif', 'deposit', 'insurance', 'nbe', 'birr', 'login', 'master', 'shadow', 'sunshine', 'princess', 'trustno1',
]

const sequential = (s: string) => {
  const t = s.toLowerCase()
  for (let i = 0; i + 4 <= t.length; i++) {
    const a = t.charCodeAt(i), b = t.charCodeAt(i + 1), c = t.charCodeAt(i + 2), d = t.charCodeAt(i + 3)
    if ((b - a === 1 && c - b === 1 && d - c === 1) || (a - b === 1 && b - c === 1 && c - d === 1)) return true
  }
  return false
}

export function checkPassword(pw: unknown, who: { email?: string | null; name?: string | null } = {}): string | null {
  if (typeof pw !== 'string') return 'Enter a password.'
  if (pw.length < 12) return 'Use at least 12 characters.'
  if (pw.length > 128) return 'Use at most 128 characters.'
  if (!/[a-z]/.test(pw) || !/[A-Z]/.test(pw) || !/[0-9]/.test(pw) || !/[^A-Za-z0-9]/.test(pw)) return 'Use a mix of upper and lower case letters, a number and a symbol.'
  if (/(.)\1\1/.test(pw)) return 'Do not repeat the same character three times in a row.'
  if (sequential(pw)) return 'Avoid runs such as 1234 or abcd.'
  const flat = pw.toLowerCase().replace(/[^a-z0-9]/g, '')
  const leet = flat.replace(/0/g, 'o').replace(/1/g, 'l').replace(/3/g, 'e').replace(/4/g, 'a').replace(/5/g, 's').replace(/7/g, 't')
  for (const w of COMMON) if (flat.includes(w) || leet.includes(w)) return 'That password contains a common word. Choose something less guessable.'
  const bits = [who.email?.split('@')[0], ...(who.name || '').split(/\s+/)].filter((x): x is string => !!x && x.length >= 4)
  for (const b of bits) if (flat.includes(b.toLowerCase().replace(/[^a-z0-9]/g, ''))) return 'Do not use your name or email in your password.'
  return null
}

export const PASSWORD_HINT = 'At least 12 characters with upper and lower case letters, a number and a symbol. No common words, repeats or runs like 1234.'
