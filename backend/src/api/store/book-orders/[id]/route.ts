import type { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { getOrderDetailWorkflow } from "@medusajs/medusa/core-flows";
import { verifyOrderCapability } from "../../../../modules/digital/order-access";
import { DIGITAL_MODULE } from "../../../../modules/digital";
import type DigitalModuleService from "../../../../modules/digital/service";

export async function GET(req: AuthenticatedMedusaRequest, res: MedusaResponse) {
  const id = req.params.id;
  const capability = req.headers["x-order-capability"];
  const guestAuthorized = verifyOrderCapability(typeof capability === "string" ? capability : undefined, id, process.env.ORDER_ACCESS_SECRET);
  const actor = req.auth_context?.actor_id;
  if (!guestAuthorized) {
    if (!actor) return res.status(401).json({ message: "Order access requires verification." });
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
    const { data } = await query.graph({ entity: "order", fields: ["id", "customer_id"], filters: { id, customer_id: actor } });
    if (!data.length) return res.status(404).json({ message: "Order not found." });
  }
  const { result: order } = await getOrderDetailWorkflow(req.scope).run({ input: { order_id: id, fields: ["id", "display_id", "status", "total", "currency_code", "email", "created_at", "payment_status", "fulfillment_status", "items.*", "payment_collections.*", "fulfillments.*"] } });
  const digital = req.scope.resolve<DigitalModuleService>(DIGITAL_MODULE);
  const rows = await digital.listDigitalEntitlements({ order_id: id }, { take: 100 });
  res.setHeader("Cache-Control", "private, no-store");
  return res.json({ order, downloads: rows.map(({ file_key: _key, customer_id: _customer, ...row }) => row) });
}
