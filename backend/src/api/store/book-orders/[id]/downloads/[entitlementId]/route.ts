import type { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { verifyOrderCapability } from "../../../../../../modules/digital/order-access";
import { DIGITAL_MODULE } from "../../../../../../modules/digital";
import type DigitalModuleService from "../../../../../../modules/digital/service";
import { paidOrder } from "../../../../../../modules/digital/orders";
import { signPrivateDownload } from "../../../../../../modules/digital/storage";

export async function POST(req: AuthenticatedMedusaRequest, res: MedusaResponse) {
  const capability = req.headers["x-order-capability"];
  const guest = verifyOrderCapability(typeof capability === "string" ? capability : undefined, req.params.id, process.env.ORDER_ACCESS_SECRET);
  if (!guest && !req.auth_context?.actor_id) return res.status(401).json({ message: "Verified order access required." });
  const service = req.scope.resolve<DigitalModuleService>(DIGITAL_MODULE);
  const entitlement = await service.retrieveDigitalEntitlement(req.params.entitlementId);
  if (entitlement.order_id !== req.params.id) return res.status(404).json({ message: "Download not found." });
  const url = await service.grant(entitlement.id, req.auth_context?.actor_id || `guest:${req.params.id}`, async (orderId) => Boolean(await paidOrder(req.scope, orderId)), signPrivateDownload, guest ? req.params.id : undefined);
  res.setHeader("Cache-Control", "private, no-store");
  return res.json({ url });
}
