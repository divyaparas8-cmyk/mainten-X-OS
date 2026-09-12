"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iotController = exports.IoTController = void 0;
const machineData_service_js_1 = require("./services/machineData.service.js");
const responseFormatter_js_1 = require("../../shared/utils/responseFormatter.js");
const AppError_js_1 = require("../../shared/errors/AppError.js");
class IoTController {
    async ingest(request, reply) {
        const body = request.body;
        if (!body || typeof body !== "object") {
            throw new AppError_js_1.ValidationError("Telemetry payload must be a valid JSON object.");
        }
        const normalized = await machineData_service_js_1.machineDataService.ingest(body);
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(normalized, "Telemetry event normalized and ingested."));
    }
    async getLatest(request, reply) {
        const { assetCode } = request.query;
        const telemetry = machineData_service_js_1.machineDataService.getLatestTelemetry(assetCode);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(telemetry));
    }
    async getHistory(request, reply) {
        const { assetCode } = request.params;
        const limit = parseInt(request.query.limit || "50", 10);
        const history = await machineData_service_js_1.machineDataService.getHistory(assetCode, limit);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(history));
    }
    async stream(_request, reply) {
        // Set headers for Server-Sent Events (SSE)
        reply.raw.setHeader("Content-Type", "text/event-stream");
        reply.raw.setHeader("Cache-Control", "no-cache, no-transform");
        reply.raw.setHeader("Connection", "keep-alive");
        reply.raw.setHeader("X-Accel-Buffering", "no");
        machineData_service_js_1.machineDataService.addSseSubscriber(reply);
    }
    async startSimulator(_request, reply) {
        const result = await machineData_service_js_1.machineDataService.startSimulator();
        return reply.send((0, responseFormatter_js_1.formatSuccess)(result));
    }
    async stopSimulator(_request, reply) {
        const result = await machineData_service_js_1.machineDataService.stopSimulator();
        return reply.send((0, responseFormatter_js_1.formatSuccess)(result));
    }
    async getGateways(_request, reply) {
        const gateways = await machineData_service_js_1.machineDataService.listGateways();
        return reply.send((0, responseFormatter_js_1.formatSuccess)(gateways));
    }
}
exports.IoTController = IoTController;
exports.iotController = new IoTController();
//# sourceMappingURL=iot.controller.js.map