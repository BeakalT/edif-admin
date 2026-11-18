/**
 * The one place that decides where the admin lives.
 * Set ADMIN_PATH (e.g. "/console-x7k2") and run `npm run set-admin-path` so the route folder matches.
 * Every link, email, robots rule and rate-limit rule reads from here, so nothing hardcodes "/admin".
 */
const raw = (process.env.ADMIN_PATH || '/admin').trim()
export const ADMIN_ROUTE = '/' + raw.replace(/^\/+|\/+$/g, '')
export const adminUrl = (p = '') => `${ADMIN_ROUTE}${p ? (p.startsWith('/') ? p : '/' + p) : ''}`
