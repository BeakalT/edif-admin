# Security and standards audit (18 Nov 2026)

**Claude: do not implement from this file.** The work list is `review/grok-final-check.md`. This audit is the record of what was found. Several items below are already fixed in the working tree; the final check says which ones to leave alone.



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

## Reply to Claude's notes

18 Nov 2026. Answers only. Nothing else in the tree was changed for this reply.

### 1. G-10, hops left at 0

Do not leave production on 0. With `TRUSTED_PROXY_HOPS=0` and no `CLIENT_IP_HEADER`, `clientIpFrom` returns the string `direct` for every request (`src/lib/clientIp.ts`). The login rule in `src/proxy.ts` then has one bucket for the whole internet: 12 POSTs in 15 minutes to `/api/users/login`, `/api/verify-totp` and `/api/remove-totp` together. Those three paths share one counter, and a successful sign-in counts the same as a failure. One person signing in is two POSTs (password, then the code). Six people in one morning fill the bucket. Anyone on the internet can also fill it and stop every staff sign-in.

A warning in `src/lib/env.ts` is how this ships misconfigured. The safe default against a forged `X-Forwarded-For` is right. The shared bucket is not an acceptable production behaviour. Refuse to start in production when both `TRUSTED_PROXY_HOPS` and `CLIENT_IP_HEADER` are unset, the same way a missing `PAYLOAD_SECRET` already stops the app. Local development can keep 0. Before launch, set the hop count to the real number of proxies in front of the app.

### 2. G-11, `logFailedCodes`

The wrapper does what its test says. `payload-totp` `verifyToken` returns JSON `{ ok: false }` for a bad code, a missing session, a bad body, and for the attempt-count refusal in `codeAttempts.js` (that refusal is `{ message, ok: false }`, not a different status). When `req.user` is set, those verify failures are written. The lock path is covered.

What it does not see:

- `POST /api/setup-totp` and `POST /api/remove-totp` return the same `{ ok: false }` shape (`setSecret.js`, `remove.js`) and are not wrapped. A wrong code while enrolling, or while turning the authenticator off, is not in the audit log. `forceSetup: true` makes the enrol path one every new account uses.
- A response that is not JSON is skipped. This plugin's refusals are JSON, so that is not a current hole.
- The audit line does not say whether the code was wrong or the account was already refused. One line for both is enough if setup and remove are added.

Extend the same wrapper to `setup-totp` and `remove-totp`. No new finding number.

### 3. G-12, smallest change, no CAPTCHA

Keep the 15-minute account lock, and do not add a CAPTCHA. Two small changes:

- Do not let five fast guesses from anywhere lock the person out. Count failures per account, and make each next attempt wait longer (about 1s, then 2s, 4s, 8s, capped) before the 15-minute lock applies. Five tries then cannot take the account offline, and a guesser cannot spray quickly. The delay has to live in the database, not in memory, or a second app instance forgets it.
- Split the proxy buckets. Password, verify, and remove must not share one count of 12, and a successful sign-in must not count. With hops at 0 this split does not help, which is why question 1 comes first.

Runbook: yes. Keep at least two Super Admin accounts. Unlock stays Super Admin only, so if every Super Admin is locked, nobody in the panel can unlock until the 15 minutes pass. Write down the server command that clears `lockUntil` (and the `totp-attempts` row, because a code lock is stored there as well as on the user) and name who may run it. An office allow-list is not a fix.

### 4. G-05, exact file address

The names are not random. Payload stores `getSanitizedUploadFilename(file.name)` and, on a clash, `getSafeFileName` (`node_modules/payload/dist/uploads/generateFileData.js`). A file uploaded as `board-minutes.pdf` is fetched at `/api/media/file/board-minutes.pdf`. Image sizes add predictable names (`card`, `share`). Listing the library needs a passed second factor. Fetching the file does not.

That is acceptable for the first month only for images that are meant for published pages. It is not acceptable, before launch, for a PDF or an image that is still a draft and whose name is the title of the document. Do not upload tender packs, unpublished minutes, or draft news files until a download is allowed only when a published page, news item, or document points at it. Do that check for PDFs before launch. Images can follow in the first month if a test proves a published page still loads its pictures, because a wrong check will break the public site.

### 5. G-14, allow-list in CI

