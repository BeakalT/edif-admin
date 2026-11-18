# EDIF admin and website — independent review

Review only. No application files were changed. Findings are limited to issues with a concrete exploit or failure path. Next.js 16 and Payload 3 behaviour cited below was checked against `node_modules/next` and `node_modules/payload` (3.93.0), and the TOTP plugin against `node_modules/payload-totp`.

| ID | Severity | Title | File |
|---|---|---|---|
| G-01 | High | Password session is treated as fully signed in before two-factor | `src/app/(site)/preview/[collection]/[id]/page.tsx` |
| G-02 | High | One Publisher can change live content without a second reviewer | `src/hooks/publishGuard.ts` |
| G-03 | High | Site settings break out of the homepage JSON-LD script | `src/app/(site)/page.tsx` |
| G-04 | High | Staff-controlled URLs are written into links with no scheme check | `src/site/components/Layout.tsx` |
| G-05 | High | Every upload is listable and downloadable without signing in | `src/collections/Media.ts` |
| G-06 | Medium | Custom HTML and CSS can be set by anyone who can create a page | `src/blocks/index.ts` |
| G-07 | Medium | SEO Manager can rewrite news articles | `src/collections/News.ts` |
| G-08 | Medium | Any Editor can publish an open redirect | `src/collections/Redirects.ts` |
| G-09 | Medium | PDFs keep active content, and uploads have no size cap | `src/lib/uploadSafety.ts` |
| G-10 | Medium | Visitor address used for rate limits can be chosen by the client | `src/lib/clientIp.ts` |
| G-11 | Medium | Password reset and two-factor results are missing from the audit log | `src/hooks/audit.ts` |
| G-12 | Medium | Knowing a staff email is enough to lock that account out | `src/collections/Users.ts` |
| G-13 | Medium | Rehearsal stack exposes mail and object storage with fixed passwords | `docker-compose.yml` |
| G-14 | Low | High dependency advisories do not fail CI | `.github/workflows/ci.yml` |

### G-01 — Password session is treated as fully signed in before two-factor
Severity: High
Status: Confirmed
Category: Auth
Location: `src/app/(site)/preview/[collection]/[id]/page.tsx:21-23`, `src/components/admin/Dashboard.tsx:27-48`, `node_modules/payload/dist/auth/executeAuthStrategies.js:27-29`, `node_modules/payload-totp/dist/strategy.js:10-13`, `node_modules/payload-totp/dist/index.js:44-50`
Problem: Two-factor is enforced by wrapping Payload access checks, and that wrapper only runs after a strategy has already returned a user. The TOTP strategy returns no user when the `payload-totp` cookie is absent, so Payload falls through to the normal session cookie, which is issued at password login, before the code is entered. Preview and the admin dashboard never look at `_strategy`. Preview then loads the draft with access overrides. The dashboard does the same for the review queue, draft titles, audit rows and SEO checks. The plugin itself notes that the dashboard renders on the password session, before the redirect to the verify screen.
Exploit or failure scenario: As an Editor who knows the password but not the authenticator, POST `/api/users/login` and do not call `/api/verify-totp`. GET `/preview/tenders/1` (and the other ids) returns the latest draft, including unpublished procurement text. GET the admin home in the same session and the dashboard HTML includes draft titles, review notes and, for an admin or auditor password, the latest audit-log rows. Collection REST calls such as `/api/news` stay blocked by `totpAccess`; these two paths do not.
Suggested fix: In preview, reject the request unless `user._strategy` is `totp` (or `api-key` if that strategy is ever enabled). Pass the same check into the dashboard and stop using `overrideAccess` there, or skip `beforeDashboard` until the TOTP cookie is present.

