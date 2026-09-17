import { pgTable, uuid, varchar, text, timestamp, numeric, boolean, jsonb, serial, integer } from "drizzle-orm/pg-core";
import { tenants, plants } from "./tenants";
import { productionLines } from "./masterData";
import { batches, productionOrders } from "./production";
import { users } from "./users";

export const ccpChecks = pgTable("ccp_checks", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }),
  plantId: uuid("plant_id").references(() => plants.id, { onDelete: "cascade" }),
  lineId: uuid("line_id").references(() => productionLines.id, { onDelete: "cascade" }),
  batchId: uuid("batch_id").references(() => batches.id, { onDelete: "cascade" }),
  batchNumber: varchar("batch_number", { length: 100 }),
  lineName: varchar("line_name", { length: 150 }),
  operator: varchar("operator", { length: 150 }),
  equipment: varchar("equipment", { length: 150 }),
  location: varchar("location", { length: 150 }),
  testMethod: varchar("test_method", { length: 255 }),
  criticalLimit: varchar("critical_limit", { length: 255 }),
  correctiveAction: text("corrective_action"),
  ccpCode: varchar("ccp_code", { length: 50 }).notNull(), // "CCP-1", "CCP-2"
  ccpName: varchar("ccp_name", { length: 255 }).notNull(), // "Pasteurizer Thermal Kill Step (≥83.1°C)"
  targetValue: numeric("target_value", { precision: 10, scale: 3 }).notNull(),
  actualValue: numeric("actual_value", { precision: 10, scale: 3 }).notNull(),
  criticalLimitMin: numeric("critical_limit_min", { precision: 10, scale: 3 }),
  criticalLimitMax: numeric("critical_limit_max", { precision: 10, scale: 3 }),
  uom: varchar("uom", { length: 50 }).notNull(), // "°C", "mm"
  status: varchar("status", { length: 50 }).notNull(), // "PASS", "FAIL", "CORRECTIVE_ACTION_TAKEN"
  operatorId: uuid("operator_id").references(() => users.id, { onDelete: "set null" }),
  verifiedBy: uuid("verified_by").references(() => users.id, { onDelete: "set null" }),
  checkedAt: timestamp("checked_at").defaultNow().notNull(),
  notes: text("notes"),
});

export const qaReleases = pgTable("qa_releases", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  plantId: uuid("plant_id").references(() => plants.id, { onDelete: "cascade" }).notNull(),
  batchId: uuid("batch_id").references(() => batches.id, { onDelete: "cascade" }).notNull().unique(),
  disposition: varchar("disposition", { length: 50 }).notNull(), // "RELEASED", "REJECTED", "REWORK", "QUARANTINED"
  dispositionBy: uuid("disposition_by").references(() => users.id, { onDelete: "set null" }),
  digitalSignaturePinUsed: boolean("digital_signature_pin_used").default(true).notNull(),
  certificateOfAnalysisUrl: text("certificate_of_analysis_url"),
  coaMetadata: jsonb("coa_metadata").default({}),
  comments: text("comments"),
  releasedAt: timestamp("released_at").defaultNow().notNull(),
});

