"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exceptionsController = exports.ExceptionsController = void 0;
const exceptions_service_js_1 = require("./exceptions.service.js");
const responseFormatter_js_1 = require("../../shared/utils/responseFormatter.js");
class ExceptionsController {
    async getExceptions(request, reply) {
        const { plantId, severity, category } = request.query;
        const data = await exceptions_service_js_1.exceptionsService.listExceptions(plantId || request.user.plantId, severity, category);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async getException(request, reply) {
        const data = await exceptions_service_js_1.exceptionsService.getException(request.params.id);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async createException(request, reply) {
        const body = request.body;
        const data = await exceptions_service_js_1.exceptionsService.createException({
            title: body.title,
            severity: body.severity,
            category: body.category,
            assetOrOrder: body.assetOrOrder,
            impactDescription: body.impactDescription || body.description,
            owner: body.owner,
            escalationLevel: body.escalationLevel,
            plantId: body.plantId || request.user.plantId,
        });
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, "Exception alert logged in Control Tower"));
    }
    async assignException(request, reply) {
        const body = request.body;
        const data = await exceptions_service_js_1.exceptionsService.assignException(request.params.id, body);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Exception assigned & escalated"));
    }
    async resolveException(request, reply) {
        const body = request.body;
        const data = await exceptions_service_js_1.exceptionsService.resolveException(request.params.id, {
            resolutionNotes: body.resolutionNotes || body.notes || "Resolved successfully by Plant Manager",
        });
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Exception marked as resolved"));
    }
}
exports.ExceptionsController = ExceptionsController;
exports.exceptionsController = new ExceptionsController();
//# sourceMappingURL=exceptions.controller.js.map