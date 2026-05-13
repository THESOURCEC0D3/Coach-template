"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-violet-700">
          Rachel Rios
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-8 text-gray-600 font-medium">
          <li>
            <Link href="/" className="hover:text-violet-700 transition">
              Home
            </Link>
          </li>
          <li>
            <Link href="/#bio" className="hover:text-violet-700 transition">
              About
            </Link>
          </li>
          <li>
            <Link href="/#services" className="hover:text-violet-700 transition">
              Services
            </Link>
          </li>
          <li>
            <Link href="/contact" className="hover:text-violet-700 transition">
              Contact
            </Link>
          </li>
        </ul>

        {/* Desktop CTA Button */}
        <Link
          href="/contact"
          className="hidden md:block bg-violet-700 text-white px-5 py-2 rounded-full font-medium hover:bg-violet-800 transition"
        >
          Free Discovery Call
        </Link>

        {/* Mobile Menu Button */}
        <button
          type="button"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          className="md:hidden text-gray-600 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white px-4 pb-4 flex flex-col gap-4 text-gray-600 font-medium">
          <Link href="/" onClick={() => setIsOpen(false)}>
            Home
          </Link>
          <Link href="/#bio" onClick={() => setIsOpen(false)}>
            About
          </Link>
          <Link href="/#services" onClick={() => setIsOpen(false)}>
            Services
          </Link>
          <Link href="/contact" onClick={() => setIsOpen(false)}>
            Contact
          </Link>
          <Link
            href="/contact"
            onClick={() => setIsOpen(false)}
            className="bg-violet-700 text-white px-5 py-2 rounded-full text-center"
          >
            Free Discovery Call
          </Link>
        </div>
      )}
    </nav>
  );
}
