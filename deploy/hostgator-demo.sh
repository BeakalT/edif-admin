#!/usr/bin/env bash
# Run ON THE SERVER (cPanel Terminal or SSH), inside the account's home folder. Demo/test deployment, SQLite.
# Build happens here (not on a Mac) so native modules match the server's Linux.
set -euo pipefail
APP="$HOME/edif-admin"
[ -d "$APP/.git" ] || git clone --branch interactive-preview https://github.com/BeakalT/edif-admin.git "$APP"
cd "$APP"; git pull --ff-only
node -v | grep -E '^v(2[0-9]|[3-9][0-9])' >/dev/null || { echo "Need Node 20+ (cPanel > Setup Node.js App, pick 20 or newer)"; exit 1; }
mkdir -p "$HOME/edif-data"
if [ ! -f .env ]; then
  cat > .env <<EOF
NODE_ENV=production
SITE_URL=https://edif.altayestudios.com
PAYLOAD_SECRET=$(openssl rand -hex 32)
REVALIDATE_TOKEN=$(openssl rand -hex 32)
DATABASE_URL=file:$HOME/edif-data/edif.db
ADMIN_PATH=/admin
TRUSTED_PROXY_HOPS=1
EOF
  echo "Created .env (edit SMTP_* later if you want mail)."
fi
npm ci --no-audit --no-fund
# Fresh database from the real-content seeds only. No demo accounts, no test records. Your local edif.db is never used or touched.
if [ ! -f "$HOME/edif-data/edif.db" ]; then
  export IMG_DIR="$APP/public/images"
  set -a; . ./.env; set +a
  NODE_ENV=development npx payload run scripts/sync-schema.ts
  for f in seed seed2 seed3; do NODE_ENV=development npx payload run scripts/$f.ts; done
  # Sample tenders, vacancies and an event for the review demo: run with SAMPLES=1
  [ "${SAMPLES:-0}" = "1" ] && NODE_ENV=development npx payload run scripts/demo-content.ts
fi
npm run build
cp -R .next/static .next/standalone/.next/ ; cp -R public .next/standalone/
echo "Open /admin once to create the first administrator (your own email and a new password)."
echo "Built. In cPanel > Setup Node.js App: root=$APP, startup file=.next/standalone/server.js, then Restart."
