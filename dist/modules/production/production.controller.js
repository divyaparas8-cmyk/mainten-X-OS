"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productionController = exports.ProductionController = void 0;
const production_service_js_1 = require("./production.service.js");
const responseFormatter_js_1 = require("../../shared/utils/responseFormatter.js");
const tenantContext_js_1 = require("../../shared/utils/tenantContext.js");
class ProductionController {
    async getOrders(request, reply) {
        const tenantId = request.user?.tenantId || request.headers["x-tenant-id"] || "5bce8458-909a-4dd2-b221-614c32ac7c89";
        const plantId = await (0, tenantContext_js_1.resolvePlantId)(tenantId, request.user?.plantId);
        const data = await production_service_js_1.productionService.listOrders(tenantId, plantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async createOrder(request, reply) {
        const body = request.body;
        const tenantId = request.user?.tenantId || request.headers["x-tenant-id"] || "5bce8458-909a-4dd2-b221-614c32ac7c89";
        const plantId = await (0, tenantContext_js_1.resolvePlantId)(tenantId, request.user?.plantId);
        const data = await production_service_js_1.productionService.createOrder(tenantId, plantId, body);
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, "Production Order created & eBR Batch initialized"));
    }
    async updateOrderStatus(request, reply) {
        const { status } = request.body;
        const tenantId = request.user?.tenantId || request.headers["x-tenant-id"] || "5bce8458-909a-4dd2-b221-614c32ac7c89";
        const data = await production_service_js_1.productionService.updateOrderStatus(tenantId, request.params.id, status);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, `Order status advanced to ${status}`));
    }
    async deleteOrder(request, reply) {
        const tenantId = request.user?.tenantId || request.headers["x-tenant-id"] || "5bce8458-909a-4dd2-b221-614c32ac7c89";
        const data = await production_service_js_1.productionService.deleteOrder(tenantId, request.params.id);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Order deleted successfully"));
    }
    async getBatches(request, reply) {
        const data = await production_service_js_1.productionService.listBatches(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async advanceBatchStep(request, reply) {
        const body = request.body;
        const data = await production_service_js_1.productionService.advanceBatchStep(request.user.tenantId, request.params.id, body, request.user.userId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Batch step completed successfully"));
    }
    async verifyLot(request, reply) {
        const { lotNo } = request.body;
        const data = await production_service_js_1.productionService.verifyLot(request.params.id, lotNo || "LOT-2026-9901");
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async completeBatch(request, reply) {
        const data = await production_service_js_1.productionService.completeBatch(request.params.id);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Batch marked as completed"));
    }
    async qaReleaseBatch(request, reply) {
        const data = await production_service_js_1.productionService.qaRelease(request.params.id);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Batch released for QA"));
    }
    async recordOperatorEntry(request, reply) {
        const body = request.body;
        const plantId = await (0, tenantContext_js_1.resolvePlantId)(request.user.tenantId, request.user.plantId);
        const data = await production_service_js_1.productionService.recordOperatorEntry(request.user.tenantId, plantId, body, request.user.userId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Operator production log recorded & order counter incremented"));
    }
    async logDowntime(request, reply) {
        const body = request.body;
        const plantId = await (0, tenantContext_js_1.resolvePlantId)(request.user.tenantId, request.user.plantId);
        const data = await production_service_js_1.productionService.logDowntime(request.user.tenantId, plantId, body, request.user.userId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Downtime stoppage recorded"));
    }
    async getDowntime(request, reply) {
        const data = await production_service_js_1.productionService.listDowntime(request.query?.plantId || request.user.plantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    // --- Plant Manager Handlers ---
    async getHbLogs(request, reply) {
        const data = await production_service_js_1.productionService.listHbLogs(request.query?.plantId || request.user.plantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async createHbLog(request, reply) {
        const body = request.body;
        const data = await production_service_js_1.productionService.createHbLog(body);
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, "Pitch hour registered"));
    }
    async getOEE(request, reply) {
        const { period, plantId } = request.query;
        const user = request.user;
        const data = await production_service_js_1.productionService.getOEEAnalytics(plantId || user?.plantId, period || "daily", user?.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async getPerformance(request, reply) {
        const user = request.user;
        const data = await production_service_js_1.productionService.getProductionPerformance(request.query?.plantId || user?.plantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async getMachines(request, reply) {
        const data = await production_service_js_1.productionService.listMachines(request.query?.plantId || request.user.plantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async updateMachineStatus(request, reply) {
        const { status } = request.body;
        const data = await production_service_js_1.productionService.updateMachineStatus(request.params.id, status);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, `Machine status updated to ${status}`));
    }
    async getShiftHandoffs(request, reply) {
        const plantId = request.query?.plantId || request.user?.plantId;
        const tenantId = request.user?.tenantId;
        const data = await production_service_js_1.productionService.listShiftHandoffs(plantId, tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async createShiftHandoff(request, reply) {
        const body = request.body;
        const plantId = body.plantId || request.user?.plantId;
        const tenantId = request.user?.tenantId;
        const data = await production_service_js_1.productionService.createShiftHandoff(body, tenantId, plantId);
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, "Shift handoff recorded"));
    }
    async getShiftPerformance(request, reply) {
        const data = await production_service_js_1.productionService.getShiftPerformance(request.query?.plantId || request.user.plantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
}
exports.ProductionController = ProductionController;
exports.productionController = new ProductionController();
//# sourceMappingURL=production.controller.js.map