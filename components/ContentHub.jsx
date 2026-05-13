import Link from "next/link";
import { DM_Serif_Display, Playfair_Display } from "next/font/google";
import FadeInUp from "@/components/FadeInUp";
import ContentCard from "@/components/ContentCard";
import { content } from "@/lib/content";

const dmSerif = DM_Serif_Display({ subsets: ["latin"], weight: "400" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
});

// Platform pills — remove any the coach doesn't use; the row auto-hides if the array is empty.
const platforms = [
  { name: "Listen on Spotify", href: "#" },
  { name: "Read on Medium", href: "#" },
  { name: "Watch on YouTube", href: "#" },
  { name: "Follow on Twitter", href: "#" },
];

// Show the first 3 items from the shared content library on the homepage.
// To feature different items, reorder `content` in lib/content.js.
const featured = content.slice(0, 3);

export default function ContentHub() {
  return (
    <section id="content" className="bg-white">
      <div className="max-w-6xl mx-auto px-4 py-20">
        {/* Section heading */}
        <FadeInUp className="text-center mb-10 max-w-2xl mx-auto">
          <span className="inline-block bg-violet-100 text-violet-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Free Resources
          </span>
          <h2
            className={`${dmSerif.className} text-4xl md:text-5xl text-gray-900 leading-tight`}
          >
            Lessons That{" "}
            <span className={`${playfair.className} text-violet-700`}>
              Land
            </span>
            .
          </h2>
          <p className="text-gray-500 mt-4 text-lg">
            Conversations, articles, and threads — wherever you like to read,
            watch, or listen.
          </p>
        </FadeInUp>

        {/* Platform pills — auto-hides when array is empty */}
        {platforms.length > 0 && (
          <FadeInUp className="flex flex-wrap justify-center gap-3 mb-14">
            {platforms.map((platform) => (
              <Link
                key={platform.name}
                href={platform.href}
                className="bg-violet-100 text-violet-700 px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-violet-200 transition"
              >
                {platform.name}
              </Link>
            ))}
          </FadeInUp>
        )}

        {/* Featured content cards (first 3 from the shared library) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featured.map((item, index) => (
            <FadeInUp key={item.href} delay={index * 0.15}>
              <ContentCard item={item} />
            </FadeInUp>
          ))}
        </div>

        {/* Browse all */}
        <FadeInUp className="text-center mt-12">
          <Link
            href="/resources"
            className="text-violet-700 hover:text-violet-800 font-semibold inline-flex items-center gap-1 transition"
          >
            Browse all resources →
          </Link>
        </FadeInUp>
      </div>
    </section>
  );
}
