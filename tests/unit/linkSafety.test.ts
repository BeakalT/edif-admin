import { describe, expect, it } from 'vitest'
import { safeHref, validateLink, webAddress } from '@/lib/safeUrl'
import { jsonLd } from '@/lib/jsonLd'

describe('link addresses typed by staff', () => {
  it('keeps page paths, anchors, web, mail and phone links', () => {
    for (const u of ['/about', '#faq', 'https://edif.gov.et/x', 'http://a.b', 'mailto:a@b.et', 'tel:+251115']) expect(safeHref(u)).toBe(u)
  })
  it('drops script, data, protocol-relative and malformed addresses', () => {
    for (const u of ['javascript:alert(1)', ' JavaScript:x', 'data:text/html,x', '//evil.example', '/\\evil', 'java\tscript:x', 'https://', 'about']) expect(safeHref(u)).toBeUndefined()
    expect(validateLink('javascript:alert(1)')).toMatch(/page path/)
    expect(validateLink('')).toBe(true)
  })
  it('adds https:// to a bank website typed without it', () => {
    expect(webAddress('www.cbe.com.et')).toBe('https://www.cbe.com.et')
    expect(webAddress('javascript:x')).toBeUndefined()
  })
})

describe('JSON-LD', () => {
  it('cannot close its own script tag and still parses to the same data', () => {
    const out = jsonLd({ a: '</script><script>alert(1)</script>&' })
    expect(out).not.toContain('<')
    expect(JSON.parse(out).a).toBe('</script><script>alert(1)</script>&')
  })
})
