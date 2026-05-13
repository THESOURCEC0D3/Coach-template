import { DM_Serif_Display } from "next/font/google";
import FadeInUp from "@/components/FadeInUp";

const dmSerif = DM_Serif_Display({ subsets: ["latin"], weight: "400" });

const stats = [
  { value: "50+", label: "Clients Transformed" },
  { value: "5★", label: "Average Rating" },
  { value: "3 yrs", label: "Experience" },
];

// Replace these with your actual media features (uppercase brand names),
// or leave the array empty to hide the "As Featured In" strip entirely.
const featuredIn = [
 
];

export default function SocialProof() {
  return (
    <section className="bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-14">
        <FadeInUp className="flex flex-col gap-10">
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-6 md:gap-12">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p
                  className={`${dmSerif.className} text-4xl md:text-5xl text-violet-700`}
                >
                  {stat.value}
                </p>
                <p className="text-sm text-gray-500 mt-2">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Separator — always visible under the stats */}
          <div className="border-t border-gray-200" />

          {/* Featured in strip — auto-hides when featuredIn is empty */}
          {featuredIn.length > 0 && (
            <div className="flex flex-col items-center gap-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                As Featured In
              </p>
              <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
                {featuredIn.map((brand) => (
                  <span
                    key={brand}
                    className="text-gray-400 font-bold tracking-wider text-base md:text-lg"
                  >
                    {brand}
                  </span>
                ))}
              </div>
            </div>
          )}
        </FadeInUp>
      </div>
    </section>
  );
}
