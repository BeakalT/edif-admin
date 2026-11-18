import { Link } from '../router'
import { RichText } from './RichText'
import { FaqList, NewsCard, PubCard } from './sections'
import { Arrow, Curves, SecHead, TLink } from './ui'
import * as P from './Parts'
import type { Cms } from '../cms-context'
import { cleanHtml, scopeCss } from '../../lib/customCode'

const im = (m: any) => (m && typeof m === 'object' && m.url ? { src: m.url as string, alt: m.alt as string } : null)
const figs = (cms: Cms) => cms.figures as any

function Part({ p, cms, people }: { p: any; cms: Cms; people: any[] }) {
  switch (p.blockType) {
    case 'splitText': return <P.SplitText {...p} image={im(p.image)} />
    case 'visionMission': return <P.VisionMission items={p.items} />
    case 'pcards': return <P.PCards items={p.items} numbered={p.numbered} />
    case 'iCards': return <P.ICards items={p.items} darkMiddle={p.darkMiddle} />
    case 'numberedList': return <P.NumberedList {...p} />
    case 'statGrid': return <P.StatGrid items={p.items} columns={p.columns === '4' ? '4' : '6'} buttons={p.buttons} figures={figs(cms)} />
    case 'orgChart': return <P.OrgChart {...p} />
    case 'board': {
      const list = people.filter((x) => x.group === p.group).map((x) => ({ name: x.name, jobTitle: x.jobTitle, photo: im(x.photo)?.src }))
      return <P.Board people={list} seatsTitle={p.seatsTitle} seats={p.seats} note={p.note} />
    }
    case 'profiles': return <P.Profiles people={people.filter((x) => x.group === p.group).map((x) => ({ name: x.name, jobTitle: x.jobTitle, photo: im(x.photo)?.src, bio: x.bio ? <RichText state={x.bio} /> : null }))} />
    case 'crowd': return <P.Crowd {...p} photo={im(p.photo)} />
    case 'rules': return <P.Rules {...p} />
    case 'compare': return <P.Compare {...p} />
    case 'ticker': return <P.Ticker {...p} />
    case 'steps': return <P.Steps {...p} />
    case 'calcSection': return <P.CalcSection {...p} />
    case 'faqSplit': return <P.FaqSplit {...p} />
    case 'linkCards': return <P.LinkCards items={p.items?.map((c: any) => ({ ...c, icon: c.icon === 'none' ? undefined : c.icon }))} />
    case 'typeCards': return <P.TypeCards items={p.items} />
    case 'exclPanel': return <P.ExclPanel items={p.items} />
    case 'worked': return <P.Worked items={p.items} />
    case 'faqPart': return <P.FaqPart {...p} />
    case 'premiumCards': return <P.PremiumCards items={p.items} />
    case 'memberDirectory': return <P.MemberDirectory source={p.source} />
    case 'ledeSplit': return <P.LedeSplit {...p} />
    default: return null
  }
}

type B = Record<string, any> & { blockType: string; id?: string }
const src = (m: any) => (m && typeof m === 'object' ? m.url : undefined)
const alt = (m: any, fb = '') => (m && typeof m === 'object' ? m.alt || fb : fb)
const isExt = (u: string) => /^https?:\/\//i.test(u)
const safe = (u?: string) => (u && /^(https?:\/\/|mailto:|tel:|\/|#)/i.test(u.trim()) ? u.trim() : '#')
const Anchor = ({ url, children, className }: { url: string; children: React.ReactNode; className?: string }) =>
  isExt(url) ? <a className={className} href={safe(url)} target="_blank" rel="noopener noreferrer">{children}</a> : <Link className={className} to={safe(url)}>{children}</Link>

function embed(url: string) {
  const yt = url.match(/^https:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{6,})/i)
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}`
  const vm = url.match(/^https:\/\/(?:www\.)?vimeo\.com\/(\d+)/i)
  return vm ? `https://player.vimeo.com/video/${vm[1]}` : null
}

