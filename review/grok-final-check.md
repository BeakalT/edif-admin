# Final check — do these, and leave the rest

18 Nov 2026. This is the list. Read it from the top. Do the numbered items. Do not redo anything under "Leave these alone".

If you disagree with an item, do not skip it quietly. Add a short note under a heading "Pushed back" in `LAUNCH-READINESS.md`, with the file and the reason, and leave the code as it is.

When you are finished, every item below should be either done, with the test named here passing, or listed under "Pushed back".

## Leave these alone

These were checked again against the current working tree. They are in good shape.

- Password change and role change sign other browsers out. `src/collections/Users.ts` keeps the current session id (`_sid`) on the person's own password change and clears every session on a role change. `scripts/test-review-fixes.ts` covers both. One tightening is item 1.
- A Publisher cannot point a notice banner at another website. A Super Admin can. On-site paths such as `/faq` still work for a Publisher. `src/collections/Notices.ts` (`localLinksOnly`). The test is the S-02 block in `scripts/test-review-fixes.ts`.
- Trash, restore, and unpublish write the live document back, so a Publisher cannot publish their own draft by those steps. `src/hooks/publishGuard.ts`.
- `nextLinks` and the band button use `validateLink`. `src/blocks/design.ts`.
- Wrong codes on `/verify-totp` are written to the audit log, including the "too many codes" refusal, because that response is `{ ok: false }`. `src/lib/twoFactor.ts`. Setup and remove are item 4.
- Search is limited to 30 lookups a minute per address. `src/proxy.ts`.
- The demo-user script refuses to run in production and refuses any database that is not a local `file:` SQLite file. `scripts/demo-users.ts`.
- Custom HTML and CSS stay Super Admin only. Video embeds only accept a YouTube or Vimeo id and rebuild the iframe address. JSON-LD escapes `<`. Uploads are re-encoded, and PDFs with scripts are refused.
- The public homepage stays as the client asked: crowd photo, rules, ticker, brand colours, the short payout sentence, and the scam warning on the payout page and in the FAQ. Do not move those again.

## 1. When you clear sessions, write only the session list

`src/collections/Users.ts`, in `afterChange`, the update sends the whole user row back (`data: { ...full, sessions: keep }`). The read and the write are two steps. If the read is a moment behind, that write puts the old password hash or the old role back.

Change that call so the data is `{ sessions: keep }` and nothing else. `updatedAt` can stay. Do not spread `full`.

Extend the S-01 test in `scripts/test-review-fixes.ts`:

- After the password change, the stored password hash is different from the hash taken before the change, and the only session id left is `sid-a`.
- After the role change to `seo`, the stored role is still `seo` and the session list is empty.

## 2. Production must refuse to start until the proxy hop is set

`src/lib/clientIp.ts`: when `TRUSTED_PROXY_HOPS` is 0, every visitor is the string `direct`. The login limit, the contact form, and the visit counter then share one bucket for the whole internet. A warning is not enough. `src/lib/env.ts` only warns, and only when the variable is missing. `.env.example` sets `TRUSTED_PROXY_HOPS=1`, so a copied env file never warns and trusts one forwarding header even when that is the wrong number.

In production, outside the build, throw from `readEnv` (same path as a missing `PAYLOAD_SECRET`) when `CLIENT_IP_HEADER` is empty and `TRUSTED_PROXY_HOPS` is missing, empty, or `0`. Delete the `console.warn`.

In `.env.example`, remove the value `1`. Leave the variable commented, with one sentence: set it to the number of proxies in front of the app; production will not boot on 0.

Local development keeps 0.

## 3. Split the sign-in limits, and do not count a successful sign-in

`src/proxy.ts` has one rule for `/api/users/login`, `/api/verify-totp`, and `/api/remove-totp`: 12 POSTs in 15 minutes. One person signing in is two of those (password, then the code). The limit also counts requests that succeeded.

Give each of those three paths its own counter. Count a request only when the response status is 401, 403, or 429. A successful sign-in must not move the counter.

