# Local development

The frontend runs at **http://localhost:3000**. Medusa and its Admin run at
**http://localhost:9000** and **http://localhost:9000/app**. Docker services bind
to loopback; this configuration is for local development.

## First start

Install Node.js 22.22+ LTS and Docker Desktop. The backend runs under Node 24 in
Docker; the storefront can run on the existing Node 22 installation.

```sh
npm ci
node scripts/init-local.mjs
docker run --rm -v "$PWD/backend:/server" -w /server node:24-bookworm-slim npm ci --no-audit --no-fund
docker compose up -d postgres redis storage
docker compose run --rm medusa npm run bootstrap
npm run local:configure
docker compose up -d medusa
npm run dev
```

`init-local.mjs` preserves an existing backend environment. Bootstrap applies
the committed module migrations and idempotently creates the Kenya/KES region,
sales channel, publishable key and approved print title. The frontend preparation
script copies the generated server configuration without printing secret values.
Environment files and runtime data are ignored by Git.

The approved catalogue contains **Mastering Office Politics: And How to Play It
Like a Pro**, by Trophy Kiprono, at **KES 2,550**. Its cover and the portrait
are client-supplied assets. No ISBN, publication date, stock count or digital
edition has been invented. Confirm stock and delivery before accepting orders.

## Subsequent starts

```sh
docker compose up -d
npm run dev
```

For an administrative account, run Medusa's `user` CLI inside the backend
container with your own email and password. Staff login is separate from
storefront customer accounts. Coaching inquiry review, download entitlements and
book sales reports are available as custom Admin pages.

## Checks

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
docker compose exec -T medusa node_modules/.bin/tsc --noEmit
```

Run browser tests against the configured local services. Integration tests write
labelled fixtures into the development database and use reserved test emails.
To enable live API checks without exposing keys:

```sh
MEDUSA_TEST_URL=http://localhost:9000 node --env-file=.env.local --import tsx --test tests/catalog.integration.test.ts tests/inquiries.integration.test.ts
```

## Configuration still required for sales

Payment acceptance requires a merchant-approved gateway and server-side
verification. The manual Medusa development provider is deliberately hidden and
blocked by storefront checkout. No payment is claimed or digital file released
from a browser success callback.

Set approved delivery options/rates, stock controls, business policies and a
verified email sender before launch. Inquiry requests are saved without an email
provider; the interface confirms persistence rather than delivery. Optional
notifications use the server-only email settings documented in
[booking.md](booking.md).

Paid digital files belong in a private S3-compatible bucket. The module supports
paid entitlements, short-lived links, grant limits, revocation and audit history;
no digital edition is offered until approved files and metadata are configured.
Local RustFS provides the S3-compatible development endpoint at port 9002.

This setup uses Medusa's development event bus/locking defaults. Select production
providers, granular staff permissions, backup/restore procedures and monitored
deployment configuration in the later deployment phase. Sanity CMS setup and live
gateway sandbox verification remain separate tasks from this local preview.
