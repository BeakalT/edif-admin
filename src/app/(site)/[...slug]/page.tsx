import { notFound, permanentRedirect, redirect } from 'next/navigation'
import { getCms, getRedirect } from '@/lib/cms'
import { getPage, getPeople } from '@/lib/content'
import { Blocks } from '@/site/components/Blocks'
import { PageHero } from '@/site/components/ui'
import { toMetadata } from '@/lib/seo'

type Props = { params: Promise<{ slug: string[] }> }
const toPath = (s: string[]) => '/' + s.map(decodeURIComponent).join('/')

export async function generateMetadata({ params }: Props) {
  const page = await getPage(toPath((await params).slug))
  if (!page) return { robots: { index: false } }
  const img: any = page.seo?.image
  return toMetadata(page.path, page.seo || {}, { title: page.title + ' | Ethiopian Deposit Insurance Fund', image: img?.sizes?.share?.url || img?.url })
}

/** Pages built in the admin; otherwise a redirect an admin set up; otherwise the not-found page. */
export default async function Page({ params }: Props) {
  const path = toPath((await params).slug)
  const page = await getPage(path)
  if (page) {
    const [cms, people] = await Promise.all([getCms(), getPeople()])
    const layout = (page.layout || []) as any[]
    return (
      <>
        {layout[0]?.blockType !== 'hero' && <PageHero eyebrow="" title={page.title} />}
        <Blocks blocks={layout} cms={cms} people={people} />
      </>
    )
  }
  const r = await getRedirect(path)
  if (r) (r.permanent ? permanentRedirect : redirect)(r.to)
  notFound()
}
