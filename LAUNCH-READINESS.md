# Launch readiness register

Status as of 14 November 2026. **Done** = built and verified by a test listed in the evidence column. **Decision** = needs an answer from EDIF. **Open** = work remains. P0 = must be true before public launch. P1 = within the first month.

## A. Built and verified
| Item | P | Evidence |
|---|---|---|
| Production database: PostgreSQL with versioned migrations (no auto schema change in production) | P0 | Migration applied to a clean PostgreSQL 16; all database, API and browser suites pass on it |
| App refuses to start with a missing/weak secret, non-https site URL or no SMTP in production | P0 | `tests/unit/env.test.ts` |
| Visitor address cannot be forged to dodge rate limits (**only when `TRUSTED_PROXY_HOPS` matches the real proxy setup**, see D) | P0 | `tests/unit/clientIp.test.ts`; browser test sends forged headers and is still rate limited |
| Configurable, non-obvious admin address; nothing hardcodes `/admin` | P0 | `tests/unit/adminRoute.test.ts`; robots.txt, emails, dashboard and rate limits read one setting |
| Health (`/healthz`) and readiness (`/readyz`) endpoints | P0 | `tests/e2e/security.spec.ts` |
| Release flow: build with no database content, refresh from the live database before traffic (`/internal/revalidate`, `post-deploy.mjs`) | P0 | Run against a bundle built from an empty database: news list went from 0 to 16 items; wrong/missing token rejected (401) |
| Container: non-root, read-only filesystem in compose, no secrets/databases/backups in the image bundle, separate migrator image | P0 | `prune-standalone.mjs` removes and then fails if any remain; Docker daemon was not available here, so **the image build itself runs for the first time in CI** |
| CI on every change: types, lint, unit, database, API, browser (desktop + phone), dependency and secret scan, image scan | P0 | `.github/workflows/ci.yml` (YAML validated; first real run happens when the repo is pushed) |
| Public site meets WCAG 2.2 AA (automated) on all 20 pages, desktop and phone; keyboard, focus, reduced motion | P0 | `tests/e2e/a11y.spec.ts`, 48/48 |
| Brand colour changes in the admin can never produce unreadable text | P0 | `tests/unit/theme.test.ts` |
| New environments start cleanly with an empty database | P0 | Build and all routes verified against an empty database (found and fixed 3 crashes) |
| Two-person publishing, roles, audit log, 2FA, lockout, upload safety, custom-code safety | P0 | database suites 63/63, API suite 59/59, unit tests |
| Runbooks, architecture notes, developer README | P1 | `RUNBOOKS.md`, `ARCHITECTURE.md`, `README.md` |

## B. Decisions (taken 15 Nov 2026 on the best information available; EDIF only needs to object where a rule says otherwise)
| # | Question | Decision | What would change it |
|---|---|---|---|
| 1 | Who hosts, and where must data live | Hosted in Ethiopia, operated by EDIF IT (or an NBE/INSA-approved local data centre). Two small servers behind a reverse proxy, managed PostgreSQL 16, encrypted offsite copy of backups. Staff data and the audit log never leave the country | A rule that allows foreign hosting (then any ISO 27001 provider in a nearby region works with the same containers) |
| 2 | Admin network lock | IP allow-list on a separate admin hostname (`admin.edif.gov.et`): EDIF offices and the VPN exit address. Two-step sign-in stays on for everyone, so the allow-list is a second layer, not the only one | If EDIF already runs a VPN or zero-trust tool, put the admin behind that instead of listing addresses |
| 3 | Mail and DNS | Transactional mail provider sending from `mail.edif.gov.et`, with SPF, DKIM and DMARC (start `p=none`, move to `quarantine` after two clean weeks). EDIF IT delegates three records: `www`, `admin`, `mail` | If EDIF must send through its own Exchange/M365 relay, only the SMTP settings change |
| 4 | Recovery targets | Lost data at most 1 hour (RPO), back online within 4 hours (RTO), 99.5% monthly uptime for the public site. The site is informational, so no 24/7 on-call is promised; the emergency copy (7) covers outages | A promise of higher uptime needs a second site and costs more |
| 5 | Backup retention | Every backup for 14 days, one a week for 8 weeks, one a month for 12 months (the audit log is also exported yearly and kept 7 years). Built into `scripts/backup.mjs`, settings `BACKUP_KEEP_DAILY/WEEKLY/MONTHLY` | EDIF's records rules, if they require longer |
| 6 | Passkeys / hardware keys | Not at launch. Authenticator-app sign-in is required for everyone from day one. Hardware keys for Super Admins in the first quarter (P1) | A rule that demands phishing-proof sign-in at launch |
| 7 | Emergency static copy | Yes, built: `scripts/static-mirror.mjs` saves the whole public site as plain files for any static host. Run it nightly and after big publishes; keep the copy at a second provider | None |
| 8 | Admin word | Chosen and kept by the Super Admin, never in documents or email. Apply it with `node scripts/set-admin-path.mjs <word>` before the production build | Change at any time (one command and a release) |

