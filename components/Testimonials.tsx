import { testimonials } from "@/lib/editorial";
export default function Testimonials() {
  const approved = testimonials.filter(item => item.approved);
  if (!approved.length) return null;
  return <section className="bg-white"><div className="mx-auto max-w-6xl px-5 py-20 sm:px-6"><h2 className="mb-10 text-4xl text-gray-900">In their words</h2><div className="grid gap-6 md:grid-cols-2">{approved.map(item => <figure key={item.id} className="rounded-2xl border border-gold-100 bg-gold-50 p-8"><blockquote className="text-lg leading-relaxed text-gray-700">“{item.quote}”</blockquote><figcaption className="mt-5 text-sm font-semibold text-gold-700">{item.name}{item.role && <span className="mt-1 block font-normal text-gray-500">{item.role}</span>}</figcaption></figure>)}</div></div></section>;
}
