import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import type { MedusaContainer } from "@medusajs/framework/types";
import { hasConfirmedPayment } from "./policy";
import { DIGITAL_MODULE } from ".";
import type DigitalModuleService from "./service";

export async function paidOrder(container: MedusaContainer, id: string) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const { data } = await query.graph({ entity: "order", fields: ["id", "customer_id", "status", "total", "items.id", "items.variant_id", "payment_collections.status", "payment_collections.captured_amount", "payment_collections.refunded_amount"], filters: { id } });
  const order = data[0];
  return order && hasConfirmedPayment(order as unknown as Parameters<typeof hasConfirmedPayment>[0]) ? order : null;
}

export async function syncPaidOrder(container: MedusaContainer, id: string) {
  const order = await paidOrder(container, id);
  if (!order) return;
  const service = container.resolve<DigitalModuleService>(DIGITAL_MODULE);
  await service.ensureEntitlements({ id: order.id, customer_id: order.customer_id, items: order.items as { id: string; variant_id: string }[] });
}
