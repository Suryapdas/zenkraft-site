# Deploying ZENKRAFT to Oracle Cloud (Always Free)

Everything in this stack — web, API, Postgres, object storage, TLS — runs in one
Docker Compose stack on a single free Oracle Ampere A1 VM. This guide is the
full path from a fresh Oracle account to a live site.

## 0. What you'll need before starting

- An Oracle Cloud account (oracle.com/cloud/free — needs a credit card for
  identity verification, but the Always Free resources are never billed).
- A domain name you control, with access to its DNS settings.
- An SSH client (Terminal on Mac/Linux, PowerShell/PuTTY on Windows).

## 1. Create the VM

1. OCI Console → **Compute → Instances → Create Instance**.
2. **Image**: Canonical Ubuntu 22.04.
3. **Shape**: click "Change shape" → **Ampere → VM.Standard.A1.Flex** → set
   2-4 OCPUs / 12-24 GB RAM (all within the Always Free allowance; more OCPUs
   here is harder for Oracle to reclaim than the max, but 2/12 is already far
   more than 500 visits/month needs).
4. Add your SSH public key (or download the generated key pair).
5. **Boot volume**: default 50GB is fine (Always Free covers up to 200GB total).
6. Create. Note the instance's **public IP address**.

## 2. Open the firewall — the step almost everyone misses

Oracle blocks inbound traffic in **two independent places**. You must open
port 80 and 443 in *both*, or nothing will be reachable from the internet:

**a) OCI Security List / Network Security Group** (cloud-level firewall):
Instance details → click the VCN/subnet link → **Security Lists** → default
security list → **Add Ingress Rules**:
- Source CIDR `0.0.0.0/0`, IP Protocol TCP, Destination Port `80`
- Source CIDR `0.0.0.0/0`, IP Protocol TCP, Destination Port `443`

**b) The OS firewall on the VM itself** (Oracle's Ubuntu image ships with
`iptables` pre-configured to drop inbound traffic). SSH in and run:

```bash
ssh ubuntu@<VM_PUBLIC_IP>
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT
sudo netfilter-persistent save
```

## 3. Install Docker

```bash
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
newgrp docker
docker compose version   # confirm the compose plugin is present
```

## 4. Get the code onto the VM

```bash
git clone <your-repo-url> ~/zenkraft
cd ~/zenkraft
```

(Or `scp -r` the repo if it's not pushed anywhere yet.)

## 5. Point DNS at the VM

Domain: **zenkraftdesignstudio.com**. Create four **A records** at your DNS
provider, all pointing to the VM's public IP:

| Type | Host    | Value           |
|------|---------|-----------------|
| A    | @       | `<VM_PUBLIC_IP>` |
| A    | www     | `<VM_PUBLIC_IP>` |
| A    | api     | `<VM_PUBLIC_IP>` |
| A    | media   | `<VM_PUBLIC_IP>` |

`www` redirects to the apex domain (already configured in `infra/Caddyfile`).
DNS propagation can take a few minutes to a few hours. Caddy will retry
certificate issuance automatically, so it's fine to move on while it propagates.

## 6. Fill in your real business content (this repo intentionally ships none)

`infra/Caddyfile` and `config/environments.yaml`'s `production` block are
already wired to **zenkraftdesignstudio.com** / `api.` / `media.` —
nothing to edit there.

What's still a placeholder: `config/business.yaml` — every field is a
`[CONFIG:...]` marker and every `verification.*_verified` flag is `false`.
This is deliberate: the app is built to never show unverified contact info,
and the production gate (step 9) blocks deploy until you've confirmed these
are real. Edit `config/business.yaml` with your actual studio details —
phone, WhatsApp number, email, address, coordinates, business hours — and
flip each `*_verified` flag to `true` once you've personally confirmed that
field is correct.

If you ever change domains later, update `infra/Caddyfile` and
`config/environments.yaml`'s `production.frontend_url`/`production.api_url`
together, then rebuild the `web` image (that value is baked in at build time).

## 7. Create production secrets

```bash
cp .env.production.example .env.production
```

Edit `.env.production` and replace every `CHANGE_ME_STRONG_RANDOM_VALUE` with
a real generated secret (`openssl rand -base64 24`) — **never** reuse the
`zenkraft`/`zenkraft_dev_password` values from local dev. Also update
`STORAGE_ENDPOINT` if you changed the `media.` subdomain.

## 8. Run the production readiness gate

```bash
npm install
npm run validate:production-config
```

This is the same gate documented in `scripts/validate-production-config.ts` —
it blocks with a clear error list if any business contact field is still
unverified or `environments.yaml` still has a placeholder. Fix and re-run
until it passes before continuing.

## 9. Build and start the stack

```bash
docker compose -f infra/docker-compose.prod.yml --env-file .env.production up -d --build
```

First build takes a few minutes (compiling both apps + pulling base images).
The `api` container runs `prisma migrate deploy` automatically on every start,
so the database schema is created on first boot.

Check everything came up healthy:

```bash
docker compose -f infra/docker-compose.prod.yml ps
docker compose -f infra/docker-compose.prod.yml logs -f
```

Visit `https://zenkraftdesignstudio.com` — Caddy should have already
provisioned valid HTTPS certificates for all four subdomains automatically.

## 10. (Optional) Seed content

If you want the same demo content this dev environment has, run these
*inside* the running `api` container so they inherit its real production
env vars:

```bash
docker compose -f infra/docker-compose.prod.yml exec api npx tsx scripts/seed-contact-config.ts
docker compose -f infra/docker-compose.prod.yml exec api npx tsx scripts/seed-demo-content.ts
docker compose -f infra/docker-compose.prod.yml exec api npx tsx scripts/seed-demo-media.ts
```

Skip `seed-demo-content`/`seed-demo-media` once you have real projects/services
entered through the admin CMS (Phase 2) — they only insert rows when the
tables are empty, so they're safe to leave out.

## Operations

**Logs**: `docker compose -f infra/docker-compose.prod.yml logs -f [service]`

**Update after a code change**:
```bash
git pull
docker compose -f infra/docker-compose.prod.yml --env-file .env.production up -d --build
```

**Database backups** — add to `crontab -e` on the VM:
```
0 3 * * * docker compose -f /home/ubuntu/zenkraft/infra/docker-compose.prod.yml exec -T postgres pg_dump -U zenkraft zenkraft | gzip > /home/ubuntu/backups/zenkraft-$(date +\%F).sql.gz
```
(create `~/backups` first: `mkdir -p ~/backups`)

**Restart everything**: `docker compose -f infra/docker-compose.prod.yml restart`

**Stop everything**: `docker compose -f infra/docker-compose.prod.yml down`
(add `-v` only if you intentionally want to delete the Postgres/MinIO data volumes)
