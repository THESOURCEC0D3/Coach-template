import Link from "next/link";
import { DM_Serif_Display, Playfair_Display } from "next/font/google";

const dmSerif = DM_Serif_Display({ subsets: ["latin"], weight: "400" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
});

export const metadata = {
  title: "Contact",
  description:
    "Book a free 30-minute discovery call with Rachel Rios. No pressure, no pitch.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Rachel Rios",
    description: "Book your free 30-minute discovery call.",
    url: "/contact",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <main className="bg-white min-h-[80vh] flex items-center justify-center px-4 py-20">
      <div className="max-w-xl text-center flex flex-col gap-6">
        <span className="inline-block bg-violet-100 text-violet-700 text-sm font-semibold px-4 py-1.5 rounded-full mx-auto">
          Discovery Call
        </span>
        <h1
          className={`${dmSerif.className} text-5xl md:text-6xl text-gray-900 leading-tight`}
        >
          Let's{" "}
          <span className={`${playfair.className} text-violet-700`}>talk</span>
          .
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          Book a free 30-minute discovery call. We'll figure out if working
          together is the right fit — no pressure, no pitch.
        </p>
        <Link
          href="https://calendly.com/rachelrios"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-violet-700 text-white px-8 py-4 rounded-full font-semibold hover:bg-violet-800 transition text-lg w-fit mx-auto"
        >
          Open my calendar →
        </Link>
        <p className="text-sm text-gray-500 mt-4">
          Prefer to email?{" "}
          <a
            href="mailto:hello@rachelrios.com"
            className="text-violet-700 hover:text-violet-800 underline underline-offset-2"
          >
            hello@rachelrios.com
          </a>
        </p>
      </div>
    </main>
  );
}
