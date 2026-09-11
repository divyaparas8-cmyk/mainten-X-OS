"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiController = exports.AIController = void 0;
const ai_service_js_1 = require("./ai.service.js");
const responseFormatter_js_1 = require("../../shared/utils/responseFormatter.js");
class AIController {
    async getInsights(request, reply) {
        const data = await ai_service_js_1.aiService.listInsights();
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async approveInsight(request, reply) {
        const data = await ai_service_js_1.aiService.approveInsight(request.params.id);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "AI recommendation approved"));
    }
    async rejectInsight(request, reply) {
        const data = await ai_service_js_1.aiService.rejectInsight(request.params.id);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "AI recommendation rejected"));
    }
    async chat(request, reply) {
        const { query } = request.body;
        const data = await ai_service_js_1.aiService.chatQuery(query || "");
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
}
exports.AIController = AIController;
exports.aiController = new AIController();
//# sourceMappingURL=ai.controller.js.map