'use client'
import { ContactForm } from '../components/Forms'
import { RichText } from '../components/RichText'
import { useState, type FormEvent } from 'react'
import { Link } from '../router'
import { useCms } from '../cms-context'
import { FaqList, NewsCard } from '../components/sections'
import { Arrow, Curves, DocIcon, Download, Mail, PageHero, Phone, Pin, Search, SecHead, TLink } from '../components/ui'
import { docKinds, img, sortDocs, tel, type Doc } from '../data/content'
import { fmtDate } from '../data/news'

const byDate = <T extends { date: string }>(a: T[]) => [...a].sort((x, y) => y.date.localeCompare(x.date))

export function Publications() {
  const { docs } = useCms()
  const docsByDate = sortDocs(docs)
  const [f, setF] = useState<'all' | Doc['kind']>('all')
  const report = docsByDate.find((d) => d.kind === 'Report')
  const kinds = (Object.keys(docKinds) as Doc['kind'][]).filter((k) => docsByDate.some((d) => d.kind === k))
  const list = docsByDate.filter((d) => f === 'all' || d.kind === f)
  const yr = report?.title.match(/\d{4}\/\d{2}$/)?.[0] ?? ''
  return (
    <>
      <PageHero eyebrow="Publications" title="Reports, laws" tagline="and directives."
        lead="The Fund’s annual reports, and the laws, regulation and directives that govern deposit insurance in Ethiopia." />
      <section className="section">
        <div className="container">
          {report && <a className="feature-report" href={report.url} target="_blank" rel="noreferrer">
            <Curves />
            <div>
              <span className="eyebrow left light">Latest report · {report.date}</span>
              <h2>{yr ? <>{report.title.replace(/^EDIF /, '').replace(yr, '')}<em>{yr}</em></> : report.title}</h2>
              <p>{report.desc}</p>
              <span className="btn btn--gold">Download PDF <Download /></span>
            </div>
            {report.stats && (
              <ul className="fr-stats">
                {report.stats.map((s) => <li key={s.l}><b className="num">{s.v}</b><span>{s.l}</span></li>)}
              </ul>
            )}
          </a>}

          <div className="pub-head">
            <h2 className="h3">All documents</h2>
            <div className="tabs" role="tablist" aria-label="Filter documents">
              {([['all', 'All'], ...kinds.map((k) => [k, docKinds[k]])] as [typeof f, string][]).map(([k, l]) => (
                <button key={k} role="tab" aria-selected={f === k} className={f === k ? 'on' : ''} onClick={() => setF(k)}>{l}</button>
              ))}
            </div>
          </div>
          <ul className="docs wide">
            {list.map((d) => (
              <li key={d.url}><a className="doc" href={d.url} target="_blank" rel="noreferrer">
                <span className="ic"><DocIcon /></span>
                <span><span className="k">{d.kind}{d.date ? ' · ' + d.date : ''}</span><strong>{d.title}</strong><span className="d">{d.desc}</span></span>
                <span className="dl"><Download /></span>
              </a></li>
            ))}
            {(f === 'all' || f === 'Report') && (
              <li><div className="doc muted">
                <span className="ic"><DocIcon /></span>
                <span><span className="k">Report · April 2024</span><strong>Annual Financial Stability Report</strong><span className="d">Listed on the current website; no download is available yet.</span></span>
                <span />
              </div></li>
            )}
          </ul>
        </div>
      </section>
    </>
  )
}