### G-02 — One Publisher can change live content without a second reviewer
Severity: High
Status: Confirmed
Category: Workflow
Location: `src/hooks/publishGuard.ts:54-58`, `src/hooks/publishGuard.ts:66-96`
Problem: The two-person rule is skipped in two cases, and both still save whatever other fields were in the request. Moving an item into the trash or restoring it returns immediately after the Publisher check, so content fields in that same body are not compared and `lastEditor` is left unchanged. Unpublishing (`_status: "draft"` on a live document, without `draft=true`) also skips the comparison and does not record the Publisher as the last editor. A later publish by that same Publisher then sees a different `lastEditor` and no content diff in the publish body, so it is allowed. Super Admin bypass of the two-person rule is intentional and is not this finding. Notices are marked `selfPublish` on purpose and are not this finding either.
Exploit or failure scenario: Sign in as a Publisher who is not the `lastEditor` of a published news article (the usual case: an Editor wrote it). PATCH `/api/news/{id}` with `{ "_status": "draft", "title": "Replacement title", "summary": "Replacement text" }` and no `draft=true`. The hook returns that data. PATCH the same id with `{ "_status": "published" }`. The article goes live with the Publisher’s text and no second Publisher. The same Publisher can instead PATCH `{ "deletedAt": "<now>", "title": "Replacement" }` and then PATCH `{ "deletedAt": null }`; the early return on lines 56–58 never runs the own-work check. An Editor cannot do this: `canPublish` still rejects them.
Suggested fix: Do not return early. On trash, restore and unpublish, reject the request when any non-meta field differs from the stored document, or run the same `changedContent` / `lastEditor` checks used for publish. Set `lastEditor` whenever content is written.

### G-03 — Site settings break out of the homepage JSON-LD script
Severity: High
Status: Confirmed
Category: XSS
Location: `src/app/(site)/page.tsx:9-16`, `src/globals/SiteSettings.ts:13-27`, `next.config.ts:11`
Problem: The homepage puts the contact address and first phone number into a `<script type="application/ld+json">` block via `JSON.stringify`. That helper does not escape `<`, so a value containing `</script>` closes the tag and the following markup is parsed as HTML. Site settings are editable by a Super Admin, a Publisher or an SEO Manager, with no second approval. The production Content-Security-Policy allows `'unsafe-inline'` scripts, so the injected script runs. The public site and the admin share one origin, and a same-origin fetch from that script sends the staff session cookie.
Exploit or failure scenario: As an SEO Manager, update Site settings and set the first address line to `</script><script>fetch('/api/users',{credentials:'include'}).then(r=>r.text()).then(t=>document.title=t.slice(0,20))</script>`. Open `/` while a Super Admin is logged in (or trick them into opening the homepage). The script runs in their session. `connect-src 'self'` blocks sending the response to another host, but the script can still call the admin API as that Super Admin, including changing another user’s role, because the role field allows updates from an admin session and the request’s Origin is this site.
Suggested fix: Inject JSON-LD with `<` escaped as `\u003c` (and also `>` and `&`), or render it through a small helper that does that. Remove `'unsafe-inline'` from `script-src` and use a nonce. Keep contact details out of raw HTML.

### G-04 — Staff-controlled URLs are written into links with no scheme check
Severity: High
Status: Confirmed
Category: XSS
Location: `src/site/components/Layout.tsx:67`, `src/site/pages/Other.tsx:138-139`, `src/site/components/sections.tsx:181`, `src/site/pages/Members.tsx:142`, `src/collections/Notices.ts:19-20`, `src/collections/News.ts:32-33`, `src/collections/Publications.ts:24`, `src/collections/Members.ts:24`, `src/globals/Navigation.ts:8`
Problem: Several public links use the stored string as `href` directly. `javascript:` is a script URL, and `script-src 'unsafe-inline'` does not block it. Block links that go through `safe()` in `Blocks.tsx` are checked; these fields are not. Notices can be published by one Publisher (`selfPublish`). News, publications and members need a Publisher to approve, but nothing in the field or the renderer rejects a non-web scheme. Navigation URLs that are not `http(s)` are passed to the client router as the link target.
Exploit or failure scenario: As a Publisher, create a notice with link text “Details” and link address `javascript:fetch('/api/users',{credentials:'include'})` and publish it (one Publisher is enough). The banner is on every page; the next staff member who clicks it runs that script in the site origin. The same string in a news “Source link” or “PDF link”, a publication external URL, or a member website, published through the normal review, does the same on that page. CSV import of members does not check `website` either, so the value can arrive as a draft and then be published.
Suggested fix: Use one allow-list (`https:`, same-site paths, and `mailto:` / `tel:` only where that is the field’s job) and apply it in the collection validate hook and again at render. Reject `javascript:`, `data:` and protocol-relative URLs.

