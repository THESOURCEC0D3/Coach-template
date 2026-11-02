import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getBooks } from "@/lib/commerce/catalog";
import BookCard from "@/components/commerce/BookCard";
import EmptyState from "@/components/site/EmptyState";

export default async function FeaturedBooks() {
  const { books } = await getBooks();
  return <section id="books" className="bg-white"><div className="mx-auto max-w-6xl px-5 py-20 sm:px-6"><div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="mb-4 text-xs font-semibold tracking-[.2em] text-gold-700 uppercase">Books & publications</p><h2 className="text-4xl leading-tight text-gray-900 sm:text-5xl">Keep growing.<br /><span className="text-gold-700 italic">One page at a time.</span></h2></div><Link href="/books" className="inline-flex min-h-11 items-center gap-2 font-semibold text-gold-700">Shop Books<ArrowUpRight size={18} aria-hidden="true" /></Link></div>
    {books.length ? <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{books.slice(0, 3).map(book => <BookCard key={book.id} book={book} />)}</div> : <EmptyState title="A new chapter is on its way." description="Trophy’s publications will appear here when the catalogue is available. Explore coaching and training while you wait." href="/services" action="Explore coaching & training" />}
  </div></section>;
}
