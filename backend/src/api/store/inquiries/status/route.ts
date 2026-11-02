import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { INQUIRY_MODULE } from "../../../../modules/inquiries";
import type InquiryModuleService from "../../../../modules/inquiries/service";
import { hashToken, publicProgress, secretMatches } from "../../../../modules/inquiries/policy";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  if (!secretMatches(req.headers["x-inquiry-proxy-secret"], process.env.INQUIRY_PROXY_SECRET)) return res.status(401).json({ message: "Unauthorized." });
  const token = (req.body as { tracking_token?: unknown })?.tracking_token;
  if (typeof token !== "string" || !/^[A-Za-z0-9_-]{43}$/.test(token)) return res.status(404).json({ message: "Request not found." });
  const service = req.scope.resolve<InquiryModuleService>(INQUIRY_MODULE);
  const [inquiry] = await service.listInquiries({ tracking_token_hash: hashToken(token) }, { take: 1 });
  if (!inquiry) return res.status(404).json({ message: "Request not found." });
  res.setHeader("Cache-Control", "private, no-store");
  return res.json({ inquiry: publicProgress(inquiry) });
}