### G-05 — Every upload is listable and downloadable without signing in
Severity: High
Status: Confirmed
Category: Upload
Location: `src/collections/Media.ts:12-21`, `node_modules/payload-totp/dist/index.js:36-38`
Problem: Media `read` is public, and the collection opts that operation out of the two-factor wrapper. There is no draft or approval state on files. An Editor, Publisher, SEO Manager or Super Admin can upload a PDF and it is world-readable immediately, including tender packs that are not published yet. Anonymous clients can list the collection, so the filename does not have to be guessed.
Exploit or failure scenario: Sign in as an Editor and upload `bid-prices.pdf` on a tender that is still a draft. From a browser with no session, GET `/api/media?limit=100`. The response includes `bid-prices.pdf` and its file URL. Download that URL. The same list includes every other image and PDF staff have uploaded.
Suggested fix: Keep `read` public only for files that are referenced by a published document, or serve uploads through a route that checks that. Do not allow unauthenticated `find` on the whole collection. Leave `disableAccessWrapper` off for any operation that is not meant to be anonymous.

### G-06 — Custom HTML and CSS can be set by anyone who can create a page
Severity: Medium
Status: Confirmed
Category: Authorization
Location: `src/blocks/index.ts:16`, `src/blocks/index.ts:83-84`, `src/collections/Pages.ts:20-22`, `node_modules/payload/dist/fields/hooks/beforeValidate/promise.js:221-232`
Problem: The custom HTML and CSS fields set `access.update` to Super Admin only. They do not set `access.create`. Payload only enforces field access when that function exists, so on create the fields are accepted from any role that can create a page (Editor, Publisher, Super Admin). On update, a non-admin’s values are stripped. The save hook runs `cleanHtml`, so a script tag in that HTML is removed before it is stored, and public CSS is scoped again at render. This is a break of the “Super Admin only” rule, not a direct script injection, as long as those cleaners stay in place. The CSS check on save also keeps the original stylesheet when any rule survives `scopeCss`; it does not store the scoped result.
Exploit or failure scenario: As an Editor, POST `/api/pages` with a `custom` block whose `html` is a layout and whose `css` is `a{color:red} .evil{position:fixed}`. The create succeeds, `position:fixed` is still in the stored CSS, and the safe rule is what makes the save pass. A Publisher who publishes the page puts that section on the public site. The Editor cannot change the HTML later, but they do not need to.
Suggested fix: Set `create` on both fields to the same Super Admin check as `update`. On save, persist the return value of `scopeCss`, not the original text.

### G-07 — SEO Manager can rewrite news articles
Severity: Medium
Status: Confirmed
Category: Authorization
Location: `src/collections/News.ts:14-33`, `src/fields/seo.ts:16-26`
Problem: News `update` includes the SEO Manager role so they can edit search fields. Field access then blocks them from `title` and `slug` only. `summary`, `body`, `kind`, `date`, `image`, `gallery`, `externalPdf` and `sourceUrl` have no field access, so an SEO Manager can change them. They still cannot publish (`guardPublish` requires a Publisher). The SEO group itself is correctly limited. The result is that a role meant for search settings can replace the article text in the draft that a Publisher is asked to approve.
Exploit or failure scenario: As an SEO Manager, PATCH `/api/news/{id}?draft=true` with a new `summary` and `body`. The save succeeds and `lastEditor` becomes that SEO Manager. A Publisher who publishes the draft puts the rewritten article on the public site. The same request with `_status: "published"` is rejected.
Suggested fix: Remove `seo` from the collection `update` access and rely on the field access already set inside `seoField`. If SEO Managers must open the document, allow update only on the `seo` group.

### G-08 — Any Editor can publish an open redirect
Severity: Medium
Status: Confirmed
Category: Endpoint
Location: `src/collections/Redirects.ts:10-16`, `src/app/(site)/[...slug]/page.tsx:32-33`, `src/access/index.ts:26`
Problem: Redirects have no draft or approval step. Create access uses `seoFieldAccess`, which includes Editors as well as SEO Managers, Publishers and Super Admins. `to` is accepted when it starts with `/` or `https://`, so any external host is allowed, and so is a protocol-relative value such as `//evil.example` because it starts with `/`. The catch-all page passes `to` straight to Next.js `redirect` / `permanentRedirect`, which send that string as the redirect target.
Exploit or failure scenario: As an Editor, POST `/api/redirects` with `{ "from": "/deposit-protection-old", "to": "https://evil.example/login", "permanent": true }`. A visitor who opens `https://<site>/deposit-protection-old` is sent to the attacker’s site under a 301 from the Fund’s domain. `{ "to": "//evil.example" }` is accepted by the same check. `javascript:` is rejected by the validator and is not this issue.
Suggested fix: Allow external targets only for `https` URLs on an explicit host list, or require a Publisher for any `to` that is not a same-site path. Reject a second slash after the first (`//`), backslashes, and embedded credentials. Keep the approval skip only for path-to-path redirects if that is still the intended workflow.

