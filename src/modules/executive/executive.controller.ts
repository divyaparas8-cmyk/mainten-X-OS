import { FastifyRequest, FastifyReply } from "fastify";
import { executiveService } from "./executive.service.js";
import { formatSuccess } from "../../shared/utils/responseFormatter.js";

export class ExecutiveController {
  async getDashboardSummary(request: FastifyRequest, reply: FastifyReply) {
    const data = await executiveService.getDashboardSummary(request.user.tenantId, (request.query as any)?.plantId);
    return reply.send(formatSuccess(data));
  }

  async syncDashboardData(request: FastifyRequest, reply: FastifyReply) {
    const data = await executiveService.syncDashboardData(request.user.tenantId, request.body, request.user.userId);
    return reply.send(formatSuccess(data, data.message));
  }

  async exportBoardReport(request: FastifyRequest, reply: FastifyReply) {
    const data = await executiveService.exportBoardReport(request.user.tenantId, request.body, request.user.userId);
    return reply.send(formatSuccess(data, data.message));
  }

  async approveAiRecommendation(request: FastifyRequest, reply: FastifyReply) {
    const data = await executiveService.approveAiRecommendation(request.user.tenantId, request.body, request.user.userId);
    return reply.send(formatSuccess(data, data.message));
  }

  async getMultiPlantKpis(request: FastifyRequest, reply: FastifyReply) {
    const data = await executiveService.getMultiPlantKpis(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async initiatePlantAudit(request: FastifyRequest, reply: FastifyReply) {
    const data = await executiveService.initiatePlantAudit(request.user.tenantId, request.body, request.user.userId);
    return reply.send(formatSuccess(data, data.message));
  }

  async getManufacturingCosts(request: FastifyRequest, reply: FastifyReply) {
    const batchId = (request.query as any)?.batchId;
    const data = await executiveService.getManufacturingCosts(request.user.tenantId, batchId);
    return reply.send(formatSuccess(data));
  }

  async getCostVariance(request: FastifyRequest, reply: FastifyReply) {
    const data = await executiveService.getCostVariance(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async validateVarianceTargets(request: FastifyRequest, reply: FastifyReply) {
    const data = await executiveService.validateVarianceTargets(request.user.tenantId, request.body, request.user.userId);
    return reply.send(formatSuccess(data, data.message));
  }

  async getMaterialCosts(request: FastifyRequest, reply: FastifyReply) {
    const data = await executiveService.getMaterialCosts(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async updateContractRates(request: FastifyRequest, reply: FastifyReply) {
    const data = await executiveService.updateContractRates(request.user.tenantId, request.body, request.user.userId);
    return reply.send(formatSuccess(data, data.message));
  }

  async getLabourCosts(request: FastifyRequest, reply: FastifyReply) {
    const data = await executiveService.getLabourCosts(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async auditLabourAllocation(request: FastifyRequest, reply: FastifyReply) {
    const data = await executiveService.auditLabourAllocation(request.user.tenantId, request.body, request.user.userId);
    return reply.send(formatSuccess(data, data.message));
  }

  async getMachineCosts(request: FastifyRequest, reply: FastifyReply) {
    const data = await executiveService.getMachineCosts(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async auditMachineEfficiency(request: FastifyRequest, reply: FastifyReply) {
    const data = await executiveService.auditMachineEfficiency(request.user.tenantId, request.body, request.user.userId);
    return reply.send(formatSuccess(data, data.message));
  }

  async getScrapReworkCosts(request: FastifyRequest, reply: FastifyReply) {
    const data = await executiveService.getScrapReworkCosts(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async auditScrapEvent(request: FastifyRequest, reply: FastifyReply) {
    const data = await executiveService.auditScrapEvent(request.user.tenantId, request.body, request.user.userId);
    return reply.send(formatSuccess(data, data.message));
  }

  async getCiSavings(request: FastifyRequest, reply: FastifyReply) {
    const data = await executiveService.getCiSavings(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async verifyCiProjectSavings(request: FastifyRequest, reply: FastifyReply) {
    const data = await executiveService.verifyCiProjectSavings(request.user.tenantId, request.body, request.user.userId);
    return reply.send(formatSuccess(data, data.message));
  }

  async getBusinessTrends(request: FastifyRequest, reply: FastifyReply) {
    const data = await executiveService.getBusinessTrends(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async simulateBusinessTrends(request: FastifyRequest, reply: FastifyReply) {
    const data = await executiveService.simulateBusinessTrends(request.user.tenantId, request.body, request.user.userId);
    return reply.send(formatSuccess(data, data.message));
  }

  async getCustomerDemand(request: FastifyRequest, reply: FastifyReply) {
    const data = await executiveService.getCustomerDemand(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async syncCustomerDemand(request: FastifyRequest, reply: FastifyReply) {
    const data = await executiveService.syncCustomerDemand(request.user.tenantId, request.body, request.user.userId);
    return reply.send(formatSuccess(data, data.message));
  }

  async getServiceLevel(request: FastifyRequest, reply: FastifyReply) {
    const data = await executiveService.getServiceLevel(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async getShipmentPerformance(request: FastifyRequest, reply: FastifyReply) {
    const data = await executiveService.getShipmentPerformance(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async getRisks(request: FastifyRequest, reply: FastifyReply) {
    const data = await executiveService.getRisks(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async addRisk(request: FastifyRequest, reply: FastifyReply) {
    const data = await executiveService.addRisk(request.user.tenantId, request.body, request.user.userId);
    return reply.send(formatSuccess(data, data.message));
  }

  async mitigateRisk(request: FastifyRequest, reply: FastifyReply) {
    const data = await executiveService.mitigateRisk(request.user.tenantId, request.body, request.user.userId);
    return reply.send(formatSuccess(data, data.message));
  }

  async getOpportunities(request: FastifyRequest, reply: FastifyReply) {
    const data = await executiveService.getOpportunities(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async approveOpportunity(request: FastifyRequest, reply: FastifyReply) {
    const data = await executiveService.approveOpportunity(request.user.tenantId, request.body, request.user.userId);
    return reply.send(formatSuccess(data, data.message));
  }

  async getAiBriefing(request: FastifyRequest, reply: FastifyReply) {
    const data = await executiveService.getAiBriefing(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async generateAiBriefing(request: FastifyRequest, reply: FastifyReply) {
    const data = await executiveService.generateAiBriefing(request.user.tenantId, request.body, request.user.userId);
    return reply.send(formatSuccess(data, data.message));
  }

  async getReports(request: FastifyRequest, reply: FastifyReply) {
    const data = await executiveService.getReports(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async exportReport(request: FastifyRequest, reply: FastifyReply) {
    const data = await executiveService.exportReport(request.user.tenantId, request.body, request.user.userId);
    return reply.send(formatSuccess(data, data.message));
  }

  async getNotifications(request: FastifyRequest, reply: FastifyReply) {
    const data = await executiveService.getNotifications(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async markNotificationRead(request: FastifyRequest, reply: FastifyReply) {
    const data = await executiveService.markNotificationRead(request.user.tenantId, request.body, request.user.userId);
    return reply.send(formatSuccess(data, data.message));
  }

  async markAllNotificationsRead(request: FastifyRequest, reply: FastifyReply) {
    const data = await executiveService.markAllNotificationsRead(request.user.tenantId, request.body, request.user.userId);
    return reply.send(formatSuccess(data, data.message));
  }

  async deleteNotification(request: FastifyRequest, reply: FastifyReply) {
    const data = await executiveService.deleteNotification(request.user.tenantId, request.body, request.user.userId);
    return reply.send(formatSuccess(data, data.message));
  }

  async clearAllNotifications(request: FastifyRequest, reply: FastifyReply) {
    const data = await executiveService.clearAllNotifications(request.user.tenantId, request.body, request.user.userId);
    return reply.send(formatSuccess(data, data.message));
  }

  async getProfile(request: FastifyRequest, reply: FastifyReply) {
    const data = await executiveService.getProfile(request.user.tenantId, request.user.userId);
    return reply.send(formatSuccess(data));
  }

  async updateProfile(request: FastifyRequest, reply: FastifyReply) {
    const data = await executiveService.updateProfile(request.user.tenantId, request.body, request.user.userId);
    return reply.send(formatSuccess(data, data.message));
  }
}

export const executiveController = new ExecutiveController();
