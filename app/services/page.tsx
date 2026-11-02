import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import PageIntro from "@/components/site/PageIntro";
import { services } from "@/lib/site";

export const metadata: Metadata = {
  title: "Coaching & Training Services",
  description: "Explore public speaking, corporate training, executive and life coaching, etiquette and English tutoring with Trophy Kiprono.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <main>
      <PageIntro label="Find your next step" title="Coaching for the moments that matter." description="From finding your voice to leading a team, choose the support that meets you where you are." />
      <section className="bg-gray-50">
        <div className="mx-auto grid max-w-6xl gap-7 px-4 py-16 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => <article key={service.slug} className="flex flex-col rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition hover:border-gold-200 hover:shadow-md"><span aria-hidden="true" className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-gold-100 text-lg font-semibold text-gold-700">{String(index + 1).padStart(2, "0")}</span><h2 className="font-heading text-2xl text-gray-900">{service.title}</h2><p className="mt-4 flex-1 leading-relaxed text-gray-600">{service.description}</p><ul className="mt-6 space-y-3">{service.topics.slice(0, 3).map((topic) => <li key={topic} className="flex gap-2 text-sm leading-relaxed text-gray-600"><Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-gold-700" />{topic}</li>)}</ul><Link href={`/services/${service.slug}`} className="mt-8 inline-flex items-center gap-2 font-semibold text-gold-700 hover:text-gold-800">Explore this service <ArrowUpRight aria-hidden="true" className="h-4 w-4" /></Link></article>)}
        </div>
      </section>
      <section className="bg-white"><div className="mx-auto max-w-3xl px-4 py-20 text-center"><h2 className="font-heading text-4xl text-gray-900">Not sure where to begin?</h2><p className="mt-5 text-lg leading-relaxed text-gray-600">Share what you would like to work on. A consultation request is a first conversation about your needs, with the format and next steps agreed together.</p><Link href="/contact" className="mt-8 inline-flex rounded-full bg-gold-700 px-7 py-3.5 font-semibold text-white transition hover:bg-gold-800">Book a Consultation</Link></div></section>
    </main>
  );
}
