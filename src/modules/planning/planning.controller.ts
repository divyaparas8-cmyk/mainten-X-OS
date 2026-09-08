import { FastifyReply, FastifyRequest } from "fastify";
import { planningService } from "./planning.service.js";
import { createCustomerOrderSchema, runForecastSchema, createApsScheduleSchema } from "./planning.schema.js";
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
}

export const planningController = new PlanningController();
