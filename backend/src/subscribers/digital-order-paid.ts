import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { syncPaidOrder } from "../modules/digital/orders";

export default async function handler({ event, container }: SubscriberArgs<{ id: string }>) {
  if (event.name === "order.placed") return syncPaidOrder(container, event.data.id);
  const payments = container.resolve(Modules.PAYMENT);
  const payment = await payments.retrievePayment(event.data.id);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const { data } = await query.graph({ entity: "order_payment_collection", fields: ["order.id"], filters: { payment_collection_id: payment.payment_collection_id } });
  for (const row of data) if (row.order?.id) await syncPaidOrder(container, row.order.id);
}
export const config: SubscriberConfig = { event: ["order.placed", "payment.captured"] };
