# Runbooks

Plain steps for the people who run the system. Replace `<…>` with your values. Test every runbook once in staging before you need it.

## 1. First-time setup of an environment
1. Create: managed PostgreSQL 16, an S3-compatible bucket (private), an SMTP account, a secret store.
2. Generate secrets: `openssl rand -hex 32` for `PAYLOAD_SECRET` and for `REVALIDATE_TOKEN`.
3. Choose the admin path: `npm run set-admin-path -- <word>` (e.g. `console-x7k2`), commit, and set `ADMIN_PATH=/<word>`.
4. Fill the environment from `.env.example` (production: `NODE_ENV=production`, https `SITE_URL`, `TRUSTED_PROXY_HOPS` = number of proxies in front, SMTP, S3).
5. Release (section 2). The first Super Admin is created by an operator with the one-time CLI step in HANDBOOK → "First account".

## 2. Release (every deployment)
1. CI is green on the commit (types, lint, unit, database, API, browser, image).
2. Build images: `docker build -t edif-web:<tag> .` and `docker build --target migrator -t edif-migrate:<tag> .`
3. **Back up first** (section 4, "before a release").
4. Run migrations: `docker run --rm --env-file <env> edif-migrate:<tag>`. If it fails, stop; nothing has changed for visitors.
5. Start the new web container beside the old one. Wait for `/readyz` = 200.
6. Run `BASE_URL=<new container url> REVALIDATE_TOKEN=<token> node scripts/post-deploy.mjs`. It refreshes pages from the real database and checks the key pages.
7. Switch traffic to the new container. Watch errors for 15 minutes. Keep the old container for 24 hours.

**Rollback:** switch traffic back to the old container (instant). If the release included a migration, restore the pre-release backup only if the old version cannot run on the new schema; otherwise write a forward fix. Never edit the database by hand.

## 3. Staging
Staging is a full copy of the stack with its own database, bucket, secrets and SMTP (use a mail catcher). Refresh its data from production **backups only**, then run the sanitiser (remove subscriber emails and contact messages, replace staff emails). Staging is where editors rehearse risky changes and where every release is tried first.

## 4. Backups and restore
| What | How | Keep |
|---|---|---|
| Database | Provider's automated daily backup with point-in-time recovery | 7 daily (minimum agreed). Add weekly/monthly copies if records rules require |
| Uploads | Bucket versioning + a copy to a second account/region | Same as database |
| Secrets | Secret store export, sealed, held by two named people | Current + previous |
| Before a release | `pg_dump -Fc "$DATABASE_URL" > edif-pre-<tag>.dump` | 30 days |

**Restore test (monthly, to staging):** restore the latest backup to a fresh database → run the app against it → run `post-deploy.mjs` → open five pages and the admin → record the time it took. A backup that was never restored is not a backup.

**Restore for real:** stop writes (maintenance mode on), restore the database to the chosen time, restore uploads if needed, run `post-deploy.mjs`, maintenance off, tell editors what time range was lost.

## 5. Incident: site is down
1. `/healthz` fails → the container is dead: restart it; if it loops, read the logs and roll back (section 2).
2. `/healthz` ok but `/readyz` 503 → database unreachable: check the provider status and credentials; the app recovers by itself when the database returns.
3. Pages are old after a change → run `post-deploy.mjs`'s revalidate step manually (`POST /internal/revalidate`).
4. Large traffic spike (for example during a bank failure) → turn on CDN caching of HTML for 60 s, scale the CDN, keep one app instance, switch on the emergency static mirror if one is configured.
5. Write down: when it started, who noticed, what fixed it, what changes so it cannot repeat.

## 6. Incident: suspected account or data compromise
1. Admin → Users: lock the affected account; reset its two-factor; rotate `PAYLOAD_SECRET` if sessions may be stolen (everyone signs in again).
2. Read the audit log around the time (Administration → Audit log → Export). Security events are marked.
3. If published content was altered: restore the previous version (every page and article keeps its version history) and republish through the normal two-person flow.
4. Tell the Super Admins and the data owner. If personal data left the system, follow the Fund's legal notification duty.

