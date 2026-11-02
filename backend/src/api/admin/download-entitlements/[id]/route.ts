import type { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { DIGITAL_MODULE } from "../../../../modules/digital";
import type DigitalModuleService from "../../../../modules/digital/service";
export async function DELETE(req: AuthenticatedMedusaRequest, res: MedusaResponse) {
  const actor = req.auth_context?.actor_id;
  if (!actor) return res.status(401).json({ message: "Staff authentication required." });
  const service = req.scope.resolve<DigitalModuleService>(DIGITAL_MODULE);
  await service.revoke(req.params.id, actor);
  return res.json({ revoked: true });
}