Keep the forgot-password and reset-password limits as they are.

## 4. Log wrong codes on setup and on remove

`logFailedCodes` wraps `path === '/verify-totp'` and `method !== 'post'`. The plugin also returns `{ ok: false }` from `POST /api/setup-totp` and `POST /api/remove-totp` (`node_modules/payload-totp/dist/api/setSecret.js` and `remove.js`). A wrong code while enrolling, or while turning the authenticator off, never reaches the audit log. Every new account enrols, because `forceSetup` is on.

Wrap those two paths as well. Compare the method case-insensitively, so a plugin update that says `POST` does not silently stop the log.

Add a unit test beside `tests/unit/logFailedCodes.test.ts` for a setup failure and a remove failure. The existing verify test stays.

## 5. Account lockout — read this carefully

A growing delay does **not** close this. Five wrong passwords still lock the account for 15 minutes; the delay only makes those five tries take a few seconds. Anyone who knows a staff email can still lock that person out.

Do not add a CAPTCHA. Do not change `maxLoginAttempts`. The authenticator uses that same number (`node_modules/payload-totp/dist/utilities/codeAttempts.js` reads `collection.auth.maxLoginAttempts`). Raising it to spare password users also gives more guesses at the 6-digit code.

The lockout is closed only if the admin is not reachable from the public internet. That is already decision 2 in the launch notes. Write it as a launch check in `LAUNCH-READINESS.md`, in plain words: the admin hostname accepts connections from staff networks only. If that is not true for this launch, stop and say so in "Pushed back". Do not invent a second lock counter in this pass. Getting that wrong would weaken the authenticator.

Two Super Admin accounts stay required. Unlock is Super Admin only, so if every Super Admin is locked, nobody in the panel can unlock until the 15 minutes pass. In the runbook, name the server command that clears `users.lockUntil` and the matching `totp-attempts` row, and name who may run it.

## 6. A PDF that is not on a published page must not download

Filenames are the uploaded name, not a random token. Payload stores `getSanitizedUploadFilename(file.name)` (`node_modules/payload/dist/uploads/generateFileData.js`). `board-minutes.pdf` is fetched at `/api/media/file/board-minutes.pdf`. Listing the library already requires a passed second factor. Downloading does not.

Do this for PDFs only. Leave images public by exact address, including drafts. A wrong check on images will break the public site.

Do not call `mediaUsage()` on the download. It reads every document in the database (`src/lib/mediaUsage.ts`).

For a static PDF download, look up that media id on published documents only, in the collections that store a file (news, publications, tenders, and download blocks on pages). If none of them point at it, respond 404. Cache a "yes" for at most 30 seconds so a busy PDF is not queried on every hit. A "no" is not cached.

Tests:

- A PDF that exists only on a draft returns 404 to a visitor.
- The same PDF, after the page is published, returns 200.
- An image attached only to a draft still returns 200.

If you cannot do this without risking published PDFs, do not ship a half check. Write that under "Pushed back", and add this launch rule in `LAUNCH-READINESS.md`: no unpublished PDF is uploaded before go-live.

## 7. CI must fail on a new high advisory

`.github/workflows/ci.yml` ends the high audit with `|| true`, so a new high advisory does not fail the build.

Fail the job on any high or critical advisory that is not on an allow-list. Keep the allow-list in the workflow as comments or a small file in the repo: the advisory id, the package name, and a review date. The current highs are happy-dom, lexical, and the Payload packages that pull them in. The review date is at most 90 days from today. Delete `|| true`. An advisory that is not on the list fails CI. An allow-list row past its date fails CI.

## 8. An SEO Manager must not be able to take the public site down

`src/globals/SiteSettings.ts` lets `admin`, `publisher`, and `seo` update the whole global. That includes the maintenance switch, the public phone numbers, and the public email.

