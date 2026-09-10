import { FastifyInstance } from "fastify";
import { dashboardsController } from "./dashboards.controller.js";
import { authenticate } from "../../middleware/authenticate.js";

export async function dashboardsRoutes(fastify: FastifyInstance) {
  // Authentication preHandler hook
  fastify.addHook("preHandler", authenticate);

  // Plant Manager Command Center
  fastify.get("/command-center", { schema: { tags: ["Dashboards & Executive"], summary: "Get Plant Manager Command Center Overview" } }, dashboardsController.getCommandCenter.bind(dashboardsController));
  fastify.get("/kpis", { schema: { tags: ["Dashboards & Executive"], summary: "Get Executive KPI Scorecard" } }, dashboardsController.getKPIs.bind(dashboardsController));

  // ─── Line Lead Dashboard APIs ──────────────────────────────────────────────
  fastify.get("/linelead", { schema: { tags: ["Dashboards & Executive"], summary: "Get Line Lead Dashboard KPIs & Status" } }, dashboardsController.getLineLeadDashboard.bind(dashboardsController));

  fastify.get("/linelead/material-log", { schema: { tags: ["Dashboards & Executive"], summary: "Get Line Material Stock Log" } }, dashboardsController.getMaterialLog.bind(dashboardsController));

  fastify.get("/linelead/quality-log", { schema: { tags: ["Dashboards & Executive"], summary: "Get Line Quality CCP Log" } }, dashboardsController.getQualityLog.bind(dashboardsController));

  fastify.post("/linelead/quality-log/check", { schema: { tags: ["Dashboards & Executive"], summary: "Log a QA Sample Check" } }, dashboardsController.logQaSampleCheck.bind(dashboardsController));

  fastify.post("/linelead/acknowledge-microstop", { schema: { tags: ["Dashboards & Executive"], summary: "Acknowledge & Log a Micro-Stop Downtime Event" } }, dashboardsController.acknowledgeMicroStop.bind(dashboardsController));

  fastify.post("/linelead/request-stock", { schema: { tags: ["Dashboards & Executive"], summary: "Request Expedited Stock Replenishment from Warehouse" } }, dashboardsController.requestStockReplenishment.bind(dashboardsController));

  fastify.post("/linelead/propose-speedup", { schema: { tags: ["Dashboards & Executive"], summary: "Submit Line Speed-Up Proposal to Supervisor" } }, dashboardsController.proposeLineSpeedUp.bind(dashboardsController));

  // ─── H/B (Hour-by-Hour) Management Routes ───────────────────────────────────
  fastify.get("/linelead/hb-logs", { schema: { tags: ["Dashboards & Executive"], summary: "Get Shift Hour-by-Hour Logs" } }, dashboardsController.getHbLogs.bind(dashboardsController));

  fastify.post("/linelead/hb-logs", { schema: { tags: ["Dashboards & Executive"], summary: "Save New Hour Record" } }, dashboardsController.saveHbRecord.bind(dashboardsController));

  fastify.patch("/linelead/hb-logs/:id", { schema: { tags: ["Dashboards & Executive"], summary: "Update Existing Hour Record" } }, dashboardsController.updateHbRecord.bind(dashboardsController));

  fastify.post("/linelead/hb-catchup", { schema: { tags: ["Dashboards & Executive"], summary: "Recalculate Catch-Up Target" } }, dashboardsController.recalculateCatchUp.bind(dashboardsController));

  fastify.post("/linelead/hb-reconcile", { schema: { tags: ["Dashboards & Executive"], summary: "Bulk Reconcile & Submit All Shift H/B Records" } }, dashboardsController.bulkReconcileShift.bind(dashboardsController));

  // ─── Downtime & Loss Routes ──────────────────────────────────────────────────
  fastify.get("/linelead/downtime-logs", { schema: { tags: ["Dashboards & Executive"], summary: "Get Shift Downtime & Loss Logs (RCA 2.0)" } }, dashboardsController.getDowntimeLogs.bind(dashboardsController));

  fastify.post("/linelead/downtime-logs", { schema: { tags: ["Dashboards & Executive"], summary: "Log Unscheduled Machine Breakdown" } }, dashboardsController.logBreakdown.bind(dashboardsController));

  fastify.patch("/linelead/downtime-logs/:id/acknowledge", { schema: { tags: ["Dashboards & Executive"], summary: "Acknowledge Downtime Event" } }, dashboardsController.acknowledgeDowntime.bind(dashboardsController));

  fastify.post("/linelead/downtime-logs/:id/dispatch", { schema: { tags: ["Dashboards & Executive"], summary: "Dispatch Tech — Create Corrective Work Order" } }, dashboardsController.dispatchTech.bind(dashboardsController));

  // ─── Changeover Control Routes ───────────────────────────────────────────────
  fastify.get("/linelead/changeover", { schema: { tags: ["Dashboards & Executive"], summary: "Get Current Changeover Status & Checklist" } }, dashboardsController.getChangeoverStatus.bind(dashboardsController));

  fastify.post("/linelead/changeover/start", { schema: { tags: ["Dashboards & Executive"], summary: "Start Changeover Sequence" } }, dashboardsController.startChangeover.bind(dashboardsController));

  fastify.patch("/linelead/changeover/steps/:stepId/complete", { schema: { tags: ["Dashboards & Executive"], summary: "Mark Changeover Step as Complete" } }, dashboardsController.completeChangeoverStep.bind(dashboardsController));

  fastify.post("/linelead/changeover/finish", { schema: { tags: ["Dashboards & Executive"], summary: "Finish Changeover & Set Line to Running" } }, dashboardsController.finishChangeover.bind(dashboardsController));

  fastify.post("/linelead/changeover/log-delay", { schema: { tags: ["Dashboards & Executive"], summary: "Log Changeover Delay Event to Supervisor" } }, dashboardsController.logChangeoverDelay.bind(dashboardsController));

  // ─── Line Staffing Routes ──────────────────────────────────────────────────
  fastify.get("/linelead/staffing", { schema: { tags: ["Dashboards & Executive"], summary: "Get Line Staffing Roster" } }, dashboardsController.getStaffingRoster.bind(dashboardsController));

  fastify.post("/linelead/staffing/swap", { schema: { tags: ["Dashboards & Executive"], summary: "Swap Stations Between Two Operators" } }, dashboardsController.swapStaffingStations.bind(dashboardsController));

  fastify.post("/linelead/staffing/request-relief", { schema: { tags: ["Dashboards & Executive"], summary: "Request Relief Operator for Line" } }, dashboardsController.requestReliefOperator.bind(dashboardsController));

  fastify.patch("/linelead/staffing/:id/reassign", { schema: { tags: ["Dashboards & Executive"], summary: "Reassign Operator Station" } }, dashboardsController.reassignOperatorStation.bind(dashboardsController));

  fastify.post("/linelead/staffing/:id/request-replacement", { schema: { tags: ["Dashboards & Executive"], summary: "Request Replacement Operator" } }, dashboardsController.requestOperatorReplacement.bind(dashboardsController));

  // ─── Production Performance Routes ──────────────────────────────────────────
  fastify.get("/linelead/performance", { schema: { tags: ["Dashboards & Executive"], summary: "Get Line Lead Production Performance & Pace" } }, dashboardsController.getProductionPerformance.bind(dashboardsController));

  fastify.post("/linelead/performance/simulate", { schema: { tags: ["Dashboards & Executive"], summary: "Simulate Recovery Speed Pace" } }, dashboardsController.simulateRecoverySpeed.bind(dashboardsController));

  fastify.post("/linelead/performance/target-override", { schema: { tags: ["Dashboards & Executive"], summary: "Apply Production Target Override" } }, dashboardsController.applyTargetOverride.bind(dashboardsController));

  fastify.post("/linelead/performance/reset-target-override", { schema: { tags: ["Dashboards & Executive"], summary: "Reset Target Override to Standard Target" } }, dashboardsController.resetTargetOverride.bind(dashboardsController));

  // ─── Schedule Recovery Management Routes ───────────────────────────────────
  fastify.get("/linelead/recovery", { schema: { tags: ["Dashboards & Executive"], summary: "Get Schedule Recovery Status & Options" } }, dashboardsController.getRecoveryStatus.bind(dashboardsController));

  fastify.post("/linelead/recovery/countermeasures/:id/activate", { schema: { tags: ["Dashboards & Executive"], summary: "Activate Recovery Countermeasure" } }, dashboardsController.activateCountermeasure.bind(dashboardsController));

  fastify.post("/linelead/recovery/submit-proposal", { schema: { tags: ["Dashboards & Executive"], summary: "Submit Recovery Package Proposal to Supervisor" } }, dashboardsController.submitRecoveryProposal.bind(dashboardsController));

  // ─── Escalation Console Routes ─────────────────────────────────────────────
  fastify.get("/linelead/escalations", { schema: { tags: ["Dashboards & Executive"], summary: "Get Active P1 Line Escalations" } }, dashboardsController.getEscalations.bind(dashboardsController));

  fastify.post("/linelead/escalations", { schema: { tags: ["Dashboards & Executive"], summary: "Dispatch New P1 Escalation" } }, dashboardsController.dispatchEscalation.bind(dashboardsController));

  fastify.post("/linelead/escalations/:id/evidence", { schema: { tags: ["Dashboards & Executive"], summary: "Attach RCA 2.0 Evidence to Escalation" } }, dashboardsController.attachEscalationEvidence.bind(dashboardsController));

  // ─── Notification Routes ───────────────────────────────────────────────────
  fastify.get("/linelead/notifications", { schema: { tags: ["Dashboards & Executive"], summary: "Get Line Lead Notifications" } }, dashboardsController.getNotifications.bind(dashboardsController));

  fastify.patch("/linelead/notifications/mark-all-read", { schema: { tags: ["Dashboards & Executive"], summary: "Mark All Notifications as Read" } }, dashboardsController.markAllNotificationsRead.bind(dashboardsController));

  // Clear All Notifications (Static route before dynamic :id)
  fastify.delete("/linelead/notifications/clear-all", { schema: { tags: ["Dashboards & Executive"], summary: "Clear All Notifications" } }, dashboardsController.clearAllNotifications.bind(dashboardsController));

  fastify.patch("/linelead/notifications/:id/read", { schema: { tags: ["Dashboards & Executive"], summary: "Mark Notification as Read" } }, dashboardsController.markNotificationRead.bind(dashboardsController));

  fastify.delete("/linelead/notifications/:id", { schema: { tags: ["Dashboards & Executive"], summary: "Delete Notification" } }, dashboardsController.deleteNotification.bind(dashboardsController));

  // ─── Profile Routes ────────────────────────────────────────────────────────
  fastify.get("/linelead/profile", { schema: { tags: ["Dashboards & Executive"], summary: "Get Line Lead Profile Details" } }, dashboardsController.getUserProfile.bind(dashboardsController));

  fastify.put("/linelead/profile", { schema: { tags: ["Dashboards & Executive"], summary: "Update Line Lead Profile Details" } }, dashboardsController.updateUserProfile.bind(dashboardsController));

  // ─── Operator Dashboard & HMI Routes ────────────────────────────────────────
  fastify.get("/operator/dashboard", { schema: { tags: ["Dashboards & Executive"], summary: "Get Operator HMI Console & Dashboard" } }, dashboardsController.getOperatorDashboard.bind(dashboardsController));

  fastify.post("/operator/microstop", { schema: { tags: ["Dashboards & Executive"], summary: "Log Operator Micro-Stop Stoppage" } }, dashboardsController.logOperatorMicroStop.bind(dashboardsController));

  fastify.patch("/operator/jobs/:jobId/status", { schema: { tags: ["Dashboards & Executive"], summary: "Update Operator Job Status" } }, dashboardsController.updateJobStatus.bind(dashboardsController));

  // ─── Operator My Jobs Queue Routes ──────────────────────────────────────────
  fastify.get("/operator/jobs", { schema: { tags: ["Dashboards & Executive"], summary: "Get Operator Assigned Jobs Queue" } }, dashboardsController.getOperatorJobs.bind(dashboardsController));

  fastify.post("/operator/jobs/:jobId/start", { schema: { tags: ["Dashboards & Executive"], summary: "Start Operator Production Job Run" } }, dashboardsController.startOperatorJob.bind(dashboardsController));

  fastify.post("/operator/jobs/:jobId/complete", { schema: { tags: ["Dashboards & Executive"], summary: "Complete Operator Production Job" } }, dashboardsController.completeOperatorJob.bind(dashboardsController));

  // ─── Operator Work Instructions Routes ──────────────────────────────────────
  fastify.get("/operator/work-instructions", { schema: { tags: ["Dashboards & Executive"], summary: "Get Work Instructions & SOP Details" } }, dashboardsController.getWorkInstructions.bind(dashboardsController));

  fastify.post("/operator/work-instructions/acknowledge", { schema: { tags: ["Dashboards & Executive"], summary: "Acknowledge Work Instructions SOP Clearance" } }, dashboardsController.acknowledgeWorkInstructions.bind(dashboardsController));

  // ─── Operator Production Entry Routes ───────────────────────────────────────
  fastify.get("/operator/production-entry", { schema: { tags: ["Dashboards & Executive"], summary: "Get Operator Production Entry Live Status" } }, dashboardsController.getProductionEntryStatus.bind(dashboardsController));

  fastify.post("/operator/production-entry/submit-log", { schema: { tags: ["Dashboards & Executive"], summary: "Submit Hourly Production Log Entry" } }, dashboardsController.submitProductionLog.bind(dashboardsController));

  fastify.post("/operator/production-entry/log-scrap", { schema: { tags: ["Dashboards & Executive"], summary: "Log Categorized Scrap Defect Reason" } }, dashboardsController.logScrapDefect.bind(dashboardsController));

  // ─── Operator Downtime & Loss Routes ────────────────────────────────────────
  fastify.get("/operator/downtime", { schema: { tags: ["Dashboards & Executive"], summary: "Get Active Downtime Events & Loss Status" } }, dashboardsController.getOperatorDowntime.bind(dashboardsController));

  fastify.post("/operator/downtime/log-event", { schema: { tags: ["Dashboards & Executive"], summary: "Log Unplanned Downtime Stoppage Event" } }, dashboardsController.logOperatorDowntimeEvent.bind(dashboardsController));

  fastify.post("/operator/downtime/microstop", { schema: { tags: ["Dashboards & Executive"], summary: "Log Minor Micro-Stop Stoppage Reason" } }, dashboardsController.logOperatorDowntimeMicroStop.bind(dashboardsController));

  // ─── Operator Quality & CCP Checks Routes ───────────────────────────────────
  fastify.get("/operator/quality-checks", { schema: { tags: ["Dashboards & Executive"], summary: "Get Shift Quality Checks History" } }, dashboardsController.getOperatorQualityChecks.bind(dashboardsController));

  fastify.post("/operator/quality-checks/submit", { schema: { tags: ["Dashboards & Executive"], summary: "Submit Hourly Operator Quality Checklist" } }, dashboardsController.submitQualityChecklist.bind(dashboardsController));

  fastify.post("/operator/quality-checks/trigger-hold", { schema: { tags: ["Dashboards & Executive"], summary: "Trigger Quality Hold & Lock Batch" } }, dashboardsController.triggerQualityHold.bind(dashboardsController));

  // ─── Operator Material Requisition Routes ───────────────────────────────────
  fastify.get("/operator/material-request", { schema: { tags: ["Dashboards & Executive"], summary: "Get Active Material Requisitions" } }, dashboardsController.getOperatorMaterialRequests.bind(dashboardsController));

  fastify.post("/operator/material-request/call-runner", { schema: { tags: ["Dashboards & Executive"], summary: "Ping Warehouse Staging Kitting Runner" } }, dashboardsController.callWarehouseRunner.bind(dashboardsController));

  fastify.post("/operator/material-request/submit-requisition", { schema: { tags: ["Dashboards & Executive"], summary: "Submit Line Material Requisition" } }, dashboardsController.submitMaterialRequisition.bind(dashboardsController));

  fastify.post("/operator/material-request/:id/confirm-receipt", { schema: { tags: ["Dashboards & Executive"], summary: "Confirm Material Receipt at Line" } }, dashboardsController.confirmMaterialReceipt.bind(dashboardsController));

  // ─── Operator Barcode & QR Scan Routes ──────────────────────────────────────
  fastify.get("/operator/barcode-scan", { schema: { tags: ["Dashboards & Executive"], summary: "Get Barcode Scanner Status & Config" } }, dashboardsController.getBarcodeScanStatus.bind(dashboardsController));
  fastify.post("/operator/barcode-scan/parse", { schema: { tags: ["Dashboards & Executive"], summary: "Parse Barcode / QR Code GS1 Standard" } }, dashboardsController.parseBarcode.bind(dashboardsController));

  fastify.post("/operator/barcode-scan/attach-lot", { schema: { tags: ["Dashboards & Executive"], summary: "Attach Scanned Lot Tag to Active Batch" } }, dashboardsController.attachLotToBatch.bind(dashboardsController));

  // ─── Operator Report Issue & Safety Exception Routes ───────────────────────
  fastify.get("/operator/report-issue", { schema: { tags: ["Dashboards & Executive"], summary: "Get Report Issue Categories & Active Hazards" } }, dashboardsController.getReportIssueStatus.bind(dashboardsController));
  fastify.post("/operator/report-issue/submit", { schema: { tags: ["Dashboards & Executive"], summary: "Log Operational Issue / Safety Exception Ticket" } }, dashboardsController.submitReportIssue.bind(dashboardsController));

  fastify.post("/operator/report-issue/emergency-call", { schema: { tags: ["Dashboards & Executive"], summary: "Trigger Priority P1 Emergency Maintenance Broadcast" } }, dashboardsController.triggerEmergencyCall.bind(dashboardsController));

  // ─── Operator Shift Handoff Routes ─────────────────────────────────────────
  fastify.get("/operator/shift-handoff", { schema: { tags: ["Dashboards & Executive"], summary: "Get Operator Shift Handoff Logs" } }, dashboardsController.getShiftHandoffs.bind(dashboardsController));

  fastify.post("/operator/shift-handoff/submit", { schema: { tags: ["Dashboards & Executive"], summary: "Submit Operator Shift Handoff & Lock Session" } }, dashboardsController.submitShiftHandoff.bind(dashboardsController));

  // ─── Operator Notifications Routes ────────────────────────────────────────
  fastify.get("/operator/notifications", { schema: { tags: ["Dashboards & Executive"], summary: "Get Operator Notifications" } }, dashboardsController.getOperatorNotifications.bind(dashboardsController));

  fastify.post("/operator/notifications/:id/read", { schema: { tags: ["Dashboards & Executive"], summary: "Mark Operator Notification as Read" } }, dashboardsController.markOperatorNotificationRead.bind(dashboardsController));

  fastify.post("/operator/notifications/read-all", { schema: { tags: ["Dashboards & Executive"], summary: "Mark All Operator Notifications as Read" } }, dashboardsController.markAllOperatorNotificationsRead.bind(dashboardsController));

  fastify.delete("/operator/notifications/:id", { schema: { tags: ["Dashboards & Executive"], summary: "Delete Operator Notification" } }, dashboardsController.deleteOperatorNotification.bind(dashboardsController));

  fastify.delete("/operator/notifications/clear-all", { schema: { tags: ["Dashboards & Executive"], summary: "Clear All Operator Notifications" } }, dashboardsController.clearAllOperatorNotifications.bind(dashboardsController));

  // ─── Operator Profile Routes ───────────────────────────────────────────────
  fastify.get("/operator/profile", { schema: { tags: ["Dashboards & Executive"], summary: "Get Operator Profile & Certifications" } }, dashboardsController.getOperatorProfile.bind(dashboardsController));

  fastify.put("/operator/profile", { schema: { tags: ["Dashboards & Executive"], summary: "Update Operator Profile Information" } }, dashboardsController.updateOperatorProfile.bind(dashboardsController));

  // ─── Operations Supervisor Routes ──────────────────────────────────────────
  fastify.get("/supervisor/dashboard", { schema: { tags: ["Dashboards & Executive"], summary: "Get Supervisor Dashboard Telemetry" } }, dashboardsController.getSupervisorDashboard.bind(dashboardsController));

  fastify.post("/supervisor/authorize-shift", { schema: { tags: ["Dashboards & Executive"], summary: "Authorize Department Shift Start" } }, dashboardsController.authorizeSupervisorShift.bind(dashboardsController));

  fastify.get("/supervisor/dept-schedule", { schema: { tags: ["Dashboards & Executive"], summary: "Get Department Run Schedules" } }, dashboardsController.getSupervisorDeptSchedule.bind(dashboardsController));

  fastify.post("/supervisor/dept-schedule/resequence", { schema: { tags: ["Dashboards & Executive"], summary: "Request APS Re-sequence" } }, dashboardsController.resequenceSupervisorDeptSchedule.bind(dashboardsController));

  fastify.post("/supervisor/dept-schedule/:id/authorize", { schema: { tags: ["Dashboards & Executive"], summary: "Authorize Schedule Run" } }, dashboardsController.authorizeSupervisorDeptSchedule.bind(dashboardsController));

  fastify.post("/supervisor/dept-schedule/:id/pause", { schema: { tags: ["Dashboards & Executive"], summary: "Pause Schedule Run" } }, dashboardsController.pauseSupervisorDeptSchedule.bind(dashboardsController));

  fastify.post("/supervisor/dept-schedule/:id/resume", { schema: { tags: ["Dashboards & Executive"], summary: "Resume Schedule Run" } }, dashboardsController.resumeSupervisorDeptSchedule.bind(dashboardsController));

  fastify.get("/supervisor/workforce", { schema: { tags: ["Dashboards & Executive"], summary: "Get Workforce Employee Directory" } }, dashboardsController.getSupervisorWorkforce.bind(dashboardsController));

  fastify.post("/supervisor/workforce", { schema: { tags: ["Dashboards & Executive"], summary: "Register New Factory Employee" } }, dashboardsController.addSupervisorWorkforceEmployee.bind(dashboardsController));

  fastify.put("/supervisor/workforce/:id", { schema: { tags: ["Dashboards & Executive"], summary: "Update Employee Record" } }, dashboardsController.updateSupervisorWorkforceEmployee.bind(dashboardsController));

  fastify.post("/supervisor/workforce/:id/assign-skill", { schema: { tags: ["Dashboards & Executive"], summary: "Assign Machine Skill to Employee" } }, dashboardsController.assignSupervisorWorkforceSkill.bind(dashboardsController));

  fastify.post("/supervisor/workforce/:id/assign-training", { schema: { tags: ["Dashboards & Executive"], summary: "Assign Training Program to Employee" } }, dashboardsController.assignSupervisorWorkforceTraining.bind(dashboardsController));

  // ─── Operations Supervisor Labour Time & Allocations ───────────────────────
  fastify.get("/supervisor/labour/time", { schema: { tags: ["Dashboards & Executive"], summary: "Get Supervisor Labour Time Allocations" } }, dashboardsController.getSupervisorLabourTime.bind(dashboardsController));

  fastify.post("/supervisor/labour/authorize-overtime", { schema: { tags: ["Dashboards & Executive"], summary: "Authorize Shift Overtime" } }, dashboardsController.authorizeSupervisorOvertime.bind(dashboardsController));

  fastify.post("/supervisor/labour/rebalance-crew", { schema: { tags: ["Dashboards & Executive"], summary: "Rebalance Crew Allocation" } }, dashboardsController.rebalanceSupervisorCrew.bind(dashboardsController));

  // ─── Operations Supervisor Live H/B Management ─────────────────────────────
  fastify.get("/supervisor/hb-management", { schema: { tags: ["Dashboards & Executive"], summary: "Get Live H/B Records" } }, dashboardsController.getSupervisorLiveHB.bind(dashboardsController));

  fastify.post("/supervisor/hb-management", { schema: { tags: ["Dashboards & Executive"], summary: "Log Hourly Headcount Record" } }, dashboardsController.logSupervisorHB.bind(dashboardsController));

  fastify.post("/supervisor/hb-management/dispatch-backup", { schema: { tags: ["Dashboards & Executive"], summary: "Dispatch Backup Operator" } }, dashboardsController.dispatchSupervisorHBBackup.bind(dashboardsController));

  // ─── Operations Supervisor Skills & Qualification Matrix ────────────────────
  fastify.get("/supervisor/labour/skills", { schema: { tags: ["Dashboards & Executive"], summary: "Get Skills & Qualification Matrix" } }, dashboardsController.getSupervisorSkills.bind(dashboardsController));

  fastify.post("/supervisor/labour/skills", { schema: { tags: ["Dashboards & Executive"], summary: "Add Skill Record" } }, dashboardsController.addSupervisorSkill.bind(dashboardsController));

  fastify.put("/supervisor/labour/skills/:id", { schema: { tags: ["Dashboards & Executive"], summary: "Update Machine Qualification Level" } }, dashboardsController.updateSupervisorSkillLevel.bind(dashboardsController));

  // ─── Operations Supervisor Training & Certifications ───────────────────────
  fastify.get("/supervisor/labour/training", { schema: { tags: ["Dashboards & Executive"], summary: "Get Training Records" } }, dashboardsController.getSupervisorTraining.bind(dashboardsController));

  fastify.post("/supervisor/labour/training", { schema: { tags: ["Dashboards & Executive"], summary: "Enroll in Training Program" } }, dashboardsController.addSupervisorTraining.bind(dashboardsController));

  fastify.post("/supervisor/labour/training/:id/complete", { schema: { tags: ["Dashboards & Executive"], summary: "Mark Training Completed" } }, dashboardsController.completeSupervisorTraining.bind(dashboardsController));

  // ─── Operations Supervisor Labour Productivity ──────────────────────────────
  fastify.get("/supervisor/labour/productivity", { schema: { tags: ["Dashboards & Executive"], summary: "Get Labour Productivity Metrics" } }, dashboardsController.getSupervisorProductivity.bind(dashboardsController));

  // ─── Operations Supervisor Shift Management & Rostering ────────────────────
  fastify.get("/supervisor/labour/staffing", { schema: { tags: ["Dashboards & Executive"], summary: "Get Shift Rosters" } }, dashboardsController.getSupervisorStaffing.bind(dashboardsController));

  fastify.post("/supervisor/labour/staffing", { schema: { tags: ["Dashboards & Executive"], summary: "Create Shift Roster" } }, dashboardsController.addSupervisorStaffing.bind(dashboardsController));

  fastify.put("/supervisor/labour/staffing/:id", { schema: { tags: ["Dashboards & Executive"], summary: "Update Shift Roster" } }, dashboardsController.updateSupervisorStaffing.bind(dashboardsController));

  fastify.post("/supervisor/labour/staffing/:id/assign-personnel", { schema: { tags: ["Dashboards & Executive"], summary: "Assign Personnel to Shift" } }, dashboardsController.assignSupervisorStaffingPersonnel.bind(dashboardsController));

  fastify.post("/supervisor/labour/staffing/:id/assign-station", { schema: { tags: ["Dashboards & Executive"], summary: "Assign Station to Operator" } }, dashboardsController.assignSupervisorStaffingStation.bind(dashboardsController));

  fastify.post("/supervisor/labour/staffing/:id/close-shift", { schema: { tags: ["Dashboards & Executive"], summary: "Close Out Shift" } }, dashboardsController.closeSupervisorStaffingShift.bind(dashboardsController));

  // ─── Operations Supervisor Production Performance ──────────────────────────
  fastify.post("/supervisor/production/performance/speed-limit", { schema: { tags: ["Dashboards & Executive"], summary: "Set Speed Limit" } }, dashboardsController.setSupervisorProductionSpeedLimit.bind(dashboardsController));

  fastify.get("/supervisor/production/performance/downtime-pareto", { schema: { tags: ["Dashboards & Executive"], summary: "Get Downtime Pareto" } }, dashboardsController.getSupervisorDowntimePareto.bind(dashboardsController));

  // ─── Operations Supervisor Quality Quarantine Holds ─────────────────────────
  fastify.get("/supervisor/quality/holds", { schema: { tags: ["Dashboards & Executive"], summary: "Get Active Holds" } }, dashboardsController.getSupervisorHolds.bind(dashboardsController));

  fastify.post("/supervisor/quality/holds/:id/note", { schema: { tags: ["Dashboards & Executive"], summary: "Add Investigation Note" } }, dashboardsController.addSupervisorHoldNote.bind(dashboardsController));

  fastify.post("/supervisor/quality/holds/:id/request-rework", { schema: { tags: ["Dashboards & Executive"], summary: "Request Rework Loop" } }, dashboardsController.requestSupervisorHoldRework.bind(dashboardsController));

  fastify.post("/supervisor/quality/holds/:id/authorize-release", { schema: { tags: ["Dashboards & Executive"], summary: "Authorize Release" } }, dashboardsController.authorizeSupervisorHoldRelease.bind(dashboardsController));

  fastify.delete("/supervisor/quality/holds/:id/scrap", { schema: { tags: ["Dashboards & Executive"], summary: "Scrap Batch" } }, dashboardsController.scrapSupervisorHoldBatch.bind(dashboardsController));

  // ─── Operations Supervisor Departmental Recovery Steering ─────────────────
  fastify.get("/supervisor/recovery", { schema: { tags: ["Dashboards & Executive"], summary: "Get Recovery Steering" } }, dashboardsController.getSupervisorRecoveryCountermeasures.bind(dashboardsController));
  fastify.get("/supervisor/recovery/countermeasures", { schema: { tags: ["Dashboards & Executive"], summary: "Get Countermeasures" } }, dashboardsController.getSupervisorRecoveryCountermeasures.bind(dashboardsController));

  fastify.post("/supervisor/recovery/countermeasures/:id/authorize", { schema: { tags: ["Dashboards & Executive"], summary: "Authorize Countermeasure" } }, dashboardsController.authorizeSupervisorRecoveryCountermeasure.bind(dashboardsController));

  fastify.post("/supervisor/recovery/countermeasures/authorize-all", { schema: { tags: ["Dashboards & Executive"], summary: "Authorize All Countermeasures" } }, dashboardsController.authorizeAllSupervisorRecoveryCountermeasures.bind(dashboardsController));

  // ─── Operations Supervisor Pending Shift Approvals ─────────────────────────
  fastify.get("/supervisor/approvals", { schema: { tags: ["Dashboards & Executive"], summary: "Get Pending Shift Approvals" } }, dashboardsController.getSupervisorApprovals.bind(dashboardsController));

  fastify.post("/supervisor/approvals/:id/approve", { schema: { tags: ["Dashboards & Executive"], summary: "Approve Shift Request" } }, dashboardsController.approveSupervisorApproval.bind(dashboardsController));

  fastify.post("/supervisor/approvals/:id/reject", { schema: { tags: ["Dashboards & Executive"], summary: "Reject Shift Request" } }, dashboardsController.rejectSupervisorApproval.bind(dashboardsController));

  fastify.post("/supervisor/approvals/:id/clarify", { schema: { tags: ["Dashboards & Executive"], summary: "Clarify Shift Request" } }, dashboardsController.clarifySupervisorApproval.bind(dashboardsController));

  fastify.post("/supervisor/approvals/bulk-approve", { schema: { tags: ["Dashboards & Executive"], summary: "Bulk Approve Shift Requests" } }, dashboardsController.bulkApproveSupervisorApprovals.bind(dashboardsController));

  // ─── Operations Supervisor Reports ─────────────────────────────────────────
  fastify.get("/supervisor/reports", { schema: { tags: ["Dashboards & Executive"], summary: "Get Supervisor Reports" } }, dashboardsController.getSupervisorReportsList.bind(dashboardsController));
  fastify.get("/supervisor/reports/list", { schema: { tags: ["Dashboards & Executive"], summary: "Get Supervisor Reports List" } }, dashboardsController.getSupervisorReportsList.bind(dashboardsController));

  fastify.post("/supervisor/reports/:id/print", { schema: { tags: ["Dashboards & Executive"], summary: "Print / Export Supervisor Report" } }, dashboardsController.printSupervisorReport.bind(dashboardsController));

  // ─── Operations Supervisor Notifications ───────────────────────────────────
  fastify.get("/supervisor/notifications", { schema: { tags: ["Dashboards & Executive"], summary: "Get Supervisor Notifications" } }, dashboardsController.getSupervisorNotificationsList.bind(dashboardsController));
  fastify.get("/supervisor/notifications/list", { schema: { tags: ["Dashboards & Executive"], summary: "Get Supervisor Notifications List" } }, dashboardsController.getSupervisorNotificationsList.bind(dashboardsController));

  fastify.put("/supervisor/notifications/:id/read", { schema: { tags: ["Dashboards & Executive"], summary: "Mark Supervisor Notification Read" } }, dashboardsController.markSupervisorNotificationRead.bind(dashboardsController));

  fastify.delete("/supervisor/notifications/:id", { schema: { tags: ["Dashboards & Executive"], summary: "Delete Supervisor Notification" } }, dashboardsController.deleteSupervisorNotification.bind(dashboardsController));

  fastify.put("/supervisor/notifications/mark-all-read", { schema: { tags: ["Dashboards & Executive"], summary: "Mark All Supervisor Notifications Read" } }, dashboardsController.markAllSupervisorNotificationsRead.bind(dashboardsController));

  fastify.delete("/supervisor/notifications/clear-all-list", { schema: { tags: ["Dashboards & Executive"], summary: "Clear All Supervisor Notifications" } }, dashboardsController.clearAllSupervisorNotifications.bind(dashboardsController));

  // ─── Operations Supervisor Profile ─────────────────────────────────────────
  fastify.get("/supervisor/profile", { schema: { tags: ["Dashboards & Executive"], summary: "Get Supervisor Profile Details" } }, dashboardsController.getSupervisorProfile.bind(dashboardsController));

  fastify.put("/supervisor/profile", { schema: { tags: ["Dashboards & Executive"], summary: "Update Supervisor Profile Information" } }, dashboardsController.updateSupervisorProfile.bind(dashboardsController));
}




