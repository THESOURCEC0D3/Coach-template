import { createHash } from "node:crypto";
import { MedusaService, InjectManager, InjectTransactionManager, MedusaContext, MedusaError } from "@medusajs/framework/utils";
import type { Context } from "@medusajs/framework/types";
import type { EntityManager } from "@medusajs/framework/mikro-orm/knex";
import { Inquiry } from "./models/inquiry";
import { emailRateKey, hashToken, trackingToken, transitionAllowed, type InquiryStatus } from "./policy";
import type { InquiryInput, ReviewInput } from "./validation";

export default class InquiryModuleService extends MedusaService({ Inquiry }) {
  @InjectManager()
  async submit(input: InquiryInput, secret: string, @MedusaContext() context?: Context<EntityManager>) {
    return this.submit_(input, secret, context);
  }

  @InjectTransactionManager()
  protected async submit_(input: InquiryInput, secret: string, @MedusaContext() context?: Context<EntityManager>) {
    const manager = context?.transactionManager;
    if (!manager) throw new Error("Inquiry transaction manager is unavailable.");
    await manager.execute("select pg_advisory_xact_lock(hashtext(?))", [`inquiry-request:${input.request_id}`]);
    const { request_id, website: _honeypot, ...details } = input;
    const inputDigest = createHash("sha256").update(JSON.stringify(details)).digest("hex");
    const token = trackingToken(request_id, secret);
    const previous = await this.listInquiries({ request_id }, { take: 1 }, context);
    if (previous[0]) {
      if (previous[0].input_digest !== inputDigest) throw new MedusaError(MedusaError.Types.CONFLICT, "Submission reference is already in use.");
      return { id: previous[0].id, status: previous[0].status, tracking_token: previous[0].tracking_token_hash === hashToken(token) ? token : undefined, already_received: true };
    }
    const rateKey = emailRateKey(input.email, secret);
    await manager.execute("select pg_advisory_xact_lock(hashtext(?))", [`inquiry-email:${rateKey}`]);
    const counts = await manager.execute<{ total: number }[]>("select count(*)::int as total from inquiry where email_hash = ? and created_at > now() - interval '1 hour' and deleted_at is null", [rateKey]);
    if ((counts[0]?.total ?? 0) >= 3) {
      throw new MedusaError(MedusaError.Types.NOT_ALLOWED, "INQUIRY_RATE_LIMIT");
    }
    const inquiry = await this.createInquiries({
      request_id, input_digest: inputDigest, ...details,
      organization: input.organization || null, preferred_date: input.preferred_date || null,
      email_hash: rateKey, tracking_token_hash: hashToken(token),
      status: "received", status_history: { entries: [{ status: "received", at: new Date().toISOString(), actor: "visitor" }] },
      notification_status: "pending", notification_attempts: 0,
    }, context);
    return { id: inquiry.id, status: inquiry.status, tracking_token: token, already_received: false };
  }

  @InjectManager()
  async review(id: string, input: ReviewInput, actorId: string, @MedusaContext() context?: Context<EntityManager>) {
    return this.review_(id, input, actorId, context);
  }

  @InjectTransactionManager()
  protected async review_(id: string, input: ReviewInput, actorId: string, @MedusaContext() context?: Context<EntityManager>) {
    const manager = context?.transactionManager;
    if (!manager) throw new Error("Inquiry transaction manager is unavailable.");
    await manager.execute("select pg_advisory_xact_lock(hashtext(?))", [`inquiry-review:${id}`]);
    const inquiry = await this.retrieveInquiry(id, {}, context);
    if (!transitionAllowed(inquiry.status as InquiryStatus, input.status, { date: input.confirmed_date, reference: input.calendar_reference, availability_verified: input.availability_verified })) {
      throw new MedusaError(MedusaError.Types.INVALID_DATA, "Invalid status transition or unverified calendar availability.");
    }
    const history = Array.isArray(inquiry.status_history?.entries) ? inquiry.status_history.entries : [];
    return this.updateInquiries({
      id, status: input.status,
      status_history: { entries: [...history, { status: input.status, at: new Date().toISOString(), actor: actorId, note: input.note, ...(input.status === "confirmed" ? { confirmed_date: input.confirmed_date, calendar_reference: input.calendar_reference } : {}) }] },
      confirmed_date: input.status === "confirmed" ? input.confirmed_date : input.status === "closed" ? inquiry.confirmed_date : null,
      calendar_verified_at: input.status === "confirmed" ? new Date() : input.status === "closed" ? inquiry.calendar_verified_at : null,
      calendar_reference: input.status === "confirmed" ? input.calendar_reference : input.status === "closed" ? inquiry.calendar_reference : null,
    }, context);
  }

  @InjectManager()
  async claimNotification(id: string, @MedusaContext() context?: Context<EntityManager>) {
    return this.claimNotification_(id, context);
  }

  @InjectTransactionManager()
  protected async claimNotification_(id: string, @MedusaContext() context?: Context<EntityManager>) {
    const manager = context?.transactionManager;
    if (!manager) throw new Error("Inquiry transaction manager is unavailable.");
    await manager.execute("select pg_advisory_xact_lock(hashtext(?))", [`inquiry-notification:${id}`]);
    const inquiry = await this.retrieveInquiry(id, {}, context);
    if (inquiry.notification_status === "sent" || inquiry.notification_attempts >= 5) return null;
    if (inquiry.notification_status === "sending" && inquiry.notification_started_at && new Date(inquiry.notification_started_at).valueOf() > Date.now() - 300_000) return null;
    return this.updateInquiries({ id, notification_status: "sending", notification_attempts: inquiry.notification_attempts + 1, notification_started_at: new Date() }, context);
  }
}
