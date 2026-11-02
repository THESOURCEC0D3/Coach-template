import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, MessageCircle } from "lucide-react";
import PageIntro from "@/components/site/PageIntro";
import { services } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  return service ? { title: service.title, description: service.description, alternates: { canonical: `/services/${service.slug}` } } : { title: "Service not found" };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  if (!service) notFound();
  return (
    <main>
      <PageIntro label="Coaching & training" title={service.title} description={service.description}><Link href={`/contact?service=${service.slug}`} className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold-700 px-7 py-3.5 font-semibold text-white transition hover:bg-gold-800">Enquire about this service <ArrowRight aria-hidden="true" className="h-4 w-4" /></Link></PageIntro>
      <section className="bg-white"><div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 md:grid-cols-2"><div><p className="text-sm font-semibold uppercase tracking-widest text-gold-700">A focused approach</p><h2 className="mt-4 font-heading text-4xl text-gray-900">What we can work on.</h2><p className="mt-5 text-lg leading-relaxed text-gray-600">The right starting point depends on your goals. These topics help shape a conversation about the support you need.</p><ul className="mt-8 space-y-4">{service.topics.map((topic) => <li key={topic} className="flex items-start gap-3 text-gray-700"><Check aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-gold-700" /><span>{topic}</span></li>)}</ul></div><div className="rounded-3xl border border-gold-100 bg-gold-50 p-8 md:p-10"><MessageCircle aria-hidden="true" className="mb-6 h-10 w-10 text-gold-700" strokeWidth={1.5} /><h2 className="font-heading text-3xl text-gray-900">The skills to aim for.</h2><p className="mt-4 leading-relaxed text-gray-600">Your learning goals are agreed together. Depending on your needs, the focus may include:</p><ul className="mt-6 space-y-4">{service.outcomes.map((outcome) => <li key={outcome} className="flex gap-3 leading-relaxed text-gray-700"><span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-700" />{outcome}</li>)}</ul></div></div></section>
      <section className="bg-gray-50"><div className="mx-auto max-w-6xl px-4 py-20"><div className="grid items-start gap-10 md:grid-cols-[1fr_1.2fr]"><div><p className="text-sm font-semibold uppercase tracking-widest text-gold-700">Getting started</p><h2 className="mt-4 font-heading text-4xl text-gray-900">Start with a conversation.</h2></div><ol className="grid gap-6 sm:grid-cols-3">{[{ title: "Share your goals", text: "Send an inquiry about your needs and preferred format." }, { title: "Agree the approach", text: "Discuss scope, availability and fees before making a commitment." }, { title: "Confirm the details", text: "Your preferred date is a request until availability is verified." }].map((step, index) => <li key={step.title}><span className="text-sm font-bold text-gold-700">0{index + 1}</span><h3 className="mt-3 font-semibold text-gray-900">{step.title}</h3><p className="mt-2 text-sm leading-relaxed text-gray-600">{step.text}</p></li>)}</ol></div><div className="mt-10 flex flex-wrap items-center gap-5"><Link href={`/contact?service=${service.slug}`} className="rounded-full bg-gold-700 px-7 py-3.5 font-semibold text-white transition hover:bg-gold-800">Book a Consultation</Link><Link href="/services" className="font-semibold text-gold-700 hover:text-gold-800">Explore all services</Link></div></div></section>
    </main>
  );
}
