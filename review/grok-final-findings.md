# Final review (18 Nov 2026)

Reviewed the fixes since `927e8a1`, the new CSP and content cache, and the public site at http://localhost:3100 (desktop and a 390×844 phone width) plus the admin sign-in. No data-changing forms were submitted. I could not sign in.

## Fix verification

| ID | Verdict | Reason |
|---|---|---|
| G-01 | Fixed | Preview and the dashboard return nothing unless the session strategy is `totp`. No other server page calls `payload.auth` and then reads with `overrideAccess`. |
| G-02 | Partly fixed | Trash, restore and unpublish now reject a content change in the same request, but they compare the payload with the latest **draft**, so a Publisher can put their own unpublished edits live. See F-01. |
| G-03 | Fixed | `jsonLd` escapes `<`, `>` and `&` and the two line separators. The only script sink is the page JSON-LD tag, and the production nonce CSP would block a breakout script. |
| G-04 | Partly fixed | Notices, news links, publications, member websites and navigation use `safeHref`. Design-block buttons, page blocks and rich text still use a weaker check. See F-02. |
| G-05 | Partly fixed | Listing and `findByID` now require a passed second factor. Downloading a file by its exact filename is still public. That is the open item in `LAUNCH-READINESS.md` section D, not a missed fix. I still disagree: a filename on an unpublished draft is enough to fetch the file. |
| G-06 | Fixed | Custom HTML and CSS fields have both `create` and `update` access limited to Super Admin. |
| G-07 | Fixed | `lockForSeo` limits news body fields to Admin, Publisher and Editor. SEO can still edit SEO fields only, and cannot create news. |
| G-08 | Partly fixed | Editors cannot set an external target, and `//` and `@` in the host are rejected. A Publisher or SEO Manager can still send any path to any `https` host with no second approver. See F-03. |
| G-09 | Fixed | Active PDF content is rejected, uploads abort at 20MB, and images over 10MB are refused after the buffer is read. pdf-lib decodes hex names such as `/J#61vaScript` before the name check, so that bypass does not land. URI `javascript:` actions and GoToR are not in the blocked action list; I could not demonstrate a working file, so that stays a note, not a finding. |
| G-10 | Partly fixed | `X-Real-IP` is no longer a fallback, and the stats limiter drops the oldest key instead of clearing the map. The default is still one trusted proxy hop, so a client that reaches the app directly can still spoof `X-Forwarded-For`. Recorded as a deployment step. I disagree with leaving the default at 1: it should be 0 until the real proxy is set. |
| G-11 | Partly fixed | Password reset and password change are audited and the user is emailed. The login audit row now says the password was accepted and the authenticator code is still required. Failed authenticator codes are still not logged. That is the open item in section D. I disagree: those failures are the useful half of the 2FA log. |
| G-12 | Not fixed | Account lockout is unchanged. Recorded as a decision in section D. I disagree: anyone who knows a staff email can lock that account for 15 minutes while the admin is reachable from the network. |
| G-13 | Fixed | Mailpit and MinIO listen on 127.0.0.1, database and MinIO passwords come from the environment, and SMTP requires TLS unless `SMTP_ALLOW_PLAIN` is set on purpose. |
| G-14 | Not fixed | CI still does not fail on high advisories. Recorded decision (Payload’s rich-text chain). I disagree with ignoring high advisories, and I accept that the three known highs are not reachable from this app’s inputs today. |

Nothing in this set regressed.

## New findings

### F-01 — Trash and restore compare against the draft, so one Publisher can publish their own edit
Severity: High
Status: Confirmed
Category: Workflow
Location: src/hooks/publishGuard.ts:58
Problem: The combined-edit check loads the latest draft (`draft: true`) and compares the request with that draft. A Publisher who has just saved a draft is `lastEditor`, and the live document is untouched. Trashing then restoring does not consult `lastEditor`. On a non-draft update, Payload writes the submitted fields onto the main document.
Exploit or failure scenario: Publisher saves a draft of a live page (visitors still see the old text). They then `PATCH` the document without `draft=true`, sending the draft fields plus `deletedAt`. `changedContent` compares that body with the draft, finds no difference, and returns the data, so the live document is trashed with the new text. A second `PATCH` with `deletedAt: null` restores it. The live page is now the Publisher’s own draft. The admin trash button only sends `deletedAt`; this path is the REST API. The same comparison on unpublish lets the Publisher write draft content while taking the page down, but they still cannot put it back to published, because that path checks `lastEditor`.
Suggested fix: Compare trash, restore and unpublish with the published document (`draft: false`), or reject the request when any field other than `deletedAt`, `_status` and the review meta fields is present.

