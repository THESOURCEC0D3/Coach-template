import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, BookOpen, Search } from "lucide-react";
import PageIntro from "@/components/site/PageIntro";
import EmptyState from "@/components/site/EmptyState";
import { articles, formatEditorialDate } from "@/lib/editorial";

export const metadata: Metadata = {
  title: "Blog & Resources",
  description: "Articles and resources from Trophy Kiprono on communication, public speaking, leadership and personal development.",
  alternates: { canonical: "/resources" },
};

type Props = { searchParams: Promise<{ q?: string; category?: string }> };

export default async function ResourcesPage({ searchParams }: Props) {
  const query = await searchParams;
  const search = typeof query.q === "string" ? query.q.trim().slice(0, 100) : "";
  const category = typeof query.category === "string" ? query.category : "";
  const filtered = articles.filter((article) => (!search || `${article.title} ${article.excerpt}`.toLowerCase().includes(search.toLowerCase())) && (!category || article.category === category));
  const categories = [...new Set(articles.map((article) => article.category))];
  return <main><PageIntro label="Ideas to take with you" title="A little perspective. A next step." description="Articles and resources on communicating clearly, leading with confidence and growing with intention." /><section className="bg-gray-50"><div className="mx-auto max-w-6xl px-4 py-16">{articles.length > 0 && <form action="/resources" className="mb-10 grid gap-4 rounded-2xl border border-gray-100 bg-white p-6 sm:grid-cols-[1fr_auto_auto]"><div><label htmlFor="resource-search" className="mb-2 block text-sm font-semibold text-gray-700">Search resources</label><input id="resource-search" name="q" defaultValue={search} maxLength={100} placeholder="Find an article" className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900" /></div><div><label htmlFor="resource-category" className="mb-2 block text-sm font-semibold text-gray-700">Topic</label><select id="resource-category" name="category" defaultValue={category} className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900"><option value="">All topics</option>{categories.map((item) => <option key={item}>{item}</option>)}</select></div><button type="submit" className="inline-flex items-center justify-center gap-2 self-end rounded-full bg-gold-700 px-6 py-3 font-semibold text-white hover:bg-gold-800"><Search aria-hidden="true" className="h-4 w-4" />Search</button></form>}{filtered.length ? <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">{filtered.map((article) => <article key={article.slug} className="flex flex-col rounded-2xl border border-gray-100 bg-white p-8 shadow-sm"><BookOpen aria-hidden="true" className="mb-6 h-10 w-10 text-gold-700" strokeWidth={1.5} /><span className="text-sm font-semibold text-gold-700">{article.category}</span><h2 className="mt-3 font-heading text-2xl text-gray-900"><Link href={`/resources/${article.slug}`} className="hover:text-gold-700">{article.title}</Link></h2><p className="mt-4 flex-1 leading-relaxed text-gray-600">{article.excerpt}</p><time dateTime={article.publishedAt} className="mt-5 text-sm text-gray-500">{formatEditorialDate(article.publishedAt)}</time><Link href={`/resources/${article.slug}`} className="mt-5 inline-flex items-center gap-2 font-semibold text-gold-700">Read article <ArrowUpRight aria-hidden="true" className="h-4 w-4" /></Link></article>)}</div> : <EmptyState title={articles.length ? "No matching resources" : "More to share, soon."} description={articles.length ? "Try another search or browse all resources." : "New articles and resources will appear here when they are ready. In the meantime, explore the ways you can work with Trophy."} href={articles.length ? "/resources" : "/services"} action={articles.length ? "View all resources" : "Explore coaching & training"} />}</div></section></main>;
}
