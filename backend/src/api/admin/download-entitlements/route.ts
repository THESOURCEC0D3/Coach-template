import type { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { DIGITAL_MODULE } from "../../../modules/digital";
import type DigitalModuleService from "../../../modules/digital/service";
export async function GET(req: AuthenticatedMedusaRequest, res: MedusaResponse) {
  if (!req.auth_context?.actor_id) return res.status(401).json({ message: "Staff authentication required." });
  const service = req.scope.resolve<DigitalModuleService>(DIGITAL_MODULE);
  const [entitlements, count] = await service.listAndCountDigitalEntitlements({}, { take: 100, order: { created_at: "DESC" } });
  return res.json({ entitlements: entitlements.map(({ file_key: _key, ...row }) => row), count });
}