### F-02 — Block buttons and rich text still accept protocol-relative and script URLs
Severity: Medium
Status: Confirmed
Category: XSS
Location: src/site/components/Parts.tsx:19
Problem: `safeHref` refuses `javascript:` and `//host`. Three older renderers do not use it. `Parts.tsx` `Button` only tests `https?:|mailto:|tel:` and otherwise passes the string to `next/link`, so `javascript:…` and `//evil.example` go through. `Blocks.tsx` `safe()` and `RichText.tsx` `safeUrl()` use `/^(https?:\/\/|mailto:|tel:|\/|#)/i`, which matches `//evil.example` because it starts with `/`, and the link is then rendered as an internal `Link`. Design-block URL fields (`src/blocks/design.ts:8`, `src/blocks/index.ts:22`, `src/blocks/index.ts:35`) have no `validateLink`.
Exploit or failure scenario: A Super Admin, or an Editor whose change a Publisher approves, sets a block button or a rich-text link to `//evil.example/phish`. A depositor who clicks it leaves the Fund’s site. Production CSP stops an injected script from running; it does not stop the navigation. The G-04 allow-list never sees these fields.
Suggested fix: Validate every block and rich-text URL with `validateLink` on save, and render all of them through `safeHref`.

### F-03 — A Publisher or SEO Manager can redirect any path to any https site
Severity: Medium
Status: Confirmed
Category: Endpoint
Location: src/collections/Redirects.ts:17
Problem: The new check blocks Editors and rejects protocol-relative targets. `seoFieldAccess` still lets a Publisher, an SEO Manager or a Super Admin create a redirect alone, and the target rule accepts any `https` host.
Exploit or failure scenario: An SEO Manager sets `/` or `/deposit-protection` to `https://evil.example`. Visitors who follow the old address, including from search results, land on an attacker page under a hop that started on the Fund’s domain. There is no second approver.
Suggested fix: Allow external targets only for Super Admin, or require the same two-person publish rule as pages, and restrict hosts to a small allow-list.

## UI and UX

Looked at the homepage at desktop width and at 390×844, the 404 page, and `/admin/login`. The homepage does not overflow horizontally on the phone. The hero headline, the Birr 100,000 sentence and “Check your coverage” are on the first phone screen. The three figures start just below it.

### U-01 — News cards invent a story, and the homepage is showing a test article
Severity: High
Page or component: Homepage “Latest from the Fund”, `NewsCard` in `src/site/components/sections.tsx:153`
What is wrong: An article with no photo is drawn as a poster that says “On air / Addis Gebeya” for every kind other than Report and Results. Report cards always say “2024/25 Annual Report” and Results cards always say “Birr 5.2bn in nine months”, whatever the article is. The first live card is an Announcement titled “Draft title change” with the summary “x”, dated 18 November 2026, and its accessible name is “Announcement On air Addis Gebeya 18 November 2026 Draft title change x Read story”.
Who it affects: A depositor or journalist who trusts the homepage news. The poster describes a broadcast that does not exist, and the test article looks like the Fund published a draft by mistake.
Concrete fix: If there is no photo, show the date and the article kind in plain type, with no invented headline. Unpublish “Draft title change”.

### U-02 — The scam banner’s link does not lead to the warning
Severity: Medium
Page or component: Notice bar on every page
What is wrong: “Read more” goes to `/faq`. The bar is about fake messages that ask for bank details. The FAQ is a general list, so the person who taps it does not land on an explanation of the warning.
Who it affects: Depositors who received a suspicious SMS and are trying to check it.
Concrete fix: Point the link at a short notice that says what the Fund will never ask for, and change the label to “How to tell a fake message”.

