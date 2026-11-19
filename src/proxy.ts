import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import fs from 'fs'
import path from 'path'
import { clientIpFrom } from './lib/clientIp'
import { ADMIN_ROUTE } from './lib/adminRoute'
import { DATA_DIR } from './lib/paths'

/** Maintenance mode: the flag file is written by Site settings. The admin, the API and static files stay reachable so staff can switch it off. */
let mCache: { at: number; on: boolean; msg: string } = { at: 0, on: false, msg: '' }
const maintenance = () => {
  if (Date.now() - mCache.at < 3000) return mCache
  try {
    const j = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'maintenance.json'), 'utf8'))
    mCache = { at: Date.now(), on: !!j.enabled, msg: String(j.message || '') }
  } catch { mCache = { at: Date.now(), on: false, msg: '' } }
  return mCache
}
const esc = (t: string) => t.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string))

/**
 * 1. Tells the two-factor screens which page they are on.
 * 2. Slows down password guessing, code guessing and reset-email floods per network address.
 * Limits are kept in memory per server instance. With several instances, also rate-limit at the CDN/WAF (see RUNBOOKS).
 * The visitor address comes from lib/clientIp.ts, which does not trust headers the visitor can forge.
 */
const RULES: { test: RegExp; max: number; windowMs: number; method?: string; needs?: string }[] = [
  { test: /^\/search$/, max: 30, windowMs: 60 * 1000, method: 'GET', needs: 'q' },
  // each step has its own counter, so a sign-in (password, then code) does not use up the other budgets. A successful request is counted too (this layer cannot see the answer); the account lock and the code-attempt lock are what stop guessing.
  { test: /^\/api\/users\/login$/, max: 30, windowMs: 15 * 60 * 1000 },
  { test: /^\/api\/verify-totp$/, max: 30, windowMs: 15 * 60 * 1000 },
  { test: /^\/api\/remove-totp$/, max: 10, windowMs: 15 * 60 * 1000 },
  { test: /^\/api\/users\/recovery\/(use|codes)$/, max: 10, windowMs: 15 * 60 * 1000 },
  { test: /^\/api\/users\/(forgot-password|reset-password)$/, max: 6, windowMs: 60 * 60 * 1000 },
  { test: /^\/internal\/revalidate$/, max: 10, windowMs: 15 * 60 * 1000 },
]
const hits = new Map<string, number[]>()

const ipOf = (req: NextRequest) => clientIpFrom((n) => req.headers.get(n))

/**
 * Content Security Policy with a fresh nonce on every request. Next.js reads the nonce from the request's
 * CSP header and stamps it on its own scripts, so only scripts the server sent can run: an injected
 * <script> or inline handler is refused by the browser even if it reaches the page. Styles keep
 * 'unsafe-inline' (the admin and React style attributes need it; inline CSS cannot run code).
 * Production only: the development server needs eval for React's debugging tools.
 */
const isProd = process.env.NODE_ENV === 'production'
const cspFor = (nonce: string) => [
  "default-src 'self'",
  "img-src 'self' data: blob:",
  "style-src 'self' 'unsafe-inline'",
  `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
  "font-src 'self' data:",
  'frame-src https://www.youtube-nocookie.com https://player.vimeo.com',
  "connect-src 'self'",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join('; ')

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (!new RegExp(`^(${ADMIN_ROUTE}|/api|/_next|/images|/fonts|/media|/stats|/healthz|/readyz|/internal|/account-recovery)(/|$)`).test(pathname)) {
    const m = maintenance()
    if (m.on) {
      const body = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Back soon | Ethiopian Deposit Insurance Fund</title><style>body{font-family:system-ui,sans-serif;background:#1E3570;color:#fff;min-height:100vh;display:grid;place-items:center;margin:0;text-align:center;padding:24px}main{max-width:560px}h1{margin:0 0 12px}p{line-height:1.6;opacity:.9}</style></head><body><main><h1>We will be back soon</h1><p>${esc(m.msg || 'The website is being updated. Please try again shortly.')}</p><p>Ethiopian Deposit Insurance Fund</p></main></body></html>`
      return new NextResponse(body, { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Retry-After': '1800', 'Cache-Control': 'no-store', ...(isProd ? { 'Content-Security-Policy': cspFor(btoa(crypto.randomUUID())) } : {}) } })
    }
  }
  {
    const rule = RULES.find((r) => r.test.test(pathname) && (r.method || 'POST') === req.method && (!r.needs || req.nextUrl.searchParams.has(r.needs)))
    if (rule) {
      const key = `${rule.test.source}|${ipOf(req)}`
      const now = Date.now()
      const recent = (hits.get(key) || []).filter((t) => now - t < rule.windowMs)
      recent.push(now)
      hits.set(key, recent)
      if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < 3600_000)) hits.delete(k)
      if (recent.length > rule.max) {
        const retry = Math.ceil((rule.windowMs - (now - recent[0])) / 1000)
        return NextResponse.json({ errors: [{ message: 'Too many attempts. Please wait a while and try again.' }] }, { status: 429, headers: { 'Retry-After': String(retry) } })
      }
    }
  }
  if (!isProd) {
    const res = NextResponse.next()
    if (new RegExp(`^(${ADMIN_ROUTE}|/api)(/|$)`).test(pathname)) res.headers.append('x-pathname', pathname)
    return res
  }
  const nonce = btoa(crypto.randomUUID())
  const csp = cspFor(nonce)
  const requestHeaders = new Headers(req.headers)
  requestHeaders.set('x-nonce', nonce)
  requestHeaders.set('Content-Security-Policy', csp)
  const res = NextResponse.next({ request: { headers: requestHeaders } })
  res.headers.set('Content-Security-Policy', csp)
  if (new RegExp(`^(${ADMIN_ROUTE}|/api)(/|$)`).test(pathname)) res.headers.append('x-pathname', pathname)
  return res
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] }
