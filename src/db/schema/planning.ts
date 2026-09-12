import { pgTable, uuid, varchar, text, timestamp, numeric, integer, jsonb, boolean } from "drizzle-orm/pg-core";
import { tenants, plants } from "./tenants";
import { skus, productionLines, shifts } from "./masterData";

export const customerOrders = pgTable("customer_orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  plantId: uuid("plant_id").references(() => plants.id, { onDelete: "cascade" }).notNull(),
  orderNumber: varchar("order_number", { length: 100 }).notNull(), // "PO-KR-99321"
  customerName: varchar("customer_name", { length: 255 }).notNull(), // "Kroger Supermarkets"
  skuId: uuid("sku_id").references(() => skus.id, { onDelete: "restrict" }).notNull(),
  quantity: numeric("quantity", { precision: 12, scale: 2 }).notNull(),
  priority: varchar("priority", { length: 50 }).default("NORMAL"), // "URGENT", "NORMAL", "LOW"
  requestedDate: timestamp("requested_date").notNull(),
  scheduledDate: timestamp("scheduled_date"),
  status: varchar("status", { length: 50 }).default("CONFIRMED").notNull(), // "CONFIRMED", "SCHEDULED", "IN_PRODUCTION", "FULFILLED", "CANCELLED"
  deliveryAddress: text("delivery_address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const forecasts = pgTable("forecasts", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  plantId: uuid("plant_id").references(() => plants.id, { onDelete: "cascade" }).notNull(),
  skuId: uuid("sku_id").references(() => skus.id, { onDelete: "cascade" }).notNull(),
  period: varchar("period", { length: 50 }).notNull(), // "2026-W36" or "2026-09"
  baselineDemand: numeric("baseline_demand", { precision: 12, scale: 2 }).notNull(),
  promoUplift: numeric("promo_uplift", { precision: 12, scale: 2 }).default("0.00"),
  overrideQuantity: numeric("override_quantity", { precision: 12, scale: 2 }),
  finalForecast: numeric("final_forecast", { precision: 12, scale: 2 }).notNull(),
  mapeAccuracy: numeric("mape_accuracy", { precision: 5, scale: 2 }).default("94.60"),
  modelType: varchar("model_type", { length: 100 }).default("EXPONENTIAL_SMOOTHING"),
  owner: varchar("owner", { length: 255 }).default("Elena Rostova"),
  reason: text("reason"),
  status: varchar("status", { length: 50 }).default("Submitted"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const apsSchedules = pgTable("aps_schedules", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  plantId: uuid("plant_id").references(() => plants.id, { onDelete: "cascade" }).notNull(),
  lineId: uuid("line_id").references(() => productionLines.id, { onDelete: "cascade" }).notNull(),
  shiftId: uuid("shift_id").references(() => shifts.id, { onDelete: "set null" }),
  orderId: uuid("order_id").references(() => customerOrders.id, { onDelete: "set null" }),
  skuId: uuid("sku_id").references(() => skus.id, { onDelete: "restrict" }).notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  quantity: numeric("quantity", { precision: 12, scale: 2 }).notNull(),
  changeoverMinutes: integer("changeover_minutes").default(30),
  cipRequired: boolean("cip_required").default(false),
  status: varchar("status", { length: 50 }).default("DRAFT").notNull(), // "DRAFT", "PUBLISHED", "LOCKED", "COMPLETED"
  sequenceNumber: integer("sequence_number").default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const mrpRequirements = pgTable("mrp_requirements", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  plantId: uuid("plant_id").references(() => plants.id, { onDelete: "cascade" }).notNull(),
  skuId: uuid("sku_id").references(() => skus.id, { onDelete: "cascade" }).notNull(),
  materialName: varchar("material_name", { length: 255 }),
  skuCode: varchar("sku_code", { length: 100 }),
  category: varchar("category", { length: 100 }),
  uom: varchar("uom", { length: 50 }),
  grossRequirement: numeric("gross_requirement", { precision: 14, scale: 4 }).notNull(),
  safetyStock: numeric("safety_stock", { precision: 14, scale: 4 }).default("1000.00"),
  availableStock: numeric("available_stock", { precision: 14, scale: 4 }).notNull(),
  reservedStock: numeric("reserved_stock", { precision: 14, scale: 4 }).default("0.00"),
  scheduledReceipts: numeric("scheduled_receipts", { precision: 14, scale: 4 }).default("0.00"),
  netShortage: numeric("net_shortage", { precision: 14, scale: 4 }).notNull(),
  requiredDate: timestamp("required_date").notNull(),
  status: varchar("status", { length: 50 }).default("SHORTAGE_ALERT"), // "CRITICAL", "SHORTAGE_ALERT", "COVERED"
  suggestedAction: varchar("suggested_action", { length: 255 }),
  calculatedAt: timestamp("calculated_at").defaultNow().notNull(),
});

export const purchaseRequisitions = pgTable("purchase_requisitions", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  plantId: uuid("plant_id").references(() => plants.id, { onDelete: "cascade" }).notNull(),
  reqNumber: varchar("req_number", { length: 100 }).notNull(), // "PR-2026-0881"
  skuId: uuid("sku_id").references(() => skus.id, { onDelete: "restrict" }).notNull(),
  quantity: numeric("quantity", { precision: 14, scale: 4 }).notNull(),
  uom: varchar("uom", { length: 50 }).notNull(),
  vendorName: varchar("vendor_name", { length: 255 }),
  estimatedCost: numeric("estimated_cost", { precision: 12, scale: 2 }),
  urgency: varchar("urgency", { length: 50 }).default("HIGH"),
  status: varchar("status", { length: 50 }).default("PENDING_APPROVAL"), // "PENDING_APPROVAL", "PO_CREATED", "REJECTED"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const promotionCampaigns = pgTable("promotion_campaigns", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  plantId: uuid("plant_id").references(() => plants.id, { onDelete: "cascade" }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  skuId: uuid("sku_id").references(() => skus.id, { onDelete: "restrict" }).notNull(),
  upliftPercent: numeric("uplift_percent", { precision: 5, scale: 2 }).notNull(),
  incrementalUnits: numeric("incremental_units", { precision: 14, scale: 2 }).default("0.00"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  channel: varchar("channel", { length: 100 }).default("Wholesale Club Flyer"),
  status: varchar("status", { length: 50 }).default("SCHEDULED").notNull(), // "ACTIVE", "SCHEDULED", "EXPIRED", "CANCELLED"
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const lineTargets = pgTable("line_targets", {
  id: uuid("id").defaultRandom().primaryKey(),
  targetId: varchar("target_id", { length: 50 }),
  plantId: varchar("plant_id", { length: 50 }).default("PLT-01"),
  lineId: varchar("line_id", { length: 50 }).notNull(),
  lineName: varchar("line_name", { length: 255 }),
  skuId: varchar("sku_id", { length: 50 }),
  skuCode: varchar("sku_code", { length: 50 }),
  skuName: varchar("sku_name", { length: 255 }),
  shift: varchar("shift", { length: 100 }).default("Morning Shift (A)"),
  targetQuantity: integer("target_quantity").default(0),
  targetOeePct: numeric("target_oee_pct", { precision: 5, scale: 2 }).default("85.00"),
  targetSpeedBpm: integer("target_speed_bpm").default(250),
  effectiveDate: timestamp("effective_date").defaultNow(),
  status: varchar("status", { length: 50 }).default("Active"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

