import type { GlobalConfig } from 'payload'
import { APIError } from 'payload'
import { hasRole, isStaff } from '../access'
import { auditGlobal } from '../hooks/audit'
import { revalidateGlobal } from '../hooks/revalidate'
import { contrast, isHex } from '../lib/contrast'

export const THEME_DEFAULTS = { navy: '#1E3570', blue: '#2875BA', gold: '#C29B38', headingFont: 'Raleway', bodyFont: 'Nunito Sans' }
const hex = (label: string) => (v: unknown) => (v == null || v === '' || isHex(v) ? true : `${label}: use a colour like #1E3570.`)

/** Colours, fonts and logo. Every change is checked for readability (WCAG contrast) before it can be saved. */
export const BrandTheme: GlobalConfig = {
  slug: 'brand-theme',
  label: 'Look and feel',
  admin: { group: 'Administration', description: 'Colours, fonts and logo. Leave a field empty to use the EDIF default. Unreadable combinations are refused.' },
  access: { read: isStaff, update: ({ req }) => hasRole(req.user, 'admin', 'publisher') },
  hooks: {
    beforeChange: [({ data }) => {
      if (data.resetToDefaults) return { ...data, navy: null, blue: null, gold: null, headingFont: null, bodyFont: null, resetToDefaults: false }
      const navy = data.navy || THEME_DEFAULTS.navy, blue = data.blue || THEME_DEFAULTS.blue, gold = data.gold || THEME_DEFAULTS.gold
      const checks: [string, number, number][] = [
        [`Main colour on white is ${contrast(navy, '#ffffff').toFixed(1)}:1; it must be at least 7:1 because headings and the header use it.`, contrast(navy, '#ffffff'), 7],
        [`Accent blue on white is ${contrast(blue, '#ffffff').toFixed(1)}:1; it must be at least 4.5:1 because links use it.`, contrast(blue, '#ffffff'), 4.5],
        [`Gold on the main colour is ${contrast(gold, navy).toFixed(1)}:1; it must be at least 3:1 because it highlights text on dark backgrounds.`, contrast(gold, navy), 3],
      ]
      for (const [msg, got, min] of checks) if (got < min) throw new APIError(`Not readable enough. ${msg}`, 400)
      return data
    }],
    afterChange: [auditGlobal, revalidateGlobal],
  },
  fields: [
    { type: 'row', fields: [
      { name: 'navy', type: 'text', label: 'Main colour', admin: { description: `Default ${THEME_DEFAULTS.navy}`, placeholder: THEME_DEFAULTS.navy }, validate: hex('Main colour') },
      { name: 'blue', type: 'text', label: 'Accent blue', admin: { description: `Default ${THEME_DEFAULTS.blue}`, placeholder: THEME_DEFAULTS.blue }, validate: hex('Accent blue') },
      { name: 'gold', type: 'text', label: 'Gold highlight', admin: { description: `Default ${THEME_DEFAULTS.gold}`, placeholder: THEME_DEFAULTS.gold }, validate: hex('Gold') },
    ] },
    { type: 'row', fields: [
      { name: 'headingFont', type: 'select', label: 'Heading font', options: ['Raleway', 'Nunito Sans'], admin: { description: 'Only fonts bundled with the site, so nothing is loaded from other servers.' } },
      { name: 'bodyFont', type: 'select', label: 'Body font', options: ['Nunito Sans', 'Raleway'] },
    ] },
    { name: 'logo', type: 'upload', relationTo: 'media', label: 'Logo (colour, for light backgrounds)', admin: { description: 'Leave empty to keep the EDIF mark. To show text only, tick the box below.' } },
    { name: 'logoWhite', type: 'upload', relationTo: 'media', label: 'Logo (white, for dark backgrounds)' },
    { name: 'useTextLogo', type: 'checkbox', label: 'Show the text name instead of any logo', defaultValue: false },
    { name: 'wordmark', type: 'text', label: 'Text shown when there is no logo', defaultValue: 'EDIF' },
    { name: 'resetToDefaults', type: 'checkbox', label: 'Reset colours and fonts to the EDIF defaults on save', defaultValue: false },
  ],
}
