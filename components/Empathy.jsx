import Image from "next/image";
import Link from "next/link";
import { DM_Serif_Display, Playfair_Display } from "next/font/google";
import FadeInUp from "@/components/FadeInUp";

const dmSerif = DM_Serif_Display({ subsets: ["latin"], weight: "400" });
const playfair = Playfair_Display({ subsets: ["latin"], weight: "400", style: "italic" });

export default function Empathy() {
  return (
    <section id="new-here" className="bg-white relative overflow-hidden">
      {/* Warm ambient blobs — rose + amber for emotional warmth */}
      <div
        aria-hidden
        className="absolute -left-32 top-10 w-125 h-125 bg-rose-300 rounded-full blur-3xl opacity-70 pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute -right-20 bottom-10 w-96 h-96 bg-amber-200 rounded-full blur-3xl opacity-60 pointer-events-none"
      />
      <div className="relative max-w-6xl mx-auto px-4 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left — Oval portrait with offset decoration */}
        <FadeInUp className="flex justify-center md:justify-start">
          <div className="relative w-full max-w-sm aspect-3/4">
            {/* Decorative offset oval behind the portrait */}
            <div
              aria-hidden
              className="absolute inset-0 bg-violet-100 rounded-[50%] -rotate-3 scale-95"
            />
            {/* Portrait */}
            <div className="absolute inset-0 rounded-[50%] overflow-hidden shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80"
                alt="Rachel Rios — warm portrait"
                fill
                sizes="(max-width: 768px) 100vw, 384px"
                className="object-cover"
              />
            </div>
          </div>
        </FadeInUp>

        {/* Right — Empathy text */}
        <FadeInUp className="flex flex-col gap-5">
          {/* Desire */}
          <h2
            className={`${dmSerif.className} text-4xl md:text-5xl text-violet-700 leading-tight`}
          >
            You want{" "}
            <span className={playfair.className}>clarity</span>.
            <br />
            You want to wake up excited about your work.
          </h2>

          {/* Problem */}
          <p className="text-xl md:text-2xl text-gray-700 leading-snug mt-2">
            But right now? Every day feels heavy. The harder you push, the
            further the dream feels.
          </p>

          {/* Pivot */}
          <p className="text-sm md:text-base text-violet-700 font-bold uppercase tracking-widest mt-4">
            I get it. I've been there too.
          </p>

          {/* Signature attribution */}
          <p className={`${playfair.className} text-base md:text-lg text-gray-500 mt-1`}>
            — Rachel
          </p>

          {/* Transition CTA — bridges to Services */}
          <Link
            href="#services"
            className="text-violet-700 hover:text-violet-800 hover:bg-violet-100 p-1.5 rounded-2xl font-semibold mt-6 inline-flex items-center gap-1 transition w-fit"
          >
            Here's how I can help →
          </Link>
        </FadeInUp>
      </div>
    </section>
  );
}
