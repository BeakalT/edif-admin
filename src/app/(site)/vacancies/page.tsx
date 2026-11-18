import { ListPage, fmt, isClosed } from '@/site/components/Listing'
import { getList } from '@/lib/content'
import { toMetadata } from '@/lib/seo'

export const metadata = toMetadata('/vacancies', {}, { title: 'Vacancies | Ethiopian Deposit Insurance Fund', description: 'Job openings at the Ethiopian Deposit Insurance Fund.' })

export default async function Page() {
  const all = (await getList('vacancies', 'closingDate')).filter((v) => !isClosed(v.closingDate))
  const rows = all.map((v) => ({ slug: v.slug, title: v.title, summary: v.summary, meta: [v.department, v.location, `Closes ${fmt(v.closingDate)}`].filter(Boolean) }))
  return <ListPage base="/vacancies" eyebrow="Work with us" title="Vacancies" lead="Current openings at the Fund." open={rows} emptyText="There are no vacancies at the moment. Please check again soon." />
}
