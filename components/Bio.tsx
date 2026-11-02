import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function Bio() {
  return <section id="introduction" className="bg-white"><div className="mx-auto grid max-w-6xl gap-8 px-5 py-20 sm:px-6 md:grid-cols-[.8fr_1.2fr] md:gap-20">
    <div><p className="mb-4 text-xs font-semibold tracking-[.2em] text-gold-700 uppercase">Meet your coach</p><h2 className="text-4xl leading-tight text-gray-900 sm:text-5xl">Communication is a skill.<br /><span className="text-gold-700 italic">Confidence can grow.</span></h2></div>
    <div className="pt-1"><p className="text-lg leading-relaxed text-gray-600">Trophy Kiprono is a Kenya-based public speaking, communications and leadership trainer, executive and life coach, English tutor, etiquette trainer and author.</p><p className="mt-5 leading-relaxed text-gray-600">Her supplied professional profile describes close to a decade of public speaking and communications coaching experience. As Co-Founder of The Brand Experts Kenya, she brings communication and personal development into the same conversation.</p><Link href="/about" className="mt-6 inline-flex min-h-11 items-center gap-2 font-semibold text-gold-700 hover:text-gold-800">More about Trophy<ArrowUpRight size={18} aria-hidden="true" /></Link></div>
  </div></section>;
}
