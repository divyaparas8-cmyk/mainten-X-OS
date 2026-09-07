"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.traceabilityRoutes = traceabilityRoutes;
const traceability_controller_js_1 = require("./traceability.controller.js");
const authenticate_js_1 = require("../../middleware/authenticate.js");
async function traceabilityRoutes(fastify) {
    fastify.addHook("preHandler", authenticate_js_1.authenticate);
    fastify.get("/genealogy/:lotNumber", { schema: { tags: ["360° Traceability"], summary: "Get 360° Forward/Backward Lot Genealogy Graph" } }, traceability_controller_js_1.traceabilityController.getGenealogy.bind(traceability_controller_js_1.traceabilityController));
    fastify.post("/recall/simulate", { schema: { tags: ["360° Traceability"], summary: "Execute Digital Recall Simulation" } }, traceability_controller_js_1.traceabilityController.runRecallSimulation.bind(traceability_controller_js_1.traceabilityController));
}
//# sourceMappingURL=traceability.routes.js.map