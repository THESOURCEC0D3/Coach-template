# Trophy Kiprono: implementation plan for approval

Status: **Phase 1 plan retained for reference. The user subsequently authorized
implementation of document sections 4–7, local preview and GitHub pushes.**
See [local development](local-development.md) for the implemented configuration
and remaining external setup.
Source: Trophy Prompt 1.docx. Baseline: [repository audit](repository-audit.md).
Current user override: replace the template's purple accents with golden colors.
The original layout is retained; `gold-*` tokens define the current palette.
Other requirements remain as written.

## Working agreement

- Use plain task branches: `repository-audit`, `foundation`, `profile`, `services`,
  `cms`, `books`, `checkout`, `accounts`, `booking`, `payments`, `digital-delivery`,
  `quality`, `deployment`. Do not use `feat/` prefixes.
- Open a focused PR for each task. Report checks that ran, failures and unverified
  integrations. The owner reviews before merging into `main`; do not auto-merge.
- Create dependent branches after their prerequisite merges, or explicitly name
  the dependency and target branch for a stacked PR. No independent branch may
  silently assume unmerged changes from another task.
- The user has authorized sections 4–7 directly. Missing business content can be
  represented honestly; it must not be invented.
- Preserve the root Next.js app and useful component structure. Leave the
  pre-existing independent `trophy_kiprono/` checkout untouched.

## Proposed architecture and ownership

| Component | Responsibility |
| --- | --- |
| Root Next.js + TypeScript | Public site, storefront, secure customer interface, server integration adapters. |
| `backend/` Medusa application + Admin | Products, variants, prices, KES region, inventory, carts, orders, customers, discounts, payments, reporting and custom modules. |
| `studio/` Sanity Studio | Biography, services, articles, events, media, approved testimonials and page content. |
| PostgreSQL | Medusa commerce data plus custom inquiry, registration, entitlement and audit records through versioned module migrations. |
| Redis | Production event/workflow/locking coordination, queues and shared rate limiting where selected modules require it. |
| Private S3-compatible storage | Paid PDF/ePub objects; isolated from public covers, portraits and editorial assets. |
| Transactional email adapter | Inquiry notifications, receipts, order updates and protected customer access messages, with retry/deduplication. |
| Docker Compose and deployment config | Repeatable local services; separate staging/production resources and secrets. |

Medusa owns all saleable product, inventory, payment and order state. Sanity may
reference Medusa product IDs for editorial presentation; do not duplicate prices
or stock in CMS content. Sanity assets must never hold paid eBooks with public URLs.
Use Medusa APIs, workflows and provider contracts before adding custom commerce
logic. Check actual staff permission capabilities in the selected release;
server-enforced roles are required for custom administrative modules.

Keep framework/runtime selection explicit: resolve compatible stable versions
and package engines at each initialization, lock them, and run their builds and
checks. Upgrade the local runtime to a supported Medusa LTS baseline before
backend initialization. Separate backend/Studio compiler dependencies if their
supported ranges differ from the storefront. No new versions are certified by
this planning PR.

