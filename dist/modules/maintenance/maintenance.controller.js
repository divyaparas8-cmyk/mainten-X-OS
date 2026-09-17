"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maintenanceController = exports.MaintenanceController = void 0;
const maintenance_service_js_1 = require("./maintenance.service.js");
const maintenance_schema_js_1 = require("./maintenance.schema.js");
const responseFormatter_js_1 = require("../../shared/utils/responseFormatter.js");
const tenantContext_js_1 = require("../../shared/utils/tenantContext.js");
class MaintenanceController {
    async getWorkOrders(request, reply) {
        const plantId = await (0, tenantContext_js_1.resolvePlantId)(request.user.tenantId, request.user.plantId);
        const data = await maintenance_service_js_1.maintenanceService.listWorkOrders(request.user.tenantId, plantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async getBreakdowns(request, reply) {
        const plantId = await (0, tenantContext_js_1.resolvePlantId)(request.user.tenantId, request.user.plantId);
        const data = await maintenance_service_js_1.maintenanceService.listBreakdowns(request.user.tenantId, plantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async reportBreakdown(request, reply) {
        const plantId = await (0, tenantContext_js_1.resolvePlantId)(request.user.tenantId, request.user.plantId);
        const data = await maintenance_service_js_1.maintenanceService.reportBreakdown(request.user.tenantId, plantId, request.body, request.user.userId);
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, "Breakdown logged and emergency repair ticket dispatched"));
    }
    async updateBreakdown(request, reply) {
        const data = await maintenance_service_js_1.maintenanceService.updateBreakdown(request.user.tenantId, request.params.id, request.body);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, `Breakdown ${request.params.id} updated successfully`));
    }
    async resolveBreakdown(request, reply) {
        const data = await maintenance_service_js_1.maintenanceService.resolveBreakdown(request.user.tenantId, request.params.id, request.body);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, `Breakdown ${request.params.id} resolved and equipment restored`));
    }
    async deleteBreakdown(request, reply) {
        const data = await maintenance_service_js_1.maintenanceService.deleteBreakdown(request.user.tenantId, request.params.id);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, `Breakdown record deleted`));
    }
    async getHistory(request, reply) {
        const plantId = await (0, tenantContext_js_1.resolvePlantId)(request.user.tenantId, request.user.plantId);
        const data = await maintenance_service_js_1.maintenanceService.listHistory(request.user.tenantId, plantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async exportHistory(request, reply) {
        const data = await maintenance_service_js_1.maintenanceService.exportHistoryDossier(request.user.tenantId, request.params.id);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, `History dossier exported successfully for ${request.params.id}`));
    }
    async updateAsset(request, reply) {
        const data = await maintenance_service_js_1.maintenanceService.updateAsset(request.user.tenantId, request.params.id, request.body);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, `Asset ${request.params.id} updated successfully`));
    }
    async getTroubleshooting(request, reply) {
        const data = await maintenance_service_js_1.maintenanceService.listTroubleshooting(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async saveTroubleshootingStep(request, reply) {
        const data = await maintenance_service_js_1.maintenanceService.saveTroubleshootingStep(request.user.tenantId, request.body);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Troubleshooting step recorded"));
    }
    async saveTroubleshootingDraft(request, reply) {
        const data = await maintenance_service_js_1.maintenanceService.saveTroubleshootingDraft(request.user.tenantId, request.body);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Troubleshooting draft saved"));
    }
    async saveTroubleshootingSolution(request, reply) {
        const data = await maintenance_service_js_1.maintenanceService.saveTroubleshootingSolution(request.user.tenantId, request.body);
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, "Troubleshooting solution saved successfully"));
    }
    async createWorkOrder(request, reply) {
        const input = maintenance_schema_js_1.createWorkOrderSchema.parse(request.body);
        const plantId = await (0, tenantContext_js_1.resolvePlantId)(request.user.tenantId, request.user.plantId);
        const data = await maintenance_service_js_1.maintenanceService.createWorkOrder(request.user.tenantId, plantId, input, request.user.userId);
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, "Maintenance Work Order created"));
    }
    async updateWorkOrderStatus(request, reply) {
        const tenantId = request.user?.tenantId || "aa3183d2-709b-42a8-add1-b2e4b2d873b0";
        const input = maintenance_schema_js_1.updateWorkOrderStatusSchema.parse(request.body);
        const data = await maintenance_service_js_1.maintenanceService.updateWorkOrderStatus(tenantId, request.params.id, input);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, `Work Order status updated to ${input.status}`));
    }
    async updateWorkOrder(request, reply) {
        const tenantId = request.user?.tenantId || "aa3183d2-709b-42a8-add1-b2e4b2d873b0";
        const data = await maintenance_service_js_1.maintenanceService.updateWorkOrder(tenantId, request.params.id, request.body);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, `Work Order ${request.params.id} updated successfully`));
    }
    async deleteWorkOrder(request, reply) {
        const tenantId = request.user?.tenantId || "aa3183d2-709b-42a8-add1-b2e4b2d873b0";
        const data = await maintenance_service_js_1.maintenanceService.deleteWorkOrder(tenantId, request.params.id);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, `Work Order ${request.params.id} deleted successfully`));
    }
    async getPMSchedules(request, reply) {
        const data = await maintenance_service_js_1.maintenanceService.listPMSchedules(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async createPMSchedule(request, reply) {
        const body = request.body;
        const plantId = await (0, tenantContext_js_1.resolvePlantId)(request.user.tenantId, request.user.plantId);
        const data = await maintenance_service_js_1.maintenanceService.createPMSchedule(request.user.tenantId, plantId, body);
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, "PM Schedule created successfully"));
    }
    async updatePMSchedule(request, reply) {
        const { id } = request.params;
        const data = await maintenance_service_js_1.maintenanceService.updatePMSchedule(request.user.tenantId, id, request.body);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "PM Schedule updated successfully"));
    }
    async deletePMSchedule(request, reply) {
        const { id } = request.params;
        const data = await maintenance_service_js_1.maintenanceService.deletePMSchedule(request.user.tenantId, id);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "PM Schedule deleted successfully"));
    }
    async executePMChecklist(request, reply) {
        const plantId = await (0, tenantContext_js_1.resolvePlantId)(request.user.tenantId, request.user.plantId);
        const data = await maintenance_service_js_1.maintenanceService.executePMChecklist(request.user.tenantId, plantId, request.body);
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, "PM Checklist executed & signed off successfully"));
    }
    async savePMChecklistDraft(request, reply) {
        const plantId = await (0, tenantContext_js_1.resolvePlantId)(request.user.tenantId, request.user.plantId);
        const data = await maintenance_service_js_1.maintenanceService.savePMChecklistDraft(request.user.tenantId, plantId, request.body);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "PM Checklist draft saved successfully"));
    }
    async getPM(request, reply) {
        const data = await maintenance_service_js_1.maintenanceService.listPM(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async getCalendar(request, reply) {
        const data = await maintenance_service_js_1.maintenanceService.listCalendar(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async getNotifications(request, reply) {
        const data = await maintenance_service_js_1.maintenanceService.listNotifications(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async markNotificationRead(request, reply) {
        const data = await maintenance_service_js_1.maintenanceService.markNotificationRead(request.params.id);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Notification marked as read"));
    }
    async markAllNotificationsRead(request, reply) {
        const data = await maintenance_service_js_1.maintenanceService.markAllNotificationsRead(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "All notifications marked as read"));
    }
    async clearNotifications(request, reply) {
        const data = await maintenance_service_js_1.maintenanceService.clearNotifications(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "All notifications cleared"));
    }
    async getProfile(request, reply) {
        const userId = request.user?.userId || request.user?.id;
        const userEmail = request.user?.email;
        const data = await maintenance_service_js_1.maintenanceService.listProfile(request.user.tenantId, userId, userEmail);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async updateProfile(request, reply) {
        const userId = request.user?.userId || request.user?.id;
        const data = await maintenance_service_js_1.maintenanceService.updateProfile(request.user.tenantId, userId, request.body);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Profile updated successfully"));
    }
    async getSpareParts(request, reply) {
        const tenantId = request.user?.tenantId || "aa3183d2-709b-42a8-add1-b2e4b2d873b0";
        const data = await maintenance_service_js_1.maintenanceService.listSpareParts(tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async createSparePart(request, reply) {
        const tenantId = request.user?.tenantId || "aa3183d2-709b-42a8-add1-b2e4b2d873b0";
        const data = await maintenance_service_js_1.maintenanceService.createSparePart(tenantId, request.body);
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, "Spare part created successfully"));
    }
    async updateSparePart(request, reply) {
        const tenantId = request.user?.tenantId || "aa3183d2-709b-42a8-add1-b2e4b2d873b0";
        const data = await maintenance_service_js_1.maintenanceService.updateSparePart(tenantId, request.params.id, request.body);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Spare part updated successfully"));
    }
    async deleteSparePart(request, reply) {
        const tenantId = request.user?.tenantId || "aa3183d2-709b-42a8-add1-b2e4b2d873b0";
        const data = await maintenance_service_js_1.maintenanceService.deleteSparePart(tenantId, request.params.id);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Spare part deleted successfully"));
    }
    async getCalibrations(request, reply) {
        const tenantId = request.user?.tenantId || "aa3183d2-709b-42a8-add1-b2e4b2d873b0";
        const data = await maintenance_service_js_1.maintenanceService.listCalibrations(tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async createCalibration(request, reply) {
        const tenantId = request.user?.tenantId || "aa3183d2-709b-42a8-add1-b2e4b2d873b0";
        const data = await maintenance_service_js_1.maintenanceService.createCalibration(tenantId, request.body);
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, "Calibration recorded successfully"));
    }
    async getReliabilityMetrics(request, reply) {
        const data = await maintenance_service_js_1.maintenanceService.getReliabilityMetrics(request.user.tenantId, request.user.plantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async getRCAInvestigations(request, reply) {
        const data = await maintenance_service_js_1.maintenanceService.getRCAInvestigations(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "RCA investigations fetched successfully"));
    }
    async createRCAInvestigation(request, reply) {
        const data = await maintenance_service_js_1.maintenanceService.createRCAInvestigation(request.user.tenantId, request.body);
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, "RCA investigation created successfully"));
    }
    async exportReliabilityReport(request, reply) {
        const data = await maintenance_service_js_1.maintenanceService.exportReliabilityReport(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Reliability analytics report exported successfully"));
    }
    async saveWorkOrderExecution(request, reply) {
        const { id } = request.params;
        const tenantId = request.user?.tenantId || "aa3183d2-709b-42a8-add1-b2e4b2d873b0";
        const data = await maintenance_service_js_1.maintenanceService.saveWorkOrderExecution(tenantId, id, request.body);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Repair actions and verification test results saved successfully"));
    }
    async issueWorkOrderPart(request, reply) {
        const { id } = (request.params || {});
        const tenantId = request.user?.tenantId || "aa3183d2-709b-42a8-add1-b2e4b2d873b0";
        const body = (request.body || {});
        const data = await maintenance_service_js_1.maintenanceService.issueWorkOrderPart(tenantId, { workOrderId: id, ...body });
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, "Spare part issued successfully to work order"));
    }
    async signOffWorkOrder(request, reply) {
        const { id } = request.params;
        const tenantId = request.user?.tenantId || "aa3183d2-709b-42a8-add1-b2e4b2d873b0";
        const data = await maintenance_service_js_1.maintenanceService.signOffWorkOrder(tenantId, id, request.body);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Work order verified and signed off successfully"));
    }
    async addWorkOrderComment(request, reply) {
        const { id } = request.params;
        const tenantId = request.user?.tenantId || "aa3183d2-709b-42a8-add1-b2e4b2d873b0";
        const data = await maintenance_service_js_1.maintenanceService.addWorkOrderComment(tenantId, id, request.body);
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, "Comment logged to work order activity trail"));
    }
    async getReports(request, reply) {
        const tenantId = request.user?.tenantId;
        const data = await maintenance_service_js_1.maintenanceService.listReports(tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async getReportsSummary(request, reply) {
        const tenantId = request.user?.tenantId;
        const data = await maintenance_service_js_1.maintenanceService.getReportsSummary(tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async createReport(request, reply) {
        const tenantId = request.user?.tenantId;
        const userId = request.user?.userId;
        const data = await maintenance_service_js_1.maintenanceService.createReport(tenantId, request.body, userId);
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, "Maintenance report template created successfully"));
    }
    async updateReport(request, reply) {
        const tenantId = request.user?.tenantId;
        const data = await maintenance_service_js_1.maintenanceService.updateReport(tenantId, request.params.id, request.body);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Maintenance report template updated successfully"));
    }
    async deleteReport(request, reply) {
        const tenantId = request.user?.tenantId;
        const data = await maintenance_service_js_1.maintenanceService.deleteReport(tenantId, request.params.id);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Maintenance report template deleted successfully"));
    }
    async generateReport(request, reply) {
        const tenantId = request.user?.tenantId;
        const format = request.body?.format || "CSV";
        const data = await maintenance_service_js_1.maintenanceService.generateReport(tenantId, request.params.id, format);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Report data generated successfully"));
    }
}
exports.MaintenanceController = MaintenanceController;
exports.maintenanceController = new MaintenanceController();
