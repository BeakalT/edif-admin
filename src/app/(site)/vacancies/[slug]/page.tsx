import { notFound } from 'next/navigation'
import { DetailPage, fmt, isClosed } from '@/site/components/Listing'
import { getOne } from '@/lib/content'
import { toMetadata } from '@/lib/seo'

type Props = { params: Promise<{ slug: string }> }
export async function generateMetadata({ params }: Props) {
  const v = await getOne('vacancies', (await params).slug)
  return v ? toMetadata(`/vacancies/${v.slug}`, v.seo || {}, { title: v.title + ' | Vacancies', description: v.summary }) : { title: 'Page not found', robots: { index: false } }
}
export default async function Page({ params }: Props) {
  const v = await getOne('vacancies', (await params).slug)
  if (!v || isClosed(v.closingDate)) notFound()
  return <DetailPage base="/vacancies" label="Vacancies" item={v}
    facts={[['Department', v.department || ''], ['Location', v.location || ''], ['Type', ({ full: 'Full time', contract: 'Contract', intern: 'Internship' } as any)[v.employmentType] || ''], ['Closes', fmt(v.closingDate)], ['Apply to', v.applyEmail || '']]}
    files={v.document?.url ? [{ label: 'Full announcement (PDF)', url: v.document.url }] : []} />
}