Medusa needs a separate Node service and databases; see its
[deployment overview](https://docs.medusajs.com/learn/deployment) and
[production modules](https://docs.medusajs.com/learn/deployment/general).
Choose hosting after checking that architecture. Publication is a later task,
after review and environment setup.

## Route and module map

| Routes | Phase / owner |
| --- | --- |
| `/`, `/about` | Phase 2: `foundation`, `profile` |
| `/services`, `/services/public-speaking`, `/services/corporate-training`, `/services/executive-coaching`, `/services/life-coaching`, `/services/etiquette-soft-skills`, `/services/english-tutoring` | Phase 2: `services` |
| `/the-brand-experts-kenya` | Phase 2: `profile` |
| `/resources`, `/resources/[slug]`, `/events`, `/events/[slug]`, `/media` | Phase 3: `cms`; registration persistence in Phase 5 |
| `/books`, `/books/[handle]`, `/cart`, `/checkout`, `/orders/[id]` | Phase 4: `books`, `checkout`; verified payment completion in Phase 5 |
| `/account`, account authentication/order/download views | Phase 4: `accounts`; entitlement access in Phase 5 |
| `/contact` and service inquiry entry points | Phase 2 presentation, Phase 5 persisted workflow in `booking` |
| `/privacy`, `/terms`, `/refunds`, `/delivery` | Phase 6: `quality`, using approved business policies |
| Medusa Admin: inquiries, consultation requests, registrations, entitlements | Phase 5; protected APIs and administrative screens |
| Sanity Studio | Phase 3, authenticated editorial interface |

Preserve `/resources` as the Blog and Resources hub; article detail URLs replace
broken template `/content/*` links. All order, account, admin and download routes
require authorization; obscured URLs and `robots.txt` are not access controls.

## Phase 2: foundation, profile and services

- [ ] `foundation`: remediate audited dependencies first; align Next/ESLint peers,
  review unused Three.js, regenerate the lockfile intentionally and rerun audit.
- [ ] Configure strict TypeScript, aliases and an actual `typecheck` script;
  migrate application modules incrementally without duplicate JS/TS routes.
- [ ] Add actual shadcn components, utilities and Lucide icons as needed.
- [ ] Use the user-requested golden palette: gold-700 primary, gold-100/200
  supporting accents, gold-800 hover, gray text and white/gray-50 sections.
  Preserve the template's dark footer treatment using gold-950.
  Use the requested Playfair Display headings and Inter body text. Verify
  contrast for text, controls and focus indicators.
- [ ] Accessible desktop/mobile navigation, skip link, keyboard/focus behavior,
  responsive spacing/type, optimized media and reduced-motion support.
- [ ] Homepage order: navigation; hero with explicit photograph placeholder;
  introduction; services; client problems; training outcomes; featured books;
  corporate training CTA; The Brand Experts Kenya; events; resources;
  approved testimonials only; consultation CTA; contact/footer.
- [ ] Make **Book a Consultation** and **Shop Books** prominent. Do not promise a
  free session, appointment availability or a price unless approved.
- [ ] `profile`: biography and The Brand Experts Kenya page using supplied facts.
  Keep “close to a decade” qualified as supplied; invent no awards or clients.
- [ ] `services`: overview and all six service pages; preserve selected service
  when entering inquiry flow. Draft service descriptions need editorial approval.
- [ ] Remove template identity, unsupported claims, sample prices, testimonials,
  fake book/guide content, placeholder destinations and ownership metadata.
- [ ] Correct metadata, structured data, icons, OG assets, canonical handling,
  sitemap and mobile layouts. Render truthful empty states for absent content.
- [ ] Until backend workflows exist, do not show forms claiming successful delivery
  or commerce actions that imply a purchase can complete.

Acceptance: lint, configured typecheck and production build pass; test critical
navigation, mobile menu, selected-service routing, no-JS readability and reduced
motion. Verify no Trophy content is derived from fabricated template claims.

## Phase 3: CMS and editorial integration

- [ ] `cms`: isolated Studio configuration and environment template; schemas for
  site settings, biography, services, pages, articles, events, gallery/media and
  testimonials. Validate slugs, dates, links, alt text and required references.
- [ ] Typed queries/content adapter; safe rich-text rendering; approved public
  content only; graceful empty/error states without publishing sample articles.
- [ ] Editorial approval/publication rules for testimonials, portraits and media
  permissions; production reads never expose drafts or private fields.
- [ ] Protected draft preview and authenticated cache-revalidation webhook.
- [ ] Implement resources/articles, events and media routes; event timezone and
  registration availability come from approved event data.
- [ ] Configure editorial roles and verify access in the actual Sanity account;
  available permissions may depend on its plan.

Acceptance: schema/build/type checks, content-query and unpublished-content
tests, webhook authentication tests and a verified preview/publish journey.
Live Sanity verification requires a project/dataset with approved access.

## Phase 4: books, checkout and customer accounts

- [ ] `books`: initialize Medusa and versioned migrations; configure Kenya/KES
  sales region, publishable key scope, stock locations and authorized Admin users.
- [ ] Products with physical/PDF/ePub variants, cover/description, ISBN and optional
  publication metadata; model format explicitly. No invented products or covers.
- [ ] Inventory and availability; catalogue search/filtering and book detail pages.
- [ ] `checkout`: server-authoritative cart quantities, totals, discounts and
  shipping. Mixed carts charge shipping only for physical lines; digital-only
  orders require no shipping address. Verify selected Medusa shipping behavior
  and extend it only where its existing workflows do not cover the requirement.
- [ ] Guest and authenticated checkout, address minimization, order summaries,
  receipts and tracking. Persist safe pending states until Phase 5 verification.
- [ ] `accounts`: Medusa-backed authentication, secure session handling, reset/
  verification flows where supported, order history and protected order details.
- [ ] Secure guest order access through an expiring capability or verified account
  linkage; order ID plus email is not sufficient authorization.
- [ ] Medusa Admin product/inventory/order/customer/discount/payment/reporting
  flows and permission checks. Keep commerce reporting based on real orders.

Acceptance: catalogue, authoritative cart/discount totals, physical/digital/mixed
shipping calculations, inventory boundaries, guest purchase state and cross-user
order/account permissions. Verify service migrations and Admin locally.

## Phase 5: bookings, payments and private fulfillment

### Booking and registration (`booking`)

- [ ] Forms: full name, email, phone, organization, selected service, preferred
  date, preferred delivery format and message; explicit appropriate consent.
- [ ] Server-side schema validation, field/body limits, shared rate limiting,
  honeypot/challenge as appropriate, origin/CSRF controls and safe errors.
- [ ] Persist inquiries, consultation requests and training registrations with
  identifiers, status history and an administrative review queue.
- [ ] Enforce server roles for review, updates and exports. Notify staff and
  acknowledge receipt only after durable persistence; track email failures/retries.
- [ ] Keep requested, proposed and confirmed dates distinct. Confirm appointments
  only after calendar availability has been verified; handle concurrent requests.

### Payment provider (`payments`)

Paystack is a **candidate**, subject to verified merchant onboarding and enabled
KES/M-Pesa/card channels. Its [channel documentation](https://paystack.com/docs/payments/payment-channels/)
lists Kenya M-Pesa and cards; this does not establish this business's eligibility.
Keep the Medusa payment-provider boundary replaceable if another approved gateway
is required. No live merchant account or funds are configured in Phase 1.

- [ ] Implement Medusa provider lifecycle: initialize, authorize/verify, capture
  where applicable, retrieve, cancel and refund; map unsupported actions honestly.
- [ ] Initialize transactions server-side from the authoritative cart/order and
  currency; bind references to the correct session. Define the Medusa-to-gateway
  amount conversion explicitly: preserve Medusa precision, convert decimal-safely
  to the provider's required minor units using currency precision, and test
  rounding and round-trip comparisons. Do not assume their monetary units match.
- [ ] Authenticate raw webhook payloads before processing. For Paystack this uses
  HMAC-SHA512 with `x-paystack-signature`; use constant-time comparison, body limits
  and [its webhook contract](https://paystack.com/docs/payments/webhooks/).
- [ ] Verify payment with the provider server-to-server; validate reference,
  merchant/session association, success status, amount and currency before an
  atomic payment transition. Follow [payment verification](https://paystack.com/docs/payments/verify-payments/).
- [ ] Browser callbacks only request status/verification. Never mark an order paid
  or release a book based on query parameters or frontend success alone.
- [ ] Unique constraints and workflow locking for duplicate/out-of-order events,
  repeated verification and checkout completion; deduplicate receipts/entitlements.
- [ ] Pending, successful, failed, abandoned/cancelled, reversed and refunded states;
  reconciliation/retry for missing or delayed notifications; redacted audit logs.
- [ ] Authenticated staff refund workflow with verified provider outcomes; update
  entitlements according to approved refund policy, including partial refunds.
- [ ] Sandbox verification with merchant credentials and approved test scenarios.
  Contract tests alone are not evidence of a completed provider sandbox test.

### Digital fulfillment (`digital-delivery`)

- [ ] Private objects with least-privilege server credentials; separate public
  covers from digital payloads. Never place eBooks in public app assets or CMS.
- [ ] Create one entitlement per purchased digital line only after confirmed
  successful payment; preserve physical fulfillment for mixed orders.
- [ ] Authenticate customer ownership or a narrowly scoped, expiring guest access
  capability. Do not authorize with a supplied email or order identifier alone.
- [ ] Atomically check paid status, revocation, validity and remaining allowance
  before issuing a short-lived URL; record grants without exposing URLs or keys.
- [ ] Configurable expiry and limits; define whether limits count URL grants or
  completed downloads. Direct S3 URLs generally support grant counting; stronger
  completed-download accounting needs an authenticated delivery proxy.
- [ ] Admin revocation and refund integration; enforce no new grants after
  revocation. Existing signed URLs remain usable until expiry unless the delivery
  mechanism provides stronger invalidation; reflect that limit in policy.
- [ ] Secure recovery/resend and email delivery retry without granting extra rights.

Acceptance: persisted inquiry/review flow; authenticated gateway sandbox results;
invalid signatures/references/amounts/currencies; duplicate and concurrent events;
failed/delayed payments; single entitlement creation; mixed fulfillment; expired,
exhausted, revoked, unauthenticated and cross-customer download denial.

## Phase 6: quality, security and deployment preparation

Tests should be added alongside their features in earlier phases, then exercised
as a complete release suite here.

- [ ] `quality`: unit/integration coverage for inquiry persistence, catalogue,
  totals, shipping, verification, duplicate webhooks, failed transactions, mixed
  orders, entitlement creation, unauthorized downloads and account permissions.
- [ ] Playwright: service inquiry; catalogue/cart; guest and customer checkout;
  pending/failure/success states; account order access; digital delivery using
  controlled test fixtures. Add isolated live sandbox checks when configured.
- [ ] HTTPS/proxy configuration, secure cookies, authentication/authorization,
  input validation, request limits, CSRF/origin checks, CSP/security headers,
  webhook verification and secure file access; rerun dependency audits.
- [ ] Data minimization, separate marketing consent, privacy controls, retention
  and deletion processes, processor/storage choices and Kenya Data Protection Act
  review with an appropriate business/legal reviewer. Do not claim compliance
  solely from an engineering checklist.
- [ ] Publish approved privacy, terms, refunds and delivery policies matching
  shipping regions, taxes, merchant details and actual digital behavior.
- [ ] `deployment`: Docker development services (PostgreSQL, required Redis,
  private S3-compatible development storage, email capture and Medusa); service
  health checks, environment templates and documented bootstrap/migrations.
- [ ] Isolate local/staging/production databases, buckets, CMS datasets, gateway
  modes and secrets. Use transactional email sandboxing outside production.
- [ ] CI for lockfile install, lint, typecheck, unit/integration/Playwright checks,
  dependency audit and all application builds; use protected deployment secrets.
- [ ] Document migration/rollback order, deploy workflow, HTTPS/domain setup,
  gateway webhook registration and release smoke checks. Avoid unsafe automatic
  destructive schema rollback.
- [ ] Encrypted database/object backups, retention, scheduled verification and a
  restore exercise; document ownership and proposed recovery objectives.
- [ ] Health monitoring, redacted structured logs, payment reconciliation alerts,
  queue/email failure handling, incident response and deployment runbooks.

Acceptance: required suites and service builds pass; migration and restore
evidence recorded; staging smoke tests pass. Production readiness remains
conditional on merchant eligibility, approved content/policies, hosting and real
provider verification. Report unavailable checks explicitly in the release PR.

## Inputs needed and when

| Input | Needed for | Safe behavior while missing |
| --- | --- | --- |
| Approved biography, portrait and image rights; service descriptions/prices | Phase 2 editorial sign-off | Use supplied profile and explicit portrait placeholder; omit unapproved claims/prices. |
| Book titles, covers, descriptions, ISBN/date metadata, KES prices, stock, authorized PDF/ePub files | Phase 4 catalogue and Phase 5 delivery | Empty catalogue; do not seed fictitious saleable products. |
| Testimonials, client/media logos, event/article/gallery content and permissions | Phases 2–3 | Hide unapproved proof and show accurate empty states. |
| Contact email, domain, consultation policy and calendar availability source | Booking and SEO launch | Use supplied phone/LinkedIn; never invent email/calendar access. |
| Merchant approval and sandbox credentials; refund permissions | Phase 5 external payment verification | Test adapters/contracts locally; checkout cannot claim live readiness. |
| Shipping zones/rates, tax decisions, delivery/refund terms, download expiry/limits | Phases 4–6 | No invented business rules for production purchases. |
| Sanity, storage, email sender and hosting access | Integration/staging | Validate local configuration and document external checks as pending. |
| Staff roles, retention/consent choices, backup ownership and recovery objectives | Admin/security/release | Proposed policies require business approval before production. |

Request credentials through approved secret-management settings, never through
committed files, PR text or logs. Non-secret content can be supplied incrementally.
