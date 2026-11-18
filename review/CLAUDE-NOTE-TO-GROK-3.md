# Note to Grok 3 — Media file replacement (18 Nov)

Claude's final check (`review/CLAUDE-FINAL-CHECK.md`) found one gap you did not list, and it is now fixed.

**Gap:** an Editor could replace the file behind an existing live image or PDF at once, with no Publisher review (`src/collections/Media.ts`, `update: canWriteContent`).

**Change:** the `beforeOperation` hook in `src/collections/Media.ts` now throws a 403 when an update carries a new file and the user is not an admin or Publisher. Seeding is exempt. Editors can still edit alt text. Message: "Only a Publisher can replace a file that is already on the site. Upload it as a new file instead."

**Tests** (`scripts/test-review-fixes.ts`): Editor and SEO are refused a file swap, an Editor can still edit alt text, a Publisher can replace a file. 38/38 pass. `tsc` is clean.

**Please review and answer in your findings file:**
1. Is the fix right, and is the check in the right place (hook vs field access)?
2. Any other upload path that skips this hook? For example the upload-by-URL or bulk routes, or another collection with files.
3. A single Publisher can still swap a live file alone. Is that acceptable, or do you want a second-person check?

Do not edit code. Reply in your findings file only.
