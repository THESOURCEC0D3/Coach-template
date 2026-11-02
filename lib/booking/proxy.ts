import "server-only";
import { NextRequest, NextResponse } from "next/server";

const MAX_BODY_BYTES = 16_384;

export async function proxyInquiry(request: NextRequest, endpoint: "submit" | "status") {
  // Requests originate from this app. Do not trust Host or forwarded client IP
  // for authorization or per-person limits; the backend enforces durable quotas.
  const expectedOrigin = process.env.SITE_URL ? new URL(process.env.SITE_URL).origin : request.nextUrl.origin;
  const origin = request.headers.get("origin");
  if (!origin || origin !== expectedOrigin || request.headers.get("sec-fetch-site") === "cross-site") {
    return NextResponse.json({ message: "Please submit this form from the website." }, { status: 403 });
  }
  if (!request.headers.get("content-type")?.startsWith("application/json")) {
    return NextResponse.json({ message: "Please submit a valid form." }, { status: 415 });
  }
  if (Number(request.headers.get("content-length")) > MAX_BODY_BYTES) return NextResponse.json({ message: "Your message is too long." }, { status: 413 });
  const reader = request.body?.getReader();
  if (!reader) return NextResponse.json({ message: "Please submit a valid form." }, { status: 400 });
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    bytes += value.byteLength;
    if (bytes > MAX_BODY_BYTES) {
      await reader.cancel();
      return NextResponse.json({ message: "Your message is too long." }, { status: 413 });
    }
    chunks.push(value);
  }
  const buffer = new Uint8Array(bytes);
  let position = 0;
  for (const chunk of chunks) { buffer.set(chunk, position); position += chunk.byteLength; }
  const body = new TextDecoder().decode(buffer);
  const secret = process.env.INQUIRY_PROXY_SECRET;
  const backendUrl = process.env.MEDUSA_BACKEND_URL || "http://localhost:9000";
  const publishableKey = process.env.MEDUSA_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;
  if (!secret || !publishableKey) {
    return NextResponse.json({ message: "Online inquiries are temporarily unavailable. Please contact Trophy by phone or LinkedIn." }, { status: 503 });
  }
  try {
    JSON.parse(body);
  } catch {
    return NextResponse.json({ message: "Please submit a valid form." }, { status: 400 });
  }
  try {
    const response = await fetch(`${backendUrl.replace(/\/$/, "")}/store/inquiries${endpoint === "status" ? "/status" : ""}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-publishable-api-key": publishableKey, "x-inquiry-proxy-secret": secret },
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(30_000),
    });
    const data = await response.json();
    if (!response.ok) {
      // Whitelist public validation messages rather than relaying backend internals.
      const messages: Record<number, string> = {
        400: "Please check the form details and your preferred date.",
        404: "No request matches that tracking code.",
        409: "This submission has already been used. Refresh the form to submit a new inquiry.",
        422: "Please check the form details and your preferred date.",
        429: "Too many inquiries have been submitted. Please try again later or contact Trophy directly.",
      };
      return NextResponse.json({ message: messages[response.status] || "Online inquiries are temporarily unavailable. Please try again later or contact Trophy directly." }, { status: messages[response.status] ? response.status : 503 });
    }
    return NextResponse.json(data, { status: response.status, headers: { "Cache-Control": "private, no-store" } });
  } catch {
    return NextResponse.json({ message: "We could not reach the inquiry service. Please try again or contact Trophy by phone or LinkedIn." }, { status: 503 });
  }
}
