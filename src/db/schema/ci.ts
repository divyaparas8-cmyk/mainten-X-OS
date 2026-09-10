import { pgTable, uuid, varchar, text, timestamp, numeric, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { tenants, plants } from "./tenants";
import { assets, productionLines } from "./masterData";
import { users } from "./users";

// 1. RCA 2.0 Investigations
export const ciRcaInvestigations = pgTable("ci_rca_investigations", {
  id: varchar("id", { length: 100 }).primaryKey(), // "RCA-2026-001"
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }),
  plantId: varchar("plant_id", { length: 100 }).default("PLT-01").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  assetId: varchar("asset_id", { length: 100 }).notNull(),
  assetName: varchar("asset_name", { length: 255 }).notNull(),
  lineId: varchar("line_id", { length: 100 }).notNull(),
  lineName: varchar("line_name", { length: 255 }).notNull(),
  sourceBreakdownId: varchar("source_breakdown_id", { length: 100 }),
  sourceWorkOrderId: varchar("source_work_order_id", { length: 100 }),
  severity: varchar("severity", { length: 50 }).default("High").notNull(), // "Critical", "High", "Medium"
  status: varchar("status", { length: 100 }).default("Open").notNull(), // "Open", "In Progress", "Root Cause Validated", "Closed"
  currentPhase: varchar("current_phase", { length: 100 }).default("Event").notNull(), // "Event", "Evidence", "Hypothesis & Tests", "Occurrence Cause", "Escape Cause", "CAPA", "Verification", "Closed"
  problemStatement: text("problem_statement").notNull(),
  leadInvestigator: varchar("lead_investigator", { length: 255 }).notNull(),
  teamMembers: jsonb("team_members").default([]),
  eventDate: varchar("event_date", { length: 50 }).notNull(),
  daysActive: integer("days_active").default(0),
  whyTree: jsonb("why_tree").default([]),
  eightD: jsonb("eight_d").default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 2. RCA Evidence Locker
export const ciRcaEvidence = pgTable("ci_rca_evidence", {
  id: varchar("id", { length: 100 }).primaryKey(), // "EVD-01"
  rcaId: varchar("rca_id", { length: 100 }).notNull(),
  type: varchar("type", { length: 100 }).notNull(), // "SCADA Trend", "Physical Photo", "Lab Torque Curve", "Vibration Log"
  title: varchar("title", { length: 255 }).notNull(),
  details: text("details").notNull(),
  fileUrl: text("file_url"),
  uploadedBy: varchar("uploaded_by", { length: 255 }).notNull(),
  date: varchar("date", { length: 50 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 3. RCA Hypotheses & Cause Validation
export const ciRcaHypotheses = pgTable("ci_rca_hypotheses", {
  id: varchar("id", { length: 100 }).primaryKey(), // "HYP-01"
  rcaId: varchar("rca_id", { length: 100 }).notNull(),
  statement: text("statement").notNull(),
  testMethod: text("test_method").notNull(),
  evidenceResult: text("evidence_result"),
  validationStatus: varchar("validation_status", { length: 100 }).default("In Progress").notNull(), // "Confirmed Root Cause", "Refuted", "In Progress"
  validatedBy: varchar("validated_by", { length: 255 }),
  validatedAt: varchar("validated_at", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 4. CAPA Action Items
export const ciCapaActions = pgTable("ci_capa_actions", {
  id: varchar("id", { length: 100 }).primaryKey(), // "CAPA-2026-001"
  rcaId: varchar("rca_id", { length: 100 }),
  projectId: varchar("project_id", { length: 100 }),
  description: text("description").notNull(),
  actionType: varchar("action_type", { length: 50 }).default("Corrective").notNull(), // "Corrective", "Preventive"
  owner: varchar("owner", { length: 255 }).notNull(),
  dueDate: varchar("due_date", { length: 50 }).notNull(),
  priority: varchar("priority", { length: 50 }).default("Medium").notNull(), // "Critical", "High", "Medium"
  status: varchar("status", { length: 50 }).default("Open").notNull(), // "Open", "In Progress", "Completed", "Verified"
  completionDate: varchar("completion_date", { length: 50 }),
  evidenceNotes: text("evidence_notes"),
  effectivenessResult: text("effectiveness_result"),
  verifiedBy: varchar("verified_by", { length: 255 }),
  verifiedAt: varchar("verified_at", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 5. Continuous Improvement Projects
export const ciProjects = pgTable("ci_projects", {
  id: varchar("id", { length: 100 }).primaryKey(), // "PRJ-CI-001"
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 100 }).default("Kaizen Event").notNull(), // "DMAIC 6-Sigma", "Kaizen Event", "SMED Rapid Setup"
  plantId: varchar("plant_id", { length: 100 }).default("PLT-01").notNull(),
  lineId: varchar("line_id", { length: 100 }).notNull(),
  assetId: varchar("asset_id", { length: 100 }),
  linkedRcaId: varchar("linked_rca_id", { length: 100 }),
  sponsor: varchar("sponsor", { length: 255 }).notNull(),
  owner: varchar("owner", { length: 255 }).notNull(),
  startDate: varchar("start_date", { length: 50 }).notNull(),
  targetDate: varchar("target_date", { length: 50 }).notNull(),
  status: varchar("status", { length: 100 }).default("In Progress").notNull(), // "In Progress", "Implementation", "Completed", "Closed"
  progress: integer("progress").default(0).notNull(),
  baselineMetric: varchar("baseline_metric", { length: 255 }).notNull(),
  targetMetric: varchar("target_metric", { length: 255 }).notNull(),
  currentMetric: varchar("current_metric", { length: 255 }).notNull(),
  projectedSavingsAnnual: numeric("projected_savings_annual", { precision: 12, scale: 2 }).default("0.00").notNull(),
  realizedSavingsYTD: numeric("realized_savings_ytd", { precision: 12, scale: 2 }).default("0.00").notNull(),
  benefitStatus: varchar("benefit_status", { length: 100 }).default("Draft").notNull(), // "Draft", "Pending Verification", "Verified & Locked"
  lockedBy: varchar("locked_by", { length: 255 }),
  lockedAt: varchar("locked_at", { length: 50 }),
  unlockReason: text("unlock_reason"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 6. Loss Analysis Records
export const ciLosses = pgTable("ci_losses", {
  id: varchar("id", { length: 100 }).primaryKey(), // "LOSS-01"
  category: varchar("category", { length: 100 }).notNull(), // "Downtime Loss", "Quality / Defect Loss", "Scrap / Rework Loss", "Yield Loss", "Production Loss"
  plantId: varchar("plant_id", { length: 100 }).default("PLT-01").notNull(),
  lineId: varchar("line_id", { length: 100 }).notNull(),
  assetId: varchar("asset_id", { length: 100 }).notNull(),
  eventName: varchar("event_name", { length: 255 }).notNull(),
  hoursLost: numeric("hours_lost", { precision: 8, scale: 2 }).default("0.00").notNull(),
  unitsLost: integer("units_lost").default(0).notNull(),
  financialImpactUSD: numeric("financial_impact_usd", { precision: 12, scale: 2 }).default("0.00").notNull(),
  linkedRcaId: varchar("linked_rca_id", { length: 100 }),
  linkedProjectId: varchar("linked_project_id", { length: 100 }),
  trend: varchar("trend", { length: 50 }).default("Tracked").notNull(), // "Critical", "Warning", "Tracked"
  date: varchar("date", { length: 50 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 7. Standards Library (SOP & Technical Specifications)
export const ciStandards = pgTable("ci_standards", {
  id: varchar("id", { length: 100 }).primaryKey(), // "STD-ENG-001"
  title: varchar("title", { length: 255 }).notNull(),
  type: varchar("type", { length: 100 }).default("Controlled SOP").notNull(), // "Controlled SOP", "Engineering Spec", "HACCP Limit"
  version: varchar("version", { length: 50 }).default("v1.0").notNull(),
  plantId: varchar("plant_id", { length: 100 }).default("PLT-01").notNull(),
  lineId: varchar("line_id", { length: 100 }),
  assetId: varchar("asset_id", { length: 100 }),
  sourceProjectId: varchar("source_project_id", { length: 100 }),
  sourceRcaId: varchar("source_rca_id", { length: 100 }),
  owner: varchar("owner", { length: 255 }).notNull(),
  status: varchar("status", { length: 50 }).default("Active").notNull(), // "Active", "Under Review", "Archived"
  effectiveDate: varchar("effective_date", { length: 50 }).notNull(),
  reviewDate: varchar("review_date", { length: 50 }).notNull(),
  approvedBy: varchar("approved_by", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 8. Verified Solutions (Knowledge Base)
export const ciVerifiedSolutions = pgTable("ci_verified_solutions", {
  id: varchar("id", { length: 100 }).primaryKey(), // "VSOL-001"
  assetId: varchar("asset_id", { length: 100 }).notNull(),
  assetName: varchar("asset_name", { length: 255 }).notNull(),
  failureMode: varchar("failure_mode", { length: 255 }).notNull(),
  symptom: text("symptom").notNull(),
  rootCause: text("root_cause").notNull(),
  solutionSteps: text("solution_steps").notNull(),
  partsUsed: varchar("parts_used", { length: 255 }),
  sourceRcaId: varchar("source_rca_id", { length: 100 }),
  verifiedBy: varchar("verified_by", { length: 255 }).notNull(),
  verifiedDate: varchar("verified_date", { length: 50 }).notNull(),
  status: varchar("status", { length: 50 }).default("Published").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 9. Engineering Redesign & Capex Projects
export const ciCapexProjects = pgTable("ci_capex_projects", {
  id: varchar("id", { length: 100 }).primaryKey(), // "CPX-2026-001"
  name: varchar("name", { length: 255 }).notNull(),
  plantId: varchar("plant_id", { length: 100 }).default("PLT-01").notNull(),
  lineId: varchar("line_id", { length: 100 }).notNull(),
  assetId: varchar("asset_id", { length: 100 }).notNull(),
  linkedRcaId: varchar("linked_rca_id", { length: 100 }),
  linkedProjectId: varchar("linked_project_id", { length: 100 }),
  budget: numeric("budget", { precision: 12, scale: 2 }).default("0.00").notNull(),
  estimatedCost: numeric("estimated_cost", { precision: 12, scale: 2 }).default("0.00").notNull(),
  actualCost: numeric("actual_cost", { precision: 12, scale: 2 }).default("0.00").notNull(),
  engineeringJustification: text("engineering_justification").notNull(),
  status: varchar("status", { length: 100 }).default("Budget Approved").notNull(), // "Budget Approved", "Under Engineering Review", "Commissioned"
  owner: varchar("owner", { length: 255 }).notNull(),
  targetCommissionDate: varchar("target_commission_date", { length: 50 }).notNull(),
  dossierRef: varchar("dossier_ref", { length: 100 }).notNull(),
  approvalStatus: varchar("approval_status", { length: 100 }).default("Approved by Plant GM").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 10. Reliability & Bad Actor Records
export const ciReliabilityRecords = pgTable("ci_reliability_records", {
  id: varchar("id", { length: 100 }).primaryKey(), // AST-002
  assetId: varchar("asset_id", { length: 100 }).notNull(),
  assetName: varchar("asset_name", { length: 255 }).notNull(),
  lineId: varchar("line_id", { length: 100 }).notNull(),
  lineName: varchar("line_name", { length: 255 }).notNull(),
  plantId: varchar("plant_id", { length: 100 }).default("PLT-01").notNull(),
  failuresCount: integer("failures_count").default(0).notNull(),
  totalDowntimeMin: integer("total_downtime_min").default(0).notNull(),
  mtbfHrs: integer("mtbf_hrs").default(0).notNull(),
  mttrMin: integer("mttr_min").default(0).notNull(),
  lastFailureDate: varchar("last_failure_date", { length: 50 }).notNull(),
  failureCategory: varchar("failure_category", { length: 100 }).notNull(),
  criticality: varchar("criticality", { length: 50 }).default("Medium").notNull(), // "Critical", "High", "Medium"
  isBadActor: boolean("is_bad_actor").default(false).notNull(),
  badActorReason: text("bad_actor_reason"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
