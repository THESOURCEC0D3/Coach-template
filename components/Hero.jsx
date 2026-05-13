import Image from "next/image";
import Link from "next/link";
import { DM_Serif_Display, Playfair_Display } from "next/font/google";
import FadeInUp from "@/components/FadeInUp";

const dmSerif = DM_Serif_Display({ subsets: ["latin"], weight: "400" });
const playfair = Playfair_Display({ subsets: ["latin"], weight: "400", style: "italic" });

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] overflow-hidden bg-linear-to-b from-violet-50 to-white flex items-center">
      <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-125 h-125 bg-violet-300/60 rounded-full blur-3xl" />
        <div className="absolute top-1/4 -right-24 w-150 h-150 bg-fuchsia-300/50 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 left-1/4 w-100 h-100 bg-violet-200/70 rounded-full blur-3xl" />
      </div>
      <div className="relative max-w-6xl mx-auto px-4 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left — Text */}
        <FadeInUp className="flex flex-col gap-6">
          {/* Badge */}
          <span className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 text-sm font-semibold px-4 py-1.5 rounded-full w-fit">
            ✦ Certified Life & Business Coach
          </span>

          {/* Headline */}
          <h1
            className={`${dmSerif.className} text-5xl md:text-6xl leading-tight text-gray-900`}
          >
            Transform Your{" "}
            <span className={`${playfair.className} text-violet-700`}>Life</span>.
            <br />
            One Session at a Time.
          </h1>

          {/* Subheadline */}
          <p className="text-lg text-gray-500 max-w-md leading-relaxed">
            Work with a certified coach who helps ambitious people break through
            their limits, gain clarity, and build the life they actually want.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 mt-2">
            <Link
              href="/contact"
              className="bg-violet-700 text-white px-7 py-3.5 rounded-full font-semibold hover:bg-violet-800 transition text-base"
            >
              Book Your Free Discovery Call
            </Link>
          </div>
        </FadeInUp>

        {/* Right — Photo */}
        <FadeInUp className="relative flex justify-center">
          <div className="absolute inset-0 bg-violet-100 rounded-3xl -rotate-3 scale-95" />
          <div className="relative w-full aspect-3/4 max-w-sm rounded-3xl overflow-hidden shadow-xl">
            <Image
              src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&q=70"
              alt="Rachel Rios — Life & Business Coach"
              fill
              sizes="(max-width: 768px) 100vw, 384px"
              priority
              className="object-cover"
            />
          </div>
        </FadeInUp>
      </div>
      <Link
        href="#new-here"
        className="absolute bottom-6 right-6 md:bottom-8 md:right-8 bg-white border border-violet-200 rounded-2xl px-5 py-3 shadow-sm hover:shadow-md hover:border-violet-400 transition flex flex-col items-start text-left z-10"
      >
        <span className="text-sm text-gray-500">New Here?</span>
        <span className="text-base text-violet-700 font-bold">Start Here →</span>
      </Link>
    </section>
  );
}
