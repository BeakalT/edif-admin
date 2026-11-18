import type { ReactNode } from 'react'
import { getCms } from '@/lib/cms'
import { getPage, getPeople } from '@/lib/content'
import { Blocks } from './Blocks'
import { PageHero } from './ui'
import { pageMetadata, toMetadata } from '@/lib/seo'

/** Shows the page an admin built for this address; if none is published, shows the original coded page. */
export async function CmsPage({ path, children }: { path: string; children: ReactNode }) {
  const page = await getPage(path)
  if (!page) return <>{children}</>
  const [cms, people] = await Promise.all([getCms(), getPeople()])
  const layout = (page.layout || []) as any[]
  const first = layout[0]?.blockType
  return (
    <>
      {!['hero', 'homeHero', 'pageHero'].includes(first) && <PageHero eyebrow="" title={page.title} />}
      <Blocks blocks={layout} cms={cms} people={people} />
    </>
  )
}

export async function cmsMetadata(path: string) {
  const page = await getPage(path)
  if (!page || !page.seo || !(page.seo as any).title) return pageMetadata(path)
  const img: any = page.seo?.image
  return toMetadata(page.path, page.seo || {}, { title: page.title + ' | Ethiopian Deposit Insurance Fund', image: img?.sizes?.share?.url || img?.url })
}
