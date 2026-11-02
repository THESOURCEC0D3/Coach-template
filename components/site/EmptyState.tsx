import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";

export default function EmptyState({ title, description, href, action }: {
  title: string; description: string; href?: string; action?: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-gold-200 bg-white px-6 py-12 text-center sm:px-10">
      <span className="mx-auto mb-5 flex size-12 items-center justify-center rounded-2xl bg-gold-50 text-gold-700"><Sparkles size={22} aria-hidden="true" /></span>
      <h2 className="text-2xl text-gray-900">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl leading-relaxed text-gray-600">{description}</p>
      {href && action && <Link href={href} className="mt-6 inline-flex min-h-11 items-center gap-2 font-semibold text-gold-700 hover:text-gold-800">{action}<ArrowUpRight size={17} aria-hidden="true" /></Link>}
    </div>
  );
}
