import { DM_Serif_Display, Playfair_Display } from "next/font/google";
import FadeInUp from "@/components/FadeInUp";
import NewsletterForm from "@/components/NewsletterForm";

const dmSerif = DM_Serif_Display({ subsets: ["latin"], weight: "400" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
});

export default function Newsletter() {
  return (
    <section className="bg-amber-400">
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <FadeInUp>
          <p className="text-xs font-bold tracking-widest text-amber-900 uppercase mb-4">
            Free Newsletter
          </p>
          <h2
            className={`${dmSerif.className} text-4xl md:text-5xl text-gray-900 leading-tight`}
          >
            Join 12,000+ Coaches
            <br />
            Getting Weekly{" "}
            <span className={playfair.className}>Wins</span>.
          </h2>
          <p className="text-gray-800 mt-4 text-lg max-w-xl mx-auto">
            One short email every Tuesday: a framework, a story, or a tactic —
            straight from my desk to yours.
          </p>
          <NewsletterForm />
          <p className="text-xs text-gray-700 mt-3">
            No spam. Unsubscribe anytime.
          </p>
        </FadeInUp>
      </div>
    </section>
  );
}
