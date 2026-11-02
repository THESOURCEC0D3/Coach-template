import type { BookFormat, CartItem } from "./types";

export function money(amount: number, currency = "kes") {
  return new Intl.NumberFormat("en-KE", { style: "currency", currency: currency.toUpperCase(), currencyDisplay: "code", minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(amount);
}

export function bookFormat(metadata?: Record<string, unknown>): BookFormat {
  return metadata?.format === "pdf" || metadata?.format === "epub" ? metadata.format : "physical";
}

export function needsShipping(items: Pick<CartItem, "requires_shipping" | "variant">[]) {
  return items.some((item) => typeof item.requires_shipping === "boolean" ? item.requires_shipping : bookFormat(item.variant?.metadata) === "physical");
}

export function validQuantity(input: unknown): number {
  const value = typeof input === "string" ? Number(input) : input;
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 1 || value > 20) throw new Error("Choose a quantity between 1 and 20.");
  return value;
}

export function safeInternalPath(input: unknown, fallback = "/account") {
  return typeof input === "string" && input.startsWith("/") && !input.startsWith("//") && !input.includes("\\") ? input : fallback;
}
