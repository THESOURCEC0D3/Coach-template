import Link from "next/link";
import { ArrowUpRight, Link2, Phone } from "lucide-react";
import { site } from "@/lib/site";

const explore = [["About Trophy", "/about"], ["Coaching & Training", "/services"], ["Books & Publications", "/books"], ["Events & Workshops", "/events"], ["Articles & Resources", "/resources"], ["Media & Gallery", "/media"]];
const connect = [["Contact & Booking", "/contact"], ["The Brand Experts Kenya", "/the-brand-experts-kenya"], ["My Account", "/account"], ["Privacy Policy", "/privacy"], ["Terms", "/terms"], ["Refund Policy", "/refunds"], ["Delivery Policy", "/delivery"]];

export default function Footer() {
  return (
    <footer className="bg-gold-950 text-gold-100">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <Link href="/" className="font-heading text-3xl text-white">Trophy Kiprono</Link>
          <p className="mt-5 max-w-sm leading-relaxed text-gold-200">Speak with confidence.<br />Lead with impact.</p>
          <p className="mt-5 text-sm text-gold-200">Public speaking, communications and personal development. Based in Kenya.</p>
          <a href={site.phoneHref} className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm hover:text-white"><Phone size={16} aria-hidden="true" />{site.phone}</a>
          <div><a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-sm hover:text-white"><Link2 size={16} aria-hidden="true" />Connect on LinkedIn<ArrowUpRight size={14} aria-hidden="true" /></a></div>
        </div>
        <nav aria-label="Explore"><p className="mb-4 text-xs font-semibold tracking-widest text-gold-300 uppercase">Explore</p><ul className="space-y-1">{explore.map(([label, href]) => <li key={href}><Link href={href} className="inline-block py-2 text-sm transition hover:text-white">{label}</Link></li>)}</ul></nav>
        <nav aria-label="Information"><p className="mb-4 text-xs font-semibold tracking-widest text-gold-300 uppercase">Stay connected</p><ul className="space-y-1">{connect.map(([label, href]) => <li key={href}><Link href={href} className="inline-block py-2 text-sm transition hover:text-white">{label}</Link></li>)}</ul></nav>
      </div>
      <div className="border-t border-gold-900"><div className="mx-auto flex max-w-6xl flex-col justify-between gap-3 px-5 py-6 text-xs text-gold-300 sm:flex-row sm:px-6"><p>© {new Date().getFullYear()} Trophy Kiprono. All rights reserved.</p><p>Clearer communication. More confident possibilities.</p></div></div>
    </footer>
  );
}
