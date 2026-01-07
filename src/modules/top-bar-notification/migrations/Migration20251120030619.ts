import { Migration } from '@mikro-orm/migrations';

export class Migration20251120030619 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "top_bar_notification" ("id" text not null, "enabled" boolean not null, "name" text not null, "priority" integer not null, "content" text not null, "textPosition" text check ("textPosition" in ('left', 'center', 'right')) not null default 'left', "backgroundColor" text not null, "textColor" text not null, "textSize" integer not null, "paddingSize" integer not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "top_bar_notification_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_top_bar_notification_deleted_at" ON "top_bar_notification" (deleted_at) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "top_bar_notification" cascade;`);
  }

}
