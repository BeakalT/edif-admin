# Security and standards audit (18 Nov 2026)

Not safe to put on the public internet until a password change signs every other session out, and until the deployment in front of the app is the only way to reach it (`TRUSTED_PROXY_HOPS`, already an open decision). A Publisher can also put a site-wide banner live alone, including a link off the Fund’s site. That is the impersonation path depositors are told to trust. The rest of the auth, upload, and publish controls that were fixed earlier still hold, including the uncommitted unpublish change that writes the live document back.

Reviewed committed code and `git diff HEAD`. Known open items from `LAUNCH-READINESS.md` section D are not repeated as new findings: exact-filename media downloads (G-05), proxy hop (G-10), failed authenticator codes not logged (G-11), email lockout (G-12), CI high audit not failing (G-14).

## Summary

| ID | Severity | Area | Title | Status |
|---|---|---|---|---|
| S-01 | High | Part 1, Authentication | Password change leaves other sessions valid, and refresh extends them | New |
| S-02 | Medium | Part 1, Business logic | One Publisher can publish the site-wide banner, with any https link | New |
| S-03 | Medium | Part 1, Secrets | Demo script writes known Super Admin passwords and refuses nothing in production | New |
| S-04 | Medium | Part 1, Availability | Public search runs eight uncached queries with no rate limit | New |
| S-05 | Medium | Part 1, Availability | Visit counter stores a row for any path and never deletes them | New |
| S-06 | Medium | Part 1, Data protection | Contact messages, staff IPs and emails are kept with no stated retention or privacy notice | New |
| S-07 | Medium | Part 2, Operations | The only backup script is unencrypted SQLite; production is PostgreSQL | New |
| S-08 | Hardening | Part 1, Availability | Login and form limits live in each process’s memory | New |
| S-09 | Low | Part 2, Trust | No security.txt and no privacy, terms or accessibility page | New |

## Findings

### S-01 Password change leaves other sessions valid, and refresh extends them
Severity: High
Area: Part 1, Authentication
Where: src/collections/Users.ts:144
Problem: Changing a password sets `passwordChanged`, writes an audit row and emails the user. It does not clear `sessions`. Payload’s refresh handler then finds that session and sets `expiresAt` to now plus `tokenExpiration` (2 hours) on every refresh (`node_modules/payload/dist/auth/operations/refresh.js:55`). A reset through the emailed link does clear sessions (`resetPassword.js:99`). The two-factor reset endpoint also clears them (`Users.ts:89`). The account-page password change does not.
How it is triggered / what it gives an attacker or user: Someone who has copied a staff session cookie keeps using the admin after the account holder changes the password. The warning email tells the holder to change the password. That action does not sign the other browser out. Refresh, which the admin does while someone is working, pushes the stolen session forward.
Suggested fix: In the `passwordChanged` branch, write `sessions` to an empty list, or to only the current request’s `_sid`, the same way `reset-2fa` already does. Do the same when `role` changes.

### S-02 One Publisher can publish the site-wide banner, with any https link
Severity: Medium
Area: Part 1, Business logic
Where: src/collections/Notices.ts:15
Problem: `custom.selfPublish` skips the two-person rule in `publishGuard.ts`. The collection text says a Publisher may publish a banner alone because speed matters. `linkUrl` accepts any `https` address through `validateLink`. The banner is rendered on every public page, and the current copy tells depositors that messages from the Fund are the ones to trust.
How it is triggered / what it gives an attacker or user: A Publisher whose account is misused, or a Publisher acting alone, publishes a warning such as “Confirm your deposit” with a link to an outside site. Visitors see it on the Fund’s own pages. No second person has to approve it. Editors still cannot publish it alone.
Suggested fix: Remove `selfPublish` from notices, or allow a Publisher to publish only when `linkUrl` is empty or a path on this site. Keep an urgent local-only banner as the fast path.

### S-03 Demo script writes known Super Admin passwords and refuses nothing in production
Severity: Medium
Area: Part 1, Secrets
Where: scripts/demo-users.ts:4
Problem: Six passwords are in the repository, including the Super Admin password. The script updates or creates `admin@edif-demo.test` and the other demo roles with `overrideAccess: true` and `context.seeding`. It does not check `NODE_ENV`. It does not enrol an authenticator, so the first person to sign in with that password enrols their own. Two-factor setup is forced on first login, which means the first login wins.
How it is triggered / what it gives an attacker or user: Running the script with the production `DATABASE_URL`, or restoring a database on which it was already run, leaves a Super Admin whose password is in git. The first login binds the authenticator.
Suggested fix: Make the script exit immediately unless `NODE_ENV` is development and `SITE_URL` is localhost. Delete those accounts before handover if the script has ever been pointed at a shared database. Do not rely on deleting the file alone; it is already in git history, so the accounts must not exist in production.

