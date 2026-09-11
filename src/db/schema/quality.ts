import { pgTable, uuid, varchar, text, timestamp, numeric, boolean, jsonb } from "drizzle-orm/pg-core";
import { tenants, plants } from "./tenants";
import { productionLines } from "./masterData";
import { batches, productionOrders } from "./production";
import { users } from "./users";

export const ccpChecks = pgTable("ccp_checks", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  plantId: uuid("plant_id").references(() => plants.id, { onDelete: "cascade" }).notNull(),
  lineId: uuid("line_id").references(() => productionLines.id, { onDelete: "cascade" }).notNull(),
  batchId: uuid("batch_id").references(() => batches.id, { onDelete: "cascade" }).notNull(),
  ccpCode: varchar("ccp_code", { length: 50 }).notNull(), // "CCP-1", "CCP-2"
  ccpName: varchar("ccp_name", { length: 255 }).notNull(), // "Pasteurizer Thermal Kill Step (≥83.1°C)"
  targetValue: numeric("target_value", { precision: 10, scale: 3 }).notNull(),
  actualValue: numeric("actual_value", { precision: 10, scale: 3 }).notNull(),
  criticalLimitMin: numeric("critical_limit_min", { precision: 10, scale: 3 }),
  criticalLimitMax: numeric("critical_limit_max", { precision: 10, scale: 3 }),
  uom: varchar("uom", { length: 50 }).notNull(), // "°C", "mm"
  status: varchar("status", { length: 50 }).notNull(), // "PASS", "FAIL", "CORRECTIVE_ACTION_TAKEN"
  operatorId: uuid("operator_id").references(() => users.id, { onDelete: "set null" }).notNull(),
  verifiedBy: uuid("verified_by").references(() => users.id, { onDelete: "set null" }),
  checkedAt: timestamp("checked_at").defaultNow().notNull(),
  notes: text("notes"),
});

export const qaReleases = pgTable("qa_releases", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  plantId: uuid("plant_id").references(() => plants.id, { onDelete: "cascade" }).notNull(),
  batchId: uuid("batch_id").references(() => batches.id, { onDelete: "cascade" }).notNull().unique(),
  disposition: varchar("disposition", { length: 50 }).notNull(), // "RELEASED", "REJECTED", "REWORK", "QUARANTINED"
  dispositionBy: uuid("disposition_by").references(() => users.id, { onDelete: "restrict" }).notNull(),
  digitalSignaturePinUsed: boolean("digital_signature_pin_used").default(true).notNull(),
  certificateOfAnalysisUrl: text("certificate_of_analysis_url"),
  coaMetadata: jsonb("coa_metadata").default({}),
  comments: text("comments"),
  releasedAt: timestamp("released_at").defaultNow().notNull(),
});

export const qualityHolds = pgTable("quality_holds", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  plantId: uuid("plant_id").references(() => plants.id, { onDelete: "cascade" }).notNull(),
  lotNumber: varchar("lot_number", { length: 100 }).notNull(),
  batchId: uuid("batch_id").references(() => batches.id, { onDelete: "set null" }),
  reason: varchar("reason", { length: 255 }).notNull(),
  severity: varchar("severity", { length: 50 }).default("HIGH"),
  status: varchar("status", { length: 50 }).default("ACTIVE_HOLD").notNull(), // "ACTIVE_HOLD", "RELEASED", "DESTROYED"
  holdBy: uuid("hold_by").references(() => users.id, { onDelete: "set null" }).notNull(),
  holdAt: timestamp("hold_at").defaultNow().notNull(),
  releasedAt: timestamp("released_at"),
});

export const deviations = pgTable("deviations", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  plantId: uuid("plant_id").references(() => plants.id, { onDelete: "cascade" }).notNull(),
  deviationNumber: varchar("deviation_number", { length: 100 }).notNull(), // "DEV-2026-004"
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 100 }).default("PROCESS_DEVIATION"),
  severity: varchar("severity", { length: 50 }).default("MAJOR"),
  status: varchar("status", { length: 50 }).default("UNDER_INVESTIGATION"), // "UNDER_INVESTIGATION", "CAPA_INITIATED", "CLOSED"
  reportedBy: uuid("reported_by").references(() => users.id, { onDelete: "set null" }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const capaRecords = pgTable("capa_records", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  plantId: uuid("plant_id").references(() => plants.id, { onDelete: "cascade" }).notNull(),
  capaNumber: varchar("capa_number", { length: 100 }).notNull(), // "CAPA-2026-012"
  title: varchar("title", { length: 255 }).notNull(),
  rootCauseMethod: varchar("root_cause_method", { length: 100 }).default("5_WHY"), // "5_WHY", "FISHBONE", "FMEA"
  rootCauseAnalysis: jsonb("root_cause_analysis").default({}),
  correctiveAction: text("corrective_action").notNull(),
  preventiveAction: text("preventive_action").notNull(),
  targetCompletionDate: timestamp("target_completion_date").notNull(),
  status: varchar("status", { length: 50 }).default("IN_PROGRESS"), // "IN_PROGRESS", "EFFECTIVENESS_CHECK", "CLOSED"
  assignedTo: uuid("assigned_to").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
