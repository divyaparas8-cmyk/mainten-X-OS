"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.qualityRoutes = qualityRoutes;
const quality_controller_js_1 = require("./quality.controller.js");
const authenticate_js_1 = require("../../middleware/authenticate.js");
async function qualityRoutes(fastify) {
    fastify.addHook("preHandler", authenticate_js_1.authenticate);
    fastify.get("/ccp", { schema: { tags: ["Quality & QMS"], summary: "List Critical Control Point Checks" } }, quality_controller_js_1.qualityController.getCcpChecks.bind(quality_controller_js_1.qualityController));
    fastify.post("/ccp", { schema: { tags: ["Quality & QMS"], summary: "Record In-Process CCP Check (Auto PASS/FAIL)" } }, quality_controller_js_1.qualityController.recordCcpCheck.bind(quality_controller_js_1.qualityController));
    fastify.get("/release/queue", { schema: { tags: ["Quality & QMS"], summary: "List Batches Pending QA Release" } }, quality_controller_js_1.qualityController.getQaReleaseQueue.bind(quality_controller_js_1.qualityController));
    fastify.post("/release/authorize", { schema: { tags: ["Quality & QMS"], summary: "21 CFR Part 11 QA Digital Batch Release Authorization" } }, quality_controller_js_1.qualityController.authorizeBatchRelease.bind(quality_controller_js_1.qualityController));
    fastify.get("/holds", { schema: { tags: ["Quality & QMS"], summary: "List Quarantined / Lot Holds" } }, quality_controller_js_1.qualityController.getQualityHolds.bind(quality_controller_js_1.qualityController));
    fastify.post("/holds", { schema: { tags: ["Quality & QMS"], summary: "Place Lot on Quality Quarantine Hold" } }, quality_controller_js_1.qualityController.createQualityHold.bind(quality_controller_js_1.qualityController));
}
//# sourceMappingURL=quality.routes.js.map