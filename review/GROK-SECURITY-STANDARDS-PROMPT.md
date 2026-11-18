# Independent audit: security first, then professional standards, structure and missing pieces (review only)

This is the website and admin for the Ethiopian Deposit Insurance Fund (EDIF), a public institution. Next.js 16 with Payload CMS 3.93, SQLite for the demo, PostgreSQL in production, run behind a reverse proxy. It is about to be handed to a client and put on the public internet.

You reviewed it before (`review/grok-findings.md`, `review/grok-final-findings.md`). Those findings were mostly fixed. **This is a fresh, wider audit.** Do not just re-check old fixes; look for what both of us missed. **Do not change any file.** Write results to `review/grok-audit-findings.md`, the only file you may create or edit.

Be skeptical and specific. The code was written by another AI. No praise, no padding. If an area is fine, say so in one line.

## Rules
- Read-only. Do not install packages, run the app, run migrations, or open `.env`, `*.db`, `media/`, `outbox/` or `data/`. `git log`, `git diff`, `grep`, `ls` and reading source are fine.
- The working tree has uncommitted changes. Review `git diff HEAD` as well as the committed code.
- Next.js 16 and Payload 3.93 differ from older versions. Check `node_modules/next/dist/docs/` and `node_modules/payload` before calling an API wrong.
- Known, deliberate decisions are in `LAUNCH-READINESS.md` section D and `review/grok-final-findings.md`. Do not repeat them unless you have a new argument.
- Never invent a vulnerability. For every finding give the file and line, how to trigger it, and what an attacker or user gets. If you cannot show a path, label it "hardening", not "vulnerability".

## Part 1: Security (the priority)
Work through these. For each, say Fixed / Weak / Missing, and why.

