import "server-only";
import { createHmac } from "node:crypto";

export function createOrderCapability(orderId: string) {
  const secret = process.env.ORDER_ACCESS_SECRET;
  if (!secret) throw new Error("Guest order access is not configured.");
  const payload = Buffer.from(JSON.stringify({ order_id: orderId, expires_at: Date.now() + 30 * 24 * 60 * 60 * 1000 })).toString("base64url");
  return `${payload}.${createHmac("sha256", secret).update(payload).digest("base64url")}`;
}
