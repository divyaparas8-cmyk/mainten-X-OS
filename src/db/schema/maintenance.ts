import { pgTable, uuid, varchar, text, timestamp, numeric, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { tenants, plants } from "./tenants";
import { assets, productionLines } from "./masterData";
import { users } from "./users";

export const failureCodes = pgTable("failure_codes", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  code: varchar("code", { length: 50 }).notNull(), // "E-01", "M-04"
  symptom: varchar("symptom", { length: 255 }).notNull(), // "Motor Overheating / High Vibration"
  category: varchar("category", { length: 100 }).default("MECHANICAL").notNull(),
  standardResolution: text("standard_resolution"),
  successCount: integer("success_count").default(1),
});

export const workOrders = pgTable("work_orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  plantId: uuid("plant_id").references(() => plants.id, { onDelete: "cascade" }).notNull(),
  woNumber: varchar("wo_number", { length: 100 }).notNull().unique(), // "WO-2026-0891"
  assetId: uuid("asset_id").references(() => assets.id, { onDelete: "cascade" }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  type: varchar("type", { length: 50 }).default("CORRECTIVE").notNull(), // "CORRECTIVE", "PREVENTIVE", "EMERGENCY_BREAKDOWN", "CALIBRATION"
  priority: varchar("priority", { length: 50 }).default("HIGH").notNull(), // "P1_CRITICAL", "HIGH", "MEDIUM", "LOW"
  status: varchar("status", { length: 50 }).default("OPEN").notNull(), // "OPEN", "ASSIGNED", "IN_PROGRESS", "WAITING_FOR_PARTS", "COMPLETED", "CLOSED"
  assignedTo: uuid("assigned_to").references(() => users.id, { onDelete: "set null" }),
  reportedBy: uuid("reported_by").references(() => users.id, { onDelete: "set null" }),
  failureCodeId: uuid("failure_code_id").references(() => failureCodes.id, { onDelete: "set null" }),
  estimatedHours: numeric("estimated_hours", { precision: 6, scale: 2 }).default("2.0"),
  actualHours: numeric("actual_hours", { precision: 6, scale: 2 }).default("0.0"),
  scheduledDate: timestamp("scheduled_date"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const pmSchedules = pgTable("pm_schedules", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  plantId: uuid("plant_id").references(() => plants.id, { onDelete: "cascade" }).notNull(),
  assetId: uuid("asset_id").references(() => assets.id, { onDelete: "cascade" }).notNull(),
  scheduleCode: varchar("schedule_code", { length: 100 }).notNull(), // "PM-FM001-MONTHLY"
  title: varchar("title", { length: 255 }).notNull(),
  frequency: varchar("frequency", { length: 50 }).default("MONTHLY").notNull(), // "DAILY", "WEEKLY", "MONTHLY", "QUARTERLY", "ANNUAL"
  intervalDays: integer("interval_days").default(30).notNull(),
  lastPerformedDate: timestamp("last_performed_date"),
  nextDueDate: timestamp("next_due_date").notNull(),
  status: varchar("status", { length: 50 }).default("SCHEDULED").notNull(), // "SCHEDULED", "OVERDUE", "COMPLETED"
  checklistTemplate: jsonb("checklist_template").default([]),
  isActive: boolean("is_active").default(true).notNull(),
});

export const spareParts = pgTable("spare_parts", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  plantId: uuid("plant_id").references(() => plants.id, { onDelete: "cascade" }).notNull(),
  partNumber: varchar("part_number", { length: 100 }).notNull().unique(), // "SP-BRG-6205"
  name: varchar("name", { length: 255 }).notNull(), // "Deep Groove Ball Bearing 6205-2RS"
  category: varchar("category", { length: 100 }).default("MECHANICAL").notNull(),
  currentStock: integer("current_stock").default(0).notNull(),
  minStockLevel: integer("min_stock_level").default(5).notNull(),
  unitCost: numeric("unit_cost", { precision: 10, scale: 2 }).default("450.00"),
  binLocation: varchar("bin_location", { length: 50 }).default("M-BIN-04"),
  supplierName: varchar("supplier_name", { length: 255 }),
});

export const spareConsumption = pgTable("spare_consumption", {
  id: uuid("id").defaultRandom().primaryKey(),
  workOrderId: uuid("work_order_id").references(() => workOrders.id, { onDelete: "cascade" }).notNull(),
  sparePartId: uuid("spare_part_id").references(() => spareParts.id, { onDelete: "restrict" }).notNull(),
  quantityUsed: integer("quantity_used").default(1).notNull(),
  unitCost: numeric("unit_cost", { precision: 10, scale: 2 }).notNull(),
  consumedAt: timestamp("consumed_at").defaultNow().notNull(),
});

export const calibrations = pgTable("calibrations", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  plantId: uuid("plant_id").references(() => plants.id, { onDelete: "cascade" }).notNull(),
  assetId: uuid("asset_id").references(() => assets.id, { onDelete: "cascade" }).notNull(),
  instrumentName: varchar("instrument_name", { length: 255 }).notNull(), // "Pasteurizer RTD PT-100 Temperature Transmitter"
  certificateNumber: varchar("certificate_number", { length: 100 }),
  calibrationDate: timestamp("calibration_date").notNull(),
  nextDueDate: timestamp("next_due_date").notNull(),
  accuracyError: numeric("accuracy_error", { precision: 6, scale: 3 }).default("0.02"),
  status: varchar("status", { length: 50 }).default("VALID").notNull(), // "VALID", "DUE_SOON", "EXPIRED"
});
