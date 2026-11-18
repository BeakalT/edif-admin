# EDIF website administration handbook

For Super Admins, Publishers, Editors, SEO Managers and Auditors. Written in plain words.

## 1. Who can do what

| Role | Can do |
|---|---|
| Super Admin | Everything: users, settings, trash emptying, activity log, exports |
| Publisher | Review and publish, request changes, schedule, move to trash, menus, look and feel, notices, inbox |
| Editor | Write and edit drafts, upload files, submit for review. Cannot publish |
| SEO Manager | Edit search and sharing settings, redirects, page search settings |
| Auditor | Read-only: activity log, exports, dashboard |

**Many people can hold the Publisher role.** The two-person rule needs at least two Publishers (or one Publisher and one Super Admin) so someone else can always approve your work.

## 2. Signing in

1. Open `/admin`. Enter your email and password.
2. First time only: scan the QR code with an authenticator app (Google Authenticator, Microsoft Authenticator, Authy) and enter the 6-digit code.
3. Every sign-in asks for the code. Sessions end after 2 hours.
4. Five wrong passwords lock the account for 15 minutes. A Super Admin can unlock it.
5. Passwords: at least 12 characters, upper and lower case, a number and a symbol, nothing guessable (no "ethiopia", "edif", names, repeats).
6. Lost phone: ask a Super Admin to use **Reset two-factor** on your account. You set it up again at next sign-in.

## 3. The dashboard

The first screen shows what needs attention: items waiting for review, items sent back with a note, new contact messages, scheduled publishing, tenders and vacancies closing within 14 days, accounts without two-factor, security events, visits, search (SEO) checks and the last backup.

## 4. Writing and publishing (the two-person rule)

Everything that changes what visitors see goes through two people:

1. **Editor** creates or edits the item and chooses **Review: Ready for review**, then **Save draft**. A Publisher is emailed.
2. **Publisher** opens it, uses **Preview** to see it exactly as visitors will, then either:
   - **Publish**, or
   - sets **Review: Changes requested**, writes a note, saves. The editor is emailed the note.
3. The person who last changed an item can never be the one who publishes it. This is enforced by the system.

Exceptions: **Notice banners** can be published by one Publisher (urgent messages). Taking something offline (unpublish) or moving it to the trash can be done by one Publisher. **SEO, redirects, menus, look and feel and site settings** do not need a second person, but every change is logged.

**Key figures** (coverage limit, depositors, premiums) always need two people, and each shows its source and date on the site.

### Preview
Open any page, news item, tender, vacancy or event and press the **Preview** icon (box with an arrow) left of Save Draft. It shows the latest saved draft. Only signed-in staff can see it.

### Scheduling
In an item, open the small arrow next to **Publish** and choose **Schedule Publish** to set a date and time. A Publisher other than the last editor must schedule it. If anyone changes the content afterwards, the schedule is cancelled and must be set again, so nothing unreviewed goes out.

### Trash
In the same arrow menu, **Delete** moves an item to the trash. Open the Trash view of a list to **Restore** it. Only a Super Admin can delete permanently.

## 5. Pages

**Pages → Create New.** Give it a title and an address such as `/about/our-history`. Add blocks in any order:
Page heading, Text, Cards, Key figures, Questions and answers, Latest news, Publications, People, Photo gallery, Video (YouTube or Vimeo only), Downloads, Highlighted note, Call to action, Table.

### Editing the existing pages (Home, About, Deposit protection, Members)

Every page of the site now opens under **Pages** and is built from sections. Open the page, then:

- **Change text, numbers, buttons, links and photos.** Open a section and edit the fields (for example the counters in the Home hero, the 7.34bn style numbers in a Numbers grid, the steps in the payout timeline). Numbers that come from Key figures stay in sync if you pick the figure's key.
- **Rearrange.** Drag a section by its handle to move it up or down. Use the arrows or the menu to duplicate or remove it.
- **Add.** "Add block" offers: Designed section (a heading with any of the content blocks inside it), Page banner, Dark band, Keep-reading links, and all the ordinary blocks.
- **Section settings** (at the bottom of every section): an anchor for links like `/page#anchor`, a background (white, light blue, cream, dark blue), spacing (compact, normal, roomy), and **Hide** to take a section off the site without deleting it.
- **Custom HTML and CSS.** Add a "Custom HTML and CSS" block. Only a Super Admin can edit its HTML and CSS. Scripts, frames, forms, inline styles and external files are removed automatically, and the CSS applies to that section only. It goes live only after a different Publisher approves it, like any other change (a Super Admin can publish it directly).
- If a page is unpublished or deleted, the site falls back to its original designed layout, so a mistake cannot leave the address empty.

Live member counts (banners, the member counter, the ticker) always follow the Members list.

