"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uoms = exports.allergenRules = exports.sanitationClasses = exports.packaging = exports.lineTargets = exports.operations = exports.changeoverRules = exports.routingSteps = exports.routings = exports.qualitySpecs = exports.staff = exports.assets = exports.shifts = exports.productionLines = exports.workCenters = exports.bomItems = exports.boms = exports.skus = exports.productFamilies = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const tenants_1 = require("./tenants");
exports.productFamilies = (0, pg_core_1.pgTable)("product_families", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_1.tenants.id, { onDelete: "cascade" }).notNull(),
    code: (0, pg_core_1.varchar)("code", { length: 50 }).notNull(),
    name: (0, pg_core_1.varchar)("name", { length: 255 }).notNull(),
    description: (0, pg_core_1.text)("description"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
});
exports.skus = (0, pg_core_1.pgTable)("skus", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_1.tenants.id, { onDelete: "cascade" }).notNull(),
    plantId: (0, pg_core_1.uuid)("plant_id").references(() => tenants_1.plants.id, { onDelete: "cascade" }),
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
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_1.tenants.id, { onDelete: "cascade" }).notNull(),
    skuId: (0, pg_core_1.uuid)("sku_id").references(() => exports.skus.id, { onDelete: "cascade" }).notNull(),
    bomNumber: (0, pg_core_1.varchar)("bom_number", { length: 100 }),
    version: (0, pg_core_1.varchar)("version", { length: 50 }).default("v1.0").notNull(),
    name: (0, pg_core_1.varchar)("name", { length: 255 }).notNull(),
    batchSize: (0, pg_core_1.numeric)("batch_size", { precision: 12, scale: 2 }).default("10000").notNull(),
    batchUom: (0, pg_core_1.varchar)("batch_uom", { length: 50 }).default("Units").notNull(),
    yieldPercent: (0, pg_core_1.numeric)("yield_percent", { precision: 5, scale: 2 }).default("98.50"),
    isDefault: (0, pg_core_1.boolean)("is_default").default(true).notNull(),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).default("ACTIVE").notNull(),
    approvalStatus: (0, pg_core_1.varchar)("approval_status", { length: 50 }).default("Draft"),
    createdBy: (0, pg_core_1.varchar)("created_by", { length: 100 }).default("Alexander Vance"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
});
exports.bomItems = (0, pg_core_1.pgTable)("bom_items", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    bomId: (0, pg_core_1.uuid)("bom_id").references(() => exports.boms.id, { onDelete: "cascade" }).notNull(),
    componentSkuId: (0, pg_core_1.uuid)("component_sku_id").references(() => exports.skus.id, { onDelete: "restrict" }),
    componentName: (0, pg_core_1.varchar)("component_name", { length: 255 }),
    skuCode: (0, pg_core_1.varchar)("sku_code", { length: 50 }),
    quantity: (0, pg_core_1.numeric)("quantity", { precision: 14, scale: 4 }).notNull(),
    scrapPercentage: (0, pg_core_1.numeric)("scrap_percentage", { precision: 5, scale: 2 }).default("0.00"),
    uom: (0, pg_core_1.varchar)("uom", { length: 50 }).notNull(),
    sequence: (0, pg_core_1.integer)("sequence").default(1).notNull(),
    stage: (0, pg_core_1.varchar)("stage", { length: 100 }).default("MIXING"), // "MIXING", "PACKAGING"
});
exports.workCenters = (0, pg_core_1.pgTable)("work_centers", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_1.tenants.id, { onDelete: "cascade" }).notNull(),
    plantId: (0, pg_core_1.uuid)("plant_id").references(() => tenants_1.plants.id, { onDelete: "cascade" }).notNull(),
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
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_1.tenants.id, { onDelete: "cascade" }).notNull(),
    plantId: (0, pg_core_1.uuid)("plant_id").references(() => tenants_1.plants.id, { onDelete: "cascade" }).notNull(),
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
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_1.tenants.id, { onDelete: "cascade" }).notNull(),
    plantId: (0, pg_core_1.uuid)("plant_id").references(() => tenants_1.plants.id, { onDelete: "cascade" }).notNull(),
    code: (0, pg_core_1.varchar)("code", { length: 50 }).notNull(), // "SHIFT_A"
    name: (0, pg_core_1.varchar)("name", { length: 100 }).notNull(), // "Morning Shift A"
    startTime: (0, pg_core_1.varchar)("start_time", { length: 10 }).notNull(), // "06:00"
    endTime: (0, pg_core_1.varchar)("end_time", { length: 10 }).notNull(), // "14:30"
    isActive: (0, pg_core_1.boolean)("is_active").default(true).notNull(),
});
exports.assets = (0, pg_core_1.pgTable)("assets", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_1.tenants.id, { onDelete: "cascade" }).notNull(),
    plantId: (0, pg_core_1.uuid)("plant_id").references(() => tenants_1.plants.id, { onDelete: "cascade" }).notNull(),
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
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_1.tenants.id, { onDelete: "cascade" }).notNull(),
    plantId: (0, pg_core_1.uuid)("plant_id").references(() => tenants_1.plants.id, { onDelete: "cascade" }).notNull(),
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
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_1.tenants.id, { onDelete: "cascade" }).notNull(),
    skuId: (0, pg_core_1.uuid)("sku_id").references(() => exports.skus.id, { onDelete: "cascade" }).notNull(),
    parameterName: (0, pg_core_1.varchar)("parameter_name", { length: 150 }).notNull(), // "Pasteurization Temperature"
    targetValue: (0, pg_core_1.numeric)("target_value", { precision: 10, scale: 3 }).notNull(),
    minTolerance: (0, pg_core_1.numeric)("min_tolerance", { precision: 10, scale: 3 }).notNull(),
    maxTolerance: (0, pg_core_1.numeric)("max_tolerance", { precision: 10, scale: 3 }).notNull(),
    uom: (0, pg_core_1.varchar)("uom", { length: 50 }).notNull(), // "°C", "pH", "Brix", "mm"
    isCCP: (0, pg_core_1.boolean)("is_ccp").default(false).notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.routings = (0, pg_core_1.pgTable)("routings", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_1.tenants.id, { onDelete: "cascade" }).notNull(),
    plantId: (0, pg_core_1.uuid)("plant_id").references(() => tenants_1.plants.id, { onDelete: "set null" }),
    routingCode: (0, pg_core_1.varchar)("routing_code", { length: 100 }).notNull(), // e.g. "RTG-5001-L1"
    skuId: (0, pg_core_1.uuid)("sku_id").references(() => exports.skus.id, { onDelete: "cascade" }).notNull(),
    lineId: (0, pg_core_1.uuid)("line_id").references(() => exports.productionLines.id, { onDelete: "set null" }),
    revision: (0, pg_core_1.varchar)("revision", { length: 50 }).default("R1").notNull(),
    approvalStatus: (0, pg_core_1.varchar)("approval_status", { length: 50 }).default("Approved").notNull(), // "Draft", "In Review", "Approved", "Obsolete"
    status: (0, pg_core_1.varchar)("status", { length: 50 }).default("Active").notNull(), // "Active", "Inactive"
    stdRunRateBph: (0, pg_core_1.integer)("std_run_rate_bph").default(12000).notNull(),
    setupDurationMin: (0, pg_core_1.integer)("setup_duration_min").default(45).notNull(),
    expectedYieldPct: (0, pg_core_1.numeric)("expected_yield_pct", { precision: 5, scale: 2 }).default("98.50").notNull(),
    effectiveFrom: (0, pg_core_1.timestamp)("effective_from"),
    effectiveTo: (0, pg_core_1.timestamp)("effective_to"),
    notes: (0, pg_core_1.text)("notes"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
});
exports.routingSteps = (0, pg_core_1.pgTable)("routing_steps", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    routingId: (0, pg_core_1.uuid)("routing_id").references(() => exports.routings.id, { onDelete: "cascade" }).notNull(),
    sequence: (0, pg_core_1.integer)("sequence").default(10).notNull(),
    operationCode: (0, pg_core_1.varchar)("operation_code", { length: 100 }).notNull(), // "OP-10", "OP-20"
    operationName: (0, pg_core_1.varchar)("operation_name", { length: 255 }).notNull(), // "Depalletizing & Bottle Infeed"
    workCenterId: (0, pg_core_1.uuid)("work_center_id").references(() => exports.workCenters.id, { onDelete: "set null" }),
    stdDurationMin: (0, pg_core_1.numeric)("std_duration_min", { precision: 10, scale: 2 }).default("15.00"),
    setupDurationMin: (0, pg_core_1.numeric)("setup_duration_min", { precision: 10, scale: 2 }).default("10.00"),
    crewSize: (0, pg_core_1.integer)("crew_size").default(2),
    isQualityGate: (0, pg_core_1.boolean)("is_quality_gate").default(false).notNull(),
    instructions: (0, pg_core_1.text)("instructions"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.changeoverRules = (0, pg_core_1.pgTable)("changeover_rules", {
    id: (0, pg_core_1.varchar)("id", { length: 64 }).primaryKey(),
    matrixId: (0, pg_core_1.varchar)("matrix_id", { length: 64 }),
    fromSkuId: (0, pg_core_1.varchar)("from_sku_id", { length: 64 }),
    fromSkuCode: (0, pg_core_1.varchar)("from_sku_code", { length: 64 }),
    fromFamily: (0, pg_core_1.varchar)("from_family", { length: 128 }),
    toSkuId: (0, pg_core_1.varchar)("to_sku_id", { length: 64 }),
    toSkuCode: (0, pg_core_1.varchar)("to_sku_code", { length: 64 }),
    toFamily: (0, pg_core_1.varchar)("to_family", { length: 128 }),
    changeoverDurationMin: (0, pg_core_1.integer)("changeover_duration_min").default(30),
    sanitationClass: (0, pg_core_1.varchar)("sanitation_class", { length: 255 }),
    allergenCleaningRequired: (0, pg_core_1.boolean)("allergen_cleaning_required").default(false),
    notes: (0, pg_core_1.text)("notes"),
    status: (0, pg_core_1.varchar)("status", { length: 32 }).default("Active"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
exports.operations = (0, pg_core_1.pgTable)("operations", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    operationCode: (0, pg_core_1.varchar)("operation_code", { length: 50 }).notNull(),
    name: (0, pg_core_1.varchar)("name", { length: 255 }).notNull(),
    sequence: (0, pg_core_1.integer)("sequence").default(10),
    department: (0, pg_core_1.varchar)("department", { length: 100 }).default("Packaging"),
    stdDurationMin: (0, pg_core_1.integer)("std_duration_min").default(45),
    setupDurationMin: (0, pg_core_1.integer)("setup_duration_min").default(15),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).default("Active"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
exports.lineTargets = (0, pg_core_1.pgTable)("line_targets", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    targetId: (0, pg_core_1.varchar)("target_id", { length: 50 }),
    plantId: (0, pg_core_1.varchar)("plant_id", { length: 50 }).default("PLT-01"),
    lineId: (0, pg_core_1.varchar)("line_id", { length: 50 }).notNull(),
    lineName: (0, pg_core_1.varchar)("line_name", { length: 255 }),
    skuId: (0, pg_core_1.varchar)("sku_id", { length: 50 }),
    skuCode: (0, pg_core_1.varchar)("sku_code", { length: 50 }),
    skuName: (0, pg_core_1.varchar)("sku_name", { length: 255 }),
    shift: (0, pg_core_1.varchar)("shift", { length: 100 }).default("Morning Shift (A)"),
    targetQuantity: (0, pg_core_1.integer)("target_quantity").default(0),
    targetOeePct: (0, pg_core_1.numeric)("target_oee_pct", { precision: 5, scale: 2 }).default("85.00"),
    targetSpeedBpm: (0, pg_core_1.integer)("target_speed_bpm").default(250),
    effectiveDate: (0, pg_core_1.timestamp)("effective_date").defaultNow(),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).default("Active"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
exports.packaging = (0, pg_core_1.pgTable)("packaging", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    packCode: (0, pg_core_1.varchar)("pack_code", { length: 50 }).notNull(),
    name: (0, pg_core_1.varchar)("name", { length: 255 }),
    skuId: (0, pg_core_1.varchar)("sku_id", { length: 100 }),
    skuCode: (0, pg_core_1.varchar)("sku_code", { length: 50 }),
    skuName: (0, pg_core_1.varchar)("sku_name", { length: 255 }),
    unitsPerPack: (0, pg_core_1.integer)("units_per_pack").default(24),
    packType: (0, pg_core_1.varchar)("pack_type", { length: 255 }).default("Corrugated Tray & Shrink Wrap"),
    caseConfiguration: (0, pg_core_1.varchar)("case_configuration", { length: 255 }).default("4x6 Units (24 Count)"),
    palletConfiguration: (0, pg_core_1.varchar)("pallet_configuration", { length: 255 }).default("60 Cases / 1,440 Units per Pallet"),
    palletCount: (0, pg_core_1.integer)("pallet_count").default(60),
    packagingUom: (0, pg_core_1.varchar)("packaging_uom", { length: 50 }).default("CASE-24"),
    tareWeightKg: (0, pg_core_1.numeric)("tare_weight_kg", { precision: 10, scale: 2 }).default("12.50"),
    grossWeightKg: (0, pg_core_1.numeric)("gross_weight_kg", { precision: 10, scale: 2 }).default("12.50"),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).default("Active"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
exports.sanitationClasses = (0, pg_core_1.pgTable)("sanitation_classes", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    classId: (0, pg_core_1.varchar)("class_id", { length: 50 }),
    sanitationId: (0, pg_core_1.varchar)("sanitation_id", { length: 50 }),
    code: (0, pg_core_1.varchar)("code", { length: 50 }),
    name: (0, pg_core_1.varchar)("name", { length: 255 }),
    sanitationClass: (0, pg_core_1.varchar)("sanitation_class", { length: 255 }),
    description: (0, pg_core_1.text)("description"),
    durationMin: (0, pg_core_1.integer)("duration_min").default(45),
    washDurationMin: (0, pg_core_1.integer)("wash_duration_min").default(45),
    cleaningMethod: (0, pg_core_1.varchar)("cleaning_method", { length: 255 }),
    cleaningLevel: (0, pg_core_1.varchar)("cleaning_level", { length: 100 }),
    riskLevel: (0, pg_core_1.varchar)("risk_level", { length: 100 }),
    applicableProducts: (0, pg_core_1.text)("applicable_products"),
    chemicalAgent: (0, pg_core_1.varchar)("chemical_agent", { length: 255 }),
    validationMethod: (0, pg_core_1.varchar)("validation_method", { length: 255 }),
    frequency: (0, pg_core_1.varchar)("frequency", { length: 100 }),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).default("Active"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
exports.allergenRules = (0, pg_core_1.pgTable)("allergen_rules", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    ruleCode: (0, pg_core_1.varchar)("rule_code", { length: 50 }),
    allergenType: (0, pg_core_1.varchar)("allergen_type", { length: 100 }),
    cleaningProtocol: (0, pg_core_1.varchar)("cleaning_protocol", { length: 255 }),
    requiredDowntimeMin: (0, pg_core_1.integer)("required_downtime_min").default(60),
    validationRequired: (0, pg_core_1.boolean)("validation_required").default(true),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).default("Active"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
exports.uoms = (0, pg_core_1.pgTable)("uoms", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    code: (0, pg_core_1.varchar)("code", { length: 50 }).notNull(),
    name: (0, pg_core_1.varchar)("name", { length: 255 }).notNull(),
    category: (0, pg_core_1.varchar)("category", { length: 100 }).default("Packaging"),
    type: (0, pg_core_1.varchar)("type", { length: 100 }).default("Packaging"),
    baseUnit: (0, pg_core_1.varchar)("base_unit", { length: 100 }).default("EA"),
    conversionFactor: (0, pg_core_1.numeric)("conversion_factor", { precision: 10, scale: 4 }).default("1.0000"),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).default("Active"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
//# sourceMappingURL=masterData.js.map