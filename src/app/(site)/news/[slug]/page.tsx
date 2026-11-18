import { notFound } from 'next/navigation'
import { ArticlePage } from '@/site/pages/Other'
import { getCms, getNewsDoc } from '@/lib/cms'
import { toMetadata } from '@/lib/seo'

type Props = { params: Promise<{ slug: string }> }

export const dynamicParams = true
export async function generateStaticParams() {
  const { articles } = await getCms()
  return articles.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: Props) {
  const a = await getNewsDoc((await params).slug)
  if (!a) return { title: 'Page not found', robots: { index: false } }
  const img: any = a.image
  return toMetadata(`/news/${a.slug}`, a.seo || {}, { title: a.title + ' | Ethiopian Deposit Insurance Fund', description: a.summary, image: img?.sizes?.share?.url || img?.url }, {
    openGraph: { type: 'article', publishedTime: a.date, title: a.seo?.title || a.title, description: a.seo?.description || a.summary },
  })
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  if (!(await getNewsDoc(slug))) notFound()
  return <ArticlePage slug={slug} />
}
