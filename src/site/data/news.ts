export type Article = {
  slug: string
  date: string
  title: string
  short: string
  summary: string
  kind: 'Report' | 'Event' | 'Results' | 'Media' | 'Announcement'
  image?: string
  imageAlt?: string
  gallery?: { src: string; alt: string }[]
  rich?: any
  body: (string | { h: string } | { list: string[] } | { quote: string; by: string })[]
  pdf?: string
  source: string
}

export const fmtDate = (d: string) =>
  new Date(d + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
