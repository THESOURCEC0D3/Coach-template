# Coach Template

A modern, conversion-optimized website template for life and business coaches. Built on Next.js, designed to look like the sites the top 1% of coaches use, customizable in an afternoon.

**Live demo:** _(add your Vercel URL here after deploying)_

---

## What's in the box

A complete homepage with 13 sections, modeled on what Marie Forleo, Mel Robbins, and Amy Porterfield do:

1. **Announcement bar** — dismissible top bar for launches and free resources
2. **Sticky navbar** — with a "Free Discovery Call" CTA always visible
3. **Hero** — bold headline, primary CTA, "New Here?" soft entry card
4. **Empathy section** — the "I get you" moment that hooks cold visitors
5. **Social proof bar** — stats + "As Featured In" media logos
6. **Bio** — edge-bleed photo, conversational intro
7. **Lead Magnet section** — free-guide signup form (wired to Kit / ConvertKit)
8. **Services** — three-card grid for your packages
9. **Methodology** — 4-step framework section ("Discover → Define → Design → Deliver")
10. **Testimonials** — infinite-scroll marquee with client photos and quotes
11. **Content Hub** — featured podcast / article / thread cards
12. **Newsletter** — secondary email capture (same Kit integration)
13. **Footer** — oversized brand wordmark + nav + tagline

Plus two extra pages:

- **`/contact`** — Calendly booking link + email fallback
- **`/resources`** — full content archive with type filter (Podcast / Article / Thread / Video)

---

## Quick start

You'll need [Node.js](https://nodejs.org) installed (any version 18+).

1. **Open this folder in a terminal.** On Windows: shift + right-click the folder → "Open in Terminal." On Mac: open Terminal and `cd` into the folder.
2. **Install dependencies:**
   ```bash
   npm install
   ```
   (one-time, takes a minute or two)
3. **Start the dev server:**
   ```bash
   npm run dev
   ```
