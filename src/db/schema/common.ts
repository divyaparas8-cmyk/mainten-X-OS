import { pgTable, uuid, varchar, text, timestamp, boolean, jsonb, numeric, integer } from "drizzle-orm/pg-core";
import { tenants, plants } from "./tenants";
import { users } from "./users";

export const notifications = pgTable("notifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  plantId: uuid("plant_id").references(() => plants.id, { onDelete: "cascade" }),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  category: varchar("category", { length: 100 }).default("SYSTEM").notNull(), // "PRODUCTION", "QUALITY_CCP", "MAINTENANCE", "WAREHOUSE", "PLANNING"
  severity: varchar("severity", { length: 50 }).default("INFO").notNull(), // "INFO", "WARNING", "CRITICAL"
  isRead: boolean("is_read").default(false).notNull(),
  linkUrl: text("link_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const exceptions = pgTable("exceptions", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  plantId: uuid("plant_id").references(() => plants.id, { onDelete: "cascade" }).notNull(),
  exceptionCode: varchar("exception_code", { length: 100 }).notNull(), // "EX-2026-001"
  severity: varchar("severity", { length: 50 }).default("P1").notNull(), // "P1", "P2", "P3"
  module: varchar("module", { length: 100 }).notNull(), // "PRODUCTION", "QUALITY", "MAINTENANCE", "WAREHOUSE"
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  status: varchar("status", { length: 50 }).default("ACTIVE").notNull(), // "ACTIVE", "ACKNOWLEDGED", "RESOLVED"
  reportedAt: timestamp("reported_at").defaultNow().notNull(),
  resolvedAt: timestamp("resolved_at"),
});

export const documents = pgTable("documents", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  plantId: uuid("plant_id").references(() => plants.id, { onDelete: "cascade" }),
  docCode: varchar("doc_code", { length: 100 }).notNull(), // "SOP-BOT-004"
  title: varchar("title", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).default("SOP").notNull(),
  version: varchar("version", { length: 50 }).default("v1.0").notNull(),
  fileUrl: text("file_url"),
  status: varchar("status", { length: 50 }).default("APPROVED").notNull(),
  authorId: uuid("author_id").references(() => users.id, { onDelete: "set null" }),
  approvedBy: uuid("approved_by").references(() => users.id, { onDelete: "set null" }),
  effectiveDate: timestamp("effective_date").defaultNow().notNull(),
});

export const ciIdeas = pgTable("ci_ideas", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  plantId: uuid("plant_id").references(() => plants.id, { onDelete: "cascade" }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).default("OEE_IMPROVEMENT").notNull(),
  problemStatement: text("problem_statement").notNull(),
  proposedSolution: text("proposed_solution").notNull(),
  estimatedSavings: numeric("estimated_savings", { precision: 12, scale: 2 }).default("0.00"),
  status: varchar("status", { length: 50 }).default("PROPOSED").notNull(), // "PROPOSED", "IN_REVIEW", "IMPLEMENTED", "REJECTED"
  submittedBy: uuid("submitted_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const purchasingVendors = pgTable("purchasing_vendors", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  vendorCode: varchar("vendor_code", { length: 100 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  contactEmail: varchar("contact_email", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  rating: numeric("rating", { precision: 3, scale: 2 }).default("4.8"),
  leadTimeDays: integer("lead_time_days").default(5),
  status: varchar("status", { length: 50 }).default("ACTIVE").notNull(),
});
