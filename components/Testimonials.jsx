import Image from "next/image";
import { DM_Serif_Display, Playfair_Display } from "next/font/google";

const dmSerif = DM_Serif_Display({ subsets: ["latin"], weight: "400" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
});

const testimonials = [
  {
    name: "Sarah K.",
    title: "Founder, The Mindful Path",
    photo: "https://i.pravatar.cc/300?img=47",
    quote:
      "I went from 0 clients to a fully booked roster in 6 months. Rachel's framework gave me the exact path I'd been missing — and the accountability to actually walk it.",
    highlight: "0 clients to a fully booked roster in 6 months",
  },
  {
    name: "Marcus L.",
    title: "Executive Coach, Wright & Co.",
    photo: "https://i.pravatar.cc/300?img=68",
    quote:
      "Three sessions in, I had more clarity than I'd had in three years. By month four I'd doubled my session rate and felt completely confident charging it.",
    highlight: "doubled my session rate",
  },
  {
    name: "Priya R.",
    title: "Founder, Reset Wellness Studio",
    photo: "https://i.pravatar.cc/300?img=44",
    quote:
      "I'd been stuck on the same business plan for two years. Rachel helped me ship a launch in 8 weeks that brought in 25 new clients. The framework is real.",
    highlight: "25 new clients in 8 weeks",
  },
  {
    name: "James T.",
    title: "Independent Consultant",
    photo: "https://i.pravatar.cc/300?img=12",
    quote:
      "I'd burned out twice before working with Rachel. The fact that I'm still going strong 18 months later — that's the result.",
    highlight: "still going strong 18 months later",
  },
];

export default function Testimonials() {
  // Duplicate the array so the marquee can loop seamlessly via translateX(-50%).
  const doubled = [...testimonials, ...testimonials];

  return (
    <section className="bg-gray-900 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 pt-20 pb-16">
        {/* Section heading */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-block bg-violet-100 text-violet-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Real Results
          </span>
          <h2
            className={`${dmSerif.className} text-4xl md:text-5xl text-white leading-tight`}
          >
            What Clients{" "}
            <span className={`${playfair.className} text-violet-300`}>
              Actually
            </span>{" "}
            Say.
          </h2>
          <p className="text-gray-400 mt-4 text-lg">
            Not polished marketing quotes. Real wins from people who showed up
            and did the work.
          </p>
        </div>
      </div>

      {/* Marquee — full-width, edge-to-edge for visual impact */}
      <div className="relative group pb-20">
        {/* Edge fade masks (left + right) so cards fade in/out at the section boundaries */}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-gray-900 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-gray-900 to-transparent z-10 pointer-events-none" />

        {/* Scrolling track */}
        <div className="flex gap-6 motion-safe:animate-[marquee_40s_linear_infinite] group-hover:[animation-play-state:paused] w-max px-4">
          {doubled.map((t, i) => (
            <TestimonialCard
              key={i}
              t={t}
              aria-hidden={i >= testimonials.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ t, ...rest }) {
  return (
    <article
      className="relative w-80 md:w-96 shrink-0 bg-white rounded-3xl shadow-xl p-8"
      {...rest}
    >
      {/* Decorative quotation mark */}
      <span
        aria-hidden
        className={`${playfair.className} absolute -top-4 left-6 text-7xl text-violet-300 leading-none select-none`}
      >
        "
      </span>

      {/* Photo */}
      <div className="relative w-16 h-16 rounded-full overflow-hidden mb-5 ring-4 ring-violet-100">
        <Image
          src={t.photo}
          alt={`${t.name} — testimonial`}
          fill
          sizes="64px"
          className="object-cover"
        />
      </div>

      {/* Quote */}
      <blockquote className="text-base md:text-lg text-gray-800 leading-relaxed mb-5">
        {renderQuote(t.quote, t.highlight)}
      </blockquote>

      {/* Name + title */}
      <footer>
        <p className="font-bold uppercase tracking-wider text-gray-900 text-sm">
          {t.name}
        </p>
        <p className="text-xs text-gray-500 mt-1">{t.title}</p>
      </footer>
    </article>
  );
}

// Split the quote around the highlight phrase and wrap it for emphasis.
function renderQuote(quote, highlight) {
  if (!highlight || !quote.includes(highlight)) return quote;
  const [before, after] = quote.split(highlight);
  return (
    <>
      {before}
      <span className={`${playfair.className} text-violet-700`}>
        {highlight}
      </span>
      {after}
    </>
  );
}
