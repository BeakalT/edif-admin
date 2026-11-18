# Implement the agreed homepage and admin changes

Revision: 18 Nov 2026, 17:20. Section 6 is new. If sections 1 to 5 are already done, do not redo them. Implement section 6.

Claude: this file is the whole task. Open `review/CLAUDE-IMPLEMENT-PROMPT.md` and implement it in the application. Do not expand the work past what is written here.

You are working in the EDIF public site and admin at this repo (Next.js 16, Payload 3.93, React 19). This version of Next.js differs from older ones. Before using a Next API, read the matching guide in `node_modules/next/dist/docs/`.

Do the work below. Do not redesign the site. Do not add sections, colours, type, or a new layout system. Do not add photographs from the web, and do not invent a person’s name. Do not commit unless asked. Do not open `.env` or print secrets.

## Leave these alone

Do not rewrite or restyle:

- The hero headline, tagline, and the paragraph that begins “If a licensed bank or microfinance institution in Ethiopia fails…”
- The line “A bank run starts with a rumour and a queue at the door.”
- The scam banner text “The Fund never asks for passwords.” Change only where its link goes, as specified below.
- The four payout steps
- The contact line “Please do not include account numbers or passwords.”
- The 404 page
- The admin sign-in sentence about the 6-digit code
- The about split (photo plus copy), the calculator-beside-steps layout, the payout timeline, and the FAQ with the phone number on the side
- Inner pages’ pale and white stripes

## 1. Homepage section design

The homepage is `src/site/pages/Home.tsx`. The coverage band (`#covered`) sits on the same `bg-ice` background as the about section, and it stacks four different components: `Crowd`, `Rules`, `Compare`, and `Ticker`.

- Remove `Crowd`, `Rules`, and `Ticker` from the homepage only. Do not delete those components. `Rules` is still used on the protection page.
- Keep `Compare` (the Covered and Not covered columns). The “See all 11 exclusions” control stays collapsed on the homepage. Do not print that full list outside the control.
- Take `bg-ice` off `#covered` so it is white and separates from the about section above it.
- Leave the payout steps as the one centered, ceremonial section.
- News and documents currently share the same pattern: a centered `SecHead` plus three equal cards. Keep documents as cards. Make the news row plain: photo when the article has one, otherwise only the date, title, and summary.

In `NewsCard` (`src/site/components/sections.tsx`), delete the decorative poster. These three lines must not render for any article:

- “On air / Addis Gebeya”
- “2024/25 Annual Report”
- “Birr 5.2bn / in nine months”

A card with no photo is text only. Do not invent a graphic.

## 2. Phone hero

In `src/site/styles/base.css`, the hero padding plus the stacked `.ledger` makes the hero taller than a phone screen. On viewports under 700px, reduce that spacing so the three figures (97%, Birr 100,000, and the member count) sit on the first screen with the headline on a 390×844 phone. Keep the photograph. Do not cause horizontal overflow.

## 3. Copy, with the exact words

Use these strings. Do not paraphrase them.

- Calculator empty option in `src/site/components/Calculator.tsx`: “Choose your bank or microfinance institution”.
- Footer line in `src/site/components/Layout.tsx`: “We protect depositors, and we are here if a bank or microfinance institution fails.”
- Under the three homepage figures, add: “Figures checked 15 November 2026 against the 2024/25 annual report.”
- Kenya news summary, in `scripts/seed-data/news.ts` and in the published news document the site is serving: “Our team went to Nairobi to see how Kenya’s deposit insurer pays people when a bank fails.” If the article body repeats “exposure and experience-sharing”, replace that phrase in the same spirit. Do not rewrite the rest of the article.
- Payout answer. Homepage FAQ seed in `scripts/seed-data/content.ts`, the payout callout in `src/site/pages/Protection.tsx`, and the same sentence in `scripts/seed3-protect.ts`. Replace the sentence about “administrative capacity” with: “The Fund chooses a bank with branches across the country and announces the bank, and the day payment starts, before you need to collect the money.”
- Scam notice: the published notice’s “Read more” link goes to `/faq`. Point it at a short explanation of what the Fund will never ask for, and set the link text to “How to tell a fake message”. A single new FAQ entry is enough. Do not build a new campaign page.

Where the live site reads from the database rather than the seed file, update the published record too. Do not reseed or wipe the database.

Unpublish or trash the news article titled “Draft title change” (summary “x”) and the page titled “Custom test”. Do not delete real articles, pages, or users.

## 4. Admin

