import { FastifyReply, FastifyRequest } from "fastify";
import { planningService } from "./planning.service.js";
import {
  createCustomerOrderSchema,
  updateCustomerOrderSchema,
  createForecastSchema,
  updateForecastSchema,
  runForecastSchema,
  createPromotionSchema,
  updatePromotionSchema,
  createApsScheduleSchema,
  updateShipmentStatusSchema
} from "./planning.schema.js";
import { formatSuccess } from "../../shared/utils/responseFormatter.js";

import { resolvePlantId } from "../../shared/utils/tenantContext.js";

export class PlanningController {
  // Demand Orders
  async getCustomerOrders(request: FastifyRequest, reply: FastifyReply) {
    const plantId = await resolvePlantId(request.user.tenantId, request.user.plantId);
    const data = await planningService.listCustomerOrders(request.user.tenantId, plantId);
    return reply.send(formatSuccess(data));
  }

  async createCustomerOrder(request: FastifyRequest, reply: FastifyReply) {
    const input = createCustomerOrderSchema.parse(request.body);
    const plantId = await resolvePlantId(request.user.tenantId, request.user.plantId);
    const data = await planningService.createCustomerOrder(request.user.tenantId, plantId || "default-plant", input);
    return reply.status(201).send(formatSuccess(data, "Customer demand order created successfully"));
  }

  async updateCustomerOrder(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const input = updateCustomerOrderSchema.parse(request.body);
    const data = await planningService.updateCustomerOrder(request.user.tenantId, request.params.id, input);
    return reply.send(formatSuccess(data, "Customer demand order updated successfully"));
  }

  async deleteCustomerOrder(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const data = await planningService.deleteCustomerOrder(request.user.tenantId, request.params.id);
    return reply.send(formatSuccess(data, "Customer demand order cancelled successfully"));
  }

  // Forecasts & Overrides
  async getForecasts(request: FastifyRequest, reply: FastifyReply) {
    const data = await planningService.listForecasts(request.user.tenantId, request.user.plantId);
    return reply.send(formatSuccess(data));
  }

  async createForecast(request: FastifyRequest, reply: FastifyReply) {
    const input = createForecastSchema.parse(request.body);
    const data = await planningService.createForecast(request.user.tenantId, request.user.plantId || "default-plant", input);
    return reply.status(201).send(formatSuccess(data, "Demand forecast created successfully"));
  }

  async updateForecast(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const input = updateForecastSchema.parse(request.body);
    const data = await planningService.updateForecast(request.user.tenantId, request.params.id, input);
    return reply.send(formatSuccess(data, "Demand forecast updated successfully"));
  }

  async deleteForecast(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const data = await planningService.deleteForecast(request.user.tenantId, request.params.id);
    return reply.send(formatSuccess(data, "Demand forecast deleted successfully"));
  }

  // Demand History
  async getDemandHistory(request: FastifyRequest, reply: FastifyReply) {
    const data = await planningService.listDemandHistory(request.user.tenantId, request.user.plantId);
    return reply.send(formatSuccess(data));
  }

  // Promotions & Uplift
  async getPromotions(request: FastifyRequest, reply: FastifyReply) {
    const data = await planningService.listPromotions(request.user.tenantId, request.user.plantId);
    return reply.send(formatSuccess(data));
  }

  async createPromotion(request: FastifyRequest, reply: FastifyReply) {
    const input = createPromotionSchema.parse(request.body);
    const data = await planningService.createPromotion(request.user.tenantId, input);
    return reply.status(201).send(formatSuccess(data, "Commercial promotion created successfully"));
  }

  async updatePromotion(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const input = updatePromotionSchema.parse(request.body);
    const data = await planningService.updatePromotion(request.user.tenantId, request.params.id, input);
    return reply.send(formatSuccess(data, "Commercial promotion updated successfully"));
  }

