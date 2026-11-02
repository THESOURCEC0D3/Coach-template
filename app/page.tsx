import type { Metadata } from "next";
import Hero from "@/components/Hero";
import Bio from "@/components/Bio";
import Services from "@/components/Services";
import Empathy from "@/components/Empathy";
import Methodology from "@/components/Methodology";
import FeaturedBooks from "@/components/site/FeaturedBooks";
import { CorporateCTA, BrandExpertsIntro, UpcomingEvents, ConsultationCTA } from "@/components/site/HomeExtras";
import ContentHub from "@/components/ContentHub";
import Testimonials from "@/components/Testimonials";
import { getSiteUrl, site } from "@/lib/site";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function Home() {
  const person = { "@context": "https://schema.org", "@type": "Person", name: site.name, url: getSiteUrl().toString(), jobTitle: "Public Speaking and Communications Trainer", description: site.description, telephone: "+254720631906", sameAs: [site.linkedin], knowsAbout: ["Public Speaking", "Communications", "Leadership", "Executive Coaching", "Life Coaching", "English Tutoring", "Etiquette"] };
  return <main><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person).replace(/</g, "\\u003c") }} /><Hero /><Bio /><Services /><Empathy /><Methodology /><FeaturedBooks /><CorporateCTA /><BrandExpertsIntro /><UpcomingEvents /><ContentHub /><Testimonials /><ConsultationCTA /></main>;
}
