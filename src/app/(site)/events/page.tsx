import { ListPage, fmt } from '@/site/components/Listing'
import { getList } from '@/lib/content'
import { toMetadata } from '@/lib/seo'

const nowMs = () => Date.now()
export const metadata = toMetadata('/events', {}, { title: 'Events | Ethiopian Deposit Insurance Fund', description: 'Conferences, workshops and public events.' })

export default async function Page() {
  const all = await getList('events', 'startsAt')
  const now = nowMs()
  const row = (e: any) => ({ slug: e.slug, title: e.title, summary: e.summary, meta: [fmt(e.startsAt, true), e.venue].filter(Boolean) })
  return <ListPage base="/events" eyebrow="Events" title="Events" lead="Conferences, workshops and public events." open={all.filter((e) => new Date(e.endsAt || e.startsAt).getTime() >= now).map(row)} closed={all.filter((e) => new Date(e.endsAt || e.startsAt).getTime() < now).reverse().map(row)} emptyText="No events are scheduled right now." />
}
