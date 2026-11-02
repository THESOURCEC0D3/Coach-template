import type { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { DIGITAL_MODULE } from "../../../../modules/digital";
import type DigitalModuleService from "../../../../modules/digital/service";
import { paidOrder } from "../../../../modules/digital/orders";
import { signPrivateDownload } from "../../../../modules/digital/storage";

export async function POST(req: AuthenticatedMedusaRequest, res: MedusaResponse) {
  const actor = req.auth_context?.actor_id;
  if (!actor) return res.status(401).json({ message: "Sign in to access your library." });
  const service = req.scope.resolve<DigitalModuleService>(DIGITAL_MODULE);
  const url = await service.grant(req.params.id, actor, async (orderId) => Boolean(await paidOrder(req.scope, orderId)), signPrivateDownload);
  res.setHeader("Cache-Control", "private, no-store");
  return res.json({ url });
}