  // Shipments Outbound
  async getShipments(request: FastifyRequest, reply: FastifyReply) {
    const data = await planningService.listShipments(request.user.tenantId, request.user.plantId);
    return reply.send(formatSuccess(data));
  }

  async createShipment(request: FastifyRequest, reply: FastifyReply) {
    const data = await planningService.createShipment(request.user.tenantId, request.body);
    return reply.status(201).send(formatSuccess(data, "Outbound freight booking created successfully"));
  }

  async updateShipmentStatus(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const input = updateShipmentStatusSchema.parse(request.body);
    const data = await planningService.updateShipmentStatus(request.user.tenantId, request.params.id, input.status);
    return reply.send(formatSuccess(data, `Shipment status updated to ${input.status}`));
  }

  // Forecast Execution & APS & MRP
  async runForecast(request: FastifyRequest, reply: FastifyReply) {
    const input = runForecastSchema.parse(request.body);
    const plantId = await resolvePlantId(request.user.tenantId, request.user.plantId);
    const data = await planningService.runStatisticalForecast(request.user.tenantId, plantId, input);
    return reply.send(formatSuccess(data, "Statistical forecast calculated cleanly"));
  }

  async getApsSchedules(request: FastifyRequest, reply: FastifyReply) {
    const plantId = await resolvePlantId(request.user.tenantId, request.user.plantId);
    const data = await planningService.listApsSchedules(request.user.tenantId, plantId);
    return reply.send(formatSuccess(data));
  }

  async createApsSchedule(request: FastifyRequest, reply: FastifyReply) {
    const input = request.body ? (request.body as any) : {};
    const plantId = await resolvePlantId(request.user.tenantId, request.user.plantId);
    const data = await planningService.createApsSchedule(request.user.tenantId, plantId || "default-plant", input);
    return reply.status(201).send(formatSuccess(data, "APS Schedule block published"));
  }

  async rescheduleApsSchedule(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const input = request.body ? (request.body as any) : {};
    const scheduleId = request.params.id || input.scheduleId;
    const data = await planningService.rescheduleApsSchedule(request.user.tenantId, scheduleId, input);
    return reply.send(formatSuccess(data, `Schedule run ${scheduleId} successfully rescheduled`));
  }

  async splitApsSchedule(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const input = request.body ? (request.body as any) : {};
    const scheduleId = request.params.id || input.scheduleId;
    const data = await planningService.splitApsSchedule(request.user.tenantId, scheduleId, input);
    return reply.send(formatSuccess(data, data.message || `Schedule run split successfully`));
  }

  async optimizeApsSchedule(request: FastifyRequest, reply: FastifyReply) {
    const input = request.body ? (request.body as any) : {};
    const data = await planningService.optimizeApsSchedule(request.user.tenantId, request.user.plantId, input);
    return reply.send(formatSuccess(data, data.message || "APS schedule sequence optimized"));
  }

  async getCapacityCalculations(request: FastifyRequest, reply: FastifyReply) {
    const data = await planningService.getCapacityCalculations(request.user.tenantId, request.user.plantId);
    return reply.send(formatSuccess(data));
  }

  async getWorkCenters(request: FastifyRequest, reply: FastifyReply) {
    const data = await planningService.getWorkCenters(request.user.tenantId, request.user.plantId);
    return reply.send(formatSuccess(data));
  }

  async getChangeovers(request: FastifyRequest, reply: FastifyReply) {
    const data = await planningService.getChangeovers(request.user.tenantId, request.user.plantId);
    return reply.send(formatSuccess(data));
  }

  async createChangeover(request: FastifyRequest, reply: FastifyReply) {
    const data = await planningService.createChangeover(request.user.tenantId, request.body);
    return reply.status(201).send(formatSuccess(data, "Changeover matrix rule created successfully"));
  }

  async getMrpExplosion(request: FastifyRequest, reply: FastifyReply) {
    const plantId = await resolvePlantId(request.user.tenantId, request.user.plantId);
    const data = await planningService.runMrpExplosion(request.user.tenantId, plantId);
    return reply.send(formatSuccess(data, "MRP Net Requirements calculated"));
  }


