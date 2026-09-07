"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productionController = exports.ProductionController = void 0;
const production_service_js_1 = require("./production.service.js");
const production_schema_js_1 = require("./production.schema.js");
const responseFormatter_js_1 = require("../../shared/utils/responseFormatter.js");
class ProductionController {
    async getOrders(request, reply) {
        const data = await production_service_js_1.productionService.listOrders(request.user.tenantId, request.user.plantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async createOrder(request, reply) {
        const input = production_schema_js_1.createProductionOrderSchema.parse(request.body);
        const data = await production_service_js_1.productionService.createOrder(request.user.tenantId, request.user.plantId || "default-plant", input);
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, "Production Order created & eBR Batch initialized"));
    }
    async updateOrderStatus(request, reply) {
        const { status } = production_schema_js_1.updateOrderStatusSchema.parse(request.body);
        const data = await production_service_js_1.productionService.updateOrderStatus(request.user.tenantId, request.params.id, status);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, `Order status advanced to ${status}`));
    }
    async getBatches(request, reply) {
        const data = await production_service_js_1.productionService.listBatches(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async advanceBatchStep(request, reply) {
        const input = production_schema_js_1.updateBatchStepSchema.parse(request.body);
        const data = await production_service_js_1.productionService.advanceBatchStep(request.user.tenantId, request.params.id, input, request.user.userId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, `Batch step ${input.stepNumber} completed successfully`));
    }
    async recordOperatorEntry(request, reply) {
        const input = production_schema_js_1.recordOperatorEntrySchema.parse(request.body);
        const data = await production_service_js_1.productionService.recordOperatorEntry(request.user.tenantId, request.user.plantId || "default-plant", input, request.user.userId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Operator production log recorded & order counter incremented"));
    }
    async logDowntime(request, reply) {
        const input = production_schema_js_1.logDowntimeSchema.parse(request.body);
        const data = await production_service_js_1.productionService.logDowntime(request.user.tenantId, request.user.plantId || "default-plant", input, request.user.userId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Downtime stoppage recorded"));
    }
}
exports.ProductionController = ProductionController;
exports.productionController = new ProductionController();
//# sourceMappingURL=production.controller.js.map