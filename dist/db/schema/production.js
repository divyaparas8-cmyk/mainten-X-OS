"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shiftLogs = exports.downtimeLogs = exports.batchSteps = exports.batches = exports.productionOrders = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const tenants_1 = require("./tenants");
const masterData_1 = require("./masterData");
const users_1 = require("./users");
exports.productionOrders = (0, pg_core_1.pgTable)("production_orders", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_1.tenants.id, { onDelete: "cascade" }).notNull(),
    plantId: (0, pg_core_1.uuid)("plant_id").references(() => tenants_1.plants.id, { onDelete: "cascade" }).notNull(),
    orderNumber: (0, pg_core_1.varchar)("order_number", { length: 100 }).notNull(), // "PO-2026-001"
    skuId: (0, pg_core_1.uuid)("sku_id").references(() => masterData_1.skus.id, { onDelete: "restrict" }).notNull(),
    lineId: (0, pg_core_1.uuid)("line_id").references(() => masterData_1.productionLines.id, { onDelete: "restrict" }).notNull(),
    targetQuantity: (0, pg_core_1.numeric)("target_quantity", { precision: 12, scale: 2 }).notNull(),
    producedQuantity: (0, pg_core_1.numeric)("produced_quantity", { precision: 12, scale: 2 }).default("0.00").notNull(),
    scrapQuantity: (0, pg_core_1.numeric)("scrap_quantity", { precision: 12, scale: 2 }).default("0.00").notNull(),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).default("PLANNED").notNull(), // PLANNED -> SCHEDULED -> RELEASED -> RUNNING -> COMPLETED -> QA_PENDING -> RELEASED_TO_WAREHOUSE
    priority: (0, pg_core_1.varchar)("priority", { length: 50 }).default("NORMAL"),
    plannedStart: (0, pg_core_1.timestamp)("planned_start").notNull(),
    plannedEnd: (0, pg_core_1.timestamp)("planned_end").notNull(),
    actualStart: (0, pg_core_1.timestamp)("actual_start"),
    actualEnd: (0, pg_core_1.timestamp)("actual_end"),
    notes: (0, pg_core_1.text)("notes"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
});
exports.batches = (0, pg_core_1.pgTable)("batches", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_1.tenants.id, { onDelete: "cascade" }).notNull(),
    plantId: (0, pg_core_1.uuid)("plant_id").references(() => tenants_1.plants.id, { onDelete: "cascade" }).notNull(),
    productionOrderId: (0, pg_core_1.uuid)("production_order_id").references(() => exports.productionOrders.id, { onDelete: "cascade" }).notNull(),
    batchNumber: (0, pg_core_1.varchar)("batch_number", { length: 100 }).notNull().unique(), // "BAT-2026-0885"
    skuId: (0, pg_core_1.uuid)("sku_id").references(() => masterData_1.skus.id, { onDelete: "restrict" }).notNull(),
    recipeVersion: (0, pg_core_1.varchar)("recipe_version", { length: 50 }).default("v1.0").notNull(),
    tankNumber: (0, pg_core_1.varchar)("tank_number", { length: 50 }).default("T-01"),
    targetVolume: (0, pg_core_1.numeric)("target_volume", { precision: 12, scale: 2 }).notNull(),
    actualVolume: (0, pg_core_1.numeric)("actual_volume", { precision: 12, scale: 2 }).default("0.00"),
    uom: (0, pg_core_1.varchar)("uom", { length: 50 }).default("Liters").notNull(),
    currentStep: (0, pg_core_1.integer)("current_step").default(1).notNull(), // 1 to 6
    progressPercent: (0, pg_core_1.integer)("progress_percent").default(0).notNull(),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).default("Draft").notNull(), // "Draft", "In Process", "Mixing", "Packaging", "Completed", "QA Pending", "Released"
    startedAt: (0, pg_core_1.timestamp)("started_at"),
    completedAt: (0, pg_core_1.timestamp)("completed_at"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
});
exports.batchSteps = (0, pg_core_1.pgTable)("batch_steps", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    batchId: (0, pg_core_1.uuid)("batch_id").references(() => exports.batches.id, { onDelete: "cascade" }).notNull(),
    stepNumber: (0, pg_core_1.integer)("step_number").notNull(), // 1=Scan, 2=Weigh, 3=Mix, 4=CCP, 5=Package, 6=Complete
    stepName: (0, pg_core_1.varchar)("step_name", { length: 255 }).notNull(),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).default("PENDING").notNull(), // "PENDING", "IN_PROGRESS", "COMPLETED", "VERIFIED"
    operatorId: (0, pg_core_1.uuid)("operator_id").references(() => users_1.users.id, { onDelete: "set null" }),
    verifiedBy: (0, pg_core_1.uuid)("verified_by").references(() => users_1.users.id, { onDelete: "set null" }),
    parameters: (0, pg_core_1.jsonb)("parameters").default({}), // Recorded weights, sensor temps, scanned barcodes
    startedAt: (0, pg_core_1.timestamp)("started_at"),
    completedAt: (0, pg_core_1.timestamp)("completed_at"),
    notes: (0, pg_core_1.text)("notes"),
});
exports.downtimeLogs = (0, pg_core_1.pgTable)("downtime_logs", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_1.tenants.id, { onDelete: "cascade" }).notNull(),
    plantId: (0, pg_core_1.uuid)("plant_id").references(() => tenants_1.plants.id, { onDelete: "cascade" }).notNull(),
    lineId: (0, pg_core_1.uuid)("line_id").references(() => masterData_1.productionLines.id, { onDelete: "cascade" }).notNull(),
    assetId: (0, pg_core_1.uuid)("asset_id").references(() => masterData_1.assets.id, { onDelete: "set null" }),
    orderId: (0, pg_core_1.uuid)("order_id").references(() => exports.productionOrders.id, { onDelete: "set null" }),
    reasonCode: (0, pg_core_1.varchar)("reason_code", { length: 100 }).notNull(), // "MICRO_JAM", "CHANGEOVER", "NO_MATERIAL", "CIP_CLEANING"
    category: (0, pg_core_1.varchar)("category", { length: 100 }).default("UNPLANNED_STOPPAGE").notNull(),
    startTime: (0, pg_core_1.timestamp)("start_time").notNull(),
    endTime: (0, pg_core_1.timestamp)("end_time"),
    durationMinutes: (0, pg_core_1.integer)("duration_minutes").default(0).notNull(),
    comments: (0, pg_core_1.text)("comments"),
    loggedBy: (0, pg_core_1.uuid)("logged_by").references(() => users_1.users.id, { onDelete: "set null" }),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.shiftLogs = (0, pg_core_1.pgTable)("shift_logs", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_1.tenants.id, { onDelete: "cascade" }).notNull(),
    plantId: (0, pg_core_1.uuid)("plant_id").references(() => tenants_1.plants.id, { onDelete: "cascade" }).notNull(),
    lineId: (0, pg_core_1.uuid)("line_id").references(() => masterData_1.productionLines.id, { onDelete: "cascade" }).notNull(),
    orderId: (0, pg_core_1.uuid)("order_id").references(() => exports.productionOrders.id, { onDelete: "cascade" }).notNull(),
    shiftCode: (0, pg_core_1.varchar)("shift_code", { length: 50 }).notNull(),
    operatorId: (0, pg_core_1.uuid)("operator_id").references(() => users_1.users.id, { onDelete: "set null" }).notNull(),
    hourWindow: (0, pg_core_1.varchar)("hour_window", { length: 50 }).notNull(), // "06:00 - 07:00"
    goodUnitsProduced: (0, pg_core_1.integer)("good_units_produced").default(0).notNull(),
    scrapUnitsProduced: (0, pg_core_1.integer)("scrap_units_produced").default(0).notNull(),
    loggedAt: (0, pg_core_1.timestamp)("logged_at").defaultNow().notNull(),
});
//# sourceMappingURL=production.js.map