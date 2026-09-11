"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiRoutes = aiRoutes;
const ai_controller_js_1 = require("./ai.controller.js");
const authenticate_js_1 = require("../../middleware/authenticate.js");
async function aiRoutes(fastify) {
    fastify.addHook("preHandler", authenticate_js_1.authenticate);
    fastify.get("/insights", { schema: { tags: ["AI & Operations Intelligence"], summary: "List AI Insights" } }, ai_controller_js_1.aiController.getInsights.bind(ai_controller_js_1.aiController));
    fastify.post("/insights/:id/approve", { schema: { tags: ["AI & Operations Intelligence"], summary: "Approve AI Recommendation" } }, ai_controller_js_1.aiController.approveInsight.bind(ai_controller_js_1.aiController));
    fastify.post("/insights/:id/reject", { schema: { tags: ["AI & Operations Intelligence"], summary: "Reject AI Recommendation" } }, ai_controller_js_1.aiController.rejectInsight.bind(ai_controller_js_1.aiController));
    fastify.post("/chat", { schema: { tags: ["AI & Operations Intelligence"], summary: "AI Operational Assistant Query" } }, ai_controller_js_1.aiController.chat.bind(ai_controller_js_1.aiController));
}
//# sourceMappingURL=ai.routes.js.map