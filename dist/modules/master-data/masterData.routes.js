"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.masterDataRoutes = masterDataRoutes;
const masterData_controller_js_1 = require("./masterData.controller.js");
const authenticate_js_1 = require("../../middleware/authenticate.js");
async function masterDataRoutes(fastify) {
    fastify.addHook("preHandler", authenticate_js_1.authenticate);
    fastify.get("/skus", { schema: { tags: ["Master Data"], summary: "List Products & SKUs" } }, masterData_controller_js_1.masterDataController.getSkus.bind(masterData_controller_js_1.masterDataController));
    fastify.post("/skus", { schema: { tags: ["Master Data"], summary: "Create new SKU" } }, masterData_controller_js_1.masterDataController.createSku.bind(masterData_controller_js_1.masterDataController));
    fastify.get("/boms", { schema: { tags: ["Master Data"], summary: "List BOMs & Formulations" } }, masterData_controller_js_1.masterDataController.getBoms.bind(masterData_controller_js_1.masterDataController));
    fastify.get("/lines", { schema: { tags: ["Master Data"], summary: "List Production Lines" } }, masterData_controller_js_1.masterDataController.getLines.bind(masterData_controller_js_1.masterDataController));
    fastify.get("/work-centers", { schema: { tags: ["Master Data"], summary: "List Work Centers" } }, masterData_controller_js_1.masterDataController.getWorkCenters.bind(masterData_controller_js_1.masterDataController));
    fastify.get("/assets", { schema: { tags: ["Master Data"], summary: "List Equipment Assets" } }, masterData_controller_js_1.masterDataController.getAssets.bind(masterData_controller_js_1.masterDataController));
    fastify.get("/staff", { schema: { tags: ["Master Data"], summary: "List Operators & Shift Crew" } }, masterData_controller_js_1.masterDataController.getStaff.bind(masterData_controller_js_1.masterDataController));
    fastify.get("/quality-specs", { schema: { tags: ["Master Data"], summary: "List QA & CCP Specifications" } }, masterData_controller_js_1.masterDataController.getQualitySpecs.bind(masterData_controller_js_1.masterDataController));
}
//# sourceMappingURL=masterData.routes.js.map