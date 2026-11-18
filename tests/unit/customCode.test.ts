import { describe, expect, it } from 'vitest'
import { cleanHtml, scopeCss } from '@/lib/customCode'

describe('custom HTML is sanitised', () => {
  it.each([
    ['<script>alert(1)</script><p>hi</p>', /script/i],
    ['<img src=x onerror="alert(1)">', /onerror/i],
    ['<a href="javascript:alert(1)">x</a>', /javascript/i],
    ['<iframe src="https://evil.example"></iframe>', /iframe/i],
    ['<form action="https://evil.example"><input></form>', /<form|<input/i],
    ['<p style="position:fixed;top:0">x</p>', /style=/i],
    ['<a href="data:text/html;base64,PHNjcmlwdD4=">x</a>', /data:/i],
    ['<svg onload=alert(1)></svg>', /onload|<svg/i],
  ])('removes %s', (input, bad) => expect(cleanHtml(input)).not.toMatch(bad))
  it('keeps harmless content and hardens external links', () => {
    const out = cleanHtml('<h2>Title</h2><p>Text <a href="https://example.org">link</a></p>')
    expect(out).toContain('<h2>Title</h2>')
    expect(out).toContain('rel="noopener noreferrer"')
  })
})

describe('custom CSS is scoped and stripped', () => {
  const css = (s: string) => scopeCss(s, '#sec-1')
  it('limits every rule to the section', () => expect(css('p{color:red} .a .b{margin:0}')).toMatch(/^[\s\S]*#sec-1 p[\s\S]*#sec-1 \.a \.b/))
  it.each([
    ['@import url(https://evil.example/x.css);p{color:red}', /@import|evil/],
    ['p{background:url(https://evil.example/t.png)}', /evil/],
    ['p{width:expression(alert(1))}', /expression/i],
    ['p{background:url(javascript:alert(1))}', /javascript/i],
    ['p{position:fixed;inset:0}', /position\s*:\s*fixed/],
    ['body{display:none}', /(^|[^#\w-])body\s*\{/],
  ])('drops %s', (input, bad) => expect(css(input)).not.toMatch(bad))
})
