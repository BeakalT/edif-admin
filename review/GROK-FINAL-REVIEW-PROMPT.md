# Final independent review: verify the fixes and check the new code (review only)

You reviewed this codebase earlier. Your findings are in `review/grok-findings.md` (G-01 to G-14). Since then, fixes and a stricter Content Security Policy were added. **Do not change any file.** Write your results to `review/grok-final-findings.md`, the only file you may create or edit.

Be skeptical. These fixes were written by another AI. Your job is to find where they are incomplete, bypassable or have introduced something new. Do not repeat praise. If something is fine, say so in one line.

## How to see what changed
- `git log --oneline 927e8a1..HEAD` lists every change since your first review. Commits named "Fix G-xx" map to your findings.
- `git diff 927e8a1..HEAD -- src` shows the code changes.
- `LAUNCH-READINESS.md` section D lists what was deliberately left open (G-05 filename access, G-10 deployment setting, G-11 failed 2FA codes, G-12 lockout, G-14 CI policy). You may disagree with those decisions, but label that as a disagreement, not a missed fix.

Same rules as before: read-only, do not install, run the app or run migrations, do not open `.env`, `*.db`, `media/`, `outbox/` or `data/`. Read-only commands such as `git log`, `git diff`, `grep` and `ls` are fine. Next.js 16 and Payload 3.93 differ from older versions: check `node_modules/next/dist/docs/` and `node_modules/payload` before calling an API wrong.

## Part A: verify each earlier finding
For each of G-01 to G-14, read the fix and try to break it. Examples of what to try:
- **G-01** (2FA before preview and dashboard): any other page, route, endpoint or server component that reads with `overrideAccess: true` and trusts `req.user` / `payload.auth` without checking `_strategy`?
- **G-02** (trash, restore, unpublish with edits): other operations or fields that still let one Publisher change live content alone (version restore, scheduled publish, autosave, `draft=true` followed by publish, bulk update, nested fields that `changedContent` misses)?
- **G-03/G-04** (JSON-LD escaping, link allow-list in `src/lib/safeUrl.ts`): other places that put staff text into `<script>`, `href`, `src` or `dangerouslySetInnerHTML`; allow-list bypasses (encoding, whitespace, Unicode, `\`, mixed case)?
- **G-05** (media listing): can the library still be listed or searched anonymously some other way (depth population, `where` on another collection, `/api/media/:id`, image sizes)?
- **G-06, G-07, G-08**: field access on create vs update, other collections with the same gap, redirect target bypasses.
- **G-09** (`pdfActiveContent` in `src/lib/uploadSafety.ts`): PDFs that hide active content from it (hex-escaped names such as `/J#61vaScript`, encrypted objects, incremental updates, cross-reference streams, annotations, AcroForm, XFA). Upload size limits that can be bypassed.
- **G-10, G-11, G-13**: check what was changed against what you reported.

## Part B: review the new code
1. **Content Security Policy** in `src/proxy.ts` (per-request nonce, `'strict-dynamic'`) and `next.config.ts`. Can anything run script without the nonce? Is the nonce strong and unique per request? Which routes or responses lack the header (proxy `matcher`, maintenance page, API, files, errors)? Is `style-src 'unsafe-inline'` acceptable here, or does it enable an attack in this app?
2. **Content cache** in `src/lib/siteCache.ts`, `src/lib/cms.ts`, `src/lib/content.ts`, `src/lib/theme.ts`, cleared in `src/hooks/revalidate.ts` and `src/app/(site)/internal/revalidate/route.ts`. Can drafts or unpublished data reach the cache or the public site? Can a visitor poison or grow the cache? Can a published, unpublished, trashed or deleted change fail to clear it?
3. Any other change in `git diff 927e8a1..HEAD -- src scripts tests` that introduces a defect.

## Part C: anything new
Anything serious you did not report the first time.

## Output format for `review/grok-final-findings.md`
Start with a **fix verification table**: ID, your verdict (Fixed / Partly fixed / Not fixed / Regressed), one-line reason.

Then new findings, numbered F-01, F-02 and so on, in the same format as before:

```
### F-01 — <short title>
Severity: Critical | High | Medium | Low
Status: Confirmed | Suspected
Category: …
Location: path:line
Problem: …
Exploit or failure scenario: …
Suggested fix: …
```

End with **Areas checked with no issues**, one line each.
