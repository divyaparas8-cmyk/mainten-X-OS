"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productionRoutes = productionRoutes;
const production_controller_js_1 = require("./production.controller.js");
const authenticate_js_1 = require("../../middleware/authenticate.js");
async function productionRoutes(fastify) {
    fastify.addHook("preHandler", authenticate_js_1.authenticate);
    fastify.get("/orders", { schema: { tags: ["Production & MES"], summary: "List Production Orders" } }, production_controller_js_1.productionController.getOrders.bind(production_controller_js_1.productionController));
    fastify.post("/orders", { schema: { tags: ["Production & MES"], summary: "Create Production Order" } }, production_controller_js_1.productionController.createOrder.bind(production_controller_js_1.productionController));
    fastify.patch("/orders/:id/status", { schema: { tags: ["Production & MES"], summary: "Advance Production Order Status" } }, production_controller_js_1.productionController.updateOrderStatus.bind(production_controller_js_1.productionController));
    fastify.get("/batches", { schema: { tags: ["Production & MES"], summary: "List 6-Step eBR Batches" } }, production_controller_js_1.productionController.getBatches.bind(production_controller_js_1.productionController));
    fastify.post("/batches/:id/steps", { schema: { tags: ["Production & MES"], summary: "Complete eBR Batch Step" } }, production_controller_js_1.productionController.advanceBatchStep.bind(production_controller_js_1.productionController));
    fastify.post("/hmi/entry", { schema: { tags: ["Production & MES"], summary: "Record Operator HMI Good/Scrap Units" } }, production_controller_js_1.productionController.recordOperatorEntry.bind(production_controller_js_1.productionController));
    fastify.post("/downtime", { schema: { tags: ["Production & MES"], summary: "Log Downtime / Stoppage Event" } }, production_controller_js_1.productionController.logDowntime.bind(production_controller_js_1.productionController));
}
//# sourceMappingURL=production.routes.js.map