"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pmExceptions = exports.pmMachineTelemetry = exports.pmShiftHandoffs = exports.pmRecoveryPlans = exports.pmPlanningConstraints = exports.pmCapacityPlans = exports.pmProductionSchedules = exports.pmHbLogs = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const tenants_js_1 = require("./tenants.js");
// 1. Hour-by-Hour Pitch Logs (Command Center & H/B Management)
exports.pmHbLogs = (0, pg_core_1.pgTable)("pm_hb_logs", {
    id: (0, pg_core_1.varchar)("id", { length: 100 }).primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_js_1.tenants.id, { onDelete: "cascade" }),
    plantId: (0, pg_core_1.varchar)("plant_id", { length: 100 }).default("PLT-01").notNull(),
    pitchId: (0, pg_core_1.varchar)("pitch_id", { length: 100 }).notNull(), // "PITCH-01"
    hourWindow: (0, pg_core_1.varchar)("hour_window", { length: 100 }).notNull(), // "06:00 - 07:00"
    targetUnits: (0, pg_core_1.integer)("target_units").notNull(),
    actualUnits: (0, pg_core_1.integer)("actual_units").notNull(),
    delta: (0, pg_core_1.integer)("delta").notNull(),
    cumulativeDelta: (0, pg_core_1.integer)("cumulative_delta").notNull(),
    varianceReason: (0, pg_core_1.text)("variance_reason"),
    correctiveAction: (0, pg_core_1.text)("corrective_action"),
    shiftCode: (0, pg_core_1.varchar)("shift_code", { length: 50 }).default("Shift A").notNull(),
    loggedDate: (0, pg_core_1.varchar)("logged_date", { length: 50 }).notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
// 2. Master Production Schedule (MPS Planning)
exports.pmProductionSchedules = (0, pg_core_1.pgTable)("pm_production_schedules", {
    id: (0, pg_core_1.varchar)("id", { length: 100 }).primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_js_1.tenants.id, { onDelete: "cascade" }),
    plantId: (0, pg_core_1.varchar)("plant_id", { length: 100 }).default("PLT-01").notNull(),
    skuId: (0, pg_core_1.varchar)("sku_id", { length: 100 }),
    skuName: (0, pg_core_1.varchar)("sku_name", { length: 255 }).notNull(),
    lineId: (0, pg_core_1.varchar)("line_id", { length: 100 }).notNull(),
    lineName: (0, pg_core_1.varchar)("line_name", { length: 255 }).notNull(),
    plannedQuantity: (0, pg_core_1.integer)("planned_quantity").notNull(),
    startTime: (0, pg_core_1.varchar)("start_time", { length: 50 }).notNull(),
    endTime: (0, pg_core_1.varchar)("end_time", { length: 50 }).notNull(),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).default("Scheduled").notNull(), // "Running", "Scheduled", "Completed"
    locked: (0, pg_core_1.boolean)("locked").default(false).notNull(),
    attainmentPercent: (0, pg_core_1.numeric)("attainment_percent", { precision: 5, scale: 2 }).default("98.50"),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
// 3. Line Capacity Planning
exports.pmCapacityPlans = (0, pg_core_1.pgTable)("pm_capacity_plans", {
    id: (0, pg_core_1.varchar)("id", { length: 100 }).primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_js_1.tenants.id, { onDelete: "cascade" }),
    plantId: (0, pg_core_1.varchar)("plant_id", { length: 100 }).default("PLT-01").notNull(),
    lineId: (0, pg_core_1.varchar)("line_id", { length: 100 }).notNull(),
    lineName: (0, pg_core_1.varchar)("line_name", { length: 255 }).notNull(),
    weekCode: (0, pg_core_1.varchar)("week_code", { length: 50 }).notNull(), // "2026-W37"
    availableHours: (0, pg_core_1.numeric)("available_hours", { precision: 8, scale: 2 }).notNull(),
    plannedHours: (0, pg_core_1.numeric)("planned_hours", { precision: 8, scale: 2 }).notNull(),
    utilizationPercent: (0, pg_core_1.numeric)("utilization_percent", { precision: 5, scale: 2 }).notNull(),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).default("Optimal").notNull(), // "Optimal", "Overloaded", "Underutilized"
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true }).defaultNow().notNull(),
});
// 4. Finite Scheduling Constraints
exports.pmPlanningConstraints = (0, pg_core_1.pgTable)("pm_planning_constraints", {
    id: (0, pg_core_1.varchar)("id", { length: 100 }).primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_js_1.tenants.id, { onDelete: "cascade" }),
    plantId: (0, pg_core_1.varchar)("plant_id", { length: 100 }).default("PLT-01").notNull(),
    constraintType: (0, pg_core_1.varchar)("constraint_type", { length: 100 }).notNull(), // "Sanitation / CIP", "Allergen Changeover", "Tooling Availability"
    ruleDescription: (0, pg_core_1.text)("rule_description").notNull(),
    affectedLine: (0, pg_core_1.varchar)("affected_line", { length: 100 }).notNull(),
    scheduleImpact: (0, pg_core_1.varchar)("schedule_impact", { length: 255 }).notNull(),
    riskLevel: (0, pg_core_1.varchar)("risk_level", { length: 50 }).default("Medium").notNull(), // "High", "Medium", "Low"
    status: (0, pg_core_1.varchar)("status", { length: 50 }).default("Active").notNull(), // "Active", "Resolved"
    resolvedAt: (0, pg_core_1.timestamp)("resolved_at", { withTimezone: true }),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
// 5. Recovery Simulator Plans
exports.pmRecoveryPlans = (0, pg_core_1.pgTable)("pm_recovery_plans", {
    id: (0, pg_core_1.varchar)("id", { length: 100 }).primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_js_1.tenants.id, { onDelete: "cascade" }),
    plantId: (0, pg_core_1.varchar)("plant_id", { length: 100 }).default("PLT-01").notNull(),
    scenarioName: (0, pg_core_1.varchar)("scenario_name", { length: 255 }).default("Recovery Scenario").notNull(),
    speedBoostPercent: (0, pg_core_1.numeric)("speed_boost_percent", { precision: 5, scale: 2 }).notNull(),
    overtimeHours: (0, pg_core_1.numeric)("overtime_hours", { precision: 5, scale: 2 }).notNull(),
    projectedRecoveryUnits: (0, pg_core_1.integer)("projected_recovery_units").notNull(),
    feasibilityPercent: (0, pg_core_1.numeric)("feasibility_percent", { precision: 5, scale: 2 }).notNull(),
    estimatedCostUsd: (0, pg_core_1.numeric)("estimated_cost_usd", { precision: 10, scale: 2 }).notNull(),
    appliedAt: (0, pg_core_1.timestamp)("applied_at", { withTimezone: true }).defaultNow().notNull(),
});
// 6. Digital Shift Handover Logs
exports.pmShiftHandoffs = (0, pg_core_1.pgTable)("pm_shift_handoffs", {
    id: (0, pg_core_1.varchar)("id", { length: 100 }).primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_js_1.tenants.id, { onDelete: "cascade" }),
    plantId: (0, pg_core_1.varchar)("plant_id", { length: 100 }).default("PLT-01").notNull(),
    shiftFrom: (0, pg_core_1.varchar)("shift_from", { length: 50 }).notNull(),
    shiftTo: (0, pg_core_1.varchar)("shift_to", { length: 50 }).notNull(),
    handedOverBy: (0, pg_core_1.varchar)("handed_over_by", { length: 255 }).notNull(),
    receivedBy: (0, pg_core_1.varchar)("received_by", { length: 255 }).notNull(),
    unitsProduced: (0, pg_core_1.integer)("units_produced").default(0).notNull(),
    scrapUnits: (0, pg_core_1.integer)("scrap_units").default(0).notNull(),
    notes: (0, pg_core_1.text)("notes").notNull(),
    signatureStatus: (0, pg_core_1.varchar)("signature_status", { length: 50 }).default("Digitally Signed").notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true }).defaultNow().notNull(),
});
// 7. Real-Time Machine Telemetry & Run State
exports.pmMachineTelemetry = (0, pg_core_1.pgTable)("pm_machine_telemetry", {
    id: (0, pg_core_1.varchar)("id", { length: 100 }).primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_js_1.tenants.id, { onDelete: "cascade" }),
    plantId: (0, pg_core_1.varchar)("plant_id", { length: 100 }).default("PLT-01").notNull(),
    machineCode: (0, pg_core_1.varchar)("machine_code", { length: 100 }).notNull(),
    name: (0, pg_core_1.varchar)("name", { length: 255 }).notNull(),
    lineId: (0, pg_core_1.varchar)("line_id", { length: 100 }).notNull(),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).default("RUNNING").notNull(), // "RUNNING", "STOPPED", "CHANGEOVER", "MAINTENANCE"
    speedBph: (0, pg_core_1.integer)("speed_bph").default(4200).notNull(),
    ratedSpeedBph: (0, pg_core_1.integer)("rated_speed_bph").default(4500).notNull(),
    targetCount: (0, pg_core_1.integer)("target_count").default(30000).notNull(),
    producedCount: (0, pg_core_1.integer)("produced_count").default(28400).notNull(),
    scrapCount: (0, pg_core_1.integer)("scrap_count").default(210).notNull(),
    runtimeHours: (0, pg_core_1.numeric)("runtime_hours", { precision: 6, scale: 2 }).default("6.80").notNull(),
    downtimeMinutes: (0, pg_core_1.integer)("downtime_minutes").default(18).notNull(),
    efficiencyPercent: (0, pg_core_1.numeric)("efficiency_percent", { precision: 5, scale: 2 }).default("94.20").notNull(),
    currentOrder: (0, pg_core_1.varchar)("current_order", { length: 100 }).default("PO-2026-001"),
    operator: (0, pg_core_1.varchar)("operator", { length: 255 }).default("Rajesh Sharma"),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
