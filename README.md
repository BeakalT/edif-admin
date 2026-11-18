# EDIF website and administration

The public website of the Ethiopian Deposit Insurance Fund and the admin where staff manage it.
Next.js 16 (App Router) + Payload CMS 3. PostgreSQL in production, SQLite for the local demo.

| Document | For |
|---|---|
| `HANDBOOK.md` | Editors and administrators: how to use the admin |
| `ARCHITECTURE.md` | Developers: how it is built and why |
| `RUNBOOKS.md` | Operators: deploy, back up, restore, rotate keys, handle incidents |
| `LAUNCH-READINESS.md` | Owners: what is done, what is open, who decides |

## Run it locally (demo, SQLite)
```bash
cp .env.example .env      # set PAYLOAD_SECRET (any 24+ chars locally), DATABASE_URL=file:./edif.db, SITE_URL=http://localhost:3100
npm ci
npm run dev               # http://localhost:3100  (admin at /admin)
```

## Quality gates
| Command | What it checks |
|---|---|
| `npm run typecheck` | TypeScript, strict mode |
| `npm run lint` | ESLint (0 errors required; warnings are ratcheted down in CI) |
| `npm run test:unit` | Pure logic: client IP, env validation, passwords, custom HTML/CSS cleaning, uploads, CSV, theme contrast |
| `npm run test:payload` | Review/publish rules, page builder + custom code, the full role permission matrix (talks to the database) |
| `npm run test:api` | Sign-in, two-factor, lockout, rate limits, four-eyes publishing, uploads, mail (needs the site running on :3100) |
| `npm run test:e2e` | Browser: WCAG 2.2 AA on every public page (desktop + phone), security headers, health, rate-limit spoofing |
| `npm run test:all` | All of the above |

CI (`.github/workflows/ci.yml`) runs the same gates on PostgreSQL for every change, plus dependency and secret scanning and a container build.

## Configuration
Every setting is an environment variable; see `.env.example`. The app **refuses to start** with a missing or weak `PAYLOAD_SECRET`, a non-https `SITE_URL`, or no SMTP in production.
