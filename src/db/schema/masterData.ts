import { pgTable, uuid, varchar, text, timestamp, boolean, numeric, integer, jsonb } from "drizzle-orm/pg-core";
import { tenants, plants } from "./tenants";

export const productFamilies = pgTable("product_families", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  code: varchar("code", { length: 50 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const skus = pgTable("skus", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  plantId: uuid("plant_id").references(() => plants.id, { onDelete: "cascade" }),
  skuCode: varchar("sku_code", { length: 100 }).notNull(), // e.g. "SKU-5001"
  name: varchar("name", { length: 255 }).notNull(),        // "500ml Sparkling Citrus Soda"
  category: varchar("category", { length: 100 }).notNull(), // "FINISHED_GOODS", "RAW_MATERIAL", "PACKAGING"
  familyId: uuid("family_id").references(() => productFamilies.id, { onDelete: "set null" }),
  uom: varchar("uom", { length: 50 }).default("Units").notNull(), // "Units", "Liters", "kg", "Can"
  barcode: varchar("barcode", { length: 100 }),
  standardCost: numeric("standard_cost", { precision: 12, scale: 4 }).default("0.00"),
  shelfLifeDays: integer("shelf_life_days").default(365),
  minStockLevel: numeric("min_stock_level", { precision: 12, scale: 2 }).default("1000"),
  maxStockLevel: numeric("max_stock_level", { precision: 12, scale: 2 }).default("50000"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const boms = pgTable("boms", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  skuId: uuid("sku_id").references(() => skus.id, { onDelete: "cascade" }).notNull(),
  bomNumber: varchar("bom_number", { length: 100 }),
  version: varchar("version", { length: 50 }).default("v1.0").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  batchSize: numeric("batch_size", { precision: 12, scale: 2 }).default("10000").notNull(),
  batchUom: varchar("batch_uom", { length: 50 }).default("Units").notNull(),
  yieldPercent: numeric("yield_percent", { precision: 5, scale: 2 }).default("98.50"),
  isDefault: boolean("is_default").default(true).notNull(),
  status: varchar("status", { length: 50 }).default("ACTIVE").notNull(),
  approvalStatus: varchar("approval_status", { length: 50 }).default("Draft"),
  createdBy: varchar("created_by", { length: 100 }).default("Alexander Vance"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const bomItems = pgTable("bom_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  bomId: uuid("bom_id").references(() => boms.id, { onDelete: "cascade" }).notNull(),
  componentSkuId: uuid("component_sku_id").references(() => skus.id, { onDelete: "restrict" }),
  componentName: varchar("component_name", { length: 255 }),
  skuCode: varchar("sku_code", { length: 50 }),
  quantity: numeric("quantity", { precision: 14, scale: 4 }).notNull(),
  scrapPercentage: numeric("scrap_percentage", { precision: 5, scale: 2 }).default("0.00"),
  uom: varchar("uom", { length: 50 }).notNull(),
  sequence: integer("sequence").default(1).notNull(),
  stage: varchar("stage", { length: 100 }).default("MIXING"), // "MIXING", "PACKAGING"
});

export const workCenters = pgTable("work_centers", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  plantId: uuid("plant_id").references(() => plants.id, { onDelete: "cascade" }).notNull(),
  code: varchar("code", { length: 50 }).notNull(), // "WC-01"
  name: varchar("name", { length: 255 }).notNull(), // "Formulation & Batching Bay"
  category: varchar("category", { length: 100 }).notNull(), // "PROCESSING", "PACKAGING", "UTILITIES"
  capacityPerHour: numeric("capacity_per_hour", { precision: 10, scale: 2 }).default("5000"),
  hourlyRate: numeric("hourly_rate", { precision: 10, scale: 2 }).default("1500"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const productionLines = pgTable("production_lines", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  plantId: uuid("plant_id").references(() => plants.id, { onDelete: "cascade" }).notNull(),
  workCenterId: uuid("work_center_id").references(() => workCenters.id, { onDelete: "set null" }),
  code: varchar("code", { length: 50 }).notNull(), // "LINE-1"
  name: varchar("name", { length: 255 }).notNull(), // "High-Speed Bottling Line 1"
  lineType: varchar("line_type", { length: 100 }).default("BOTTLING"), // "BOTTLING", "BLENDING", "CANNING"
  nominalSpeedBpm: integer("nominal_speed_bpm").default(250),
  status: varchar("status", { length: 50 }).default("RUNNING"), // "RUNNING", "IDLE", "DOWNTIME", "CHANGEOVER"
  healthScore: integer("health_score").default(94),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const shifts = pgTable("shifts", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  plantId: uuid("plant_id").references(() => plants.id, { onDelete: "cascade" }).notNull(),
  code: varchar("code", { length: 50 }).notNull(), // "SHIFT_A"
  name: varchar("name", { length: 100 }).notNull(), // "Morning Shift A"
  startTime: varchar("start_time", { length: 10 }).notNull(), // "06:00"
  endTime: varchar("end_time", { length: 10 }).notNull(),   // "14:30"
  isActive: boolean("is_active").default(true).notNull(),
});

export const assets = pgTable("assets", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }),
  plantId: uuid("plant_id").references(() => plants.id, { onDelete: "cascade" }),
  lineId: uuid("line_id").references(() => productionLines.id, { onDelete: "set null" }),
  assetId: varchar("asset_id", { length: 50 }),
  assetCode: varchar("asset_code", { length: 100 }), // "FM-001"
  name: varchar("name", { length: 255 }).notNull(),  // "Rotary Filling Machine"
  type: varchar("type", { length: 100 }),
  lineName: varchar("line_name", { length: 255 }),
  plantName: varchar("plant_name", { length: 255 }),
  criticality: varchar("criticality", { length: 100 }),
  criticalLevel: varchar("critical_level", { length: 50 }).default("CRITICAL_P1"), // "CRITICAL_P1", "IMPORTANT_P2", "NORMAL_P3"
  modelNumber: varchar("model_number", { length: 100 }),
  manufacturer: varchar("manufacturer", { length: 100 }),
  status: varchar("status", { length: 50 }).default("OPERATIONAL"),               // "OPERATIONAL", "BREAKDOWN", "MAINTENANCE"
  healthScore: integer("health_score").default(95),
  healthPercent: integer("health_percent").default(92),
  ratedSpeed: varchar("rated_speed", { length: 100 }),
  mtbfHours: numeric("mtbf_hours", { precision: 10, scale: 2 }).default("412.5"),
  mttrHours: numeric("mttr_hours", { precision: 10, scale: 2 }).default("1.8"),
  installDate: timestamp("install_date"),
  lastServiceDate: timestamp("last_service_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const staff = pgTable("staff", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  plantId: uuid("plant_id").references(() => plants.id, { onDelete: "cascade" }).notNull(),
  employeeCode: varchar("employee_code", { length: 50 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  designation: varchar("designation", { length: 100 }).notNull(),
  shiftCode: varchar("shift_code", { length: 50 }).default("SHIFT_A"),
  phone: varchar("phone", { length: 50 }),
  isAvailable: boolean("is_available").default(true).notNull(),
  certifications: jsonb("certifications").default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const qualitySpecs = pgTable("quality_specs", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }),
  skuId: uuid("sku_id").references(() => skus.id, { onDelete: "cascade" }),
  specId: varchar("spec_id", { length: 50 }).unique(),
  specificationTitle: varchar("specification_title", { length: 255 }),
  skuCode: varchar("sku_code", { length: 50 }),
  skuName: varchar("sku_name", { length: 255 }),
  parameter: varchar("parameter", { length: 255 }),
  parameterName: varchar("parameter_name", { length: 150 }),
  target: varchar("target", { length: 50 }),
  targetValue: numeric("target_value", { precision: 10, scale: 3 }),
  min: varchar("min", { length: 50 }),
  minTolerance: numeric("min_tolerance", { precision: 10, scale: 3 }),
  max: varchar("max", { length: 50 }),
  maxTolerance: numeric("max_tolerance", { precision: 10, scale: 3 }),
  uom: varchar("uom", { length: 50 }),
  criticality: varchar("criticality", { length: 100 }),
  isCCP: boolean("is_ccp").default(false),
  criticalLimit: varchar("critical_limit", { length: 255 }),
  testMethod: varchar("test_method", { length: 255 }),
  approvalStatus: varchar("approval_status", { length: 50 }).default("Draft"),
  revision: varchar("revision", { length: 50 }).default("Rev 1.0"),
  status: varchar("status", { length: 50 }).default("Active"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const routings = pgTable("routings", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  plantId: uuid("plant_id").references(() => plants.id, { onDelete: "set null" }),
  routingCode: varchar("routing_code", { length: 100 }).notNull(), // e.g. "RTG-5001-L1"
  skuId: uuid("sku_id").references(() => skus.id, { onDelete: "cascade" }).notNull(),
  lineId: uuid("line_id").references(() => productionLines.id, { onDelete: "set null" }),
  revision: varchar("revision", { length: 50 }).default("R1").notNull(),
  approvalStatus: varchar("approval_status", { length: 50 }).default("Approved").notNull(), // "Draft", "In Review", "Approved", "Obsolete"
  status: varchar("status", { length: 50 }).default("Active").notNull(), // "Active", "Inactive"
  stdRunRateBph: integer("std_run_rate_bph").default(12000).notNull(),
  setupDurationMin: integer("setup_duration_min").default(45).notNull(),
  expectedYieldPct: numeric("expected_yield_pct", { precision: 5, scale: 2 }).default("98.50").notNull(),
  effectiveFrom: timestamp("effective_from"),
  effectiveTo: timestamp("effective_to"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const routingSteps = pgTable("routing_steps", {
  id: uuid("id").defaultRandom().primaryKey(),
  routingId: uuid("routing_id").references(() => routings.id, { onDelete: "cascade" }).notNull(),
  sequence: integer("sequence").default(10).notNull(),
  operationCode: varchar("operation_code", { length: 100 }).notNull(), // "OP-10", "OP-20"
  operationName: varchar("operation_name", { length: 255 }).notNull(), // "Depalletizing & Bottle Infeed"
  workCenterId: uuid("work_center_id").references(() => workCenters.id, { onDelete: "set null" }),
  stdDurationMin: numeric("std_duration_min", { precision: 10, scale: 2 }).default("15.00"),
  setupDurationMin: numeric("setup_duration_min", { precision: 10, scale: 2 }).default("10.00"),
  crewSize: integer("crew_size").default(2),
  isQualityGate: boolean("is_quality_gate").default(false).notNull(),
  instructions: text("instructions"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const changeoverRules = pgTable("changeover_rules", {
  id: varchar("id", { length: 64 }).primaryKey(),
  matrixId: varchar("matrix_id", { length: 64 }),
  fromSkuId: varchar("from_sku_id", { length: 64 }),
  fromSkuCode: varchar("from_sku_code", { length: 64 }),
  fromFamily: varchar("from_family", { length: 128 }),
  toSkuId: varchar("to_sku_id", { length: 64 }),
  toSkuCode: varchar("to_sku_code", { length: 64 }),
  toFamily: varchar("to_family", { length: 128 }),
  changeoverDurationMin: integer("changeover_duration_min").default(30),
  sanitationClass: varchar("sanitation_class", { length: 255 }),
  allergenCleaningRequired: boolean("allergen_cleaning_required").default(false),
  notes: text("notes"),
  status: varchar("status", { length: 32 }).default("Active"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const companies = pgTable("companies", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  code: varchar("code", { length: 50 }),
  industry: varchar("industry", { length: 100 }),
  status: varchar("status", { length: 50 }).default("Active"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const departments = pgTable("departments", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }),
  code: varchar("code", { length: 50 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  managerName: varchar("manager_name", { length: 255 }),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const operations = pgTable("operations", {
  id: uuid("id").defaultRandom().primaryKey(),
  operationCode: varchar("operation_code", { length: 50 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  sequence: integer("sequence").default(10),
  department: varchar("department", { length: 100 }).default("Packaging"),
  stdDurationMin: integer("std_duration_min").default(45),
  setupDurationMin: integer("setup_duration_min").default(15),
  status: varchar("status", { length: 50 }).default("Active"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
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

export const packaging = pgTable("packaging", {
  id: uuid("id").defaultRandom().primaryKey(),
  packCode: varchar("pack_code", { length: 50 }).notNull(),
  name: varchar("name", { length: 255 }),
  skuId: varchar("sku_id", { length: 100 }),
  skuCode: varchar("sku_code", { length: 50 }),
  skuName: varchar("sku_name", { length: 255 }),
  unitsPerPack: integer("units_per_pack").default(24),
  packType: varchar("pack_type", { length: 255 }).default("Corrugated Tray & Shrink Wrap"),
  caseConfiguration: varchar("case_configuration", { length: 255 }).default("4x6 Units (24 Count)"),
  palletConfiguration: varchar("pallet_configuration", { length: 255 }).default("60 Cases / 1,440 Units per Pallet"),
  palletCount: integer("pallet_count").default(60),
  packagingUom: varchar("packaging_uom", { length: 50 }).default("CASE-24"),
  tareWeightKg: numeric("tare_weight_kg", { precision: 10, scale: 2 }).default("12.50"),
  grossWeightKg: numeric("gross_weight_kg", { precision: 10, scale: 2 }).default("12.50"),
  status: varchar("status", { length: 50 }).default("Active"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const sanitationClasses = pgTable("sanitation_classes", {
  id: uuid("id").defaultRandom().primaryKey(),
  classId: varchar("class_id", { length: 50 }),
  sanitationId: varchar("sanitation_id", { length: 50 }),
  code: varchar("code", { length: 50 }),
  name: varchar("name", { length: 255 }),
  sanitationClass: varchar("sanitation_class", { length: 255 }),
  description: text("description"),
  durationMin: integer("duration_min").default(45),
  washDurationMin: integer("wash_duration_min").default(45),
  cleaningMethod: varchar("cleaning_method", { length: 255 }),
  cleaningLevel: varchar("cleaning_level", { length: 100 }),
  riskLevel: varchar("risk_level", { length: 100 }),
  applicableProducts: text("applicable_products"),
  chemicalAgent: varchar("chemical_agent", { length: 255 }),
  validationMethod: varchar("validation_method", { length: 255 }),
  frequency: varchar("frequency", { length: 100 }),
  status: varchar("status", { length: 50 }).default("Active"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const allergenRules = pgTable("allergen_rules", {
  id: uuid("id").defaultRandom().primaryKey(),
  ruleCode: varchar("rule_code", { length: 50 }),
  allergenType: varchar("allergen_type", { length: 100 }),
  cleaningProtocol: varchar("cleaning_protocol", { length: 255 }),
  requiredDowntimeMin: integer("required_downtime_min").default(60),
  validationRequired: boolean("validation_required").default(true),
  status: varchar("status", { length: 50 }).default("Active"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const uoms = pgTable("uoms", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: varchar("code", { length: 50 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).default("Packaging"),
  type: varchar("type", { length: 100 }).default("Packaging"),
  baseUnit: varchar("base_unit", { length: 100 }).default("EA"),
  conversionFactor: numeric("conversion_factor", { precision: 10, scale: 4 }).default("1.0000"),
  status: varchar("status", { length: 50 }).default("Active"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const labourStandards = pgTable("labour_standards", {
  id: uuid("id").defaultRandom().primaryKey(),
  standardId: varchar("standard_id", { length: 50 }),
  lineId: varchar("line_id", { length: 50 }),
  lineName: varchar("line_name", { length: 255 }),
  standardCrew: integer("standard_crew").default(8),
  stdLaborHoursPer1kUnits: numeric("std_labor_hours_per_1k_units", { precision: 10, scale: 2 }).default("2.00"),
  directCostPerHour: varchar("direct_cost_per_hour", { length: 50 }).default("$25.00"),
  status: varchar("status", { length: 50 }).default("Active"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const employeeSkills = pgTable("employee_skills", {
  id: uuid("id").defaultRandom().primaryKey(),
  employeeId: varchar("employee_id", { length: 50 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  department: varchar("department", { length: 150 }).default("Production Operations").notNull(),
  departmentId: varchar("department_id", { length: 50 }),
  role: varchar("role", { length: 150 }).default("Line Operator").notNull(),
  plantId: varchar("plant_id", { length: 50 }).default("PLT-01"),
  plantName: varchar("plant_name", { length: 150 }).default("Indore Plant"),
  skillLevel: varchar("skill_level", { length: 100 }).default("Level 2 (Certified Operator)").notNull(),
  skills: jsonb("skills").default([]).notNull(),
  certifications: jsonb("certifications").default([]).notNull(),
  assignedLineIds: jsonb("assigned_line_ids").default([]).notNull(),
  status: varchar("status", { length: 50 }).default("Active").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const ccpLimits = pgTable("ccp_limits", {
  id: uuid("id").defaultRandom().primaryKey(),
  ccpNumber: varchar("ccp_number", { length: 50 }).notNull().unique(),
  processStep: varchar("process_step", { length: 255 }).notNull(),
  hazard: varchar("hazard", { length: 255 }).notNull(),
  criticalLimit: varchar("critical_limit", { length: 255 }).notNull(),
  autoDivertAction: varchar("auto_divert_action", { length: 255 }).notNull(),
  status: varchar("status", { length: 50 }).default("Critical Mandatory").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const storageResources = pgTable("storage_resources", {
  id: uuid("id").defaultRandom().primaryKey(),
  resourceId: varchar("resource_id", { length: 50 }).unique(),
  resourceCode: varchar("resource_code", { length: 50 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  resourceType: varchar("resource_type", { length: 100 }).default("Selective Pallet Rack").notNull(),
  plantId: varchar("plant_id", { length: 50 }).default("PLT-01"),
  plantName: varchar("plant_name", { length: 150 }).default("Indore Plant"),
  zone: varchar("zone", { length: 100 }).default("General Staging"),
  capacityUnit: varchar("capacity_unit", { length: 50 }).default("Pallet Positions"),
  totalCapacity: integer("total_capacity").default(500),
  capacity: varchar("capacity", { length: 100 }).default("500 Pallet Positions"),
  currentOccupancy: varchar("current_occupancy", { length: 100 }).default("0 Pallets (0%)"),
  temperatureZone: varchar("temperature_zone", { length: 100 }).default("Ambient (18°C - 24°C)"),
  status: varchar("status", { length: 50 }).default("Active").notNull(),
  effectiveFrom: varchar("effective_from", { length: 50 }).default("2025-01-01"),
  effectiveTo: varchar("effective_to", { length: 50 }).default("2030-12-31"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
