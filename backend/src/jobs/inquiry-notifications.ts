import type { MedusaContainer } from "@medusajs/framework/types";
import { INQUIRY_MODULE } from "../modules/inquiries";
import type InquiryModuleService from "../modules/inquiries/service";
import { notifyInquiry } from "../modules/inquiries/notifications";

export default async function retryInquiryNotifications(container: MedusaContainer) {
  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM || !process.env.INQUIRY_NOTIFICATION_EMAIL) return;
  const service = container.resolve<InquiryModuleService>(INQUIRY_MODULE);
  const pending = await service.listInquiries({ notification_status: ["pending", "failed", "unconfigured", "sending"], notification_attempts: { $lt: 5 } }, { take: 25, order: { created_at: "ASC" } });
  for (const inquiry of pending) await notifyInquiry(service, inquiry.id);
}

export const config = { name: "retry-inquiry-notifications", schedule: "*/5 * * * *" };