export function Blocks({ blocks, cms, people = [] }: { blocks: B[]; cms: Cms; people?: any[] }) {
  return (
    <div className="blocks">
      {blocks.map((b, i) => {
        if (b.section?.hidden) return null
        const k = b.id || i
        const inner = ((): React.ReactNode => { switch (b.blockType) {
          case 'custom': {
            const scope = 'cs-' + String(b.id || i).replace(/[^a-z0-9]/gi, '').slice(0, 24)
            const css = scopeCss(b.css || '', scope)
            return (
              <section className="section custom-section" id={undefined}>
                {css ? <style dangerouslySetInnerHTML={{ __html: css }} /> : null}
                <div id={scope} className="container" dangerouslySetInnerHTML={{ __html: cleanHtml(b.html || '') }} />
              </section>
            )
          }
          case 'homeHero': return <P.HomeHero {...(b as any)} image={im(b.image)} />
          case 'pageHero': return <P.PageHeroPart {...(b as any)} image={im(b.image)} crumbLabel={b.crumbLabel} crumbUrl={b.crumbUrl} />
          case 'nextLinks': return <P.NextLinksPart items={b.items} />
          case 'band': return (
            <section className="section band">
              {b.curves !== false && <Curves variant="c" />}
              <div className="container band-inner">
                <div>{b.eyebrow && <span className="eyebrow left light">{b.eyebrow}</span>}<h2 className="h2 light">{b.title}</h2></div>
                <div className="band-copy">
                  {(b.paragraphs || []).map((x: any, j: number) => <p key={j}>{x.text}</p>)}
                  {b.showContact && <p className="mi-contact"><a href={'mailto:' + cms.contact.email}>{cms.contact.email}</a><a href={'tel:' + String(cms.contact.phones[0]).replace(/[^\d+]/g, '')}>{cms.contact.phones[0]}</a></p>}
                  {b.button?.label && b.button?.url && <Anchor url={b.button.url} className="btn btn--gold">{b.button.label} <Arrow /></Anchor>}
                </div>
              </div>
            </section>
          )
          case 'section': {
            const h = b.head || {}
            return (
              <section className={'section' + (b.flush ? ' vmv-sec' : '') + ((b.parts || []).some((x: any) => x.blockType === 'memberDirectory') ? ' dir-sec' : '')}><div className="container">
                {(h.title || h.eyebrow) && <SecHead eyebrow={h.eyebrow || ''} title={h.title} em={h.em} lead={h.lead} center={h.center !== false} />}
                {(b.parts || []).map((p: any, j: number) => <Part key={p.id || j} p={p} cms={cms} people={people} />)}
              </div></section>
            )
          }
          case 'hero':
            return (
              <section key={k} className="page-hero blk-hero">
                <div className="container page-hero-inner">
                  {b.eyebrow && <span className="eyebrow left light">{b.eyebrow}</span>}
                  <h1>{b.title}</h1>
                  {b.intro && <p className="intro">{b.intro}</p>}
                </div>
              </section>
            )
          case 'richText':
            return (
              <section key={k} className="section"><div className="container blk-narrow">
                {b.heading && <h2 className="h2">{b.heading}</h2>}
                <div className="prose"><RichText state={b.content} /></div>
              </div></section>
            )
          case 'cards':
            return (
              <section key={k} className="section bg-ice"><div className="container">
                {b.heading && <SecHead eyebrow="" title={b.heading} />}
                <div className={'blk-cards c' + (b.columns || '3')}>
                  {(b.items || []).map((c: any, j: number) => (
                    <div className="blk-card" key={c.id || j}>
                      {src(c.image) && <img src={src(c.image)} alt={alt(c.image)} loading="lazy" />}
                      <h3>{c.title}</h3>
                      {c.text && <p>{c.text}</p>}
                      {c.linkUrl && <Anchor url={c.linkUrl} className="tlink">{c.linkLabel || 'Read more'} <Arrow /></Anchor>}
                    </div>
                  ))}
                </div>
              </div></section>
            )
          case 'figures': {
            const items = (b.items || []).map((f: any) => (f && typeof f === 'object' ? f : null)).filter(Boolean)
            return (
              <section key={k} className="section"><div className="container">
                {b.heading && <SecHead eyebrow="" title={b.heading} />}
                <div className="blk-figs">
                  {items.map((f: any) => (
                    <figure key={f.id}>
                      <b className="num">{f.value}</b><strong>{f.label}</strong>
                      {f.note && <p>{f.note}</p>}
                      <figcaption>Source: {f.source}, as of {new Date(f.asOf).toLocaleDateString('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' })}</figcaption>
                    </figure>
                  ))}
                </div>
              </div></section>
            )
          }
          case 'faqs':
            return (
              <section key={k} className="section bg-ice"><div className="container blk-narrow">
                {b.heading && <h2 className="h2">{b.heading}</h2>}
                <FaqList items={b.category ? cms.faqs.filter((f) => f.cat === b.category) : cms.faqs} />
              </div></section>
            )
          case 'news':
            return (
              <section key={k} className="section"><div className="container">
                <SecHead eyebrow="News and events" title={b.heading || 'Latest news'} />
                <div className="news">{cms.articles.slice(0, b.count || 3).map((a) => <NewsCard key={a.slug} a={a} />)}</div>
                <div className="faq-more"><TLink to="/news">All news</TLink></div>
              </div></section>
            )
          case 'publications': {
            const list = cms.docs.filter((d) => !b.kind || d.kind.toLowerCase() === String(b.kind).toLowerCase()).slice(0, b.count || 6)
            return (
              <section key={k} className="section bg-ice"><div className="container">
                {b.heading && <SecHead eyebrow="" title={b.heading} />}
                <div className="pubs">{list.map((d) => <PubCard key={d.title} d={d} />)}</div>
              </div></section>
            )
          }
          case 'people':
            return (
              <section key={k} className="section"><div className="container">
                {b.heading && <SecHead eyebrow="" title={b.heading} />}
                <div className="blk-people">
                  {people.filter((p) => p.group === b.group).map((p) => (
                    <article key={p.id}>
                      {src(p.photo) && <img src={src(p.photo)} alt={p.name} loading="lazy" />}
                      <h3>{p.name}</h3><span>{p.jobTitle}</span>
                      {p.bio && <div className="prose"><RichText state={p.bio} /></div>}
                    </article>
                  ))}
                </div>
              </div></section>
            )
          case 'gallery':
            return (
              <section key={k} className="section"><div className="container">
                {b.heading && <SecHead eyebrow="" title={b.heading} />}
                <div className="gallery">
                  {(b.images || []).map((g: any, j: number) => src(g.image) && (
                    <figure key={g.id || j}><img src={src(g.image)} alt={g.caption || alt(g.image)} loading="lazy" />{g.caption && <figcaption>{g.caption}</figcaption>}</figure>
                  ))}
                </div>
              </div></section>
            )
          case 'video': {
            const e = embed(String(b.url || ''))
            return e ? (
              <section key={k} className="section"><div className="container blk-narrow">
                {b.heading && <h2 className="h2">{b.heading}</h2>}
                <div className="blk-video"><iframe src={e} title={b.caption || b.heading || 'Video'} loading="lazy" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" /></div>
                {b.caption && <p className="cap">{b.caption}</p>}
              </div></section>
            ) : null
          }
          case 'downloads':
            return (
              <section key={k} className="section"><div className="container blk-narrow">
                {b.heading && <h2 className="h2">{b.heading}</h2>}
                <ul className="blk-dl">
                  {(b.files || []).map((f: any, j: number) => src(f.file) && <li key={f.id || j}><a href={src(f.file)} target="_blank" rel="noopener noreferrer">{f.label}</a></li>)}
                </ul>
              </div></section>
            )
          case 'callout':
            return (
              <section key={k} className="section"><div className="container blk-narrow">
                <div className={'blk-callout ' + (b.tone || 'info')} role="note">{b.title && <strong>{b.title}</strong>}<p>{b.text}</p></div>
              </div></section>
            )
          case 'cta':
            return (
              <section key={k} className="section bg-navy"><div className="container blk-cta">
                <h2 className="h2">{b.title}</h2>{b.text && <p>{b.text}</p>}
                <Anchor url={b.url} className="btn btn--gold">{b.label} <Arrow /></Anchor>
              </div></section>
            )
          case 'table':
            return (
              <section key={k} className="section"><div className="container">
                {b.heading && <h2 className="h2">{b.heading}</h2>}
                <div className="blk-table" tabIndex={0} role="region" aria-label={b.heading || 'Table'}>
                  <table>
                    <thead><tr>{(b.columns || []).map((c: any, j: number) => <th key={j} scope="col">{c.label}</th>)}</tr></thead>
                    <tbody>{(b.rows || []).map((r: any, j: number) => <tr key={j}>{(r.cells || []).map((c: any, m: number) => <td key={m}>{c.text}</td>)}</tr>)}</tbody>
                  </table>
                </div>
              </div></section>
            )
          default: return null
        } })()
        if (!inner) return null
        const sec = b.section || {}
        return <div key={k} className="sec-wrap" id={sec.anchor || undefined} data-bg={sec.background && sec.background !== 'default' ? sec.background : undefined} data-sp={sec.spacing && sec.spacing !== 'normal' ? sec.spacing : undefined}>{inner}</div>
      })}
    </div>
  )
}
