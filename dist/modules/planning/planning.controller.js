"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.planningController = exports.PlanningController = void 0;
const planning_service_js_1 = require("./planning.service.js");
const planning_schema_js_1 = require("./planning.schema.js");
const responseFormatter_js_1 = require("../../shared/utils/responseFormatter.js");
const tenantContext_js_1 = require("../../shared/utils/tenantContext.js");
class PlanningController {
    // Demand Orders
    async getCustomerOrders(request, reply) {
        const plantId = await (0, tenantContext_js_1.resolvePlantId)(request.user.tenantId, request.user.plantId);
        const data = await planning_service_js_1.planningService.listCustomerOrders(request.user.tenantId, plantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async createCustomerOrder(request, reply) {
        const input = planning_schema_js_1.createCustomerOrderSchema.parse(request.body);
        const plantId = await (0, tenantContext_js_1.resolvePlantId)(request.user.tenantId, request.user.plantId);
        const data = await planning_service_js_1.planningService.createCustomerOrder(request.user.tenantId, plantId || "default-plant", input);
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, "Customer demand order created successfully"));
    }
    async updateCustomerOrder(request, reply) {
        const input = planning_schema_js_1.updateCustomerOrderSchema.parse(request.body);
        const data = await planning_service_js_1.planningService.updateCustomerOrder(request.user.tenantId, request.params.id, input);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Customer demand order updated successfully"));
    }
    async deleteCustomerOrder(request, reply) {
        const data = await planning_service_js_1.planningService.deleteCustomerOrder(request.user.tenantId, request.params.id);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Customer demand order cancelled successfully"));
    }
    // Forecasts & Overrides
    async getForecasts(request, reply) {
        const data = await planning_service_js_1.planningService.listForecasts(request.user.tenantId, request.user.plantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async createForecast(request, reply) {
        const input = planning_schema_js_1.createForecastSchema.parse(request.body);
        const data = await planning_service_js_1.planningService.createForecast(request.user.tenantId, request.user.plantId || "default-plant", input);
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, "Demand forecast created successfully"));
    }
    async updateForecast(request, reply) {
        const input = planning_schema_js_1.updateForecastSchema.parse(request.body);
        const data = await planning_service_js_1.planningService.updateForecast(request.user.tenantId, request.params.id, input);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Demand forecast updated successfully"));
    }
    async deleteForecast(request, reply) {
        const data = await planning_service_js_1.planningService.deleteForecast(request.user.tenantId, request.params.id);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Demand forecast deleted successfully"));
    }
    // Demand History
    async getDemandHistory(request, reply) {
        const data = await planning_service_js_1.planningService.listDemandHistory(request.user.tenantId, request.user.plantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    // Promotions & Uplift
    async getPromotions(request, reply) {
        const data = await planning_service_js_1.planningService.listPromotions(request.user.tenantId, request.user.plantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async createPromotion(request, reply) {
        const input = planning_schema_js_1.createPromotionSchema.parse(request.body);
        const data = await planning_service_js_1.planningService.createPromotion(request.user.tenantId, input);
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, "Commercial promotion created successfully"));
    }
    async updatePromotion(request, reply) {
        const input = planning_schema_js_1.updatePromotionSchema.parse(request.body);
        const data = await planning_service_js_1.planningService.updatePromotion(request.user.tenantId, request.params.id, input);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Commercial promotion updated successfully"));
    }
    // Shipments Outbound
    async getShipments(request, reply) {
        const data = await planning_service_js_1.planningService.listShipments(request.user.tenantId, request.user.plantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async createShipment(request, reply) {
        const data = await planning_service_js_1.planningService.createShipment(request.user.tenantId, request.body);
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, "Outbound freight booking created successfully"));
    }
    async updateShipmentStatus(request, reply) {
        const input = planning_schema_js_1.updateShipmentStatusSchema.parse(request.body);
        const data = await planning_service_js_1.planningService.updateShipmentStatus(request.user.tenantId, request.params.id, input.status);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, `Shipment status updated to ${input.status}`));
    }
    // Forecast Execution & APS & MRP
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
        const input = request.body ? request.body : {};
        const plantId = await (0, tenantContext_js_1.resolvePlantId)(request.user.tenantId, request.user.plantId);
        const data = await planning_service_js_1.planningService.createApsSchedule(request.user.tenantId, plantId || "default-plant", input);
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, "APS Schedule block published"));
    }
    async rescheduleApsSchedule(request, reply) {
        const input = request.body ? request.body : {};
        const scheduleId = request.params.id || input.scheduleId;
        const data = await planning_service_js_1.planningService.rescheduleApsSchedule(request.user.tenantId, scheduleId, input);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, `Schedule run ${scheduleId} successfully rescheduled`));
    }
    async splitApsSchedule(request, reply) {
        const input = request.body ? request.body : {};
        const scheduleId = request.params.id || input.scheduleId;
        const data = await planning_service_js_1.planningService.splitApsSchedule(request.user.tenantId, scheduleId, input);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message || `Schedule run split successfully`));
    }
    async optimizeApsSchedule(request, reply) {
        const input = request.body ? request.body : {};
        const data = await planning_service_js_1.planningService.optimizeApsSchedule(request.user.tenantId, request.user.plantId, input);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message || "APS schedule sequence optimized"));
    }
    async getCapacityCalculations(request, reply) {
        const data = await planning_service_js_1.planningService.getCapacityCalculations(request.user.tenantId, request.user.plantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async getWorkCenters(request, reply) {
        const data = await planning_service_js_1.planningService.getWorkCenters(request.user.tenantId, request.user.plantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async getChangeovers(request, reply) {
        const data = await planning_service_js_1.planningService.getChangeovers(request.user.tenantId, request.user.plantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async createChangeover(request, reply) {
        const data = await planning_service_js_1.planningService.createChangeover(request.user.tenantId, request.body);
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, "Changeover matrix rule created successfully"));
    }
    async getMrpExplosion(request, reply) {
        const plantId = await (0, tenantContext_js_1.resolvePlantId)(request.user.tenantId, request.user.plantId);
        const data = await planning_service_js_1.planningService.runMrpExplosion(request.user.tenantId, plantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "MRP Net Requirements calculated"));
    }
    // MRP Engine Run Simulation
    async runMrpEngine(request, reply) {
        const input = request.body ? request.body : {};
        const data = await planning_service_js_1.planningService.runMrpEngineCalculation(request.user.tenantId, request.user.plantId || "default-plant", input);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "MRP calculation complete! Requirements exploded across BOM levels."));
    }
    // Purchase Requisitions (Raise PO)
    async createPurchaseRequisition(request, reply) {
        const input = request.body ? request.body : {};
        const data = await planning_service_js_1.planningService.createPurchaseRequisition(request.user.tenantId, request.user.plantId || "default-plant", input);
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, `Purchase Requisition ${data.reqNumber} generated successfully!`));
    }
    async listPurchaseRequisitions(request, reply) {
        const data = await planning_service_js_1.planningService.listPurchaseRequisitions(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    // Material Shortages Expediting
    async expediteShortage(request, reply) {
        const input = request.body ? request.body : {};
        const data = await planning_service_js_1.planningService.expediteMaterialShortage(request.user.tenantId, request.user.plantId || "default-plant", input);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async listExpeditedShortages(request, reply) {
        const data = await planning_service_js_1.planningService.listExpeditedShortages(request.user.tenantId, request.user.plantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    // Safety Stock Policies
    async updateSafetyStock(request, reply) {
        const input = request.body ? request.body : {};
        const data = await planning_service_js_1.planningService.updateSafetyStockPolicy(request.user.tenantId, request.user.plantId || "default-plant", input);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, `Safety buffer policy updated successfully!`));
    }
    async listSafetyStock(request, reply) {
        const data = await planning_service_js_1.planningService.listSafetyStockPolicies(request.user.tenantId, request.user.plantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    // Commercial Service Risks
    async listServiceRisks(request, reply) {
        const data = await planning_service_js_1.planningService.listServiceRisks(request.user.tenantId, request.user.plantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async mitigateServiceRisk(request, reply) {
        const input = request.body ? request.body : {};
        const riskId = request.params.id || input.riskId;
        const data = await planning_service_js_1.planningService.mitigateServiceRisk(request.user.tenantId, request.user.plantId || "default-plant", { ...input, riskId });
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    // Supply & Demand Balance Reconciliation
    async getSupplyDemandBalance(request, reply) {
        const data = await planning_service_js_1.planningService.getSupplyDemandBalance(request.user.tenantId, request.user.plantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    // Schedule Versions & Revision Baselines
    async listScheduleVersions(request, reply) {
        const data = await planning_service_js_1.planningService.listScheduleVersions(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async createScheduleVersion(request, reply) {
        const input = request.body ? request.body : {};
        const data = await planning_service_js_1.planningService.createScheduleVersion(request.user.tenantId, input);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, `Master schedule version baseline ${data.versionId} created successfully!`));
    }
    // Schedule Feasibility Validation
    async validateSchedule(request, reply) {
        const input = request.body ? request.body : {};
        const data = await planning_service_js_1.planningService.validateSchedule(request.user.tenantId, input);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.status));
    }
    // Shop-Floor Publication & HMI Dispatch
    async getPublishSchedule(request, reply) {
        const data = await planning_service_js_1.planningService.getPublishSchedule(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Publish schedule overview loaded"));
    }
    async publishSchedule(request, reply) {
        const input = request.body ? request.body : {};
        const data = await planning_service_js_1.planningService.publishSchedule(request.user.tenantId, input);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    // AI Planning Copilot & Assistant
    async handleAiChat(request, reply) {
        const input = request.body ? request.body : {};
        const promptText = input.prompt || input.query || input.message || "";
        const data = await planning_service_js_1.planningService.handleAiChat(request.user.tenantId, promptText);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "AI Planning recommendation generated."));
    }
    async applyAiRecommendation(request, reply) {
        const input = request.body ? request.body : {};
        const id = input.id || input.recommendationId || "rec-1";
        const actionLabel = input.actionLabel || "Line 1 Sequence Optimization";
        const data = await planning_service_js_1.planningService.applyAiRecommendation(request.user.tenantId, id, actionLabel);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async simulateAiImpact(request, reply) {
        const input = request.body ? request.body : {};
        const data = await planning_service_js_1.planningService.simulateAiImpact(request.user.tenantId, input.recommendationId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Impact simulation complete"));
    }
    async getAiAssistantOverview(request, reply) {
        const data = await planning_service_js_1.planningService.getAiAssistantOverview(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "AI Assistant overview loaded"));
    }
    async listMaterialReservations(request, reply) {
        const data = await planning_service_js_1.planningService.listMaterialReservations(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Material reservations loaded"));
    }
    async createMaterialReservation(request, reply) {
        const input = request.body ? request.body : {};
        const data = await planning_service_js_1.planningService.createMaterialReservation(request.user.tenantId, input);
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, "Material reservation created"));
    }
    async stageMaterialReservation(request, reply) {
        const { id } = request.params;
        const input = request.body ? request.body : {};
        const resId = id || input.reservationId;
        const data = await planning_service_js_1.planningService.stageMaterialReservation(request.user.tenantId, resId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Material reservation staged at line"));
    }
    async releaseMaterialReservation(request, reply) {
        const { id } = request.params;
        const input = request.body ? request.body : {};
        const resId = id || input.reservationId;
        const data = await planning_service_js_1.planningService.releaseMaterialReservation(request.user.tenantId, resId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Material reservation released"));
    }
    async recalculateMaterialReservations(request, reply) {
        const data = await planning_service_js_1.planningService.recalculateMaterialReservations(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, data.message));
    }
    async getPlanningReports(request, reply) {
        const data = await planning_service_js_1.planningService.getPlanningReports(request.user.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Planning reports loaded"));
    }
    async getPlanningDashboardSummary(request, reply) {
        const query = request.query;
        const horizon = query?.horizon || "14d";
        const data = await planning_service_js_1.planningService.getPlanningDashboardSummary(request.user.tenantId, request.user.plantId, horizon);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
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