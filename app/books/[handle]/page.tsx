import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, ArrowLeft, ShieldCheck, Truck, Download } from "lucide-react";
import { getBook } from "@/lib/commerce/catalog";
import { AddToBag } from "@/components/commerce/Forms";

export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }) { const { handle } = await params; const book = await getBook(handle).catch(() => null); return { title: book?.title || "Book not found", description: book?.description.slice(0, 160) }; }

export default async function BookPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const book = await getBook(handle);
  if (!book) notFound();
  return <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6"><Link href="/books" className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-gold-700"><ArrowLeft size={16} />All books</Link><div className="grid gap-12 md:grid-cols-2"><div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-3xl bg-gold-50">{book.cover ? <Image src={book.cover} alt={`${book.title} cover`} fill unoptimized sizes="(max-width: 768px) 100vw, 50vw" className="object-contain p-10" priority /> : <BookOpen size={96} className="text-gold-200" aria-hidden="true" />}</div><div className="py-4"><p className="text-sm font-semibold uppercase tracking-widest text-gold-700">Books & publications</p><h1 className="mt-4 text-4xl leading-tight sm:text-5xl">{book.title}</h1>{book.subtitle && <p className="mt-4 text-xl text-gold-700">{book.subtitle}</p>}{book.author && <p className="mt-4 text-lg text-gray-500">By {book.author}</p>}<p className="my-8 whitespace-pre-line leading-relaxed text-gray-600">{book.description}</p>{book.availabilityNote && <p className="mb-6 rounded-2xl bg-gold-50 p-4 text-sm text-gold-900">{book.availabilityNote}</p>}<AddToBag variants={book.variants} /><dl className="mt-10 space-y-3 border-t border-gray-100 pt-6 text-sm">{book.isbn && <div className="flex gap-6"><dt className="w-28 text-gray-500">ISBN</dt><dd>{book.isbn}</dd></div>}{book.publicationDate && <div className="flex gap-6"><dt className="w-28 text-gray-500">Published</dt><dd>{book.publicationDate}</dd></div>}</dl><div className="mt-8 space-y-3 text-sm text-gray-500"><p className="flex gap-3"><Truck size={18} className="shrink-0 text-gold-700" />Delivery options are shown at checkout for print editions.</p><p className="flex gap-3"><Download size={18} className="shrink-0 text-gold-700" />Digital access is released after verified payment.</p><p className="flex gap-3"><ShieldCheck size={18} className="shrink-0 text-gold-700" /><Link href="/refunds" className="underline underline-offset-4">Read the refund and delivery policies</Link></p></div></div></div></main>;
}
