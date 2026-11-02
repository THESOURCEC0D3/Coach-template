import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20261102072511 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "digital_entitlement" drop constraint if exists "digital_entitlement_line_item_id_unique";`);
    this.addSql(`alter table if exists "digital_asset" drop constraint if exists "digital_asset_variant_id_unique";`);
    this.addSql(`create table if not exists "digital_asset" ("id" text not null, "variant_id" text not null, "title" text not null, "format" text check ("format" in ('pdf', 'epub')) not null, "file_key" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "digital_asset_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_digital_asset_variant_id_unique" ON "digital_asset" ("variant_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_digital_asset_deleted_at" ON "digital_asset" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "digital_download" ("id" text not null, "entitlement_id" text not null, "actor_id" text not null, "order_id" text not null, "event" text check ("event" in ('granted', 'revoked')) not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "digital_download_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_digital_download_deleted_at" ON "digital_download" ("deleted_at") WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "digital_entitlement" ("id" text not null, "order_id" text not null, "line_item_id" text not null, "customer_id" text null, "title" text not null, "format" text check ("format" in ('pdf', 'epub')) not null, "file_key" text not null, "grant_count" integer not null default 0, "download_limit" integer not null default 5, "revoked_at" timestamptz null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "digital_entitlement_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_digital_entitlement_line_item_id_unique" ON "digital_entitlement" ("line_item_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_digital_entitlement_deleted_at" ON "digital_entitlement" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_digital_entitlement_customer_id_order_id" ON "digital_entitlement" ("customer_id", "order_id") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "digital_asset" cascade;`);

    this.addSql(`drop table if exists "digital_download" cascade;`);

    this.addSql(`drop table if exists "digital_entitlement" cascade;`);
  }

}