## 7. Rotating secrets
| Secret | How |
|---|---|
| `PAYLOAD_SECRET` | Change it in the secret store, redeploy. Every session ends and everyone signs in again; accounts and two-factor enrolments are not affected (the secret signs session cookies; it does not encrypt authenticator keys). |
| `REVALIDATE_TOKEN` | Change in the store and in the pipeline. |
| Database / S3 / SMTP | Create the new credential, deploy with it, then revoke the old one. |
| Admin path | `npm run set-admin-path -- <new>`, update `ADMIN_PATH`, release, tell staff the new address. |

## 8. Routine
- Weekly: merge dependency updates after CI is green. Read the Dashboard's Site health.
- Monthly: restore test (section 4), review staff accounts and roles, review audit log security events.
- Quarterly: rehearse the incident runbooks; review rate-limit settings at the CDN.

## Notifications inside the admin (the bell)
- Every email the system already sends to staff (review requests, changes requested, publish/unpublish, new contact message, account locked, role changes, new sign-in location, two-factor reset) now also appears in the bell, for the same people.
- Extra bell-only notices: new account created (Super Admins), tender or vacancy closing within 3 days (Super Admins, Publishers), a failed scheduled publish, backups older than 48 hours (Super Admins).
- Each person sees only their own (collection `notifications`; enforced by access rules and tested). Read items are deleted after 30 days.
- The hourly task `dailyChecks` raises the deadline/failure/backup notices; each is sent once per person (dedupe key). It runs through the same job runner as scheduled publishing, so the app must have the job runner enabled (it is by default).
- Needs migration `20261115_074120_notifications` on PostgreSQL (`npm run migrate`).

## The emergency static copy
When the main site is down (or about to be taken down for a long repair), a plain-file copy keeps the public information available.
1. Build it: `node scripts/static-mirror.mjs mirror https://www.edif.gov.et` (run it nightly, and after major publishes).
2. Upload the `mirror/` folder to a static host at a second provider (object storage with website hosting, or a small nginx).
3. In an outage, change the `www` DNS record to that host. A red banner tells visitors forms and search are unavailable.
4. When the main site is back, point DNS back. Nothing else needs doing; the copy holds no data.

## Backup retention
`scripts/backup.mjs` keeps every backup for 14 days, one per week for 8 weeks and one per month for 12 months. Change the three numbers with `BACKUP_KEEP_DAILY`, `BACKUP_KEEP_WEEKLY`, `BACKUP_KEEP_MONTHLY`. Backup folders are named `edif-YYYY-MM-DD-HH-MM-SS`; restore with `node scripts/restore.mjs backups/<folder>`.

## Reading the audit log
Open Audit log. The tabs filter by kind (Edits, Publishing, Sign-ins, Security, Deletions) and each row is a plain sentence. Open a row for the before/after table. Locked accounts also raise a bell alert for Super Admins and Auditors. Export to CSV from the box above the list.

## Emergency two-factor reset (nobody can sign in as Super Admin)
Normally a Super Admin resets someone's two-factor in Users. If the only Super Admin lost their phone, whoever controls the server runs:
`npx payload run scripts/reset-2fa.ts admin@example.org`

Locked out after failed sign-ins (every Super Admin locked)? A server operator runs `npx payload run scripts/unlock-account.ts admin@example.org`. It clears the password lock and the authenticator-code lock, and is written to the audit log. Keep at least two Super Admin accounts; name who may run this command in `LAUNCH-READINESS.md`.
It clears the authenticator, unlocks the account and ends its sessions. The person signs in with their password and scans a new QR code. The reset is recorded in the audit log as "two-factor reset from the server console". Keep server access limited to the few people who may do this.

## Adding photos of board members and management
One person at a time: Admin → People → open the person → Photo → choose or upload an image → Publish changes (a Publisher other than the editor approves it).
Several at once: save the images in one folder named after each person (`solomon-desta.jpg`, `frezer-ayalew.jpg`), then run `npx payload run scripts/attach-photos.ts path/to/folder`. Matching ignores titles such as Ato and Dr. Until a photo is added, the card shows the person's initials.
Use portrait photos (about 4:5), at least 800 px wide, with the person's permission.