### U-03 — The calculator asks for an “MFI”
Severity: Medium
Page or component: Coverage calculator, homepage and `/deposit-protection/calculator`
What is wrong: The institution field’s empty label is “Choose bank or MFI”. The rest of the page says “microfinance institution”. The select lists 94 names with no search.
Who it affects: Depositors on a phone who do not know the abbreviation, and anyone scrolling a long native list.
Concrete fix: Label it “Choose your bank or microfinance institution”. Keep the native select (the phone picker is usable) and add a text filter on wider screens.

### U-04 — The same exclusions are listed twice on the homepage
Severity: Low
Page or component: “What your deposit insurance covers”
What is wrong: Four short “Not covered” cards are followed, on the same page, by the full list of 11 exclusions, including the same collateral and court-order items again.
Who it affects: A depositor looking for “is my savings account covered?” who has to move past a repeated legal list before the calculator.
Concrete fix: Keep the four short cards and the “See all 11 exclusions” control. Move the full list to the coverage page only.

### U-05 — The review step is easy to miss after Save draft
Severity: Low
Page or component: Page editor publish box (`src/components/admin/PublishBox.tsx`)
What is wrong: Signed in as Super Admin, the Home page shows a Publish box with Status, Last changed, Preview, Save draft and Publish changes. That box is clear. An Editor does not get Publish changes. The box instead says to set Review to “Ready for review”. That sentence sits in the side column, and Save draft is the button that looks like the main action.
Who it affects: Editors coming from WordPress, who expect Save to mean the page is public.
Concrete fix: After a successful draft save, show one sentence at the top of the document: “Saved as a draft. Visitors cannot see it until a Publisher approves it.”

## Make the design feel human

The first screen already feels like a public institution. The conference photograph, the gold line “Your savings, protected.”, the concrete “Birr 100,000”, the regulation line and the scam banner are specific. What gives the template away is further down: three identical news cards, one of them a fake poster, and the same eyebrow-plus-italic heading on every section.

### H-01 — The first news card is a test, wearing a slogan from another article
Severity: High
Page or component: Homepage news row
What feels impersonal: “Draft title change” and the summary “x” are leftover test copy. The poster “On air / Addis Gebeya” is decoration that pretends to be a fact.
Who notices: Anyone who scrolls to “Latest from the Fund”, including a journalist checking whether the site is live.
Concrete change: Remove the test article. Delete the three hardcoded poster lines in `NewsCard`. A card with no photo should be the date, the title and the summary only.

### H-02 — One news summary is written like an internal memo
Severity: Medium
Page or component: Homepage, Kenya story (30 January 2026)
What feels impersonal: “An exposure and experience-sharing visit to the Kenya Deposit Insurance Corporation in Nairobi.”
Who notices: A depositor who is deciding whether these stories are for them.
Concrete change: Replace the summary with “Our team went to Nairobi to see how Kenya’s deposit insurer pays people when a bank fails.” Replace the headline with “What we learned from Kenya’s deposit insurer”.

### H-03 — The payout answer hides the useful fact behind office language
Severity: Medium
Page or component: Homepage FAQ, “Where would I receive my payment?”
What feels impersonal: “chosen for its wide branch network, strong financial position and administrative capacity.”
Who notices: Someone whose bank has just failed and who needs to know where to go.
Concrete change: Replace that sentence with “The Fund chooses a bank with branches across the country and announces the bank, and the day payment starts, before you need to collect the money.”

### H-04 — Every section opens with the same heading pattern
Severity: Medium
Page or component: Homepage from “Ethiopia’s safety net” through the FAQ
What feels impersonal: Each block is an eyebrow, a heading with one italic phrase, then a grid. The payout steps are the only place the page changes shape, and they sit under yet another matching heading.
Who notices: A visitor who has scrolled for a minute and can no longer tell which section matters.
Concrete change: Keep the hero and the payout steps as the two large moments. Remove the duplicated exclusion list (U-04). Let the calculator sit on a plain background with one large result, and drop the eyebrow on the news and documents bands.