### G-09 — PDFs keep active content, and uploads have no size cap
Severity: Medium
Status: Confirmed
Category: Upload
Location: `src/lib/uploadSafety.ts:37-56`, `src/collections/Media.ts:22-28`
Problem: Images are re-encoded with sharp, which drops embedded payloads. PDFs are not. The sanitiser clears the info dictionary and the catalog Metadata entry, then saves with pdf-lib, which keeps `/OpenAction`, `/AA`, `/JS`, `/JavaScript`, `/Launch` and embedded files. Those files are public (G-05). Browser viewers usually ignore PDF JavaScript; Acrobat and other desktop viewers do not. There is also no `filesize` (or equivalent) limit on the upload config, and `sanitizeUpload` reads the whole buffer before sharp or pdf-lib runs.
Exploit or failure scenario: As an Editor, upload a PDF whose catalog `/OpenAction` runs JavaScript, with a valid `%PDF-` header and `Content-Type: application/pdf`. The upload is accepted. A reader who opens the public file URL in Acrobat runs that script. Separately, upload a multi-gigabyte file that matches a JPEG or PDF signature; the process holds the whole buffer and runs sharp or pdf-lib on it, which can exhaust memory on the container.
Suggested fix: Reject PDFs that contain actions, JavaScript, launch actions or embedded files (or flatten them through a renderer that cannot keep those). Set an explicit upload limit (for example 10 MB for images and 20 MB for PDFs) in the collection and in the server body limit.

### G-10 — Visitor address used for rate limits can be chosen by the client
Severity: Medium
Status: Confirmed
Category: Endpoint
Location: `src/lib/clientIp.ts:12-24`, `src/proxy.ts:27-57`, `src/app/(site)/actions.ts:14-32`, `src/app/(site)/stats/hit/route.ts:11-15`, `docker-compose.yml:10-14`, `.env.example:14-15`
Problem: The default is to trust one hop of `X-Forwarded-For`. That is correct only when a proxy the app does not share with the client appends the real address and strips incoming forwarding headers. The shipped compose file publishes the app on port 3000 with no proxy in front, while `.env.example` still sets `TRUSTED_PROXY_HOPS=1`. In that layout the single `X-Forwarded-For` value is the client’s. If that header is missing, the code trusts `X-Real-IP`, which the client can also send unless a proxy removes it. Those addresses are the keys for the login, password-reset, contact, newsletter and page-view limiters. The page-view limiter also calls `recent.clear()` once it has more than 5000 keys, which drops every other visitor’s count. Per-account password and TOTP lockouts do not use this address, so this does not by itself unlock brute force of a password or a six-digit code.
Exploit or failure scenario: Against the compose stack (or any deploy that is reached directly with the default hop count), send the contact form or `/api/users/forgot-password` with a new `X-Forwarded-For` on each request. The per-address caps (5 contact submissions per hour, 6 reset emails per hour) never trip. Flood `/stats/hit` with 5001 distinct forged addresses and the in-memory map is wiped, so the 40-per-minute cap resets.
Suggested fix: Default `TRUSTED_PROXY_HOPS` to `0`. Trust `X-Real-IP` only when it is the configured CDN header, not as a fallback. Set the hop count in production to the number of proxies that append and that strip client-supplied forwarding headers. Cap the stats map by dropping the oldest keys, not by clearing it.

### G-11 — Password reset and two-factor results are missing from the audit log
Severity: Medium
Status: Confirmed
Category: Audit
Location: `src/hooks/audit.ts:8-8`, `src/hooks/audit.ts:41-52`, `src/collections/Users.ts:96-102`, `src/collections/Users.ts:143-146`
Problem: The audit diff skips `password`, `hash`, `salt` and the reset-token fields. After a password change, if nothing else differs, `auditChange` returns without writing a row. The “password was changed” email is only queued when `beforeValidate` sees an `update` with a password string. Payload’s `resetPassword` operation is not an `update`, so a completed reset link is neither audited nor covered by that email. `afterLogin` writes a `login` row when the password is accepted, which is before the TOTP code is checked, and the verify endpoint does not write its own success or failure. Failed TOTP guesses are therefore invisible unless they later lock the account. The log itself cannot be edited or deleted through access rules; the gap is missing events, not mutable rows.
Exploit or failure scenario: Request a reset for a staff user and open the link (or steal it from mail). Set a new password that passes `checkPassword`. The audit log has no row for the reset. The account owner does not get the “your password was changed” mail from `afterChange`, because `passwordChanged` was never set. Separately, a correct password and a wrong authenticator code produce a `login` row and no failed-second-factor row, so the log reads as a successful sign-in.
Suggested fix: In `beforeOperation` for `resetPassword`, write a security audit row and send the same notification as a password change, after the policy check succeeds. Write the login audit row only from the TOTP verify (and setup) success path, and write a security row on a rejected code.

