# Claude's final check: is this launch-ready? (18 Nov 2026)

Written in answer to "Final check for Claude" in `review/grok-audit-findings.md`. This is the only file I wrote for this check. I changed no code.

## Verdict
**I agree: the code is ready, the launch is not.** The nine boxes under "Launch checks" in `LAUNCH-READINESS.md` (lines 80-89) are all unticked. They are facts about the live server, so I would tick none of them from here. I do not disagree with Grok on any box.

The start-up check in `src/lib/env.ts` (line 29, `realDeployment = isProd && !isBuild && !isLoopbackHost(site)`) refuses to boot on a real hostname with `COOKIE_SECURE=false` or an unset proxy setting (lines 30-32). It does not fire on `localhost`, so the demo still runs, and a real deployment cannot start misconfigured.

## My own finding (new, not in Grok's list): an Editor can swap a live file with no review
- `src/collections/Media.ts` line 18: `update: canWriteContent`, and that includes the Editor role.
- The `beforeOperation` hook (line 21) only sanitises the upload. `src/hooks/mediaGuard.ts` guards delete and trash only.
- I reproduced it on a test copy: a `payload.update` as an Editor with a new file succeeded. The live image `አቶ-ፍሬዘር-አያሌው.jpg` was replaced by `probe-swap.jpg` at once.
- This breaks the two-person rule ("anything that changes what visitors see needs a Publisher"). It matters most for PDFs such as annual reports, because the URL stays the same and the content changes silently.
- Severity: medium. It needs a signed-in Editor account (with two-factor), so it is an insider or stolen-account risk, not a public one.
- **Proposed fix (NOT applied, because you limited me to this file).** In the `beforeOperation` hook: if `operation === 'update'`, a file is attached, we are not seeding, and the user is not admin or publisher, throw a 403: "Only a Publisher can replace a file that is already on the site. Upload it as a new file instead." Editors can still edit alt text and captions. Add two tests: Editor and SEO are refused a file swap, and an Editor can still edit alt text.
- Left over after the fix: one Publisher alone can still replace a live file. That matches how the publish guard treats Publishers elsewhere, so I would accept it and note it.

## Blockers Grok overstated
None. Grok's launch boxes are accurate. I would only reword box 7 ("no unpublished PDF") as a check on the live media library, which only the client can do.

## What I checked and found sound
- Access rules on every collection and global, including Messages, Subscribers and AuditLog (`src/access/index.ts` and each collection file).
- The preview route (allowed collections plus a two-factor check) and the endpoint two-factor checks (`src/lib/endpoints.ts`).
- `/internal/revalidate` is off unless `REVALIDATE_TOKEN` is at least 32 characters (`route.ts` line 14), and it compares tokens in constant time.
- Only `.env.example` is tracked in git, and I found no key patterns in tracked files.
- The `dangerouslySetInnerHTML` uses are all on content the system produces, not on raw editor input.

## What I did not run
- Browser, Playwright and accessibility (axe) suites.
- The API suite (needs a running server).
- Docker build and the `docker-compose.yml` stack.
- PostgreSQL migrations. Everything was tested on SQLite.
- Anything against production or a real hostname, and the GitHub CI run (nothing is committed yet).
- A visual check of the restored homepage and the new About image.

Last test results: 77 unit, 109 Payload checks, `tsc` clean, lint 221 warnings (cap 222).

## Before go-live, in order
1. Decide on the Media fix above, then commit in two parts (security, then content/design).
2. Run `scripts/apply-review-changes.ts` on the real database, rebuild, press Publish on Pages > Home.
3. Tick the nine launch boxes on the real server. Run the browser, API and PostgreSQL suites there.

## Update (18 Nov): file-swap fix is in
- Fix applied in `src/collections/Media.ts` (`beforeOperation`). Tests added in `scripts/test-review-fixes.ts`: Editor and SEO refused a file swap, Editor can still edit alt text, Publisher can replace a file. 38/38 pass, `tsc` clean, lint 221 (cap 222).
- Not run since the fix: the unit suite, the browser and API suites.
- Grok accepted the fix and the placement, found no other upload path, and accepts one Publisher swapping a file alone.
- **The sentence we both sign:** do not launch until the nine boxes in `LAUNCH-READINESS.md` are ticked. The nine boxes stay unticked; they are for the real server.
