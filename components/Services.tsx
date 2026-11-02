import Link from "next/link";
import { ArrowUpRight, BriefcaseBusiness, Compass, GraduationCap, Handshake, Mic2, UsersRound } from "lucide-react";
import { services } from "@/lib/site";

const icons = [Mic2, UsersRound, BriefcaseBusiness, Compass, Handshake, GraduationCap];
export default function Services() {
  return <section id="services" className="bg-gray-50"><div className="mx-auto max-w-6xl px-5 py-20 sm:px-6">
    <div className="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><div><p className="mb-4 text-xs font-semibold tracking-[.2em] text-gold-700 uppercase">Ways to work together</p><h2 className="max-w-xl text-4xl leading-tight text-gray-900 sm:text-5xl">A little guidance.<br /><span className="text-gold-700 italic">A more confident you.</span></h2></div><Link href="/services" className="inline-flex min-h-11 shrink-0 items-center gap-2 font-semibold text-gold-700">Explore all services<ArrowUpRight size={18} aria-hidden="true" /></Link></div>
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{services.map((service, index) => { const Icon = icons[index]; return <article key={service.slug} className="group flex flex-col rounded-2xl border border-gray-100 bg-white p-7 shadow-sm transition hover:border-gold-200 hover:shadow-md"><span className="mb-6 flex size-12 items-center justify-center rounded-2xl bg-gold-100 text-gold-700"><Icon size={23} strokeWidth={1.5} aria-hidden="true" /></span><h3 className="text-lg font-semibold text-gray-900">{service.title}</h3><p className="mt-3 flex-1 text-sm leading-relaxed text-gray-600">{service.description}</p><Link href={`/services/${service.slug}`} className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-gold-700">Explore {index === 1 ? "training" : "service"}<ArrowUpRight size={16} aria-hidden="true" /><span className="sr-only">: {service.title}</span></Link></article>; })}</div>
  </div></section>;
}
