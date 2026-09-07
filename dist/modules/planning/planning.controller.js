"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.planningController = exports.PlanningController = void 0;
const planning_service_js_1 = require("./planning.service.js");
const planning_schema_js_1 = require("./planning.schema.js");
const responseFormatter_js_1 = require("../../shared/utils/responseFormatter.js");
class PlanningController {
    async getCustomerOrders(request, reply) {
        const data = await planning_service_js_1.planningService.listCustomerOrders(request.user.tenantId, request.user.plantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async createCustomerOrder(request, reply) {
        const input = planning_schema_js_1.createCustomerOrderSchema.parse(request.body);
        const data = await planning_service_js_1.planningService.createCustomerOrder(request.user.tenantId, request.user.plantId || "default-plant", input);
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, "Customer demand order created"));
    }
    async runForecast(request, reply) {
        const input = planning_schema_js_1.runForecastSchema.parse(request.body);
        const data = await planning_service_js_1.planningService.runStatisticalForecast(request.user.tenantId, request.user.plantId || "default-plant", input);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Statistical forecast calculated cleanly"));
    }
    async getApsSchedules(request, reply) {
        const data = await planning_service_js_1.planningService.listApsSchedules(request.user.tenantId, request.user.plantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async createApsSchedule(request, reply) {
        const input = planning_schema_js_1.createApsScheduleSchema.parse(request.body);
        const data = await planning_service_js_1.planningService.createApsSchedule(request.user.tenantId, request.user.plantId || "default-plant", input);
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, "APS Schedule block published"));
    }
    async getMrpExplosion(request, reply) {
        const data = await planning_service_js_1.planningService.runMrpExplosion(request.user.tenantId, request.user.plantId || "default-plant");
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "MRP Net Requirements calculated"));
    }
}
exports.PlanningController = PlanningController;
exports.planningController = new PlanningController();
//# sourceMappingURL=planning.controller.js.map