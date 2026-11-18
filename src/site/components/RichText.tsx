import type { ReactNode } from 'react'

/** Renders Lexical rich text from the CMS, keeping bold, italic, links, lists, numbered lists, quotes, headings and images. */
const safeUrl = (u?: string) => (u && /^(https?:\/\/|mailto:|tel:|\/|#)/i.test(u.trim()) ? u.trim() : '#')

function leaf(n: any, key: number): ReactNode {
  let el: ReactNode = n.text
  const f = n.format || 0
  if (f & 16) el = <code>{el}</code>
  if (f & 64) el = <sup>{el}</sup>
  if (f & 32) el = <sub>{el}</sub>
  if (f & 1) el = <strong>{el}</strong>
  if (f & 2) el = <em>{el}</em>
  if (f & 4) el = <s>{el}</s>
  if (f & 8) el = <u>{el}</u>
  return <span key={key} style={{ display: 'contents' }}>{el}</span>
}

function kids(list: any[] | undefined): ReactNode[] {
  return (list || []).map((n, i) => node(n, i))
}

function node(n: any, i: number): ReactNode {
  switch (n.type) {
    case 'text': return leaf(n, i)
    case 'linebreak': return <br key={i} />
    case 'paragraph': {
      const c = kids(n.children)
      return n.children?.length ? <p key={i}>{c}</p> : null
    }
    case 'heading': {
      const T = (['h2', 'h3', 'h4'].includes(n.tag) ? n.tag : n.tag === 'h1' ? 'h2' : 'h3') as 'h2'
      return <T key={i}>{kids(n.children)}</T>
    }
    case 'quote': return <blockquote key={i} className="quote"><p>{kids(n.children)}</p></blockquote>
    case 'list': {
      const T = n.listType === 'number' ? 'ol' : 'ul'
      return <T key={i}>{kids(n.children)}</T>
    }
    case 'listitem': return <li key={i}>{kids(n.children)}</li>
    case 'link':
    case 'autolink': {
      const u = safeUrl(n.fields?.url)
      const ext = /^https?:/i.test(u)
      return <a key={i} href={u} {...(n.fields?.newTab || ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{kids(n.children)}</a>
    }
    case 'horizontalrule': return <hr key={i} />
    case 'upload': {
      const m = n.value
      if (!m || typeof m !== 'object' || !m.url) return null
      if (m.mimeType === 'application/pdf') return <p key={i}><a className="btn btn--navy" href={m.url} target="_blank" rel="noopener noreferrer">{m.alt || m.filename}</a></p>
      return <figure key={i}><img src={m.url} alt={m.alt || ''} loading="lazy" />{n.fields?.caption ? <figcaption>{String(n.fields.caption)}</figcaption> : null}</figure>
    }
    default: return n.children ? <span key={i}>{kids(n.children)}</span> : null
  }
}

export function RichText({ state }: { state: any }) {
  if (!state?.root) return null
  return <>{kids(state.root.children)}</>
}
