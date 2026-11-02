import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, MapPin, Monitor } from "lucide-react";
import PageIntro from "@/components/site/PageIntro";
import { formatEditorialDate, getWorkshop, isRegistrationOpen, workshops } from "@/lib/editorial";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return workshops.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const event = getWorkshop((await params).slug);
  return event ? { title: event.title, description: event.description, alternates: { canonical: `/events/${event.slug}` } } : { title: "Event not found" };
}
export default async function EventPage({ params }: Props) {
  const event = getWorkshop((await params).slug);
  if (!event) notFound();
  const open = await isRegistrationOpen(event);
  return <main><PageIntro label="Events & workshops" title={event.title} description={event.description} /><section className="bg-white"><div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-[1.4fr_1fr]"><div><h2 className="font-heading text-3xl text-gray-900">What we will explore.</h2><ul className="mt-6 space-y-4">{event.topics.map((topic) => <li key={topic} className="flex gap-3 text-lg text-gray-700"><span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-700" />{topic}</li>)}</ul><Link href="/events" className="mt-10 inline-block font-semibold text-gold-700 hover:text-gold-800">← All events</Link></div><aside className="rounded-2xl border border-gold-100 bg-gold-50 p-8"><h2 className="font-heading text-2xl text-gray-900">Workshop details</h2><dl className="mt-6 space-y-6 text-gray-700"><div><dt className="flex items-center gap-2 text-sm font-semibold text-gold-700"><CalendarDays aria-hidden="true" className="h-4 w-4" />Date & time</dt><dd className="mt-2"><time dateTime={event.startsAt}>{formatEditorialDate(event.startsAt, true)}</time> EAT (Kenya)</dd></div><div><dt className="flex items-center gap-2 text-sm font-semibold text-gold-700"><MapPin aria-hidden="true" className="h-4 w-4" />Location</dt><dd className="mt-2">{event.location}</dd></div><div><dt className="flex items-center gap-2 text-sm font-semibold text-gold-700"><Monitor aria-hidden="true" className="h-4 w-4" />Format</dt><dd className="mt-2">{event.format}</dd></div></dl>{open ? <Link href={`/contact?event=${encodeURIComponent(event.slug)}`} className="mt-8 inline-flex rounded-full bg-gold-700 px-6 py-3 font-semibold text-white hover:bg-gold-800">Enquire about registration</Link> : <p className="mt-8 rounded-xl bg-white p-4 text-sm text-gray-600">Registration is not currently open for this event.</p>}<p className="mt-4 text-sm leading-relaxed text-gray-600">An inquiry does not reserve a place. Attendance is confirmed separately after availability is checked.</p></aside></div></section></main>;
}