// 8. Exception Control Tower Logs
exports.pmExceptions = (0, pg_core_1.pgTable)("pm_exceptions", {
    id: (0, pg_core_1.varchar)("id", { length: 100 }).primaryKey(),
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_js_1.tenants.id, { onDelete: "cascade" }),
    plantId: (0, pg_core_1.varchar)("plant_id", { length: 100 }).default("PLT-01").notNull(),
    title: (0, pg_core_1.varchar)("title", { length: 255 }).notNull(),
    severity: (0, pg_core_1.varchar)("severity", { length: 50 }).notNull(), // "P1", "P2", "P3", "P4"
    category: (0, pg_core_1.varchar)("category", { length: 100 }).notNull(), // "Equipment Stoppage", "Quality Deviation", etc.
    assetOrOrder: (0, pg_core_1.varchar)("asset_or_order", { length: 255 }),
    impactDescription: (0, pg_core_1.text)("impact_description").notNull(),
    owner: (0, pg_core_1.varchar)("owner", { length: 255 }).default("Unassigned").notNull(),
    escalationLevel: (0, pg_core_1.varchar)("escalation_level", { length: 100 }).default("L1 - Shift Supervisor").notNull(),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).default("Active").notNull(), // "Active", "In Review", "Resolved"
    resolutionNotes: (0, pg_core_1.text)("resolution_notes"),
    resolvedAt: (0, pg_core_1.timestamp)("resolved_at", { withTimezone: true }),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
//# sourceMappingURL=plantManager.js.map