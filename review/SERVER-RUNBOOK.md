# EDIF server runbook: deploy, then prove the nine launch checks

For the client's IT / server operator. It does not change code. Nothing here ticks a box: the operator runs each step on the **real server**, pastes the output into the "Evidence" lines, and the Fund's named owner ticks the box in `LAUNCH-READINESS.md`.
Full deploy steps are in `RUNBOOKS.md` sections 1 and 2; this file only adds the checks.

Fill in: `SITE=https://www.edif.gov.et`  `ADMIN=<admin hostname>`  `ADMIN_PATH=<the real admin path from .env.production, not /admin if it was changed>`  `ORIGIN=<public IP of the app server>`  `ENV=<path to .env.production>`

Rules for every check: never paste a password, token or session cookie into a chat or ticket; never type one on the command line (it lands in shell history); run drills against **staging**, never production (except Checks 4, 5 and 7, which prove facts about production and must be run against it); a check passes only on the exact condition written, and a result you cannot explain is a fail.

## Part 0. Deploy first (the checks need a running system)
Follow `RUNBOOKS.md` §1 and §2, plus these steps, which those sections leave out:
1. **Count the proxies.** List every hop between a visitor and the app (CDN, load balancer, reverse proxy). `TRUSTED_PROXY_HOPS` equals that number. If the CDN sets one trusted header, use `CLIENT_IP_HEADER` instead. Write the hop list here: ______
2. **DNS and certificate.** The public name points at the proxy, not at the app server. The certificate is valid and covers `www` and the admin hostname: `curl -sSI $SITE | head -1` shows `200` or a redirect with no certificate error.
3. **Ports.** The app server accepts connections only from the proxy, on **every** address it has (IPv4 and IPv6) and every port, not just 80, 443 and 3000. Check 1B proves it. Write the firewall rule here: ______
4. **Never run `scripts/demo-users.ts` or the demo seed against this database.** They create accounts with known passwords. Check 4 proves none exist.
5. Checks 4, 5 and 7 are about **production**: run them against the live database, environment and media library, not staging.
6. **Second Super Admin** is created before launch (Check 3), not after.
7. **Block the sign-in URL on the public host.** The lockout (G-12) is five failed passwords on `POST /api/users/login`, and that URL exists on the public site too. At the proxy, allow `/api/users/*` (this includes `/api/users/recovery/*`), `/account-recovery` and the admin path (on the public name as well as the admin hostname) only from staff networks, and answer everyone else with 403 or drop the connection. Write the rule here: ______
8. Back up, migrate, start, run `post-deploy.mjs` (token supplied as an environment variable, see Check 8).
9. `/readyz` = 200 only proves the process can reach its database. It does not prove the public site, TLS or any check below.

## Check 1. Proxy setting matches reality, and the app is not reachable around the proxy
A. `grep -E '^(TRUSTED_PROXY_HOPS|CLIENT_IP_HEADER)=' $ENV` shows a number above 0 or a header name that matches the hop list in Part 0. **Also read the value in the platform's secret store / environment settings**: a different value there overrides the file.
B. **Origin closed, every address, every port.** On the app server run `ip -br addr` and list **every** address it has, IPv4 and IPv6, whether or not it has a DNS name (a public IPv6 address with no DNS record is still reachable). From a machine outside the server network, scan each one: `nmap -Pn -p- <IPv4 address>` and `nmap -6 -Pn -p- <IPv6 address>`. Pass: every port on every address closed or filtered, or open only to the proxy's addresses. (An AAAA record on the public name belongs to the proxy and is supposed to be open: do not use it as the origin.) Also `curl -m 5 http://$ORIGIN:3000/healthz` is refused or times out.
C. **Hop count not too small.** This uses the search page (30 a minute per address), not sign-in, so no account is locked and the block lasts one minute. Use two different networks outside the office (two phones on different mobile providers), A and B. Both results are needed, inside the same minute. From A: `for i in $(seq 1 35); do curl -s -o /dev/null -w '%{http_code}\n' "$SITE/search?q=test$i"; done | sort | uniq -c` (expect a `429` count of at least 1). **Within 30 seconds of that finishing**, from B: `curl -s -o /dev/null -w '%{http_code}\n' "$SITE/search?q=test"`. Pass only if **both**: A received at least one `429` **and** B received `200` inside that minute. If A got no `429`, the limit never fired: fail. If B got `429`, every visitor shares one address and `TRUSTED_PROXY_HOPS` is too small: fail. If B was sent more than a minute after A's first `429`, the result proves nothing: repeat from the start.
D. **Header cannot be forged.** From A, repeat C but add `-H "X-Forwarded-For: 10.0.$i.1"` to each request (and the `CLIENT_IP_HEADER` header, if used, with a different value each time). Pass: `429` still appears.
Evidence: ______

