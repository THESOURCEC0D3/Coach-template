import type { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { INQUIRY_MODULE } from "../../../../../modules/inquiries";
import type InquiryModuleService from "../../../../../modules/inquiries/service";
import { notifyInquiry } from "../../../../../modules/inquiries/notifications";

export async function POST(req: AuthenticatedMedusaRequest, res: MedusaResponse) {
  if (!req.auth_context?.actor_id) return res.status(401).json({ message: "Staff authentication is required." });
  const service = req.scope.resolve<InquiryModuleService>(INQUIRY_MODULE);
  const inquiry = await service.retrieveInquiry(req.params.id);
  if (inquiry.notification_status === "sent") return res.json({ status: "sent" });
  if (inquiry.notification_status === "sending" && inquiry.notification_started_at && new Date(inquiry.notification_started_at).valueOf() > Date.now() - 300_000) return res.status(409).json({ message: "Notification delivery is already in progress." });
  await service.updateInquiries({ id: inquiry.id, notification_status: "pending", notification_attempts: 0 });
  await notifyInquiry(service, inquiry.id);
  const updated = await service.retrieveInquiry(inquiry.id);
  return res.json({ status: updated.notification_status });
}