## 6. News, publications, FAQs, members

- **News**: rich text keeps bold, italic, links, lists and images. Add an image and fill in its description (alt text).
- **Publications**: upload the PDF or paste a link; newest first.
- **Member institutions**: edit one by one, or **Download CSV**, change in a spreadsheet, and **Import CSV**. Imports become drafts and still need review. Bad rows are rejected with the row number and nothing is imported.

## 7. Media library

Upload JPEG, PNG, WebP, AVIF or PDF. Files are checked: the content must match the type, hidden data (GPS position, camera, PDF author and title) is removed. If a virus scanner is connected, infected files are refused.
**A file in use cannot be deleted or trashed.** The error says where it is used. Replace it there first.

## 8. Menus, logo, colours

- **Menus**: main menu with drop-downs, footer columns, header button. Changes are live within seconds.
- **Look and feel**: three colours, two fonts, logo (colour and white). Colours are checked for readability and refused if text would be hard to read. Tick **Reset to defaults** and save to go back to the EDIF look. Remove the logo and tick **Show the text name** to show text only.

## 9. Notices, tenders, vacancies, events, people

- **Notice banner**: one banner across the top of every page. Choose severity (information, warning, urgent), optional link and expiry. Visitors can dismiss it.
- **Tenders**: closing date is exact. After it passes the tender moves to the archive automatically.
- **Vacancies**: disappear from the list after the closing date.
- **Events** and **People** (board, management, staff) work like news.

## 10. Inbox and newsletter

- **Contact messages**: every message from the website form. Set status (new, in progress, answered, spam) and add internal notes. Spam is blocked by a hidden field, a minimum fill-in time and rate limits.
- **Newsletter subscribers**: people confirm by email (double opt-in) and can leave with one click. The list is for your mail tool. Only mail **Confirmed** addresses. Sending is not done from this system.

## 11. Search and SEO

- **Page search settings**, **Redirects**: edit search title, description and image per page.
- The dashboard lists checks: missing descriptions, titles too long, images without alt text, redirect chains.
- Visitors can search the whole site at `/search`.

## 12. Activity log

Every login, failed attempt, change, submission, publication and export is recorded and cannot be edited or deleted. Open **Audit log**; use the filters and **Download CSV**. Each download is itself logged.

## 13. Visit statistics

Counted per page per day with no cookies, no IP addresses and no personal data. Visitors who send Do Not Track are not counted.

## 14. Maintenance mode

**Site settings → Maintenance mode**: tick and save. Visitors see a "back soon" page; the admin stays available. Untick to reopen.

## 15. Backups (Super Admin / technical contact)

- Make one: `node scripts/backup.mjs` (database and media, kept 30 days in `backups/`). Run it nightly with cron, and copy `backups/` off the server regularly.
- Restore: stop the site, then `node scripts/restore.mjs backups/edif-YYYY-MM-DD-HH-MM`. The previous database is kept as `.before-restore`.
- On PostgreSQL later: use `pg_dump` plus a copy of the media folder.

## 16. Staging (practice copy)

Run a second copy of the site on another address with its own database and `.env` (`SITE_URL` set to the staging address). Test changes and new accounts there. Never copy production passwords or two-factor secrets to staging.

## 17. Settings the technical contact must set before going live

| Setting | Purpose |
|---|---|
| `PAYLOAD_SECRET` | Long random secret. Never share it |
| `SITE_URL` | Public address, https |
| `DATABASE_URL` | Database location |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM` | Email for invitations, resets and alerts. Without it emails are saved to `outbox/` only |
| `COOKIE_SECURE` | Leave unset (secure) on https. `false` only for local http testing |
| `CLAMAV_HOST`, `CLAMAV_PORT` | Optional virus scanner for uploads |
| Reverse proxy | Must pass the visitor address as `X-Real-IP` so rate limits work |

## 18. Security rules for everyone

1. Never share an account or a code. Each person has their own.
2. Never paste passwords or codes anywhere, including email and chat.
3. Staff email is only for the staff account. Report a lost phone or a suspicious email at once.
4. Leave the admin when you finish; sessions end after 2 hours anyway.
5. Anything unusual in the activity log: tell a Super Admin.

## 19. If something goes wrong

| Problem | What to do |
|---|---|
| "Only a Publisher can publish…" | Save as draft, mark Ready for review |
| "You cannot publish changes you made yourself" | Ask a different Publisher (Super Admins are exempt and publish directly) |
| "File is still used by…" | Replace it where it is used first |
| "Not readable enough" (colours) | Choose a darker main colour |
| Locked out | Wait 15 minutes or ask a Super Admin to unlock |
| Lost phone | Super Admin → Reset two-factor |
| Site shows "back soon" | Maintenance mode is on |
