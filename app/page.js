import Hero from "@/components/Hero";
import Empathy from "@/components/Empathy";
import SocialProof from "@/components/SocialProof";
import Bio from "@/components/Bio";
import LeadMagnet from "@/components/LeadMagnet";
import Services from "@/components/Services";
import Methodology from "@/components/Methodology";
import Testimonials from "@/components/Testimonials";
import ContentHub from "@/components/ContentHub";
import Newsletter from "@/components/Newsletter";

// Structured data (JSON-LD) — tells search engines exactly who this page is about.
// Google uses this to generate rich results (knowledge panels, expanded snippets, etc.).
// SITE_URL is read from env var; see app/layout.js for the same pattern.
const SITE_URL = process.env.SITE_URL || "http://localhost:3000";

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Rachel Rios",
  jobTitle: "Life & Business Coach",
  url: SITE_URL,
  description:
    "Certified life and business coach helping ambitious people break through their limits, gain clarity, and build the life they actually want.",
  image: `${SITE_URL}/opengraph-image`,
  sameAs: [
    "https://twitter.com/rachelrios",
    "https://instagram.com/rachelrios",
    "https://linkedin.com/in/rachelrios",
  ],
  knowsAbout: [
    "Life Coaching",
    "Business Coaching",
    "Mindset",
    "Productivity",
    "Goal Setting",
  ],
  hasOccupation: {
    "@type": "Occupation",
    name: "Coach",
    occupationLocation: { "@type": "City", name: "Brooklyn" },
  },
  offers: {
    "@type": "Offer",
    name: "Free Discovery Call",
    description: "A free 30-minute consultation to see if coaching is a fit.",
    price: "0",
    priceCurrency: "USD",
    url: `${SITE_URL}/contact`,
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Rachel Rios",
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/resources?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function Home() {
  return (
    <main>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <Hero />
      <Empathy />
      <SocialProof />
      <Bio />
      <LeadMagnet />
      <Services />
      <Methodology />
      <Testimonials />
      <ContentHub />
      <Newsletter />
    </main>
  );
}
