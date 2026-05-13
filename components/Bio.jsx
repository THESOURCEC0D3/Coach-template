import Image from "next/image";
import Link from "next/link";
import { DM_Serif_Display, Playfair_Display } from "next/font/google";
import FadeInUp from "@/components/FadeInUp";

const dmSerif = DM_Serif_Display({ subsets: ["latin"], weight: "400" });
const playfair = Playfair_Display({ subsets: ["latin"], weight: "400", style: "italic" });

export default function Bio() {
  return (
    <section id="bio" className="bg-white overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 items-center">
        {/* Left — Photo bleeds to viewport left edge */}
        <FadeInUp className="relative w-full h-96 md:h-150 md:rounded-r-3xl overflow-hidden shadow-2xl">
          <Image
            src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80"
            alt="Rachel Rios — casual portrait"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </FadeInUp>

        {/* Right — Bio text */}
        <FadeInUp className="flex flex-col gap-6 px-4 md:px-12 lg:px-16 py-20">
          <h2 className={`${dmSerif.className} text-5xl md:text-6xl text-gray-900 leading-tight`}>
            <span className={`${playfair.className} text-violet-700`}>Heya!</span>{" "}
            I'm Rachel Rios.
          </h2>

          <p className="text-lg text-gray-600 leading-relaxed">
            I'm a certified life and business coach helping ambitious people
            break through their limits — gain clarity on what they actually
            want, and build the focused habits that get them there. I've been
            there too: stuck in jobs that didn't fit, dreams that felt too big,
            days that disappeared. The work I do today is the work I needed
            five years ago. If that sounds familiar, let's talk.
          </p>

          <Link
            href="#services"
            className="text-violet-700 hover:text-violet-800 font-semibold inline-flex items-center gap-1 transition w-fit mt-2"
          >
            Learn more about me →
          </Link>
        </FadeInUp>
      </div>
    </section>
  );
}
