import Link from "next/link";
import { DM_Serif_Display, Playfair_Display } from "next/font/google";
import FadeInUp from "@/components/FadeInUp";

const dmSerif = DM_Serif_Display({ subsets: ["latin"], weight: "400" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
});

const services = [
  {
    icon: "🎯",
    title: "1:1 Coaching",
    description:
      "Private weekly sessions to clarify your direction, break through blockers, and build habits that actually stick.",
    price: "From $250 / session",
    href: "/services",
  },
  {
    icon: "👥",
    title: "Group Programs",
    description:
      "8-week cohorts of 6 ambitious people working through the same growth challenges — accountability built in.",
    price: "From $1,200 / cohort",
    href: "/services",
  },
  {
    icon: "🏢",
    title: "Corporate Workshops",
    description:
      "Half-day and full-day team sessions on leadership, focus, and high-performance habits for growing companies.",
    price: "Custom pricing",
    href: "/services",
  },
];

export default function Services() {
  return (
    <section id="services" className="bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-20">
        {/* Section heading */}
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <span className="inline-block bg-violet-100 text-violet-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            What I Offer
          </span>
          <h2
            className={`${dmSerif.className} text-4xl md:text-5xl text-gray-900 leading-tight`}
          >
            Coaching Built for{" "}
            <span className={`${playfair.className} text-violet-700`}>
              Real Change
            </span>
          </h2>
          <p className="text-gray-500 mt-4 text-lg">
            Three ways to work with me, depending on where you are and how deep
            you want to go.
          </p>
        </div>

        {/* Service cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <FadeInUp
              key={service.title}
              delay={index * 0.35}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4 hover:shadow-md hover:border-violet-200 transition"
            >
              <div className="text-4xl">{service.icon}</div>
              <h3 className="text-xl font-bold text-gray-900">
                {service.title}
              </h3>
              <p className="text-gray-600 leading-relaxed flex-1">
                {service.description}
              </p>
              <p className="text-violet-700 font-semibold">{service.price}</p>
              <Link
                href={service.href}
                className="text-violet-700 font-semibold hover:text-violet-800 transition mt-2"
              >
                Learn more →
              </Link>
            </FadeInUp>
          ))}
        </div>
      </div>
    </section>
  );
}
