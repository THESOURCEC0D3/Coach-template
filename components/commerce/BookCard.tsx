import Image from "next/image";
import Link from "next/link";
import { BookOpen, ArrowUpRight } from "lucide-react";
import { money } from "@/lib/commerce/helpers";
import type { Book } from "@/lib/commerce/types";

export default function BookCard({ book }: { book: Book }) {
  const prices = book.variants.flatMap((variant) => variant.price === null ? [] : [variant.price]);
  return <article className="group overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition hover:border-gold-200 hover:shadow-md">
    <Link href={`/books/${book.handle}`} className="block">
      <div className="relative flex aspect-[4/3] items-center justify-center bg-gold-50 p-8">{book.cover ? <Image src={book.cover} alt={`${book.title} book cover`} fill unoptimized className="object-contain p-6" sizes="(max-width: 768px) 100vw, 33vw" /> : <BookOpen size={64} className="text-gold-200" aria-hidden="true" />}</div>
      <div className="p-6 pb-4"><p className="text-xs font-semibold uppercase tracking-widest text-gold-700">{[...new Set(book.variants.map((variant) => variant.format))].map((format) => format === "physical" ? "Print" : format.toUpperCase()).join(" · ")}</p><h2 className="mt-3 text-2xl leading-tight text-gray-900">{book.title}</h2><p className="mt-3 line-clamp-2 text-sm leading-relaxed text-gray-500">{book.subtitle || book.description}</p><div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4"><span className="font-semibold text-gold-700">{prices.length ? `${prices.length > 1 ? "From " : ""}${money(Math.min(...prices))}` : "Enquire about availability"}</span><ArrowUpRight size={20} className="text-gold-700" aria-hidden="true" /></div></div>
    </Link>
  </article>;
}
