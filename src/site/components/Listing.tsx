import { Link } from '../router'
import { PageHero, SecHead } from './ui'
import { RichText } from './RichText'
import { fmt, isClosed } from '../../lib/content'

export type Row = { slug: string; title: string; summary: string; meta: string[]; closed?: boolean; badge?: string }

export function ListPage({ base, eyebrow, title, lead, open, closed, emptyText }: { base: string; eyebrow: string; title: string; lead: string; open: Row[]; closed?: Row[]; emptyText: string }) {
  const row = (r: Row) => (
    <Link key={r.slug} className="lrow" to={`${base}/${r.slug}`}>
      <strong>{r.title}</strong><p>{r.summary}</p>
      <div className="meta">{r.badge && <span className={'badge' + (r.closed ? ' closed' : '')}>{r.badge}</span>}{r.meta.map((m) => <span key={m}>{m}</span>)}</div>
    </Link>
  )
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} lead={lead} />
      <section className="section"><div className="container">
        <div className="listing">{open.length ? open.map(row) : <p>{emptyText}</p>}</div>
        {!!closed?.length && (<><div style={{ height: 40 }} /><SecHead eyebrow="Archive" title="Closed" center={false} /><div className="listing">{closed.map(row)}</div></>)}
      </div></section>
    </>
  )
}

export function DetailPage({ base, label, item, facts, files, extra }: { base: string; label: string; item: any; facts: [string, string][]; files?: { label: string; url: string }[]; extra?: React.ReactNode }) {
  return (
    <>
      <PageHero eyebrow={label} title={item.title} crumbs={[{ to: base, label }]} />
      <section className="section"><div className="container blk-narrow">
        <dl className="facts">{facts.filter(([, v]) => v).map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
        <p className="standfirst">{item.summary}</p>
        <div className="prose"><RichText state={item.details} /></div>
        {!!files?.length && <ul className="blk-dl">{files.map((f) => <li key={f.url}><a href={f.url} target="_blank" rel="noopener noreferrer">{f.label}</a></li>)}</ul>}
        {extra}
      </div></section>
    </>
  )
}
export { fmt, isClosed }