### S-04 Public search runs eight uncached queries with no rate limit
Severity: Medium
Area: Part 1, Availability
Where: src/app/(site)/search/page.tsx:9
Problem: `search()` in `src/lib/content.ts` runs eight `like` queries on every request and is not wrapped in the content cache. The page is `force-dynamic`. Nothing counts searches per address. Login and the contact form are limited. Search is not.
How it is triggered / what it gives an attacker or user: Repeated requests to `/search?q=aa` (any two characters) keep eight database queries busy. A single client can do this as fast as the server answers.
Suggested fix: Rate-limit `/search` in `src/proxy.ts` the same way as login, and cache identical terms for a short time.

### S-05 Visit counter stores a row for any path and never deletes them
Severity: Medium
Area: Part 1, Availability
Where: src/app/(site)/stats/hit/route.ts:19
Problem: Any `POST` with a path matching `/` plus up to 120 letters, numbers, `_`, `-` or `/` inserts a `page-views` row when that pair of day and path is new. The path does not have to be a real page. There is no unique index on `(day, path)`, no maximum number of distinct paths, and no job that deletes old rows. The per-address cap is 40 requests a minute, in memory.
How it is triggered / what it gives an attacker or user: A client posts `/stats/hit` with a new path each time (`/a1`, `/a2`, …). Each new path is a row kept forever. Enough of them slow the statistics queries and grow the database. With several source addresses the in-memory cap does not add up.
Suggested fix: Accept a path only if it is in the cached list of published paths. Add a unique index on day and path. Delete rows older than the retention period the client chooses.

### S-06 Contact messages, staff IPs and emails are kept with no stated retention or privacy notice
Severity: Medium
Area: Part 1, Data protection
Where: src/collections/Messages.ts:6
Problem: The contact form stores name, email and message with no deletion schedule. The audit log stores the staff email and client IP on sign-in (`Users.ts:18`, `Users.ts:162`). Subscriber addresses are stored when the newsletter is on. There is no privacy notice, terms page, or accessibility statement in the site. Visit counts themselves store no IP and honour Do Not Track. That part is narrower than the rest.
How it is triggered / what it gives an attacker or user: This is not a remote takeover. A person who writes to the Fund, and every staff sign-in, leaves personal data with no published period and no way for the sender to ask for deletion from the site. Ask the client’s lawyer what Ethiopia’s data-protection rules require for retention, a privacy notice, and a contact for access or deletion. This audit does not state a legal conclusion.
Suggested fix: Publish a short privacy notice that names the contact form, staff accounts, the audit log and visit counts. Add a retention job for messages and audit rows once the lawyer gives the period.

### S-07 The only backup script is unencrypted SQLite; production is PostgreSQL
Severity: Medium
Area: Part 2, Operations
Where: scripts/backup.mjs:11
Problem: `backup.mjs` exits unless `DATABASE_URL` is a SQLite file. The copy it writes is an unencrypted database file plus media, mode `0600`, on the same machine. Production is PostgreSQL. Authenticator secrets are in that database unencrypted (already recorded in `LAUNCH-READINESS.md`). There is no script in the repo that dumps PostgreSQL, encrypts the dump, or tests a restore as part of CI.
How it is triggered / what it gives an attacker or user: On the day the server or the database is lost, the operator has whatever they arranged outside this repo. Anyone who can read the backup directory can read staff password hashes, authenticator secrets, contact messages and audit IPs.
Suggested fix: Add a Postgres dump step that encrypts the output to a key held outside the server, copies it off the machine, and document one restore drill. Keep `backup.mjs` for the local demo only.

### S-08 Login and form limits live in each process’s memory
Severity: Hardening
Area: Part 1, Availability
Where: src/proxy.ts:32
Problem: The login, reset, contact and statistics limits are `Map`s inside one Node process. A second instance, or a restart, starts from empty. The file already says to rate-limit at the CDN as well.
How it is triggered / what it gives an attacker or user: With one container this does not bypass the limit. With two or more, each allows a full budget, so the intended 12 login attempts per 15 minutes becomes 12 per instance.
Suggested fix: If the launch runs a single container, record that next to `TRUSTED_PROXY_HOPS`. If it will run more than one, put the same limits on the proxy in front.

### S-09 No security.txt and no privacy, terms or accessibility page
Severity: Low
Area: Part 2, Trust
Where: src/app (no matching route)
Problem: There is no `/.well-known/security.txt`, and no public page for privacy, terms or accessibility. The contact page is the only place a visitor can write to the Fund. A researcher who finds a vulnerability has no published address that is clearly for security reports.
How it is triggered / what it gives an attacker or user: Nothing is taken over. Reports go to the general inbox, or nowhere.
Suggested fix: Add `security.txt` with a monitored address and an expiry date, and a short privacy page that matches S-06.

