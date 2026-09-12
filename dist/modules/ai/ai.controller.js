"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiController = exports.AIController = void 0;
const ai_service_js_1 = require("./ai.service.js");
const responseFormatter_js_1 = require("../../shared/utils/responseFormatter.js");
const AppError_js_1 = require("../../shared/errors/AppError.js");
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
        const body = request.body;
        const query = body?.query;
        if (!query || typeof query !== "string" || !query.trim()) {
            throw new AppError_js_1.ValidationError("Query parameter is required and must not be empty.");
        }
        const tenantId = request.user?.tenantId;
        const data = await ai_service_js_1.aiService.chatQuery(query.trim(), tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
}
exports.AIController = AIController;
exports.aiController = new AIController();
//# sourceMappingURL=ai.controller.js.map