  // MRP Engine Run Simulation
  async runMrpEngine(request: FastifyRequest, reply: FastifyReply) {
    const input = request.body ? (request.body as any) : {};
    const data = await planningService.runMrpEngineCalculation(request.user.tenantId, request.user.plantId || "default-plant", input);
    return reply.send(formatSuccess(data, "MRP calculation complete! Requirements exploded across BOM levels."));
  }

  // Purchase Requisitions (Raise PO)
  async createPurchaseRequisition(request: FastifyRequest, reply: FastifyReply) {
    const input = request.body ? (request.body as any) : {};
    const data = await planningService.createPurchaseRequisition(request.user.tenantId, request.user.plantId || "default-plant", input);
    return reply.status(201).send(formatSuccess(data, `Purchase Requisition ${data.reqNumber} generated successfully!`));
  }

  async listPurchaseRequisitions(request: FastifyRequest, reply: FastifyReply) {
    const data = await planningService.listPurchaseRequisitions(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  // Material Shortages Expediting
  async expediteShortage(request: FastifyRequest, reply: FastifyReply) {
    const input = request.body ? (request.body as any) : {};
    const data = await planningService.expediteMaterialShortage(request.user.tenantId, request.user.plantId || "default-plant", input);
    return reply.send(formatSuccess(data, data.message));
  }

  async listExpeditedShortages(request: FastifyRequest, reply: FastifyReply) {
    const data = await planningService.listExpeditedShortages(request.user.tenantId, request.user.plantId);
    return reply.send(formatSuccess(data));
  }

  // Safety Stock Policies
  async updateSafetyStock(request: FastifyRequest, reply: FastifyReply) {
    const input = request.body ? (request.body as any) : {};
    const data = await planningService.updateSafetyStockPolicy(request.user.tenantId, request.user.plantId || "default-plant", input);
    return reply.send(formatSuccess(data, `Safety buffer policy updated successfully!`));
  }

  async listSafetyStock(request: FastifyRequest, reply: FastifyReply) {
    const data = await planningService.listSafetyStockPolicies(request.user.tenantId, request.user.plantId);
    return reply.send(formatSuccess(data));
  }

  // Commercial Service Risks
  async listServiceRisks(request: FastifyRequest, reply: FastifyReply) {
    const data = await planningService.listServiceRisks(request.user.tenantId, request.user.plantId);
    return reply.send(formatSuccess(data));
  }

  async mitigateServiceRisk(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const input = request.body ? (request.body as any) : {};
    const riskId = request.params.id || input.riskId;
    const data = await planningService.mitigateServiceRisk(request.user.tenantId, request.user.plantId || "default-plant", { ...input, riskId });
    return reply.send(formatSuccess(data, data.message));
  }

  // Supply & Demand Balance Reconciliation
  async getSupplyDemandBalance(request: FastifyRequest, reply: FastifyReply) {
    const data = await planningService.getSupplyDemandBalance(request.user.tenantId, request.user.plantId);
    return reply.send(formatSuccess(data));
  }

  // Schedule Versions & Revision Baselines
  async listScheduleVersions(request: FastifyRequest, reply: FastifyReply) {
    const data = await planningService.listScheduleVersions(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async createScheduleVersion(request: FastifyRequest, reply: FastifyReply) {
    const input = request.body ? (request.body as any) : {};
    const data = await planningService.createScheduleVersion(request.user.tenantId, input);
    return reply.send(formatSuccess(data, `Master schedule version baseline ${data.versionId} created successfully!`));
  }

  // Schedule Feasibility Validation
  async validateSchedule(request: FastifyRequest, reply: FastifyReply) {
    const input = request.body ? (request.body as any) : {};
    const data = await planningService.validateSchedule(request.user.tenantId, input);
    return reply.send(formatSuccess(data, data.status));
  }

  // Shop-Floor Publication & HMI Dispatch
  async getPublishSchedule(request: FastifyRequest, reply: FastifyReply) {
    const data = await planningService.getPublishSchedule(request.user.tenantId);
    return reply.send(formatSuccess(data, "Publish schedule overview loaded"));
  }

  async publishSchedule(request: FastifyRequest, reply: FastifyReply) {
    const input = request.body ? (request.body as any) : {};
    const data = await planningService.publishSchedule(request.user.tenantId, input);
    return reply.send(formatSuccess(data, data.message));
  }

  // AI Planning Copilot & Assistant
  async handleAiChat(request: FastifyRequest, reply: FastifyReply) {
    const input = request.body ? (request.body as any) : {};
    const promptText = input.prompt || input.query || input.message || "";
    const data = await planningService.handleAiChat(request.user.tenantId, promptText);
    return reply.send(formatSuccess(data, "AI Planning recommendation generated."));
  }

  async applyAiRecommendation(request: FastifyRequest, reply: FastifyReply) {
    const input = request.body ? (request.body as any) : {};
    const id = input.id || input.recommendationId || "rec-1";
    const actionLabel = input.actionLabel || "Line 1 Sequence Optimization";
    const data = await planningService.applyAiRecommendation(request.user.tenantId, id, actionLabel);
    return reply.send(formatSuccess(data, data.message));
  }

  async simulateAiImpact(request: FastifyRequest, reply: FastifyReply) {
    const input = request.body ? (request.body as any) : {};
    const data = await planningService.simulateAiImpact(request.user.tenantId, input.recommendationId);
    return reply.send(formatSuccess(data, "Impact simulation complete"));
  }

  async getAiAssistantOverview(request: FastifyRequest, reply: FastifyReply) {
    const data = await planningService.getAiAssistantOverview(request.user.tenantId);
    return reply.send(formatSuccess(data, "AI Assistant overview loaded"));
  }

  async listMaterialReservations(request: FastifyRequest, reply: FastifyReply) {
    const data = await planningService.listMaterialReservations(request.user.tenantId);
    return reply.send(formatSuccess(data, "Material reservations loaded"));
  }

  async createMaterialReservation(request: FastifyRequest, reply: FastifyReply) {
    const input = request.body ? (request.body as any) : {};
    const data = await planningService.createMaterialReservation(request.user.tenantId, input);
    return reply.status(201).send(formatSuccess(data, "Material reservation created"));
  }

  async stageMaterialReservation(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const input = request.body ? (request.body as any) : {};
    const resId = id || input.reservationId;
    const data = await planningService.stageMaterialReservation(request.user.tenantId, resId);
    return reply.send(formatSuccess(data, "Material reservation staged at line"));
  }

  async releaseMaterialReservation(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const input = request.body ? (request.body as any) : {};
    const resId = id || input.reservationId;
    const data = await planningService.releaseMaterialReservation(request.user.tenantId, resId);
    return reply.send(formatSuccess(data, "Material reservation released"));
  }

  async recalculateMaterialReservations(request: FastifyRequest, reply: FastifyReply) {
    const data = await planningService.recalculateMaterialReservations(request.user.tenantId);
    return reply.send(formatSuccess(data, data.message));
  }

  async getPlanningReports(request: FastifyRequest, reply: FastifyReply) {
    const data = await planningService.getPlanningReports(request.user.tenantId);
    return reply.send(formatSuccess(data, "Planning reports loaded"));
  }

  async getPlanningDashboardSummary(request: FastifyRequest, reply: FastifyReply) {
    const query = request.query as any;
    const horizon = query?.horizon || "14d";
    const data = await planningService.getPlanningDashboardSummary(request.user.tenantId, request.user.plantId, horizon);
    return reply.send(formatSuccess(data));
  }
}

export const planningController = new PlanningController();


