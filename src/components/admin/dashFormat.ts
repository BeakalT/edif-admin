export const fmtDay = (d: string) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'Africa/Addis_Ababa' })
export const daysLeft = (d: string) => { const n = Math.ceil((new Date(d).getTime() - Date.now()) / 864e5); return n <= 0 ? 'today' : n === 1 ? 'tomorrow' : `in ${n} days` }
const dayKey = (d: string) => new Date(d).toLocaleDateString('en-CA', { timeZone: 'Africa/Addis_Ababa' })
export const dayLabel = (d: string) => {
  const k = dayKey(d)
  if (k === dayKey(new Date().toISOString())) return 'Today'
  if (k === dayKey(new Date(Date.now() - 864e5).toISOString())) return 'Yesterday'
  return new Date(d).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Africa/Addis_Ababa' })
}
export const ago = (iso: string) => { const m = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000)); if (m < 1) return 'just now'; if (m < 60) return `${m} min ago`; const h = Math.round(m / 60); if (h < 24) return `${h} h ago`; const d = Math.round(h / 24); return d === 1 ? 'yesterday' : `${d} days ago` }
export const hhmm = (d: string) => new Date(d).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Addis_Ababa' })
export const ACTION_ICON: Record<string, string> = { security: 'shield', login: 'key', logout: 'key', create: 'plus', update: 'changes', publish: 'globe', unpublish: 'globe', submit: 'review', delete: 'trash' }


export type DayStat = { key: string; label: string; date: string; n: number; paths: Record<string, number> }
export type ActivityItem = { id: string | number; text: string; at: string; count: number; action: string }

export function byDay<T extends { at: string }>(items: T[]): { label: string; items: T[] }[] {
  const out: { label: string; items: T[] }[] = []
  for (const it of items) {
    const label = dayLabel(it.at)
    const last = out[out.length - 1]
    if (last && last.label === label) last.items.push(it)
    else out.push({ label, items: [it] })
  }
  return out
}
