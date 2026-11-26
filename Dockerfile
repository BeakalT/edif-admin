# EDIF website + admin: production image.
#   docker build -t edif-web .
#   docker run --env-file .env.production -p 3000:3000 -v edif-data:/app/data edif-web
# Database changes are applied as a separate step BEFORE the new version takes traffic, with the "migrator" image:
#   docker build --target migrator -t edif-migrate . && docker run --rm --env-file .env.production edif-migrate
# Then, once the new web container is healthy and before it gets public traffic:
#   BASE_URL=... REVALIDATE_TOKEN=... node scripts/post-deploy.mjs

FROM node:25.9.0-alpine AS base
RUN apk add --no-cache libc6-compat tini
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# The build needs no real secrets; real values are read when the container starts.
ENV NEXT_TELEMETRY_DISABLED=1 SKIP_ENV_CHECK_AT_BUILD=true \
    PAYLOAD_SECRET=build-time-placeholder-not-used-at-runtime \
    DATABASE_URL=file:/tmp/build.db SITE_URL=https://build.invalid
# Pages are pre-rendered during the build, so it needs a database with the right tables. This one is a throwaway, empty
# SQLite file that is thrown away with the build stage. Real content is loaded at release time (scripts/post-deploy.mjs).
RUN NODE_ENV=development npx tsx scripts/init-build-db.ts && npm run build:prod

# Applies database migrations (needs the full toolchain, so it is its own image).
FROM builder AS migrator
ENV NODE_ENV=production
CMD ["npx", "payload", "migrate"]

FROM base AS runner
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0 DATA_DIR=/app/data
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs \
 && mkdir -p /app/data /app/.next && chown -R nextjs:nodejs /app/data /app/.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
VOLUME ["/app/data"]
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 CMD wget -qO- http://127.0.0.1:3000/healthz >/dev/null || exit 1
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "server.js"]
