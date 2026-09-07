import { pgTable, uuid, varchar, text, timestamp, numeric, integer, jsonb, boolean } from "drizzle-orm/pg-core";
import { tenants, plants } from "./tenants";
import { skus, productionLines, assets, staff } from "./masterData";
import { users } from "./users";

export const productionOrders = pgTable("production_orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  plantId: uuid("plant_id").references(() => plants.id, { onDelete: "cascade" }).notNull(),
  orderNumber: varchar("order_number", { length: 100 }).notNull(), // "PO-2026-001"
  skuId: uuid("sku_id").references(() => skus.id, { onDelete: "restrict" }).notNull(),
  lineId: uuid("line_id").references(() => productionLines.id, { onDelete: "restrict" }).notNull(),
  targetQuantity: numeric("target_quantity", { precision: 12, scale: 2 }).notNull(),
  producedQuantity: numeric("produced_quantity", { precision: 12, scale: 2 }).default("0.00").notNull(),
  scrapQuantity: numeric("scrap_quantity", { precision: 12, scale: 2 }).default("0.00").notNull(),
  status: varchar("status", { length: 50 }).default("PLANNED").notNull(), // PLANNED -> SCHEDULED -> RELEASED -> RUNNING -> COMPLETED -> QA_PENDING -> RELEASED_TO_WAREHOUSE
  priority: varchar("priority", { length: 50 }).default("NORMAL"),
  plannedStart: timestamp("planned_start").notNull(),
  plannedEnd: timestamp("planned_end").notNull(),
  actualStart: timestamp("actual_start"),
  actualEnd: timestamp("actual_end"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const batches = pgTable("batches", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  plantId: uuid("plant_id").references(() => plants.id, { onDelete: "cascade" }).notNull(),
  productionOrderId: uuid("production_order_id").references(() => productionOrders.id, { onDelete: "cascade" }).notNull(),
  batchNumber: varchar("batch_number", { length: 100 }).notNull().unique(), // "BAT-2026-0885"
  skuId: uuid("sku_id").references(() => skus.id, { onDelete: "restrict" }).notNull(),
  recipeVersion: varchar("recipe_version", { length: 50 }).default("v1.0").notNull(),
  tankNumber: varchar("tank_number", { length: 50 }).default("T-01"),
  targetVolume: numeric("target_volume", { precision: 12, scale: 2 }).notNull(),
  actualVolume: numeric("actual_volume", { precision: 12, scale: 2 }).default("0.00"),
  uom: varchar("uom", { length: 50 }).default("Liters").notNull(),
  currentStep: integer("current_step").default(1).notNull(), // 1 to 6
  progressPercent: integer("progress_percent").default(0).notNull(),
  status: varchar("status", { length: 50 }).default("Draft").notNull(), // "Draft", "In Process", "Mixing", "Packaging", "Completed", "QA Pending", "Released"
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const batchSteps = pgTable("batch_steps", {
  id: uuid("id").defaultRandom().primaryKey(),
  batchId: uuid("batch_id").references(() => batches.id, { onDelete: "cascade" }).notNull(),
  stepNumber: integer("step_number").notNull(), // 1=Scan, 2=Weigh, 3=Mix, 4=CCP, 5=Package, 6=Complete
  stepName: varchar("step_name", { length: 255 }).notNull(),
  status: varchar("status", { length: 50 }).default("PENDING").notNull(), // "PENDING", "IN_PROGRESS", "COMPLETED", "VERIFIED"
  operatorId: uuid("operator_id").references(() => users.id, { onDelete: "set null" }),
  verifiedBy: uuid("verified_by").references(() => users.id, { onDelete: "set null" }),
  parameters: jsonb("parameters").default({}), // Recorded weights, sensor temps, scanned barcodes
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  notes: text("notes"),
});

export const downtimeLogs = pgTable("downtime_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  plantId: uuid("plant_id").references(() => plants.id, { onDelete: "cascade" }).notNull(),
  lineId: uuid("line_id").references(() => productionLines.id, { onDelete: "cascade" }).notNull(),
  assetId: uuid("asset_id").references(() => assets.id, { onDelete: "set null" }),
  orderId: uuid("order_id").references(() => productionOrders.id, { onDelete: "set null" }),
  reasonCode: varchar("reason_code", { length: 100 }).notNull(), // "MICRO_JAM", "CHANGEOVER", "NO_MATERIAL", "CIP_CLEANING"
  category: varchar("category", { length: 100 }).default("UNPLANNED_STOPPAGE").notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  durationMinutes: integer("duration_minutes").default(0).notNull(),
  comments: text("comments"),
  loggedBy: uuid("logged_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const shiftLogs = pgTable("shift_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  plantId: uuid("plant_id").references(() => plants.id, { onDelete: "cascade" }).notNull(),
  lineId: uuid("line_id").references(() => productionLines.id, { onDelete: "cascade" }).notNull(),
  orderId: uuid("order_id").references(() => productionOrders.id, { onDelete: "cascade" }).notNull(),
  shiftCode: varchar("shift_code", { length: 50 }).notNull(),
  operatorId: uuid("operator_id").references(() => users.id, { onDelete: "set null" }).notNull(),
  hourWindow: varchar("hour_window", { length: 50 }).notNull(), // "06:00 - 07:00"
  goodUnitsProduced: integer("good_units_produced").default(0).notNull(),
  scrapUnitsProduced: integer("scrap_units_produced").default(0).notNull(),
  loggedAt: timestamp("logged_at").defaultNow().notNull(),
});
