"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShoppingBag, X } from "lucide-react";
import { site } from "@/lib/site";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [ ["About", "/about"], ["Services", "/services"], ["Books", "/books"], ["Events", "/events"], ["Resources", "/resources"] ];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  useEffect(() => {
    if (!isOpen) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setIsOpen(false); toggle.current?.focus(); }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [isOpen]);
  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-md">
      <nav aria-label="Main navigation" className="mx-auto flex min-h-21 max-w-6xl items-center justify-between gap-3 px-5 sm:px-6">
        <Link href="/" onClick={() => setIsOpen(false)} className="flex min-w-0 items-center gap-2 sm:gap-3" aria-label={`${site.name} home`}>
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gold-700 font-serif text-lg text-white sm:size-10" aria-hidden="true">TK</span>
          <span className="text-base font-semibold tracking-tight text-gray-900 sm:text-xl">Trophy Kiprono<span className="hidden text-[10px] font-medium tracking-[.23em] text-gold-700 sm:block">COMMUNICATION · COACHING · BOOKS</span></span>
        </Link>
        <ul className="hidden items-center gap-5 text-sm font-medium text-gray-600 lg:flex">
          {links.map(([label, href]) => <li key={href}><Link href={href} aria-current={pathname.startsWith(href) ? "page" : undefined} className="py-3 transition hover:text-gold-700 aria-[current=page]:text-gold-700">{label}</Link></li>)}
        </ul>
        <div className="flex shrink-0 items-center gap-1 sm:gap-4">
          <Link href="/cart" onClick={() => setIsOpen(false)} className="flex size-11 items-center justify-center rounded-full text-gray-700 hover:bg-gold-50 hover:text-gold-700" aria-label="Shopping bag"><ShoppingBag size={21} aria-hidden="true" /></Link>
          <Link href="/contact" className={cn(buttonVariants({ className: "whitespace-nowrap px-5" }), "hidden lg:inline-flex")}>Book a Consultation</Link>
          <button ref={toggle} type="button" aria-controls="mobile-navigation" aria-expanded={isOpen} aria-label={isOpen ? "Close menu" : "Open menu"} onClick={() => setIsOpen(!isOpen)} className="flex size-11 items-center justify-center rounded-full text-gray-700 hover:bg-gold-50 lg:hidden">{isOpen ? <X size={24} /> : <Menu size={24} />}</button>
        </div>
      </nav>
      {isOpen && <nav id="mobile-navigation" aria-label="Mobile navigation" className="border-t border-gray-100 bg-white px-5 pb-6 pt-3 shadow-md lg:hidden">
        <ul className="mx-auto max-w-6xl space-y-1">{[["Home", "/"], ...links, ["My Account", "/account"]].map(([label, href]) => <li key={href}><Link href={href} onClick={() => setIsOpen(false)} className="block rounded-xl px-3 py-3 text-gray-700 hover:bg-gold-50 hover:text-gold-700">{label}</Link></li>)}</ul>
        <Link href="/contact" onClick={() => setIsOpen(false)} className={buttonVariants({ className: "mt-3 w-full" })}>Book a Consultation</Link>
      </nav>}
    </header>
  );
}