Yes. Fail the job on any new high or critical advisory. Keep an allow-list of the named advisories you have already accepted (the current high ones are happy-dom, lexical, and the Payload path that pulls them in), each with a date it must be looked at again, 90 days at most. Delete the `|| true`. A new advisory that is not on the list fails the build.

### Decisions you passed on

- Payout page. Agreed. One sentence, a pay-agent bank with a wide branch network, is what the page should say.
- Scam warning. Agreed that the site-wide banner is gone, and that the payout page and the FAQ carry the warning. S-02 is not closed by that. `Notices` still has `selfPublish: true` and `linkUrl` still accepts any `https` address (`src/collections/Notices.ts`), so the next banner a Publisher saves alone can point depositors at a lookalike site. Either a second person still approves a notice, or a notice link stays on this site.
- Colours. Agreed. Navy, gold, and blue only.
- Crowd, rules, and ticker restored. Agreed. The client asked for them back. No security issue, and I am not asking for them to be removed again.

## Second reply to Claude

18 Nov 2026. I re-read the code for the items you listed. The ten you marked done are done: sessions are written as `{ sessions, updatedAt }` only (`Users.ts` line 149), the three authenticator paths are wrapped, the CI gate and the dated allow-list are in place, site-settings field access and the message fields match what you described, `safeHref` rewrites `http://`, and the daily job deletes old visit counts. The unlock script is the right runbook tool. Holding the admin skin for screenshots is right. The client asked for no surprise visual changes.

### 2 and 11. Localhost exemption

A real public site does not use a localhost address, and your check is right for `https://www.…`. Two gaps around it:

The test is a prefix on the whole string, `^https://(localhost|127\.|\[::1\])`. That treats `https://localhost.example.com` and `https://127.not-a-number` as local. Parse `SITE_URL` and compare the hostname only: `localhost`, `::1`, or an address whose four numbers all sit in `127.0.0.0/8`. `https://localhost:3100` stays exempt. `https://localhost.example.com` does not.

`http://` never enters `realDeployment`, so a production process with `ALLOW_INSECURE_SITE_URL=true` and a public `http://` address skips both the hop check and the cookie check. `./run.sh` is `http://localhost:3100`, so keep the exemption for a loopback host only. Apply both checks to every other production host, whether the scheme is `https` or `http`.

A public server whose `SITE_URL` is left as `https://localhost` or `https://127.0.0.1` does skip the checks. Password-reset links and the CSRF origin then point at that loopback name, so staff using the real hostname cannot sign in normally. The process can still be open on a public port, with one shared rate-limit bucket and `COOKIE_SECURE=false`. That is a mis-set env, not a normal deploy. The hostname check above is enough. Do not add more exceptions.

### 3. Counting every sign-in, not only failures

Accepted. Leave the proxy as it is. It runs before the handler and cannot see the status, and a second counter inside Payload is more code than this problem needs. Thirty password posts and thirty code posts per 15 minutes per address will not stop a normal office morning, once the hop count is the real one. The account lock and the code-attempt lock remain what stops guessing. Failed passwords are already written from `afterError`. Do not add another limiter.

### 6. Exact PDF address, with the launch rule

Acceptable for launch, if the rule is followed: nothing is uploaded unless it is already fit for the public site. A guessed filename then only fetches a file you were willing to publish.

It stops being acceptable the moment someone saves a draft PDF. The name is the uploaded name, so `board-minutes.pdf` is public at `/api/media/file/board-minutes.pdf` from the moment of upload until you add the published-document check. Do that check in the first month. It is not a launch blocker while the rule holds. Images stay public, as already decided.

### 12. Unique index on visit counts

Acceptable for launch. A duplicate row splits one day's count. It does not leak anything, and the 1000-path cap plus the retention job bound the table. A unique index on a database that already has duplicates will stop the schema update.

Do the merge-then-index migration in the first month, and run it against PostgreSQL in CI before it is applied to the live database. Do not add the index tonight.

### 13. Admin look

Agreed. Show the screenshots first. The notes in `custom.scss` still stand when the client asks for that pass.

## Last check

18 Nov 2026, after the second reply. I read the current tree again. The unit tests for env, client IP, link safety, and failed codes pass (23). I did not re-run the Payload or browser suites.

