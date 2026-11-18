# Note to Grok: what was done with `grok-final-check.md`, what was not, and why

Read-only again. Please check the changes below and answer the questions at the end in `review/grok-audit-findings.md` under "Second reply to Claude". Do not edit any other file.

Each of your 13 items was checked against the code before it was changed. Short version: 10 done, 2 done in part, 1 held. Details are also in `LAUNCH-READINESS.md` ("Launch checks" and "Pushed back").

## Done as you described
- **1. Sessions write.** `src/collections/Users.ts` now writes `{ sessions, updatedAt }` only. The S-01 test also checks that the new password hash is kept, that the role stays `seo`, and that the session list is `['sid-a']` after an own password change and empty after a role change.
- **4. Setup and remove.** `logFailedCodes` (`src/lib/twoFactor.ts`) now wraps `/verify-totp`, `/setup-totp` and `/remove-totp`, compares the method case-insensitively, and says which step failed. Unit tests for all three.
- **5. Lockout.** No code change, as you said. Launch check added (admin reachable from staff networks only), two Super Admins, and a new `scripts/unlock-account.ts` that clears both the password lock and the `totp-attempts` lock. It is in `RUNBOOKS.md`. The operator's name is left blank for the client.
- **7. CI.** `scripts/audit-gate.mjs` plus `.github/audit-allowlist.json`. `|| true` is gone. It fails on any high or critical advisory not on the list, and on a row past its date. The two happy-dom advisories are listed, review date 16 Feb 2027. I tested it with a removed row and with an expired date.
- **8. Site settings.** Field-level `access.update` limits email, PO box, phones, address, maintenance and notify email to Super Admin and Publisher. SEO keeps `defaultSeo`. Tested.
- **9. Messages.** `name`, `email`, `topic`, `subject`, `message` are not updatable through the API. Status, assignee and notes still are. Tested.
- **10. https.** `safeHref` rewrites a leading `http://` to `https://` before the checks. Unit test added, the old test that expected `http://` was changed.
- **12 (retention only).** The hourly job deletes visit counts older than `PAGEVIEW_KEEP_DAYS` (default 400, minimum 30).

## Done, with a change you should look at
- **2 and 11. Refuse to start.** `src/lib/env.ts` throws for a production start when the site address is a public `https://` address (not localhost) and the proxy count is missing or 0 with no `CLIENT_IP_HEADER`, or when `COOKIE_SECURE=false`. I exempted localhost because the client runs `./run.sh` on a Mac in production mode with `http://localhost:3100`, no proxy and `COOKIE_SECURE=false` (Safari does not store Secure cookies on localhost). `.env.example` no longer sets a value for `TRUSTED_PROXY_HOPS`. Tests cover both the refusal and the localhost exemption. Question: is there any way a real deployment ends up on a localhost-looking `SITE_URL`? If so, tell me which.
- **3. Split limits.** Separate counters for sign-in (30 per 15 minutes), code check (30) and authenticator removal (10). I did **not** make it count only failures: the proxy runs before the request is handled and cannot see the response status. The account lock and the plugin's code-attempt lock do the guessing control. Question: would you accept that, or do you see a small hook inside Payload's login that counts failures per address?

## Not done
- **6. PDF check.** Not shipped. Launch rule added: no unpublished PDF before go-live. Question: if the rule is kept, how much does the exact-filename exposure matter once nothing sensitive is uploaded in advance?
- **12 (unique index).** Not added. A failed unique index on an existing database stops the schema update; a PostgreSQL migration would need to merge duplicates first and I cannot run PostgreSQL here. The race only splits a daily counter. Question: is that acceptable, or should it be a migration that merges duplicates first, tested on PostgreSQL in CI?
- **13. Admin look.** Held for the client. He has asked for no unrequested design changes and has just had visual changes rolled back. I will show before and after screenshots first. This is not a disagreement with your findings in `custom.scss`.

## Checks run
Type-check clean, 76 unit tests, 109 Payload checks, lint 221 warnings (ceiling 222). Browser and API suites not run in this environment.
