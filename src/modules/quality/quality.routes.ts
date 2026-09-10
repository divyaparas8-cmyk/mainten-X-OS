import { FastifyInstance } from "fastify";
import { qualityController } from "./quality.controller.js";
import { authenticate } from "../../middleware/authenticate.js";

export async function qualityRoutes(fastify: FastifyInstance) {
  fastify.addHook("preHandler", authenticate);

  fastify.get("/summary", { schema: { tags: ["Quality & QMS"], summary: "Quality Control Dashboard KPI Summary" } }, qualityController.getQualitySummary.bind(qualityController));
  fastify.get("/dashboard", { schema: { tags: ["Quality & QMS"], summary: "Quality Control Dashboard KPI Summary (Alias)" } }, qualityController.getQualitySummary.bind(qualityController));

  fastify.get("/ccp", { schema: { tags: ["Quality & QMS"], summary: "List Critical Control Point Checks" } }, qualityController.getCcpChecks.bind(qualityController));
  fastify.post("/ccp", { schema: { tags: ["Quality & QMS"], summary: "Record In-Process CCP Check (Auto PASS/FAIL)" } }, qualityController.recordCcpCheck.bind(qualityController));
  fastify.post("/ccp/export", { schema: { tags: ["Quality & QMS"], summary: "Export Critical Control Point Checks Report" } }, qualityController.exportCcpChecks.bind(qualityController));

  fastify.get("/release/queue", { schema: { tags: ["Quality & QMS"], summary: "List Batches Pending QA Release" } }, qualityController.getQaReleaseQueue.bind(qualityController));
  fastify.get("/queue", { schema: { tags: ["Quality & QMS"], summary: "List Batches Pending QA Release" } }, qualityController.getQaReleaseQueue.bind(qualityController));
  fastify.post("/release/authorize", { schema: { tags: ["Quality & QMS"], summary: "21 CFR Part 11 QA Digital Batch Release Authorization" } }, qualityController.authorizeBatchRelease.bind(qualityController));
  fastify.post("/release/export", { schema: { tags: ["Quality & QMS"], summary: "Export QA Release Queue Report" } }, qualityController.exportReleaseQueue.bind(qualityController));

  fastify.get("/holds", { schema: { tags: ["Quality & QMS"], summary: "List Quarantined / Lot Holds" } }, qualityController.getQualityHolds.bind(qualityController));
  fastify.post("/holds", { schema: { tags: ["Quality & QMS"], summary: "Place Lot on Quality Quarantine Hold" } }, qualityController.createQualityHold.bind(qualityController));
  fastify.post("/holds/export", { schema: { tags: ["Quality & QMS"], summary: "Export Quality Quarantine Holds Report" } }, qualityController.exportQualityHolds.bind(qualityController));

  fastify.get("/deviations", { schema: { tags: ["Quality & QMS"], summary: "List Quality Deviations" } }, qualityController.getDeviations.bind(qualityController));
  fastify.post("/deviations", { schema: { tags: ["Quality & QMS"], summary: "Report Quality Deviation" } }, qualityController.reportDeviation.bind(qualityController));
  fastify.post("/deviations/investigate", { schema: { tags: ["Quality & QMS"], summary: "Start Investigation from Deviation" } }, qualityController.startInvestigation.bind(qualityController));
  fastify.post("/deviations/export", { schema: { tags: ["Quality & QMS"], summary: "Export Quality Deviations Report" } }, qualityController.exportDeviations.bind(qualityController));

  fastify.get("/investigations", { schema: { tags: ["Quality & QMS"], summary: "List Quality Investigations" } }, qualityController.getInvestigations.bind(qualityController));
  fastify.post("/investigations", { schema: { tags: ["Quality & QMS"], summary: "Start Investigation" } }, qualityController.startInvestigation.bind(qualityController));
  fastify.post("/investigations/finding", { schema: { tags: ["Quality & QMS"], summary: "Add Investigation Finding" } }, qualityController.saveInvestigationFinding.bind(qualityController));
  fastify.post("/investigations/complete", { schema: { tags: ["Quality & QMS"], summary: "Complete Investigation" } }, qualityController.completeInvestigation.bind(qualityController));
  fastify.post("/investigations/export", { schema: { tags: ["Quality & QMS"], summary: "Export Quality Investigations Report" } }, qualityController.exportInvestigations.bind(qualityController));

  fastify.get("/ncr", { schema: { tags: ["Quality & QMS"], summary: "List Non-Conformance Reports" } }, qualityController.getNcrReports.bind(qualityController));
  fastify.get("/nonconformance", { schema: { tags: ["Quality & QMS"], summary: "List Non-Conformance Reports" } }, qualityController.getNcrReports.bind(qualityController));
  fastify.post("/ncr", { schema: { tags: ["Quality & QMS"], summary: "Create Non-Conformance Report" } }, qualityController.createNcrReport.bind(qualityController));
  fastify.post("/nonconformance", { schema: { tags: ["Quality & QMS"], summary: "Create Non-Conformance Report" } }, qualityController.createNcrReport.bind(qualityController));
  fastify.post("/ncr/review", { schema: { tags: ["Quality & QMS"], summary: "Review Non-Conformance Report" } }, qualityController.reviewNcrReport.bind(qualityController));
  fastify.post("/ncr/toggle", { schema: { tags: ["Quality & QMS"], summary: "Toggle Non-Conformance Status" } }, qualityController.reviewNcrReport.bind(qualityController));
  fastify.post("/ncr/export", { schema: { tags: ["Quality & QMS"], summary: "Export Non-Conformance Reports" } }, qualityController.exportNcrReports.bind(qualityController));

  fastify.post("/holds/review", { schema: { tags: ["Quality & QMS"], summary: "Review Quality Hold" } }, qualityController.reviewQualityHold.bind(qualityController));
  fastify.post("/holds/release", { schema: { tags: ["Quality & QMS"], summary: "Release Lot from Quality Hold" } }, qualityController.releaseQualityHold.bind(qualityController));

  fastify.get("/release/approved", { schema: { tags: ["Quality & QMS"], summary: "List Approved QA Releases" } }, qualityController.getApprovedReleases.bind(qualityController));
  fastify.post("/release/approved/toggle", { schema: { tags: ["Quality & QMS"], summary: "Toggle Approved QA Release Status" } }, qualityController.toggleApprovedRelease.bind(qualityController));
  fastify.post("/release/approved/export", { schema: { tags: ["Quality & QMS"], summary: "Export Approved QA Releases Archive" } }, qualityController.exportApprovedReleases.bind(qualityController));

  fastify.get("/release/blocked", { schema: { tags: ["Quality & QMS"], summary: "List Blocked / Quality Hold Batches" } }, qualityController.getBlockedBatches.bind(qualityController));
  fastify.post("/release/blocked/toggle", { schema: { tags: ["Quality & QMS"], summary: "Toggle Blocked / Quality Hold Batch Status" } }, qualityController.toggleBlockedBatch.bind(qualityController));
  fastify.post("/release/blocked/export", { schema: { tags: ["Quality & QMS"], summary: "Export Blocked / Quality Hold Batches Report" } }, qualityController.exportBlockedBatches.bind(qualityController));

  fastify.get("/disposition/release", { schema: { tags: ["Quality & QMS"], summary: "List Quarantined Batches Pending Disposition" } }, qualityController.getDispositionRelease.bind(qualityController));
  fastify.get("/disposition", { schema: { tags: ["Quality & QMS"], summary: "List Quarantined Batches Pending Disposition (Alias)" } }, qualityController.getDispositionRelease.bind(qualityController));
  fastify.post("/disposition/release", { schema: { tags: ["Quality & QMS"], summary: "Authorize QA Disposition (Release / Scrap / Rework)" } }, qualityController.authorizeDisposition.bind(qualityController));
  fastify.post("/disposition/authorize", { schema: { tags: ["Quality & QMS"], summary: "Authorize QA Disposition (Release / Scrap / Rework)" } }, qualityController.authorizeDisposition.bind(qualityController));

  fastify.get("/disposition/rework", { schema: { tags: ["Quality & QMS"], summary: "Get Rework Candidates and Protocols" } }, qualityController.getDispositionRework.bind(qualityController));
  fastify.post("/disposition/rework", { schema: { tags: ["Quality & QMS"], summary: "Authorize Batch Rework Instructions" } }, qualityController.submitReworkInstruction.bind(qualityController));

  fastify.get("/disposition/reject", { schema: { tags: ["Quality & QMS"], summary: "Get Rejection Candidates and Destruction Protocols" } }, qualityController.getDispositionReject.bind(qualityController));
  fastify.post("/disposition/reject", { schema: { tags: ["Quality & QMS"], summary: "Authorize Batch Rejection / Scrap" } }, qualityController.submitRejectAuthorization.bind(qualityController));

  fastify.get("/disposition/downgrade", { schema: { tags: ["Quality & QMS"], summary: "Get Downgrade Candidates and Target Grades" } }, qualityController.getDispositionDowngrade.bind(qualityController));
  fastify.post("/disposition/downgrade", { schema: { tags: ["Quality & QMS"], summary: "Authorize Batch Downgrade" } }, qualityController.submitDowngradeAuthorization.bind(qualityController));

  fastify.get("/batch/review", { schema: { tags: ["Quality & QMS"], summary: "List Batches for Quality Review" } }, qualityController.getBatchQualityReviews.bind(qualityController));
  fastify.post("/batch/review", { schema: { tags: ["Quality & QMS"], summary: "Review Batch Quality Dossier" } }, qualityController.reviewBatchDossier.bind(qualityController));
  fastify.post("/batch/export", { schema: { tags: ["Quality & QMS"], summary: "Export Batch Quality Dossiers Report" } }, qualityController.exportBatchReviews.bind(qualityController));

  fastify.get("/batch/history", { schema: { tags: ["Quality & QMS"], summary: "List Historical Batch Quality Logs" } }, qualityController.getBatchHistory.bind(qualityController));
  fastify.post("/batch/history/toggle", { schema: { tags: ["Quality & QMS"], summary: "Toggle Historical Batch Status" } }, qualityController.toggleBatchHistoryStatus.bind(qualityController));
  fastify.post("/batch/history/export", { schema: { tags: ["Quality & QMS"], summary: "Export Historical Batch Quality Logs Report" } }, qualityController.exportBatchHistory.bind(qualityController));

  fastify.get("/batch/records", { schema: { tags: ["Quality & QMS"], summary: "List Master Batch Quality Records" } }, qualityController.getQualityRecords.bind(qualityController));
  fastify.post("/batch/records/export", { schema: { tags: ["Quality & QMS"], summary: "Export Master Batch Quality Records Report" } }, qualityController.exportQualityRecords.bind(qualityController));

  fastify.get("/sanitation/preop", { schema: { tags: ["Quality & QMS"], summary: "Get Pre-Op Startup Checklist & Status" } }, qualityController.getPreOpChecklist.bind(qualityController));
  fastify.post("/sanitation/preop", { schema: { tags: ["Quality & QMS"], summary: "Submit Pre-Op Startup Clearance" } }, qualityController.submitPreOp.bind(qualityController));
  fastify.post("/sanitation/preop/save", { schema: { tags: ["Quality & QMS"], summary: "Save Pre-Op Startup Progress" } }, qualityController.savePreOpProgress.bind(qualityController));

  fastify.get("/sanitation/checklist", { schema: { tags: ["Quality & QMS"], summary: "Get Line Sanitation CIP Checklist" } }, qualityController.getSanitationChecklist.bind(qualityController));
  fastify.post("/sanitation/checklist", { schema: { tags: ["Quality & QMS"], summary: "Submit Line Sanitation CIP Log" } }, qualityController.submitSanitation.bind(qualityController));
  fastify.post("/sanitation/checklist/save", { schema: { tags: ["Quality & QMS"], summary: "Save Line Sanitation CIP Progress" } }, qualityController.saveSanitationProgress.bind(qualityController));

  fastify.get("/sanitation/allergen", { schema: { tags: ["Quality & QMS"], summary: "List Allergen Verification Audits" } }, qualityController.getAllergenAudits.bind(qualityController));
  fastify.post("/sanitation/allergen/audit", { schema: { tags: ["Quality & QMS"], summary: "Clear Allergen Verification Audit" } }, qualityController.clearAllergenAudit.bind(qualityController));
  fastify.post("/sanitation/allergen/clear-all", { schema: { tags: ["Quality & QMS"], summary: "Clear All Allergen Verification Audits" } }, qualityController.clearAllAllergenAudits.bind(qualityController));
  fastify.post("/sanitation/allergen/export", { schema: { tags: ["Quality & QMS"], summary: "Export Allergen Verification Audits Report" } }, qualityController.exportAllergenAudits.bind(qualityController));

  fastify.get("/sanitation/readiness", { schema: { tags: ["Quality & QMS"], summary: "List Production Line Readiness Status" } }, qualityController.getLineReadiness.bind(qualityController));
  fastify.post("/sanitation/readiness/toggle", { schema: { tags: ["Quality & QMS"], summary: "Toggle Production Line Readiness Status" } }, qualityController.toggleLineReadiness.bind(qualityController));
  fastify.post("/sanitation/readiness/authorize-all", { schema: { tags: ["Quality & QMS"], summary: "Authorize All Lines Readiness" } }, qualityController.authorizeAllLines.bind(qualityController));
  fastify.post("/sanitation/readiness/export", { schema: { tags: ["Quality & QMS"], summary: "Export Line Readiness Report" } }, qualityController.exportLineReadiness.bind(qualityController));
  fastify.get("/sanitation/verification", { schema: { tags: ["Quality & QMS"], summary: "Get Cleaning & Verification Sign-Off Status" } }, qualityController.getCleaningVerification.bind(qualityController));
  fastify.post("/sanitation/verification", { schema: { tags: ["Quality & QMS"], summary: "Sign Off Cleaning & Verification" } }, qualityController.verifyCleaning.bind(qualityController));
  fastify.post("/sanitation/verification/reset", { schema: { tags: ["Quality & QMS"], summary: "Reset Cleaning & Verification Status" } }, qualityController.resetCleaningVerification.bind(qualityController));
  fastify.post("/sanitation/cleaning/verify", { schema: { tags: ["Quality & QMS"], summary: "Sign Off CIP Cleaning Verification (Alias)" } }, qualityController.verifyCleaning.bind(qualityController));

  fastify.get("/checks/process", { schema: { tags: ["Quality & QMS"], summary: "List In-Process Checks" } }, qualityController.getProcessChecks.bind(qualityController));
  fastify.post("/checks/process", { schema: { tags: ["Quality & QMS"], summary: "Record In-Process Check" } }, qualityController.recordProcessCheck.bind(qualityController));
  fastify.post("/checks/process/toggle", { schema: { tags: ["Quality & QMS"], summary: "Toggle In-Process Check Status" } }, qualityController.toggleProcessCheck.bind(qualityController));
  fastify.post("/checks/process/calibrate-all", { schema: { tags: ["Quality & QMS"], summary: "Calibrate All In-Process Sensors" } }, qualityController.calibrateAllProcessChecks.bind(qualityController));
  fastify.post("/checks/process/export", { schema: { tags: ["Quality & QMS"], summary: "Export In-Process Checks Report" } }, qualityController.exportProcessChecks.bind(qualityController));

  fastify.get("/checks/product", { schema: { tags: ["Quality & QMS"], summary: "List Product Quality Checks" } }, qualityController.getProductChecks.bind(qualityController));
  fastify.post("/checks/product", { schema: { tags: ["Quality & QMS"], summary: "Record/Complete Product Quality Check" } }, qualityController.recordProductCheck.bind(qualityController));
  fastify.post("/checks/product/export", { schema: { tags: ["Quality & QMS"], summary: "Export Product Quality Checks Report" } }, qualityController.exportProductChecks.bind(qualityController));

  fastify.get("/specs", { schema: { tags: ["Quality & QMS"], summary: "List Product Specification Limits" } }, qualityController.getQualitySpecs.bind(qualityController));
  fastify.post("/specs", { schema: { tags: ["Quality & QMS"], summary: "Create Product Specification Limit" } }, qualityController.createQualitySpec.bind(qualityController));
  fastify.post("/specs/toggle-ccp", { schema: { tags: ["Quality & QMS"], summary: "Toggle Critical CCP Specification" } }, qualityController.toggleQualitySpecCcp.bind(qualityController));
  fastify.post("/specs/export", { schema: { tags: ["Quality & QMS"], summary: "Export Product Specifications Report" } }, qualityController.exportQualitySpecs.bind(qualityController));

  fastify.get("/capa", { schema: { tags: ["Quality & QMS"], summary: "List RCA & CAPA Records" } }, qualityController.getCapaRecords.bind(qualityController));
  fastify.get("/rca-capa", { schema: { tags: ["Quality & QMS"], summary: "List RCA & CAPA Records" } }, qualityController.getCapaRecords.bind(qualityController));
  fastify.post("/capa", { schema: { tags: ["Quality & QMS"], summary: "Create / Save RCA & CAPA Record" } }, qualityController.saveCapaRecord.bind(qualityController));
  fastify.post("/rca-capa", { schema: { tags: ["Quality & QMS"], summary: "Create / Save RCA & CAPA Record" } }, qualityController.saveCapaRecord.bind(qualityController));

  fastify.get("/audit-trail", { schema: { tags: ["Quality & QMS"], summary: "List QA Audit Trail Events" } }, qualityController.getAuditTrail.bind(qualityController));

  fastify.get("/reports", { schema: { tags: ["Quality & QMS"], summary: "List QA Compliance Reports" } }, qualityController.getReports.bind(qualityController));
  fastify.post("/reports/generate", { schema: { tags: ["Quality & QMS"], summary: "Generate / Trigger Quality Assurance Report" } }, qualityController.generateReport.bind(qualityController));

  fastify.get("/notifications", { schema: { tags: ["Quality & QMS"], summary: "List QA Alerts & Notifications" } }, qualityController.getNotifications.bind(qualityController));
  fastify.post("/notifications/read", { schema: { tags: ["Quality & QMS"], summary: "Mark QA Notification as Read" } }, qualityController.markNotificationRead.bind(qualityController));
  fastify.post("/notifications/clear", { schema: { tags: ["Quality & QMS"], summary: "Clear QA Notification" } }, qualityController.clearNotifications.bind(qualityController));

  fastify.get("/profile", { schema: { tags: ["Quality & QMS"], summary: "Get QA Lead Profile & Certifications" } }, qualityController.getQualityProfile.bind(qualityController));
  fastify.post("/profile/update", { schema: { tags: ["Quality & QMS"], summary: "Update QA Lead Profile Credentials" } }, qualityController.updateQualityProfile.bind(qualityController));
  fastify.post("/profile/verify-cert", { schema: { tags: ["Quality & QMS"], summary: "Verify QA Certification with GFSI / SQF Registry" } }, qualityController.verifyQualityCert.bind(qualityController));
}


