"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardsController = exports.DashboardsController = void 0;
const dashboards_service_js_1 = require("./dashboards.service.js");
const responseFormatter_js_1 = require("../../shared/utils/responseFormatter.js");
class DashboardsController {
    // Line Lead Dashboard
    async getLineLeadDashboard(request, reply) {
        const data = await dashboards_service_js_1.dashboardsService.getLineLeadDashboard(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async getMaterialLog(request, reply) {
        const data = await dashboards_service_js_1.dashboardsService.getMaterialLog(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async getQualityLog(request, reply) {
        const data = await dashboards_service_js_1.dashboardsService.getQualityLog(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async logQaSampleCheck(request, reply) {
        const body = request.body;
        const data = await dashboards_service_js_1.dashboardsService.logQaSampleCheck(request.user.tenantId, body || {});
        return reply.code(201).send((0, responseFormatter_js_1.formatSuccess)(data, "QA sample check logged successfully."));
    }
    async acknowledgeMicroStop(request, reply) {
        const body = request.body;
        const data = await dashboards_service_js_1.dashboardsService.acknowledgeMicroStop(request.user.tenantId, body || {});
        return reply.code(201).send((0, responseFormatter_js_1.formatSuccess)(data, "Micro-stop acknowledged & logged."));
    }
    async requestStockReplenishment(request, reply) {
        const body = request.body;
        const data = await dashboards_service_js_1.dashboardsService.requestStockReplenishment(request.user.tenantId, body);
        return reply.code(201).send((0, responseFormatter_js_1.formatSuccess)(data, "Stock replenishment request sent to Warehouse."));
    }
    async proposeLineSpeedUp(request, reply) {
        const body = request.body;
        const data = await dashboards_service_js_1.dashboardsService.proposeLineSpeedUp(request.user.tenantId, body);
        return reply.code(201).send((0, responseFormatter_js_1.formatSuccess)(data, "Speed-up proposal submitted for supervisor approval."));
    }
    // Plant Manager Command Center
    async getCommandCenter(request, reply) {
        const data = await dashboards_service_js_1.dashboardsService.getPlantManagerCommandCenter(request.user.tenantId, request.user.plantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    // ─── H/B Management ─────────────────────────────────────────────────────────
    async getHbLogs(request, reply) {
        const data = await dashboards_service_js_1.dashboardsService.getHbLogs(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async saveHbRecord(request, reply) {
        const body = request.body;
        const data = await dashboards_service_js_1.dashboardsService.saveHbRecord(request.user.tenantId, body);
        return reply.code(201).send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async updateHbRecord(request, reply) {
        const { id } = request.params;
        const body = request.body;
        const data = await dashboards_service_js_1.dashboardsService.updateHbRecord(request.user.tenantId, id, body);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async recalculateCatchUp(request, reply) {
        const body = request.body || {};
        const data = await dashboards_service_js_1.dashboardsService.recalculateCatchUp(request.user.tenantId, body);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async bulkReconcileShift(request, reply) {
        const body = request.body || {};
        const data = await dashboards_service_js_1.dashboardsService.bulkReconcileShift(request.user.tenantId, body);
        return reply.code(201).send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    // ─── Downtime & Loss (RCA 2.0) ───────────────────────────────────────────────
    async getDowntimeLogs(request, reply) {
        const data = await dashboards_service_js_1.dashboardsService.getDowntimeLogs(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async logBreakdown(request, reply) {
        const body = request.body;
        const data = await dashboards_service_js_1.dashboardsService.logBreakdown(request.user.tenantId, body);
        return reply.code(201).send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async acknowledgeDowntime(request, reply) {
        const { id } = request.params;
        const data = await dashboards_service_js_1.dashboardsService.acknowledgeDowntime(request.user.tenantId, id);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async dispatchTech(request, reply) {
        const { id } = request.params;
        const body = request.body || {};
        const data = await dashboards_service_js_1.dashboardsService.dispatchTech(request.user.tenantId, id, body);
        return reply.code(201).send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    // ─── Changeover Control ───────────────────────────────────────────────────────
    async getChangeoverStatus(request, reply) {
        const data = await dashboards_service_js_1.dashboardsService.getChangeoverStatus(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async startChangeover(request, reply) {
        const body = request.body || {};
        const data = await dashboards_service_js_1.dashboardsService.startChangeover(request.user.tenantId, body);
        return reply.code(201).send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async completeChangeoverStep(request, reply) {
        const { stepId } = request.params;
        const data = await dashboards_service_js_1.dashboardsService.completeChangeoverStep(request.user.tenantId, stepId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async finishChangeover(request, reply) {
        const body = request.body || {};
        const data = await dashboards_service_js_1.dashboardsService.finishChangeover(request.user.tenantId, body);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async logChangeoverDelay(request, reply) {
        const body = request.body;
        const data = await dashboards_service_js_1.dashboardsService.logChangeoverDelay(request.user.tenantId, body);
        return reply.code(201).send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    // ─── Staffing ─────────────────────────────────────────────────────────────
    async getStaffingRoster(request, reply) {
        const data = await dashboards_service_js_1.dashboardsService.getStaffingRoster(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async swapStaffingStations(request, reply) {
        const body = request.body || {};
        const data = await dashboards_service_js_1.dashboardsService.swapStaffingStations(request.user.tenantId, body);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async requestReliefOperator(request, reply) {
        const body = request.body || {};
        const data = await dashboards_service_js_1.dashboardsService.requestReliefOperator(request.user.tenantId, body);
        return reply.code(201).send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async reassignOperatorStation(request, reply) {
        const { id } = request.params;
        const body = request.body || {};
        const data = await dashboards_service_js_1.dashboardsService.reassignOperatorStation(request.user.tenantId, id, body);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async requestOperatorReplacement(request, reply) {
        const { id } = request.params;
        const body = request.body || {};
        const data = await dashboards_service_js_1.dashboardsService.requestOperatorReplacement(request.user.tenantId, id, body);
        return reply.code(201).send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    // ─── Production Performance & Pace ─────────────────────────────────────────
    async getProductionPerformance(request, reply) {
        const data = await dashboards_service_js_1.dashboardsService.getProductionPerformance(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async simulateRecoverySpeed(request, reply) {
        const body = request.body || {};
        const data = await dashboards_service_js_1.dashboardsService.simulateRecoverySpeed(request.user.tenantId, body);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async applyTargetOverride(request, reply) {
        const body = request.body || {};
        const data = await dashboards_service_js_1.dashboardsService.applyTargetOverride(request.user.tenantId, body);
        return reply.code(201).send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async resetTargetOverride(request, reply) {
        const body = request.body || {};
        const data = await dashboards_service_js_1.dashboardsService.resetTargetOverride(request.user.tenantId, body);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    // ─── Schedule Recovery Management ──────────────────────────────────────────
    async getRecoveryStatus(request, reply) {
        const data = await dashboards_service_js_1.dashboardsService.getRecoveryStatus(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async activateCountermeasure(request, reply) {
        const { id } = request.params;
        const body = request.body || {};
        const data = await dashboards_service_js_1.dashboardsService.activateCountermeasure(request.user.tenantId, id, body);
        return reply.code(201).send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async submitRecoveryProposal(request, reply) {
        const body = request.body || {};
        const data = await dashboards_service_js_1.dashboardsService.submitRecoveryProposal(request.user.tenantId, body);
        return reply.code(201).send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    // ─── Escalations Console (P1 Control Tower) ─────────────────────────────────
    async getEscalations(request, reply) {
        const data = await dashboards_service_js_1.dashboardsService.getEscalations(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async dispatchEscalation(request, reply) {
        const body = request.body || {};
        const data = await dashboards_service_js_1.dashboardsService.dispatchEscalation(request.user.tenantId, body);
        return reply.code(201).send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async attachEscalationEvidence(request, reply) {
        const { id } = request.params;
        const body = request.body || {};
        const data = await dashboards_service_js_1.dashboardsService.attachEscalationEvidence(request.user.tenantId, id, body);
        return reply.code(201).send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    // ─── Notifications ─────────────────────────────────────────────────────────
    async getNotifications(request, reply) {
        const data = await dashboards_service_js_1.dashboardsService.getNotifications(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async markNotificationRead(request, reply) {
        const { id } = request.params;
        const data = await dashboards_service_js_1.dashboardsService.markNotificationRead(request.user.tenantId, id);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async deleteNotification(request, reply) {
        const { id } = request.params;
        const data = await dashboards_service_js_1.dashboardsService.deleteNotification(request.user.tenantId, id);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async markAllNotificationsRead(request, reply) {
        const data = await dashboards_service_js_1.dashboardsService.markAllNotificationsRead(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async clearAllNotifications(request, reply) {
        const data = await dashboards_service_js_1.dashboardsService.clearAllNotifications(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    // ─── Profile ───────────────────────────────────────────────────────────────
    async getUserProfile(request, reply) {
        const data = await dashboards_service_js_1.dashboardsService.getUserProfile(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async updateUserProfile(request, reply) {
        const body = request.body || {};
        const data = await dashboards_service_js_1.dashboardsService.updateUserProfile(request.user.tenantId, body);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    // ─── Operator Dashboard & HMI Console ──────────────────────────────────────
    async getOperatorDashboard(request, reply) {
        const data = await dashboards_service_js_1.dashboardsService.getOperatorDashboard(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async logOperatorMicroStop(request, reply) {
        const body = request.body || {};
        const data = await dashboards_service_js_1.dashboardsService.logOperatorMicroStop(request.user.tenantId, body);
        return reply.code(201).send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async updateJobStatus(request, reply) {
        const { jobId } = request.params;
        const body = request.body || {};
        const data = await dashboards_service_js_1.dashboardsService.updateJobStatus(request.user.tenantId, jobId, body);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    // ─── Operator My Jobs ──────────────────────────────────────────────────────
    async getOperatorJobs(request, reply) {
        const data = await dashboards_service_js_1.dashboardsService.getOperatorJobs(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async startOperatorJob(request, reply) {
        const { jobId } = request.params;
        const body = request.body || {};
        const data = await dashboards_service_js_1.dashboardsService.startOperatorJob(request.user.tenantId, jobId, body);
        return reply.code(200).send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async completeOperatorJob(request, reply) {
        const { jobId } = request.params;
        const data = await dashboards_service_js_1.dashboardsService.completeOperatorJob(request.user.tenantId, jobId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    // ─── Operator Work Instructions & SOPs ─────────────────────────────────────
    async getWorkInstructions(request, reply) {
        const data = await dashboards_service_js_1.dashboardsService.getWorkInstructions(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async acknowledgeWorkInstructions(request, reply) {
        const body = request.body || {};
        const data = await dashboards_service_js_1.dashboardsService.acknowledgeWorkInstructions(request.user.tenantId, body);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    // ─── Operator Production Entry ─────────────────────────────────────────────
    async getProductionEntryStatus(request, reply) {
        const data = await dashboards_service_js_1.dashboardsService.getProductionEntryStatus(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async submitProductionLog(request, reply) {
        const body = request.body || {};
        const data = await dashboards_service_js_1.dashboardsService.submitProductionLog(request.user.tenantId, body);
        return reply.code(201).send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async logScrapDefect(request, reply) {
        const body = request.body || {};
        const data = await dashboards_service_js_1.dashboardsService.logScrapDefect(request.user.tenantId, body);
        return reply.code(201).send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    // ─── Operator Downtime & Loss ───────────────────────────────────────────────
    async getOperatorDowntime(request, reply) {
        const data = await dashboards_service_js_1.dashboardsService.getOperatorDowntime(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async logOperatorDowntimeEvent(request, reply) {
        const body = request.body || {};
        const data = await dashboards_service_js_1.dashboardsService.logOperatorDowntimeEvent(request.user.tenantId, body);
        return reply.code(201).send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async logOperatorDowntimeMicroStop(request, reply) {
        const body = request.body || {};
        const data = await dashboards_service_js_1.dashboardsService.logOperatorDowntimeMicroStop(request.user.tenantId, body);
        return reply.code(201).send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    // ─── Operator Quality & CCP Checks ──────────────────────────────────────────
    async getOperatorQualityChecks(request, reply) {
        const data = await dashboards_service_js_1.dashboardsService.getOperatorQualityChecks(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async submitQualityChecklist(request, reply) {
        const body = request.body || {};
        const data = await dashboards_service_js_1.dashboardsService.submitQualityChecklist(request.user.tenantId, body);
        return reply.code(201).send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async triggerQualityHold(request, reply) {
        const body = request.body || {};
        const data = await dashboards_service_js_1.dashboardsService.triggerQualityHold(request.user.tenantId, body);
        return reply.code(201).send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    // ─── Operator Material Requisition ─────────────────────────────────────────
    async getOperatorMaterialRequests(request, reply) {
        const data = await dashboards_service_js_1.dashboardsService.getOperatorMaterialRequests(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async callWarehouseRunner(request, reply) {
        const body = request.body || {};
        const data = await dashboards_service_js_1.dashboardsService.callWarehouseRunner(request.user.tenantId, body);
        return reply.code(201).send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async submitMaterialRequisition(request, reply) {
        const body = request.body || {};
        const data = await dashboards_service_js_1.dashboardsService.submitMaterialRequisition(request.user.tenantId, body);
        return reply.code(201).send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async confirmMaterialReceipt(request, reply) {
        const { id } = request.params;
        const data = await dashboards_service_js_1.dashboardsService.confirmMaterialReceipt(request.user.tenantId, id);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    // ─── Operator Barcode & QR Scan ─────────────────────────────────────────────
    async getBarcodeScanStatus(request, reply) {
        const data = await dashboards_service_js_1.dashboardsService.getBarcodeScanStatus(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async parseBarcode(request, reply) {
        const body = request.body || {};
        const data = await dashboards_service_js_1.dashboardsService.parseBarcode(request.user.tenantId, body);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async attachLotToBatch(request, reply) {
        const body = request.body || {};
        const data = await dashboards_service_js_1.dashboardsService.attachLotToBatch(request.user.tenantId, body);
        return reply.code(201).send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    // ─── Operator Report Issue & Safety Exception ──────────────────────────────
    async getReportIssueStatus(request, reply) {
        const data = await dashboards_service_js_1.dashboardsService.getReportIssueStatus(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async submitReportIssue(request, reply) {
        const body = request.body || {};
        const data = await dashboards_service_js_1.dashboardsService.submitReportIssue(request.user.tenantId, body);
        return reply.code(201).send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async triggerEmergencyCall(request, reply) {
        const body = request.body || {};
        const data = await dashboards_service_js_1.dashboardsService.triggerEmergencyCall(request.user.tenantId, body);
        return reply.code(201).send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    // ─── Operator Shift Handoff ─────────────────────────────────────────────────
    async getShiftHandoffs(request, reply) {
        const data = await dashboards_service_js_1.dashboardsService.getShiftHandoffs(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async submitShiftHandoff(request, reply) {
        const body = request.body || {};
        const data = await dashboards_service_js_1.dashboardsService.submitShiftHandoff(request.user.tenantId, body);
        return reply.code(201).send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    // ─── Operator Notifications ─────────────────────────────────────────────────
    async getOperatorNotifications(request, reply) {
        const data = await dashboards_service_js_1.dashboardsService.getOperatorNotifications(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async markOperatorNotificationRead(request, reply) {
        const { id } = request.params;
        const data = await dashboards_service_js_1.dashboardsService.markOperatorNotificationRead(request.user.tenantId, parseInt(id, 10));
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async markAllOperatorNotificationsRead(request, reply) {
        const data = await dashboards_service_js_1.dashboardsService.markAllOperatorNotificationsRead(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async deleteOperatorNotification(request, reply) {
        const { id } = request.params;
        const data = await dashboards_service_js_1.dashboardsService.deleteOperatorNotification(request.user.tenantId, parseInt(id, 10));
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async clearAllOperatorNotifications(request, reply) {
        const data = await dashboards_service_js_1.dashboardsService.clearAllOperatorNotifications(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    // ─── Operator Profile ────────────────────────────────────────────────────────
    async getOperatorProfile(request, reply) {
        const data = await dashboards_service_js_1.dashboardsService.getOperatorProfile(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async updateOperatorProfile(request, reply) {
        const body = request.body || {};
        const data = await dashboards_service_js_1.dashboardsService.updateOperatorProfile(request.user.tenantId, body);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    // ─── Operations Supervisor Command Center ──────────────────────────────────
    async getSupervisorDashboard(request, reply) {
        const data = await dashboards_service_js_1.dashboardsService.getSupervisorDashboard(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async authorizeSupervisorShift(request, reply) {
        const body = request.body || {};
        const data = await dashboards_service_js_1.dashboardsService.authorizeSupervisorShift(request.user.tenantId, body);
        return reply.code(201).send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    // ─── Operations Supervisor Department Run Schedule ─────────────────────────
    async getSupervisorDeptSchedule(request, reply) {
        const data = await dashboards_service_js_1.dashboardsService.getSupervisorDeptSchedule(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async resequenceSupervisorDeptSchedule(request, reply) {
        const data = await dashboards_service_js_1.dashboardsService.resequenceSupervisorDeptSchedule(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async authorizeSupervisorDeptSchedule(request, reply) {
        const { id } = request.params;
        const data = await dashboards_service_js_1.dashboardsService.authorizeSupervisorDeptSchedule(request.user.tenantId, id);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async pauseSupervisorDeptSchedule(request, reply) {
        const { id } = request.params;
        const data = await dashboards_service_js_1.dashboardsService.pauseSupervisorDeptSchedule(request.user.tenantId, id);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async resumeSupervisorDeptSchedule(request, reply) {
        const { id } = request.params;
        const data = await dashboards_service_js_1.dashboardsService.resumeSupervisorDeptSchedule(request.user.tenantId, id);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    // ─── Operations Supervisor Workforce / Employee List ───────────────────────
    async getSupervisorWorkforce(request, reply) {
        const data = await dashboards_service_js_1.dashboardsService.getSupervisorWorkforce(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async addSupervisorWorkforceEmployee(request, reply) {
        const body = request.body || {};
        const data = await dashboards_service_js_1.dashboardsService.addSupervisorWorkforceEmployee(request.user.tenantId, body);
        return reply.code(201).send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async updateSupervisorWorkforceEmployee(request, reply) {
        const { id } = request.params;
        const body = request.body || {};
        const data = await dashboards_service_js_1.dashboardsService.updateSupervisorWorkforceEmployee(request.user.tenantId, id, body);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async assignSupervisorWorkforceSkill(request, reply) {
        const { id } = request.params;
        const body = request.body || {};
        const data = await dashboards_service_js_1.dashboardsService.assignSupervisorWorkforceSkill(request.user.tenantId, id, body);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async assignSupervisorWorkforceTraining(request, reply) {
        const { id } = request.params;
        const body = request.body || {};
        const data = await dashboards_service_js_1.dashboardsService.assignSupervisorWorkforceTraining(request.user.tenantId, id, body);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    // ─── Operations Supervisor Labour Time & Allocations ───────────────────────
    async getSupervisorLabourTime(request, reply) {
        const data = await dashboards_service_js_1.dashboardsService.getSupervisorLabourTime(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async authorizeSupervisorOvertime(request, reply) {
        const body = request.body || {};
        const data = await dashboards_service_js_1.dashboardsService.authorizeSupervisorOvertime(request.user.tenantId, body);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async rebalanceSupervisorCrew(request, reply) {
        const body = request.body || {};
        const data = await dashboards_service_js_1.dashboardsService.rebalanceSupervisorCrew(request.user.tenantId, body);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    // ─── Operations Supervisor Live H/B Management ─────────────────────────────
    async getSupervisorLiveHB(request, reply) {
        const data = await dashboards_service_js_1.dashboardsService.getSupervisorLiveHB(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async logSupervisorHB(request, reply) {
        const body = request.body || {};
        const data = await dashboards_service_js_1.dashboardsService.logSupervisorHB(request.user.tenantId, body);
        return reply.code(201).send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async dispatchSupervisorHBBackup(request, reply) {
        const body = request.body || {};
        const data = await dashboards_service_js_1.dashboardsService.dispatchSupervisorHBBackup(request.user.tenantId, body);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    // ─── Operations Supervisor Skills & Qualification Matrix ────────────────────
    async getSupervisorSkills(request, reply) {
        const data = await dashboards_service_js_1.dashboardsService.getSupervisorSkills(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async addSupervisorSkill(request, reply) {
        const body = request.body || {};
        const data = await dashboards_service_js_1.dashboardsService.addSupervisorSkill(request.user.tenantId, body);
        return reply.code(201).send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async updateSupervisorSkillLevel(request, reply) {
        const { id } = request.params;
        const body = request.body || {};
        const data = await dashboards_service_js_1.dashboardsService.updateSupervisorSkillLevel(request.user.tenantId, id, body);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    // ─── Operations Supervisor Training & Certifications ───────────────────────
    async getSupervisorTraining(request, reply) {
        const data = await dashboards_service_js_1.dashboardsService.getSupervisorTraining(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async addSupervisorTraining(request, reply) {
        const body = request.body || {};
        const data = await dashboards_service_js_1.dashboardsService.addSupervisorTraining(request.user.tenantId, body);
        return reply.code(201).send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async completeSupervisorTraining(request, reply) {
        const { id } = request.params;
        const body = request.body || {};
        const data = await dashboards_service_js_1.dashboardsService.completeSupervisorTraining(request.user.tenantId, id, body);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    // ─── Operations Supervisor Labour Productivity ──────────────────────────────
    async getSupervisorProductivity(request, reply) {
        const data = await dashboards_service_js_1.dashboardsService.getSupervisorProductivity(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    // ─── Operations Supervisor Shift Management & Rostering ────────────────────
    async getSupervisorStaffing(request, reply) {
        const data = await dashboards_service_js_1.dashboardsService.getSupervisorStaffing(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async addSupervisorStaffing(request, reply) {
        const body = request.body || {};
        const data = await dashboards_service_js_1.dashboardsService.addSupervisorStaffing(request.user.tenantId, body);
        return reply.code(201).send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async updateSupervisorStaffing(request, reply) {
        const { id } = request.params;
        const body = request.body || {};
        const data = await dashboards_service_js_1.dashboardsService.updateSupervisorStaffing(request.user.tenantId, id, body);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async assignSupervisorStaffingPersonnel(request, reply) {
        const { id } = request.params;
        const body = request.body || {};
        const data = await dashboards_service_js_1.dashboardsService.assignSupervisorStaffingPersonnel(request.user.tenantId, id, body);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async assignSupervisorStaffingStation(request, reply) {
        const { id } = request.params;
        const body = request.body || {};
        const data = await dashboards_service_js_1.dashboardsService.assignSupervisorStaffingStation(request.user.tenantId, id, body);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async closeSupervisorStaffingShift(request, reply) {
        const { id } = request.params;
        const body = request.body || {};
        const data = await dashboards_service_js_1.dashboardsService.closeSupervisorStaffingShift(request.user.tenantId, id, body);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    // ─── Operations Supervisor Production Performance ──────────────────────────
    async setSupervisorProductionSpeedLimit(request, reply) {
        const body = request.body || {};
        const data = await dashboards_service_js_1.dashboardsService.setSupervisorProductionSpeedLimit(request.user.tenantId, body);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async getSupervisorDowntimePareto(request, reply) {
        const data = await dashboards_service_js_1.dashboardsService.getSupervisorDowntimePareto(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    // ─── Operations Supervisor Quality Quarantine Holds ─────────────────────────
    async getSupervisorHolds(request, reply) {
        const data = await dashboards_service_js_1.dashboardsService.getSupervisorHolds(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async addSupervisorHoldNote(request, reply) {
        const { id } = request.params;
        const body = request.body || {};
        const data = await dashboards_service_js_1.dashboardsService.addSupervisorHoldNote(request.user.tenantId, id, body);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async requestSupervisorHoldRework(request, reply) {
        const { id } = request.params;
        const body = request.body || {};
        const data = await dashboards_service_js_1.dashboardsService.requestSupervisorHoldRework(request.user.tenantId, id, body);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async authorizeSupervisorHoldRelease(request, reply) {
        const { id } = request.params;
        const body = request.body || {};
        const data = await dashboards_service_js_1.dashboardsService.authorizeSupervisorHoldRelease(request.user.tenantId, id, body);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async scrapSupervisorHoldBatch(request, reply) {
        const { id } = request.params;
        const data = await dashboards_service_js_1.dashboardsService.scrapSupervisorHoldBatch(request.user.tenantId, id);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    // ─── Operations Supervisor Departmental Recovery Steering ─────────────────
    async getSupervisorRecoveryCountermeasures(request, reply) {
        const data = await dashboards_service_js_1.dashboardsService.getSupervisorRecoveryCountermeasures(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async authorizeSupervisorRecoveryCountermeasure(request, reply) {
        const { id } = request.params;
        const data = await dashboards_service_js_1.dashboardsService.authorizeSupervisorRecoveryCountermeasure(request.user.tenantId, id);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async authorizeAllSupervisorRecoveryCountermeasures(request, reply) {
        const data = await dashboards_service_js_1.dashboardsService.authorizeAllSupervisorRecoveryCountermeasures(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    // ─── Operations Supervisor Pending Shift Approvals ─────────────────────────
    async getSupervisorApprovals(request, reply) {
        const data = await dashboards_service_js_1.dashboardsService.getSupervisorApprovals(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async approveSupervisorApproval(request, reply) {
        const { id } = request.params;
        const body = request.body || {};
        const data = await dashboards_service_js_1.dashboardsService.approveSupervisorApproval(request.user.tenantId, id, body);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async rejectSupervisorApproval(request, reply) {
        const { id } = request.params;
        const data = await dashboards_service_js_1.dashboardsService.rejectSupervisorApproval(request.user.tenantId, id);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async clarifySupervisorApproval(request, reply) {
        const { id } = request.params;
        const data = await dashboards_service_js_1.dashboardsService.clarifySupervisorApproval(request.user.tenantId, id);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async bulkApproveSupervisorApprovals(request, reply) {
        const data = await dashboards_service_js_1.dashboardsService.bulkApproveSupervisorApprovals(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    // ─── Operations Supervisor Reports ─────────────────────────────────────────
    async getSupervisorReportsList(request, reply) {
        const data = await dashboards_service_js_1.dashboardsService.getSupervisorReportsList(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async printSupervisorReport(request, reply) {
        const { id } = request.params;
        const data = await dashboards_service_js_1.dashboardsService.printSupervisorReport(request.user.tenantId, id);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    // ─── Operations Supervisor Notifications ───────────────────────────────────
    async getSupervisorNotificationsList(request, reply) {
        const data = await dashboards_service_js_1.dashboardsService.getSupervisorNotificationsList(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async markSupervisorNotificationRead(request, reply) {
        const { id } = request.params;
        const data = await dashboards_service_js_1.dashboardsService.markSupervisorNotificationRead(request.user.tenantId, id);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async deleteSupervisorNotification(request, reply) {
        const { id } = request.params;
        const data = await dashboards_service_js_1.dashboardsService.deleteSupervisorNotification(request.user.tenantId, id);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async markAllSupervisorNotificationsRead(request, reply) {
        const data = await dashboards_service_js_1.dashboardsService.markAllSupervisorNotificationsRead(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async clearAllSupervisorNotifications(request, reply) {
        const data = await dashboards_service_js_1.dashboardsService.clearAllSupervisorNotifications(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    // ─── Operations Supervisor Profile ───────────────────────────────────────
    async getSupervisorProfile(request, reply) {
        const data = await dashboards_service_js_1.dashboardsService.getSupervisorProfile(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async updateSupervisorProfile(request, reply) {
        const body = request.body || {};
        const data = await dashboards_service_js_1.dashboardsService.updateSupervisorProfile(request.user.tenantId, body);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
}
exports.DashboardsController = DashboardsController;
exports.dashboardsController = new DashboardsController();
//# sourceMappingURL=dashboards.controller.js.map