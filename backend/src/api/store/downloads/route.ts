import type { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { DIGITAL_MODULE } from "../../../modules/digital";
import type DigitalModuleService from "../../../modules/digital/service";

export async function GET(req: AuthenticatedMedusaRequest, res: MedusaResponse) {
  const actor = req.auth_context?.actor_id;
  if (!actor) return res.status(401).json({ message: "Sign in to access your library." });
  const service = req.scope.resolve<DigitalModuleService>(DIGITAL_MODULE);
  const rows = await service.listDigitalEntitlements({ customer_id: actor }, { take: 100, order: { created_at: "DESC" } });
  res.setHeader("Cache-Control", "private, no-store");
  return res.json({ downloads: rows.map(({ file_key: _key, customer_id: _customer, ...row }) => row) });
}
