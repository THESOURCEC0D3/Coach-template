import { writeFileSync } from "node:fs";
import type { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { createApiKeysWorkflow, createRegionsWorkflow, createSalesChannelsWorkflow, linkSalesChannelsToApiKeyWorkflow, updateStoresWorkflow, createShippingProfilesWorkflow, createProductsWorkflow } from "@medusajs/medusa/core-flows";

/** Idempotent client-approved catalogue setup. No invented stock, ISBN or dates. */
export default async function seed({ container }: ExecArgs) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const storeService = container.resolve(Modules.STORE);
  const [store] = await storeService.listStores();
  if (!store) throw new Error("Medusa store is not initialized. Run migrations first.");
  const { data: channels } = await query.graph({ entity: "sales_channel", fields: ["id", "name"], filters: { name: "Trophy Bookstore" } });
  const channel = channels[0] || (await createSalesChannelsWorkflow(container).run({ input: { salesChannelsData: [{ name: "Trophy Bookstore", description: "Trophy Kiprono publications" }] } })).result[0];
  await updateStoresWorkflow(container).run({ input: { selector: { id: store.id }, update: { name: "Trophy Kiprono", default_sales_channel_id: channel.id, supported_currencies: [{ currency_code: "kes", is_default: true }] } } });
  const { data: regions } = await query.graph({ entity: "region", fields: ["id", "currency_code"], filters: { currency_code: "kes" } });
  const region = regions[0] || (await createRegionsWorkflow(container).run({ input: { regions: [{ name: "Kenya", currency_code: "kes", countries: ["ke"], payment_providers: ["pp_system_default"] }] } })).result[0];
  const { data: keys } = await query.graph({ entity: "api_key", fields: ["id", "token", "title"], filters: { title: "Trophy Storefront", type: "publishable" } });
  const key = keys[0] || (await createApiKeysWorkflow(container).run({ input: { api_keys: [{ title: "Trophy Storefront", type: "publishable", created_by: "trophy-bootstrap" }] } })).result[0];
  await linkSalesChannelsToApiKeyWorkflow(container).run({ input: { id: key.id, add: [channel.id] } });
  const { data: profiles } = await query.graph({ entity: "shipping_profile", fields: ["id", "name", "type"], filters: { type: "default" } });
  const profile = profiles[0] || (await createShippingProfilesWorkflow(container).run({ input: { data: [{ name: "Physical books", type: "default" }] } })).result[0];
  const { data: products } = await query.graph({ entity: "product", fields: ["id", "handle"], filters: { handle: "mastering-office-politics" } });
  if (!products.length) {
    const storefront = (process.env.STOREFRONT_URL || "http://localhost:3000").replace(/\/$/, "");
    await createProductsWorkflow(container).run({ input: { products: [{
      title: "Mastering Office Politics",
      subtitle: "And How to Play It Like a Pro",
      handle: "mastering-office-politics",
      description: "Mastering Office Politics — And How to Play It Like a Pro. By Trophy Kiprono.",
      status: "published",
      thumbnail: `${storefront}/images/mastering-office-politics.webp`,
      images: [{ url: `${storefront}/images/mastering-office-politics.webp` }],
      shipping_profile_id: profile.id,
      sales_channels: [{ id: channel.id }],
      metadata: { author: "Trophy Kiprono", subtitle: "And How to Play It Like a Pro", availability_note: "Contact Trophy to confirm stock and delivery before purchase." },
      options: [{ title: "Edition", values: ["Print"] }],
      variants: [{ title: "Print edition", sku: "TK-OFFICE-POLITICS-PRINT", manage_inventory: false, options: { Edition: "Print" }, metadata: { format: "physical" }, prices: [{ amount: 2550, currency_code: "kes" }] }],
    }] } });
    logger.info("Created the client-approved print title at KES 2,550. Stock quantity and delivery rates remain unconfigured.");
  }
  writeFileSync(".local-storefront.json", JSON.stringify({ publishable_key: key.token, region_id: region.id }), { mode: 0o600 });
  logger.info("Storefront key saved locally for the website configuration. No payment gateway or delivery rate was invented.");
}
