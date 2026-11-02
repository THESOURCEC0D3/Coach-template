"use client";

import { useState, type FormEvent } from "react";
import { inquiryStatusLabels, type InquiryProgress } from "@/lib/booking/types";
import { services } from "@/lib/site";

export default function InquiryTracker() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [inquiry, setInquiry] = useState<InquiryProgress | null>(null);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true); setError(""); setInquiry(null);
    const token = new FormData(event.currentTarget).get("tracking_token");
    try {
      const response = await fetch("/api/inquiries/status", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tracking_token: token }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "The request could not be found.");
      setInquiry(data.inquiry);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Please try again."); }
    finally { setPending(false); }
  }
  return <section id="track-inquiry" className="rounded-2xl border border-gray-200 bg-gray-50 p-6 sm:p-8">
    <h2 className="text-2xl text-gray-900">Already sent an inquiry?</h2>
    <p className="mt-3 text-sm leading-relaxed text-gray-600">Enter the private tracking code saved when you submitted your request.</p>
    <form onSubmit={submit} method="post" className="mt-5 flex flex-col gap-3">
      <label className="text-sm font-semibold text-gray-700">Tracking code<input className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 font-mono text-sm focus:border-gold-700 focus:outline-none focus:ring-2 focus:ring-gold-200" name="tracking_token" autoComplete="off" required minLength={40} maxLength={100} spellCheck={false} /></label>
      <button className="rounded-full border border-gold-300 bg-white px-5 py-3 font-semibold text-gold-700 hover:bg-gold-50 disabled:opacity-60" type="submit" disabled={pending}>{pending ? "Checking…" : "Check request status"}</button>
    </form>
    {error && <p className="mt-4 text-sm text-red-900" role="alert">{error}</p>}
    {inquiry && <div className="mt-5 rounded-xl border border-gold-200 bg-white p-4" role="status" aria-live="polite">
      <p className="font-semibold text-gold-800">{inquiryStatusLabels[inquiry.status]}</p>
      <p className="mt-2 text-sm text-gray-700">{services.find(s => s.slug === inquiry.service)?.title || "Service inquiry"}</p>
      {inquiry.confirmed_date && <p className="mt-2 text-sm text-gray-700">Confirmed date: {inquiry.confirmed_date} (Kenya time)</p>}
      {!inquiry.confirmed_date && <p className="mt-2 text-sm text-gray-500">Your appointment is not yet confirmed.</p>}
      <p className="mt-3 break-all font-mono text-xs text-gray-500">{inquiry.id}</p>
    </div>}
  </section>;
}