- After an Editor saves a draft, show this at the top of the document: “Saved as a draft. Visitors cannot see it until a Publisher approves it.” Super Admins and Publishers, who can publish directly, do not need that sentence.
- Dashboard recent activity (`src/components/admin/Dashboard.tsx`) is `email · action · collection`. Use the plain audit sentences that already exist (for example “Failed sign-in for …”). Collapse identical repeated rows.
- “Closing within 14 days” lists a title alone. Prefix each line with Vacancy or Tender and the closing date. Example shape: “Vacancy · Senior Risk Analyst · closes 28 Nov 2026”.
- The search-health tile ends with “and 26 more”, which is not a link. Link it to the page-search list.
- The Home hero array field is named `partners`. Its labels already say Badge. Confirm the editor rows say “Badge”, not “Partner”. If they still say Partner, fix the row label. Do not rename the stored field.

On viewports under 700px, the pages list clips the path and hides Edit, Preview, and Trash, and the page does not scroll sideways. Show one card per page there: title, path, status, then those three actions. Keep the table on wider screens.

## 5. One leftover security check

Trash and restore in `src/hooks/publishGuard.ts` already write the live document back, so a Publisher cannot publish a draft by trashing and restoring. External redirects are already Super Admin only. Block and rich-text links already go through `safeHref`.

Do not reopen that work. Do check two leftovers:

- Unpublish still compares the request with the latest draft (`draft: true` around the unpublishing branch). Compare it with the published document, or reject the request when any field other than `_status` and the review meta fields is present.
- In `src/blocks/design.ts`, the `nextLinks` item URL and the `band` button URL do not use `validateLink`. Add it, and render those links through `safeHref`.

## 6. Admin design: human and professional

The admin structure stays. Change the skin in `src/app/(payload)/custom.scss` and the dashboard header in `src/components/admin/Dashboard.tsx`. The public site can stay ceremonial. The admin should look like a quiet office for a public institution: aligned, specific, and calm.

Keep the navy sidebar, the Publish box, the role names, the logo, and the sign-in sentence about the 6-digit code.

### Type

- Raleway at weight 700 for the page title only. Nunito Sans for everything else.
- Labels, the date, sidebar group names, and table headers are sentence case, 14px, semibold. No wide letter-spacing. No extra-bold capitals on those labels.
- The current uppercase tracking (about 0.14em to 0.16em) on `.edif-dash__date`, `.edif-dash__h`, `.nav-group__toggle`, `.table thead th`, `.edif-login-sub`, and `.blocks-field__block-pill` is what makes the admin look generated. Remove it.

### Colour, used for meaning

- Navy is the structure: the sidebar and the main button.
- Gold appears in two places only: the mark beside the sidebar item you are on, and anything that is waiting for a person.
- Blue is for links and the focus ring.
- Published, draft, and waiting-for-review each keep a small status chip.
- Remove gold from section headings, tile edges, page-builder row borders, and the active document-tab underline. Use a 1px grey border there.

### Surfaces

- Page background stays the pale navy-tinted grey. Work areas are white, with a 1px border and an 8px radius.
- A shadow sits on the sign-in card and the Publish box only. Lists, tables, and page-builder rows are flat.
- Remove the hover lift (`translateY`) on buttons and cards.
- Sign-in background becomes a flat navy field. Remove the two radial glows in `.template-minimal`.
- Dashboard hero: remove the gradient rings (`.edif-dash__hero::after`) and the capsule button row. The header is left-aligned on a plain surface, not a gradient card.

### One action per screen

- Dashboard header, in this order: the date in normal type, “Good afternoon, [name]”, one plain sentence, and a single gold “New page” button.
- “News article”, “Upload a file”, and “View the website” sit under that button as text links.
- “Needs attention” is one white panel of rows. Each row is a status word, a title, and a date. When nothing is waiting, the panel says “Nothing is waiting.” and stops. Do not draw a card with a giant 0 for an empty count.
- Sidebar group labels are a quiet light colour on the navy, not gold poster type. The current item keeps a short gold mark.

## Done when

- The homepage order is: hero, about, covered/not-covered columns, calculator, payout steps, plain news, document cards, FAQ.
- A 390px-wide homepage shows the three hero figures with the headline, and does not overflow sideways.
- No card says “On air”, “Addis Gebeya”, “Draft title change”, or “2024/25 Annual Report” as a poster.
- The footer, calculator label, Kenya summary, and payout sentence match the words above.
- An Editor’s draft save states that visitors cannot see it yet.
- You have not changed the hero paragraph, the bank-run paragraph, the payout steps, the 404, or the admin sign-in sentence.
- The admin sign-in background is flat navy. The dashboard header is a plain left-aligned block with one gold button. Empty attention counts are one sentence, not a card with 0. Gold is only the active sidebar mark and items waiting for a person. Buttons and cards do not lift on hover.
