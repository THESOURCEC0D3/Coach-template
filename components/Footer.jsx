import Link from "next/link";
import { DM_Serif_Display, Playfair_Display } from "next/font/google";

const dmSerif = DM_Serif_Display({ subsets: ["latin"], weight: "400" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
});

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#bio" },
  { label: "Services", href: "/#services" },
  { label: "Contact", href: "/contact" },
  { label: "Resources", href: "/#content" },
];

const socialLinks = [
  { label: "hello@rachelrios.com", href: "mailto:hello@rachelrios.com" },
  { label: "Instagram", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "Twitter / X", href: "#" },
];

const locationLines = [
  "Brooklyn, NY → Worldwide",
  "Available Monday – Thursday",
  "Coaching since 2022",
];

export default function Footer() {
  return (
    <footer className="text-violet-300">
      {/* Zone 1 — Pre-footer CTA */}
      <section className="bg-linear-to-b from-gray-900 to-violet-950 px-4 py-20 md:py-24 text-center">
        <h2
          className={`${dmSerif.className} text-3xl md:text-4xl text-white leading-tight`}
        >
          Let's{" "}
          <span className={playfair.className}>begin</span>.
        </h2>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 text-white text-base mt-6 hover:text-violet-200 transition"
        >
          <span aria-hidden className="text-violet-400">
            ✦
          </span>
          Get started
        </Link>
      </section>

      {/* Zones 2-5 — Main footer body */}
      <div className="bg-violet-950">
        {/* Zone 2 — Giant wordmark */}
        <div className="text-center pt-8 pb-4 overflow-hidden">
          <p
            className={`${dmSerif.className} text-violet-500 leading-none select-none`}
            style={{ fontSize: "clamp(4rem, 20vw, 18rem)" }}
            aria-hidden
          >
            Rachel Rios
          </p>
        </div>

        {/* Zone 3 — Gradient divider */}
        <div className="h-px bg-linear-to-r from-transparent via-violet-500 to-transparent" />

        {/* Zone 4 — Three-column links bar */}
        <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
          <nav className="flex flex-col gap-1.5" aria-label="Footer navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-violet-100 transition w-fit"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-1.5">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-violet-100 transition w-fit"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex flex-col gap-1.5">
            {locationLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>

        {/* Zone 5 — Tagline / copyright */}
        <div className="max-w-6xl mx-auto px-4 py-8 text-center text-sm text-violet-400 flex flex-col gap-1">
          <p>
            Made with intention. Designed for{" "}
            <span className={playfair.className}>change</span>.
          </p>
          <p>© {new Date().getFullYear()}, Rachel Rios®</p>
        </div>
      </div>
    </footer>
  );
}
