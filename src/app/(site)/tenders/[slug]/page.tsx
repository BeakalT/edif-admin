import { notFound } from 'next/navigation'
import { DetailPage, fmt, isClosed } from '@/site/components/Listing'
import { getOne } from '@/lib/content'
import { toMetadata } from '@/lib/seo'

type Props = { params: Promise<{ slug: string }> }
export async function generateMetadata({ params }: Props) {
  const t = await getOne('tenders', (await params).slug)
  return t ? toMetadata(`/tenders/${t.slug}`, t.seo || {}, { title: t.title + ' | Tenders', description: t.summary }) : { title: 'Page not found', robots: { index: false } }
}
export default async function Page({ params }: Props) {
  const t = await getOne('tenders', (await params).slug)
  if (!t) notFound()
  return <DetailPage base="/tenders" label="Tenders" item={t}
    facts={[['Status', isClosed(t.closingDate) ? 'Closed' : 'Open'], ['Reference', t.reference || ''], ['Category', t.category || ''], ['Published', fmt(t.publishedOn)], ['Closes', fmt(t.closingDate, true)], ['Questions to', t.contactEmail || '']]}
    files={(t.documents || []).filter((d: any) => d.file?.url).map((d: any) => ({ label: d.label, url: d.file.url }))} />
}
