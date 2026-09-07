import { pgTable, uuid, varchar, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { tenants, plants } from "./tenants";
import { users } from "./users";

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  plantId: uuid("plant_id").references(() => plants.id, { onDelete: "set null" }),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  action: varchar("action", { length: 100 }).notNull(), // CREATE, UPDATE, DELETE, APPROVE, QA_RELEASE, REVISE
  entityType: varchar("entity_type", { length: 100 }).notNull(), // ProductionOrder, Batch, CCPCheck, WorkOrder
  entityId: varchar("entity_id", { length: 255 }).notNull(),
  oldValues: jsonb("old_values"),
  newValues: jsonb("new_values"),
  ipAddress: varchar("ip_address", { length: 50 }),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const digitalSignatures = pgTable("digital_signatures", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  plantId: uuid("plant_id").references(() => plants.id, { onDelete: "set null" }),
  userId: uuid("user_id").references(() => users.id, { onDelete: "restrict" }).notNull(),
  entityType: varchar("entity_type", { length: 100 }).notNull(),
  entityId: varchar("entity_id", { length: 255 }).notNull(),
  meaning: varchar("meaning", { length: 255 }).notNull(), // "Author of Batch Record", "QA Release Disposition"
  comments: text("comments"),
  signedAt: timestamp("signed_at").defaultNow().notNull(),
});
