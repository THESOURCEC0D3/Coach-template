import "server-only";
import { cookies } from "next/headers";

export class CommerceError extends Error {
  constructor(message: string, public status = 500) { super(message); }
}

export function commerceConfig() {
  const url = process.env.MEDUSA_BACKEND_URL || "http://localhost:9000";
  const key = process.env.MEDUSA_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;
  return { url: url.replace(/\/$/, ""), key, available: Boolean(key) };
}

export async function medusa<T>(path: string, options: { method?: string; body?: unknown; authenticated?: boolean; token?: string; timeout?: number; headers?: Record<string, string> } = {}): Promise<T> {
  const { url, key } = commerceConfig();
  if (!key) throw new CommerceError("The bookstore is being prepared. Please contact Trophy for book enquiries.", 503);
  const token = options.token ?? (options.authenticated ? (await cookies()).get("trophy_customer")?.value : undefined);
  const headers: Record<string, string> = { "Content-Type": "application/json", "x-publishable-api-key": key };
  Object.assign(headers, options.headers || {});
  if (token) headers.Authorization = `Bearer ${token}`;
  let response: Response;
  try {
    response = await fetch(`${url}${path}`, { method: options.method || "GET", headers, body: options.body === undefined ? undefined : JSON.stringify(options.body), cache: "no-store", signal: AbortSignal.timeout(options.timeout || 30_000) });
  } catch {
    throw new CommerceError("The bookstore is temporarily unavailable. Please try again shortly.", 503);
  }
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    // Expose validation messages only. Do not leak backend internals.
    const message = response.status === 401 || response.status === 403 ? "Please sign in to access this information." : response.status === 400 && typeof body.message === "string" ? body.message.slice(0, 220) : response.status === 404 ? "This item is no longer available." : "We could not complete that request. Please try again.";
    throw new CommerceError(message, response.status);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const customerCookieOptions = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/", maxAge: 60 * 60 * 24 };
export const cartCookieOptions = { ...customerCookieOptions, maxAge: 60 * 60 * 24 * 14 };
