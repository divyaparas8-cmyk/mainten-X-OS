"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ciReliabilityRecords = exports.ciCapexProjects = exports.ciVerifiedSolutions = exports.ciStandards = exports.ciLosses = exports.ciProjects = exports.ciCapaActions = exports.ciRcaHypotheses = exports.ciRcaEvidence = exports.ciRcaInvestigations = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const tenants_1 = require("./tenants");
// 1. RCA 2.0 Investigations
exports.ciRcaInvestigations = (0, pg_core_1.pgTable)("ci_rca_investigations", {
    id: (0, pg_core_1.varchar)("id", { length: 100 }).primaryKey(), // "RCA-2026-001"
    tenantId: (0, pg_core_1.uuid)("tenant_id").references(() => tenants_1.tenants.id, { onDelete: "cascade" }),
    plantId: (0, pg_core_1.varchar)("plant_id", { length: 100 }).default("PLT-01").notNull(),
    title: (0, pg_core_1.varchar)("title", { length: 255 }).notNull(),
    assetId: (0, pg_core_1.varchar)("asset_id", { length: 100 }).notNull(),
    assetName: (0, pg_core_1.varchar)("asset_name", { length: 255 }).notNull(),
    lineId: (0, pg_core_1.varchar)("line_id", { length: 100 }).notNull(),
    lineName: (0, pg_core_1.varchar)("line_name", { length: 255 }).notNull(),
    sourceBreakdownId: (0, pg_core_1.varchar)("source_breakdown_id", { length: 100 }),
    sourceWorkOrderId: (0, pg_core_1.varchar)("source_work_order_id", { length: 100 }),
    severity: (0, pg_core_1.varchar)("severity", { length: 50 }).default("High").notNull(), // "Critical", "High", "Medium"
    status: (0, pg_core_1.varchar)("status", { length: 100 }).default("Open").notNull(), // "Open", "In Progress", "Root Cause Validated", "Closed"
    currentPhase: (0, pg_core_1.varchar)("current_phase", { length: 100 }).default("Event").notNull(), // "Event", "Evidence", "Hypothesis & Tests", "Occurrence Cause", "Escape Cause", "CAPA", "Verification", "Closed"
    problemStatement: (0, pg_core_1.text)("problem_statement").notNull(),
    leadInvestigator: (0, pg_core_1.varchar)("lead_investigator", { length: 255 }).notNull(),
    teamMembers: (0, pg_core_1.jsonb)("team_members").default([]),
    eventDate: (0, pg_core_1.varchar)("event_date", { length: 50 }).notNull(),
    daysActive: (0, pg_core_1.integer)("days_active").default(0),
    whyTree: (0, pg_core_1.jsonb)("why_tree").default([]),
    eightD: (0, pg_core_1.jsonb)("eight_d").default({}),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow().notNull(),
});
// 2. RCA Evidence Locker
exports.ciRcaEvidence = (0, pg_core_1.pgTable)("ci_rca_evidence", {
    id: (0, pg_core_1.varchar)("id", { length: 100 }).primaryKey(), // "EVD-01"
    rcaId: (0, pg_core_1.varchar)("rca_id", { length: 100 }).notNull(),
    type: (0, pg_core_1.varchar)("type", { length: 100 }).notNull(), // "SCADA Trend", "Physical Photo", "Lab Torque Curve", "Vibration Log"
    title: (0, pg_core_1.varchar)("title", { length: 255 }).notNull(),
    details: (0, pg_core_1.text)("details").notNull(),
    fileUrl: (0, pg_core_1.text)("file_url"),
    uploadedBy: (0, pg_core_1.varchar)("uploaded_by", { length: 255 }).notNull(),
    date: (0, pg_core_1.varchar)("date", { length: 50 }).notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
// 3. RCA Hypotheses & Cause Validation
exports.ciRcaHypotheses = (0, pg_core_1.pgTable)("ci_rca_hypotheses", {
    id: (0, pg_core_1.varchar)("id", { length: 100 }).primaryKey(), // "HYP-01"
    rcaId: (0, pg_core_1.varchar)("rca_id", { length: 100 }).notNull(),
    statement: (0, pg_core_1.text)("statement").notNull(),
    testMethod: (0, pg_core_1.text)("test_method").notNull(),
    evidenceResult: (0, pg_core_1.text)("evidence_result"),
    validationStatus: (0, pg_core_1.varchar)("validation_status", { length: 100 }).default("In Progress").notNull(), // "Confirmed Root Cause", "Refuted", "In Progress"
    validatedBy: (0, pg_core_1.varchar)("validated_by", { length: 255 }),
    validatedAt: (0, pg_core_1.varchar)("validated_at", { length: 50 }),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
// 4. CAPA Action Items
exports.ciCapaActions = (0, pg_core_1.pgTable)("ci_capa_actions", {
    id: (0, pg_core_1.varchar)("id", { length: 100 }).primaryKey(), // "CAPA-2026-001"
    rcaId: (0, pg_core_1.varchar)("rca_id", { length: 100 }),
    projectId: (0, pg_core_1.varchar)("project_id", { length: 100 }),
    description: (0, pg_core_1.text)("description").notNull(),
    actionType: (0, pg_core_1.varchar)("action_type", { length: 50 }).default("Corrective").notNull(), // "Corrective", "Preventive"
    owner: (0, pg_core_1.varchar)("owner", { length: 255 }).notNull(),
    dueDate: (0, pg_core_1.varchar)("due_date", { length: 50 }).notNull(),
    priority: (0, pg_core_1.varchar)("priority", { length: 50 }).default("Medium").notNull(), // "Critical", "High", "Medium"
    status: (0, pg_core_1.varchar)("status", { length: 50 }).default("Open").notNull(), // "Open", "In Progress", "Completed", "Verified"
    completionDate: (0, pg_core_1.varchar)("completion_date", { length: 50 }),
    evidenceNotes: (0, pg_core_1.text)("evidence_notes"),
    effectivenessResult: (0, pg_core_1.text)("effectiveness_result"),
    verifiedBy: (0, pg_core_1.varchar)("verified_by", { length: 255 }),
    verifiedAt: (0, pg_core_1.varchar)("verified_at", { length: 50 }),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
// 5. Continuous Improvement Projects
exports.ciProjects = (0, pg_core_1.pgTable)("ci_projects", {
    id: (0, pg_core_1.varchar)("id", { length: 100 }).primaryKey(), // "PRJ-CI-001"
    name: (0, pg_core_1.varchar)("name", { length: 255 }).notNull(),
    type: (0, pg_core_1.varchar)("type", { length: 100 }).default("Kaizen Event").notNull(), // "DMAIC 6-Sigma", "Kaizen Event", "SMED Rapid Setup"
    plantId: (0, pg_core_1.varchar)("plant_id", { length: 100 }).default("PLT-01").notNull(),
    lineId: (0, pg_core_1.varchar)("line_id", { length: 100 }).notNull(),
    assetId: (0, pg_core_1.varchar)("asset_id", { length: 100 }),
    linkedRcaId: (0, pg_core_1.varchar)("linked_rca_id", { length: 100 }),
    sponsor: (0, pg_core_1.varchar)("sponsor", { length: 255 }).notNull(),
    owner: (0, pg_core_1.varchar)("owner", { length: 255 }).notNull(),
    startDate: (0, pg_core_1.varchar)("start_date", { length: 50 }).notNull(),
    targetDate: (0, pg_core_1.varchar)("target_date", { length: 50 }).notNull(),
    status: (0, pg_core_1.varchar)("status", { length: 100 }).default("In Progress").notNull(), // "In Progress", "Implementation", "Completed", "Closed"
    progress: (0, pg_core_1.integer)("progress").default(0).notNull(),
    baselineMetric: (0, pg_core_1.varchar)("baseline_metric", { length: 255 }).notNull(),
    targetMetric: (0, pg_core_1.varchar)("target_metric", { length: 255 }).notNull(),
    currentMetric: (0, pg_core_1.varchar)("current_metric", { length: 255 }).notNull(),
    projectedSavingsAnnual: (0, pg_core_1.numeric)("projected_savings_annual", { precision: 12, scale: 2 }).default("0.00").notNull(),
    realizedSavingsYTD: (0, pg_core_1.numeric)("realized_savings_ytd", { precision: 12, scale: 2 }).default("0.00").notNull(),
    benefitStatus: (0, pg_core_1.varchar)("benefit_status", { length: 100 }).default("Draft").notNull(), // "Draft", "Pending Verification", "Verified & Locked"
    lockedBy: (0, pg_core_1.varchar)("locked_by", { length: 255 }),
    lockedAt: (0, pg_core_1.varchar)("locked_at", { length: 50 }),
    unlockReason: (0, pg_core_1.text)("unlock_reason"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
// 6. Loss Analysis Records
exports.ciLosses = (0, pg_core_1.pgTable)("ci_losses", {
    id: (0, pg_core_1.varchar)("id", { length: 100 }).primaryKey(), // "LOSS-01"
    category: (0, pg_core_1.varchar)("category", { length: 100 }).notNull(), // "Downtime Loss", "Quality / Defect Loss", "Scrap / Rework Loss", "Yield Loss", "Production Loss"
    plantId: (0, pg_core_1.varchar)("plant_id", { length: 100 }).default("PLT-01").notNull(),
    lineId: (0, pg_core_1.varchar)("line_id", { length: 100 }).notNull(),
    assetId: (0, pg_core_1.varchar)("asset_id", { length: 100 }).notNull(),
    eventName: (0, pg_core_1.varchar)("event_name", { length: 255 }).notNull(),
    hoursLost: (0, pg_core_1.numeric)("hours_lost", { precision: 8, scale: 2 }).default("0.00").notNull(),
    unitsLost: (0, pg_core_1.integer)("units_lost").default(0).notNull(),
    financialImpactUSD: (0, pg_core_1.numeric)("financial_impact_usd", { precision: 12, scale: 2 }).default("0.00").notNull(),
    linkedRcaId: (0, pg_core_1.varchar)("linked_rca_id", { length: 100 }),
    linkedProjectId: (0, pg_core_1.varchar)("linked_project_id", { length: 100 }),
    trend: (0, pg_core_1.varchar)("trend", { length: 50 }).default("Tracked").notNull(), // "Critical", "Warning", "Tracked"
    date: (0, pg_core_1.varchar)("date", { length: 50 }).notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
// 7. Standards Library (SOP & Technical Specifications)
exports.ciStandards = (0, pg_core_1.pgTable)("ci_standards", {
    id: (0, pg_core_1.varchar)("id", { length: 100 }).primaryKey(), // "STD-ENG-001"
    title: (0, pg_core_1.varchar)("title", { length: 255 }).notNull(),
    type: (0, pg_core_1.varchar)("type", { length: 100 }).default("Controlled SOP").notNull(), // "Controlled SOP", "Engineering Spec", "HACCP Limit"
    version: (0, pg_core_1.varchar)("version", { length: 50 }).default("v1.0").notNull(),
    plantId: (0, pg_core_1.varchar)("plant_id", { length: 100 }).default("PLT-01").notNull(),
    lineId: (0, pg_core_1.varchar)("line_id", { length: 100 }),
    assetId: (0, pg_core_1.varchar)("asset_id", { length: 100 }),
    sourceProjectId: (0, pg_core_1.varchar)("source_project_id", { length: 100 }),
    sourceRcaId: (0, pg_core_1.varchar)("source_rca_id", { length: 100 }),
    owner: (0, pg_core_1.varchar)("owner", { length: 255 }).notNull(),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).default("Active").notNull(), // "Active", "Under Review", "Archived"
    effectiveDate: (0, pg_core_1.varchar)("effective_date", { length: 50 }).notNull(),
    reviewDate: (0, pg_core_1.varchar)("review_date", { length: 50 }).notNull(),
    approvedBy: (0, pg_core_1.varchar)("approved_by", { length: 255 }).notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
// 8. Verified Solutions (Knowledge Base)
exports.ciVerifiedSolutions = (0, pg_core_1.pgTable)("ci_verified_solutions", {
    id: (0, pg_core_1.varchar)("id", { length: 100 }).primaryKey(), // "VSOL-001"
    assetId: (0, pg_core_1.varchar)("asset_id", { length: 100 }).notNull(),
    assetName: (0, pg_core_1.varchar)("asset_name", { length: 255 }).notNull(),
    failureMode: (0, pg_core_1.varchar)("failure_mode", { length: 255 }).notNull(),
    symptom: (0, pg_core_1.text)("symptom").notNull(),
    rootCause: (0, pg_core_1.text)("root_cause").notNull(),
    solutionSteps: (0, pg_core_1.text)("solution_steps").notNull(),
    partsUsed: (0, pg_core_1.varchar)("parts_used", { length: 255 }),
    sourceRcaId: (0, pg_core_1.varchar)("source_rca_id", { length: 100 }),
    verifiedBy: (0, pg_core_1.varchar)("verified_by", { length: 255 }).notNull(),
    verifiedDate: (0, pg_core_1.varchar)("verified_date", { length: 50 }).notNull(),
    status: (0, pg_core_1.varchar)("status", { length: 50 }).default("Published").notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
// 9. Engineering Redesign & Capex Projects
exports.ciCapexProjects = (0, pg_core_1.pgTable)("ci_capex_projects", {
    id: (0, pg_core_1.varchar)("id", { length: 100 }).primaryKey(), // "CPX-2026-001"
    name: (0, pg_core_1.varchar)("name", { length: 255 }).notNull(),
    plantId: (0, pg_core_1.varchar)("plant_id", { length: 100 }).default("PLT-01").notNull(),
    lineId: (0, pg_core_1.varchar)("line_id", { length: 100 }).notNull(),
    assetId: (0, pg_core_1.varchar)("asset_id", { length: 100 }).notNull(),
    linkedRcaId: (0, pg_core_1.varchar)("linked_rca_id", { length: 100 }),
    linkedProjectId: (0, pg_core_1.varchar)("linked_project_id", { length: 100 }),
    budget: (0, pg_core_1.numeric)("budget", { precision: 12, scale: 2 }).default("0.00").notNull(),
    estimatedCost: (0, pg_core_1.numeric)("estimated_cost", { precision: 12, scale: 2 }).default("0.00").notNull(),
    actualCost: (0, pg_core_1.numeric)("actual_cost", { precision: 12, scale: 2 }).default("0.00").notNull(),
    engineeringJustification: (0, pg_core_1.text)("engineering_justification").notNull(),
    status: (0, pg_core_1.varchar)("status", { length: 100 }).default("Budget Approved").notNull(), // "Budget Approved", "Under Engineering Review", "Commissioned"
    owner: (0, pg_core_1.varchar)("owner", { length: 255 }).notNull(),
    targetCommissionDate: (0, pg_core_1.varchar)("target_commission_date", { length: 50 }).notNull(),
    dossierRef: (0, pg_core_1.varchar)("dossier_ref", { length: 100 }).notNull(),
    approvalStatus: (0, pg_core_1.varchar)("approval_status", { length: 100 }).default("Approved by Plant GM").notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
// 10. Reliability & Bad Actor Records
exports.ciReliabilityRecords = (0, pg_core_1.pgTable)("ci_reliability_records", {
    id: (0, pg_core_1.varchar)("id", { length: 100 }).primaryKey(), // AST-002
    assetId: (0, pg_core_1.varchar)("asset_id", { length: 100 }).notNull(),
    assetName: (0, pg_core_1.varchar)("asset_name", { length: 255 }).notNull(),
    lineId: (0, pg_core_1.varchar)("line_id", { length: 100 }).notNull(),
    lineName: (0, pg_core_1.varchar)("line_name", { length: 255 }).notNull(),
    plantId: (0, pg_core_1.varchar)("plant_id", { length: 100 }).default("PLT-01").notNull(),
    failuresCount: (0, pg_core_1.integer)("failures_count").default(0).notNull(),
    totalDowntimeMin: (0, pg_core_1.integer)("total_downtime_min").default(0).notNull(),
    mtbfHrs: (0, pg_core_1.integer)("mtbf_hrs").default(0).notNull(),
    mttrMin: (0, pg_core_1.integer)("mttr_min").default(0).notNull(),
    lastFailureDate: (0, pg_core_1.varchar)("last_failure_date", { length: 50 }).notNull(),
    failureCategory: (0, pg_core_1.varchar)("failure_category", { length: 100 }).notNull(),
    criticality: (0, pg_core_1.varchar)("criticality", { length: 50 }).default("Medium").notNull(), // "Critical", "High", "Medium"
    isBadActor: (0, pg_core_1.boolean)("is_bad_actor").default(false).notNull(),
    badActorReason: (0, pg_core_1.text)("bad_actor_reason"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
//# sourceMappingURL=ci.js.map