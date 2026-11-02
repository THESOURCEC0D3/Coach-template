import { createHmac, timingSafeEqual } from "node:crypto";

export function verifyOrderCapability(token: string | undefined, orderId: string, secret: string | undefined, now = Date.now()) {
  if (!token || !secret || token.length > 1024) return false;
  try {
    const [payload, signature, extra] = token.split(".");
    if (!payload || !signature || extra) return false;
    const expected = createHmac("sha256", secret).update(payload).digest();
    const supplied = Buffer.from(signature, "base64url");
    if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return false;
    const value = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return value.order_id === orderId && typeof value.expires_at === "number" && value.expires_at > now;
  } catch { return false; }
}