## Standards

| Area | Status | Where |
|---|---|---|
| Testing of access, publish guard, uploads, forms | Present | `tests/unit`, `tests/e2e/security.spec.ts`, `npm run test:payload` / `test:api`. Session revocation after a password change is untested. |
| CI: lint, types, tests, critical audit, Docker build | Present | `.github/workflows/ci.yml`. High advisories do not fail the job (known G-14). |
| Branch protection, staging, pen-test scope | Missing | Not in the repo. |
| Env validation, health, readiness | Present | `src/lib/env.ts`, `/healthz`, `/readyz` |
| Structured logging and error tracking | Partial | Payload logger only. No Sentry or equivalent. |
| Backups and a tested restore | Partial | S-07. Restore steps exist in the runbooks for the SQLite demo. |
| Migrations | Present | `src/migrations`, Docker `migrator` target runs before traffic. |
| WCAG in code: skip link, labels, reduced motion, `lang` | Present | Public layout and forms. Admin contrast tokens are set in `custom.scss`. A full WCAG audit of the admin was not re-run in the browser for this pass. |
| robots, sitemap, canonical, Open Graph, JSON-LD, 404 | Present | `src/app/robots.ts`, `src/app/sitemap.ts`, site metadata, `not-found`. |
| security.txt, privacy, terms, accessibility statement | Missing | S-09 |
| README, architecture, handbook, runbooks | Present | A new engineer can deploy, add a user, rotate `PAYLOAD_SECRET`, and restore the demo from these. Postgres backup encryption is the gap (S-07). |
| Dependency licences, font files committed under `public/fonts` | Partial | Fonts are local files. Image rights for CMS photos are an editorial question, not something the code can prove. |

## Fix before launch

- S-01. Clear other sessions when the password or the role changes.
- S-03. Confirm the demo accounts do not exist in the database that will be deployed. Guard the script.
- Known deployment step: set `TRUSTED_PROXY_HOPS` to the real proxy chain and do not let clients reach the app directly (G-10).
- S-02. Decide whether a banner may go live, and link off-site, with one Publisher. Do that before the first real warning is published.

## Fix within the first month

- S-04 and S-05. Limit search and stop the visit counter accepting arbitrary paths.
- S-06 and S-09. Privacy notice, retention, and `security.txt`, after the lawyer answers the retention question.
- S-07. Encrypted PostgreSQL backups and one restore drill.
- S-08, if more than one app instance will run.
- Known: stop serving unpublished media by exact filename (G-05). Log failed authenticator codes (G-11).

## Nice to have

- `Cache-Control: private, no-store` on the admin and `/api`.
- `Cross-Origin-Opener-Policy` and `Cross-Origin-Resource-Policy` on HTML responses.
- A read-only root filesystem on the web container, and a pinned image digest.
- An error-tracking service and an uptime check on `/readyz`.
- A shared rate-limit store even for a single instance, so a restart does not reset the login budget.

## Checked and fine

- Password rules run on change and on reset. There is no public registration. Cookies are `SameSite=Strict` and `Secure` in production unless `COOKIE_SECURE=false`. Payload’s auth cookie is HttpOnly by default. Reset links expire and clear sessions. Login is limited per address and locks after five failures.
- Collection access matches the five roles. Auditors are not in the content-writing check. Field `create` and `update` on custom HTML are Super Admin only. Notifications can be updated only by their recipient, and only `readAt` is writable. Users cannot set another person’s password.
- GraphQL is disabled. JSON-LD is escaped. Custom HTML is cleaned and CSS is scoped. Block and rich-text links go through `safeHref`. CSV export prefixes formula characters. Redirects off-site are Super Admin only.
- Uploads are limited to 20 MB, images are re-encoded, SVG and HTML are rejected, and PDFs with active content are rejected. Media listing requires a passed second factor. Exact file URLs stay public by the recorded decision.
- Contact creation is server-only, honeypot and timing checked, and does not reflect the message into email headers. The revalidate route compares the bearer token in constant time and stays off until the token is at least 32 characters. CSRF origin is the site URL.
- Production CSP is a per-request nonce with `strict-dynamic`. HSTS, `nosniff`, frame denial, Referrer-Policy and Permissions-Policy are set. `X-Powered-By` is off.
- The Docker runner uses a non-root user, tini, a healthcheck, and no secrets in the image. `NEXT_PUBLIC_` is only the newsletter on/off flag.
- Trash, restore and unpublish write the published document back, so a Publisher cannot smuggle a draft live that way. Scheduled publish still runs as the user through the guard.
- The audit log cannot be updated or deleted through access rules. Password fields are omitted from diffs. Exports of the log are limited to Admin and Auditor and are themselves logged.
