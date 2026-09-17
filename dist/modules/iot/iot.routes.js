"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iotRoutes = iotRoutes;
const iot_controller_js_1 = require("./iot.controller.js");
const authenticate_js_1 = require("../../middleware/authenticate.js");
async function iotRoutes(fastify) {
    // 1. High-frequency Edge Telemetry Ingestion (Edge Gateways push data here)
    fastify.post("/telemetry/ingest", {
        schema: {
            tags: ["Industrial IoT & Telemetry"],
            summary: "Ingest & Normalize Machine Telemetry (OPC-UA, MQTT, Modbus, Edge Gateways)",
        },
    }, iot_controller_js_1.iotController.ingest.bind(iot_controller_js_1.iotController));
    // 2. Real-time Live SSE Telemetry Stream
    fastify.get("/telemetry/stream", {
        schema: {
            tags: ["Industrial IoT & Telemetry"],
            summary: "Real-Time Server-Sent Events (SSE) Live Telemetry Stream",
        },
    }, iot_controller_js_1.iotController.stream.bind(iot_controller_js_1.iotController));
    fastify.options("/telemetry/stream", async (request, reply) => {
        const origin = request.headers.origin || "*";
        reply.header("Access-Control-Allow-Origin", origin);
        reply.header("Access-Control-Allow-Credentials", "true");
        reply.header("Access-Control-Allow-Methods", "GET, OPTIONS");
        reply.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Accept");
        return reply.status(204).send();
    });
    // 3. Latest Telemetry Snapshot
    fastify.get("/telemetry/latest", {
        schema: {
            tags: ["Industrial IoT & Telemetry"],
            summary: "Get Latest Normalized Telemetry Snapshot for Shopfloor Machines",
        },
    }, iot_controller_js_1.iotController.getLatest.bind(iot_controller_js_1.iotController));
    // 4. Telemetry Historical Log
    fastify.get("/telemetry/history/:assetCode", {
        schema: {
            tags: ["Industrial IoT & Telemetry"],
            summary: "Query Historical Telemetry Logs for Specific Asset",
        },
    }, iot_controller_js_1.iotController.getHistory.bind(iot_controller_js_1.iotController));
    // 5. Configured Edge Gateways List
    fastify.get("/gateways", {
        schema: {
            tags: ["Industrial IoT & Telemetry"],
            summary: "List Configured Industrial Edge Gateways and Brokers",
        },
    }, iot_controller_js_1.iotController.getGateways.bind(iot_controller_js_1.iotController));
    // 6. Simulator Control Endpoints (Authenticated)
    fastify.register(async (authScope) => {
        authScope.addHook("preHandler", authenticate_js_1.authenticate);
        authScope.post("/simulator/start", {
            schema: {
                tags: ["Industrial IoT & Telemetry"],
                summary: "Start High-Frequency Synthetic Telemetry Simulator",
            },
        }, iot_controller_js_1.iotController.startSimulator.bind(iot_controller_js_1.iotController));
        authScope.post("/simulator/stop", {
            schema: {
                tags: ["Industrial IoT & Telemetry"],
                summary: "Stop High-Frequency Synthetic Telemetry Simulator",
            },
        }, iot_controller_js_1.iotController.stopSimulator.bind(iot_controller_js_1.iotController));
    });
}
//# sourceMappingURL=iot.routes.js.map