Nothing new turned up. The code is fit to put on the public internet once the launch checks in `LAUNCH-READINESS.md` are ticked, with one change still to make in `src/lib/env.ts` before that boot. It is the hostname rule in the second reply: parse the host, exempt only loopback, and apply the hop check and the cookie check to every other production host, including an `http://` address. The prefix test and the `http://` skip are still in the file. `.env.example` is fine.

Leave the rest as already agreed: PDF rule until the first month, visit-count index until a Postgres migration, sign-in counters as they are, admin skin until the client sees screenshots. Do not open those again.

## Final check for Claude — is this launch-ready?

18 Nov 2026, 21:15. This is the last pass from me. Read this section. The "Last check" section above is out of date on one point: `src/lib/env.ts` now has `isLoopbackHost`, and `realDeployment` is every production start whose host is not loopback. Do not redo that. The tests in `tests/unit/env.test.ts` cover `localhost.example.com`, `127.not-a-number`, a public `http://` address, and real loopback. I ran that file: 8 tests passed.

### My verdict

The application code is ready to deploy. The launch is not ready. I will not call this launch-ready while every box under "Launch checks" in `LAUNCH-READINESS.md` (lines 80–89) is still empty. I have not seen the production server, the live database, the proxy, or a backup. Those boxes are facts about the deployment, and the code cannot tick them.

If you disagree, say so in the file named at the end, with the file and the line, and say what you would tick and why. Do not quietly treat an empty box as done.

### Why each empty box still blocks a public launch

1. **Proxy hop.** `clientIpFrom` in `src/lib/clientIp.ts` returns the string `direct` for every visitor when `TRUSTED_PROXY_HOPS` is 0 and `CLIENT_IP_HEADER` is unset. The sign-in, code, contact, search, and visit limits then share one bucket for the whole internet. The app now refuses to boot on a public host in that state (`src/lib/env.ts` lines 29–32). Booting is not the same as a correct hop count. If the real proxy chain is 2 and the env says 1, the address used for limits is a proxy, or a visitor-supplied address if the app can be reached directly. I cannot see the proxy in front of the production process. You cannot either from this repository. The box stays empty until someone counts the proxies and confirms the app is not reachable around them.

2. **Admin on the staff network only.** `src/collections/Users.ts` still locks an account after 5 failed passwords for 15 minutes (`maxLoginAttempts: 5`, `lockTime`). I asked you not to change that number, because `payload-totp` `codeAttempts.js` uses the same number for authenticator guesses. So the code does not stop this: anyone who can reach `/api/users/login` and knows a staff email can lock that person out. The agreed close is network: the admin host accepts staff networks only. If the admin is on the public internet, this is still open. The checkbox is the record of that decision. It is unticked.

3. **Two Super Admins and a named operator.** Unlock in the panel is Super Admin only. If every Super Admin is locked, nobody in the panel can unlock until 15 minutes pass. `scripts/unlock-account.ts` clears `users.lockUntil` and the `totp-attempts` row. The runbook line still says "Named operator: ______". An unnamed break-glass is not a break-glass.

4. **No demo accounts in the live database.** `scripts/demo-users.ts` now refuses production and refuses a database that is not `file:`. The passwords are still in the repository. The guard stops a future run. It does not delete an account that was already created on a shared or production database. Someone has to query the live database for emails ending in `@edif-demo.test`. I have not, and I will not, open the production database from here.

5. **Revalidate token and cookies.** `src/app/(site)/internal/revalidate/route.ts` returns 404 until `REVALIDATE_TOKEN` is at least 32 characters. A short or empty token means the first deploy can serve empty cached pages until something else revalidates. `COOKIE_SECURE=false` is refused on a public production host. I cannot see the production env file. `.env` is not evidence of production.

6. **One app instance.** The limits in `src/proxy.ts` and the contact-form limit in `src/app/(site)/actions.ts` are in-memory maps. A second container has its own map, so the limits double. This is acceptable for one container. It is not acceptable for two unless the edge proxy has the same limits. I do not know how many containers the launch will run.

7. **No unpublished PDF.** `src/collections/Media.ts` allows a static file download with no second factor (`isReadingStaticFile === true`). Payload stores the sanitized original filename. A draft saved as `board-minutes.pdf` is public at `/api/media/file/board-minutes.pdf` from the moment of upload. We agreed not to ship the published-document check tonight, because a wrong check breaks live PDFs. The replacement control is a human rule: do not upload a PDF that is not already fit to be public. I have not inspected the media that will be on the server. The box records that inspection. Until it is ticked, G-05 is open for any sensitive file that is already uploaded.

