#!/usr/bin/env bash
# Starts the EDIF website and admin on this computer. Stop with Ctrl+C.
set -e
cd "$(dirname "$0")"
if ! command -v node >/dev/null; then echo "Node.js is not installed. Install the LTS version from https://nodejs.org and run this again."; exit 1; fi
MAJOR=$(node -p "process.versions.node.split('.')[0]")
if [ "$MAJOR" -lt 20 ]; then echo "Node.js $MAJOR is too old. Install Node 20 or newer from https://nodejs.org."; exit 1; fi
[ -d node_modules ] || { echo "Installing (first time only, a few minutes)..."; npm install --no-audit --no-fund; }
[ -d .next ] || { echo "Building..."; npm run build; }
case "$(grep -E '^DATABASE_URL=' .env | cut -d= -f2-)" in file:*)
  echo "Checking the local database..."
  if ! npx payload run scripts/sync-schema.ts > /tmp/edif-sync.log 2>&1; then
    echo "Note: the database check reported a problem (the site will still start). Details:"; tail -n 12 /tmp/edif-sync.log
  fi ;;
esac
echo ""
echo "Ready:  website  http://localhost:3100   admin  http://localhost:3100/admin"
echo "Sign-in details are in README.txt"
npm run start -- -p 3100
