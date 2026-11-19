# EDIF server runbook: deploy, then prove the nine launch checks

For the client's IT / server operator. It does not change code. Nothing here ticks a box: the operator runs each step on the **real server**, pastes the output into the "Evidence" lines, and the Fund's named owner ticks the box in `LAUNCH-READINESS.md`.
Full deploy steps are in `RUNBOOKS.md` sections 1 and 2; this file only adds the checks.

Fill in: `SITE=https://www.edif.gov.et`  `ADMIN=<admin hostname>`  `ADMIN_PATH=<the real admin path from .env.production, not /admin if it was changed>`  `ORIGIN=<public IP of the app server>`  `ENV=<path to .env.production>`

Rules for every check: never paste a password, token or session cookie into a chat or ticket; never type one on the command line (it lands in shell history); run drills against **staging**, never production; a check passes only on the exact condition written, and a result you cannot explain is a fail.

## Part 0. Deploy first (the checks need a running system)
Follow `RUNBOOKS.md` §1 and §2, plus these steps, which those sections leave out:
1. **Count the proxies.** List every hop between a visitor and the app (CDN, load balancer, reverse proxy). `TRUSTED_PROXY_HOPS` equals that number. If the CDN sets one trusted header, use `CLIENT_IP_HEADER` instead. Write the hop list here: ______
2. **DNS and certificate.** The public name points at the proxy, not at the app server. The certificate is valid and covers `www` and the admin hostname: `curl -sSI $SITE | head -1` shows `200` or a redirect with no certificate error.
3. **Ports.** The app server accepts connections only from the proxy: 3000 (and 80/443 on the origin, if any) closed to everyone else. Write the firewall rule here: ______
4. **Never run `scripts/demo-users.ts` or the demo seed against this database.** They create accounts with known passwords. Check 4 proves none exist.
5. **Second Super Admin** is created before launch (Check 3), not after.
6. Back up, migrate, start, run `post-deploy.mjs` (token supplied as an environment variable, see Check 8).
7. `/readyz` = 200 only proves the process can reach its database. It does not prove the public site, TLS or any check below.