## C. Open work
| Item | P | Notes |
|---|---|---|
| Hosting provisioned, DNS, TLS, CDN/WAF in front | P0 | Decisions 1–3 are taken; EDIF IT provisions. CDN must set the trusted client-IP header and rate-limit sign-in |
| Separate admin hostname restricted at the network | P0 | Decision 2 is taken |
| Daily incremental backups + point-in-time recovery, offsite encrypted copy, first restore test | P0 | Decisions 1, 4, 5 are taken. Procedure is in RUNBOOKS §4 |
| Staging environment | P0 | RUNBOOKS §3. Same stack, separate data |
| Error tracking, uptime probe, alerts | P1 | Choose tools after hosting |
| CDN cache purge on publish, or keep one instance | P1 | Page cache is per instance (ARCHITECTURE → Known limits) |
| Manual accessibility test with a screen reader and a keyboard-only pass of the admin | P1 | Automated checks find only part of the problems |
| Usability test of the admin with 3–5 EDIF editors | P1 | Fix what they stumble on |
| Performance check on low-end phones and slow networks | P1 | Set a Core Web Vitals budget |
| Hardware keys for Super Admins | P1 | Decision 6: first quarter after launch |
| Publish alerts for notices, key figures and payout pages | P1 | Email to the second approver and web owner |
| Reduce remaining `any` types (189) and lower the lint ratchet | P1 | Ratchet is in `ci.yml` |
| Dependency advisories: 3 high remain, all inside Payload's rich-text chain (`happy-dom`, `lexical`) | P1 | Not reachable from our inputs as used today, but update Payload when it ships fixes; CI blocks on critical |
| Authenticator keys are stored unencrypted in the database | P1 | Mitigated by database access control and encrypted backups; consider field encryption |
| Premiums figure on the site (Birr 7.34bn) | P0 | **Verified 15 Nov 2026** against the Annual Report 2024/25 (pp. 9, 21): 6.48bn conventional + 650.26m interest-free + 212.32m initial premiums = 7.34bn. Captions now name the initial premiums |

## D. Independent review (Grok 4.7 in Cursor, 18 Nov 2026)
Findings are in `review/grok-findings.md`. Each one was checked against the code. Fixed items are separate commits named "Fix G-xx". These items remain open:

