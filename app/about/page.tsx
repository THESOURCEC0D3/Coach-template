import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import PageIntro from "@/components/site/PageIntro";
import { services, site } from "@/lib/site";
import trophyPortrait from "@/public/images/trophy-kiprono.jpeg";

export const metadata: Metadata = {
  title: "About Trophy",
  description: "Meet Trophy Kiprono, a Kenya-based public speaking and communications trainer, executive and life coach, English tutor and author.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main>
      <PageIntro label="Meet your coach" title="A clearer voice. A more confident you." description="Public speaking, communication and personal development with Trophy Kiprono." />
      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 md:grid-cols-2">
          <div className="relative mx-auto w-full max-w-md rounded-3xl bg-gold-100 p-8">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-gold-200 bg-white">
              <Image
                src={trophyPortrait}
                alt="Trophy Kiprono, public speaking and communications trainer"
                fill
                placeholder="blur"
                sizes="(max-width: 448px) calc(100vw - 96px), (max-width: 768px) 384px, (max-width: 1024px) calc(50vw - 104px), 384px"
                className="object-cover object-center"
              />
            </div>
            <span className="absolute -bottom-4 right-6 rounded-full bg-white px-5 py-3 text-sm font-semibold text-gold-700 shadow-sm">Based in Kenya</span>
          </div>
          <div>
            <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-gold-100 px-4 py-1.5 text-sm font-semibold text-gold-700"><Sparkles aria-hidden="true" className="h-4 w-4" /> Communication with purpose</span>
            <h2 className="font-heading text-4xl leading-tight text-gray-900">Meet Trophy.</h2>
            <div className="mt-6 space-y-5 text-lg leading-relaxed text-gray-600">
              <p>Trophy Kiprono is a Kenya-based public speaking, communications and leadership trainer, communications specialist, executive and life coach, private English tutor, etiquette trainer and author.</p>
              <p>She is a certified public speaking, communications and leadership trainer. Her professional profile describes close to a decade of public speaking and communications coaching experience.</p>
              <p>She is also Co-Founder of The Brand Experts Kenya. Her work brings together the way we speak, the way we lead and the confidence we bring to everyday interactions.</p>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/contact" className="rounded-full bg-gold-700 px-7 py-3.5 font-semibold text-white transition hover:bg-gold-800">Book a Consultation</Link>
              <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-6 py-3.5 font-semibold text-gray-700 transition hover:border-gold-700 hover:text-gold-700">View LinkedIn <ArrowUpRight aria-hidden="true" className="h-4 w-4" /></a>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="max-w-2xl"><p className="text-sm font-semibold uppercase tracking-widest text-gold-700">Ways to work together</p><h2 className="mt-4 font-heading text-4xl text-gray-900">Space to learn. Skills to carry forward.</h2><p className="mt-5 text-lg leading-relaxed text-gray-600">Explore the kind of support that fits your personal or professional goals.</p></div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{services.map((service) => <Link key={service.slug} href={`/services/${service.slug}`} className="group flex items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:border-gold-200 hover:shadow-md"><span className="font-semibold text-gray-900">{service.title}</span><ArrowUpRight aria-hidden="true" className="h-5 w-5 shrink-0 text-gold-700 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></Link>)}</div>
        </div>
      </section>
    </main>
  );
}
