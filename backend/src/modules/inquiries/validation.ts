import { z } from "@medusajs/framework/zod";
import { services, statuses, validPreferredDate } from "./policy";

export const inquirySchema = z.object({
  request_id: z.string().uuid(),
  full_name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254).transform(value => value.toLowerCase()),
  phone: z.string().trim().min(7).max(32).regex(/^\+?[\d\s().-]+$/).refine(value => {
    const digits = value.replace(/\D/g, "").length;
    return digits >= 7 && digits <= 15;
  }, "Please provide a valid phone number."),
  organization: z.string().trim().max(160).optional().default(""),
  service: z.enum(services),
  preferred_date: z.string().refine(value => value === "" || validPreferredDate(value), "Preferred date must be a real date from today onward in Kenya time.").optional().default(""),
  delivery_format: z.enum(["online", "in-person", "hybrid", "discuss"]),
  message: z.string().trim().min(10).max(5000),
  consent: z.literal(true),
  website: z.string().max(0).optional().default(""),
}).strict();

export const reviewSchema = z.object({
  status: z.enum(statuses),
  note: z.string().trim().min(3).max(1000),
  availability_verified: z.boolean().optional().default(false),
  confirmed_date: z.string().max(10).optional(),
  calendar_reference: z.string().trim().max(500).optional(),
}).strict();

export type InquiryInput = z.infer<typeof inquirySchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
