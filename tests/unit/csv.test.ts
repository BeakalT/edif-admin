import { describe, expect, it } from 'vitest'
import { parseCsv, toCsv } from '@/lib/csv'

describe('csv', () => {
  it('neutralises spreadsheet formulas on export', () => {
    const out = toCsv(['a'], [{ a: '=HYPERLINK("http://evil","x")' }, { a: '+1' }, { a: '-2' }, { a: '@SUM(A1)' }])
    for (const line of out.split('\r\n').slice(1, 5)) expect(line.replace(/^"/, '')).toMatch(/^'/)
  })
  it('round-trips quotes, commas and newlines', () => {
    const rows = [{ a: 'hello, "world"', b: 'line1\nline2' }]
    expect(parseCsv(toCsv(['a', 'b'], rows))).toEqual([['a', 'b'], ['hello, "world"', 'line1\nline2']])
  })
  it('ignores blank lines and a BOM', () => expect(parseCsv('﻿a,b\r\n\r\n1,2\r\n')).toEqual([['a', 'b'], ['1', '2']]))
})
