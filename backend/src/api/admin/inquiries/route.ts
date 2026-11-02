import type { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { INQUIRY_MODULE } from "../../../modules/inquiries";
import type InquiryModuleService from "../../../modules/inquiries/service";
import { statuses } from "../../../modules/inquiries/policy";

export async function GET(req: AuthenticatedMedusaRequest, res: MedusaResponse) {
  if (!req.auth_context?.actor_id) return res.status(401).json({ message: "Staff authentication is required." });
  const requestedStatus = typeof req.query.status === "string" && statuses.includes(req.query.status as typeof statuses[number]) ? req.query.status : undefined;
  const service = req.scope.resolve<InquiryModuleService>(INQUIRY_MODULE);
  const take = Math.min(100, Math.max(1, Number(req.query.limit) || 25));
  const skip = Math.max(0, Number(req.query.offset) || 0);
  const [records, count] = await service.listAndCountInquiries(requestedStatus ? { status: requestedStatus as typeof statuses[number] } : {}, { take, skip, order: { created_at: "DESC" } });
  const inquiries = records.map(({ tracking_token_hash: _token, email_hash: _emailHash, input_digest: _digest, request_id: _requestId, ...inquiry }) => inquiry);
  res.setHeader("Cache-Control", "private, no-store");
  return res.json({ inquiries, count, limit: take, offset: skip });
}
