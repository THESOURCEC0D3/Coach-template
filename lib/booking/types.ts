export type InquiryStatus = "received" | "reviewing" | "needs-information" | "proposed" | "confirmed" | "declined" | "closed";

export const inquiryStatusLabels: Record<InquiryStatus, string> = {
  received: "Request received",
  reviewing: "Under review",
  "needs-information": "More information needed",
  proposed: "A date has been proposed",
  confirmed: "Consultation confirmed",
  declined: "Unable to accommodate",
  closed: "Request closed",
};

export type InquiryReceipt = {
  id: string;
  status: InquiryStatus;
  tracking_token?: string;
  already_received?: boolean;
};

export type InquiryProgress = {
  id: string;
  status: InquiryStatus;
  service: string;
  preferred_date: string | null;
  confirmed_date: string | null;
  updated_at: string;
};
