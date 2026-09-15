"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.preopChecks = exports.productChecks = exports.capaRecords = exports.deviations = exports.qualityHolds = exports.qaReleases = exports.ccpChecks = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const tenants_1 = require("./tenants");
const masterData_1 = require("./masterData");
const production_1 = require("./production");
const users_1 = require("./users");
exports.ccpChecks = (0, pg_core_1.pgTable)("ccp_checks", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_1.tenants.id, { onDelete: "cascade" }).notNull(),
    plantId: (0, pg_core_1.uuid)("plant_id").references(() => tenants_1.plants.id, { onDelete: "cascade" }).notNull(),
    lineId: (0, pg_core_1.uuid)("line_id").references(() => masterData_1.productionLines.id, { onDelete: "cascade" }).notNull(),
    batchId: (0, pg_core_1.uuid)("batch_id").references(() => production_1.batches.id, { onDelete: "cascade" }).notNull(),
    ccpCode: (0, pg_core_1.varchar)("ccp_code", { length: 50 }).notNull(), // "CCP-1", "CCP-2"
    ccpName: (0, pg_core_1.varchar)("ccp_name", { length: 255 }).notNull(), // "Pasteurizer Thermal Kill Step (≥83.1°C)"
    targetValue: (0, pg_core_1.numeric)("target_value", { precision: 10, scale: 3 }).notNull(),
    actualValue: (0, pg_core_1.numeric)("actual_value", { precision: 10, scale: 3 }).notNull(),
    criticalLimitMin: (0, pg_core_1.numeric)("critical_limit_min", { precision: 10, scale: 3 }),
    criticalLimitMax: (0, pg_core_1.numeric)("critical_limit_max", { precision: 10, scale: 3 }),
    uom: (0, pg_core_1.varchar)("uom", { length: 50 }).notNull(), // "°C", "mm"
    status: (0, pg_core_1.varchar)("status", { length: 50 }).notNull(), // "PASS", "FAIL", "CORRECTIVE_ACTION_TAKEN"
    operatorId: (0, pg_core_1.uuid)("operator_id").references(() => users_1.users.id, { onDelete: "set null" }).notNull(),
    verifiedBy: (0, pg_core_1.uuid)("verified_by").references(() => users_1.users.id, { onDelete: "set null" }),
    checkedAt: (0, pg_core_1.timestamp)("checked_at").defaultNow().notNull(),
    notes: (0, pg_core_1.text)("notes"),
});
exports.qaReleases = (0, pg_core_1.pgTable)("qa_releases", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_1.tenants.id, { onDelete: "cascade" }).notNull(),
    plantId: (0, pg_core_1.uuid)("plant_id").references(() => tenants_1.plants.id, { onDelete: "cascade" }).notNull(),
    batchId: (0, pg_core_1.uuid)("batch_id").references(() => production_1.batches.id, { onDelete: "cascade" }).notNull().unique(),
    disposition: (0, pg_core_1.varchar)("disposition", { length: 50 }).notNull(), // "RELEASED", "REJECTED", "REWORK", "QUARANTINED"
    dispositionBy: (0, pg_core_1.uuid)("disposition_by").references(() => users_1.users.id, { onDelete: "set null" }),
    digitalSignaturePinUsed: (0, pg_core_1.boolean)("digital_signature_pin_used").default(true).notNull(),
    certificateOfAnalysisUrl: (0, pg_core_1.text)("certificate_of_analysis_url"),
    coaMetadata: (0, pg_core_1.jsonb)("coa_metadata").default({}),
    comments: (0, pg_core_1.text)("comments"),
    releasedAt: (0, pg_core_1.timestamp)("released_at").defaultNow().notNull(),
});
exports.qualityHolds = (0, pg_core_1.pgTable)("quality_holds", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_1.tenants.id, { onDelete: "cascade" }).notNull(),
    plantId: (0, pg_core_1.uuid)("plant_id").references(() => tenants_1.plants.id, { onDelete: "cascade" }).notNull(),
    lotNumber: (0, pg_core_1.varchar)("lot_number", { length: 100 }).notNull(),
    batchId: (0, pg_core_1.uuid)("batch_id").references(() => production_1.batches.id, { onDelete: "set null" }),
    reason: (0, pg_core_1.varchar)("reason", { length: 255 }).notNull(),
    severity: (0, pg_core_1.varchar)("severity", { length: 50 }).default("HIGH"),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).default("ACTIVE_HOLD").notNull(), // "ACTIVE_HOLD", "RELEASED", "DESTROYED"
    holdBy: (0, pg_core_1.uuid)("hold_by").references(() => users_1.users.id, { onDelete: "set null" }).notNull(),
    holdAt: (0, pg_core_1.timestamp)("hold_at").defaultNow().notNull(),
    releasedAt: (0, pg_core_1.timestamp)("released_at"),
});
exports.deviations = (0, pg_core_1.pgTable)("deviations", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_1.tenants.id, { onDelete: "cascade" }).notNull(),
    plantId: (0, pg_core_1.uuid)("plant_id").references(() => tenants_1.plants.id, { onDelete: "cascade" }).notNull(),
    deviationNumber: (0, pg_core_1.varchar)("deviation_number", { length: 100 }).notNull(), // "DEV-2026-004"
    title: (0, pg_core_1.varchar)("title", { length: 255 }).notNull(),
    description: (0, pg_core_1.text)("description").notNull(),
    category: (0, pg_core_1.varchar)("category", { length: 100 }).default("PROCESS_DEVIATION"),
    severity: (0, pg_core_1.varchar)("severity", { length: 50 }).default("MAJOR"),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).default("UNDER_INVESTIGATION"), // "UNDER_INVESTIGATION", "CAPA_INITIATED", "CLOSED"
    reportedBy: (0, pg_core_1.uuid)("reported_by").references(() => users_1.users.id, { onDelete: "set null" }).notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.capaRecords = (0, pg_core_1.pgTable)("capa_records", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_1.tenants.id, { onDelete: "cascade" }).notNull(),
    plantId: (0, pg_core_1.uuid)("plant_id").references(() => tenants_1.plants.id, { onDelete: "cascade" }).notNull(),
    capaNumber: (0, pg_core_1.varchar)("capa_number", { length: 100 }).notNull(), // "CAPA-2026-012"
    title: (0, pg_core_1.varchar)("title", { length: 255 }).notNull(),
    rootCauseMethod: (0, pg_core_1.varchar)("root_cause_method", { length: 100 }).default("5_WHY"), // "5_WHY", "FISHBONE", "FMEA"
    rootCauseAnalysis: (0, pg_core_1.jsonb)("root_cause_analysis").default({}),
    correctiveAction: (0, pg_core_1.text)("corrective_action").notNull(),
    preventiveAction: (0, pg_core_1.text)("preventive_action").notNull(),
    targetCompletionDate: (0, pg_core_1.timestamp)("target_completion_date").notNull(),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).default("IN_PROGRESS"), // "IN_PROGRESS", "EFFECTIVENESS_CHECK", "CLOSED"
    assignedTo: (0, pg_core_1.uuid)("assigned_to").references(() => users_1.users.id, { onDelete: "set null" }),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.productChecks = (0, pg_core_1.pgTable)("product_checks", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    checkCode: (0, pg_core_1.varchar)("check_code", { length: 50 }).notNull(),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_1.tenants.id, { onDelete: "cascade" }).notNull(),
    plantId: (0, pg_core_1.uuid)("plant_id").references(() => tenants_1.plants.id, { onDelete: "set null" }),
    lineId: (0, pg_core_1.uuid)("line_id").references(() => masterData_1.productionLines.id, { onDelete: "set null" }),
    batchId: (0, pg_core_1.uuid)("batch_id").references(() => production_1.batches.id, { onDelete: "set null" }),
    checkType: (0, pg_core_1.varchar)("check_type", { length: 255 }).notNull(),
    batchNumber: (0, pg_core_1.varchar)("batch_number", { length: 100 }),
    skuName: (0, pg_core_1.varchar)("sku_name", { length: 150 }),
    lineName: (0, pg_core_1.varchar)("line_name", { length: 100 }),
    targetSpec: (0, pg_core_1.varchar)("target_spec", { length: 150 }).notNull(),
    measuredValue: (0, pg_core_1.varchar)("measured_value", { length: 150 }).notNull(),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).default("PASS").notNull(),
    notes: (0, pg_core_1.text)("notes"),
    checkedAt: (0, pg_core_1.timestamp)("checked_at", { withTimezone: true }).defaultNow().notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true }).defaultNow().notNull(),
});
exports.preopChecks = (0, pg_core_1.pgTable)("preop_checks", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_1.tenants.id, { onDelete: "cascade" }).notNull(),
    plantId: (0, pg_core_1.uuid)("plant_id").references(() => tenants_1.plants.id, { onDelete: "set null" }),
    lineId: (0, pg_core_1.uuid)("line_id").references(() => masterData_1.productionLines.id, { onDelete: "set null" }),
    lineName: (0, pg_core_1.varchar)("line_name", { length: 150 }),
    batchId: (0, pg_core_1.uuid)("batch_id").references(() => production_1.batches.id, { onDelete: "set null" }),
    batchNumber: (0, pg_core_1.varchar)("batch_number", { length: 150 }),
    category: (0, pg_core_1.varchar)("category", { length: 150 }).notNull(),
    name: (0, pg_core_1.varchar)("name", { length: 255 }).notNull(),
    spec: (0, pg_core_1.varchar)("spec", { length: 255 }).notNull(),
    criticality: (0, pg_core_1.varchar)("criticality", { length: 100 }).default("Critical GMP").notNull(),
    method: (0, pg_core_1.varchar)("method", { length: 150 }),
    passed: (0, pg_core_1.boolean)("passed"),
    notes: (0, pg_core_1.text)("notes"),
    inspectorName: (0, pg_core_1.varchar)("inspector_name", { length: 150 }),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
//# sourceMappingURL=quality.js.map