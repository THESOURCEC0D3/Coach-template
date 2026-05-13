# Coach Template — Project Notes

## What this is
A Next.js business landing page template for **life and business coaches**, built to sell to small-business clients as part of the templates business (see `~/.claude/context/role.md`). Started May 1, 2026.

This file is project-specific. My personal preferences, goals, and learning roadmap live in `~/.claude/CLAUDE.md` and `~/.claude/context/*` — load those first if you need who-I-am context. This file is just *what's in this repo*.

## Stack
- **Next.js 16** (App Router; never Pages Router)
- **React 19**
- **Tailwind CSS 4** (PostCSS config at `postcss.config.mjs`)
- **Framer Motion** for scroll-triggered animations
- **JavaScript + JSX** (no TypeScript — deliberate for now; reconsider after first paid template client)
- Path alias: `@/*` resolves to project root (see `jsconfig.json`)
- Fonts: `Geist` (body, in `app/layout.js`), `DM_Serif_Display` (headings, imported per-component), `Playfair_Display` italic (accent — 1–2 emphasis words per heading, imported per-component where used)

## Design tokens (reuse these — don't invent new ones)
- **Accent color:** `violet-700` (primary), `violet-100` (badges/pill backgrounds), `violet-200` (hover borders), `violet-800` (hover state on accent buttons)
- **Secondary brand accent:** `amber-400` — used **only** as section background on the announcement bar and the newsletter (second email capture) section. Never on text, buttons, or other sections. If a buyer doesn't want it, swap both to `violet-900` / `violet-700` and the rest of the template stays the same.
- **Text:** `text-gray-900` (headings), `text-gray-600` (body), `text-gray-500` (subhead/muted)
- **Section background rhythm:** alternate `bg-white` and `bg-gray-50` for adjacent sections
- **Container rhythm:** every section uses `max-w-6xl mx-auto px-4 py-20` on its inner div
- **Heading font:** `DM_Serif_Display` (`weight: "400"`) on every section H1/H2; body uses Geist
- **Pills:** `bg-violet-100 text-violet-700 text-sm font-semibold px-4 py-1.5 rounded-full` — used as section labels and trust badges
- **CTA buttons:**
  - Primary: `bg-violet-700 text-white px-7 py-3.5 rounded-full font-semibold hover:bg-violet-800 transition`
  - Secondary: `border border-gray-300 text-gray-700 px-7 py-3.5 rounded-full font-semibold hover:border-violet-700 hover:text-violet-700 transition`
- **Cards:** `bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-violet-200 transition`
- **CTA copy convention:**
  - Navbar primary CTA: "Free Discovery Call" → `/contact`
  - Hero primary CTA: "Book Your Free Discovery Call" → `/contact`
  - Hero secondary CTA: "New Here? Start Here →" → `#new-here` (anchors to the Empathy section)
  - Use these labels unchanged unless a buyer customizes.

## Reusable component patterns
- **`<FadeInUp>`** (`components/FadeInUp.jsx`) — wraps any content for scroll-triggered fade-in. Props: `delay`, `duration`, `amount`, `className`. Always pass card styling via `className` rather than wrapping `FadeInUp` inside another styled div.
- **Staggered card animation** — when rendering `.map()`'d cards inside a grid, pass `delay={index * 0.15}` to `FadeInUp` for cascading entrance.
- **Data-driven sections** — repeat content (services, testimonials, FAQ) lives as a `const data = [...]` array at the top of the section component, then `.map()`'d into JSX. Don't hand-write three identical card blocks.

## Routing
- `/` — homepage (composed in `app/page.js`)
- `/contact` — Calendly + email page (`app/contact/page.js`)
- `/resources` — content archive with type-filter (`app/resources/page.js`)
- Anchor links: navbar `About`/`Services` → `/#bio` / `/#services`. Footer adds `/#content`.

**Don't add `/blog`** — explicitly cut from MVP. Add only as a paid v2 feature.