### G-12 — Knowing a staff email is enough to lock that account out
Severity: Medium
Status: Confirmed
Category: Auth
Location: `src/collections/Users.ts:57-59`, `src/collections/Users.ts:155-168`, `src/proxy.ts:27-28`
Problem: Five bad passwords lock the account for 15 minutes. Unlock is Super Admin only. The per-address limit on login is 12 attempts per 15 minutes, so one address can lock two accounts in that window, and G-10 removes that cap when the client can forge the forwarding header. There is no CAPTCHA and no delay that survives a new address. A locked Super Admin cannot unlock themselves until the timer ends; if every Super Admin is locked, nobody can unlock anyone else. The user is emailed and the audit log records the lock, which is useful after the fact and does not stop the lockout.
Exploit or failure scenario: POST `/api/users/login` five times for `ediinfo@edif.gov.et` (the address published on the site) or for any other staff address, with any password. Payload returns the locked-account error and the real user cannot sign in for 15 minutes. Repeat. With a new `X-Forwarded-For` per the conditions in G-10, do this for every staff address in parallel. Two-factor does not help: the lock happens at the password step.
Suggested fix: Keep the lock, and add a per-account backoff that does not depend on the client address. Let a still-valid session, or a second enrolled Super Admin, stay usable, and alert on lockout without making the lock the only control. A CAPTCHA or proof-of-work on login after the first failure stops the cheap loop.

### G-13 — Rehearsal stack exposes mail and object storage with fixed passwords
Severity: Medium
Status: Confirmed
Category: Config
Location: `docker-compose.yml:23-37`, `src/lib/mailer.ts:27-31`
Problem: The compose file is marked as rehearsal, and it is also the production-like stack in the repo. Postgres, MinIO and Mailpit use passwords baked into the file (`change-me-locally`). Postgres is not published to the host. MinIO’s console is published on 9001, and Mailpit’s UI is published on 8025 with no authentication. Mailpit receives password-reset and invitation messages whenever SMTP is pointed at it. The mailer sets TLS only when the port is 465 and does not set `requireTLS`, so a 587 server that does not offer STARTTLS is used in clear text.
Exploit or failure scenario: Run `docker compose up` on a host that is not only localhost. Open `http://<host>:8025` and read the latest “[EDIF Admin] Set your password” message, including the reset link, with no credentials. Open the MinIO console on port 9001 with `edifminio` / `change-me-locally` and read uploaded PDFs. On a network path to SMTP, a server that skips STARTTLS delivers the same reset link in clear text because the transport does not require TLS.
Suggested fix: Do not publish Mailpit or the MinIO console except on a loopback interface. Read their passwords from the env file, not from the compose file. Set `requireTLS: true` for any port other than 465, and keep `secure: true` for 465.

### G-14 — High dependency advisories do not fail CI
Severity: Low
Status: Confirmed
Category: Dependency
Location: `.github/workflows/ci.yml:37-40`, `package.json:31-51`
Problem: The security job fails the build on critical production advisories and then runs the high check with `|| true`, so a high advisory never fails the job. From the manifests alone, this review did not identify a specific known-vulnerable version: runtime dependencies are pinned at Payload and Next 16.4.1-era releases (`payload` 3.93.0, `next` 16.4.1, `nodemailer` ^10.5.0, `sanitize-html` ^2.18.2, `pdf-lib` ^1.17.1, `sharp` 0.35.5). GraphQL is disabled in `payload.config.ts`, so the `graphql` package is not exposed as an API. No advisory was invented beyond what those files show.
Exploit or failure scenario: A high advisory is published against one of the production dependencies. `npm audit --omit=dev --audit-level=high` exits non-zero, the `|| true` swallows it, and the pull request stays green. The image is built from that lockfile.
Suggested fix: Fail the job on high production advisories, with a written exception list for anything Payload has not patched yet, instead of ignoring the whole level.

