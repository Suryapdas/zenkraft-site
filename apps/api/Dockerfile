# Build from the repo root: docker build -f apps/api/Dockerfile .
# (needs the monorepo root as build context — see infra/docker-compose.prod.yml)

FROM node:20-alpine AS build
RUN apk add --no-cache openssl
WORKDIR /app

# Copy manifests first for better layer caching.
COPY package.json package-lock.json ./
COPY packages/config/package.json packages/config/
COPY packages/validation/package.json packages/validation/
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
RUN npm ci

COPY tsconfig.base.json ./
COPY prisma ./prisma
COPY packages ./packages
COPY apps/api ./apps/api

# `prisma generate` only parses the schema (never connects), but it does
# require DATABASE_URL to be *set* to something syntactically valid — the
# real value is supplied at container runtime via docker-compose.prod.yml.
ENV DATABASE_URL="postgresql://build:build@localhost:5432/build"
RUN npx prisma generate --schema=prisma/schema.prisma
RUN npm run build --workspace=packages/config \
 && npm run build --workspace=packages/validation \
 && npm run build --workspace=apps/api

FROM node:20-alpine AS runtime
RUN apk add --no-cache openssl
WORKDIR /app
ENV NODE_ENV=production
ENV ZENKRAFT_CONFIG_DIR=/app/config

# Full node_modules copied rather than pruned: npm workspace hoisting plus the
# `prisma` CLI (needed at container start for `prisma migrate deploy`) make a
# selective copy error-prone at this app's size — a size/simplicity tradeoff.
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/packages/config/dist ./packages/config/dist
COPY --from=build /app/packages/config/package.json ./packages/config/package.json
COPY --from=build /app/packages/validation/dist ./packages/validation/dist
COPY --from=build /app/packages/validation/package.json ./packages/validation/package.json
COPY --from=build /app/apps/api/dist ./apps/api/dist
COPY --from=build /app/apps/api/package.json ./apps/api/package.json
COPY config ./config
# One-off admin commands (seed:*, validate:production-config) run via
# `docker compose exec api npx tsx scripts/<name>.ts`, inheriting this
# container's already-correct env vars — see infra/DEPLOY_ORACLE.md.
COPY scripts ./scripts

EXPOSE 4000
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "fetch('http://localhost:4000/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "apps/api/dist/server.js"]
