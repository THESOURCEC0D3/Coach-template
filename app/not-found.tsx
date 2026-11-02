import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
export default function NotFound() {
  return <main className="mx-auto max-w-6xl px-5 py-24 text-center"><p className="mb-5 text-sm font-semibold text-gold-700">404 · Page not found</p><h1 className="text-4xl text-gray-900 sm:text-5xl">Let’s find your next step.</h1><p className="mx-auto mt-5 max-w-lg leading-relaxed text-gray-600">This page isn’t available. Explore coaching, browse the bookstore or get in touch.</p><div className="mt-8 flex flex-wrap justify-center gap-3"><Link href="/" className={buttonVariants()}>Back to home</Link><Link href="/contact" className={buttonVariants({ variant: "outline" })}>Contact Trophy</Link></div></main>;
}
