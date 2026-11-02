export type PaidOrder = { status?: string; total: number | string; payment_collections?: { status?: string; captured_amount?: number | string; refunded_amount?: number | string }[] };

/** Access requires captured, unrefunded payment. Authorization alone is insufficient. */
export function hasConfirmedPayment(order: PaidOrder): boolean {
  const total = Number(order.total);
  const payments = order.payment_collections || [];
  if (!Number.isFinite(total) || total <= 0 || order.status === "canceled" || !payments.length) return false;
  if (payments.some((payment) => payment.status !== "completed" || Number(payment.refunded_amount || 0) > 0)) return false;
  return payments.reduce((amount, payment) => amount + Number(payment.captured_amount || 0), 0) >= total;
}

export function canGrant(entitlement: { customer_id: string | null; revoked_at?: Date | string | null; grant_count: number; download_limit: number }, customerId: string) {
  return Boolean(customerId) && entitlement.customer_id === customerId && !entitlement.revoked_at && entitlement.grant_count < entitlement.download_limit;
}

export function validPrivateKey(value: unknown): value is string {
  return typeof value === "string" && value.length > 0 && value.length <= 512 && !value.startsWith("/") && !value.includes("..") && !value.includes("://") && /\.(pdf|epub)$/i.test(value);
}
