# Trophy Kiprono: Phase 1 repository audit

Audited on **1 November 2026 (Africa/Lagos)** against commit
`ab2c07c3234af09ca068520e2cebd00805565b9a` on `main`.
Working branch: `repository-audit`.

## Scope and instruction review

The user requested review and execution of **Trophy Prompt 1.docx**. Its task is
a six-phase client customization: a Trophy Kiprono website and integrated
bookstore. Its final execution instruction is:

> Start by auditing the repository and implementing Phase 1, then proceed with the approved implementation plan.

Phase 1 delivers this audit and the [implementation checklist](implementation-plan.md)
for review. Phases 2–6 are proposed work, not implemented features. Each task
uses a plain branch name such as `profile` or `books`, with a PR for the owner
to review before merging. This phase does not deploy or merge anything.

The supplied brand/profile, phone number and LinkedIn address are client inputs;
they are not independently verified credentials. Existing template copy, sales
research, sample testimonials, images and offers are not evidence about Trophy.
No private credentials are required to review the plan, and none belong in a PR.

Supplied client facts to carry forward:

- Brand: **Trophy Kiprono**; positioning: **Speak with Confidence. Lead with Impact.**
- Kenya-based public speaking, communications and leadership trainer;
  communications specialist; executive/life coach; private English tutor;
  etiquette/soft skills trainer; author; Co-Founder, The Brand Experts Kenya.
- The supplied profile states certification and close to a decade of public
  speaking/communications coaching experience; add no further credentials.