## Areas checked with no issues

- Authentication and 2FA: No public registration (`Users` create is Super Admin only). Password rules run on change and on `resetPassword` (length, mix, blocklist, name and email). Cookies are `SameSite=Strict` and `Secure` in production unless `COOKIE_SECURE=false` is set on purpose. The TOTP plugin forces enrolment, locks code guessing per user after five tries, and wraps collection and global access so a password-only session cannot use the REST API. API keys are not enabled on the user collection. The holes are the custom preview route and the dashboard, covered in G-01, not the plugin wrapper.
- Authorization and role escalation: `role` cannot be created or updated except by a Super Admin. A signed-in user can update only their own user row. `lastLoginAt` and `lastLoginIp` cannot be written. `totpSecret` is not readable. Auditor is not in `canWriteContent`, cannot update site settings, navigation, theme, redirects or SEO pages, and cannot create or update messages, subscribers or page-view counts. Auditor can update their own profile and delete their own notifications. The SEO-on-news gap is G-07.
- Approval workflow: Editors cannot set `_status: "published"`; `guardPublish` rejects them before the self-publish and unpublish shortcuts. Import endpoints save `_status: "draft"` with `draft: true` and `overrideAccess: false`. `payload-jobs` access is deny-all, so an Editor cannot queue `schedulePublish` directly. The scheduled job updates as the user who scheduled it, so the guard still runs. Restoring a version goes through `beforeChange`, so the guard runs there too. GraphQL is disabled. The bypass that remains is the unpublish and trash path in G-02. Notices skip the second reviewer on purpose.
- Custom HTML/CSS and XSS: `cleanHtml` allows a short tag list and drops scripts, event handlers and inline style. `scopeCss` drops imports, `expression`, external `url()`, fixed and sticky positioning, and style or script breakouts, and the public renderer uses it. Theme CSS is only emitted for values that pass the hex check, and fonts are a fixed set. Rich text is rendered as React nodes, and link URLs there go through `safeUrl`. Block links use `safe()`. The homepage JSON-LD and the unsanitised `href`s are G-03 and G-04, not a failure of those cleaners.
- Uploads and media: JPEG, PNG, WebP, AVIF and PDF are identified from magic bytes, and the declared type must match. SVG and HTML are not in the allow-list. Images are re-encoded, which strips EXIF. If ClamAV is configured and unreachable, the upload is refused. The gaps are public listing (G-05), leftover PDF actions, and no size cap (G-09).
- Public endpoints and forms: `/internal/revalidate` stays 404 until the token is at least 32 characters and compares it with `timingSafeEqual`. Preview is limited to five collections but does not require two-factor (G-01). Contact and newsletter actions are rate limited, the contact form has a honeypot, and newsletter subscribe returns the same answer whether or not the address exists; the confirm token is 48 hex characters. Search uses bound `like` queries and only published documents. Page-view paths are restricted to a short public-path pattern. IP spoofing of those limits is G-10.
- Audit log integrity: `audit-log` create, update and delete access are all denied, and writes use `overrideAccess` inside the same request as the change. Login, logout, publish, role change, lockout and export write rows. Secrets are omitted from diffs. Missing reset and second-factor events are G-11.
- Config, headers and secrets: Production refuses an empty or short `PAYLOAD_SECRET`, a non-https `SITE_URL`, and a missing SMTP host. Database schema push is off for production Postgres. Security headers include `nosniff`, `SAMEORIGIN`, Referrer-Policy, Permissions-Policy and HSTS. CORS and CSRF are limited to `SITE_URL`. The admin route is configurable and sends `X-Robots-Tag` without putting a custom path in `robots.txt`. The image runs as a non-root user with a dropped capability set and a read-only root filesystem. The compose passwords and Mailpit port are G-13. CSP `'unsafe-inline'` is what lets G-03 and G-04 run; it is called out there rather than as a separate defect.
- Dependencies: Versions in `package.json` are current for this tree (Payload 3.93.0, Next 16.4.1). No specific high or critical advisory was visible from the manifests alone, and `npm audit` was not run. The CI waiver for high advisories is G-14.
- Logic, accessibility and performance: No further defect rose to the level of the items above. Scheduled publish and version restore stay inside the guard. Maintenance HTML is escaped. The contact and newsletter flows fail closed when the feature is off.
