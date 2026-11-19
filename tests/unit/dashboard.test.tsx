import { describe, expect, it } from 'vitest'
import { renderDashboard } from '../fixtures/dashboard'

const has = (html: string | null, ...t: string[]) => t.forEach((x) => expect(html, x).toContain(x))
const lacks = (html: string | null, ...t: string[]) => t.forEach((x) => expect(html, x).not.toContain(x))

describe('dashboard: what each role sees', () => {
  it('Super Admin sees everything', async () => {
    const h = await renderDashboard('admin')
    has(h, 'Waiting for review', 'Accounts without two-factor', 'Last backup', 'Content overview', 'Recently edited', 'Visits, last 7 days', 'Search (SEO) checks', 'Recent activity', 'Security events')
  })
  it('Publisher sees content and health, but no accounts, backups or audit trail', async () => {
    const h = await renderDashboard('publisher')
    has(h, 'Content overview', 'Visits, last 7 days', 'Search (SEO) checks')
    lacks(h, 'Accounts without two-factor', 'Last backup', 'Security events', 'Recent activity')
  })
  it('Editor sees content only', async () => {
    const h = await renderDashboard('editor')
    has(h, 'Content overview', 'Waiting for review')
    lacks(h, 'Site health', 'Visits, last', 'Search (SEO) checks', 'Accounts without two-factor', 'Recent activity')
  })
  it('SEO role sees search checks only', async () => {
    const h = await renderDashboard('seo')
    has(h, 'Search (SEO) checks')
    lacks(h, 'Visits, last', 'Content overview', 'Accounts without two-factor', 'Recent activity')
  })
  it('Auditor sees visits, security and the activity trail, but not content tools', async () => {
    const h = await renderDashboard('auditor')
    has(h, 'Visits, last 7 days', 'Security events', 'Recent activity')
    lacks(h, 'Content overview', 'Search (SEO) checks', 'Accounts without two-factor')
  })
  it('shows nothing until the authenticator step is done', async () => {
    expect(await renderDashboard('admin', false)).toBeNull()
  })
})

describe('dashboard: wording', () => {
  it('greets with a plain-language summary', async () => {
    const h = await renderDashboard('admin')
    has(h, 'thing', 'visits this week')
  })
  it('never prints undefined, NaN or [object Object]', async () => {
    for (const role of ['admin', 'publisher', 'editor', 'seo', 'auditor']) lacks(await renderDashboard(role), 'undefined', 'NaN', '[object Object]')
  })
  it('escapes text that comes from content', async () => {
    const h = await renderDashboard('admin')
    expect(h).not.toMatch(/<script/i)
  })
})
