import sanitizeHtml from 'sanitize-html'
import postcss from 'postcss'

/**
 * Custom sections: HTML and CSS written by a Super Admin. Neither can run code or reach other sites.
 * HTML: a short list of harmless tags. No scripts, frames, forms, inline styles or event handlers.
 * CSS: every rule is limited to its own section, fixed positioning and external files are removed.
 */
const SAFE_URL = /^(https:\/\/|mailto:|tel:|\/(?!\/)|#)/i

export function cleanHtml(html: string): string {
  return sanitizeHtml(String(html || '').slice(0, 60_000), {
    allowedTags: ['div', 'span', 'p', 'a', 'ul', 'ol', 'li', 'h2', 'h3', 'h4', 'h5', 'h6', 'img', 'figure', 'figcaption', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'strong', 'b', 'em', 'i', 'u', 'br', 'hr', 'blockquote', 'section', 'article', 'details', 'summary', 'small', 'sup', 'sub', 'code', 'pre', 'dl', 'dt', 'dd'],
    allowedAttributes: { '*': ['class', 'title', 'aria-label', 'role'], a: ['href', 'target', 'rel'], img: ['src', 'alt', 'width', 'height', 'loading'], td: ['colspan', 'rowspan'], th: ['colspan', 'rowspan', 'scope'] },
    allowedSchemes: ['https', 'mailto', 'tel'],
    allowedSchemesAppliedToAttributes: ['href', 'src'],
    allowProtocolRelative: false,
    transformTags: {
      a: (tag, attribs) => ({ tagName: 'a', attribs: { ...attribs, ...(attribs.href && /^https:/i.test(attribs.href) ? { target: '_blank', rel: 'noopener noreferrer' } : {}) } }),
      img: (tag, attribs) => ({ tagName: 'img', attribs: { ...attribs, loading: 'lazy' } }),
    },
    disallowedTagsMode: 'discard',
  })
}

const OK_AT = new Set(['media', 'keyframes'])
const BAD_VALUE = /expression\s*\(|javascript:|vbscript:|behavior\s*:|-moz-binding|@import|<\/?style|<script/i
const urlsOk = (v: string) => [...v.matchAll(/url\(\s*(['"]?)(.*?)\1\s*\)/gi)].every((m) => /^\/(?!\/)[^"')]*$/.test(m[2]) || /^data:image\/(png|jpeg|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(m[2]))

/** Returns CSS limited to `#scope`. Anything unsafe is dropped, not rewritten. */
export function scopeCss(css: string, scope: string): string {
  let root: postcss.Root
  try { root = postcss.parse(String(css || '').slice(0, 60_000)) } catch { return '' }
  const out: string[] = []
  const clean = (nodes: postcss.ChildNode[], inKeyframes = false): string => {
    let s = ''
    for (const n of nodes) {
      if (n.type === 'atrule') {
        if (!OK_AT.has(n.name.toLowerCase())) continue
        const inner = clean(n.nodes || [], n.name.toLowerCase() === 'keyframes')
        if (inner) s += `@${n.name} ${n.params.replace(BAD_VALUE, '')}{${inner}}`
        else if (!n.nodes) continue
      } else if (n.type === 'rule') {
        let sel = n.selector
        if (!inKeyframes) {
          if (BAD_VALUE.test(sel) || /[{}]/.test(sel)) continue
          sel = sel.split(',').map((x) => x.trim()).filter(Boolean).map((x) => (/^(:root|html|body)$/i.test(x) ? `#${scope}` : `#${scope} ${x.replace(/^(:root|html|body)\s+/i, '')}`)).join(',')
        }
        const decls: string[] = []
        n.walkDecls((d) => {
          const prop = d.prop.toLowerCase(), val = d.value
          if (BAD_VALUE.test(val) || BAD_VALUE.test(prop) || !urlsOk(val)) return
          if (prop === 'position' && /fixed|sticky/i.test(val)) return // no overlays that could imitate other pages
          if (prop === 'z-index' && Number(val) > 10) return
          if (/^--/.test(prop) && /[;{}]/.test(val)) return
          decls.push(`${prop}:${val}${d.important ? ' !important' : ''}`)
        })
        if (decls.length) s += `${sel}{${decls.join(';')}}`
      }
    }
    return s
  }
  out.push(clean(root.nodes))
  return out.join('')
}
