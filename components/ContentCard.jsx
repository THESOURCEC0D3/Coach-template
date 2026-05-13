import Link from "next/link";
import { DM_Serif_Display } from "next/font/google";

const dmSerif = DM_Serif_Display({ subsets: ["latin"], weight: "400" });

// Renders a single content card. Used by both the homepage's ContentHub
// section and the /resources archive page. The artwork shows the item's
// `type` as a big DM Serif label on a violet gradient.
export default function ContentCard({ item }) {
  return (
    <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:border-violet-200 transition flex flex-col">
      {/* Artwork — gradient + TYPE label */}
      <div className="aspect-square bg-linear-to-br from-violet-300 via-violet-500 to-violet-800 flex items-center justify-center px-4">
        <p
          className={`${dmSerif.className} text-5xl md:text-6xl text-white drop-shadow-lg text-center`}
        >
          {item.type}
        </p>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col gap-2 flex-1">
        <p className="text-xs font-bold tracking-widest text-violet-700">
          {item.topic}
        </p>
        <h3
          className={`${dmSerif.className} text-xl text-gray-900 leading-tight`}
        >
          {item.title}
        </h3>
        <p className="text-sm text-gray-500">{item.meta}</p>
        <Link
          href={item.href}
          className="text-violet-700 hover:text-violet-800 font-semibold mt-auto pt-2"
        >
          {item.cta} →
        </Link>
      </div>
    </article>
  );
}
