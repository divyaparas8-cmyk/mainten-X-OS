"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.qualityController = exports.QualityController = void 0;
const quality_service_js_1 = require("./quality.service.js");
const quality_schema_js_1 = require("./quality.schema.js");
const responseFormatter_js_1 = require("../../shared/utils/responseFormatter.js");
class QualityController {
    async getCcpChecks(request, reply) {
        const data = await quality_service_js_1.qualityService.listCcpChecks(request.user.tenantId, request.user.plantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async recordCcpCheck(request, reply) {
        const input = quality_schema_js_1.recordCcpCheckSchema.parse(request.body);
        const data = await quality_service_js_1.qualityService.recordCcpCheck(request.user.tenantId, request.user.plantId || "default-plant", input, request.user.userId);
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, `CCP check recorded (${data.status})`));
    }
    async getQaReleaseQueue(request, reply) {
        const data = await quality_service_js_1.qualityService.listQaReleaseQueue(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async authorizeBatchRelease(request, reply) {
        const input = quality_schema_js_1.qaBatchReleaseSchema.parse(request.body);
        const data = await quality_service_js_1.qualityService.authorizeBatchRelease(request.user.tenantId, request.user.plantId || "default-plant", input, request.user.userId, request.ip);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Batch disposition digitally signed & QA Release approved (21 CFR Part 11)"));
    }
    async getQualityHolds(request, reply) {
        const data = await quality_service_js_1.qualityService.listQualityHolds(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async createQualityHold(request, reply) {
        const input = quality_schema_js_1.createQualityHoldSchema.parse(request.body);
        const data = await quality_service_js_1.qualityService.createQualityHold(request.user.tenantId, request.user.plantId || "default-plant", input, request.user.userId);
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, "Lot placed on quarantine hold"));
    }
}
exports.QualityController = QualityController;
exports.qualityController = new QualityController();
//# sourceMappingURL=quality.controller.js.map