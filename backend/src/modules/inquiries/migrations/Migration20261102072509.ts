import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20261102072509 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "inquiry" drop constraint if exists "inquiry_tracking_token_hash_unique";`);
    this.addSql(`alter table if exists "inquiry" drop constraint if exists "inquiry_request_id_unique";`);
    this.addSql(`create table if not exists "inquiry" ("id" text not null, "request_id" text not null, "input_digest" text not null, "full_name" text not null, "email" text not null, "email_hash" text not null, "phone" text not null, "organization" text null, "service" text not null, "preferred_date" text null, "delivery_format" text check ("delivery_format" in ('online', 'in-person', 'hybrid', 'discuss')) not null, "message" text not null, "consent" boolean not null, "status" text check ("status" in ('received', 'reviewing', 'needs-information', 'proposed', 'confirmed', 'declined', 'closed')) not null default 'received', "tracking_token_hash" text not null, "confirmed_date" text null, "calendar_verified_at" timestamptz null, "calendar_reference" text null, "status_history" jsonb not null, "notification_status" text check ("notification_status" in ('pending', 'sending', 'sent', 'failed', 'unconfigured')) not null default 'pending', "notification_attempts" integer not null default 0, "notification_started_at" timestamptz null, "last_notified_at" timestamptz null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "inquiry_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_inquiry_request_id_unique" ON "inquiry" ("request_id") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_inquiry_tracking_token_hash_unique" ON "inquiry" ("tracking_token_hash") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_inquiry_deleted_at" ON "inquiry" ("deleted_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_inquiry_email_hash_created_at" ON "inquiry" ("email_hash", "created_at") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_inquiry_status_created_at" ON "inquiry" ("status", "created_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "inquiry" cascade;`);
  }

}
