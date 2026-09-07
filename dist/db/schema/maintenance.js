"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calibrations = exports.spareConsumption = exports.spareParts = exports.pmSchedules = exports.workOrders = exports.failureCodes = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const tenants_js_1 = require("./tenants.js");
const masterData_js_1 = require("./masterData.js");
const users_js_1 = require("./users.js");
exports.failureCodes = (0, pg_core_1.pgTable)("failure_codes", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_js_1.tenants.id, { onDelete: "cascade" }).notNull(),
    code: (0, pg_core_1.varchar)("code", { length: 50 }).notNull(), // "E-01", "M-04"
    symptom: (0, pg_core_1.varchar)("symptom", { length: 255 }).notNull(), // "Motor Overheating / High Vibration"
    category: (0, pg_core_1.varchar)("category", { length: 100 }).default("MECHANICAL").notNull(),
    standardResolution: (0, pg_core_1.text)("standard_resolution"),
    successCount: (0, pg_core_1.integer)("success_count").default(1),
});
exports.workOrders = (0, pg_core_1.pgTable)("work_orders", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_js_1.tenants.id, { onDelete: "cascade" }).notNull(),
    plantId: (0, pg_core_1.uuid)("plant_id").references(() => tenants_js_1.plants.id, { onDelete: "cascade" }).notNull(),
    woNumber: (0, pg_core_1.varchar)("wo_number", { length: 100 }).notNull().unique(), // "WO-2026-0891"
    assetId: (0, pg_core_1.uuid)("asset_id").references(() => masterData_js_1.assets.id, { onDelete: "cascade" }).notNull(),
    title: (0, pg_core_1.varchar)("title", { length: 255 }).notNull(),
    description: (0, pg_core_1.text)("description"),
    type: (0, pg_core_1.varchar)("type", { length: 50 }).default("CORRECTIVE").notNull(), // "CORRECTIVE", "PREVENTIVE", "EMERGENCY_BREAKDOWN", "CALIBRATION"
    priority: (0, pg_core_1.varchar)("priority", { length: 50 }).default("HIGH").notNull(), // "P1_CRITICAL", "HIGH", "MEDIUM", "LOW"
    status: (0, pg_core_1.varchar)("status", { length: 50 }).default("OPEN").notNull(), // "OPEN", "ASSIGNED", "IN_PROGRESS", "WAITING_FOR_PARTS", "COMPLETED", "CLOSED"
    assignedTo: (0, pg_core_1.uuid)("assigned_to").references(() => users_js_1.users.id, { onDelete: "set null" }),
    reportedBy: (0, pg_core_1.uuid)("reported_by").references(() => users_js_1.users.id, { onDelete: "set null" }),
    failureCodeId: (0, pg_core_1.uuid)("failure_code_id").references(() => exports.failureCodes.id, { onDelete: "set null" }),
    estimatedHours: (0, pg_core_1.numeric)("estimated_hours", { precision: 6, scale: 2 }).default("2.0"),
    actualHours: (0, pg_core_1.numeric)("actual_hours", { precision: 6, scale: 2 }).default("0.0"),
    scheduledDate: (0, pg_core_1.timestamp)("scheduled_date"),
    completedAt: (0, pg_core_1.timestamp)("completed_at"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
});
exports.pmSchedules = (0, pg_core_1.pgTable)("pm_schedules", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_js_1.tenants.id, { onDelete: "cascade" }).notNull(),
    plantId: (0, pg_core_1.uuid)("plant_id").references(() => tenants_js_1.plants.id, { onDelete: "cascade" }).notNull(),
    assetId: (0, pg_core_1.uuid)("asset_id").references(() => masterData_js_1.assets.id, { onDelete: "cascade" }).notNull(),
    scheduleCode: (0, pg_core_1.varchar)("schedule_code", { length: 100 }).notNull(), // "PM-FM001-MONTHLY"
    title: (0, pg_core_1.varchar)("title", { length: 255 }).notNull(),
    frequency: (0, pg_core_1.varchar)("frequency", { length: 50 }).default("MONTHLY").notNull(), // "DAILY", "WEEKLY", "MONTHLY", "QUARTERLY", "ANNUAL"
    intervalDays: (0, pg_core_1.integer)("interval_days").default(30).notNull(),
    lastPerformedDate: (0, pg_core_1.timestamp)("last_performed_date"),
    nextDueDate: (0, pg_core_1.timestamp)("next_due_date").notNull(),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).default("SCHEDULED").notNull(), // "SCHEDULED", "OVERDUE", "COMPLETED"
    checklistTemplate: (0, pg_core_1.jsonb)("checklist_template").default([]),
    isActive: (0, pg_core_1.boolean)("is_active").default(true).notNull(),
});
exports.spareParts = (0, pg_core_1.pgTable)("spare_parts", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_js_1.tenants.id, { onDelete: "cascade" }).notNull(),
    plantId: (0, pg_core_1.uuid)("plant_id").references(() => tenants_js_1.plants.id, { onDelete: "cascade" }).notNull(),
    partNumber: (0, pg_core_1.varchar)("part_number", { length: 100 }).notNull().unique(), // "SP-BRG-6205"
    name: (0, pg_core_1.varchar)("name", { length: 255 }).notNull(), // "Deep Groove Ball Bearing 6205-2RS"
    category: (0, pg_core_1.varchar)("category", { length: 100 }).default("MECHANICAL").notNull(),
    currentStock: (0, pg_core_1.integer)("current_stock").default(0).notNull(),
    minStockLevel: (0, pg_core_1.integer)("min_stock_level").default(5).notNull(),
    unitCost: (0, pg_core_1.numeric)("unit_cost", { precision: 10, scale: 2 }).default("450.00"),
    binLocation: (0, pg_core_1.varchar)("bin_location", { length: 50 }).default("M-BIN-04"),
    supplierName: (0, pg_core_1.varchar)("supplier_name", { length: 255 }),
});
exports.spareConsumption = (0, pg_core_1.pgTable)("spare_consumption", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    workOrderId: (0, pg_core_1.uuid)("work_order_id").references(() => exports.workOrders.id, { onDelete: "cascade" }).notNull(),
    sparePartId: (0, pg_core_1.uuid)("spare_part_id").references(() => exports.spareParts.id, { onDelete: "restrict" }).notNull(),
    quantityUsed: (0, pg_core_1.integer)("quantity_used").default(1).notNull(),
    unitCost: (0, pg_core_1.numeric)("unit_cost", { precision: 10, scale: 2 }).notNull(),
    consumedAt: (0, pg_core_1.timestamp)("consumed_at").defaultNow().notNull(),
});
exports.calibrations = (0, pg_core_1.pgTable)("calibrations", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_js_1.tenants.id, { onDelete: "cascade" }).notNull(),
    plantId: (0, pg_core_1.uuid)("plant_id").references(() => tenants_js_1.plants.id, { onDelete: "cascade" }).notNull(),
    assetId: (0, pg_core_1.uuid)("asset_id").references(() => masterData_js_1.assets.id, { onDelete: "cascade" }).notNull(),
    instrumentName: (0, pg_core_1.varchar)("instrument_name", { length: 255 }).notNull(), // "Pasteurizer RTD PT-100 Temperature Transmitter"
    certificateNumber: (0, pg_core_1.varchar)("certificate_number", { length: 100 }),
    calibrationDate: (0, pg_core_1.timestamp)("calibration_date").notNull(),
    nextDueDate: (0, pg_core_1.timestamp)("next_due_date").notNull(),
    accuracyError: (0, pg_core_1.numeric)("accuracy_error", { precision: 6, scale: 3 }).default("0.02"),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).default("VALID").notNull(), // "VALID", "DUE_SOON", "EXPIRED"
});
//# sourceMappingURL=maintenance.js.map