1. **Authentication**: password policy and hashing, two-factor (TOTP) enrolment and recovery, replay protection, session lifetime, cookie flags (`HttpOnly`, `Secure`, `SameSite`), logout and session invalidation after password or role change, password reset flow, account enumeration through login or reset messages and timing, brute-force limits.
2. **Authorization**: every collection, global, custom endpoint, server action and route handler. Role matrix (admin, publisher, editor, seo, auditor) against what the code actually allows. Field-level access on create and update. Object-level checks (can one user read or change another's data by ID). Anything that uses `overrideAccess: true` and trusts input.
3. **Injection and output**: SQL (raw queries, `sql` templates, `where` built from input), XSS (`dangerouslySetInnerHTML`, rich text, custom HTML blocks, JSON-LD, `href`/`src` from content), header injection, open redirects, SSRF (any server-side fetch of a user-supplied URL), path traversal in uploads and file serving, prototype pollution, ReDoS.
4. **Uploads and media**: type sniffing vs extension, SVG handling, PDF active content, image re-encoding, size limits, filename handling, storage location, who can fetch what, malware scanning.
5. **Forms and public endpoints**: contact form, search, stats, revalidate, health, GraphQL, any public API. Rate limiting, spam and abuse, email header injection, CSRF, CORS, request size limits, error messages that leak internals.
6. **Headers and transport**: CSP, HSTS, `X-Content-Type-Options`, frame protection, `Referrer-Policy`, `Permissions-Policy`, COOP/CORP, cache headers on private pages, cookies, behaviour when `X-Forwarded-*` is spoofed.
7. **Secrets and configuration**: how secrets are loaded and validated at start-up, anything committed that should not be (check `git log -p` for keys, tokens, passwords, demo credentials), `.env.example`, default or demo accounts reachable in production, debug flags, source maps, `NEXT_PUBLIC_` exposure.
8. **Dependencies and supply chain**: `package.json` and lockfile (pinning, `overrides`), known advisories you can identify from versions, install scripts, unused packages, Dependabot and CI audit policy, base image and Docker hardening (non-root user, minimal image, pinned digest, healthcheck, read-only filesystem, no secrets in layers).
9. **Logging, audit and monitoring**: what is audited, what is missing (failed 2FA, role changes, permission denials, exports, deletions), PII or secrets in logs, log injection, tamper resistance of the audit trail, alerting hooks.
10. **Data protection and privacy**: personal data collected (contact form, staff accounts, analytics, IP addresses), retention, deletion, backups and their encryption, cookie and consent behaviour, privacy notice present and accurate. Flag gaps against the data-protection law that applies in Ethiopia as questions for the client's lawyer; do not state legal conclusions.
11. **Availability and resilience**: denial-of-service through expensive queries, unbounded loops, large uploads, cache growth, GraphQL depth, backup and restore (`scripts/backup.mjs`, `scripts/restore.mjs`), behaviour when the database or SMTP is down, maintenance mode.
12. **Business-logic abuse**: the two-person publish rule (`src/hooks/publishGuard.ts`), scheduled publishing, version restore, trash and restore, redirects, notices, anything that lets one person put content live alone or impersonate the Fund (scam risk: the site is a trusted source for depositors).

## Part 2: Professional standards a client would expect
For each, Present / Partial / Missing, with a file reference.
- **Testing**: unit, integration, end-to-end and accessibility test coverage of the risky parts (access control, publish guard, uploads, forms). What is untested that should not be. Flaky or brittle tests.
- **CI/CD**: `.github/workflows`. Lint, types, tests, audit, build, Docker build, branch protection assumptions, release process, rollback.
- **Operations**: environment validation, health endpoints, structured logging, error tracking, backups with a tested restore, migration process (`src/migrations`), zero-downtime and rollback of migrations, database indexes, connection pooling, graceful shutdown.
- **Accessibility and standards compliance**: WCAG 2.2 AA issues you can find in code (focus, labels, contrast tokens, reduced motion, language attributes, skip link, form errors).
- **SEO and web basics**: `robots.txt`, `sitemap.xml`, canonical URLs, Open Graph, structured data, `security.txt`, custom 404 and 500 pages, redirects, performance budget, image sizes.
- **Legal and trust pages**: privacy notice, terms, cookie notice, accessibility statement, contact for security reports.
- **Documentation**: README, architecture, runbooks, handover notes, how to rotate secrets, add a user, restore a backup, deploy, respond to an incident. What a new engineer or the client's IT team could not do from the docs.
- **Licensing and provenance**: licences of dependencies, fonts, images and icons; anything with unclear rights.

## Part 3: Code structure and quality
- Folder structure and boundaries (`src/access`, `src/hooks`, `src/collections`, `src/lib`, `src/site`, `src/components`), circular or leaking dependencies, server/client boundary mistakes, secrets or server-only code reachable from client bundles.
- Type safety (`any`, unchecked casts, `@ts-ignore`), error handling (swallowed errors, empty `catch`), duplicated logic that should be one function, dead code, large files that should be split, magic numbers and strings, naming consistency.
- Payload-specific: collection and field definitions that are inconsistent, hooks with side effects that can run twice, hooks that depend on request context in fragile ways, access functions that differ between similar collections, missing indexes, migrations that do not match the schema.
- Performance: N+1 queries, unbounded `limit`, missing caching or cache invalidation gaps, heavy client bundles, unoptimised images.
- Lint ratchet: `eslint.config.mjs` and the warning cap. Which warnings hide real problems?

## Part 4: What is missing
List anything a standard, professional, production-ready public-sector website and admin should have that is not here, even if it is outside the questions above. Examples: rate-limit store that works across several server instances, WAF or CDN guidance, content moderation of the contact form, admin audit export, a staging environment, a security-incident runbook, penetration-test scope, uptime monitoring, cookie banner (if analytics exist), disaster-recovery targets.

## Output format (`review/grok-audit-findings.md`)
1. A one-paragraph verdict: is this safe to put on the public internet today? What must change first?
2. A summary table: ID, Severity (Critical / High / Medium / Low / Hardening), Area, one-line title, status "New" or "Known".
3. Each finding as:
   ```
   ### S-01 Title
   Severity:
   Area: (Part and topic)
   Where: file:line
   Problem:
   How it is triggered / what it gives an attacker or user:
   Suggested fix: (concrete, small, in this codebase's style)
   ```
4. Three lists at the end: **Fix before launch**, **Fix within the first month**, **Nice to have**.
5. A short "Checked and fine" list so nothing is silently skipped.

Rank findings most serious first. Prefer 15 well-evidenced findings to 60 vague ones.
