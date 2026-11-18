export const revalidate = 300
import { ListPage, fmt, isClosed } from '@/site/components/Listing'
import { getList } from '@/lib/content'
import { toMetadata } from '@/lib/seo'

export const metadata = toMetadata('/tenders', {}, { title: 'Tenders | Ethiopian Deposit Insurance Fund', description: 'Procurement notices from the Ethiopian Deposit Insurance Fund.' })

export default async function Page() {
  const all = await getList('tenders', '-closingDate')
  const row = (t: any) => ({ slug: t.slug, title: t.title, summary: t.summary, closed: isClosed(t.closingDate), badge: isClosed(t.closingDate) ? 'Closed' : 'Open', meta: [t.reference, `Closes ${fmt(t.closingDate, true)}`].filter(Boolean) })
  const rows = all.map(row)
  return <ListPage base="/tenders" eyebrow="Work with us" title="Tenders" lead="Open procurement notices and the archive of closed tenders." open={rows.filter((r) => !r.closed)} closed={rows.filter((r) => r.closed)} emptyText="There are no open tenders at the moment." />
}
