// Single source of truth for all content items shown on the homepage's
// ContentHub section AND the /resources archive page.
//
// To add a new item: append to the array. The homepage shows the first 3
// via .slice(0, 3); /resources shows all (with type-filter).
//
// To remove an item: delete it from the array. Both pages update.

export const content = [
  {
    type: "Podcast",
    topic: "MINDSET",
    title: "The Story You're Telling About Your Practice",
    meta: "32 min listen",
    cta: "Listen now",
    href: "/content/01",
  },
  {
    type: "Article",
    topic: "STRATEGY",
    title: "How to Land Your First 5 Clients Without Burning Out",
    meta: "8 min read",
    cta: "Read article",
    href: "/content/02",
  },
  {
    type: "Thread",
    topic: "LIFE DESIGN",
    title: "Why \"Hustle Harder\" Is Killing Your Coaching Business",
    meta: "12 tweets",
    cta: "View thread",
    href: "/content/03",
  },
  {
    type: "Podcast",
    topic: "MINDSET",
    title: "Reframe Your Imposter Syndrome in 20 Minutes",
    meta: "21 min listen",
    cta: "Listen now",
    href: "/content/04",
  },
  {
    type: "Article",
    topic: "PRACTICE",
    title: "The Coach's Guide to Pricing Without Apology",
    meta: "6 min read",
    cta: "Read article",
    href: "/content/05",
  },
  {
    type: "Video",
    topic: "STRATEGY",
    title: "How to Build a Lead Magnet That Actually Converts",
    meta: "18 min watch",
    cta: "Watch now",
    href: "/content/06",
  },
  {
    type: "Thread",
    topic: "MINDSET",
    title: "5 Beliefs That Keep Smart Coaches Stuck",
    meta: "9 tweets",
    cta: "View thread",
    href: "/content/07",
  },
  {
    type: "Podcast",
    topic: "PRACTICE",
    title: "Discovery Calls That Don't Feel Like Sales Calls",
    meta: "28 min listen",
    cta: "Listen now",
    href: "/content/08",
  },
  {
    type: "Article",
    topic: "LIFE DESIGN",
    title: "How to Build Boundaries That Actually Stick",
    meta: "10 min read",
    cta: "Read article",
    href: "/content/09",
  },
];
