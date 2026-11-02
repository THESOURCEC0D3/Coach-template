import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export const services = ["public-speaking", "corporate-training", "executive-coaching", "life-coaching", "etiquette-soft-skills", "english-tutoring"] as const;
export const statuses = ["received", "reviewing", "needs-information", "proposed", "confirmed", "declined", "closed"] as const;
export type InquiryStatus = typeof statuses[number];

const transitions: Record<InquiryStatus, readonly InquiryStatus[]> = {
  received: ["reviewing", "declined", "closed"],
  reviewing: ["needs-information", "proposed", "declined", "closed"],
  "needs-information": ["reviewing", "closed"],
  proposed: ["confirmed", "reviewing", "declined", "closed"],
  confirmed: ["reviewing", "closed"],
  declined: ["reviewing", "closed"],
  closed: [],
};

export function validPreferredDate(value: string, now = new Date()): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00Z`);
  if (!Number.isFinite(date.valueOf()) || date.toISOString().slice(0, 10) !== value) return false;
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Nairobi", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
  return value >= today;
}

export function transitionAllowed(from: InquiryStatus, to: InquiryStatus, confirmation?: { date?: string; reference?: string; availability_verified?: boolean }): boolean {
  if (!transitions[from].includes(to)) return false;
  return to !== "confirmed" || Boolean(confirmation?.availability_verified && confirmation.date && validPreferredDate(confirmation.date) && confirmation.reference?.trim());
}

export function hashToken(value: string) { return createHash("sha256").update(value).digest("hex"); }
export function trackingToken(requestId: string, secret: string) { return createHmac("sha256", secret).update(`inquiry:${requestId}`).digest("base64url"); }
export function emailRateKey(email: string, secret: string) { return createHmac("sha256", secret).update(email.trim().toLowerCase()).digest("hex"); }
export function secretMatches(actual: unknown, expected: string | undefined) {
  if (typeof actual !== "string" || !expected || expected.length < 32) return false;
  const received = Buffer.from(actual);
  const configured = Buffer.from(expected);
  return received.length === configured.length && timingSafeEqual(received, configured);
}

export function publicProgress(inquiry: { id: string; status: string; service: string; preferred_date?: string | null; confirmed_date?: string | null; updated_at: unknown }) {
  return { id: inquiry.id, status: inquiry.status, service: inquiry.service, preferred_date: inquiry.preferred_date ?? null, confirmed_date: inquiry.confirmed_date ?? null, updated_at: inquiry.updated_at };
}