### H-05 — The Fund’s people are still initials and job titles
Severity: Medium
Page or component: Governance
What feels impersonal: Leadership is names, roles and initials. The only photograph on the homepage is a dark conference hall. A worried depositor cannot see who would answer the phone.
Who notices: A depositor or a bank officer who wants a person, not a logo.
Concrete change: Use photographs the Fund already has or can take: the board in the Sengatera office, and a portrait of the Chief Executive Officer with their name and a one-line duty (“Signs off payouts”). Do not use portraits copied from the web. One office photograph is enough; do not add a gallery.

### H-06 — A few small moments still sound like a system
Severity: Low
Page or component: Newsletter button, footer line, calculator empty hint
What feels impersonal: The newsletter button shows “…” while it sends. The footer says “Protecting depositors and contributing to the stability of Ethiopia’s financial system.” The calculator’s empty hint is already plain (“Enter a balance to see how much is protected.”) and should stay.
Who notices: Someone subscribing, and anyone who reads the footer as the Fund’s voice.
Concrete change: Newsletter pending label: “Sending…”. Footer: “We protect depositors, and we are here if a bank or microfinance institution fails.” Leave the calculator hint as it is.

### H-07 — Trust is mostly present; the missing piece is a date
Severity: Medium
Page or component: Coverage, payout, and the homepage figures
What feels impersonal: The legal basis (Regulation No. 482/2021), the National Bank of Ethiopia, the Zemen Bank address, three phone numbers and the scam warning are all visible. Nothing on the coverage figures says when they were last checked. “About 171 million of 176 million” can go stale with no visible date.
Who notices: A journalist, and a depositor comparing the site with a rumour.
Concrete change: Under the three figures, add “Figures checked 15 November 2026 against the 2024/25 annual report.” Update that sentence when the numbers change. Add the same “Updated …” line on the payout page.

### H-08 — Leave these alone
Severity: Low
Page or component: Hero, scam banner text, payout timeline, contact form, 404, admin sign-in
What feels impersonal: Nothing in this list. These already sound like a person.
Who notices: Changing them would make the site worse.
Concrete change: Do not rewrite the hero paragraph (“If a licensed bank or microfinance institution in Ethiopia fails…”), the line “A bank run starts with a rumour and a queue at the door.”, the scam banner (“The Fund never asks for passwords.”), the four payout steps, the contact line “Please do not include account numbers or passwords.”, the 404 (“We couldn’t find that page.” plus the three links), or the admin sign-in sentence about the 6-digit code.

## Ten changes that would most improve how human the site feels

1. Unpublish “Draft title change” and stop drawing “On air / Addis Gebeya” (and the other two invented posters) on news cards.
2. Point the scam banner at a short “how to tell a fake message” note, and name that link.
3. Put a “Figures checked …” date under the 97% / Birr 100,000 / 93 members line.
4. Rewrite the Kenya story summary in the words in H-02.
5. Rewrite the payout FAQ sentence in the words in H-03.
6. Say “microfinance institution” in the calculator, not “MFI”.
7. Add one real office photograph and the Chief Executive Officer’s name and duty on Governance.
8. Remove the second, full exclusion list from the homepage so the calculator arrives sooner.
9. Replace the footer slogan with the sentence in H-06.
10. After an editor saves a draft, tell them in one sentence that visitors cannot see it yet.

## Admin review

Signed in as the local Super Admin demo account (`admin@edif-demo.test`, from `scripts/demo-users.ts`) at http://localhost:3100/admin. Looked at the dashboard, the pages list, the Home page editor, the news list and the users list, at desktop width and at 390×844. No content was saved, published or deleted.

### U-06 — Recent activity is a raw log, and the same test rows fill it
Severity: Medium
Page or component: Dashboard, Recent activity
What is wrong: Each line is `email · action · collection · title · timestamp`, for example `nobody@edif-cms.org · security · users · nobody@edif-cms.org`. Seven identical security rows from a test run occupy the list. A person used to WordPress cannot tell a failed sign-in from a published page.
Who it affects: Super Admins and Auditors opening the dashboard.
Concrete fix: Use the plain sentences the audit summary already knows (“X signed in”, “Failed sign-in for Y”). Hide rows whose actor is a test address, and collapse repeats into “7 failed sign-in attempts”.

