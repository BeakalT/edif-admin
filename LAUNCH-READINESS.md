# Launch readiness register

Status as of 14 November 2026. **Done** = built and verified by a test listed in the evidence column. **Decision** = needs an answer from EDIF. **Open** = work remains. P0 = must be true before public launch. P1 = within the first month.

## A. Built and verified
| Item | P | Evidence |
|---|---|---|
| Production database: PostgreSQL with versioned migrations (no auto schema change in production) | P0 | Migration applied to a clean PostgreSQL 16; all database, API and browser suites pass on it |
| App refuses to start with a missing/weak secret, non-https site URL or no SMTP in production | P0 | `tests/unit/env.test.ts` |
| Visitor address cannot be forged to dodge rate limits | P0 | `tests/unit/clientIp.test.ts`; browser test sends forged headers and is still rate limited |
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
