import type { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { INQUIRY_MODULE } from "../../../../modules/inquiries";
import type InquiryModuleService from "../../../../modules/inquiries/service";
import { reviewSchema } from "../../../../modules/inquiries/validation";

export async function POST(req: AuthenticatedMedusaRequest, res: MedusaResponse) {
  if (!req.auth_context?.actor_id) return res.status(401).json({ message: "Staff authentication is required." });
  const parsed = reviewSchema.safeParse(req.body);
  if (!parsed.success) return res.status(422).json({ message: "Invalid review details." });
  const service = req.scope.resolve<InquiryModuleService>(INQUIRY_MODULE);
  const inquiry = await service.review(req.params.id, parsed.data, req.auth_context.actor_id);
  res.setHeader("Cache-Control", "private, no-store");
  return res.json({ inquiry: { id: inquiry.id, status: inquiry.status, status_history: inquiry.status_history, confirmed_date: inquiry.confirmed_date } });
}
