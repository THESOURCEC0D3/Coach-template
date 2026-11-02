import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const challenges = ["You have something to say, but nerves get in the way.", "Your ideas deserve to be heard clearly in the room.", "You want your team to communicate with more intention.", "You’re ready to take your next step, and would value support."];
export default function Empathy() {
  return <section className="bg-white"><div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 sm:px-6 md:grid-cols-2 md:gap-20">
    <div><p className="mb-4 text-xs font-semibold tracking-[.2em] text-gold-700 uppercase">Does this sound familiar?</p><h2 className="text-4xl leading-tight text-gray-900 sm:text-5xl">There’s more you<br />want to <span className="text-gold-700 italic">express.</span></h2><p className="mt-6 max-w-md leading-relaxed text-gray-600">You don’t have to work it all out alone. Coaching begins with understanding where you are and what you would like to change.</p><Link href="/contact" className="mt-6 inline-flex min-h-11 items-center gap-2 font-semibold text-gold-700">Let’s start a conversation<ArrowUpRight size={18} aria-hidden="true" /></Link></div>
    <ol className="divide-y divide-gold-100">{challenges.map((challenge, index) => <li key={challenge} className="flex gap-5 py-6"><span className="font-heading shrink-0 text-3xl text-gold-300" aria-hidden="true">0{index + 1}</span><p className="pt-1 text-lg leading-relaxed text-gray-700">{challenge}</p></li>)}</ol>
  </div></section>;
}
