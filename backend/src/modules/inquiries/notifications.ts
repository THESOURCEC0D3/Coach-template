import type InquiryModuleService from "./service";

export async function notifyInquiry(service: InquiryModuleService, id: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  const staff = process.env.INQUIRY_NOTIFICATION_EMAIL;
  if (!apiKey || !from || !staff) {
    await service.updateInquiries({ id, notification_status: "unconfigured" });
    return;
  }
  const inquiry = await service.claimNotification(id);
  if (!inquiry) return;
  async function send(to: string, subject: string, text: string, kind: string) {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", "Idempotency-Key": `${id}-${kind}` },
      body: JSON.stringify({ from, to: [to], subject, text }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) throw new Error("Inquiry email delivery failed.");
  }
  try {
    await send(staff!, `New coaching inquiry: ${inquiry.id}`, [
      `Reference: ${inquiry.id}`, `Name: ${inquiry.full_name}`, `Email: ${inquiry.email}`, `Phone: ${inquiry.phone}`,
      `Organization: ${inquiry.organization || "Not specified"}`, `Service: ${inquiry.service}`,
      `Preferred date: ${inquiry.preferred_date || "Not specified"}`, `Format: ${inquiry.delivery_format}`,
      "", inquiry.message, "", "Review this request in Medusa Admin. No appointment has been confirmed.",
    ].join("\n"), "staff");
    await send(inquiry.email, "Your inquiry to Trophy Kiprono has been received", [
      `Hello ${inquiry.full_name},`, "", "Your inquiry has been saved for review.", `Reference: ${inquiry.id}`,
      "Your preferred date is a request. An appointment is confirmed only after calendar availability has been checked.",
      "", "Please keep the private tracking code shown on the website to check your request status.", "", "Trophy Kiprono",
    ].join("\n"), "receipt");
    await service.updateInquiries({ id, notification_status: "sent", last_notified_at: new Date() });
  } catch {
    await service.updateInquiries({ id, notification_status: "failed" });
  }
}
