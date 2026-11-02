import Link from "next/link";
import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import trophyPortrait from "@/public/images/trophy-kiprono.jpeg";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-gold-50 to-white">
      <div aria-hidden="true" className="pointer-events-none absolute -right-20 top-10 size-96 rounded-full bg-gold-200/40 blur-3xl" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 py-16 sm:px-6 sm:py-20 lg:min-h-[740px] lg:grid-cols-[1.15fr_1fr] lg:gap-20">
        <div>
          <p className="mb-6 inline-flex items-center gap-2 rounded-full bg-gold-100 px-4 py-2 text-xs font-semibold text-gold-700 sm:text-sm"><span className="size-1.5 rounded-full bg-gold-700" />A confident voice changes what comes next.</p>
          <h1 className="text-5xl leading-[1.12] tracking-tight text-gray-900 sm:text-6xl lg:text-[4.25rem]">Speak with<br /><span className="text-gold-700 italic">Confidence.</span><br />Lead with Impact.</h1>
          <p className="mt-7 max-w-lg text-lg leading-relaxed text-gray-600">I’m Trophy Kiprono. I help individuals and teams communicate clearly, show up with confidence and grow with intention.</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/contact" className={buttonVariants({ size: "lg" })}>Book a Consultation<ArrowUpRight size={18} aria-hidden="true" /></Link>
            <Link href="/books" className={buttonVariants({ variant: "outline", size: "lg" })}>Shop Books</Link>
          </div>
          <p className="mt-8 text-xs font-medium tracking-wide text-gray-500">PUBLIC SPEAKING · COMMUNICATIONS · COACHING</p>
          <Link href="#introduction" className="mt-9 inline-flex min-h-11 items-center gap-2 text-sm text-gray-600 hover:text-gold-700"><ArrowDown size={16} aria-hidden="true" />Get to know Trophy</Link>
        </div>
        <div className="relative mx-auto w-full max-w-md">
          <div aria-hidden="true" className="absolute inset-0 rotate-3 rounded-[2rem] bg-gold-100" />
          <div className="relative aspect-[4/4.7] overflow-hidden rounded-[2rem] border-8 border-white bg-gold-100 shadow-xl shadow-gold-200/30">
            <Image
              src={trophyPortrait}
              alt="Trophy Kiprono, public speaking and communications trainer"
              fill
              preload
              placeholder="blur"
              sizes="(max-width: 640px) calc(100vw - 40px), (max-width: 1024px) 448px, 440px"
              className="object-cover object-center"
            />
          </div>
          <div className="absolute -bottom-6 left-4 right-4 rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-lg shadow-gray-200/30 sm:-left-6 sm:right-auto sm:w-72"><p className="font-heading text-xl text-gray-900">Your voice has a place.</p><p className="mt-1 text-xs leading-relaxed text-gray-500">Let’s help you use it with confidence.</p></div>
        </div>
      </div>
    </section>
  );
}
