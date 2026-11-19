# EDIF server runbook: deploy, then prove the nine launch checks

For the client's IT / server operator. It does not change code. Nothing here ticks a box: the operator runs each step on the **real server**, pastes the output into the "Evidence" lines, and the Fund's named owner ticks the box in `LAUNCH-READINESS.md`.
Full deploy steps are in `RUNBOOKS.md` sections 1 and 2; this file only adds the checks.

Fill in: `SITE=https://www.edif.gov.et`  `ADMIN=<admin hostname>`  `APP=<internal app address>`  `ENV=<path to .env.production>`

## Part 0. Deploy first (the checks need a running system)
1. Create managed PostgreSQL 16, a private S3 bucket, an SMTP account, a secret store (`RUNBOOKS.md` §1).
2. `openssl rand -hex 32` twice: one for `PAYLOAD_SECRET`, one for `REVALIDATE_TOKEN`.
3. Fill `.env.production` from `.env.example`. Set `TRUSTED_PROXY_HOPS` to the real number of proxies in front. Do **not** set `COOKIE_SECURE`.
4. Back up, migrate, start, wait for `/readyz` = 200, run `post-deploy.mjs` (`RUNBOOKS.md` §2).
5. Create the first Super Admin (`HANDBOOK.md`, "First account").
6. Put a staging copy first if you can: same steps, own database and bucket, mail catcher.
Pass: `curl -s -o /dev/null -w '%{http_code}\n' $SITE/readyz` prints `200`.

## Check 1. Proxy setting matches reality, and the app is not reachable around the proxy
A. `grep -E '^(TRUSTED_PROXY_HOPS|CLIENT_IP_HEADER)=' $ENV` shows a number above 0, or a header name. The count equals the proxies/CDNs actually in front.
B. From a machine **outside** the server network: `curl -m 5 http://<app public IP>:3000/healthz`. Pass: connection refused or timeout.
C. Spoof test, from outside: send 35 sign-ins with a different `X-Forwarded-For` each time:
`for i in $(seq 1 35); do curl -s -o /dev/null -w '%{http_code} ' -X POST $SITE/api/users/login -H "X-Forwarded-For: 10.0.$i.1" -H 'content-type: application/json' -d '{"email":"nobody@example.org","password":"x"}'; done`
Pass: `429` appears (the faked headers did not give each attempt a fresh allowance).
Evidence: ______

## Check 2. Admin accepts staff networks only
From a network that is **not** a staff network (for example a phone on mobile data): `curl -m 8 -s -o /dev/null -w '%{http_code}\n' https://$ADMIN/admin`
Pass: refused, timeout, 403 or 404. From a staff network the sign-in page loads (200).
Evidence: ______  (If it loads from anywhere, the lock-out risk G-12 is still open; do not tick.)

## Check 3. At least two Super Admins; a named operator can unlock
A. Admin > Users, filter role = Super Admin: two or more active accounts, each signed in once, each with the authenticator set up.
B. Name the operator: ______ . They have run once on staging: `npx payload run scripts/unlock-account.ts <email>` and it unlocked the account.
Evidence: ______

## Check 4. No demo accounts in the live database
`psql "$DATABASE_URL" -c "select count(*) from users where email like '%@edif-demo.test';"`
Pass: `0`. Also run it with `ilike` and confirm `0`.
Evidence: ______

## Check 5. Secrets are long enough and cookies are secure
A. `awk -F= '/^REVALIDATE_TOKEN=/{print length($2)}' $ENV` prints 32 or more. (Never paste the token.)
B. `grep -c '^COOKIE_SECURE' $ENV` prints `0`.
C. After signing in once: `curl -si -X POST $SITE/api/users/login -H 'content-type: application/json' -d '{"email":"<real account>","password":"<password>"}' | grep -i '^set-cookie'` shows `Secure` and `HttpOnly`. Use a test account and change its password afterwards.
Evidence: ______

## Check 6. One app instance
`docker ps --filter name=web --format '{{.Names}}'` (or the platform's equivalent) lists exactly one web container. Record that launch runs one instance; a second instance doubles the rate limits (`src/proxy.ts`).
Evidence: ______

## Check 7. No unpublished PDF uploaded before go-live
Admin > Media, list every PDF/document. For each: is it used by a **published** page or article? Pass: none is a tender pack, draft minutes or draft report. Files download by exact address even when only a draft uses them.
Evidence (count checked, count removed): ______

## Check 8. PostgreSQL backups, encryption, restore drill
A. Provider's automated daily backup is on, with encryption at rest, and a copy in a second account or region.
B. Restore drill on **staging**: `pg_dump -Fc "$DATABASE_URL" > edif-drill.dump`, restore into a fresh empty database, point the app at it, run `BASE_URL=<staging> REVALIDATE_TOKEN=<token> node scripts/post-deploy.mjs`, open five pages and the admin. Write down how long it took: ______ minutes.
Note: `scripts/backup.mjs` covers SQLite only. Do not use it on the live PostgreSQL.
Evidence: ______

## Check 9. Legal text and security.txt
A. Privacy notice, terms and the retention period are approved in writing by the client's lawyer: reference ______ .
B. `curl -s -o /dev/null -w '%{http_code}\n' $SITE/.well-known/security.txt` prints `200`, and its `Contact:` address is monitored by a named person: ______ . Send a test mail to it and confirm it arrives.
Evidence: ______

## Sign-off
| Check | Passed (date) | By | Box ticked by (Fund owner) |
|---|---|---|---|
| 1 | | | |
| 2 | | | |
| 3 | | | |
| 4 | | | |
| 5 | | | |
| 6 | | | |
| 7 | | | |
| 8 | | | |
| 9 | | | |
