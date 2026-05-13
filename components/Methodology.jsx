import Link from "next/link";
import { DM_Serif_Display, Playfair_Display } from "next/font/google";
import FadeInUp from "@/components/FadeInUp";

const dmSerif = DM_Serif_Display({ subsets: ["latin"], weight: "400" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
});

const steps = [
  {
    number: "01",
    phase: "Discover",
    title: "Map where you are.",
    description:
      "We start by understanding your current reality — your goals, the obstacles holding you back, and the patterns quietly keeping you stuck. No assumptions, just clarity.",
  },
  {
    number: "02",
    phase: "Define",
    title: "Pin down where you're going.",
    description:
      "Vague goals don't move people. We translate \"I want to feel better\" into specific, measurable outcomes you can actually pursue.",
  },
  {
    number: "03",
    phase: "Design",
    title: "Build the path forward.",
    description:
      "Together, we design a custom strategy and weekly habit structure — built around your real life, not generic productivity hacks.",
  },
  {
    number: "04",
    phase: "Deliver",
    title: "Make it happen — and stay accountable.",
    description:
      "Weekly sessions keep you moving, adjusting, and accountable. The work compounds. The dream becomes the default.",
  },
];

export default function Methodology() {
  return (
    <section className="bg-white">
      <div className="max-w-6xl mx-auto px-4 py-20">
        {/* Section heading */}
        <FadeInUp className="text-center mb-16 max-w-2xl mx-auto">
          <span className="inline-block bg-violet-100 text-violet-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            How I Work
          </span>
          <h2
            className={`${dmSerif.className} text-4xl md:text-5xl text-gray-900 leading-tight`}
          >
            A Simple Path From Stuck to{" "}
            <span className={`${playfair.className} text-violet-700`}>
              Done
            </span>
            .
          </h2>
          <p className="text-gray-500 mt-4 text-lg">
            A 4-step framework I use with every client — repeatable, proven,
            and custom-fit to your life.
          </p>
        </FadeInUp>

        {/* Timeline */}
        <div className="max-w-3xl mx-auto flex flex-col">
          {steps.map((step, index) => (
            <FadeInUp
              key={step.number}
              delay={index * 0.1}
              className="grid grid-cols-[auto_1fr] gap-6 md:gap-10 items-start"
            >
              {/* Left — Number + connector */}
              <div className="flex flex-col items-center self-stretch">
                <div className="w-14 h-14 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-bold text-lg shrink-0">
                  {step.number}
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 w-px bg-violet-200 mt-2" />
                )}
              </div>

              {/* Right — Content */}
              <div className={index < steps.length - 1 ? "pb-12" : ""}>
                <p className="text-xs font-bold tracking-widest text-violet-700 uppercase mb-2">
                  {step.phase}
                </p>
                <h3
                  className={`${dmSerif.className} text-2xl md:text-3xl text-gray-900 mb-3 leading-tight`}
                >
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </FadeInUp>
          ))}
        </div>

        {/* Soft CTA */}
        <FadeInUp className="text-center mt-16">
          <Link
            href="/contact"
            className="text-violet-700 hover:text-violet-800 font-semibold inline-flex items-center gap-1 transition"
          >
            Ready to start? Book your free call →
          </Link>
        </FadeInUp>
      </div>
    </section>
  );
}