export function News() {
  const { articles } = useCms()
  const sorted = byDate(articles)
  const [k, setK] = useState('All')
  const kinds = ['All', 'Event', 'Report', 'Results', 'Media', 'Announcement']
  const [first, ...rest] = sorted
  const list = k === 'All' ? rest : sorted.filter((a) => a.kind === k)
  return (
    <>
      <PageHero eyebrow="News and events" title="Latest from" tagline="the Fund."
        lead="Results, events, media appearances and announcements from the Ethiopian Deposit Insurance Fund." />
      <section className="section bg-ice">
        <div className="container">
          {k === 'All' && first && (
            <Link className="lead-story" to={'/news/' + first.slug}>
              <div className="report big"><Curves variant="b" /><small>{first.kind}</small><strong>2024/25<em>Annual Report</em></strong></div>
              <div className="body">
                <time dateTime={first.date}>{fmtDate(first.date)}</time>
                <h2>{first.title}</h2>
                <p>{first.summary}</p>
                <span className="tlink">Read more <Arrow /></span>
              </div>
            </Link>
          )}
          <div className="pub-head">
            <h2 className="h3">{k === 'All' ? 'More stories' : k}</h2>
            <div className="tabs" role="tablist" aria-label="Filter news">
              {kinds.map((x) => <button key={x} role="tab" aria-selected={k === x} className={k === x ? 'on' : ''} onClick={() => setK(x)}>{x === 'All' ? 'All' : x === 'Media' ? 'Media' : x + 's'}</button>)}
            </div>
          </div>
          <div className="news">{list.map((a) => <NewsCard key={a.slug} a={a} />)}</div>
        </div>
      </section>
    </>
  )
}

