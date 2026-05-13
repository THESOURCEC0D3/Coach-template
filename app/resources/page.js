import { DM_Serif_Display, Playfair_Display } from "next/font/google";
import { content } from "@/lib/content";
import ResourcesGrid from "./ResourcesGrid";

const dmSerif = DM_Serif_Display({ subsets: ["latin"], weight: "400" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
});

export const metadata = {
  title: "Resources",
  description:
    "All free podcast episodes, articles, threads, and videos from Rachel Rios — in one place.",
  alternates: { canonical: "/resources" },
  openGraph: {
    title: "Resources — Rachel Rios",
    description:
      "Podcast episodes, articles, threads, and videos on coaching, business, and life design.",
    url: "/resources",
    type: "website",
  },
};

export default function ResourcesPage() {
  return (
    <main className="bg-white">
      {/* Page header */}
      <header className="bg-linear-to-b from-violet-50 to-white">
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <span className="inline-block bg-violet-100 text-violet-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            The Library
          </span>
          <h1
            className={`${dmSerif.className} text-5xl md:text-6xl text-gray-900 leading-tight`}
          >
            Everything I've{" "}
            <span className={`${playfair.className} text-violet-700`}>
              shared
            </span>
            , in one place.
          </h1>
          <p className="text-lg text-gray-500 mt-4 max-w-2xl mx-auto">
            Free podcasts, articles, threads, and videos on coaching, business,
            and the work it takes to move forward. Filter by what you want.
          </p>
        </div>
      </header>

      {/* Grid + filter (client component) */}
      <ResourcesGrid content={content} />
    </main>
  );
}
