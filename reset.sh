#!/usr/bin/env bash
# Puts the demo back to how it started (content, accounts, audit log). Stop the site first.
set -e
cd "$(dirname "$0")"
rm -f edif.db edif.db-shm edif.db-wal; rm -rf media outbox data; mkdir media
export IMG_DIR="$PWD/public/images"
for f in seed seed2 seed3 demo-content demo-users; do npx payload run scripts/$f.ts; done
echo "Reset done. Start again with: bash run.sh"