export function ArticlePage({ slug }: { slug: string }) {
  const { articles } = useCms()
  const sorted = byDate(articles)
  const i = sorted.findIndex((a) => a.slug === slug)
  if (i < 0) return <NotFound />
  const a = sorted[i]
  const prev = sorted[i + 1], next = sorted[i - 1]
  const related = sorted.filter((x) => x.slug !== a.slug).slice(0, 3)
  return (
    <>
      <PageHero eyebrow={a.kind} title={a.title} crumbs={[{ to: '/news', label: 'News' }]}>
        <p className="meta"><time dateTime={a.date}>{fmtDate(a.date)}</time><span>Ethiopian Deposit Insurance Fund</span></p>
      </PageHero>
      <section className="section article-sec">
        <div className="container article">
          <article className="prose">
            {a.image && <figure className="lead-img"><img src={img(a.image)} alt={a.imageAlt || ''} /></figure>}
            <p className="standfirst">{a.summary}</p>
            {a.rich?.root?.children?.length ? <RichText state={a.rich} /> : a.body.map((b, k) =>
              typeof b === 'string' ? <p key={k}>{b}</p>
                : 'h' in b ? <h2 key={k}>{b.h}</h2>
                  : 'list' in b ? <ul key={k}>{b.list.map((l) => <li key={l}>{l}</li>)}</ul>
                    : <blockquote key={k} className="quote"><p>“{b.quote}”</p><cite>{b.by}</cite></blockquote>)}
            {a.gallery && (
              <div className="gallery">
                {a.gallery.map((g) => <figure key={g.src}><img src={img(g.src)} alt={g.alt} loading="lazy" /><figcaption>{g.alt}</figcaption></figure>)}
              </div>
            )}
            {a.pdf && <p><a className="btn btn--navy" href={a.pdf} target="_blank" rel="noreferrer">Download the report (PDF) <Download /></a></p>}
            {a.source && <p className="source">Originally published on <a href={a.source} target="_blank" rel="noreferrer">edif.gov.et</a>.</p>}
            <nav className="pn" aria-label="More stories">
              {prev ? <Link to={'/news/' + prev.slug}><span>Previous</span><strong>{prev.short}</strong></Link> : <span />}
              {next ? <Link className="nx" to={'/news/' + next.slug}><span>Next</span><strong>{next.short}</strong></Link> : <span />}
            </nav>
          </article>
          <aside className="aside">
            <div className="aside-card">
              <h3>Is your money protected?</h3>
              <p>Deposits at every licensed bank and microfinance institution are protected up to Birr 100,000.</p>
              <Link className="btn btn--gold" to="/deposit-protection/calculator">Check your coverage <Arrow /></Link>
            </div>
            <div className="aside-list">
              <h3>More news</h3>
              <ul>{related.map((r) => <li key={r.slug}><Link to={'/news/' + r.slug}><time>{fmtDate(r.date)}</time><span>{r.short}</span></Link></li>)}</ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}

export function FaqPage() {
  const { faqs, contact } = useCms()
  const [q, setQ] = useState('')
  const [c, setC] = useState<'All' | 'Protection' | 'Payout' | 'The Fund'>('All')
  const n = (s: string) => s.toLowerCase()
  const list = faqs.filter((f) => (c === 'All' || f.cat === c) && (!q || n(f.q + ' ' + f.a).includes(n(q))))
  return (
    <>
      <PageHero eyebrow="Questions and answers" title="Straight answers" tagline="to what depositors ask."
        lead="Everything about how deposit insurance works in Ethiopia, what is covered, and what happens if a bank or microfinance institution fails." image="workshop.jpg" />
      <section className="section">
        <div className="container faq-page">
          <div className="dir-tools">
            <label className="search">
              <Search /><span className="sr">Search questions</span>
              <input type="search" placeholder="Search questions" value={q} onChange={(e) => setQ(e.target.value)} />
            </label>
            <div className="tabs" role="tablist" aria-label="Filter questions">
              {(['All', 'Protection', 'Payout', 'The Fund'] as const).map((x) => (
                <button key={x} role="tab" aria-selected={c === x} className={c === x ? 'on' : ''} onClick={() => setC(x)}>{x}</button>
              ))}
            </div>
          </div>
          {list.length ? <FaqList key={c + q} items={list} openFirst={!!q} highlight={q} /> : (
            <div className="empty"><h3>No questions match “{q}”</h3><p>Try a different word, or ask us directly.</p></div>
          )}
          <div className="ask">
            <div><h3>Didn’t find your answer?</h3><p>Call or write to the Fund and we’ll help.</p></div>
            <div className="btn-row"><a className="btn btn--navy" href={tel(contact.phones[0])}>Call {contact.phones[0]}</a><TLink to="/contact">Send a message</TLink></div>
          </div>
        </div>
      </section>
    </>
  )
}

export function Contact() {
  const { faqs, contact } = useCms()
  const [sent, setSent] = useState(false)
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const d = new FormData(e.currentTarget)
    const body = `${d.get('message')}\n\n${d.get('name')}\n${d.get('email')}`
    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(String(d.get('topic')) + ' – website enquiry')}&body=${encodeURIComponent(body)}`
    setSent(true)
  }
  return (
    <>
      <PageHero eyebrow="Contact" title="Get in" tagline="touch."
        lead="Questions about your deposits, membership or the Fund’s work? Call, write or visit us in Addis Ababa." image="teamL.jpg" pos="50% 35%" />
      <section className="section">
        <div className="container contact">
          <div className="cinfo">
            <div className="ccard-i"><span className="ic"><Phone /></span><div><h3>Telephone</h3>{contact.phones.map((p) => <a key={p} href={tel(p)}>{p}</a>)}</div></div>
            <div className="ccard-i"><span className="ic"><Mail /></span><div><h3>Email</h3><a href={'mailto:' + contact.email}>{contact.email}</a></div></div>
            <div className="ccard-i"><span className="ic"><Pin /></span><div><h3>Office</h3><p>{contact.address[0]}<br />{contact.address[1]}</p><p>P.O. Box {contact.poBox}</p></div></div>
            <div className="ccard-i note"><div><h3>Reporting a concern about a bank?</h3><p>Banks and microfinance institutions are supervised by the <a href="https://nbe.gov.et/" target="_blank" rel="noreferrer">National Bank of Ethiopia</a>.</p></div></div>
          </div>
          <ContactForm email={contact.email} />
        </div>
      </section>
      <section className="section bg-ice">
        <div className="container">
          <SecHead eyebrow="Before you write" title="You may find" em="your answer here" />
          <FaqList items={faqs.filter((f) => ['Do I need to register for protection?', 'How much is protected?', 'When would I be paid?'].includes(f.q))} />
          <div className="faq-more"><TLink to="/faq">All questions and answers</TLink></div>
        </div>
      </section>
    </>
  )
}

export function NotFound() {
  return (
    <section className="nf">
      <Curves variant="c" />
      <div className="container">
        <span className="eyebrow left light">Page not found</span>
        <h1>We couldn’t find <em>that page.</em></h1>
        <p>It may have moved when we rebuilt the website. These are the pages people look for most.</p>
        <div className="btn-row">
          <Link className="btn btn--gold" to="/">Home <Arrow /></Link>
          <Link className="btn btn--outline-light" to="/deposit-protection/calculator">Check your coverage</Link>
          <Link className="btn btn--outline-light" to="/members">Member institutions</Link>
        </div>
      </div>
    </section>
  )
}
