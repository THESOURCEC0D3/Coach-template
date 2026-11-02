import { model } from "@medusajs/framework/utils";

export const DigitalAsset = model.define("digital_asset", {
  id: model.id({ prefix: "dasset" }).primaryKey(),
  variant_id: model.text().unique(),
  title: model.text(),
  format: model.enum(["pdf", "epub"]),
  file_key: model.text(),
});
