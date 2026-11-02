import { MedusaService, InjectManager, InjectTransactionManager, MedusaContext, MedusaError } from "@medusajs/framework/utils";
import type { Context } from "@medusajs/framework/types";
import type { EntityManager } from "@medusajs/framework/mikro-orm/knex";
import { DigitalAsset } from "./models/asset";
import { DigitalEntitlement, DigitalDownload } from "./models/entitlement";
import { canGrant } from "./policy";

export default class DigitalModuleService extends MedusaService({ DigitalAsset, DigitalEntitlement, DigitalDownload }) {
  @InjectManager()
  async grant(id: string, customerId: string, verifyPaid: (orderId: string) => Promise<boolean>, sign: (key: string, format: string) => Promise<string>, guestOrderId?: string, @MedusaContext() context?: Context<EntityManager>) {
    return this.grant_(id, customerId, verifyPaid, sign, guestOrderId, context);
  }

  @InjectTransactionManager()
  protected async grant_(id: string, customerId: string, verifyPaid: (orderId: string) => Promise<boolean>, sign: (key: string, format: string) => Promise<string>, guestOrderId?: string, @MedusaContext() context?: Context<EntityManager>) {
    const manager = context?.transactionManager;
    if (!manager) throw new Error("Download transaction unavailable.");
    await manager.execute("select pg_advisory_xact_lock(hashtext(?))", [`download:${id}`]);
    const entitlement = await this.retrieveDigitalEntitlement(id, {}, context);
    const guestAuthorized = Boolean(guestOrderId && entitlement.order_id === guestOrderId && !entitlement.customer_id && !entitlement.revoked_at && entitlement.grant_count < entitlement.download_limit);
    if ((!canGrant(entitlement, customerId) && !guestAuthorized) || !await verifyPaid(entitlement.order_id)) {
      throw new MedusaError(MedusaError.Types.NOT_ALLOWED, "This download is not available.");
    }
    const url = await sign(entitlement.file_key, entitlement.format);
    await this.updateDigitalEntitlements({ id, grant_count: entitlement.grant_count + 1 }, context);
    await this.createDigitalDownloads({ entitlement_id: id, actor_id: customerId, order_id: entitlement.order_id, event: "granted" }, context);
    return url;
  }

  @InjectManager()
  async ensureEntitlements(order: { id: string; customer_id?: string | null; items: { id: string; variant_id?: string | null }[] }, @MedusaContext() context?: Context<EntityManager>) {
    return this.ensureEntitlements_(order, context);
  }

  @InjectTransactionManager()
  protected async ensureEntitlements_(order: { id: string; customer_id?: string | null; items: { id: string; variant_id?: string | null }[] }, @MedusaContext() context?: Context<EntityManager>) {
    const manager = context?.transactionManager;
    if (!manager) throw new Error("Entitlement transaction unavailable.");
    await manager.execute("select pg_advisory_xact_lock(hashtext(?))", [`digital-order:${order.id}`]);
    for (const item of order.items) {
      if (!item.variant_id) continue;
      const assets = await this.listDigitalAssets({ variant_id: item.variant_id }, { take: 1 }, context);
      if (!assets[0]) continue;
      const existing = await this.listDigitalEntitlements({ line_item_id: item.id }, { take: 1 }, context);
      if (existing.length) continue;
      const { title, format, file_key } = assets[0];
      const limit = Math.min(100, Math.max(1, Number(process.env.DOWNLOAD_LIMIT) || 5));
      await this.createDigitalEntitlements({ order_id: order.id, line_item_id: item.id, customer_id: order.customer_id || null, title, format, file_key, download_limit: limit }, context);
    }
  }

  @InjectManager()
  async revoke(id: string, actorId: string, @MedusaContext() context?: Context<EntityManager>) { return this.revoke_(id, actorId, context); }

  @InjectTransactionManager()
  protected async revoke_(id: string, actorId: string, @MedusaContext() context?: Context<EntityManager>) {
    const manager = context?.transactionManager;
    if (!manager) throw new Error("Revocation transaction unavailable.");
    await manager.execute("select pg_advisory_xact_lock(hashtext(?))", [`download:${id}`]);
    const entitlement = await this.retrieveDigitalEntitlement(id, {}, context);
    if (!entitlement.revoked_at) {
      await this.updateDigitalEntitlements({ id, revoked_at: new Date() }, context);
      await this.createDigitalDownloads({ entitlement_id: id, actor_id: actorId, order_id: entitlement.order_id, event: "revoked" }, context);
    }
  }
}
