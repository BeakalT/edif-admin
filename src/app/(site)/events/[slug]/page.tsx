import { notFound } from 'next/navigation'
import { DetailPage, fmt } from '@/site/components/Listing'
import { getOne } from '@/lib/content'
import { toMetadata } from '@/lib/seo'

type Props = { params: Promise<{ slug: string }> }
export async function generateMetadata({ params }: Props) {
  const e = await getOne('events', (await params).slug)
  return e ? toMetadata(`/events/${e.slug}`, e.seo || {}, { title: e.title + ' | Events', description: e.summary, image: e.image?.url }) : { title: 'Page not found', robots: { index: false } }
}
export default async function Page({ params }: Props) {
  const e = await getOne('events', (await params).slug)
  if (!e) notFound()
  const ok = /^https:\/\//i.test(e.registerUrl || '')
  return <DetailPage base="/events" label="Events" item={e}
    facts={[['When', fmt(e.startsAt, true)], ['Until', fmt(e.endsAt, true)], ['Where', e.venue || '']]}
    extra={ok ? <p><a className="btn btn--navy" href={e.registerUrl} target="_blank" rel="noopener noreferrer">Register</a></p> : null} />
}
