# Architecture

## Shape
```
Visitors → CDN/WAF → [ web container ] → PostgreSQL (managed)
Staff    → private admin hostname ↗         ↘ object storage (uploads)
                                             ↘ SMTP (mail)
```
One Next.js app serves both the public site `(site)` and the admin `(payload)`. State lives outside the container (database, object storage), so the container can be replaced at any time.

## Layers
| Path | Responsibility |
|---|---|
| `src/app/(site)` | Public pages, server actions (contact, newsletter), stats beacon, `/internal/revalidate` |
| `src/app/(payload)` | Payload admin + REST API (folder name = `ADMIN_PATH`) |
| `src/proxy.ts` | Maintenance mode, rate limits on sign-in/2FA/reset, tells the 2FA screens which page they are on |
| `src/collections`, `src/globals` | Data model, field-level access, hooks |
| `src/access` | Roles and access functions: the single source of "who may do what" |
| `src/hooks` | Four-eyes publish guard, audit log, cache refresh, media guards |
| `src/blocks`, `src/site/components/{Blocks,Parts}.tsx` | The page builder: every section of every page is editable content |
| `src/lib` | Pure, unit-tested logic (client IP, env, passwords, custom HTML/CSS, uploads, CSV, theme colours) |

## Decisions worth knowing
- **Pages are content.** Public routes render the matching `pages` document when published and fall back to the original coded page otherwise (`CmsPage`). Nothing breaks if a page is unpublished.
- **Roles, not permissions.** Five roles (admin, publisher, editor, seo, auditor). Publishing needs a *different* Publisher from the author (four-eyes), enforced in `hooks/publishGuard.ts`, tested in `scripts/test-stage.ts`.
- **Security is layered, not assumed.** 2FA mandatory (payload-totp), invite-only accounts, lockout, rate limits, audit log, upload verification (magic bytes, metadata stripping, optional ClamAV), custom HTML sanitised and CSS scoped, CSP/HSTS, GraphQL disabled.
- **Client IP is never trusted from the visitor.** `lib/clientIp.ts` reads the address our own proxy appended (`TRUSTED_PROXY_HOPS`) or one CDN-set header (`CLIENT_IP_HEADER`).
- **The admin location is configuration.** `ADMIN_PATH` + `npm run set-admin-path`; no code hardcodes `/admin` (`lib/adminRoute.ts`).
- **Database changes are migrations.** Development uses schema push; production never does. `npm run migrate:create -- <name>` writes a migration; the pipeline runs `payload migrate` before a release.
- **Pages are pre-rendered at build** from a throwaway empty database, then refreshed from the real database by `scripts/post-deploy.mjs` before traffic is switched. See RUNBOOKS → Release.

## Known limits (be aware)
- Page caching is per instance. Run **one** web instance (or add a CDN purge / shared cache handler) before scaling out; otherwise visitors may see different versions for up to the revalidate window.
- Rate limits are per instance (in memory). The CDN/WAF must also rate-limit sign-in endpoints.
- `data/maintenance.json` (maintenance switch) lives on the instance's volume.
- Stats beacon is first-party and anonymous; it is not a full analytics product.
