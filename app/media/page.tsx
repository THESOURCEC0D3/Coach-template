import type { Metadata } from "next";
import { ArrowUpRight, PlaySquare } from "lucide-react";
import PageIntro from "@/components/site/PageIntro";
import EmptyState from "@/components/site/EmptyState";
import { media } from "@/lib/editorial";

export const metadata: Metadata = { title: "Media & Gallery", description: "Approved interviews, appearances and gallery highlights from Trophy Kiprono.", alternates: { canonical: "/media" } };
export default function MediaPage() {
  return <main><PageIntro label="In conversation & in the room" title="Ideas, conversations and shared moments." description="A space for interviews, media appearances and highlights from Trophy’s work." /><section className="bg-gray-50"><div className="mx-auto max-w-6xl px-4 py-16">{media.length ? <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">{media.map((entry) => <article key={entry.id} className="flex flex-col rounded-2xl border border-gray-100 bg-white p-8 shadow-sm"><PlaySquare aria-hidden="true" className="mb-6 h-10 w-10 text-gold-700" strokeWidth={1.5} /><span className="text-sm font-semibold text-gold-700">{entry.kind}</span><h2 className="mt-3 font-heading text-2xl text-gray-900">{entry.title}</h2><p className="mt-4 flex-1 leading-relaxed text-gray-600">{entry.description}</p><a href={entry.href} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 font-semibold text-gold-700">View media <ArrowUpRight aria-hidden="true" className="h-4 w-4" /><span className="sr-only"> (opens in a new tab)</span></a></article>)}</div> : <EmptyState title="The gallery is growing." description="Interviews, appearances and approved images will be shared here. For a media or speaking inquiry, get in touch with Trophy." href="/contact" action="Make a media inquiry" />}</div></section></main>;
}
