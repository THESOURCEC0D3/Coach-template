import { model } from "@medusajs/framework/utils";

export const DigitalEntitlement = model.define("digital_entitlement", {
  id: model.id({ prefix: "dent" }).primaryKey(),
  order_id: model.text(),
  line_item_id: model.text().unique(),
  customer_id: model.text().nullable(),
  title: model.text(),
  format: model.enum(["pdf", "epub"]),
  file_key: model.text(),
  grant_count: model.number().default(0),
  download_limit: model.number().default(5),
  revoked_at: model.dateTime().nullable(),
}).indexes([{ on: ["customer_id", "order_id"] }]);

export const DigitalDownload = model.define("digital_download", {
  id: model.id({ prefix: "dlog" }).primaryKey(),
  entitlement_id: model.text(),
  actor_id: model.text(),
  order_id: model.text(),
  event: model.enum(["granted", "revoked"]),
});
