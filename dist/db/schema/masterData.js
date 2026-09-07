"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.qualitySpecs = exports.staff = exports.assets = exports.shifts = exports.productionLines = exports.workCenters = exports.bomItems = exports.boms = exports.skus = exports.productFamilies = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const tenants_js_1 = require("./tenants.js");
exports.productFamilies = (0, pg_core_1.pgTable)("product_families", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_js_1.tenants.id, { onDelete: "cascade" }).notNull(),
    code: (0, pg_core_1.varchar)("code", { length: 50 }).notNull(),
    name: (0, pg_core_1.varchar)("name", { length: 255 }).notNull(),
    description: (0, pg_core_1.text)("description"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
});
exports.skus = (0, pg_core_1.pgTable)("skus", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_js_1.tenants.id, { onDelete: "cascade" }).notNull(),
    skuCode: (0, pg_core_1.varchar)("sku_code", { length: 100 }).notNull(), // e.g. "SKU-5001"
    name: (0, pg_core_1.varchar)("name", { length: 255 }).notNull(), // "500ml Sparkling Citrus Soda"
    category: (0, pg_core_1.varchar)("category", { length: 100 }).notNull(), // "FINISHED_GOODS", "RAW_MATERIAL", "PACKAGING"
    familyId: (0, pg_core_1.uuid)("family_id").references(() => exports.productFamilies.id, { onDelete: "set null" }),
    uom: (0, pg_core_1.varchar)("uom", { length: 50 }).default("Units").notNull(), // "Units", "Liters", "kg", "Can"
    barcode: (0, pg_core_1.varchar)("barcode", { length: 100 }),
    standardCost: (0, pg_core_1.numeric)("standard_cost", { precision: 12, scale: 4 }).default("0.00"),
    shelfLifeDays: (0, pg_core_1.integer)("shelf_life_days").default(365),
    minStockLevel: (0, pg_core_1.numeric)("min_stock_level", { precision: 12, scale: 2 }).default("1000"),
    maxStockLevel: (0, pg_core_1.numeric)("max_stock_level", { precision: 12, scale: 2 }).default("50000"),
    isActive: (0, pg_core_1.boolean)("is_active").default(true).notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
});
exports.boms = (0, pg_core_1.pgTable)("boms", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_js_1.tenants.id, { onDelete: "cascade" }).notNull(),
    skuId: (0, pg_core_1.uuid)("sku_id").references(() => exports.skus.id, { onDelete: "cascade" }).notNull(),
    version: (0, pg_core_1.varchar)("version", { length: 50 }).default("v1.0").notNull(),
    name: (0, pg_core_1.varchar)("name", { length: 255 }).notNull(),
    batchSize: (0, pg_core_1.numeric)("batch_size", { precision: 12, scale: 2 }).default("10000").notNull(),
    batchUom: (0, pg_core_1.varchar)("batch_uom", { length: 50 }).default("Units").notNull(),
    yieldPercent: (0, pg_core_1.numeric)("yield_percent", { precision: 5, scale: 2 }).default("98.50"),
    isDefault: (0, pg_core_1.boolean)("is_default").default(true).notNull(),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).default("ACTIVE").notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
});
exports.bomItems = (0, pg_core_1.pgTable)("bom_items", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    bomId: (0, pg_core_1.uuid)("bom_id").references(() => exports.boms.id, { onDelete: "cascade" }).notNull(),
    componentSkuId: (0, pg_core_1.uuid)("component_sku_id").references(() => exports.skus.id, { onDelete: "restrict" }).notNull(),
    quantity: (0, pg_core_1.numeric)("quantity", { precision: 14, scale: 4 }).notNull(),
    scrapPercentage: (0, pg_core_1.numeric)("scrap_percentage", { precision: 5, scale: 2 }).default("0.00"),
    uom: (0, pg_core_1.varchar)("uom", { length: 50 }).notNull(),
    sequence: (0, pg_core_1.integer)("sequence").default(1).notNull(),
    stage: (0, pg_core_1.varchar)("stage", { length: 100 }).default("MIXING"), // "MIXING", "PACKAGING"
});
exports.workCenters = (0, pg_core_1.pgTable)("work_centers", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_js_1.tenants.id, { onDelete: "cascade" }).notNull(),
    plantId: (0, pg_core_1.uuid)("plant_id").references(() => tenants_js_1.plants.id, { onDelete: "cascade" }).notNull(),
    code: (0, pg_core_1.varchar)("code", { length: 50 }).notNull(), // "WC-01"
    name: (0, pg_core_1.varchar)("name", { length: 255 }).notNull(), // "Formulation & Batching Bay"
    category: (0, pg_core_1.varchar)("category", { length: 100 }).notNull(), // "PROCESSING", "PACKAGING", "UTILITIES"
    capacityPerHour: (0, pg_core_1.numeric)("capacity_per_hour", { precision: 10, scale: 2 }).default("5000"),
    hourlyRate: (0, pg_core_1.numeric)("hourly_rate", { precision: 10, scale: 2 }).default("1500"),
    isActive: (0, pg_core_1.boolean)("is_active").default(true).notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.productionLines = (0, pg_core_1.pgTable)("production_lines", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_js_1.tenants.id, { onDelete: "cascade" }).notNull(),
    plantId: (0, pg_core_1.uuid)("plant_id").references(() => tenants_js_1.plants.id, { onDelete: "cascade" }).notNull(),
    workCenterId: (0, pg_core_1.uuid)("work_center_id").references(() => exports.workCenters.id, { onDelete: "set null" }),
    code: (0, pg_core_1.varchar)("code", { length: 50 }).notNull(), // "LINE-1"
    name: (0, pg_core_1.varchar)("name", { length: 255 }).notNull(), // "High-Speed Bottling Line 1"
    lineType: (0, pg_core_1.varchar)("line_type", { length: 100 }).default("BOTTLING"), // "BOTTLING", "BLENDING", "CANNING"
    nominalSpeedBpm: (0, pg_core_1.integer)("nominal_speed_bpm").default(250),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).default("RUNNING"), // "RUNNING", "IDLE", "DOWNTIME", "CHANGEOVER"
    healthScore: (0, pg_core_1.integer)("health_score").default(94),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.shifts = (0, pg_core_1.pgTable)("shifts", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_js_1.tenants.id, { onDelete: "cascade" }).notNull(),
    plantId: (0, pg_core_1.uuid)("plant_id").references(() => tenants_js_1.plants.id, { onDelete: "cascade" }).notNull(),
    code: (0, pg_core_1.varchar)("code", { length: 50 }).notNull(), // "SHIFT_A"
    name: (0, pg_core_1.varchar)("name", { length: 100 }).notNull(), // "Morning Shift A"
    startTime: (0, pg_core_1.varchar)("start_time", { length: 10 }).notNull(), // "06:00"
    endTime: (0, pg_core_1.varchar)("end_time", { length: 10 }).notNull(), // "14:30"
    isActive: (0, pg_core_1.boolean)("is_active").default(true).notNull(),
});
exports.assets = (0, pg_core_1.pgTable)("assets", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_js_1.tenants.id, { onDelete: "cascade" }).notNull(),
    plantId: (0, pg_core_1.uuid)("plant_id").references(() => tenants_js_1.plants.id, { onDelete: "cascade" }).notNull(),
    lineId: (0, pg_core_1.uuid)("line_id").references(() => exports.productionLines.id, { onDelete: "set null" }),
    assetCode: (0, pg_core_1.varchar)("asset_code", { length: 100 }).notNull(), // "FM-001"
    name: (0, pg_core_1.varchar)("name", { length: 255 }).notNull(), // "Rotary Filling Machine"
    modelNumber: (0, pg_core_1.varchar)("model_number", { length: 100 }),
    manufacturer: (0, pg_core_1.varchar)("manufacturer", { length: 100 }),
    criticalLevel: (0, pg_core_1.varchar)("critical_level", { length: 50 }).default("CRITICAL_P1"), // "CRITICAL_P1", "IMPORTANT_P2", "NORMAL_P3"
    status: (0, pg_core_1.varchar)("status", { length: 50 }).default("OPERATIONAL"), // "OPERATIONAL", "BREAKDOWN", "MAINTENANCE"
    healthPercent: (0, pg_core_1.integer)("health_percent").default(92),
    mtbfHours: (0, pg_core_1.numeric)("mtbf_hours", { precision: 10, scale: 2 }).default("412.5"),
    mttrHours: (0, pg_core_1.numeric)("mttr_hours", { precision: 10, scale: 2 }).default("1.8"),
    installDate: (0, pg_core_1.timestamp)("install_date"),
    lastServiceDate: (0, pg_core_1.timestamp)("last_service_date"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
});
exports.staff = (0, pg_core_1.pgTable)("staff", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_js_1.tenants.id, { onDelete: "cascade" }).notNull(),
    plantId: (0, pg_core_1.uuid)("plant_id").references(() => tenants_js_1.plants.id, { onDelete: "cascade" }).notNull(),
    employeeCode: (0, pg_core_1.varchar)("employee_code", { length: 50 }).notNull(),
    name: (0, pg_core_1.varchar)("name", { length: 255 }).notNull(),
    designation: (0, pg_core_1.varchar)("designation", { length: 100 }).notNull(),
    shiftCode: (0, pg_core_1.varchar)("shift_code", { length: 50 }).default("SHIFT_A"),
    phone: (0, pg_core_1.varchar)("phone", { length: 50 }),
    isAvailable: (0, pg_core_1.boolean)("is_available").default(true).notNull(),
    certifications: (0, pg_core_1.jsonb)("certifications").default([]),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.qualitySpecs = (0, pg_core_1.pgTable)("quality_specs", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_js_1.tenants.id, { onDelete: "cascade" }).notNull(),
    skuId: (0, pg_core_1.uuid)("sku_id").references(() => exports.skus.id, { onDelete: "cascade" }).notNull(),
    parameterName: (0, pg_core_1.varchar)("parameter_name", { length: 150 }).notNull(), // "Pasteurization Temperature"
    targetValue: (0, pg_core_1.numeric)("target_value", { precision: 10, scale: 3 }).notNull(),
    minTolerance: (0, pg_core_1.numeric)("min_tolerance", { precision: 10, scale: 3 }).notNull(),
    maxTolerance: (0, pg_core_1.numeric)("max_tolerance", { precision: 10, scale: 3 }).notNull(),
    uom: (0, pg_core_1.varchar)("uom", { length: 50 }).notNull(), // "°C", "pH", "Brix", "mm"
    isCCP: (0, pg_core_1.boolean)("is_ccp").default(false).notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
//# sourceMappingURL=masterData.js.map