- Contact: **+254720631906**;
  [supplied LinkedIn profile](https://www.linkedin.com/in/trophy-kiprono-public-speaking-coach/).
- No approved testimonials, book catalogue, prices, portrait, awards, training
  clients or publication dates accompany the prompt.

`CLAUDE.md` describes the original generic template. Its exclusions of TypeScript,
CMS, blog, accounts and commerce conflict with this client customization. The
user-authorized document takes precedence for Trophy work, except where the
user has subsequently overridden it. The user requested the **template's default
colors**, so retain its violet/amber palette instead of the document's colors.
Retain useful component conventions without retaining conflicting scope.

## Repository and working tree

- Root: `Coach-template`; remote: `THESOURCEC0D3/Coach-template` on GitHub.
- Starting branch: `main`; tracked files were clean before the audit.
- Pre-existing untracked `trophy_kiprono/` is a separate Git checkout on `main`
  at the same commit. Its package manifests and sampled application files match
  the root. It is outside this change and must not be accidentally staged.
- No `AGENTS.md` was found in the root or its ancestor directories.
- Dependencies were initially absent. Installed the existing lockfile with
  `npm ci --no-audit --no-fund`; package manifests and lockfile are unchanged.
- Runtime observed: Node **22.17.1**, npm **10.9.2**.

## Installed baseline

Versions below come from the checked-in lockfile, not assumed latest releases.

| Item | Observed state | Implication |
| --- | --- | --- |
| Next.js | 16.2.4, App Router | Reuse the app; remediate security advisories before release. |
| React / React DOM | 19.2.4 | Check peer requirements when adding integrations. |
| Tailwind CSS | 4.2.4, PostCSS integration | Reuse styling infrastructure with new brand tokens. |
| TypeScript | 6.0.3 installed; source is JS/JSX | No `tsconfig.json` or typecheck script; migration remains work. |
| ESLint | 9.39.4 with `eslint-config-next` 16.2.4 | Baseline errors exist; see checks below. |
| Three.js | 0.184.0 declared | No imports found in `app`, `components` or `lib`; reassess in `foundation`. |
| shadcn / Lucide | `components.json` settings only | No actual `components/ui`, `lib/utils` or Lucide dependency. |
| Package scripts | `dev`, `build`, `start`, `lint` | No tests, typecheck, migrations or deployment checks. |

No Medusa application or existing Medusa behavior was found. There is no Medusa
functionality to rewrite. Sanity, PostgreSQL, Redis, S3, customer authentication,
orders, payments, digital entitlements and administrative workflows are absent.

Current official [Medusa installation requirements](https://docs.medusajs.com/learn/installation)
specify Node 22.22.0+ on supported LTS versions. The local runtime falls below
that baseline. [Sanity Studio requirements](https://www.sanity.io/docs/studio/system-requirements)
specify Node 22.12+. Resolve exact package engines and peers again when those
services are initialized; do not assume the storefront's TypeScript version is
supported by every backend tool.

## Application inventory

| Area | Existing implementation | Reuse or change |
| --- | --- | --- |
| `/` | Ten sections composed in `app/page.js`; global announcement/nav/footer in layout | Reuse section composition; implement the requested Trophy order. |
| `/contact` | Placeholder Calendly link and email | Replace with persisted inquiry workflow; no verified calendar integration. |
| `/resources` | Nine hardcoded content items with client-side type filters | Reuse filtering idea; replace sample items with approved CMS content. |
| SEO | Metadata, JSON-LD, sitemap, robots, OG image and icons | Replace template identity, social URLs, currency, location and ownership markers. |
| Images | Next Image with Unsplash/Pravatar allowlists | Keep responsive optimization; use approved media or an explicit portrait placeholder. |
| Motion | IntersectionObserver fade-ins; CSS testimonial marquee | Rework progressive enhancement and reduced-motion behavior; omit unapproved testimonials. |
| Email capture | Kit Server Action shared by two forms | Not a booking or transactional-email implementation. |

All other requested public routes, accounts, catalogue, cart, checkout, policies,
administrative modules and operational infrastructure remain unimplemented.

## Findings to address

### Content accuracy and user journeys

- `app/layout.js`, `app/page.js`, OG/icons and several components identify
  **Rachel Rios**, not Trophy. Metadata includes an unverified Google ownership
  value; structured data includes Brooklyn, USD and placeholder social accounts.
- `SocialProof.jsx` publishes sample statistics; `Testimonials.jsx` publishes four
  named testimonials and outcomes; `Newsletter.jsx` claims 12,000+ subscribers.
  None is approved Trophy content. Remove or hide these until evidence exists.
- `Services.jsx` contains USD prices. Footer includes template location, hours
  and experience claims. The lead magnet invents a guide and cover mockup.
- Stock portraits must not be presented as Trophy. No approved book titles,
  covers, ISBNs, publication dates, stock levels or digital files were supplied.
- Service links target absent `/services`; resource cards target absent
  `/content/01`–`/content/09`; social/platform links include `#` placeholders.
- Website JSON-LD advertises resource query search that the UI does not implement.
- README's Node 18+ guidance and hero screenshot path were stale; this documentation
  PR corrects them to the pinned Next engine and an existing asset respectively.

### Forms, accessibility and security

- `app/actions/subscribe.js` validates only a nonempty email. Without Kit settings
  it returns `{ success: true, mocked: true }`, while the UI promises delivery.
  Do not reuse that success behavior for real inquiries, orders or downloads.
- No persisted inquiry statuses, notifications, spam controls, rate limiting or
  explicit marketing consent workflow is implemented.
- Lead/newsletter inputs lack visible or programmatic labels; result messages
  lack live announcements. The mobile menu lacks Escape/focus handling and
  `aria-controls`; resource tab roles lack the full associated keyboard pattern.
- Fade-in content initially depends on JavaScript/IntersectionObserver to become
  visible. Test no-JS behavior, observer fallback and reduced motion in Phase 2.
- No application security headers, customer/admin authorization, private file
  controls, webhook handling, backup procedures or CI checks are configured.

These are code-review findings, not completed browser, penetration or legal tests.

## Baseline checks actually run

| Command/check | Result |
| --- | --- |
| `npm ci --no-audit --no-fund` | Passed: installed 358 packages using existing lockfile. |
| `npm run lint -- --ignore-pattern 'trophy_kiprono/**'` | Failed: **15 errors, 2 warnings** in the existing root app. Excluded the independent nested checkout explicitly. |
| `npm run build` in sandbox | Failed because configured Google Fonts could not be fetched. |
| `npm run build` with approved network access | Passed compilation and prerendering, exit 0. Reported a dynamic font download warning for the `✦` glyph (HTTP 400); generated-image appearance remains unverified. |
| `npm audit --omit=dev --json` with network access | Completed, exit 1: **6 affected packages: 1 critical, 4 high, 1 moderate**. This is not a clean audit. |
| Manifest/lockfile comparison | Passed: dependency installation did not change `package.json` or `package-lock.json`. |
| Documentation local-link check | Passed for README, project notes, audit and plan; corrected the stale README hero asset link. |
| `git diff --check` | Passed for the documentation changes. |
| Typecheck | Not available: no configured TypeScript project or typecheck script. The build's TypeScript progress line is not evidence of checked JS application types. |
| Automated unit/integration/Playwright tests | Not run: no suites or test scripts exist. |
| Browser, external providers and deployed environments | Not verified in Phase 1. |

Lint errors include unescaped JSX punctuation and synchronous state changes in
effects (`AnnouncementBar.jsx`, `FadeInUp.jsx`). Two unnecessary eslint-disable
comments cause the warnings. Address these when rebuilding those components.

The production audit flagged `next` (critical), `nanoid`, `postcss`, `sharp`,
`source-map-js` (high), and `baseline-browser-mapping` (moderate). It suggested
Next 16.4.3 as an available remediation target at audit time. Validate the full
dependency graph and compatible stable versions in `foundation`; do not apply a
blind forced audit fix. Package advisory severity does not prove every exploit
is reachable in this deployment. Relevant upstream advisories include
[Next image optimization](https://github.com/vercel/next.js/security/advisories/GHSA-2464-fhr4-w9xw)
and [App Router Server Actions](https://github.com/vercel/next.js/security/advisories/GHSA-p3m5-59mp-jv5r).
Dependency remediation is an early implementation requirement, not deferred to launch.

## Phase 1 acceptance

- [x] Read and review the supplied prompt and its execution boundaries.
- [x] Inspect repository, dependencies, routes, integrations and local state.
- [x] Identify template-content conflicts and missing functionality.
- [x] Run available baseline checks and report failures without claiming coverage.
- [x] Prepare architecture, route mapping, branch sequence, test plan and inputs.
- [ ] Owner reviews the Phase 1 PR and approves the implementation plan.

See the [implementation plan](implementation-plan.md) for remaining phases and
their acceptance criteria. This audit does not assert production readiness.
