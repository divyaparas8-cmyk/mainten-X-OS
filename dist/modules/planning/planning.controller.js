"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.planningController = exports.PlanningController = void 0;
const planning_service_js_1 = require("./planning.service.js");
const planning_schema_js_1 = require("./planning.schema.js");
const responseFormatter_js_1 = require("../../shared/utils/responseFormatter.js");
const tenantContext_js_1 = require("../../shared/utils/tenantContext.js");
class PlanningController {
    async getCustomerOrders(request, reply) {
        const plantId = await (0, tenantContext_js_1.resolvePlantId)(request.user.tenantId, request.user.plantId);
        const data = await planning_service_js_1.planningService.listCustomerOrders(request.user.tenantId, plantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async createCustomerOrder(request, reply) {
        const input = planning_schema_js_1.createCustomerOrderSchema.parse(request.body);
        const plantId = await (0, tenantContext_js_1.resolvePlantId)(request.user.tenantId, request.user.plantId);
        const data = await planning_service_js_1.planningService.createCustomerOrder(request.user.tenantId, plantId, input);
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, "Customer demand order created"));
    }
    async updateCustomerOrder(request, reply) {
        const { id } = request.params;
        const data = await planning_service_js_1.planningService.updateCustomerOrder(request.user.tenantId, id, request.body);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Customer demand order updated"));
    }
    async deleteCustomerOrder(request, reply) {
        const { id } = request.params;
        await planning_service_js_1.planningService.deleteCustomerOrder(request.user.tenantId, id);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(null, "Customer demand order deleted"));
    }
    async runForecast(request, reply) {
        const input = planning_schema_js_1.runForecastSchema.parse(request.body);
        const plantId = await (0, tenantContext_js_1.resolvePlantId)(request.user.tenantId, request.user.plantId);
        const data = await planning_service_js_1.planningService.runStatisticalForecast(request.user.tenantId, plantId, input);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Statistical forecast calculated cleanly"));
    }
    async getApsSchedules(request, reply) {
        const plantId = await (0, tenantContext_js_1.resolvePlantId)(request.user.tenantId, request.user.plantId);
        const data = await planning_service_js_1.planningService.listApsSchedules(request.user.tenantId, plantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async createApsSchedule(request, reply) {
        const input = planning_schema_js_1.createApsScheduleSchema.parse(request.body);
        const plantId = await (0, tenantContext_js_1.resolvePlantId)(request.user.tenantId, request.user.plantId);
        const data = await planning_service_js_1.planningService.createApsSchedule(request.user.tenantId, plantId, input);
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, "APS Schedule block published"));
    }
    async getMrpExplosion(request, reply) {
        const plantId = await (0, tenantContext_js_1.resolvePlantId)(request.user.tenantId, request.user.plantId);
        const data = await planning_service_js_1.planningService.runMrpExplosion(request.user.tenantId, plantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "MRP Net Requirements calculated"));
    }
}
exports.PlanningController = PlanningController;
exports.planningController = new PlanningController();
//# sourceMappingURL=planning.controller.js.map