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

## Part D: UI and UX review
The site is running at http://localhost:3100 (the admin sign-in is at http://localhost:3100/admin). If you have a browser tool, open the site there and look at it at desktop and phone widths; otherwise review the components in `src/site/` and `src/components/admin/`. You cannot sign in to the admin (it needs a second factor), so review the admin from its sign-in page and its code. Do not submit forms that change data.

This is the public website of the Ethiopian Deposit Insurance Fund. Its main audience is ordinary depositors, many on low-end phones and slow networks, who need to know quickly whether their money is protected and what to do if their bank fails. The admin is used daily by staff who are used to WordPress.

Look for problems that would hurt those people, for example:
- Is it clear within a few seconds what EDIF does, whether a deposit is covered, and how to check?
- Navigation, information architecture, page order and labels: can someone find coverage, payout, member banks and contact details without guessing?
- Layout at phone widths: overflow, overlapping text or numbers, tap targets, readability.
- Forms and the coverage calculator: clear labels, errors, results a non-expert understands.
- Accessibility problems that automated checks miss: focus order, link text, headings, contrast on images, motion.
- Consistency: spacing, type, buttons, icons, tone of the copy.
- Admin: anything confusing or risky for an editor (the two-step review, publish, trash, custom HTML).

Report UI and UX issues as U-01, U-02 and so on, each with: page or component, what is wrong, who it affects, and a concrete fix. Severity: High (stops a task or misleads), Medium (slows people down), Low (polish).

## Part E: make the design feel human
The owner wants the site to feel made by people, for people, and not like a generated template. Judge it as a skeptical visitor would: a depositor who is worried about their money, a bank officer, a journalist.

Look at the public site (and the admin sign-in) and answer honestly:
1. **First impression.** In five seconds, does it feel like a real public institution that cares, or like a generic corporate or AI-made layout? Name the specific things that give it away (repeated card grids, identical icon circles, stock-style gradients, evenly weighted sections, symmetrical everything, vague hero lines).
2. **Copy and tone.** Find sentences that sound machine-written or bureaucratic: abstract nouns, "empowering", "robust", "seamless", three-part lists, headlines that say nothing. Quote the text, say where it is, and rewrite it in plain, warm, concrete language a depositor would use. The tone should be calm, direct and reassuring, never salesy. No Amharic content is wanted.
3. **Visual rhythm.** Where is the page monotonous? Suggest where scale, whitespace, a stronger photo, a single large number or a different layout would give the page a point of view. Say what to remove as well as what to add.
4. **People and place.** Where could real photographs, real names and roles, real office or Ethiopian context replace decoration? (Only suggest photos EDIF can legitimately supply. Do not suggest copying photos of named people from the web.)
5. **Moments of care.** Empty states, error messages, form confirmations, the 404 page, loading states, the coverage calculator result. Which feel cold, and what would a helpful person say instead?
6. **Trust signals.** Does the site show who is behind it, how to verify it (official contacts, legal basis, the Proclamation), and when content was last updated? What is missing that a worried depositor would look for?
7. **Restraint.** List what to leave alone: parts of the design that already work and should not be changed.

Report each as H-01, H-02 and so on, with: page or component, what feels impersonal, who notices, and a concrete change (new wording, layout change or element to remove). Give severity as High (hurts trust or comprehension), Medium or Low. For any wording change, give the exact replacement text. Do not edit files; propose only. Keep suggestions realistic for a small team and compatible with the existing design system (colours, type, spacing in `src/site/styles/`).

## Output format for `review/grok-final-findings.md`
Start with a **fix verification table**: ID, your verdict (Fixed / Partly fixed / Not fixed / Regressed), one-line reason.

Then new security or code findings, numbered F-01, F-02 and so on, in the same format as before:

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

Then the UI and UX findings (U-01 …), then the "make it human" findings (H-01 …), then a short ranked list of the ten changes that would most improve how human the site feels.

End with **Areas checked with no issues**, one line each.
