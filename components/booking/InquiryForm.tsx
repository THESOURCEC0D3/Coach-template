"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2, Copy } from "lucide-react";
import { services } from "@/lib/site";
import type { InquiryReceipt } from "@/lib/booking/types";

const inputStyle = "mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-gold-700 focus:outline-none focus:ring-2 focus:ring-gold-200";

export default function InquiryForm({ selectedService = "" }: { selectedService?: string }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState<InquiryReceipt | null>(null);
  const [copied, setCopied] = useState(false);
  const requestId = useRef<string>("");
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Nairobi", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setError("");
    const values = new FormData(event.currentTarget);
    requestId.current ||= crypto.randomUUID();
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: values.get("full_name"), email: values.get("email"), phone: values.get("phone"),
          organization: values.get("organization"), service: values.get("service"),
          preferred_date: values.get("preferred_date"), delivery_format: values.get("delivery_format"),
          message: values.get("message"), consent: values.get("consent") === "on",
          website: values.get("website"), request_id: requestId.current,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        if (response.status === 409) requestId.current = "";
        throw new Error(data.message || "Your inquiry could not be submitted.");
      }
      setReceipt(data.inquiry);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Please try again or contact Trophy directly.");
    } finally {
      setPending(false);
    }
  }

  if (receipt) {
    return <div className="rounded-2xl border border-gold-200 bg-white p-6 sm:p-10" role="status" aria-live="polite">
      <CheckCircle2 className="mb-5 h-10 w-10 text-gold-700" aria-hidden="true" />
      <h2 className="text-3xl text-gray-900">Your conversation starts here.</h2>
      <p className="mt-4 leading-relaxed text-gray-600">Your inquiry has been saved for review. Your preferred date is a request; an appointment is confirmed only after availability has been checked.</p>
      <p className="mt-5 text-sm text-gray-600">Reference <span className="font-mono font-medium text-gray-900">{receipt.id}</span></p>
      {receipt.tracking_token && <div className="mt-6 rounded-xl bg-gold-50 p-4">
        <p className="font-semibold text-gold-900">Save your private tracking code</p>
        <p className="mt-2 break-all font-mono text-sm text-gold-900">{receipt.tracking_token}</p>
        <p className="mt-2 text-sm text-gold-900">Use it below to check your request. Keep it private.</p>
        <button type="button" className="mt-3 inline-flex items-center gap-2 rounded-full border border-gold-300 px-4 py-2 text-sm font-semibold text-gold-800 hover:bg-gold-100" onClick={async () => { try { await navigator.clipboard.writeText(receipt.tracking_token!); setCopied(true); } catch { setCopied(false); } }}><Copy className="h-4 w-4" aria-hidden="true" />{copied ? "Copied" : "Copy tracking code"}</button>
      </div>}
      <Link href="/services" className="mt-6 inline-flex items-center gap-2 font-semibold text-gold-700">Explore the services <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
    </div>;
  }

  return <form onSubmit={submit} method="post" className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-10">
    <h2 className="text-3xl text-gray-900">Tell me what you have in mind.</h2>
    <p className="mt-3 text-sm leading-relaxed text-gray-500">A few details help start a useful conversation. Fields marked * are required.</p>
    <div className="mt-8 grid gap-6 sm:grid-cols-2">
      <label className="text-sm font-semibold text-gray-700">Full name *<input className={inputStyle} name="full_name" autoComplete="name" required minLength={2} maxLength={120} placeholder="Your name" /></label>
      <label className="text-sm font-semibold text-gray-700">Email address *<input className={inputStyle} name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@example.com" /></label>
      <label className="text-sm font-semibold text-gray-700">Phone number *<input className={inputStyle} name="phone" type="tel" autoComplete="tel" required minLength={7} maxLength={32} placeholder="Include your country code" /></label>
      <label className="text-sm font-semibold text-gray-700">Organization<input className={inputStyle} name="organization" autoComplete="organization" maxLength={160} placeholder="If applicable" /></label>
      <label className="text-sm font-semibold text-gray-700 sm:col-span-2">I am interested in *<select className={inputStyle} name="service" defaultValue={services.some(s => s.slug === selectedService) ? selectedService : ""} required>
        <option value="" disabled>Select a service</option>
        {services.map(service => <option key={service.slug} value={service.slug}>{service.title}</option>)}
      </select></label>
      <label className="text-sm font-semibold text-gray-700">Preferred date<input className={inputStyle} name="preferred_date" type="date" min={today} /><span className="mt-2 block text-xs font-normal text-gray-500">Optional. Dates are considered in Kenya time.</span></label>
      <label className="text-sm font-semibold text-gray-700">Preferred format *<select className={inputStyle} name="delivery_format" defaultValue="discuss" required>
        <option value="discuss">Let us discuss</option><option value="online">Online</option><option value="in-person">In person</option><option value="hybrid">Hybrid</option>
      </select></label>
      <label className="text-sm font-semibold text-gray-700 sm:col-span-2">Your message *<textarea className={`${inputStyle} min-h-36 resize-y`} name="message" required minLength={10} maxLength={5000} placeholder="What would you like to work on? Share your goals, audience, or team needs." /></label>
    </div>
    <div className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
    <label className="mt-6 flex items-start gap-3 text-sm leading-relaxed text-gray-600"><input className="mt-1 h-4 w-4 shrink-0 accent-gold-700" name="consent" type="checkbox" required /><span>I agree that these details may be used to respond to this inquiry, as described in the <Link className="font-semibold text-gold-700 underline underline-offset-2" href="/privacy">Privacy Policy</Link>. This does not subscribe me to marketing.</span></label>
    {error && <p id="inquiry-error" className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-900" role="alert">{error}</p>}
    <button className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold-700 px-7 py-3.5 font-semibold text-white transition hover:bg-gold-800 disabled:cursor-wait disabled:opacity-60 sm:w-auto" type="submit" disabled={pending}>{pending ? "Sending your inquiry…" : "Send inquiry"}<ArrowRight className="h-4 w-4" aria-hidden="true" /></button>
    <p className="mt-4 text-xs leading-relaxed text-gray-500">Submitting this form does not confirm a booking or take a payment.</p>
  </form>;
}
