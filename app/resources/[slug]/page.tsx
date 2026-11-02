import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { articles, formatEditorialDate, getArticle } from "@/lib/editorial";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return articles.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = getArticle((await params).slug);
  return article ? { title: article.title, description: article.excerpt, alternates: { canonical: `/resources/${article.slug}` } } : { title: "Resource not found" };
}
export default async function ArticlePage({ params }: Props) {
  const article = getArticle((await params).slug);
  if (!article) notFound();
  return <main className="bg-white"><article className="mx-auto max-w-3xl px-4 py-16 sm:py-24"><Link href="/resources" className="inline-flex items-center gap-2 text-sm font-semibold text-gold-700 hover:text-gold-800"><ArrowLeft aria-hidden="true" className="h-4 w-4" />All resources</Link><p className="mt-10 text-sm font-semibold uppercase tracking-widest text-gold-700">{article.category}</p><h1 className="mt-5 font-heading text-4xl leading-tight text-gray-900 sm:text-5xl">{article.title}</h1><p className="mt-6 text-xl leading-relaxed text-gray-600">{article.excerpt}</p><div className="mt-6 flex flex-wrap gap-3 text-sm text-gray-500"><span>By Trophy Kiprono</span><span aria-hidden="true">·</span><time dateTime={article.publishedAt}>{formatEditorialDate(article.publishedAt)}</time></div><div className="mt-10 space-y-6 border-t border-gray-100 pt-10 text-lg leading-8 text-gray-700">{article.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div><aside className="mt-14 rounded-2xl bg-gold-50 p-8"><h2 className="font-heading text-2xl text-gray-900">Put the conversation into practice.</h2><p className="mt-3 leading-relaxed text-gray-600">Explore individual coaching or training for your team.</p><Link href="/services" className="mt-5 inline-block font-semibold text-gold-700">Explore services →</Link></aside></article></main>;
}
