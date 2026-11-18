EDIF website + admin: local test copy (version 10)
=================================================

START
1. Stop any older copy that is running (close its Terminal window or press Ctrl+C).
2. Open Terminal and run:   cd ~/Downloads/edif/v4/edif-admin && bash run.sh
   (the first start installs and builds, a few minutes; later starts take seconds)
3. Website:  http://localhost:3100
   Admin:    http://localhost:3100/admin
Stop with Ctrl+C. Needs Node.js 20 or newer (https://nodejs.org, LTS).
The full guide for administrators is in HANDBOOK.md.
NEW IN THIS VERSION: every page (Home, About, Deposit protection, Members) is now editable section by section in Admin > Pages: change text and numbers, rearrange, hide, add sections, and (Super Admin only) add custom HTML and CSS.

DEMO ACCOUNTS (local test only, not real accounts)
  Super Admin  admin@edif-demo.test       Orange-Tiger-Lamp-49x
  Publisher 1  publisher@edif-demo.test   Silver-Maple-River-83q
  Publisher 2  publisher2@edif-demo.test  Quiet-Harbor-Stone-27k
  Editor       editor@edif-demo.test      Brave-Cedar-Window-65m
  SEO Manager  seo@edif-demo.test         Golden-Falcon-Bridge-31v
  Auditor      auditor@edif-demo.test     Calm-Meadow-Anchor-58t

FIRST SIGN-IN: each account makes you set up two-factor. Scan the QR code with an
authenticator app (Google Authenticator, Microsoft Authenticator, Authy) and enter the
6-digit code. To try several roles, use a private window per role and a separate entry
in the app for each.

NEW IN THIS VERSION, THINGS TO TRY
1. Dashboard: the first admin screen shows what needs attention for your role.
2. Pages: Pages > Create New. Add blocks (text, cards, key figures, video, table...).
   Save draft, press the Preview icon, then have a different Publisher publish it.
   A sample page is at http://localhost:3100/example-page
3. Request changes: as Editor submit an item ("Ready for review"). As Publisher set
   Review to "Changes requested" with a note. The note is emailed (see the outbox folder).
4. Schedule: open the arrow next to Publish > Schedule Publish (needs a different Publisher).
5. Trash: arrow next to Publish > Delete moves an item to the trash; restore from Trash.
6. Media: upload a photo, use it in an article, then try to delete it (refused while used).
   Uploaded photos lose their GPS and camera data.
7. Menus and Look and feel (Administration): change the menu, a colour, remove the logo.
   Try a very light main colour: it is refused as unreadable.
8. Notice banner: create one, Publisher publishes it alone, it shows on every page.
9. Tenders, Vacancies, Events, People, Key figures (always two-step with source and date).
10. Contact form (http://localhost:3100/contact): send a message, read it under Inbox.
    Newsletter box in the footer: confirmation email appears in the outbox folder.
11. Member institutions: Download CSV, edit, Import CSV (comes in as drafts).
12. Audit log: filters and Download CSV. Site settings: Maintenance mode.
13. Search: http://localhost:3100/search

BACKUP:  node scripts/backup.mjs        RESET the demo:  stop the site, then  bash reset.sh
ADMIN LOOK: redesigned (EDIF navy and gold, new dashboard, branded sign-in, clearer page editor).
Light and dark both work: account icon (top right) > Account > Theme (Auto, Light or Dark).