export const qualityHolds = pgTable("quality_holds", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }),
  plantId: uuid("plant_id").references(() => plants.id, { onDelete: "cascade" }),
  holdId: varchar("hold_id", { length: 100 }),
  batch: varchar("batch", { length: 100 }),
  lotNumber: varchar("lot_number", { length: 100 }).notNull(),
  batchId: uuid("batch_id").references(() => batches.id, { onDelete: "set null" }),
  reason: varchar("reason", { length: 255 }).notNull(),
  severity: varchar("severity", { length: 50 }).default("HIGH"),
  status: varchar("status", { length: 50 }).default("ACTIVE_HOLD").notNull(), // "ACTIVE_HOLD", "RELEASED", "DESTROYED"
  holdBy: uuid("hold_by").references(() => users.id, { onDelete: "set null" }),
  heldByName: varchar("held_by_name", { length: 150 }),
  notes: text("notes"),
  date: varchar("date", { length: 50 }),
  holdAt: timestamp("hold_at").defaultNow().notNull(),
  releasedAt: timestamp("released_at"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const deviations = pgTable("deviations", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }),
  plantId: uuid("plant_id").references(() => plants.id, { onDelete: "cascade" }),
  deviationNumber: varchar("deviation_number", { length: 100 }).notNull(), // "DEV-2026-004"
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 100 }).default("PROCESS_DEVIATION"),
  severity: varchar("severity", { length: 50 }).default("MAJOR"),
  status: varchar("status", { length: 50 }).default("UNDER_INVESTIGATION"), // "UNDER_INVESTIGATION", "CAPA_INITIATED", "CLOSED"
  holdId: varchar("hold_id", { length: 100 }),
  reportedBy: uuid("reported_by").references(() => users.id, { onDelete: "set null" }),
  reportedByName: varchar("reported_by_name", { length: 150 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const capaRecords = pgTable("capa_records", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }),
  plantId: uuid("plant_id").references(() => plants.id, { onDelete: "cascade" }),
  capaNumber: varchar("capa_number", { length: 100 }).notNull(), // "CAPA-2026-012"
  title: varchar("title", { length: 255 }).notNull(),
  invId: varchar("inv_id", { length: 100 }),
  deviationId: varchar("deviation_id", { length: 100 }),
  rootCauseMethod: varchar("root_cause_method", { length: 100 }).default("5_WHY"), // "5_WHY", "FISHBONE", "FMEA"
  rootCause: text("root_cause"),
  rootCauseAnalysis: jsonb("root_cause_analysis").default({}),
  correctiveAction: text("corrective_action").notNull(),
  preventiveAction: text("preventive_action").notNull(),
  targetCompletionDate: timestamp("target_completion_date"),
  targetDate: varchar("target_date", { length: 50 }),
  status: varchar("status", { length: 50 }).default("ACTIVE_MONITORING"), // "ACTIVE_MONITORING", "RESOLVED", "CLOSED"
  assignedTo: uuid("assigned_to").references(() => users.id, { onDelete: "set null" }),
  assignedToName: varchar("assigned_to_name", { length: 150 }).default("Dr. Rachel Thorne"),
  effectivenessRate: varchar("effectiveness_rate", { length: 50 }).default("98.5%"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const productChecks = pgTable("product_checks", {
  id: uuid("id").defaultRandom().primaryKey(),
  checkCode: varchar("check_code", { length: 50 }).notNull(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  plantId: uuid("plant_id").references(() => plants.id, { onDelete: "set null" }),
  lineId: uuid("line_id").references(() => productionLines.id, { onDelete: "set null" }),
  batchId: uuid("batch_id").references(() => batches.id, { onDelete: "set null" }),
  checkType: varchar("check_type", { length: 255 }).notNull(),
  batchNumber: varchar("batch_number", { length: 100 }),
  skuName: varchar("sku_name", { length: 150 }),
  lineName: varchar("line_name", { length: 100 }),
  targetSpec: varchar("target_spec", { length: 150 }).notNull(),
  measuredValue: varchar("measured_value", { length: 150 }).notNull(),
  status: varchar("status", { length: 50 }).default("PASS").notNull(),
  notes: text("notes"),
  checkedAt: timestamp("checked_at", { withTimezone: true }).defaultNow().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const preopChecks = pgTable("preop_checks", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }),
  plantId: uuid("plant_id").references(() => plants.id, { onDelete: "set null" }),
  lineId: uuid("line_id").references(() => productionLines.id, { onDelete: "set null" }),
  lineName: varchar("line_name", { length: 150 }),
  batchId: uuid("batch_id").references(() => batches.id, { onDelete: "set null" }),
  batchNumber: varchar("batch_number", { length: 150 }),
  category: varchar("category", { length: 150 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  spec: varchar("spec", { length: 255 }).notNull(),
  criticality: varchar("criticality", { length: 100 }).default("Critical GMP").notNull(),
  method: varchar("method", { length: 150 }),
  passed: boolean("passed"),
  notes: text("notes"),
  inspectorName: varchar("inspector_name", { length: 150 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const sanitationCipSteps = pgTable("sanitation_cip_steps", {
  id: serial("id").primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }),
  phase: varchar("phase", { length: 255 }).notNull(),
  equipment: varchar("equipment", { length: 255 }).notNull(),
  spec: text("spec").notNull(),
  chemical: varchar("chemical", { length: 255 }).notNull(),
  targetValue: varchar("target_value", { length: 255 }).notNull(),
  completed: boolean("completed"),
  logValue: text("log_value").default(""),
  stepOrder: integer("step_order").default(1),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const sanitationCipConfig = pgTable("sanitation_cip_config", {
  id: serial("id").primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }),
  loop: varchar("loop", { length: 255 }).notNull(),
  protocol: varchar("protocol", { length: 255 }).notNull(),
  operator: varchar("operator", { length: 255 }).notNull(),
  chemicalWash: varchar("chemical_wash", { length: 255 }).default("Caustic 2.5% • 81.4°C"),
  sanitizer: varchar("sanitizer", { length: 255 }).default("PAA Sanitizer: 180 ppm Target"),
  status: varchar("status", { length: 64 }).default("CYCLE IN PROGRESS"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const allergenAudits = pgTable("allergen_audits", {
  id: serial("id").primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  sku: varchar("sku", { length: 100 }),
  line: varchar("line", { length: 150 }),
  testMethod: varchar("test_method", { length: 255 }).notNull(),
  targetAllergen: varchar("target_allergen", { length: 255 }).notNull(),
  status: varchar("status", { length: 64 }).default("PENDING AUDIT"),
  auditor: varchar("auditor", { length: 150 }),
  timestampStr: varchar("timestamp_str", { length: 100 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const lineReadiness = pgTable("line_readiness", {
  id: serial("id").primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }),
  line: varchar("line", { length: 255 }).notNull(),
  lineCode: varchar("line_code", { length: 50 }).notNull(),
  safety: varchar("safety", { length: 50 }).default("PASSED"),
  sanitation: varchar("sanitation", { length: 50 }).default("PASSED"),
  mechanical: varchar("mechanical", { length: 50 }).default("PASSED"),
  status: varchar("status", { length: 50 }).default("READY"),
  speedTarget: varchar("speed_target", { length: 50 }),
  lastInspection: varchar("last_inspection", { length: 100 }).default("Just now"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const cleaningVerifications = pgTable("cleaning_verifications", {
  id: serial("id").primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }),
  verified: boolean("verified").default(false),
  atpTestResult: varchar("atp_test_result", { length: 100 }).default("4.2 RLU (PASSED)"),
  microbialResidue: varchar("microbial_residue", { length: 100 }).default("0.00% Zero Trace"),
  targetLimit: varchar("target_limit", { length: 100 }).default("<10 RLU"),
  loop: varchar("loop", { length: 255 }).default("CIP Loop 01"),
  notes: text("notes").default(""),
  verifiedAt: timestamp("verified_at", { withTimezone: true }),
  verifiedBy: varchar("verified_by", { length: 150 }).default("Dr. Rachel Thorne"),
  status: varchar("status", { length: 64 }).default("PENDING"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const processChecks = pgTable("process_checks", {
  id: serial("id").primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  parameter: varchar("parameter", { length: 255 }).notNull(),
  target: varchar("target", { length: 255 }).notNull(),
  actual: varchar("actual", { length: 255 }).notNull(),
  line: varchar("line", { length: 255 }).notNull(),
  status: varchar("status", { length: 50 }).default("OK"),
  timestampStr: varchar("timestamp_str", { length: 100 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const ncrs = pgTable("ncrs", {
  id: serial("id").primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }),
  plantId: uuid("plant_id").references(() => plants.id, { onDelete: "set null" }),
  ncrNumber: varchar("ncr_number", { length: 50 }).notNull(),
  part: varchar("part", { length: 255 }).notNull(),
  reason: text("reason").notNull(),
  severity: varchar("severity", { length: 50 }).default("HIGH"),
  status: varchar("status", { length: 50 }).default("PENDING QA REVIEW"),
  disposition: varchar("disposition", { length: 100 }).default("QUARANTINED"),
  reportedBy: varchar("reported_by", { length: 150 }).default("Dr. Rachel Thorne"),
  date: varchar("date", { length: 50 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const qualityInvestigations = pgTable("quality_investigations", {
  id: serial("id").primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }),
  plantId: uuid("plant_id").references(() => plants.id, { onDelete: "set null" }),
  invNumber: varchar("inv_number", { length: 50 }).notNull(),
  devId: varchar("dev_id", { length: 50 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  finding: text("finding").default(""),
  action: text("action").default(""),
  status: varchar("status", { length: 50 }).default("Pending"),
  leadInvestigator: varchar("lead_investigator", { length: 150 }).default("Dr. Rachel Thorne"),
  targetDate: varchar("target_date", { length: 50 }),
  rootCauseCategory: varchar("root_cause_category", { length: 100 }).default("MECHANICAL"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const batchQualityReviews = pgTable("batch_quality_reviews", {
  id: serial("id").primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }),
  plantId: uuid("plant_id").references(() => plants.id, { onDelete: "set null" }),
  batchNumber: varchar("batch_number", { length: 100 }).notNull(),
  recipeName: varchar("recipe_name", { length: 255 }).notNull(),
  currentStep: varchar("current_step", { length: 255 }).notNull(),
  stepNumber: integer("step_number").default(1),
  totalSteps: integer("total_steps").default(5),
  progressPercent: integer("progress_percent").default(0),
  line: varchar("line", { length: 150 }).default("Line 1 (Aseptic Bottling)"),
  ccpStatus: varchar("ccp_status", { length: 100 }).default("PASSED (83.5°C)"),
  qaStatus: varchar("qa_status", { length: 100 }).default("QA REVIEW IN PROGRESS"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const batchHistory = pgTable("batch_history", {
  id: serial("id").primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }),
  plantId: uuid("plant_id").references(() => plants.id, { onDelete: "set null" }),
  batchId: varchar("batch_id", { length: 100 }).notNull(),
  recipe: varchar("recipe", { length: 255 }).notNull(),
  line: varchar("line", { length: 150 }).notNull(),
  pallets: varchar("pallets", { length: 150 }).notNull(),
  date: varchar("date", { length: 50 }).notNull(),
  status: varchar("status", { length: 50 }).default("RELEASED"),
  coaUrl: varchar("coa_url", { length: 255 }).default("COA-BAT-2026-0888.pdf"),
  auditor: varchar("auditor", { length: 150 }).default("Dr. Rachel Thorne"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const batchQualityRecords = pgTable("batch_quality_records", {
  id: serial("id").primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }),
  plantId: uuid("plant_id").references(() => plants.id, { onDelete: "set null" }),
  recordId: varchar("record_id", { length: 50 }).notNull(),
  batch: varchar("batch", { length: 100 }).notNull(),
  type: varchar("type", { length: 255 }).notNull(),
  result: varchar("result", { length: 50 }).default("PASS"),
  date: varchar("date", { length: 50 }).notNull(),
  officer: varchar("officer", { length: 150 }).default("Dr. Rachel Thorne"),
  details: text("details").default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const qaReleaseQueue = pgTable("qa_release_queue", {
  id: serial("id").primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }),
  plantId: uuid("plant_id").references(() => plants.id, { onDelete: "set null" }),
  requestId: varchar("request_id", { length: 100 }).notNull(),
  batchNumber: varchar("batch_number", { length: 100 }).notNull(),
  productName: varchar("product_name", { length: 255 }).notNull(),
  lineName: varchar("line_name", { length: 150 }).notNull(),
  ccpStatus: varchar("ccp_status", { length: 100 }).default("83.5°C (PASS)"),
  brixStatus: varchar("brix_status", { length: 100 }).default("11.9°Bx (OK)"),
  allergenCheck: varchar("allergen_check", { length: 100 }).default("Allergen Clear (0 ppm)"),
  preopCheck: varchar("preop_check", { length: 100 }).default("PASSED (100% Clean)"),
  openDeviations: varchar("open_deviations", { length: 100 }).default("1 Open (DEV-802)"),
  status: varchar("status", { length: 100 }).default("AWAITING QA SIGN-OFF"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const qaApprovedReleases = pgTable("qa_approved_releases", {
  id: serial("id").primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }),
  plantId: uuid("plant_id").references(() => plants.id, { onDelete: "set null" }),
  releaseCode: varchar("release_code", { length: 100 }).notNull(),
  batchId: varchar("batch_id", { length: 100 }).notNull(),
  recipe: varchar("recipe", { length: 255 }).notNull(),
  pallets: varchar("pallets", { length: 150 }).notNull(),
  approvedBy: varchar("approved_by", { length: 150 }).notNull(),
  releaseDate: varchar("release_date", { length: 50 }).notNull(),
  status: varchar("status", { length: 50 }).default("APPROVED"),
  coaUrl: varchar("coa_url", { length: 255 }).default("COA-BAT-2026-0888.pdf"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const qaDispositionRecords = pgTable("qa_disposition_records", {
  id: serial("id").primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }),
  plantId: uuid("plant_id").references(() => plants.id, { onDelete: "set null" }),
  dispositionType: varchar("disposition_type", { length: 50 }).notNull(), // 'RELEASE', 'SCRAP', 'REWORK', 'DOWNGRADE'
  batchId: varchar("batch_id", { length: 100 }).notNull(),
  holdId: varchar("hold_id", { length: 100 }),
  lotNumber: varchar("lot_number", { length: 100 }),
  protocol: varchar("protocol", { length: 255 }),
  instructionNotes: text("instruction_notes"),
  status: varchar("status", { length: 50 }).default("COMPLETED"),
  authorizedBy: varchar("authorized_by", { length: 150 }).default("Dr. Rachel Thorne (QA Lead)"),
  authorizedAt: timestamp("authorized_at", { withTimezone: true }).defaultNow().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const qaAuditTrail = pgTable("qa_audit_trail", {
  id: serial("id").primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }),
  plantId: uuid("plant_id").references(() => plants.id, { onDelete: "set null" }),
  eventCode: varchar("event_code", { length: 100 }).notNull(),
  userName: varchar("user_name", { length: 150 }).notNull(),
  actionText: text("action_text").notNull(),
  entityType: varchar("entity_type", { length: 100 }).notNull(),
  entityId: varchar("entity_id", { length: 100 }).notNull(),
  timestampStr: varchar("timestamp_str", { length: 100 }).notNull(),
  ipAddress: varchar("ip_address", { length: 100 }).default("192.168.1.104"),
  verified: boolean("verified").default(true),
  hashSha256: varchar("hash_sha256", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const qaReports = pgTable("qa_reports", {
  id: serial("id").primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }),
  plantId: uuid("plant_id").references(() => plants.id, { onDelete: "set null" }),
  reportCode: varchar("report_code", { length: 100 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  dateStr: varchar("date_str", { length: 50 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  format: varchar("format", { length: 50 }).default("PDF / CSV"),
  status: varchar("status", { length: 50 }).default("READY"),
  recordsCount: integer("records_count").default(0),
  generatedBy: varchar("generated_by", { length: 150 }).default("System (Automated Daily)"),
  downloadUrl: varchar("download_url", { length: 255 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const qaNotifications = pgTable("qa_notifications", {
  id: serial("id").primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }),
  plantId: uuid("plant_id").references(() => plants.id, { onDelete: "set null" }),
  notifCode: varchar("notif_code", { length: 100 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  msg: text("msg").notNull(),
  timeStr: varchar("time_str", { length: 100 }).notNull(),
  path: varchar("path", { length: 255 }).notNull(),
  type: varchar("type", { length: 50 }).default("primary"),
  badge: varchar("badge", { length: 50 }).default("INFO"),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const qaProfiles = pgTable("qa_profiles", {
  id: serial("id").primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 150 }).default("Dr. Rachel Thorne"),
  role: varchar("role", { length: 150 }).default("Quality Assurance Lead"),
  badgeTitle: varchar("badge_title", { length: 150 }).default("QA SIGNATORY AUTHORITY"),
  subBadge: varchar("sub_badge", { length: 150 }).default("CCP AUDITOR"),
  initials: varchar("initials", { length: 10 }).default("RT"),
  signaturePin: varchar("signature_pin", { length: 100 }).default("9482"),
  batchesReviewed: integer("batches_reviewed").default(142),
  holdsIssued: integer("holds_issued").default(3),
  approvedReleases: integer("approved_releases").default(139),
  complianceRating: varchar("compliance_rating", { length: 50 }).default("99.4%"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const qaCertifications = pgTable("qa_certifications", {
  id: serial("id").primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }),
  profileId: integer("profile_id").references(() => qaProfiles.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  issuer: varchar("issuer", { length: 255 }).notNull(),
  validUntil: varchar("valid_until", { length: 50 }).notNull(),
  status: varchar("status", { length: 50 }).default("ACTIVE"),
  verifiedAt: timestamp("verified_at", { withTimezone: true }).defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
