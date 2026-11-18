import { describe, it, expect } from 'vitest'
import { summarize } from '../../src/lib/auditSummary'

describe('audit summary', () => {
  it('reads as a sentence for an edit', () => {
    expect(summarize({ action: 'update', actor: 'a@x.et', actorRole: 'editor', resource: 'news', documentTitle: 'Annual report', changes: { title: {}, shortSummary: {} } }))
      .toBe('a@x.et (Editor) edited the news article “Annual report” – changed title, short summary')
  })
  it('covers publishing, deletion and sign-in', () => {
    expect(summarize({ action: 'publish', actor: 'p@x.et', actorRole: 'publisher', resource: 'pages', documentTitle: 'Home' })).toContain('published the page “Home”')
    expect(summarize({ action: 'delete', actor: 'p@x.et', resource: 'tenders', documentTitle: 'T1' })).toContain('deleted the tender')
    expect(summarize({ action: 'login', actor: 'p@x.et', actorRole: 'admin' })).toBe('p@x.et (Super Admin) signed in')
  })
  it('explains security events and unknown actors', () => {
    expect(summarize({ action: 'security', actor: 'x@y.et', documentTitle: 'x@y.et', changes: { event: { to: 'sign-in refused: account locked' } } })).toBe('Sign-in refused: account locked – x@y.et')
    expect(summarize({ action: 'update', resource: 'site-settings', documentTitle: 'site-settings' })).toMatch(/^The system edited/)
  })
})
