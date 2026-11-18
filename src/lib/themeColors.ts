import { contrast } from './contrast'

export const mix = (hex: string, to: string, t: number) => {
  const a = parseInt(hex.slice(1), 16), b = parseInt(to.slice(1), 16)
  const ch = (s: number) => Math.round(((a >> s) & 255) * (1 - t) + ((b >> s) & 255) * t)
  return '#' + [16, 8, 0].map((s) => ch(s).toString(16).padStart(2, '0')).join('')
}

/** Darkens the gold until it can be used as small text on the lightest page backgrounds (4.6:1 or better). */
export const goldText = (gold: string) => {
  let c = gold
  for (let t = 0.1; t <= 1 && Math.min(contrast(c, '#ffffff'), contrast(c, '#F2F6FB'), contrast(c, '#F6EFDB')) < 4.6; t += 0.05) c = mix(gold, '#000000', t)
  return c
}
/** Text colour for gold buttons: the brand navy when it reads (4.5:1), otherwise whichever of white or black reads best. One of them always does. */
export const onGold = (gold: string, navy3: string) => {
  if (contrast(navy3, gold) >= 4.5) return navy3
  return contrast('#ffffff', gold) >= contrast('#000000', gold) ? '#ffffff' : '#000000'
}
