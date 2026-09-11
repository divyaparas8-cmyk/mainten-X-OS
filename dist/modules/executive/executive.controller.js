"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executiveController = exports.ExecutiveController = void 0;
const executive_service_js_1 = require("./executive.service.js");
const responseFormatter_js_1 = require("../../shared/utils/responseFormatter.js");
class ExecutiveController {
    async getDashboardSummary(request, reply) {
        const data = await executive_service_js_1.executiveService.getDashboardSummary(request.user.tenantId, request.query?.plantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async syncDashboardData(request, reply) {
        const data = await executive_service_js_1.executiveService.syncDashboardData(request.user.tenantId, request.body, request.user.userId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async exportBoardReport(request, reply) {
        const data = await executive_service_js_1.executiveService.exportBoardReport(request.user.tenantId, request.body, request.user.userId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async approveAiRecommendation(request, reply) {
        const data = await executive_service_js_1.executiveService.approveAiRecommendation(request.user.tenantId, request.body, request.user.userId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async getMultiPlantKpis(request, reply) {
        const data = await executive_service_js_1.executiveService.getMultiPlantKpis(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async initiatePlantAudit(request, reply) {
        const data = await executive_service_js_1.executiveService.initiatePlantAudit(request.user.tenantId, request.body, request.user.userId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async getManufacturingCosts(request, reply) {
        const batchId = request.query?.batchId;
        const data = await executive_service_js_1.executiveService.getManufacturingCosts(request.user.tenantId, batchId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async getCostVariance(request, reply) {
        const data = await executive_service_js_1.executiveService.getCostVariance(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async validateVarianceTargets(request, reply) {
        const data = await executive_service_js_1.executiveService.validateVarianceTargets(request.user.tenantId, request.body, request.user.userId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async getMaterialCosts(request, reply) {
        const data = await executive_service_js_1.executiveService.getMaterialCosts(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async updateContractRates(request, reply) {
        const data = await executive_service_js_1.executiveService.updateContractRates(request.user.tenantId, request.body, request.user.userId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async getLabourCosts(request, reply) {
        const data = await executive_service_js_1.executiveService.getLabourCosts(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async auditLabourAllocation(request, reply) {
        const data = await executive_service_js_1.executiveService.auditLabourAllocation(request.user.tenantId, request.body, request.user.userId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async getMachineCosts(request, reply) {
        const data = await executive_service_js_1.executiveService.getMachineCosts(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async auditMachineEfficiency(request, reply) {
        const data = await executive_service_js_1.executiveService.auditMachineEfficiency(request.user.tenantId, request.body, request.user.userId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async getScrapReworkCosts(request, reply) {
        const data = await executive_service_js_1.executiveService.getScrapReworkCosts(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async auditScrapEvent(request, reply) {
        const data = await executive_service_js_1.executiveService.auditScrapEvent(request.user.tenantId, request.body, request.user.userId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async getCiSavings(request, reply) {
        const data = await executive_service_js_1.executiveService.getCiSavings(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async verifyCiProjectSavings(request, reply) {
        const data = await executive_service_js_1.executiveService.verifyCiProjectSavings(request.user.tenantId, request.body, request.user.userId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async getBusinessTrends(request, reply) {
        const data = await executive_service_js_1.executiveService.getBusinessTrends(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async simulateBusinessTrends(request, reply) {
        const data = await executive_service_js_1.executiveService.simulateBusinessTrends(request.user.tenantId, request.body, request.user.userId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async getCustomerDemand(request, reply) {
        const data = await executive_service_js_1.executiveService.getCustomerDemand(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async syncCustomerDemand(request, reply) {
        const data = await executive_service_js_1.executiveService.syncCustomerDemand(request.user.tenantId, request.body, request.user.userId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async getServiceLevel(request, reply) {
        const data = await executive_service_js_1.executiveService.getServiceLevel(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async getShipmentPerformance(request, reply) {
        const data = await executive_service_js_1.executiveService.getShipmentPerformance(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async getRisks(request, reply) {
        const data = await executive_service_js_1.executiveService.getRisks(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async addRisk(request, reply) {
        const data = await executive_service_js_1.executiveService.addRisk(request.user.tenantId, request.body, request.user.userId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async mitigateRisk(request, reply) {
        const data = await executive_service_js_1.executiveService.mitigateRisk(request.user.tenantId, request.body, request.user.userId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async getOpportunities(request, reply) {
        const data = await executive_service_js_1.executiveService.getOpportunities(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async approveOpportunity(request, reply) {
        const data = await executive_service_js_1.executiveService.approveOpportunity(request.user.tenantId, request.body, request.user.userId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async getAiBriefing(request, reply) {
        const data = await executive_service_js_1.executiveService.getAiBriefing(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async generateAiBriefing(request, reply) {
        const data = await executive_service_js_1.executiveService.generateAiBriefing(request.user.tenantId, request.body, request.user.userId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async getReports(request, reply) {
        const data = await executive_service_js_1.executiveService.getReports(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async exportReport(request, reply) {
        const data = await executive_service_js_1.executiveService.exportReport(request.user.tenantId, request.body, request.user.userId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async getNotifications(request, reply) {
        const data = await executive_service_js_1.executiveService.getNotifications(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async markNotificationRead(request, reply) {
        const data = await executive_service_js_1.executiveService.markNotificationRead(request.user.tenantId, request.body, request.user.userId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async markAllNotificationsRead(request, reply) {
        const data = await executive_service_js_1.executiveService.markAllNotificationsRead(request.user.tenantId, request.body, request.user.userId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async deleteNotification(request, reply) {
        const data = await executive_service_js_1.executiveService.deleteNotification(request.user.tenantId, request.body, request.user.userId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async clearAllNotifications(request, reply) {
        const data = await executive_service_js_1.executiveService.clearAllNotifications(request.user.tenantId, request.body, request.user.userId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async getProfile(request, reply) {
        const data = await executive_service_js_1.executiveService.getProfile(request.user.tenantId, request.user.userId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async updateProfile(request, reply) {
        const data = await executive_service_js_1.executiveService.updateProfile(request.user.tenantId, request.body, request.user.userId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
}
exports.ExecutiveController = ExecutiveController;
exports.executiveController = new ExecutiveController();
//# sourceMappingURL=executive.controller.js.map