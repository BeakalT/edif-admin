import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getCms } from '@/lib/cms'
import { getPeople, fmt } from '@/lib/content'
import { Blocks } from '@/site/components/Blocks'
import { DetailPage } from '@/site/components/Listing'
import { PageHero } from '@/site/components/ui'
import { RichText } from '@/site/components/RichText'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Preview', robots: { index: false, follow: false } }
const ALLOWED = ['pages', 'news', 'tenders', 'vacancies', 'events']

/** Shows the latest saved draft exactly as visitors will see it. Only signed-in staff can open it. */
export default async function Page({ params }: { params: Promise<{ collection: string; id: string }> }) {
  const { collection, id } = await params
  if (!ALLOWED.includes(collection)) notFound()
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })
  if (!user || !['admin', 'publisher', 'editor', 'seo', 'auditor'].includes((user as any).role)) notFound()
  const doc: any = await payload.findByID({ collection: collection as any, id, draft: true, depth: 1, overrideAccess: true }).catch(() => null)
  if (!doc) notFound()
  const bar = <div className="notice notice--warning" role="status"><div className="container"><p>Preview of the latest draft. Visitors cannot see this page{doc._status === 'published' ? ' until the changes are published' : ' until it is published'}.</p></div></div>
  let body: React.ReactNode
  if (collection === 'pages') {
    const [cms, people] = await Promise.all([getCms(), getPeople()])
    const layout = (doc.layout || []) as any[]
    body = <>{layout[0]?.blockType !== 'hero' && <PageHero eyebrow="" title={doc.title} />}<Blocks blocks={layout} cms={cms} people={people} /></>
  } else if (collection === 'news') {
    body = (
      <>
        <PageHero eyebrow={doc.kind} title={doc.title} />
        <section className="section"><div className="container blk-narrow">
          {doc.image?.url && <figure className="lead-img"><img src={doc.image.url} alt={doc.image.alt || ''} /></figure>}
          <p className="standfirst">{doc.summary}</p><div className="prose"><RichText state={doc.body} /></div>
        </div></section>
      </>
    )
  } else {
    const label = { tenders: 'Tenders', vacancies: 'Vacancies', events: 'Events' }[collection as 'tenders']
    const facts: [string, string][] = collection === 'events' ? [['When', fmt(doc.startsAt, true)], ['Where', doc.venue || '']] : [['Closes', fmt(doc.closingDate, true)], ['Reference', doc.reference || '']]
    body = <DetailPage base={'/' + collection} label={label} item={doc} facts={facts} files={(doc.documents || []).filter((d: any) => d.file?.url).map((d: any) => ({ label: d.label, url: d.file.url }))} />
  }
  return <>{bar}{body}</>
}