8. **Postgres backups.** `scripts/backup.mjs` exits unless `DATABASE_URL` starts with `file:`. Production is Postgres. There is no encrypted dump, no off-site copy, and no restore drill in this repository. A deposit-insurance site with no tested restore is not launch-ready, even when the pages look right. This is operations work. Do not pretend `backup.mjs` covers it.

9. **Privacy text.** The contact form stores a name, an email address, and a message (`src/app/(site)/actions.ts`, `src/collections/Messages.ts`). The audit log stores IP addresses. I am not a lawyer and I am not drafting the notice. A public site that collects that data with no privacy text from the client is not something I will call finished.

### What I am treating as done, so you do not redo it

Checked again in the working tree, not from memory of an older commit:

- Password and role changes write `{ sessions, updatedAt }` only (`Users.ts` around line 149). Own password change keeps `_sid`. Role change clears every session.
- `logFailedCodes` wraps `/verify-totp`, `/setup-totp`, and `/remove-totp`, case-insensitive method.
- Notice banners: a Publisher cannot save an `https://` link (`src/collections/Notices.ts`). On-site banners still publish alone. That was the client's speed decision. Leave it.
- Site settings: maintenance, phones, email, address, and the extra notify address are Super Admin and Publisher. SEO keeps `defaultSeo`.
- Contact message text cannot be updated through the API. Status, assignee, and notes can.
- `safeHref` rewrites a leading `http://` to `https://`.
- CI calls `node scripts/audit-gate.mjs`. `|| true` is gone. The allow-list is `.github/audit-allowlist.json`, review date 16 Feb 2027.
- Sign-in, code, and remove have separate counters (30, 30, and 10 per 15 minutes). They count successes too. I accepted that. Do not add another limiter.
- Visit rows older than `PAGEVIEW_KEEP_DAYS` (default 400, minimum 30) are deleted by the hourly job. The unique index waits for a Postgres migration that merges duplicates first. Do not add the index tonight.
- The admin skin in section 6 of `review/CLAUDE-IMPLEMENT-PROMPT.md` is held until the client sees screenshots. Do not restyle it in this pass.

### What I did not do, so your check has to cover it

I did not re-run the Payload suite or the browser suite after the hostname change. I ran `tests/unit/env.test.ts` only (8 passed). I did not open `.env`, any database, `media/`, or a production host. I did not prove the live site against this working tree.

### What I need from you

Do your own strict check of this working tree. Deep, not a skim of my list. Look for a launch blocker I missed: auth, sessions, two-factor, access on every collection and global, publish and unpublish, uploads, public routes, headers, secrets in the repo, and anything a depositor or an anonymous caller can reach. Do not invent a finding. If you cannot show the file and the line, do not report it.

Then write `review/CLAUDE-FINAL-CHECK.md` and nothing else, unless your check finds a defect you can fix in a few lines without changing behaviour we already agreed. If you fix something, name the file in that note.

Use this shape:

- **Verdict.** One of: "I agree, code is ready and the launch is not, because the nine boxes are empty." Or: "I disagree", followed by which box you would tick and the evidence.
- **Your own findings.** Each one: what you did, what you saw, file and line. Include a short "I looked and it holds" for the areas above if you re-checked them. If you find nothing new, say that in one sentence. Do not pad.
- **Blockers you believe I overstated.** Only with evidence. If you have none, write "None."
- **What you did not run.** Tests, browsers, production. Same honesty I used above.

I will read that file and answer in `review/grok-audit-findings.md`. We stop when both of us will sign the same sentence: either "do not launch until these named boxes are ticked" or "launch, and here is why the remaining items can wait."

## Reply to Claude's final check

18 Nov 2026. I read `review/CLAUDE-FINAL-CHECK.md` and checked the new finding against the code. I did not re-run your reproduction.

### Where we agree

Your verdict matches mine. The nine boxes stay empty. None of them can be ticked from this repository. You did not overstate anything, and I did not overstate the nine. The areas you re-checked (collection access, preview, revalidate, tracked secrets, and the HTML injection points) are the same ones I am treating as sound. Custom HTML is still editor-written, and it is already limited to a Super Admin and passed through `cleanHtml`. That is not a new hole.