| Item | P | Status |
|---|---|---|
| G-03/G-04 follow-up: remove `'unsafe-inline'` from the production CSP `script-src` | P0 | **Done 18 Nov.** Per-visit nonce with `'strict-dynamic'` on the site and the admin (`src/proxy.ts`). Pages now render per visit; published content is cached across visits and cleared on every change (`src/lib/siteCache.ts`), ~7–19 ms per page. Verified: every executable script carries the nonce; API and database suites pass. `tests/e2e/security.spec.ts` checks the header, a fresh nonce per visit, no CSP violations on site and admin pages, and that an injected script does not run |
| G-05 follow-up: files attached only to unpublished drafts can be downloaded by anyone who knows the exact filename | P1 | Open. Listing is now staff-only. Full fix: serve files only when a published document uses them |
| G-10: set `TRUSTED_PROXY_HOPS` (or `CLIENT_IP_HEADER`) to match the real proxy in front of the app, and make sure the app cannot be reached around that proxy | P0 | **Enforced in code 18 Nov.** The code default is 0 (no forwarding header believed). A production start on a public https address **refuses to boot** unless a hop count above 0 or `CLIENT_IP_HEADER` is set (`src/lib/env.ts`). A local run on localhost is exempt. |
| G-11 follow-up: log failed authenticator codes (wrong code after a correct password) | P1 | **Done 18 Nov.** `logFailedCodes` (src/lib/twoFactor.ts) wraps the plugin's verify endpoint and writes a security row to the audit log. Test: `tests/unit/logFailedCodes.test.ts`. |
| G-12: knowing a staff email is enough to lock that account for 15 minutes | P1 | **Closed by network, not code (Grok's advice, 18 Nov).** No CAPTCHA, `maxLoginAttempts` unchanged (the authenticator-code lock reads the same number). The admin address must be reachable from staff networks only: see launch checks below. Emergency unlock: `scripts/unlock-account.ts`. |
| G-14: high-severity dependency advisories do not fail CI | P1 | **Done 18 Nov.** `scripts/audit-gate.mjs` fails CI on any high or critical advisory not in `.github/audit-allowlist.json`, and on any allow-list row past its review date (next: 16 Feb 2027). |


## Grok security audit, 18 Nov 2026 (`review/grok-audit-findings.md`)
| Finding | Status |
|---|---|
| S-01 password or role change leaves other sessions valid | **Fixed.** Own password change keeps only the current session; role change signs the person out everywhere. Tests in `scripts/test-review-fixes.ts`. |
| S-02 one Publisher can publish a banner with an off-site link | **Fixed (partly).** Only a Super Admin can link a banner to another website. A Publisher can still publish a banner alone with text and an on-site link (decision: speed for urgent notices). |
| S-03 demo script with known passwords | **Fixed.** Refuses to run unless `DATABASE_URL` is a local SQLite file and not production. Before handover, confirm no `@edif-demo.test` accounts exist in the live database. |
| S-04 search has no rate limit | **Fixed.** 30 searches a minute per address (per instance). |
| S-05 visit counter accepts any path | **Partly fixed.** At most 1000 distinct paths per day, and rows older than `PAGEVIEW_KEEP_DAYS` (default 400) are deleted by the hourly job. A unique index on day and path was not added: see Pushed back. |
| S-06 retention and privacy notice | Open: needs the client's lawyer. |
| S-07 Postgres backups | Open: needs an operations decision (encrypted dump, off-site copy, restore drill). |
| S-08 limits per process | Open: record that launch runs one container, or add limits at the proxy. |
| S-09 security.txt and legal pages | Open: needs a monitored address and the client's text. |


## Launch checks (tick before go-live)
- [ ] `TRUSTED_PROXY_HOPS` or `CLIENT_IP_HEADER` matches the real proxy, and the app is not reachable around that proxy.
- [ ] The admin hostname accepts connections from staff networks only. If it does not, the account-lockout risk (G-12) is still open: anyone who knows a staff email can lock that account for 15 minutes.
- [ ] At least two Super Admin accounts exist. Unlock in the panel is Super Admin only; if all are locked, a server operator runs `npx payload run scripts/unlock-account.ts <email>` (clears the password lock and the authenticator-code lock). Named operator: ______
- [ ] The live database has no account whose email ends in `@edif-demo.test`.
- [ ] `REVALIDATE_TOKEN` is at least 32 characters. `COOKIE_SECURE` is not set (production refuses `false`).
- [ ] One app instance at launch: rate limits live in memory (`src/proxy.ts`), so a second instance doubles them.
- [ ] No unpublished PDF (tender pack, draft minutes, draft report) is uploaded before go-live. Files download by their exact address even when only a draft uses them (G-05).
- [ ] PostgreSQL backups, encryption and a restore drill are arranged. `scripts/backup.mjs` covers SQLite only.
- [ ] Privacy text, terms and `security.txt` are written with the client's lawyer and a monitored address. They are not drafted here.

Note: an Editor cannot replace the file of an existing media item (`src/collections/Media.ts`); one Publisher alone can, which is the same trust as publishing a page. Accepted.

## Pushed back (Claude's notes to Grok's final check, 18 Nov)
- **Counting only failed sign-ins in `src/proxy.ts` (item 3).** The proxy runs before the request is handled and cannot see the response, so it cannot tell a failure from a success. Done instead: separate counters for sign-in, code check and authenticator removal (30, 30 and 10 per 15 minutes per address); the account lock and the authenticator-code lock are what stop guessing. A count of failures would need a hook inside the login route.
- **PDF download check (item 6).** Not shipped. It changes how every file is served, and a wrong check would break published PDFs on the public site. Launch rule above instead; build it with the three tests Grok named in the first month.
- **Unique index on visit counts (item 12).** Not added. Creating it needs a PostgreSQL migration that first merges existing duplicate rows, and a failed index creation on a live or demo database would stop the schema update. The race only splits one day's counter into two rows and the daily cap is overshot by at most the number of simultaneous requests. Retention is done.
- **Admin look (item 13, design brief section 6).** Held for the client's decision, because the client asked for no unrequested design changes and has just had visual changes rolled back. Before and after screenshots first.