## What's built
- `app/layout.js` — root layout, Geist font, metadata, mounts `<Navbar />`
- `app/page.js` — home page; renders `<Hero />` + `<Services />`
- `components/Navbar.jsx` — sticky responsive nav with mobile menu (client component for `useState`)
- `components/Hero.jsx` — split layout: left text + CTAs / right photo with violet offset rectangle. Section background: violet-tinted gradient (`from-violet-50 to-white`) with three blurred decorative blobs (violet + fuchsia, ambient color glow). Bottom-right "New Here?" card anchors to `#new-here`. Trust stats moved to SocialProof bar.
- `components/Services.jsx` — three-card grid; data-driven; FadeInUp staggered at 0.15s intervals
- `components/FadeInUp.jsx` — Framer Motion scroll-fade wrapper
- `components/AnnouncementBar.jsx` — dismissible amber-400 top bar with localStorage persistence; client component for `useState` + `useEffect` + `localStorage`
- `components/Empathy.jsx` — `<section id="new-here">`; two-column with oval-cropped portrait + desire/problem/pivot typographic rhythm; anchors from hero's "New Here? Start Here →" CTA. Warm-toned ambient blobs (rose + amber) for emotional warmth. Soft transition CTA "Here's how I can help →" anchors to `#services`.
- `components/SocialProof.jsx` — thinner bar (`py-14`) on `bg-gray-50`; stats row (DM Serif + violet-700 numbers) + "As Featured In" text-placeholder logo strip. Data-driven via `stats` and `featuredIn` arrays. Featured-in strip auto-hides when array is empty; gray separator line above always renders.
- `components/Bio.jsx` — full-bleed split layout: photo extends to viewport left edge with `md:rounded-r-3xl`, text contained on right with own padding (`px-4 md:px-12 lg:px-16`). "Heya!" italic-violet accent on the heading; single soft CTA → `#services`. Different photo from Hero (currently uses Hero's URL as placeholder; buyer swaps both at once).
- `components/LeadMagnet.jsx` — `<section id="lead-magnet">` (announcement bar anchors here); two-column with CSS-rendered isometric book mockup on left, heading + form on right. "Every" italic-violet accent. Server component; renders client-side form via `<LeadMagnetForm />`.
- `components/LeadMagnetForm.jsx` — client component using React 19's `useActionState`. Two-field form (firstName + email) submitting to the `subscribe` Server Action. Renders success card on success, error text on failure. Pending state via the hook's third tuple element.
- `app/actions/subscribe.js` — Server Action for email capture. Wraps a swap-friendly `subscribeToProvider` function (currently Kit/ConvertKit). Reads `KIT_API_KEY` + `KIT_FORM_ID` from env; falls back to demo mode (returns success without delivering) when keys are missing.
- `components/Methodology.jsx` — vertical timeline of 4 framework steps (Discover → Define → Design → Deliver). Each step has a circular number badge, phase label in caps, a verb-led title, and a 2-sentence description. Connector line between badges suggests progression. Data-driven via `steps` array. Soft CTA at the bottom → `/contact`.
- `components/Testimonials.jsx` — infinite horizontal scroll marquee on dark `bg-gray-900`. CSS-only animation (`@keyframes marquee` in `app/globals.css`); array doubled so `translateX(-50%)` loops seamlessly. Each card: photo, quote with brand-color highlight phrase, name + title. Pauses on hover via `group-hover:[animation-play-state:paused]`. Respects `prefers-reduced-motion` via `motion-safe:` prefix. Edge fade masks left/right. Server component.
- `components/ContentHub.jsx` — `<section id="content">`; mixed-content showcase. Imports the shared `content` array from `lib/content.js` and shows the first 3 via `.slice(0, 3)`. Four platform pills above the grid (Spotify / Medium / YouTube / Twitter) auto-hide when array is empty. "Browse all resources →" CTA at the bottom → `/resources`.
- `components/ContentCard.jsx` — reusable card component used by both ContentHub and `/resources`. Renders one content item: type-aware violet-gradient artwork with the type as a big DM Serif label, topic tag, title, meta, CTA link.
- `lib/content.js` — single source of truth for all content items (podcast episodes, articles, threads, videos). Both ContentHub (homepage) and `/resources` (archive page) import from here. Edit this file to update both pages at once.
- `app/resources/page.js` — `/resources` archive page. Server component with metadata. Renders a header + the client-side `ResourcesGrid`.
- `app/resources/ResourcesGrid.jsx` — client component handling filter state. Derives filter pills from the unique `type` values in the content array (so adding a new type like "Newsletter" auto-adds its pill). Shows a 3-column grid on desktop, 1 column on mobile.
- `components/Newsletter.jsx` — secondary email capture section on `bg-amber-400`. Scale-led headline ("Join 12,000+ Coaches Getting Weekly Wins") with Playfair italic accent on "Wins." Hosts the email-only `<NewsletterForm />` and a "No spam. Unsubscribe anytime." disclaimer.
- `components/NewsletterForm.jsx` — client component, email-only single-field form. Reuses the `subscribe` Server Action from `app/actions/subscribe.js` (same Kit list as LeadMagnet; buyer can fork the action if they want segmented lists). Dark `bg-gray-900` button for max contrast against the amber section. CTA reads "Yes, I'm In →". Success state replaces the form with a 🎉 confirmation card.
- `components/Footer.jsx` — global footer (mounted in `app/layout.js`, appears on every page). Five-zone Skarlo-inspired structure: pre-footer CTA with `bg-gradient-to-b from-gray-900 to-violet-950`, oversized "CoachName" wordmark using inline `clamp(4rem, 20vw, 18rem)` font-size, gradient divider (`from-transparent via-violet-500 to-transparent`), three-column links bar (nav / social / location), tagline + copyright with auto-updating year via `new Date().getFullYear()`. Server component.

## What's next (build sequence — top-down in homepage flow order)
1. ✓ **Foundation** — Playfair Display Italic accent font convention, `amber-400` secondary brand accent, CTA copy conventions, `scroll-smooth` on `<html>`. Documented in this file.
2. ✓ **Announcement bar** — dismissible top bar, `amber-400` background, single-line message + inline CTA. Client component for dismiss state. Persists dismissal via `localStorage`.
3. ✓ **Navbar refit** — CTA label changed from "Book a Session" to "Free Discovery Call".
4. ✓ **Hero refit** — Playfair italic accent applied to "Life" + violet-700 color (single focal emphasis); primary CTA reads "Book Your Free Discovery Call"; secondary demoted from outlined button to text link "New Here? Start Here →" → `#new-here` (will anchor to Empathy in step 5).
5. ✓ **Empathy section** — two-column, oval-cropped portrait + typographic empathy text (desire → problem → empathy pivot). `<section id="new-here">` so hero's secondary CTA anchors here. No CTA in this section (conversation, not pitch).
6. ✓ **Social Proof Bar** — trust stats moved out of Hero into their own band; "As Featured In" text-placeholder logo strip below. Thinner bar (`py-14`), `bg-white` so the rhythm break happens at SocialProof↔Services.
7. ✓ **Bio / Coach Introduction** — full-bleed split: photo on left extending to viewport edge with rounded right side, text on right. "Heya!" italic-violet accent. One soft CTA → `#services`. SocialProof reverted to `bg-gray-50` to maintain section rhythm with Bio's `bg-white` between it and Services.
8. ✓ **Lead Magnet section** — `<section id="lead-magnet">` with CSS isometric book mockup + two-field form (firstName + email). Wired to Kit via Server Action at [app/actions/subscribe.js](app/actions/subscribe.js). Swap-friendly: replace `subscribeToProvider` body to switch email service. Demo mode (returns success without delivering) when env vars missing. Buyer setup via `.env.local.example`.
9. ✓ **Services refit** — minor; "Real Change" accent updated to Playfair Italic + violet (matching the typographic personality pattern across all sections). Section rhythm already correct (`bg-gray-50` alternates with LeadMagnet white above).
10. ✓ **Methodology / "How I Work"** — vertical timeline of 4 steps (Discover → Define → Design → Deliver) with numbered circles + connector lines. Heading: "A Simple Path From Stuck to *Done*." Soft CTA at the bottom links to `/contact`.
11. ✓ **Testimonials** — infinite horizontal scroll marquee on `bg-gray-900` (Preston Smiles pattern). Pure CSS animation (`@keyframes marquee` in globals.css), pauses on hover, respects `prefers-reduced-motion`. Edge-to-edge full-width track with left/right fade masks. Cards show photo + quote with Playfair-italic highlight phrase + name + title.
12. ✓ **Content Hub** — static placeholder per the "no blog" MVP rule. 3 episode cards with violet gradient artwork placeholders (no image asset deps), topic tag + title + duration + "Listen now →" each. Platform pills (Spotify / Apple Podcasts / YouTube) above the grid. "Browse all episodes →" CTA → `/podcast` placeholder route. Buyer drops in real artwork + replaces platform `href="#"` with their actual URLs.
13. ✓ **Newsletter / Second Email Capture** — `bg-amber-400` section with scale-led headline ("Join 12,000+ Coaches Getting Weekly *Wins*"). Email-only form (`NewsletterForm.jsx`) reuses the `subscribe` Server Action. CTA reads "Yes, I'm In →" with dark `bg-gray-900` button for contrast against amber.
14. ✓ **Footer** — Skarlo-inspired 5-zone structure: pre-footer CTA → oversized "CoachName" wordmark → gradient divider → three-column links bar (nav / social / location) → tagline + auto-updating copyright. `bg-violet-950` body with `gray-900 → violet-950` gradient transition on the pre-CTA. Mounted globally in `app/layout.js`.

Post-template: deploy to Vercel as the first sellable URL. **Before deploying, work through the master deploy checklist at `~/.claude/context/deploy-checklist.md`** — globally available across all of Precious's projects. Covers identity swaps, SEO, env vars, Vercel setup, post-deploy registration (Google Search Console, structured-data validation, Lighthouse audit), and the reusable architecture + design-system patterns from this template.

## Conventions for this repo
- **Server components by default.** Only add `"use client"` when the component genuinely needs `useState`, `useEffect`, event handlers, or browser APIs. Tag the reason in a comment if non-obvious.
- **One section = one component file.** Don't pile multiple sections into `page.js`. Keep `page.js` as a thin composer.
- **Section order in `page.js` is the visual order.** Reordering sections = reordering JSX in `page.js`.
- **Images via `<Image>` from `next/image`.** Above-the-fold images get `priority`. Use `fill` + `sizes` for responsive.
- **Links via `<Link>` from `next/link`.** Never raw `<a>` for internal navigation.
- **No new design tokens without a reason.** If you find yourself reaching for a different gray, blue, or border-radius — check whether a token above already covers it. Adding one-off colors kills visual coherence.
- **Empathy section gets `id="new-here"`** on its `<section>` tag — anchored from the hero secondary CTA.
- **`scroll-smooth` on `<html>`** in `app/layout.js` so all in-page anchor links animate cleanly. Already wired.
- **Playfair Display Italic is for emphasis only.** Apply it to 1–2 words per major heading, never to running body copy. The mix of DM Serif Display + Playfair Italic + Geist is the typographic personality of this template — keep it consistent across sections.
- **Server Actions live in `app/actions/`.** Each action file declares `"use server"` at the top. Actions that hit external APIs (email services, payment, etc.) should isolate the provider call in a separate function named `<verb>ToProvider` with a swap-friendly comment block, so buyers can replace one function instead of refactoring the whole action. See [app/actions/subscribe.js](app/actions/subscribe.js) for the pattern.
- **`.env.local` for secrets.** API keys live in `.env.local` (gitignored). The template ships with `.env.local.example` as a documented placeholder. Server-side env reads use `process.env.X`; never expose secrets to client components.
- **External image hosts must be whitelisted** in `next.config.mjs` under `images.remotePatterns`. Currently: `images.unsplash.com` (template placeholders) and `i.pravatar.cc` (testimonial portraits). Add a new entry per host before using `<Image src="https://...">` from a new domain. Changes to `next.config.mjs` require restarting `npm run dev` — HMR does not pick them up.
- **Global page elements live in `app/layout.js`.** AnnouncementBar, Navbar, and Footer are mounted there once and appear on every route automatically. New sections that should be page-specific go in `app/page.js` (or the relevant route's page file). Don't put per-section components into `layout.js`.

## Deploy checklist + future-template playbook

The master deploy + patterns playbook lives **globally** at `~/.claude/context/deploy-checklist.md`. Available in every Precious project, not just this one. Contains:
- Phase 1: Pre-deploy (identity, copy, SEO, Kit, code quality, legal)
- Phase 2: Deploy (Vercel + custom domain)
- Phase 3: Post-deploy SEO sweep
- Phase 4: Soft launch (first 2 weeks)
- Patterns to reuse: architecture, design system, conversion structure, SEO baseline, things to avoid

Surface this checklist whenever we approach shipping anything. When Precious starts a new template, the patterns section is the starting point — don't re-derive these conventions.

## Out of scope (for this template, indefinitely)
- TypeScript migration
- Internationalization (i18n)
- Authentication / user accounts
- A real CMS or MDX-based blog
- E-commerce / payment integration
- Multi-tenant / multi-coach versions

If a real client requires any of the above, scope it as a paid customization, not as part of the template.
