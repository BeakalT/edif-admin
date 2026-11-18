# Independent code review: EDIF website and admin (review only)

You are a senior application-security engineer and Next.js reviewer. Do an independent review of this codebase. **Do not change any file.** Write all your findings to `review/grok-findings.md`, the only file you may create or edit.

## What this is
- Public website and admin for the Ethiopian Deposit Insurance Fund (EDIF), a government financial institution. It will run in production on the public internet.
- Stack: Next.js 16.4, Payload CMS 3.93, React 19, TypeScript. SQLite for the local demo, PostgreSQL in production.
- Next.js 16 has breaking changes (see `AGENTS.md`). Before you call an API usage wrong, check `node_modules/next/dist/docs/`. Do the same for Payload in `node_modules/payload`.
- Roles (`src/access/index.ts`): Super Admin (`admin`), Publisher, Editor, SEO Manager, Auditor (read-only).
- Editors' content needs two-step approval: an editor submits it, then a Publisher or Super Admin approves and publishes. SEO pages, redirects and site settings skip the approval step by design.
- Only Super Admin may add custom HTML/CSS.
- The admin is on a custom path, not `/admin`.

## Rules
- Read-only. Don't install packages, run the app, run migrations or change any file other than `review/grok-findings.md`.
- Don't open `.env`, `*.db`, `media/`, `outbox/` or `data/`. They hold local secrets and demo data and aren't part of the review.
- Report real problems only, not style preferences or formatting.
- For each finding, show the path to exploit or failure. If you can't show it, mark the finding "Suspected" rather than "Confirmed".

## Review in this order (riskiest first)
1. **Authentication and 2FA:** `src/collections/Users.ts`, `src/lib/passwordPolicy.ts`, `src/lib/endpoints.ts`, `src/components/admin/AccountActions.tsx`, `src/proxy.ts`. Look for 2FA bypass, brute force or lockout gaps, session and cookie flags, password reset, user registration, and whether account lockout can be used to deny service.
2. **Authorization and role escalation:** `src/access/index.ts` and the `access` blocks in every file in `src/collections/` and `src/globals/`. Can any role read or write beyond its rights, change its own role or another user's, or read other users' data? Check field-level access too. Is the Auditor truly read-only?
3. **Approval workflow:** `src/hooks/publishGuard.ts`, `src/fields/review.ts`, `src/components/admin/PublishBox.tsx`. Can an Editor publish without approval, for example through the REST/GraphQL API, a direct status change, scheduling, a revert, a bulk action or an import (`ImportBar.tsx`)?
4. **Custom HTML/CSS and XSS:** `src/lib/customCode.ts`, `src/site/components/Blocks.tsx`, `src/app/(site)/layout.tsx`, `src/app/(site)/page.tsx`, `src/blocks/`. Can a non-Super Admin get script or CSS onto the public site? Check every `dangerouslySetInnerHTML`, rich text, SEO fields, theme values (`src/lib/theme.ts`, `src/globals/BrandTheme.ts`) and redirect targets.
5. **Uploads and media:** `src/lib/uploadSafety.ts`, `src/hooks/mediaGuard.ts`, `src/collections/Media.ts`. Look for SVG/HTML upload, MIME spoofing, path traversal and file size limits.
6. **Public endpoints and forms:** `src/app/(site)/internal/revalidate/route.ts`, `src/app/(site)/preview/[collection]/[id]/page.tsx`, `src/app/(site)/stats/hit`, `src/app/(site)/newsletter`, `src/app/(site)/search`, `src/collections/Messages.ts`, `src/collections/Subscribers.ts`, `src/lib/clientIp.ts`. Look for missing auth, preview leaking drafts, spam and rate limits, IP spoofing via headers, and injection.
7. **Audit log integrity:** `src/hooks/audit.ts`, `src/collections/AuditLog.ts`. Can anyone edit or delete entries, or act without being logged?
8. **Config, headers and secrets:** `next.config.ts`, `src/payload.config.ts`, `src/lib/env.ts`, `src/lib/adminRoute.ts`, `Dockerfile`, `docker-compose.yml`, `.github/workflows/ci.yml`. Look for security headers and CSP, CORS/CSRF, debug settings left on, hard-coded secrets and insecure production defaults.
9. **Dependencies:** read `package.json` and `package-lock.json` and flag packages with known serious vulnerabilities. Don't run `npm audit`, only report what you can see.
10. **Logic bugs, accessibility and performance:** after the above, flag only significant issues.

## Output format for `review/grok-findings.md`
Start with a summary table: ID, severity, title, file.

Then one section per finding:

```
### G-01 — <short title>
Severity: Critical | High | Medium | Low
Status: Confirmed | Suspected
Category: Auth | Authorization | Workflow | XSS | Upload | Endpoint | Audit | Config | Dependency | Logic | A11y | Performance
Location: path/to/file.ts:line (all relevant locations)
Problem: what is wrong, in 2–4 sentences.
Exploit or failure scenario: concrete steps, role used, request made, result.
Suggested fix: specific change. Describe it, don't apply it.
```

End with an **Areas checked with no issues** list, one line per area from the list above, so it's clear what was covered.