## Check 2. Admin and sign-in are reachable from staff networks only
Run from a network that is **not** a staff network (a phone on mobile data). Use the real admin path, not `/admin`, if it was changed.
A. Admin hostname: `curl -m 8 -sS -o /dev/null -w '%{http_code}\n' https://$ADMIN$ADMIN_PATH/login`. Pass **only** if the connection is refused or times out. (On a refused connection curl prints `000` and exits non-zero: that `000` is a pass, not an HTTP status.) Any real status, including 403 and 404, means the host answered: fail.
A2. Admin path on the public name: `curl -m 8 -sS -o /dev/null -w '%{http_code}\n' https://$SITE_HOST$ADMIN_PATH/login` (where `$SITE_HOST` is the public hostname, e.g. `www.edif.gov.et`). Pass: refused, timed out, or a proxy `403`. A page that loads means the admin is public.
B2. **Recovery page on the public host:** `curl -m 8 -sS -o /dev/null -w '%{http_code}\n' https://$SITE_HOST/account-recovery` from a non-staff network. Pass: refused, timed out, or a proxy `403`. It posts to `/api/users/recovery/use`, which has the same lockout exposure as sign-in.
B. **Sign-in URL on the public host** (this is what the lockout risk actually uses): `curl -m 8 -sS -o /dev/null -w '%{http_code}\n' -X POST $SITE/api/users/login -H 'content-type: application/json' -d '{"email":"nobody@example.org","password":"x"}'`. Pass: refused, timed out, or a 403 produced by the proxy rule from Part 0 step 6. A `401` or `400` means the request reached the app: fail.
C. From a staff network both the admin sign-in page and sign-in work.
Evidence: ______  (If A passes but B fails, anyone who knows a staff email can still lock that account for 15 minutes: G-12 stays open, do not tick.)

## Check 3. At least two Super Admins; a named operator can unlock
A. Admin > Users, filter role = Super Admin: two or more active accounts, each signed in once, each with the authenticator set up.
B. Name the operator: ______ . They ran once on **staging**, with the staging env file loaded for that one command only (`set -a; . <staging env>; set +a; npx payload run scripts/unlock-account.ts <email>`), and the account unlocked. The drill must start from a **locked** staging account: first lock it (five wrong passwords at the staging sign-in), confirm it cannot sign in, then run the script. The script also succeeds on an account that was never locked, so an unlocked start proves nothing. A shell that already holds the production environment would unlock a production account: open a fresh shell first.
Evidence: ______

## Check 4. No demo accounts in the live database (run against production, not staging)
`psql "$DATABASE_URL" -c "select count(*) from users where email ilike '%@edif-demo.test';"`
Pass: `0` on the **live** database. A `0` on staging proves nothing about production. (This checks the demo email domain only, not a demo password reused on a real address; Part 0 step 4 covers that by never running the demo scripts.)
Evidence: ______

## Check 5. Secrets are long enough and cookies are secure (production values)
A. Token length without quotes and without printing it: `awk -F= '/^REVALIDATE_TOKEN=/{v=$2; gsub(/["'"'"' ]/,"",v); print length(v)}' $ENV` prints 32 or more. If the platform's secret store sets it instead of the file, check its length there.
B. `COOKIE_SECURE` is not set in the file **or** in the platform's environment settings. (A public production start already refuses `COOKIE_SECURE=false`; this confirms nobody set `true`/other values by hand either.)
C. Cookie flags, in the browser: sign in with a test account, press F12 > Application > Cookies, and confirm the session cookie shows `Secure` and `HttpOnly`. Do not use curl with a password, and do not paste cookie values anywhere.
Evidence: ______

## Check 6. One app instance
Check **every** place the app can run: the platform's replica/instance count for the web service (must be 1), every host, and any container not named `web`: `docker ps --format '{{.Names}} {{.Image}}'` on each host. Record that launch runs one instance; a second instance doubles the rate limits (`src/proxy.ts`).
During a release `RUNBOOKS.md` §2 keeps the old container for 24 hours: that is two instances. Tick this box only **after the old container is stopped**. Writing down that the Fund accepts doubled limits does not make the box true.
Evidence: ______

## Check 7. No unpublished PDF uploaded before go-live
Manual review, no command: Admin > Media, open **every** PDF/document and check that a **published** page or article uses it. A pass based on file names leaves the risk open, because a draft file still downloads at its exact address. Pass: none is a tender pack, draft minutes or draft report. Remove any that is.
Evidence (count checked, count removed, reviewer): ______

## Check 8. PostgreSQL backups, encryption, restore drill
A. **In the provider's console** (screenshot it): automated daily backups on, encryption at rest on, a copy in a second account or region. A restore drill does not prove these.
B. **Restore the provider's own backup, staging only.** In the provider's console restore the latest automated backup into a **new, empty** database instance (never over production). Point the **staging** app at it, then run the check below and write down the minutes taken, from clicking restore to a working admin: ______ minutes.
First type this on a line by itself and press Enter, then type the next command on a separate line (pasted together, `read` swallows the next line as the token):
`read -rs REVALIDATE_TOKEN; export REVALIDATE_TOKEN`
`BASE_URL=<staging url> node scripts/post-deploy.mjs`
Open five pages and the admin. Then `unset REVALIDATE_TOKEN` and delete the restored instance.
C. Optional practice dump: `pg_dump -Fc "$STAGING_DATABASE_URL" > edif-drill.dump` writes a full **unencrypted** copy of the database: keep it on an encrypted disk and delete it afterwards. This does not prove the provider's backup restores; B does.
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
