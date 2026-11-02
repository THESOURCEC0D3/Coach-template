import type { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export async function GET(req: AuthenticatedMedusaRequest, res: MedusaResponse) {
  if (!req.auth_context?.actor_id) return res.status(401).json({ message: "Staff authentication required." });
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
  const { data: orders } = await query.graph({ entity: "order", fields: ["id", "status", "currency_code", "total", "items.title", "items.quantity", "payment_collections.status", "payment_collections.captured_amount", "payment_collections.refunded_amount"], pagination: { take: 5000, skip: 0, order: { created_at: "DESC" } } });
  let captured = 0, refunded = 0, paidOrders = 0;
  const titles = new Map<string, number>();
  for (const order of orders) {
    if (order.currency_code !== "kes") continue;
    let paid = false;
    for (const collection of order.payment_collections || []) {
      captured += Number(collection.captured_amount || 0);
      refunded += Number(collection.refunded_amount || 0);
      paid ||= collection.status === "completed";
    }
    if (paid && order.status !== "canceled") {
      paidOrders++;
      for (const item of order.items || []) if (item?.title) titles.set(item.title, (titles.get(item.title) || 0) + Number(item.quantity));
    }
  }
  return res.json({ currency: "KES", orders_reviewed: orders.length, paid_orders: paidOrders, captured, refunded, net_captured: captured - refunded, book_units: [...titles.entries()].map(([title, units]) => ({ title, units })).sort((a, b) => b.units - a.units), scope: "Latest 5,000 orders; KES captured payments only. Units include paid orders before returns." });
}
