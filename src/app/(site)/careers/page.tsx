import { ListPage } from '@/site/components/Listing'
import { toMetadata } from '@/lib/seo'

export const metadata = toMetadata('/careers', {}, { title: 'Jobs | Ethiopian Deposit Insurance Fund', description: 'Current vacancies at the Ethiopian Deposit Insurance Fund.' })

export default function Page() {
  return <ListPage base="/careers" eyebrow="Work with us" title="Jobs" lead="Current vacancies at the Ethiopian Deposit Insurance Fund." open={[]} closed={[]} emptyText="There are no open vacancies at the moment. Please check back soon." />
}
