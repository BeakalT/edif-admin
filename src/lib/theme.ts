import { getPayload } from 'payload'
import config from '@payload-config'
import { cache } from 'react'
import { isHex } from './contrast'
import { goldText, mix, onGold } from './themeColors'

/** CSS overrides from "Look and feel". Only values that pass the strict hex check are ever written into the page. */
export const getThemeCss = cache(async (): Promise<string> => {
  const payload = await getPayload({ config })
  const t: any = await payload.findGlobal({ slug: 'brand-theme', overrideAccess: true, depth: 0 }).catch(() => null)
  if (!t) return ''
  const v: string[] = []
  if (isHex(t.navy)) v.push(`--navy:${t.navy}`, `--navy-2:${mix(t.navy, '#000000', 0.18)}`, `--navy-3:${mix(t.navy, '#000000', 0.38)}`)
  if (isHex(t.blue)) v.push(`--blue:${t.blue}`, `--blue-soft:${mix(t.blue, '#ffffff', 0.5)}`)
  if (isHex(t.gold)) v.push(`--gold:${t.gold}`, `--gold-2:${goldText(t.gold)}`, `--gold-pale:${mix(t.gold, '#ffffff', 0.62)}`, `--on-gold:${onGold(t.gold, isHex(t.navy) ? mix(t.navy, '#000000', 0.38) : '#0F1D44')}`)
  const FONTS: Record<string, string> = { Raleway: '"Raleway"', 'Nunito Sans': '"Nunito Sans"' }
  if (FONTS[t.headingFont]) v.push(`--display:${FONTS[t.headingFont]},"Noto Sans Ethiopic",system-ui,sans-serif`)
  if (FONTS[t.bodyFont]) v.push(`--body:${FONTS[t.bodyFont]},"Noto Sans Ethiopic",system-ui,-apple-system,"Segoe UI",sans-serif`)
  return v.length ? `:root{${v.join(';')}}` : ''
})
