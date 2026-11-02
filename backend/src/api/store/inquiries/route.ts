import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { INQUIRY_MODULE } from "../../../modules/inquiries";
import type InquiryModuleService from "../../../modules/inquiries/service";
import { secretMatches } from "../../../modules/inquiries/policy";
import { inquirySchema } from "../../../modules/inquiries/validation";
import { notifyInquiry } from "../../../modules/inquiries/notifications";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const secret = process.env.INQUIRY_PROXY_SECRET;
  if (!secretMatches(req.headers["x-inquiry-proxy-secret"], secret)) return res.status(401).json({ message: "Unauthorized." });
  const parsed = inquirySchema.safeParse(req.body);
  if (!parsed.success) return res.status(422).json({ message: "Invalid inquiry details." });
  const service = req.scope.resolve<InquiryModuleService>(INQUIRY_MODULE);
  try {
    const inquiry = await service.submit(parsed.data, secret!);
    // Persistence succeeded before delivery is attempted; notification failure
    // cannot turn an accepted request into a fictitious submission failure.
    if (!inquiry.already_received) await notifyInquiry(service, inquiry.id).catch(() => undefined);
    res.setHeader("Cache-Control", "private, no-store");
    return res.status(inquiry.already_received ? 200 : 201).json({ inquiry });
  } catch (error) {
    if (error instanceof Error && error.message.includes("INQUIRY_RATE_LIMIT")) return res.status(429).json({ message: "Too many inquiries. Please try again later." });
    throw error;
  }
}
