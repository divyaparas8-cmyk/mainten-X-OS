import { FastifyReply, FastifyRequest } from "fastify";
import { planningService } from "./planning.service.js";
import { createCustomerOrderSchema, runForecastSchema, createApsScheduleSchema, createPromotionCampaignSchema } from "./planning.schema.js";
import { formatSuccess } from "../../shared/utils/responseFormatter.js";

import { resolvePlantId } from "../../shared/utils/tenantContext.js";

export class PlanningController {
  async getCustomerOrders(request: FastifyRequest, reply: FastifyReply) {
    const plantId = await resolvePlantId(request.user.tenantId, request.user.plantId);
    const data = await planningService.listCustomerOrders(request.user.tenantId, plantId);
    return reply.send(formatSuccess(data));
  }

  async createCustomerOrder(request: FastifyRequest, reply: FastifyReply) {
    const input = createCustomerOrderSchema.parse(request.body);
    const plantId = await resolvePlantId(request.user.tenantId, request.user.plantId);
    const data = await planningService.createCustomerOrder(request.user.tenantId, plantId, input);
    return reply.status(201).send(formatSuccess(data, "Customer demand order created"));
  }

  async updateCustomerOrder(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params;
    const data = await planningService.updateCustomerOrder(request.user.tenantId, id, request.body as any);
    return reply.send(formatSuccess(data, "Customer demand order updated"));
  }

  async deleteCustomerOrder(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params;
    await planningService.deleteCustomerOrder(request.user.tenantId, id);
    return reply.send(formatSuccess(null, "Customer demand order deleted"));
  }

  async runForecast(request: FastifyRequest, reply: FastifyReply) {
    const input = runForecastSchema.parse(request.body);
    const plantId = await resolvePlantId(request.user.tenantId, request.user.plantId);
    const data = await planningService.runStatisticalForecast(request.user.tenantId, plantId, input);
    return reply.send(formatSuccess(data, "Statistical forecast calculated cleanly"));
  }

  async getForecasts(request: FastifyRequest, reply: FastifyReply) {
    const data = await planningService.listForecasts(request.user.tenantId);
    return reply.send(formatSuccess(data, "Forecast records retrieved from database"));
  }

  async getApsSchedules(request: FastifyRequest, reply: FastifyReply) {
    const plantId = await resolvePlantId(request.user.tenantId, request.user.plantId);
    const data = await planningService.listApsSchedules(request.user.tenantId, plantId);
    return reply.send(formatSuccess(data));
  }

  async createApsSchedule(request: FastifyRequest, reply: FastifyReply) {
    const input = createApsScheduleSchema.parse(request.body);
    const plantId = await resolvePlantId(request.user.tenantId, request.user.plantId);
    const data = await planningService.createApsSchedule(request.user.tenantId, plantId, input);
    return reply.status(201).send(formatSuccess(data, "APS Schedule block published"));
  }

  async getMrpExplosion(request: FastifyRequest, reply: FastifyReply) {
    const plantId = await resolvePlantId(request.user.tenantId, request.user.plantId);
    const data = await planningService.runMrpExplosion(request.user.tenantId, plantId);
    return reply.send(formatSuccess(data, "MRP Net Requirements calculated"));
  }

  async getPromotionCampaigns(request: FastifyRequest, reply: FastifyReply) {
    const plantId = await resolvePlantId(request.user.tenantId, request.user.plantId);
    const data = await planningService.listPromotionCampaigns(request.user.tenantId, plantId);
    return reply.send(formatSuccess(data, "Promotion campaigns retrieved from database"));
  }

  async createPromotionCampaign(request: FastifyRequest, reply: FastifyReply) {
    const input = createPromotionCampaignSchema.parse(request.body);
    const plantId = await resolvePlantId(request.user.tenantId, request.user.plantId);
    const data = await planningService.createPromotionCampaign(request.user.tenantId, plantId, input);
    return reply.status(201).send(formatSuccess(data, "Promotion campaign registered in database"));
  }

  async updatePromotionCampaign(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params;
    const input = createPromotionCampaignSchema.partial().parse(request.body);
    const data = await planningService.updatePromotionCampaign(request.user.tenantId, id, input);
    return reply.send(formatSuccess(data, "Promotion campaign updated in database"));
  }

  async deletePromotionCampaign(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params;
    await planningService.deletePromotionCampaign(request.user.tenantId, id);
    return reply.send(formatSuccess(null, "Promotion campaign deleted from database"));
  }
}

export const planningController = new PlanningController();

