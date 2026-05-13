import { DM_Serif_Display, Playfair_Display } from "next/font/google";
import FadeInUp from "@/components/FadeInUp";
import LeadMagnetForm from "@/components/LeadMagnetForm";

const dmSerif = DM_Serif_Display({ subsets: ["latin"], weight: "400" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
});

export default function LeadMagnet() {
  return (
    <section id="lead-magnet" className="bg-white">
      <div className="max-w-6xl mx-auto px-4 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
        {/* Left — CSS-rendered book mockup */}
        <FadeInUp className="flex justify-center">
          <div className="relative w-full max-w-sm">
            {/* Shadow page behind (suggests depth) */}
            <div
              aria-hidden
              className="absolute inset-0 bg-violet-900 rounded-lg translate-x-3 translate-y-3 rotate-2"
            />
            {/* Book cover */}
            <div className="relative bg-white rounded-lg shadow-2xl overflow-hidden -rotate-3 aspect-3/4 p-8 flex flex-col justify-between border border-gray-100">
              <p className="text-xs font-bold tracking-widest text-violet-700">
                FREE GUIDE
              </p>
              <div className="flex flex-col gap-3">
                <h3
                  className={`${dmSerif.className} text-3xl text-gray-900 leading-tight`}
                >
                  How to Land Your First{" "}
                  <span className={`${playfair.className} text-violet-700`}>
                    5 Clients
                  </span>
                </h3>
                <p className="text-sm text-gray-500">
                  A 12-page guide by Rachel Rios
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-full bg-violet-700" />
                <p className="text-xs text-gray-400 font-mono">v1.0</p>
              </div>
            </div>
          </div>
        </FadeInUp>

        {/* Right — Heading + form */}
        <FadeInUp className="flex flex-col gap-6">
          <p className="text-xs font-bold tracking-widest text-violet-700 uppercase">
            Free Resource
          </p>
          <h2
            className={`${dmSerif.className} text-4xl md:text-5xl text-gray-900 leading-tight`}
          >
            Get the Guide{" "}
            <span className={`${playfair.className} text-violet-700`}>
              Every
            </span>{" "}
            New Coach Needs.
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            The exact framework I used to land my first 5 paying clients —
            without cold-DMing strangers or burning out on content. Sent to your
            inbox in seconds.
          </p>
          <LeadMagnetForm />
          <p className="text-xs text-gray-400 mt-2">
            No spam. Unsubscribe anytime.
          </p>
        </FadeInUp>
      </div>
    </section>
  );
}
