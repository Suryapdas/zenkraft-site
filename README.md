# ZENKRAFT Design Studios — Business Management Platform

The public website and API for ZENKRAFT Design Studios (interior design, architecture,
construction, and turnkey execution) — a Next.js site backed by an Express/Prisma API,
built from a spec-driven baseline (`requirements.md`, `architecture.md`, `data-model.md`,
`api-contracts.md`, `acceptance-criteria.md`).

## What's here

- **`apps/web`** — Next.js 14 (App Router) public site: home, services, projects/portfolio,
  about, process, and a contact page with a validated project-enquiry form.
- **`apps/api`** — Express + Prisma API: public content endpoints (services, projects,
  contact config), lead capture with idempotency and file attachments, and media serving
  via presigned MinIO URLs.
- **`packages/config`** — loads and validates `config/*.yaml` (business identity, product/UX
  copy, per-environment URLs) and gates production deploys on verified business data.
- **`packages/validation`** — shared Zod schemas (e.g. the lead-enquiry form) used by both
  the API and the web client so validation rules never drift between the two.
- **`prisma`** — the Postgres schema and migrations.
- **`infra`** — local dev Docker Compose (Postgres + MinIO), production Compose stack,
  Dockerfiles, a Caddy reverse-proxy config for automatic HTTPS, and
  [`infra/DEPLOY_ORACLE.md`](infra/DEPLOY_ORACLE.md) — a full runbook for self-hosting on an
  Oracle Cloud Always Free VM.
- **`scripts`** — one-off admin scripts: seed contact config / demo content / demo media,
  and the production-readiness gate (`validate-production-config.ts`).

## Getting started (local development)

Prerequisites: Node.js 20+, Docker.

```bash
npm install
npm run dev:infra              # starts Postgres + MinIO in Docker
npm run prisma:migrate         # applies the schema
npm run seed:contact-config    # seeds config/business.yaml into the database
npm run seed:demo-content      # optional: demo projects/services for local testing
npm run seed:demo-media        # optional: reference photos for the demo content
npm run dev                    # starts the API (:4000) and web app (:3000)
```

Visit http://localhost:3000.

## Configuration

- **`config/business.yaml`** — real, verifiable business identity and contact info (name,
  phone, WhatsApp, email, address, hours, socials). Every field starts as an unverified
  `[CONFIG:...]` placeholder; the site deliberately shows "pending verification" messaging
  instead of unverified contact details until each field is filled in and its matching
  `verification.*_verified` flag is set to `true`. Never publish an unverified address,
  phone number, email, map pin, or social profile.
- **`config/product.yaml`** — product/UX copy: hero text, CTAs, project types, budget
  ranges, timeline options.
- **`config/environments.yaml`** — per-environment frontend/API URLs. `apps/web` reads
  `production.api_url` at **build time** (baked into the client bundle); `apps/api` reads
  `production.frontend_url` at **startup** (CORS origin) and refuses to start in production
  if it's still a placeholder.

## Testing

```bash
npm run test                        # unit/integration tests across all workspaces
npm run test:e2e --workspace=apps/web   # Playwright: accessibility, responsive, form flows
```

## Deployment

See [`infra/DEPLOY_ORACLE.md`](infra/DEPLOY_ORACLE.md) for the full self-hosting runbook
(Oracle Cloud Always Free VM, Docker Compose, Caddy/HTTPS, firewall setup, and the
production-readiness gate). Before any production deploy, run:

```bash
npm run validate:production-config
```

This blocks deployment if `config/business.yaml` still has unverified contact fields or
`config/environments.yaml` still has placeholder URLs.

## Spec documents

The functional/architectural baseline this was built from:

- `requirements.md` — functional source of truth
- `architecture.md`, `data-model.md`, `api-contracts.md` — implementation constraints
- `acceptance-criteria.md` — QA/UAT criteria
- `traceability.md` — keep updated when requirements change
- `ux-spec.md`, `content-model.md`, `security-spec.md`, `product-spec.md`,
  `deployment-checklist.md`, `change-control.md` — supporting specs
