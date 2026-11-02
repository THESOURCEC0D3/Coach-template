import type { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { z } from "zod";
import { DIGITAL_MODULE } from "../../../modules/digital";
import type DigitalModuleService from "../../../modules/digital/service";
import { validPrivateKey } from "../../../modules/digital/policy";

const schema = z.object({ variant_id: z.string().regex(/^variant_[a-zA-Z0-9]+$/), title: z.string().trim().min(1).max(200), format: z.enum(["pdf", "epub"]), file_key: z.string().refine(validPrivateKey) });
export async function POST(req: AuthenticatedMedusaRequest, res: MedusaResponse) {
  if (!req.auth_context?.actor_id) return res.status(401).json({ message: "Staff authentication required." });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Valid variant, format, title and private object key are required." });
  const service = req.scope.resolve<DigitalModuleService>(DIGITAL_MODULE);
  const existing = await service.listDigitalAssets({ variant_id: parsed.data.variant_id }, { take: 1 });
  const asset = existing[0] ? await service.updateDigitalAssets({ id: existing[0].id, ...parsed.data }) : await service.createDigitalAssets(parsed.data);
  return res.json({ asset });
}