Split the fields. SEO Manager may update `defaultSeo` only. Super Admin and Publisher may update the maintenance switch and the contact details. Enforce it with field `access`, not with the admin UI. A test: an SEO user updating `maintenance.enabled` is refused, and the same user updating `defaultSeo.title` is allowed.

## 9. A Publisher must not be able to rewrite a citizen's message

`src/collections/Messages.ts` marks the message fields read-only in the admin. The API does not. A Publisher can PATCH `name`, `email`, `topic`, `subject`, and `message`.

Set field `access.update` to false on those five. Leave `status`, `assignedTo`, and `notes` writable by a Publisher. A test: a Publisher update that changes `message` keeps the original text.

## 10. Public links use https

`src/lib/safeUrl.ts` accepts `http://`. One seeded member site is already `http://` (`scripts/seed-data/members.ts`). A button or a banner with an `http://` address sends a depositor to a page the network can alter.

In `safeHref`, rewrite a leading `http://` to `https://` and then run the existing checks. Do not drop the link. `validateLink` and `webAddress` pick this up because they call `safeHref`. Absolute links that are not http(s), mailto, tel, a site path, or a `#` anchor stay refused.

## 11. Do not allow insecure cookies in production

`src/collections/Users.ts` sets `secure: process.env.NODE_ENV === 'production' && process.env.COOKIE_SECURE !== 'false'`. `COOKIE_SECURE=false` in production sends the session cookie without the Secure flag.

In `readEnv`, if production and `COOKIE_SECURE` is `false`, throw. There is no production exception.

## 12. Visit counts: one row per page per day, and a retention setting

`src/app/(site)/stats/hit/route.ts` caps new paths at 1000 a day. Two requests at once can both insert, and `src/collections/PageViews.ts` has no unique constraint on `day` + `path`, so the count splits across two rows and the cap can be passed.

Add a unique index on `day` and `path`. On a conflict, increment the row that is already there.

Delete rows older than `PAGEVIEW_KEEP_DAYS`. Default 400. Read it in the existing daily job (`src/jobs/dailyChecks.ts`). Document the variable in `.env.example` with one sentence: this is the number of days of visit counts to keep; the client's records rule can lower it.

## 13. The admin still looks generated — section 6 is not done

`review/CLAUDE-IMPLEMENT-PROMPT.md` section 6 is the spec. Follow that file. Do not invent a new look.

These lines in `src/app/(payload)/custom.scss` are still the old skin, so section 6 has not been applied:

- line 97 and line 161 and line 265: hover `translateY`
- lines 129–130, 167–168, 210–211, 243, 257, 283, 361: uppercase labels with wide letter-spacing
- lines 221–222: radial glows on the sign-in background

The draft sentence in the Publish box is already in place. Leave it.

## Also write into LAUNCH-READINESS.md

Short lines, so the person deploying can tick them. Code items above stay in code; these are checks beside the deploy:

- `TRUSTED_PROXY_HOPS` or `CLIENT_IP_HEADER` matches the real proxy, and the app is not reachable around that proxy.
- The admin hostname is limited to staff networks. If it is not, item 5 is still open.
- The live database has no account whose email ends in `@edif-demo.test`.
- `REVALIDATE_TOKEN` is at least 32 characters. `COOKIE_SECURE` is not set.
- One app instance at launch. The rate limits live in memory (`src/proxy.ts`). A second instance doubles them. Do not add a shared store in this pass.
- Postgres backups, encryption, and a restore drill are an operations task. `scripts/backup.mjs` only works for SQLite. Do not pretend it covers production.
- Privacy text, terms, and `security.txt` wait for the client's lawyer and a monitored address. Do not draft legal pages.

## Done when

- `scripts/test-review-fixes.ts` passes, including the two new S-01 assertions and the SEO and message tests.
- `tests/unit/logFailedCodes.test.ts` covers verify, setup, and remove.
- A production boot with no hop configured throws before it listens.
- The high-audit step in CI has no `|| true`.
- Section 6 of the design brief is visible: flat navy sign-in, no hover lift, no wide-tracked uppercase labels.
