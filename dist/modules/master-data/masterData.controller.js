"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.masterDataController = exports.MasterDataController = void 0;
const masterData_service_js_1 = require("./masterData.service.js");
const masterData_schema_js_1 = require("./masterData.schema.js");
const responseFormatter_js_1 = require("../../shared/utils/responseFormatter.js");
class MasterDataController {
    async getSkus(request, reply) {
        const data = await masterData_service_js_1.masterDataService.listSkus(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async createSku(request, reply) {
        const input = masterData_schema_js_1.createSkuSchema.parse(request.body);
        const data = await masterData_service_js_1.masterDataService.createSku(request.user.tenantId, input);
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, "SKU created successfully"));
    }
    async getBoms(request, reply) {
        const data = await masterData_service_js_1.masterDataService.listBoms(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async getLines(request, reply) {
        const data = await masterData_service_js_1.masterDataService.listLines(request.user.tenantId, request.query.plantId || request.user.plantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async getWorkCenters(request, reply) {
        const data = await masterData_service_js_1.masterDataService.listWorkCenters(request.user.tenantId, request.query.plantId || request.user.plantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async getAssets(request, reply) {
        const data = await masterData_service_js_1.masterDataService.listAssets(request.user.tenantId, request.query.plantId || request.user.plantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async getStaff(request, reply) {
        const data = await masterData_service_js_1.masterDataService.listStaff(request.user.tenantId, request.query.plantId || request.user.plantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async getQualitySpecs(request, reply) {
        const data = await masterData_service_js_1.masterDataService.listQualitySpecs(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
}
exports.MasterDataController = MasterDataController;
exports.masterDataController = new MasterDataController();
//# sourceMappingURL=masterData.controller.js.map