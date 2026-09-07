"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.traceabilityController = exports.TraceabilityController = void 0;
const traceability_service_js_1 = require("./traceability.service.js");
const responseFormatter_js_1 = require("../../shared/utils/responseFormatter.js");
const zod_1 = require("zod");
const recallSimulationSchema = zod_1.z.object({
    lotNumber: zod_1.z.string().min(2),
    reason: zod_1.z.string().min(2),
});
class TraceabilityController {
    async getGenealogy(request, reply) {
        const data = await traceability_service_js_1.traceabilityService.get360Genealogy(request.user.tenantId, request.params.lotNumber);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async runRecallSimulation(request, reply) {
        const input = recallSimulationSchema.parse(request.body);
        const data = await traceability_service_js_1.traceabilityService.runRecallSimulation(request.user.tenantId, request.user.plantId || "default-plant", input.lotNumber, input.reason, request.user.userId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Digital 360° Recall Simulation executed and containment plan generated"));
    }
}
exports.TraceabilityController = TraceabilityController;
exports.traceabilityController = new TraceabilityController();
//# sourceMappingURL=traceability.controller.js.map