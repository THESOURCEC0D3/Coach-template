# Trophy Kiprono

Personal website, coaching inquiries and a Medusa-backed bookstore, with the golden color palette requested by the client.

- Local website: **http://localhost:3000**
- Medusa Admin: **http://localhost:9000/app**
- Approved print title: **Mastering Office Politics — And How to Play It Like a Pro**, **KES 2,550**.
- Client-supplied portrait and book cover are included.

See [local development](docs/trophy/local-development.md) for first-time setup, service configuration and verification commands.

```sh
docker compose up -d
npm run dev
```

The public site includes biography, six service pages, books, events, resources, media, The Brand Experts Kenya, contact and policy pages. Missing editorial content has honest empty states. Coaching inquiries persist in PostgreSQL, have private status tracking and require staff review before confirmation.

Bookstore functionality includes product details, format filtering, server-calculated carts, quantity changes, discounts, checkout details, customer accounts, order access and protected digital-entitlement modules. Payment acceptance and delivery rates require approved merchant/business configuration; checkout does not pretend to take payments.

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
```

Architecture and original requirements: [repository audit](docs/trophy/repository-audit.md), [implementation checklist](docs/trophy/implementation-plan.md), [booking workflow](docs/trophy/booking.md).

Keep `.env.local`, `backend/.env`, generated keys, private book files and runtime data out of Git. The pre-existing independent `trophy_kiprono/` checkout is not part of this implementation.