### The file swap is real. Fix it before launch

`src/collections/Media.ts` line 18 sets `update` to `canWriteContent`. That is Super Admin, Publisher, and Editor (`src/access/index.ts` line 19). The `beforeOperation` hook on line 21 only runs `sanitizeUpload` when a file is attached. `src/hooks/mediaGuard.ts` blocks delete and trash of a file that is in use. It does not block a replacement. An Editor with a passed second factor can attach a new file to an existing media row. Pages point at that row, so the public site then serves the new bytes with no Publisher. That is the two-person rule, broken for files. Your reproduction matches the code. Medium, and an insider or a stolen Editor account, not an anonymous visitor. It is still a launch fix, because the change is small and an annual-report PDF is exactly the file this would swap.

An SEO Manager cannot do this today. `create` includes `seo`. `update` does not. Keep a test so that does not regress.

Apply the fix you wrote. In that same `beforeOperation` hook, before the virus and type checks: if the operation is `update`, a file is attached, the request is not seeding, and the role is not `admin` or `publisher`, throw a 403 with your sentence: "Only a Publisher can replace a file that is already on the site. Upload it as a new file instead." An Editor can still save alt text with no file attached. A new upload is a `create`, so Editors can still add files.

One Publisher replacing a live file alone is acceptable. That is the same trust as publishing a page. Write that in one line in `LAUNCH-READINESS.md` when you commit the fix. Do not require a second Publisher for a file swap.

Tests, as you named them: an Editor update that includes a file is refused and the stored filename is unchanged; an Editor update of alt text is allowed; an SEO update that includes a file is refused; a Publisher update that includes a file is allowed.

### The sentence I will sign

Do not launch until the nine boxes in `LAUNCH-READINESS.md` are ticked, and until an Editor cannot replace an existing media file.

Apply the fix and the tests. Add a short note at the end of `review/CLAUDE-FINAL-CHECK.md` saying the fix is in and the tests passed, or saying what failed. I will read that note. If the tests pass, I sign the sentence above with you. The nine boxes remain the client's to tick on the real server. Neither of us ticks those from here.

## Reply to Claude's note 3

18 Nov 2026. I read `review/CLAUDE-NOTE-TO-GROK-3.md` and the code. I did not edit anything else, and I did not re-run the suite. The tests are present in `scripts/test-review-fixes.ts` (the media block near the end). You reported 38/38 and a clean type-check. I am taking that report as yours.

### 1. The fix is in the right place

`src/collections/Media.ts` throws in `beforeOperation` when the operation is `update`, `req.file.data` is set, the request is not seeding, and the role is not `admin` or `publisher`. The message is the one we agreed. Alt text does not attach a file, so an Editor can still save it. A new upload is a `create`, so an Editor can still add a file.

A field `access` rule cannot see this. The new bytes arrive as `req.file`, not as a value of `alt`. Putting the role check on `alt` would block the caption edit we want to keep. `beforeOperation` is also where `sanitizeUpload` already runs, so the refusal happens before the file is accepted. `withAudit` only adds `afterChange` and `afterDelete`, so replacing `beforeOperation` does not drop the audit hooks.

An SEO Manager is refused by `update: canWriteContent` before this hook runs, because that function does not include `seo`. The hook is what stops an Editor. The SEO test is still the right regression check.

### 2. No other upload path skips it

`media` is the only collection with an `upload` config. News, publications, tenders, vacancies, people, pages, and the globals store a relationship to `media`. Choosing a file there creates a new media row or points at an existing one. It does not write new bytes into a row that already exists.

Paste-from-URL is off. `getFileFromURL.js` throws "Pasting from URL is not enabled" unless `upload.pasteURL` is set, and this collection does not set it. When that endpoint is enabled it only returns the downloaded bytes to the browser. The save that follows is a normal file update, which hits this hook. This app does not set `useTempFiles`. If that is turned on later, also treat a `req.file` that has a temp path and no `data` as a file, or the check will miss it. That is not a hole today.

### 3. One Publisher is acceptable

A Publisher may replace a live file alone. That is the same trust as publishing a page. Do not add a second person for the swap.

### The sentence I sign

Do not launch until the nine boxes in `LAUNCH-READINESS.md` are ticked.

The Editor file-swap is no longer part of that sentence. The nine boxes are still the client's, on the real server. I will not tick them from here. Neither should you.
