# Build from the repo root: docker build -f apps/web/Dockerfile .
# (needs the monorepo root as build context — see infra/docker-compose.prod.yml)
#
# IMPORTANT: config/environments.yaml's `production.api_url` and
# `production.frontend_url` must already be real values (not [CONFIG:...]
# placeholders) before this image is built — next.config.mjs bakes
# NEXT_PUBLIC_API_BASE_URL into the client bundle at build time.

FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/config/package.json packages/config/
COPY packages/validation/package.json packages/validation/
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
RUN npm ci

COPY tsconfig.base.json ./
COPY config ./config
COPY packages ./packages
COPY apps/web ./apps/web

RUN npm run build --workspace=packages/config \
 && npm run build --workspace=packages/validation \
 && npm run build --workspace=apps/web

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Next.js "standalone" output traces exactly the node_modules this app needs
# (including @zenkraft/validation, used at runtime by EnquiryForm.tsx) — no
# manual node_modules pruning needed, unlike the API image.
COPY --from=build /app/apps/web/.next/standalone ./
COPY --from=build /app/apps/web/.next/static ./apps/web/.next/static

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "fetch('http://localhost:3000/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "apps/web/server.js"]
