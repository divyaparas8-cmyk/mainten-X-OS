"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productionRoutes = productionRoutes;
const production_controller_js_1 = require("./production.controller.js");
const authenticate_js_1 = require("../../middleware/authenticate.js");
async function productionRoutes(fastify) {
    fastify.addHook("preHandler", authenticate_js_1.authenticate);
    // Orders
    fastify.get("/orders", { schema: { tags: ["Production & MES"], summary: "List Production Orders" } }, production_controller_js_1.productionController.getOrders.bind(production_controller_js_1.productionController));
    fastify.post("/orders", { schema: { tags: ["Production & MES"], summary: "Create Production Order" } }, production_controller_js_1.productionController.createOrder.bind(production_controller_js_1.productionController));
    fastify.patch("/orders/:id/status", { schema: { tags: ["Production & MES"], summary: "Advance Production Order Status" } }, production_controller_js_1.productionController.updateOrderStatus.bind(production_controller_js_1.productionController));
    // Batches / eBR
    fastify.get("/batches", { schema: { tags: ["Production & MES"], summary: "List 6-Step eBR Batches" } }, production_controller_js_1.productionController.getBatches.bind(production_controller_js_1.productionController));
    fastify.post("/batches/:id/steps", { schema: { tags: ["Production & MES"], summary: "Complete eBR Batch Step" } }, production_controller_js_1.productionController.advanceBatchStep.bind(production_controller_js_1.productionController));
    fastify.post("/batches/:id/verify-lot", { schema: { tags: ["Production & MES"], summary: "Verify Lot Barcode" } }, production_controller_js_1.productionController.verifyLot.bind(production_controller_js_1.productionController));
    fastify.patch("/batches/:id/complete", { schema: { tags: ["Production & MES"], summary: "Complete eBR Batch" } }, production_controller_js_1.productionController.completeBatch.bind(production_controller_js_1.productionController));
    fastify.post("/batches/:id/qa-release", { schema: { tags: ["Production & MES"], summary: "Release Batch to QA" } }, production_controller_js_1.productionController.qaReleaseBatch.bind(production_controller_js_1.productionController));
    // HMI & Downtime
    fastify.post("/hmi/entry", { schema: { tags: ["Production & MES"], summary: "Record Operator HMI Good/Scrap Units" } }, production_controller_js_1.productionController.recordOperatorEntry.bind(production_controller_js_1.productionController));
    fastify.get("/downtime", { schema: { tags: ["Production & MES"], summary: "List Downtime Events" } }, production_controller_js_1.productionController.getDowntime.bind(production_controller_js_1.productionController));
    fastify.post("/downtime", { schema: { tags: ["Production & MES"], summary: "Log Downtime / Stoppage Event" } }, production_controller_js_1.productionController.logDowntime.bind(production_controller_js_1.productionController));
    // Plant Manager Extended Endpoints
    fastify.get("/hb-logs", { schema: { tags: ["Production & MES"], summary: "List Pitch Hour Logs" } }, production_controller_js_1.productionController.getHbLogs.bind(production_controller_js_1.productionController));
    fastify.post("/hb-logs", { schema: { tags: ["Production & MES"], summary: "Create Pitch Hour Log" } }, production_controller_js_1.productionController.createHbLog.bind(production_controller_js_1.productionController));
    fastify.get("/oee", { schema: { tags: ["Production & MES"], summary: "Get Plant & Line OEE Breakdown" } }, production_controller_js_1.productionController.getOEE.bind(production_controller_js_1.productionController));
    fastify.get("/performance", { schema: { tags: ["Production & MES"], summary: "Get SMED & Micro-Stops Performance" } }, production_controller_js_1.productionController.getPerformance.bind(production_controller_js_1.productionController));
    fastify.get("/machines", { schema: { tags: ["Production & MES"], summary: "List Floor Machines Telemetry" } }, production_controller_js_1.productionController.getMachines.bind(production_controller_js_1.productionController));
    fastify.patch("/machines/:id/status", { schema: { tags: ["Production & MES"], summary: "Toggle Machine Status" } }, production_controller_js_1.productionController.updateMachineStatus.bind(production_controller_js_1.productionController));
    fastify.get("/shift-handoffs", { schema: { tags: ["Production & MES"], summary: "List Shift Handoff Logs" } }, production_controller_js_1.productionController.getShiftHandoffs.bind(production_controller_js_1.productionController));
    fastify.post("/shift-handoffs", { schema: { tags: ["Production & MES"], summary: "Create Shift Handoff Log" } }, production_controller_js_1.productionController.createShiftHandoff.bind(production_controller_js_1.productionController));
    fastify.get("/shift-performance", { schema: { tags: ["Production & MES"], summary: "Get Multi-Shift Output Performance" } }, production_controller_js_1.productionController.getShiftPerformance.bind(production_controller_js_1.productionController));
}
//# sourceMappingURL=production.routes.js.map