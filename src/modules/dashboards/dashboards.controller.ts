import { FastifyReply, FastifyRequest } from "fastify";
import { dashboardsService } from "./dashboards.service.js";
import { formatSuccess } from "../../shared/utils/responseFormatter.js";

export class DashboardsController {
  // Line Lead Dashboard
  async getLineLeadDashboard(request: FastifyRequest, reply: FastifyReply) {
    const data = await dashboardsService.getLineLeadDashboard(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async getMaterialLog(request: FastifyRequest, reply: FastifyReply) {
    const data = await dashboardsService.getMaterialLog(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async getQualityLog(request: FastifyRequest, reply: FastifyReply) {
    const data = await dashboardsService.getQualityLog(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async logQaSampleCheck(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as any;
    const data = await dashboardsService.logQaSampleCheck(request.user.tenantId, body || {});
    return reply.code(201).send(formatSuccess(data, "QA sample check logged successfully."));
  }

  async acknowledgeMicroStop(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as any;
    const data = await dashboardsService.acknowledgeMicroStop(request.user.tenantId, body || {});
    return reply.code(201).send(formatSuccess(data, "Micro-stop acknowledged & logged."));
  }

  async requestStockReplenishment(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as any;
    const data = await dashboardsService.requestStockReplenishment(request.user.tenantId, body);
    return reply.code(201).send(formatSuccess(data, "Stock replenishment request sent to Warehouse."));
  }

  async proposeLineSpeedUp(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as any;
    const data = await dashboardsService.proposeLineSpeedUp(request.user.tenantId, body);
    return reply.code(201).send(formatSuccess(data, "Speed-up proposal submitted for supervisor approval."));
  }

  // Plant Manager Command Center
  async getCommandCenter(request: FastifyRequest, reply: FastifyReply) {
    const data = await dashboardsService.getPlantManagerCommandCenter(request.user.tenantId, (request.query as any)?.plantId || request.user.plantId);
    return reply.send(formatSuccess(data));
  }

  async getKPIs(request: FastifyRequest, reply: FastifyReply) {
    const data = await dashboardsService.getExecutiveKPIs((request.query as any)?.plantId || request.user.plantId);
    return reply.send(formatSuccess(data));
  }

  // ─── H/B Management ─────────────────────────────────────────────────────────
  async getHbLogs(request: FastifyRequest, reply: FastifyReply) {
    const data = await dashboardsService.getHbLogs(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async saveHbRecord(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as any;
    const data = await dashboardsService.saveHbRecord(request.user.tenantId, body);
    return reply.code(201).send(formatSuccess(data, data.message));
  }

  async updateHbRecord(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const body = request.body as any;
    const data = await dashboardsService.updateHbRecord(request.user.tenantId, id, body);
    return reply.send(formatSuccess(data, data.message));
  }

  async recalculateCatchUp(request: FastifyRequest, reply: FastifyReply) {
    const body = (request.body as any) || {};
    const data = await dashboardsService.recalculateCatchUp(request.user.tenantId, body);
    return reply.send(formatSuccess(data, data.message));
  }

  async bulkReconcileShift(request: FastifyRequest, reply: FastifyReply) {
    const body = (request.body as any) || {};
    const data = await dashboardsService.bulkReconcileShift(request.user.tenantId, body);
    return reply.code(201).send(formatSuccess(data, data.message));
  }

  // ─── Downtime & Loss (RCA 2.0) ───────────────────────────────────────────────
  async getDowntimeLogs(request: FastifyRequest, reply: FastifyReply) {
    const data = await dashboardsService.getDowntimeLogs(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async logBreakdown(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as any;
    const data = await dashboardsService.logBreakdown(request.user.tenantId, body);
    return reply.code(201).send(formatSuccess(data, data.message));
  }

  async acknowledgeDowntime(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const data = await dashboardsService.acknowledgeDowntime(request.user.tenantId, id);
    return reply.send(formatSuccess(data, data.message));
  }

  async dispatchTech(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const body = (request.body as any) || {};
    const data = await dashboardsService.dispatchTech(request.user.tenantId, id, body);
    return reply.code(201).send(formatSuccess(data, data.message));
  }

  // ─── Changeover Control ───────────────────────────────────────────────────────
  async getChangeoverStatus(request: FastifyRequest, reply: FastifyReply) {
    const data = await dashboardsService.getChangeoverStatus(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async startChangeover(request: FastifyRequest, reply: FastifyReply) {
    const body = (request.body as any) || {};
    const data = await dashboardsService.startChangeover(request.user.tenantId, body);
    return reply.code(201).send(formatSuccess(data, data.message));
  }

  async completeChangeoverStep(request: FastifyRequest, reply: FastifyReply) {
    const { stepId } = request.params as { stepId: string };
    const data = await dashboardsService.completeChangeoverStep(request.user.tenantId, stepId);
    return reply.send(formatSuccess(data, data.message));
  }

  async finishChangeover(request: FastifyRequest, reply: FastifyReply) {
    const body = (request.body as any) || {};
    const data = await dashboardsService.finishChangeover(request.user.tenantId, body);
    return reply.send(formatSuccess(data, data.message));
  }

  async logChangeoverDelay(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as any;
    const data = await dashboardsService.logChangeoverDelay(request.user.tenantId, body);
    return reply.code(201).send(formatSuccess(data, data.message));
  }

  // ─── Staffing ─────────────────────────────────────────────────────────────
  async getStaffingRoster(request: FastifyRequest, reply: FastifyReply) {
    const data = await dashboardsService.getStaffingRoster(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async swapStaffingStations(request: FastifyRequest, reply: FastifyReply) {
    const body = (request.body as any) || {};
    const data = await dashboardsService.swapStaffingStations(request.user.tenantId, body);
    return reply.send(formatSuccess(data, data.message));
  }

  async requestReliefOperator(request: FastifyRequest, reply: FastifyReply) {
    const body = (request.body as any) || {};
    const data = await dashboardsService.requestReliefOperator(request.user.tenantId, body);
    return reply.code(201).send(formatSuccess(data, data.message));
  }

  async reassignOperatorStation(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const body = (request.body as any) || {};
    const data = await dashboardsService.reassignOperatorStation(request.user.tenantId, id, body);
    return reply.send(formatSuccess(data, data.message));
  }

  async requestOperatorReplacement(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const body = (request.body as any) || {};
    const data = await dashboardsService.requestOperatorReplacement(request.user.tenantId, id, body);
    return reply.code(201).send(formatSuccess(data, data.message));
  }

  // ─── Production Performance & Pace ─────────────────────────────────────────
  async getProductionPerformance(request: FastifyRequest, reply: FastifyReply) {
    const data = await dashboardsService.getProductionPerformance(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async simulateRecoverySpeed(request: FastifyRequest, reply: FastifyReply) {
    const body = (request.body as any) || {};
    const data = await dashboardsService.simulateRecoverySpeed(request.user.tenantId, body);
    return reply.send(formatSuccess(data, data.message));
  }

  async applyTargetOverride(request: FastifyRequest, reply: FastifyReply) {
    const body = (request.body as any) || {};
    const data = await dashboardsService.applyTargetOverride(request.user.tenantId, body);
    return reply.code(201).send(formatSuccess(data, data.message));
  }

  async resetTargetOverride(request: FastifyRequest, reply: FastifyReply) {
    const body = (request.body as any) || {};
    const data = await dashboardsService.resetTargetOverride(request.user.tenantId, body);
    return reply.send(formatSuccess(data, data.message));
  }

  // ─── Schedule Recovery Management ──────────────────────────────────────────
  async getRecoveryStatus(request: FastifyRequest, reply: FastifyReply) {
    const data = await dashboardsService.getRecoveryStatus(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async activateCountermeasure(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const body = (request.body as any) || {};
    const data = await dashboardsService.activateCountermeasure(request.user.tenantId, id, body);
    return reply.code(201).send(formatSuccess(data, data.message));
  }

  async submitRecoveryProposal(request: FastifyRequest, reply: FastifyReply) {
    const body = (request.body as any) || {};
    const data = await dashboardsService.submitRecoveryProposal(request.user.tenantId, body);
    return reply.code(201).send(formatSuccess(data, data.message));
  }

  // ─── Escalations Console (P1 Control Tower) ─────────────────────────────────
  async getEscalations(request: FastifyRequest, reply: FastifyReply) {
    const data = await dashboardsService.getEscalations(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async dispatchEscalation(request: FastifyRequest, reply: FastifyReply) {
    const body = (request.body as any) || {};
    const data = await dashboardsService.dispatchEscalation(request.user.tenantId, body);
    return reply.code(201).send(formatSuccess(data, data.message));
  }

  async attachEscalationEvidence(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const body = (request.body as any) || {};
    const data = await dashboardsService.attachEscalationEvidence(request.user.tenantId, id, body);
    return reply.code(201).send(formatSuccess(data, data.message));
  }

  // ─── Notifications ─────────────────────────────────────────────────────────
  async getNotifications(request: FastifyRequest, reply: FastifyReply) {
    const data = await dashboardsService.getNotifications(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async markNotificationRead(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const data = await dashboardsService.markNotificationRead(request.user.tenantId, id);
    return reply.send(formatSuccess(data, data.message));
  }

  async deleteNotification(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const data = await dashboardsService.deleteNotification(request.user.tenantId, id);
    return reply.send(formatSuccess(data, data.message));
  }

  async markAllNotificationsRead(request: FastifyRequest, reply: FastifyReply) {
    const data = await dashboardsService.markAllNotificationsRead(request.user.tenantId);
    return reply.send(formatSuccess(data, data.message));
  }

  async clearAllNotifications(request: FastifyRequest, reply: FastifyReply) {
    const data = await dashboardsService.clearAllNotifications(request.user.tenantId);
    return reply.send(formatSuccess(data, data.message));
  }

  // ─── Profile ───────────────────────────────────────────────────────────────
  async getUserProfile(request: FastifyRequest, reply: FastifyReply) {
    const data = await dashboardsService.getUserProfile(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async updateUserProfile(request: FastifyRequest, reply: FastifyReply) {
    const body = (request.body as any) || {};
    const data = await dashboardsService.updateUserProfile(request.user.tenantId, body);
    return reply.send(formatSuccess(data, data.message));
  }

  // ─── Operator Dashboard & HMI Console ──────────────────────────────────────
  async getOperatorDashboard(request: FastifyRequest, reply: FastifyReply) {
    const data = await dashboardsService.getOperatorDashboard(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async logOperatorMicroStop(request: FastifyRequest, reply: FastifyReply) {
    const body = (request.body as any) || {};
    const data = await dashboardsService.logOperatorMicroStop(request.user.tenantId, body);
    return reply.code(201).send(formatSuccess(data, data.message));
  }

  async updateJobStatus(request: FastifyRequest, reply: FastifyReply) {
    const { jobId } = request.params as { jobId: string };
    const body = (request.body as any) || {};
    const data = await dashboardsService.updateJobStatus(request.user.tenantId, jobId, body);
    return reply.send(formatSuccess(data, data.message));
  }

  // ─── Operator My Jobs ──────────────────────────────────────────────────────
  async getOperatorJobs(request: FastifyRequest, reply: FastifyReply) {
    const data = await dashboardsService.getOperatorJobs(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async startOperatorJob(request: FastifyRequest, reply: FastifyReply) {
    const { jobId } = request.params as { jobId: string };
    const body = (request.body as any) || {};
    const data = await dashboardsService.startOperatorJob(request.user.tenantId, jobId, body);
    return reply.code(200).send(formatSuccess(data, data.message));
  }

  async completeOperatorJob(request: FastifyRequest, reply: FastifyReply) {
    const { jobId } = request.params as { jobId: string };
    const data = await dashboardsService.completeOperatorJob(request.user.tenantId, jobId);
    return reply.send(formatSuccess(data, data.message));
  }

  // ─── Operator Work Instructions & SOPs ─────────────────────────────────────
  async getWorkInstructions(request: FastifyRequest, reply: FastifyReply) {
    const data = await dashboardsService.getWorkInstructions(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async acknowledgeWorkInstructions(request: FastifyRequest, reply: FastifyReply) {
    const body = (request.body as any) || {};
    const data = await dashboardsService.acknowledgeWorkInstructions(request.user.tenantId, body);
    return reply.send(formatSuccess(data, data.message));
  }

  // ─── Operator Production Entry ─────────────────────────────────────────────
  async getProductionEntryStatus(request: FastifyRequest, reply: FastifyReply) {
    const data = await dashboardsService.getProductionEntryStatus(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async submitProductionLog(request: FastifyRequest, reply: FastifyReply) {
    const body = (request.body as any) || {};
    const data = await dashboardsService.submitProductionLog(request.user.tenantId, body);
    return reply.code(201).send(formatSuccess(data, data.message));
  }

  async logScrapDefect(request: FastifyRequest, reply: FastifyReply) {
    const body = (request.body as any) || {};
    const data = await dashboardsService.logScrapDefect(request.user.tenantId, body);
    return reply.code(201).send(formatSuccess(data, data.message));
  }

  // ─── Operator Downtime & Loss ───────────────────────────────────────────────
  async getOperatorDowntime(request: FastifyRequest, reply: FastifyReply) {
    const data = await dashboardsService.getOperatorDowntime(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async logOperatorDowntimeEvent(request: FastifyRequest, reply: FastifyReply) {
    const body = (request.body as any) || {};
    const data = await dashboardsService.logOperatorDowntimeEvent(request.user.tenantId, body);
    return reply.code(201).send(formatSuccess(data, data.message));
  }

  async logOperatorDowntimeMicroStop(request: FastifyRequest, reply: FastifyReply) {
    const body = (request.body as any) || {};
    const data = await dashboardsService.logOperatorDowntimeMicroStop(request.user.tenantId, body);
    return reply.code(201).send(formatSuccess(data, data.message));
  }

  // ─── Operator Quality & CCP Checks ──────────────────────────────────────────
  async getOperatorQualityChecks(request: FastifyRequest, reply: FastifyReply) {
    const data = await dashboardsService.getOperatorQualityChecks(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async submitQualityChecklist(request: FastifyRequest, reply: FastifyReply) {
    const body = (request.body as any) || {};
    const data = await dashboardsService.submitQualityChecklist(request.user.tenantId, body);
    return reply.code(201).send(formatSuccess(data, data.message));
  }

  async triggerQualityHold(request: FastifyRequest, reply: FastifyReply) {
    const body = (request.body as any) || {};
    const data = await dashboardsService.triggerQualityHold(request.user.tenantId, body);
    return reply.code(201).send(formatSuccess(data, data.message));
  }

  // ─── Operator Material Requisition ─────────────────────────────────────────
  async getOperatorMaterialRequests(request: FastifyRequest, reply: FastifyReply) {
    const data = await dashboardsService.getOperatorMaterialRequests(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async callWarehouseRunner(request: FastifyRequest, reply: FastifyReply) {
    const body = (request.body as any) || {};
    const data = await dashboardsService.callWarehouseRunner(request.user.tenantId, body);
    return reply.code(201).send(formatSuccess(data, data.message));
  }

  async submitMaterialRequisition(request: FastifyRequest, reply: FastifyReply) {
    const body = (request.body as any) || {};
    const data = await dashboardsService.submitMaterialRequisition(request.user.tenantId, body);
    return reply.code(201).send(formatSuccess(data, data.message));
  }

  async confirmMaterialReceipt(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const data = await dashboardsService.confirmMaterialReceipt(request.user.tenantId, id);
    return reply.send(formatSuccess(data, data.message));
  }

  // ─── Operator Barcode & QR Scan ─────────────────────────────────────────────
  async getBarcodeScanStatus(request: FastifyRequest, reply: FastifyReply) {
    const data = await dashboardsService.getBarcodeScanStatus(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async parseBarcode(request: FastifyRequest, reply: FastifyReply) {
    const body = (request.body as any) || {};
    const data = await dashboardsService.parseBarcode(request.user.tenantId, body);
    return reply.send(formatSuccess(data));
  }

  async attachLotToBatch(request: FastifyRequest, reply: FastifyReply) {
    const body = (request.body as any) || {};
    const data = await dashboardsService.attachLotToBatch(request.user.tenantId, body);
    return reply.code(201).send(formatSuccess(data, data.message));
  }

  // ─── Operator Report Issue & Safety Exception ──────────────────────────────
  async getReportIssueStatus(request: FastifyRequest, reply: FastifyReply) {
    const data = await dashboardsService.getReportIssueStatus(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async submitReportIssue(request: FastifyRequest, reply: FastifyReply) {
    const body = (request.body as any) || {};
    const data = await dashboardsService.submitReportIssue(request.user.tenantId, body);
    return reply.code(201).send(formatSuccess(data, data.message));
  }

  async triggerEmergencyCall(request: FastifyRequest, reply: FastifyReply) {
    const body = (request.body as any) || {};
    const data = await dashboardsService.triggerEmergencyCall(request.user.tenantId, body);
    return reply.code(201).send(formatSuccess(data, data.message));
  }

  // ─── Operator Shift Handoff ─────────────────────────────────────────────────
  async getShiftHandoffs(request: FastifyRequest, reply: FastifyReply) {
    const data = await dashboardsService.getShiftHandoffs(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async submitShiftHandoff(request: FastifyRequest, reply: FastifyReply) {
    const body = (request.body as any) || {};
    const data = await dashboardsService.submitShiftHandoff(request.user.tenantId, body);
    return reply.code(201).send(formatSuccess(data, data.message));
  }

  // ─── Operator Notifications ─────────────────────────────────────────────────
  async getOperatorNotifications(request: FastifyRequest, reply: FastifyReply) {
    const data = await dashboardsService.getOperatorNotifications(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async markOperatorNotificationRead(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const data = await dashboardsService.markOperatorNotificationRead(request.user.tenantId, parseInt(id, 10));
    return reply.send(formatSuccess(data, data.message));
  }

  async markAllOperatorNotificationsRead(request: FastifyRequest, reply: FastifyReply) {
    const data = await dashboardsService.markAllOperatorNotificationsRead(request.user.tenantId);
    return reply.send(formatSuccess(data, data.message));
  }

  async deleteOperatorNotification(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const data = await dashboardsService.deleteOperatorNotification(request.user.tenantId, parseInt(id, 10));
    return reply.send(formatSuccess(data, data.message));
  }

  async clearAllOperatorNotifications(request: FastifyRequest, reply: FastifyReply) {
    const data = await dashboardsService.clearAllOperatorNotifications(request.user.tenantId);
    return reply.send(formatSuccess(data, data.message));
  }

  // ─── Operator Profile ────────────────────────────────────────────────────────
  async getOperatorProfile(request: FastifyRequest, reply: FastifyReply) {
    const data = await dashboardsService.getOperatorProfile(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async updateOperatorProfile(request: FastifyRequest, reply: FastifyReply) {
    const body = (request.body as any) || {};
    const data = await dashboardsService.updateOperatorProfile(request.user.tenantId, body);
    return reply.send(formatSuccess(data, data.message));
  }

  // ─── Operations Supervisor Command Center ──────────────────────────────────
  async getSupervisorDashboard(request: FastifyRequest, reply: FastifyReply) {
    const data = await dashboardsService.getSupervisorDashboard(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async authorizeSupervisorShift(request: FastifyRequest, reply: FastifyReply) {
    const body = (request.body as any) || {};
    const data = await dashboardsService.authorizeSupervisorShift(request.user.tenantId, body);
    return reply.code(201).send(formatSuccess(data, data.message));
  }

  // ─── Operations Supervisor Department Run Schedule ─────────────────────────
  async getSupervisorDeptSchedule(request: FastifyRequest, reply: FastifyReply) {
    const data = await dashboardsService.getSupervisorDeptSchedule(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async resequenceSupervisorDeptSchedule(request: FastifyRequest, reply: FastifyReply) {
    const data = await dashboardsService.resequenceSupervisorDeptSchedule(request.user.tenantId);
    return reply.send(formatSuccess(data, data.message));
  }

  async authorizeSupervisorDeptSchedule(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const data = await dashboardsService.authorizeSupervisorDeptSchedule(request.user.tenantId, id);
    return reply.send(formatSuccess(data, data.message));
  }

  async pauseSupervisorDeptSchedule(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const data = await dashboardsService.pauseSupervisorDeptSchedule(request.user.tenantId, id);
    return reply.send(formatSuccess(data, data.message));
  }

  async resumeSupervisorDeptSchedule(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const data = await dashboardsService.resumeSupervisorDeptSchedule(request.user.tenantId, id);
    return reply.send(formatSuccess(data, data.message));
  }

  // ─── Operations Supervisor Workforce / Employee List ───────────────────────
  async getSupervisorWorkforce(request: FastifyRequest, reply: FastifyReply) {
    const data = await dashboardsService.getSupervisorWorkforce(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async addSupervisorWorkforceEmployee(request: FastifyRequest, reply: FastifyReply) {
    const body = (request.body as any) || {};
    const data = await dashboardsService.addSupervisorWorkforceEmployee(request.user.tenantId, body);
    return reply.code(201).send(formatSuccess(data, data.message));
  }

  async updateSupervisorWorkforceEmployee(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const body = (request.body as any) || {};
    const data = await dashboardsService.updateSupervisorWorkforceEmployee(request.user.tenantId, id, body);
    return reply.send(formatSuccess(data, data.message));
  }

  async assignSupervisorWorkforceSkill(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const body = (request.body as any) || {};
    const data = await dashboardsService.assignSupervisorWorkforceSkill(request.user.tenantId, id, body);
    return reply.send(formatSuccess(data, data.message));
  }

  async assignSupervisorWorkforceTraining(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const body = (request.body as any) || {};
    const data = await dashboardsService.assignSupervisorWorkforceTraining(request.user.tenantId, id, body);
    return reply.send(formatSuccess(data, data.message));
  }

  // ─── Operations Supervisor Labour Time & Allocations ───────────────────────
  async getSupervisorLabourTime(request: FastifyRequest, reply: FastifyReply) {
    const data = await dashboardsService.getSupervisorLabourTime(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async authorizeSupervisorOvertime(request: FastifyRequest, reply: FastifyReply) {
    const body = (request.body as any) || {};
    const data = await dashboardsService.authorizeSupervisorOvertime(request.user.tenantId, body);
    return reply.send(formatSuccess(data, data.message));
  }

  async rebalanceSupervisorCrew(request: FastifyRequest, reply: FastifyReply) {
    const body = (request.body as any) || {};
    const data = await dashboardsService.rebalanceSupervisorCrew(request.user.tenantId, body);
    return reply.send(formatSuccess(data, data.message));
  }

  // ─── Operations Supervisor Live H/B Management ─────────────────────────────
  async getSupervisorLiveHB(request: FastifyRequest, reply: FastifyReply) {
    const data = await dashboardsService.getSupervisorLiveHB(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async logSupervisorHB(request: FastifyRequest, reply: FastifyReply) {
    const body = (request.body as any) || {};
    const data = await dashboardsService.logSupervisorHB(request.user.tenantId, body);
    return reply.code(201).send(formatSuccess(data, data.message));
  }

  async dispatchSupervisorHBBackup(request: FastifyRequest, reply: FastifyReply) {
    const body = (request.body as any) || {};
    const data = await dashboardsService.dispatchSupervisorHBBackup(request.user.tenantId, body);
    return reply.send(formatSuccess(data, data.message));
  }

  // ─── Operations Supervisor Skills & Qualification Matrix ────────────────────
  async getSupervisorSkills(request: FastifyRequest, reply: FastifyReply) {
    const data = await dashboardsService.getSupervisorSkills(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async addSupervisorSkill(request: FastifyRequest, reply: FastifyReply) {
    const body = (request.body as any) || {};
    const data = await dashboardsService.addSupervisorSkill(request.user.tenantId, body);
    return reply.code(201).send(formatSuccess(data, data.message));
  }

  async updateSupervisorSkillLevel(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const body = (request.body as any) || {};
    const data = await dashboardsService.updateSupervisorSkillLevel(request.user.tenantId, id, body);
    return reply.send(formatSuccess(data, data.message));
  }

  // ─── Operations Supervisor Training & Certifications ───────────────────────
  async getSupervisorTraining(request: FastifyRequest, reply: FastifyReply) {
    const data = await dashboardsService.getSupervisorTraining(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async addSupervisorTraining(request: FastifyRequest, reply: FastifyReply) {
    const body = (request.body as any) || {};
    const data = await dashboardsService.addSupervisorTraining(request.user.tenantId, body);
    return reply.code(201).send(formatSuccess(data, data.message));
  }

  async completeSupervisorTraining(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const body = (request.body as any) || {};
    const data = await dashboardsService.completeSupervisorTraining(request.user.tenantId, id, body);
    return reply.send(formatSuccess(data, data.message));
  }

  // ─── Operations Supervisor Labour Productivity ──────────────────────────────
  async getSupervisorProductivity(request: FastifyRequest, reply: FastifyReply) {
    const data = await dashboardsService.getSupervisorProductivity(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  // ─── Operations Supervisor Shift Management & Rostering ────────────────────
  async getSupervisorStaffing(request: FastifyRequest, reply: FastifyReply) {
    const data = await dashboardsService.getSupervisorStaffing(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async addSupervisorStaffing(request: FastifyRequest, reply: FastifyReply) {
    const body = (request.body as any) || {};
    const data = await dashboardsService.addSupervisorStaffing(request.user.tenantId, body);
    return reply.code(201).send(formatSuccess(data, data.message));
  }

  async updateSupervisorStaffing(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const body = (request.body as any) || {};
    const data = await dashboardsService.updateSupervisorStaffing(request.user.tenantId, id, body);
    return reply.send(formatSuccess(data, data.message));
  }

  async assignSupervisorStaffingPersonnel(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const body = (request.body as any) || {};
    const data = await dashboardsService.assignSupervisorStaffingPersonnel(request.user.tenantId, id, body);
    return reply.send(formatSuccess(data, data.message));
  }

  async assignSupervisorStaffingStation(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const body = (request.body as any) || {};
    const data = await dashboardsService.assignSupervisorStaffingStation(request.user.tenantId, id, body);
    return reply.send(formatSuccess(data, data.message));
  }

  async closeSupervisorStaffingShift(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const body = (request.body as any) || {};
    const data = await dashboardsService.closeSupervisorStaffingShift(request.user.tenantId, id, body);
    return reply.send(formatSuccess(data, data.message));
  }

  // ─── Operations Supervisor Production Performance ──────────────────────────
  async setSupervisorProductionSpeedLimit(request: FastifyRequest, reply: FastifyReply) {
    const body = (request.body as any) || {};
    const data = await dashboardsService.setSupervisorProductionSpeedLimit(request.user.tenantId, body);
    return reply.send(formatSuccess(data, data.message));
  }

  async getSupervisorDowntimePareto(request: FastifyRequest, reply: FastifyReply) {
    const data = await dashboardsService.getSupervisorDowntimePareto(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  // ─── Operations Supervisor Quality Quarantine Holds ─────────────────────────
  async getSupervisorHolds(request: FastifyRequest, reply: FastifyReply) {
    const data = await dashboardsService.getSupervisorHolds(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async addSupervisorHoldNote(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const body = (request.body as any) || {};
    const data = await dashboardsService.addSupervisorHoldNote(request.user.tenantId, id, body);
    return reply.send(formatSuccess(data, data.message));
  }

  async requestSupervisorHoldRework(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const body = (request.body as any) || {};
    const data = await dashboardsService.requestSupervisorHoldRework(request.user.tenantId, id, body);
    return reply.send(formatSuccess(data, data.message));
  }

  async authorizeSupervisorHoldRelease(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const body = (request.body as any) || {};
    const data = await dashboardsService.authorizeSupervisorHoldRelease(request.user.tenantId, id, body);
    return reply.send(formatSuccess(data, data.message));
  }

  async scrapSupervisorHoldBatch(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const data = await dashboardsService.scrapSupervisorHoldBatch(request.user.tenantId, id);
    return reply.send(formatSuccess(data, data.message));
  }

  // ─── Operations Supervisor Departmental Recovery Steering ─────────────────
  async getSupervisorRecoveryCountermeasures(request: FastifyRequest, reply: FastifyReply) {
    const data = await dashboardsService.getSupervisorRecoveryCountermeasures(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async authorizeSupervisorRecoveryCountermeasure(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const data = await dashboardsService.authorizeSupervisorRecoveryCountermeasure(request.user.tenantId, id);
    return reply.send(formatSuccess(data, data.message));
  }

  async authorizeAllSupervisorRecoveryCountermeasures(request: FastifyRequest, reply: FastifyReply) {
    const data = await dashboardsService.authorizeAllSupervisorRecoveryCountermeasures(request.user.tenantId);
    return reply.send(formatSuccess(data, data.message));
  }

  // ─── Operations Supervisor Pending Shift Approvals ─────────────────────────
  async getSupervisorApprovals(request: FastifyRequest, reply: FastifyReply) {
    const data = await dashboardsService.getSupervisorApprovals(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async approveSupervisorApproval(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const body = (request.body as any) || {};
    const data = await dashboardsService.approveSupervisorApproval(request.user.tenantId, id, body);
    return reply.send(formatSuccess(data, data.message));
  }

  async rejectSupervisorApproval(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const data = await dashboardsService.rejectSupervisorApproval(request.user.tenantId, id);
    return reply.send(formatSuccess(data, data.message));
  }

  async clarifySupervisorApproval(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const data = await dashboardsService.clarifySupervisorApproval(request.user.tenantId, id);
    return reply.send(formatSuccess(data, data.message));
  }

  async bulkApproveSupervisorApprovals(request: FastifyRequest, reply: FastifyReply) {
    const data = await dashboardsService.bulkApproveSupervisorApprovals(request.user.tenantId);
    return reply.send(formatSuccess(data, data.message));
  }

  // ─── Operations Supervisor Reports ─────────────────────────────────────────
  async getSupervisorReportsList(request: FastifyRequest, reply: FastifyReply) {
    const data = await dashboardsService.getSupervisorReportsList(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async printSupervisorReport(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const data = await dashboardsService.printSupervisorReport(request.user.tenantId, id);
    return reply.send(formatSuccess(data, data.message));
  }

  // ─── Operations Supervisor Notifications ───────────────────────────────────
  async getSupervisorNotificationsList(request: FastifyRequest, reply: FastifyReply) {
    const data = await dashboardsService.getSupervisorNotificationsList(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async markSupervisorNotificationRead(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const data = await dashboardsService.markSupervisorNotificationRead(request.user.tenantId, id);
    return reply.send(formatSuccess(data, data.message));
  }

  async deleteSupervisorNotification(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const data = await dashboardsService.deleteSupervisorNotification(request.user.tenantId, id);
    return reply.send(formatSuccess(data, data.message));
  }

  async markAllSupervisorNotificationsRead(request: FastifyRequest, reply: FastifyReply) {
    const data = await dashboardsService.markAllSupervisorNotificationsRead(request.user.tenantId);
    return reply.send(formatSuccess(data, data.message));
  }

  async clearAllSupervisorNotifications(request: FastifyRequest, reply: FastifyReply) {
    const data = await dashboardsService.clearAllSupervisorNotifications(request.user.tenantId);
    return reply.send(formatSuccess(data, data.message));
  }

  // ─── Operations Supervisor Profile ───────────────────────────────────────
  async getSupervisorProfile(request: FastifyRequest, reply: FastifyReply) {
    const data = await dashboardsService.getSupervisorProfile(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async updateSupervisorProfile(request: FastifyRequest, reply: FastifyReply) {
    const body = (request.body as any) || {};
    const data = await dashboardsService.updateSupervisorProfile(request.user.tenantId, body);
    return reply.send(formatSuccess(data, data.message));
  }
}

export const dashboardsController = new DashboardsController();




