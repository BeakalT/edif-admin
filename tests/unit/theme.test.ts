import { describe, expect, it } from 'vitest'
import { contrast, isHex } from '@/lib/contrast'
import { goldText, onGold } from '@/lib/themeColors'

describe('contrast', () => {
  it('matches known WCAG values', () => {
    expect(contrast('#000000', '#ffffff')).toBeCloseTo(21, 0)
    expect(contrast('#ffffff', '#ffffff')).toBeCloseTo(1, 5)
  })
  it('validates hex strictly', () => {
    expect(isHex('#1E3570')).toBe(true)
    for (const bad of ['1E3570', '#1E357', 'red', '#1E3570;}body{display:none', null, 12]) expect(isHex(bad)).toBe(false)
  })
})

describe('gold used as text and on buttons', () => {
  const lightBackgrounds = ['#ffffff', '#F2F6FB', '#F6EFDB']
  it.each(['#C29B38', '#D4AF37', '#E0B84C', '#FFD700', '#B8860B', '#F5C542'])('%s becomes text that reads on every light background (>= 4.5:1)', (g) => {
    const t = goldText(g)
    for (const bg of lightBackgrounds) expect(contrast(t, bg)).toBeGreaterThanOrEqual(4.5)
  })
  it.each(['#C29B38', '#E0B84C', '#9A7416', '#FFD700'])('%s gets a button text colour that reads (>= 4.5:1)', (g) => {
    expect(contrast(onGold(g, '#0F1D44'), g)).toBeGreaterThanOrEqual(4.5)
  })
  it('the shipped default pair passes', () => {
    expect(contrast('#85660F', '#ffffff')).toBeGreaterThanOrEqual(4.5)
    expect(contrast('#0F1D44', '#C29B38')).toBeGreaterThanOrEqual(4.5)
  })
})
