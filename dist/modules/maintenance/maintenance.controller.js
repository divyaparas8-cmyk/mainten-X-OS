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
    async createWorkOrder(request, reply) {
        const input = maintenance_schema_js_1.createWorkOrderSchema.parse(request.body);
        const plantId = await (0, tenantContext_js_1.resolvePlantId)(request.user.tenantId, request.user.plantId);
        const data = await maintenance_service_js_1.maintenanceService.createWorkOrder(request.user.tenantId, plantId, input, request.user.userId);
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, "Maintenance Work Order created"));
    }
    async updateWorkOrderStatus(request, reply) {
        const input = maintenance_schema_js_1.updateWorkOrderStatusSchema.parse(request.body);
        const data = await maintenance_service_js_1.maintenanceService.updateWorkOrderStatus(request.user.tenantId, request.params.id, input);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, `Work Order status updated to ${input.status}`));
    }
    async getPMSchedules(request, reply) {
        const data = await maintenance_service_js_1.maintenanceService.listPMSchedules(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async getSpareParts(request, reply) {
        const data = await maintenance_service_js_1.maintenanceService.listSpareParts(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async getReliabilityMetrics(request, reply) {
        const data = await maintenance_service_js_1.maintenanceService.getReliabilityMetrics(request.user.tenantId, request.user.plantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
}
exports.MaintenanceController = MaintenanceController;
exports.maintenanceController = new MaintenanceController();
//# sourceMappingURL=maintenance.controller.js.map