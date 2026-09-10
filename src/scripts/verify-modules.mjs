import fs from "fs";

const raw = fs.readFileSync("src/scripts/audit-output.json", "utf8").replace(/^\uFEFF/, "");
const data = JSON.parse(raw);

// Map of table to functional module
const moduleMap = {
  // Auth & Multi-Tenancy
  tenants: "Auth & Multi-Tenancy",
  users: "Auth & RBAC",
  roles: "Auth & RBAC",
  permissions: "Auth & RBAC",
  user_roles: "Auth & RBAC",
  role_permissions: "Auth & RBAC",
  audit_logs: "Audit & Compliance",
  digital_signatures: "Audit & Compliance",

  // Master Data
  plants: "Master Data & Enterprise",
  warehouses: "Master Data & Storage",
  production_lines: "Master Data & Layout",
  work_centers: "Master Data & Layout",
  shifts: "Master Data & Labor",
  staff: "Master Data & Labor",
  product_families: "Master Data & Products",
  skus: "Master Data & Products",
  boms: "Master Data & BOM/Recipe",
  bom_items: "Master Data & BOM/Recipe",
  purchasing_vendors: "Master Data & Supply Chain",

  // Routings
  routings: "Production Routings",
  routing_steps: "Production Routings",

  // Planning & APS / MRP
  customer_orders: "Planning (Demand)",
  forecasts: "Planning (Forecasting)",
  aps_schedules: "Planning (APS Gantt)",
  mrp_requirements: "Planning (MRP Netting)",
  purchase_requisitions: "Planning (Procurement)",

  // Production Execution & MES
  production_orders: "Production (MES Execution)",
  batches: "Production (eBR Batches)",
  batch_steps: "Production (eBR 6-Step)",
  shift_logs: "Production (Shift Logging)",
  downtime_logs: "Production (Downtime & Stoppage)",

  // Plant Manager Command Center
  pm_hb_logs: "Plant Manager (H/B Execution)",
  pm_production_schedules: "Plant Manager (MPS Planning)",
  pm_capacity_plans: "Plant Manager (Capacity)",
  pm_planning_constraints: "Plant Manager (Constraints)",
  pm_recovery_plans: "Plant Manager (Recovery Sim)",
  pm_shift_handoffs: "Plant Manager (Shift Handoff)",
  pm_machine_telemetry: "Plant Manager (Live Telemetry)",
  pm_exceptions: "Plant Manager (Control Tower)",
  pm_schedules: "CMMS (Preventive Maintenance Schedules)",

  // CI / Engineering
  ci_reliability_records: "CI / Reliability & Bad Actors",
  ci_rca_investigations: "CI / RCA 5-Why & 8D",
  ci_rca_evidence: "CI / Investigation Evidence",
  ci_rca_hypotheses: "CI / Hypothesis Validation",
  ci_capa_actions: "CI / CAPA Actions",
  ci_verified_solutions: "CI / Verified Solutions",
  ci_standards: "CI / Standards & SOPs",
  ci_capex_projects: "CI / CapEx Proposals",
  ci_projects: "CI / Lean Six Sigma Projects",
  ci_losses: "CI / Six Big Losses Pareto",
  ci_ideas: "CI / Kaizen Ideas",

  // Quality (QMS)
  quality_specs: "Quality (Parameters & Specs)",
  ccp_checks: "Quality (HACCP CCP Inspection)",
  quality_holds: "Quality (Quarantine & Holds)",
  deviations: "Quality (Non-Conformance)",
  capa_records: "Quality (QMS Regulatory CAPA)",
  qa_releases: "Quality (Batch Release & CoA)",

  // Maintenance (CMMS)
  assets: "CMMS (Machinery Registry)",
  work_orders: "CMMS (Work Orders)",
  calibrations: "CMMS (Calibration Logbook)",
  spare_parts: "CMMS (MRO Spare Parts)",
  spare_consumption: "CMMS (Spare Consumption)",
  failure_codes: "CMMS (Failure Mechanisms)",

  // Warehouse, Inventory & Traceability
  location_bins: "Warehouse (Bin Storage)",
  inventory_lots: "Warehouse (Material & FG Lots)",
  inventory_transactions: "Warehouse (Stock Ledger)",
  goods_receipts: "Warehouse (Inbound Receipts)",
  shipment_orders: "Warehouse (Outbound Shipments)",
  lot_genealogies: "Traceability (Lot Genealogy)",

  // Common / System
  notifications: "Common (Alerts & Notifications)",
  exceptions: "Common (Operational Exceptions)",
  documents: "Common (Controlled Documents)",
  recall_events: "Traceability (Mock & Reg Recalls)"
};

console.log("Unmapped tables:", data.tables.filter(t => !moduleMap[t.tableName]).map(t => t.tableName));
console.log("Mapped tables count:", Object.keys(moduleMap).length);
