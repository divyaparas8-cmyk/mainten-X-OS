"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.promotionCampaigns = exports.purchaseRequisitions = exports.mrpRequirements = exports.apsSchedules = exports.forecasts = exports.customerOrders = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const tenants_1 = require("./tenants");
const masterData_1 = require("./masterData");
exports.customerOrders = (0, pg_core_1.pgTable)("customer_orders", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_1.tenants.id, { onDelete: "cascade" }).notNull(),
    plantId: (0, pg_core_1.uuid)("plant_id").references(() => tenants_1.plants.id, { onDelete: "cascade" }).notNull(),
    orderNumber: (0, pg_core_1.varchar)("order_number", { length: 100 }).notNull(), // "PO-KR-99321"
    customerName: (0, pg_core_1.varchar)("customer_name", { length: 255 }).notNull(), // "Kroger Supermarkets"
    skuId: (0, pg_core_1.uuid)("sku_id").references(() => masterData_1.skus.id, { onDelete: "restrict" }).notNull(),
    quantity: (0, pg_core_1.numeric)("quantity", { precision: 12, scale: 2 }).notNull(),
    priority: (0, pg_core_1.varchar)("priority", { length: 50 }).default("NORMAL"), // "URGENT", "NORMAL", "LOW"
    requestedDate: (0, pg_core_1.timestamp)("requested_date").notNull(),
    scheduledDate: (0, pg_core_1.timestamp)("scheduled_date"),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).default("CONFIRMED").notNull(), // "CONFIRMED", "SCHEDULED", "IN_PRODUCTION", "FULFILLED", "CANCELLED"
    deliveryAddress: (0, pg_core_1.text)("delivery_address"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
});
exports.forecasts = (0, pg_core_1.pgTable)("forecasts", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_1.tenants.id, { onDelete: "cascade" }).notNull(),
    plantId: (0, pg_core_1.uuid)("plant_id").references(() => tenants_1.plants.id, { onDelete: "cascade" }).notNull(),
    skuId: (0, pg_core_1.uuid)("sku_id").references(() => masterData_1.skus.id, { onDelete: "cascade" }).notNull(),
    period: (0, pg_core_1.varchar)("period", { length: 50 }).notNull(), // "2026-W36" or "2026-09"
    baselineDemand: (0, pg_core_1.numeric)("baseline_demand", { precision: 12, scale: 2 }).notNull(),
    promoUplift: (0, pg_core_1.numeric)("promo_uplift", { precision: 12, scale: 2 }).default("0.00"),
    overrideQuantity: (0, pg_core_1.numeric)("override_quantity", { precision: 12, scale: 2 }),
    finalForecast: (0, pg_core_1.numeric)("final_forecast", { precision: 12, scale: 2 }).notNull(),
    mapeAccuracy: (0, pg_core_1.numeric)("mape_accuracy", { precision: 5, scale: 2 }).default("94.60"),
    modelType: (0, pg_core_1.varchar)("model_type", { length: 100 }).default("EXPONENTIAL_SMOOTHING"),
    owner: (0, pg_core_1.varchar)("owner", { length: 255 }).default("Elena Rostova"),
    reason: (0, pg_core_1.text)("reason"),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).default("Submitted"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.apsSchedules = (0, pg_core_1.pgTable)("aps_schedules", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_1.tenants.id, { onDelete: "cascade" }).notNull(),
    plantId: (0, pg_core_1.uuid)("plant_id").references(() => tenants_1.plants.id, { onDelete: "cascade" }).notNull(),
    lineId: (0, pg_core_1.uuid)("line_id").references(() => masterData_1.productionLines.id, { onDelete: "cascade" }).notNull(),
    shiftId: (0, pg_core_1.uuid)("shift_id").references(() => masterData_1.shifts.id, { onDelete: "set null" }),
    orderId: (0, pg_core_1.uuid)("order_id").references(() => exports.customerOrders.id, { onDelete: "set null" }),
    skuId: (0, pg_core_1.uuid)("sku_id").references(() => masterData_1.skus.id, { onDelete: "restrict" }).notNull(),
    startTime: (0, pg_core_1.timestamp)("start_time").notNull(),
    endTime: (0, pg_core_1.timestamp)("end_time").notNull(),
    quantity: (0, pg_core_1.numeric)("quantity", { precision: 12, scale: 2 }).notNull(),
    changeoverMinutes: (0, pg_core_1.integer)("changeover_minutes").default(30),
    cipRequired: (0, pg_core_1.boolean)("cip_required").default(false),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).default("DRAFT").notNull(), // "DRAFT", "PUBLISHED", "LOCKED", "COMPLETED"
    sequenceNumber: (0, pg_core_1.integer)("sequence_number").default(1),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
});
exports.mrpRequirements = (0, pg_core_1.pgTable)("mrp_requirements", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_1.tenants.id, { onDelete: "cascade" }).notNull(),
    plantId: (0, pg_core_1.uuid)("plant_id").references(() => tenants_1.plants.id, { onDelete: "cascade" }).notNull(),
    skuId: (0, pg_core_1.uuid)("sku_id").references(() => masterData_1.skus.id, { onDelete: "cascade" }).notNull(),
    materialName: (0, pg_core_1.varchar)("material_name", { length: 255 }),
    skuCode: (0, pg_core_1.varchar)("sku_code", { length: 100 }),
    category: (0, pg_core_1.varchar)("category", { length: 100 }),
    uom: (0, pg_core_1.varchar)("uom", { length: 50 }),
    grossRequirement: (0, pg_core_1.numeric)("gross_requirement", { precision: 14, scale: 4 }).notNull(),
    safetyStock: (0, pg_core_1.numeric)("safety_stock", { precision: 14, scale: 4 }).default("1000.00"),
    availableStock: (0, pg_core_1.numeric)("available_stock", { precision: 14, scale: 4 }).notNull(),
    reservedStock: (0, pg_core_1.numeric)("reserved_stock", { precision: 14, scale: 4 }).default("0.00"),
    scheduledReceipts: (0, pg_core_1.numeric)("scheduled_receipts", { precision: 14, scale: 4 }).default("0.00"),
    netShortage: (0, pg_core_1.numeric)("net_shortage", { precision: 14, scale: 4 }).notNull(),
    requiredDate: (0, pg_core_1.timestamp)("required_date").notNull(),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).default("SHORTAGE_ALERT"), // "CRITICAL", "SHORTAGE_ALERT", "COVERED"
    suggestedAction: (0, pg_core_1.varchar)("suggested_action", { length: 255 }),
    calculatedAt: (0, pg_core_1.timestamp)("calculated_at").defaultNow().notNull(),
});
exports.purchaseRequisitions = (0, pg_core_1.pgTable)("purchase_requisitions", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_1.tenants.id, { onDelete: "cascade" }).notNull(),
    plantId: (0, pg_core_1.uuid)("plant_id").references(() => tenants_1.plants.id, { onDelete: "cascade" }).notNull(),
    reqNumber: (0, pg_core_1.varchar)("req_number", { length: 100 }).notNull(), // "PR-2026-0881"
    skuId: (0, pg_core_1.uuid)("sku_id").references(() => masterData_1.skus.id, { onDelete: "restrict" }).notNull(),
    quantity: (0, pg_core_1.numeric)("quantity", { precision: 14, scale: 4 }).notNull(),
    uom: (0, pg_core_1.varchar)("uom", { length: 50 }).notNull(),
    vendorName: (0, pg_core_1.varchar)("vendor_name", { length: 255 }),
    estimatedCost: (0, pg_core_1.numeric)("estimated_cost", { precision: 12, scale: 2 }),
    urgency: (0, pg_core_1.varchar)("urgency", { length: 50 }).default("HIGH"),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).default("PENDING_APPROVAL"), // "PENDING_APPROVAL", "PO_CREATED", "REJECTED"
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.promotionCampaigns = (0, pg_core_1.pgTable)("promotion_campaigns", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_1.tenants.id, { onDelete: "cascade" }).notNull(),
    plantId: (0, pg_core_1.uuid)("plant_id").references(() => tenants_1.plants.id, { onDelete: "cascade" }).notNull(),
    name: (0, pg_core_1.varchar)("name", { length: 255 }).notNull(),
    skuId: (0, pg_core_1.uuid)("sku_id").references(() => masterData_1.skus.id, { onDelete: "restrict" }).notNull(),
    upliftPercent: (0, pg_core_1.numeric)("uplift_percent", { precision: 5, scale: 2 }).notNull(),
    incrementalUnits: (0, pg_core_1.numeric)("incremental_units", { precision: 14, scale: 2 }).default("0.00"),
    startDate: (0, pg_core_1.timestamp)("start_date").notNull(),
    endDate: (0, pg_core_1.timestamp)("end_date").notNull(),
    channel: (0, pg_core_1.varchar)("channel", { length: 100 }).default("Wholesale Club Flyer"),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).default("SCHEDULED").notNull(), // "ACTIVE", "SCHEDULED", "EXPIRED", "CANCELLED"
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
});
//# sourceMappingURL=planning.js.map