import { pgTable, varchar, text, timestamp, numeric, integer, boolean, uuid } from "drizzle-orm/pg-core";
import { tenants } from "./tenants.js";

// 1. Hour-by-Hour Pitch Logs (Command Center & H/B Management)
export const pmHbLogs = pgTable("pm_hb_logs", {
  id: varchar("id", { length: 100 }).primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }),
  plantId: varchar("plant_id", { length: 100 }).default("PLT-01").notNull(),
  pitchId: varchar("pitch_id", { length: 100 }).notNull(), // "PITCH-01"
  hourWindow: varchar("hour_window", { length: 100 }).notNull(), // "06:00 - 07:00"
  targetUnits: integer("target_units").notNull(),
  actualUnits: integer("actual_units").notNull(),
  delta: integer("delta").notNull(),
  cumulativeDelta: integer("cumulative_delta").notNull(),
  varianceReason: text("variance_reason"),
  correctiveAction: text("corrective_action"),
  shiftCode: varchar("shift_code", { length: 50 }).default("Shift A").notNull(),
  loggedDate: varchar("logged_date", { length: 50 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// 2. Master Production Schedule (MPS Planning)
export const pmProductionSchedules = pgTable("pm_production_schedules", {
  id: varchar("id", { length: 100 }).primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }),
  plantId: varchar("plant_id", { length: 100 }).default("PLT-01").notNull(),
  skuId: varchar("sku_id", { length: 100 }),
  skuName: varchar("sku_name", { length: 255 }).notNull(),
  lineId: varchar("line_id", { length: 100 }).notNull(),
  lineName: varchar("line_name", { length: 255 }).notNull(),
  plannedQuantity: integer("planned_quantity").notNull(),
  startTime: varchar("start_time", { length: 50 }).notNull(),
  endTime: varchar("end_time", { length: 50 }).notNull(),
  status: varchar("status", { length: 50 }).default("Scheduled").notNull(), // "Running", "Scheduled", "Completed"
  locked: boolean("locked").default(false).notNull(),
  attainmentPercent: numeric("attainment_percent", { precision: 5, scale: 2 }).default("98.50"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// 3. Line Capacity Planning
export const pmCapacityPlans = pgTable("pm_capacity_plans", {
  id: varchar("id", { length: 100 }).primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }),
  plantId: varchar("plant_id", { length: 100 }).default("PLT-01").notNull(),
  lineId: varchar("line_id", { length: 100 }).notNull(),
  lineName: varchar("line_name", { length: 255 }).notNull(),
  weekCode: varchar("week_code", { length: 50 }).notNull(), // "2026-W37"
  availableHours: numeric("available_hours", { precision: 8, scale: 2 }).notNull(),
  plannedHours: numeric("planned_hours", { precision: 8, scale: 2 }).notNull(),
  utilizationPercent: numeric("utilization_percent", { precision: 5, scale: 2 }).notNull(),
  status: varchar("status", { length: 50 }).default("Optimal").notNull(), // "Optimal", "Overloaded", "Underutilized"
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// 4. Finite Scheduling Constraints
export const pmPlanningConstraints = pgTable("pm_planning_constraints", {
  id: varchar("id", { length: 100 }).primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }),
  plantId: varchar("plant_id", { length: 100 }).default("PLT-01").notNull(),
  constraintType: varchar("constraint_type", { length: 100 }).notNull(), // "Sanitation / CIP", "Allergen Changeover", "Tooling Availability"
  ruleDescription: text("rule_description").notNull(),
  affectedLine: varchar("affected_line", { length: 100 }).notNull(),
  scheduleImpact: varchar("schedule_impact", { length: 255 }).notNull(),
  riskLevel: varchar("risk_level", { length: 50 }).default("Medium").notNull(), // "High", "Medium", "Low"
  status: varchar("status", { length: 50 }).default("Active").notNull(), // "Active", "Resolved"
  resolvedAt: timestamp("resolved_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// 5. Recovery Simulator Plans
export const pmRecoveryPlans = pgTable("pm_recovery_plans", {
  id: varchar("id", { length: 100 }).primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }),
  plantId: varchar("plant_id", { length: 100 }).default("PLT-01").notNull(),
  scenarioName: varchar("scenario_name", { length: 255 }).default("Recovery Scenario").notNull(),
  speedBoostPercent: numeric("speed_boost_percent", { precision: 5, scale: 2 }).notNull(),
  overtimeHours: numeric("overtime_hours", { precision: 5, scale: 2 }).notNull(),
  projectedRecoveryUnits: integer("projected_recovery_units").notNull(),
  feasibilityPercent: numeric("feasibility_percent", { precision: 5, scale: 2 }).notNull(),
  estimatedCostUsd: numeric("estimated_cost_usd", { precision: 10, scale: 2 }).notNull(),
  appliedAt: timestamp("applied_at", { withTimezone: true }).defaultNow().notNull(),
});

// 6. Digital Shift Handover Logs
export const pmShiftHandoffs = pgTable("pm_shift_handoffs", {
  id: varchar("id", { length: 100 }).primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }),
  plantId: varchar("plant_id", { length: 100 }).default("PLT-01").notNull(),
  shiftFrom: varchar("shift_from", { length: 50 }).notNull(),
  shiftTo: varchar("shift_to", { length: 50 }).notNull(),
  handedOverBy: varchar("handed_over_by", { length: 255 }).notNull(),
  receivedBy: varchar("received_by", { length: 255 }).notNull(),
  unitsProduced: integer("units_produced").default(0).notNull(),
  scrapUnits: integer("scrap_units").default(0).notNull(),
  notes: text("notes").notNull(),
  signatureStatus: varchar("signature_status", { length: 50 }).default("Digitally Signed").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// 7. Real-Time Machine Telemetry & Run State
export const pmMachineTelemetry = pgTable("pm_machine_telemetry", {
  id: varchar("id", { length: 100 }).primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }),
  plantId: varchar("plant_id", { length: 100 }).default("PLT-01").notNull(),
  machineCode: varchar("machine_code", { length: 100 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  lineId: varchar("line_id", { length: 100 }).notNull(),
  status: varchar("status", { length: 50 }).default("RUNNING").notNull(), // "RUNNING", "STOPPED", "CHANGEOVER", "MAINTENANCE"
  speedBph: integer("speed_bph").default(4200).notNull(),
  ratedSpeedBph: integer("rated_speed_bph").default(4500).notNull(),
  targetCount: integer("target_count").default(30000).notNull(),
  producedCount: integer("produced_count").default(28400).notNull(),
  scrapCount: integer("scrap_count").default(210).notNull(),
  runtimeHours: numeric("runtime_hours", { precision: 6, scale: 2 }).default("6.80").notNull(),
  downtimeMinutes: integer("downtime_minutes").default(18).notNull(),
  efficiencyPercent: numeric("efficiency_percent", { precision: 5, scale: 2 }).default("94.20").notNull(),
  currentOrder: varchar("current_order", { length: 100 }).default("PO-2026-001"),
  operator: varchar("operator", { length: 255 }).default("Rajesh Sharma"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// 8. Exception Control Tower Logs
export const pmExceptions = pgTable("pm_exceptions", {
  id: varchar("id", { length: 100 }).primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }),
  plantId: varchar("plant_id", { length: 100 }).default("PLT-01").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  severity: varchar("severity", { length: 50 }).notNull(), // "P1", "P2", "P3", "P4"
  category: varchar("category", { length: 100 }).notNull(), // "Equipment Stoppage", "Quality Deviation", etc.
  assetOrOrder: varchar("asset_or_order", { length: 255 }),
  impactDescription: text("impact_description").notNull(),
  owner: varchar("owner", { length: 255 }).default("Unassigned").notNull(),
  escalationLevel: varchar("escalation_level", { length: 100 }).default("L1 - Shift Supervisor").notNull(),
  status: varchar("status", { length: 50 }).default("Active").notNull(), // "Active", "In Review", "Resolved"
  resolutionNotes: text("resolution_notes"),
  resolvedAt: timestamp("resolved_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