4. **Open** [http://localhost:3000](http://localhost:3000) in your browser.

You should see the template running with placeholder content (named "Rachel Rios"). Now you make it yours.

---

## Customization guide

Do these in order — each step builds on the previous one.

### Step 1 — Change the coach name

The template ships with **Rachel Rios** as a demo. To swap in your name:

1. Open your editor (VS Code is great and free).
2. Open the project folder.
3. Use **Find & Replace across all files** (Ctrl/Cmd + Shift + F):
   - Find `Rachel Rios` → replace with your full name (e.g., `Sarah Chen`)
   - Find `Rachel` → replace with your first name (e.g., `Sarah`)
   - Find `rachelrios` → replace with your handle (e.g., `sarahchen`)

That last one updates the email (`hello@rachelrios.com`) and the placeholder Calendly URL.

### Step 2 — Replace the photos

The template uses Unsplash placeholder photos. To use your own:

1. Save your photos to the `public/images/` folder (create it if it doesn't exist).
2. Open each of these files and replace the `src="https://..."` line in the `<Image>` component with your photo's path:
   - `components/Hero.jsx` — main hero photo
   - `components/Empathy.jsx` — softer, warmer portrait
   - `components/Bio.jsx` — casual portrait for the bio section
3. Each card in the Testimonials section (`components/Testimonials.jsx`) has a `photo:` field — replace those with paths to your actual client photos.

Example:
```jsx
src="/images/hero.jpg"   // instead of the Unsplash URL
```

If you'd rather use photos hosted somewhere else (S3, Cloudinary, etc.), see "Using external image hosts" below.

### Step 3 — Update your copy

The headlines, descriptions, and CTAs are written for a generic coach. Make them yours:

- **Hero headline & subhead:** `components/Hero.jsx`
- **Empathy text** (desire / problem / pivot): `components/Empathy.jsx`
- **Stats** (50+, 5★, etc.): `components/SocialProof.jsx`
- **Bio paragraph:** `components/Bio.jsx`
- **Lead magnet copy** ("How to Land Your First 5 Coaching Clients"): `components/LeadMagnet.jsx`
- **Service cards** (titles, prices, descriptions): `components/Services.jsx`
- **Methodology steps:** `components/Methodology.jsx`
- **Testimonial quotes & names:** `components/Testimonials.jsx`
- **Content / resources:** `lib/content.js` (one file controls both the homepage Content section AND the `/resources` page)
- **Newsletter copy:** `components/Newsletter.jsx`
- **Footer copy** (tagline, location, social links): `components/Footer.jsx`

### Step 4 — Change the brand color (optional)

The template's primary brand color is **violet**. If your brand is a different color, you can swap it.

1. Pick your Tailwind color from the [official palette](https://tailwindcss.com/docs/customizing-colors) (e.g., `emerald`, `rose`, `sky`).
2. Use Find & Replace across all files:
   - Find `violet-700` → replace with `[yourcolor]-700` (e.g., `emerald-700`)
   - Find `violet-100` → replace with `[yourcolor]-100`
   - Repeat for `violet-200`, `violet-300`, `violet-400`, `violet-500`, `violet-800`, `violet-900`, `violet-950`, `violet-50`
3. Save and refresh — your whole site is now in your brand color.

**Pro tip:** keep `amber-400` (used on the announcement bar and newsletter) for visual contrast, OR swap that too if you want a more monochromatic look.

### Step 5 — Connect Kit (ConvertKit) for email signups

The lead magnet form and newsletter form both submit to Kit, your email marketing tool. To wire them up:

1. **Sign up for Kit** (free for up to 10,000 subscribers): [kit.com](https://kit.com)
2. **Create a form** in your Kit dashboard. Call it something like "Coach Website Subscribers."
3. **Find your API key:** [https://app.kit.com/account_settings/advanced_settings](https://app.kit.com/account_settings/advanced_settings) — copy it.
4. **Find your Form ID:** open your form in Kit. The URL ends with `/forms/{ID}/...`. Copy the `{ID}` number.
5. **Set up your keys locally:**
   - In the project folder, copy `.env.local.example` and rename the copy to `.env.local` (with the dot).
   - Open `.env.local` and paste your values:
     ```
     KIT_API_KEY=your_key_here
     KIT_FORM_ID=your_form_id_here
     ```
   - Save the file.
6. **Restart the dev server** (Ctrl+C in the terminal, then `npm run dev` again). Env vars only load on server start.

The forms now deliver real subscribers to your Kit list.

**Want to use a different email service?** (Mailchimp, Beehiiv, ConvertKit, etc.) Open `app/actions/subscribe.js`. There's one function called `subscribeToProvider` clearly commented as the swap point. Replace its body with your provider's API call. The rest of the template stays unchanged.

### Step 6 — Update the Calendly link

The "Book Your Free Discovery Call" CTA on the contact page points to a Calendly URL.

1. Get your Calendly link from [calendly.com](https://calendly.com).
2. Open `app/contact/page.js`.
3. Find `https://calendly.com/rachelrios` → replace with your Calendly URL.

If you use a different scheduling tool (SavvyCal, Cal.com, etc.), the same fix works — just paste their booking URL.

### Step 7 — Update social links and email

Open `components/Footer.jsx`. Inside, there are three arrays:

- `navLinks` — your navigation paths
- `socialLinks` — your email and social profiles (Instagram, LinkedIn, Twitter / X)
- `locationLines` — your city, availability, "coaching since" line

Replace the `href: "#"` placeholders with your real profile URLs.

---

## Deploy to the internet

The fastest path is Vercel (the company that makes Next.js). Free for personal sites.

1. **Create a GitHub account** if you don't have one ([github.com](https://github.com)).
2. **Push this project to GitHub.** If you've never used Git, the easiest path is the [GitHub Desktop](https://desktop.github.com) app — drag the project folder in, publish.
3. **Sign up at [vercel.com](https://vercel.com)** with your GitHub account.
4. **Click "New Project"** in Vercel → select your repo → click "Deploy."
5. **Add your environment variables.** In Vercel's project settings, go to "Environment Variables" and add `KIT_API_KEY` and `KIT_FORM_ID` with the same values you put in `.env.local`.
6. **Done.** Vercel gives you a URL like `your-site.vercel.app`. You can connect a custom domain (yourname.com) from Vercel's "Domains" tab.

Every time you push changes to GitHub, Vercel auto-deploys. No manual upload step.

---

## Common questions

### Why is the Bio photo the same as the Hero photo?

The template ships with one Unsplash placeholder for all photos. When you replace them in Step 2, use a **different** photo for the Bio than the Hero — a casual one (jeans + sweater) rather than the more polished hero shot. This is intentional — it makes the Bio section feel more relatable than the Hero.

### How do I remove a section I don't want?

Open `app/page.js`. You'll see a list of components like `<Hero />`, `<Empathy />`, etc. Delete the line for the section you want to remove and save. The section disappears.

For example, if you don't have a podcast or any content yet, remove `<ContentHub />` from `app/page.js`.

### How do I add a new section?

Two steps:
1. Copy an existing component (e.g., `components/Bio.jsx`) to a new file (e.g., `components/MyNewSection.jsx`). Edit its contents.
2. Open `app/page.js`. Add `import MyNewSection from "@/components/MyNewSection";` at the top, and `<MyNewSection />` wherever you want it in the page order.

### How do I add a new content item to the resources page?

Open `lib/content.js`. Append a new object to the `content` array following the same pattern as the existing items:
```js
{
  type: "Podcast",                        // or "Article" / "Thread" / "Video" / anything else
  topic: "MINDSET",                       // small caps category label
  title: "Your episode/article title",
  meta: "30 min listen",                  // duration or read time
  cta: "Listen now",                      // button text
  href: "/content/10",                    // where the link goes
},
```

The new item shows up in `/resources` automatically. To feature it on the homepage too, move it to the top of the array (the homepage shows the first 3).

### Using external image hosts (S3, Cloudinary, etc.)

If your photos are hosted somewhere other than Unsplash, you need to whitelist the hostname:

1. Open `next.config.mjs`.
2. Add a new entry to the `remotePatterns` array:
   ```js
   { protocol: "https", hostname: "your-cdn.example.com" }
   ```
3. Restart the dev server.

This is a Next.js security feature — only whitelisted hosts can be served through the optimized `<Image>` component.

### The forms work locally but say "demo mode" — why?

You haven't set `KIT_API_KEY` and `KIT_FORM_ID` in `.env.local` yet, OR you didn't restart the dev server after setting them. See "Step 5 — Connect Kit" above.

While in demo mode, the form pretends to succeed (so visitors don't see broken UI), but no email is actually delivered. You'll see a warning in your terminal.

---

## What you can change without breaking anything

**Safe to edit:**
- Any text/copy in any `.jsx` file
- Image `src` URLs
- Arrays of data (`testimonials`, `services`, `content`, `navLinks`, etc.)
- Colors via Tailwind class names

**Edit with caution:**
- `app/layout.js` — the global page wrapper. Don't delete `<AnnouncementBar />`, `<Navbar />`, `{children}`, or `<Footer />`.
- `app/page.js` — the homepage section order. Deleting a `<Component />` removes that section; that's fine. But don't delete the `<main>` tags.
- `app/actions/subscribe.js` — the email form handler. Only edit the body of `subscribeToProvider` if you're swapping email services.

**Don't edit unless you know what you're doing:**
- `next.config.mjs`
- `package.json`
- `app/globals.css`
- The fonts setup at the top of any component

---

## Tech stack

- **Next.js 16** (App Router) — the React framework
- **React 19** — the UI library
- **Tailwind CSS 4** — utility-first styling
- **Framer Motion** — scroll-fade animations
- **Kit (formerly ConvertKit)** — email integration (swappable)

No database. No CMS. No auth. The site is fully static + a few Server Actions for the email forms. That's why it's fast and cheap to host.

---

## Need help?

- **Next.js docs:** [nextjs.org/docs](https://nextjs.org/docs)
- **Tailwind docs:** [tailwindcss.com/docs](https://tailwindcss.com/docs)
- **Kit support:** [help.kit.com](https://help.kit.com)
- **Vercel docs:** [vercel.com/docs](https://vercel.com/docs)

---

## License

_(Add your template's license terms here — typical patterns include single-site use, unlimited personal projects, or commercial-use clauses.)_

---

Made with intention. Designed for change.