### U-07 — “Closing within 14 days” does not say what is closing
Severity: Medium
Page or component: Dashboard, Needs attention
What is wrong: The tile lists “Senior Risk Analyst” with no word that it is a vacancy, and no closing date. A tender and a vacancy are mixed in the same list.
Who it affects: The person who has to extend a deadline.
Concrete fix: Prefix each line: “Vacancy · Senior Risk Analyst · closes 28 Nov 2026”. Do the same for tenders.

### U-08 — “and 26 more” on the SEO tile goes nowhere
Severity: Medium
Page or component: Dashboard, Search (SEO) checks
What is wrong: The tile shows 29 problems, links the first three, then a plain line “and 26 more” that is not a link.
Who it affects: The SEO Manager or Super Admin who is supposed to fix the missing descriptions.
Concrete fix: Make that line a link to Page search settings, filtered to pages with an empty description.

### U-09 — Home hero badges are labelled “Partner”
Severity: Medium
Page or component: Home page editor, `partners` array in `src/blocks/design.ts`
What is wrong: The three lines under the intro (“Accountable to the National Bank of Ethiopia”, the regulation, “Operating since 2023”) open as “Partner 01”, “Partner 02” and “Partner 03”. The group label “Small badges under the intro” is easy to miss. An editor looking for the regulation line will not search for Partner.
Who it affects: Anyone editing the homepage.
Concrete fix: Rename the rows to “Badge 01”, and set the array label to “Lines under the intro”.

### U-10 — On a phone, page rows lose their actions and the path is cut off
Severity: Medium
Page or component: Pages list at 390px wide
What is wrong: The document does not scroll sideways. The path column is clipped (`/about/governanc`) and Status, Edit, Preview and Trash sit past the edge with no way to reach them. The All / Published / Draft counts and the search box do fit, and the intro sentence about two-step review is readable.
Who it affects: A staff member who opens the admin on a phone.
Concrete fix: Under 700px, show one card per page: title, path, status, then Edit, Preview and Trash as buttons. Keep the table for wider screens.

### U-11 — Test records sit in the live lists
Severity: Low
Page or component: Pages list and News list
What is wrong: Pages includes “Custom test”. News is sorted with “Draft title change” first, and that article is published (the public homepage shows it). The users list is full of Demo and `@edif-cms.org` test accounts, with roles labelled clearly (Super Admin, Editor, Publisher, SEO Manager, Auditor (read-only)).
Who it affects: Staff who cannot tell practice data from the Fund’s content, and every visitor who sees the test news item.
Concrete fix: Unpublish or trash “Draft title change” and “Custom test” before launch. Keep the demo accounts off the production database.

What already works in the admin: the sign-in page names the Fund and explains the 6-digit code. The dashboard greeting, the gold “+ New page” action, and the Needs attention counts are understandable. The pages list has All / Published / Draft and a Trash view. The Home editor’s Publish box states “Published”, the last change, and offers Preview, Save draft and Publish changes. User roles use plain names rather than the internal values.

## Areas checked with no issues

- Production CSP: a new nonce per request (`btoa` of a UUID), `script-src` with `'nonce-…'` and `'strict-dynamic'`. `style-src 'unsafe-inline'` does not run script. Dev omits CSP on purpose. The maintenance page sets its own nonce in production.
- Content cache: queries use published documents only, keys are known paths and slugs, and `revalidateTag('site-content', { expire: 0 })` runs on change. Random URLs do not create cache entries. Drafts do not enter the cache.
- `passedTwoFactor` is the gate on preview, the dashboard and media reads other than the static file URL.
- Password reset writes an audit row and emails the account. Password fields are omitted from audit diffs.
- Custom HTML create access, news field lock for SEO, and the image re-encode / SVG rejection path are unchanged and still hold.
- Redirects reject protocol-relative targets and a host containing `@`.
- PDF size cap is `upload.limits.fileSize` at 20MB with `abortOnLimit`. Encrypted PDFs are rejected.
- Scheduled publish and version restore still pass through the collection `beforeChange` hook, so the publish guard runs.
- Phone homepage: no horizontal overflow; headline and primary button are on screen. 404 offers Home, the calculator and member institutions. Contact form tells people not to send account numbers. Admin login names the Fund and explains the authenticator step.
