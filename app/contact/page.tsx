import type { Metadata } from "next";
import { ArrowUpRight, Phone, ShieldCheck } from "lucide-react";
import PageIntro from "@/components/site/PageIntro";
import InquiryForm from "@/components/booking/InquiryForm";
import InquiryTracker from "@/components/booking/InquiryTracker";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Contact & booking", description: "Start a conversation with Trophy Kiprono about coaching, public speaking or training for your team.", alternates: { canonical: "/contact" } };

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const query = await searchParams;
  return <main>
    <PageIntro label="Let us start a conversation" title="Your next chapter starts with a conversation." description="Tell me where you are, what you are working toward, and how I can help. Together, we can explore the right support for you or your team." />
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 lg:grid-cols-[1.5fr_1fr] lg:py-20">
      <InquiryForm selectedService={query.service} />
      <aside className="space-y-8">
        <div className="rounded-2xl bg-gold-950 p-8 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-gold-200">Connect directly</p>
          <h2 className="mt-4 text-3xl">A good place to begin.</h2>
          <p className="mt-4 leading-relaxed text-gold-100">Prefer to reach out directly? Contact Trophy by phone or connect on LinkedIn.</p>
          <a href={site.phoneHref} className="mt-7 flex items-center gap-3 font-semibold text-white hover:text-gold-200"><Phone className="h-5 w-5" aria-hidden="true" />{site.phone}</a>
          <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="mt-5 flex items-center gap-3 font-semibold text-white hover:text-gold-200"><ArrowUpRight className="h-5 w-5" aria-hidden="true" />Connect on LinkedIn<span className="sr-only"> (opens in a new tab)</span></a>
          <div className="mt-8 flex items-start gap-3 border-t border-gold-800 pt-6 text-sm leading-relaxed text-gold-200"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" /><p>Your preferred date is reviewed before any appointment is confirmed. No payment is collected through this form.</p></div>
        </div>
        <InquiryTracker />
      </aside>
    </div>
  </main>;
}