## Check 1. Proxy setting matches reality, and the app is not reachable around the proxy
A. `grep -E '^(TRUSTED_PROXY_HOPS|CLIENT_IP_HEADER)=' $ENV` shows a number above 0 or a header name that matches the hop list in Part 0.
B. **Origin closed.** From a machine outside the server network, scan the origin: `nmap -Pn -p 80,443,3000,3100 $ORIGIN`. Pass: every port closed or filtered (or open only to the proxy's addresses, shown by trying from outside). Also: `curl -m 5 http://$ORIGIN:3000/healthz` is refused or times out.
C. **Hop count not too small.** Use two different networks outside the office (for example two phones on different mobile providers), A and B. From A send 35 sign-ins: `for i in $(seq 1 35); do curl -s -o /dev/null -w '%{http_code} ' -X POST $SITE/api/users/login -H 'content-type: application/json' -d '{"email":"nobody@example.org","password":"x"}'; done`. Expect `429` near the end. **Then immediately** send one sign-in from B. Pass: B gets 401 (not 429). If B also gets 429, every visitor shares one address: `TRUSTED_PROXY_HOPS` is too small, do not tick. Network A is blocked for 15 minutes afterwards.
D. **Header cannot be forged.** From A, repeat C but add `-H "X-Forwarded-For: 10.0.$i.1"` to each attempt. Pass: `429` still appears. If `CLIENT_IP_HEADER` is used, also add that header with a different value each time; pass: `429` still appears.
Evidence: ______

## Check 2. Admin accepts staff networks only
From a network that is **not** a staff network (a phone on mobile data): `curl -m 8 -sS -o /dev/null -w '%{http_code}\n' https://$ADMIN$ADMIN_PATH/login`
Pass **only** on connection refused or timeout (curl exits non-zero, no status printed). Any HTTP status, including 403 or 404, means the host answered and the network did not block it: fail. Use the real admin path, not `/admin`, if it was changed. From a staff network the sign-in page loads.
Evidence: ______  (If it answers from anywhere, G-12 is still open: do not tick.)

## Check 3. At least two Super Admins; a named operator can unlock
A. Admin > Users, filter role = Super Admin: two or more active accounts, each signed in once, each with the authenticator set up.
B. Name the operator: ______ . They ran once on **staging**, with the staging env file loaded for that one command only (`set -a; . <staging env>; set +a; npx payload run scripts/unlock-account.ts <email>`), and the account unlocked. A shell that already holds the production environment would unlock a production account: open a fresh shell first.
Evidence: ______

## Check 4. No demo accounts in the live database
`psql "$DATABASE_URL" -c "select count(*) from users where email ilike '%@edif-demo.test';"`
Pass: `0`. (This checks the demo email domain only, not a demo password reused on a real address; Part 0 step 4 covers that by never running the demo scripts.)
Evidence: ______

## Check 5. Secrets are long enough and cookies are secure
A. Token length without quotes and without printing it: `awk -F= '/^REVALIDATE_TOKEN=/{v=$2; gsub(/["'"'"' ]/,"",v); print length(v)}' $ENV` prints 32 or more. If the platform's secret store sets it instead of the file, check its length there.
B. `COOKIE_SECURE` is not set in the file **or** in the platform's environment settings. (A public production start already refuses `COOKIE_SECURE=false`; this confirms nobody set `true`/other values by hand either.)
C. Cookie flags, in the browser: sign in with a test account, press F12 > Application > Cookies, and confirm the session cookie shows `Secure` and `HttpOnly`. Do not use curl with a password, and do not paste cookie values anywhere.
Evidence: ______

## Check 6. One app instance
Check **every** place the app can run: the platform's replica/instance count for the web service (must be 1), every host, and any container not named `web`: `docker ps --format '{{.Names}} {{.Image}}'` on each host. Record that launch runs one instance; a second instance doubles the rate limits (`src/proxy.ts`).
During a release `RUNBOOKS.md` §2 keeps the old container for 24 hours: that is two instances. Either stop the old container before ticking, or write down that limits are doubled for those 24 hours and the Fund accepts it.
Evidence: ______

## Check 7. No unpublished PDF uploaded before go-live
Manual review, no command: Admin > Media, open **every** PDF/document and check that a **published** page or article uses it. A pass based on file names leaves the risk open, because a draft file still downloads at its exact address. Pass: none is a tender pack, draft minutes or draft report. Remove any that is.
Evidence (count checked, count removed, reviewer): ______

## Check 8. PostgreSQL backups, encryption, restore drill
A. **In the provider's console** (screenshot it): automated daily backups on, encryption at rest on, a copy in a second account or region. A restore drill does not prove these.
B. **Restore drill, staging only.** Never point the live app at the drill database. Read the token without echoing it and without putting it on the command line:
`read -rs REVALIDATE_TOKEN; export REVALIDATE_TOKEN`
`pg_dump -Fc "$STAGING_DATABASE_URL" > edif-drill.dump` (this file is an unencrypted copy of the database: keep it on an encrypted disk)
Restore into a fresh empty database, point the **staging** app at it, run `BASE_URL=<staging url> node scripts/post-deploy.mjs`, open five pages and the admin, write down the minutes taken: ______
Then delete the dump and the restored database, and `unset REVALIDATE_TOKEN`.
Note: `scripts/backup.mjs` covers SQLite only. Do not use it on the live PostgreSQL.
Evidence: ______

## Check 9. Legal text and security.txt
A. The privacy notice, terms and retention period are approved in writing by the client's lawyer: reference ______ . That written approval is the proof, not a web page.
B. `security.txt` is **not served by the application yet** (S-09), so `curl -s -o /dev/null -w '%{http_code}\n' $SITE/.well-known/security.txt` returns 404 until someone adds it (via the proxy, or a code change with the lawyer's text). When it returns 200, confirm the `Contact:` address belongs to a named person: ______ .
C. Send a test mail to that address and confirm it arrives (this is the useful part).
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
