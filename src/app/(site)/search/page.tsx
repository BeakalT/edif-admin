import { Link } from '@/site/router'
import { PageHero } from '@/site/components/ui'
import { search } from '@/lib/content'

export const metadata = { title: 'Search | Ethiopian Deposit Insurance Fund', robots: { index: false } }
export const dynamic = 'force-dynamic'

export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const q = String((await searchParams).q || '').slice(0, 80)
  const hits = q ? await search(q) : []
  return (
    <>
      <PageHero eyebrow="Search" title="Search the site" />
      <section className="section"><div className="container blk-narrow">
        <form className="searchbar" action="/search" method="get" role="search">
          <label className="sr" htmlFor="q">Search</label>
          <input className="field" id="q" name="q" defaultValue={q} minLength={2} maxLength={80} placeholder="Search news, publications, questions…" />
          <button className="btn btn--navy" type="submit">Search</button>
        </form>
        {q && <p>{hits.length ? `${hits.length} result${hits.length === 1 ? '' : 's'} for “${q}”` : `Nothing found for “${q}”. Try a shorter or different word.`}</p>}
        <div className="listing">
          {hits.map((h, i) => (
            <Link key={i} className="lrow" to={h.url}><strong>{h.title}</strong>{h.text && <p>{h.text.slice(0, 160)}</p>}<div className="meta"><span className="badge">{h.kind}</span></div></Link>
          ))}
        </div>
      </div></section>
    </>
  )
}
