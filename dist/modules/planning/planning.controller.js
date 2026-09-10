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
    // --- Plant Manager Handlers ---
    async getSchedules(request, reply) {
        const data = await planning_service_js_1.planningService.listSchedules(request.query?.plantId || request.user.plantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async createSchedule(request, reply) {
        const body = request.body;
        const data = await planning_service_js_1.planningService.createSchedule({
            sku: body.sku,
            line: body.line,
            quantity: Number(body.quantity || body.plannedQty || 30000),
            startTime: body.startTime || "06:00",
            endTime: body.endTime || "14:30",
            plantId: body.plantId || request.user.plantId,
        });
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, "Schedule run created successfully"));
    }
    async toggleScheduleLock(request, reply) {
        const { id } = request.params;
        const body = request.body;
        const data = await planning_service_js_1.planningService.toggleScheduleLock(id, body?.locked);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Schedule lock updated"));
    }
    async deleteSchedule(request, reply) {
        const { id } = request.params;
        const data = await planning_service_js_1.planningService.deleteSchedule(id);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Schedule run deleted"));
    }
    async getCapacity(request, reply) {
        const data = await planning_service_js_1.planningService.listCapacity(request.query?.plantId || request.user.plantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async getConstraints(request, reply) {
        const data = await planning_service_js_1.planningService.listConstraints(request.query?.plantId || request.user.plantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async createConstraint(request, reply) {
        const body = request.body;
        const data = await planning_service_js_1.planningService.createConstraint({
            type: body.type,
            description: body.description,
            line: body.line,
            impact: body.impact,
            risk: body.risk || "Medium",
            plantId: body.plantId || request.user.plantId,
        });
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, "Constraint registered"));
    }
    async resolveConstraint(request, reply) {
        const { id } = request.params;
        const data = await planning_service_js_1.planningService.resolveConstraint(id);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Constraint marked resolved"));
    }
    async deleteConstraint(request, reply) {
        const { id } = request.params;
        const data = await planning_service_js_1.planningService.deleteConstraint(id);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Constraint deleted"));
    }
    async applyRecovery(request, reply) {
        const body = request.body;
        const data = await planning_service_js_1.planningService.applyRecovery({
            speedBoostPercent: Number(body.speedBoostPercent || body.speedBoost || 0),
            overtimeHours: Number(body.overtimeHours || body.overtime || 0),
            plantId: body.plantId || request.user.plantId,
        });
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Recovery plan calculated & applied"));
    }
}
exports.PlanningController = PlanningController;
exports.planningController = new PlanningController();
//# sourceMappingURL=planning.controller.js.map