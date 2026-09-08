"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.warehouseController = exports.WarehouseController = void 0;
const warehouse_service_js_1 = require("./warehouse.service.js");
const warehouse_schema_js_1 = require("./warehouse.schema.js");
const responseFormatter_js_1 = require("../../shared/utils/responseFormatter.js");
const tenantContext_js_1 = require("../../shared/utils/tenantContext.js");
class WarehouseController {
    async getLots(request, reply) {
        const plantId = await (0, tenantContext_js_1.resolvePlantId)(request.user.tenantId, request.user.plantId);
        const data = await warehouse_service_js_1.warehouseService.listLots(request.user.tenantId, plantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async createLot(request, reply) {
        const input = warehouse_schema_js_1.createLotSchema.parse(request.body);
        const plantId = await (0, tenantContext_js_1.resolvePlantId)(request.user.tenantId, request.user.plantId);
        const data = await warehouse_service_js_1.warehouseService.createLot(request.user.tenantId, plantId, input);
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, "Inventory lot registered & initial receipt transaction logged"));
    }
    async recordTransaction(request, reply) {
        const input = warehouse_schema_js_1.createTransactionSchema.parse(request.body);
        const plantId = await (0, tenantContext_js_1.resolvePlantId)(request.user.tenantId, request.user.plantId);
        const data = await warehouse_service_js_1.warehouseService.recordTransaction(request.user.tenantId, plantId, input, request.user.userId);
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, `Inventory transaction [${input.type}] recorded cleanly`));
    }
    async getTransactions(request, reply) {
        const plantId = await (0, tenantContext_js_1.resolvePlantId)(request.user.tenantId, request.user.plantId);
        const data = await warehouse_service_js_1.warehouseService.listTransactions(request.user.tenantId, plantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async getWarehouses(request, reply) {
        const data = await warehouse_service_js_1.warehouseService.listWarehouses(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async getBins(request, reply) {
        const data = await warehouse_service_js_1.warehouseService.listBins(request.query.warehouseId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
}
exports.WarehouseController = WarehouseController;
exports.warehouseController = new WarehouseController();
//# sourceMappingURL=warehouse.controller.js.map