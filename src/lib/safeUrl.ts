/**
 * One rule for every link address that staff type in: a page path on this site (/about), an in-page
 * anchor (#faq), a full web address (https://… or http://…), or mailto:/tel:. Anything else
 * (javascript:, data:, protocol-relative //host, control characters) is refused when saved and
 * dropped when rendered. React already blocks javascript: links; this also covers the rest and
 * gives editors a clear message.
 */
const OK = /^(https?:\/\/[^\s/\\]|mailto:|tel:|\/(?![/\\])|#)/i
const BAD_CHARS = /[\u0000-\u001f\u007f\\]/

export const safeHref = (u?: string | null): string | undefined => {
  const v = String(u ?? '').trim()
  return v && OK.test(v) && !BAD_CHARS.test(v) ? v : undefined
}

/** A bank's website is often typed without https:// (www.example.com.et). Accept that and add the scheme. */
export const webAddress = (u?: string | null): string | undefined => {
  const v = String(u ?? '').trim()
  if (/^[a-z0-9-]+(\.[a-z0-9-]+)+(\/\S*)?$/i.test(v)) return safeHref('https://' + v)
  const s = safeHref(v)
  return s && /^https?:\/\//i.test(s) ? s : undefined
}

const MSG = 'Use a page path such as /about, or a full address starting with https://'
/** Payload field validator for link fields. */
export const validateLink = (v: unknown): true | string => (v == null || v === '' || (typeof v === 'string' && safeHref(v)) ? true : MSG)
/** Payload field validator for a website field. */
export const validateWebsite = (v: unknown): true | string => (v == null || v === '' || (typeof v === 'string' && webAddress(v)) ? true : 'Use a web address such as https://www.example.com.et')
