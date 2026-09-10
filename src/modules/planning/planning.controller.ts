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

  // --- Plant Manager Handlers ---

  async getSchedules(request: FastifyRequest, reply: FastifyReply) {
    const data = await planningService.listSchedules((request.query as any)?.plantId || request.user.plantId);
    return reply.send(formatSuccess(data));
  }

  async createSchedule(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as any;
    const data = await planningService.createSchedule({
      sku: body.sku,
      line: body.line,
      quantity: Number(body.quantity || body.plannedQty || 30000),
      startTime: body.startTime || "06:00",
      endTime: body.endTime || "14:30",
      plantId: body.plantId || request.user.plantId,
    });
    return reply.status(201).send(formatSuccess(data, "Schedule run created successfully"));
  }

  async toggleScheduleLock(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const body = request.body as any;
    const data = await planningService.toggleScheduleLock(id, body?.locked);
    return reply.send(formatSuccess(data, "Schedule lock updated"));
  }

  async deleteSchedule(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const data = await planningService.deleteSchedule(id);
    return reply.send(formatSuccess(data, "Schedule run deleted"));
  }

  async getCapacity(request: FastifyRequest, reply: FastifyReply) {
    const data = await planningService.listCapacity((request.query as any)?.plantId || request.user.plantId);
    return reply.send(formatSuccess(data));
  }

  async getConstraints(request: FastifyRequest, reply: FastifyReply) {
    const data = await planningService.listConstraints((request.query as any)?.plantId || request.user.plantId);
    return reply.send(formatSuccess(data));
  }

  async createConstraint(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as any;
    const data = await planningService.createConstraint({
      type: body.type,
      description: body.description,
      line: body.line,
      impact: body.impact,
      risk: body.risk || "Medium",
      plantId: body.plantId || request.user.plantId,
    });
    return reply.status(201).send(formatSuccess(data, "Constraint registered"));
  }

  async resolveConstraint(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const data = await planningService.resolveConstraint(id);
    return reply.send(formatSuccess(data, "Constraint marked resolved"));
  }

  async deleteConstraint(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const data = await planningService.deleteConstraint(id);
    return reply.send(formatSuccess(data, "Constraint deleted"));
  }

  async applyRecovery(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as any;
    const data = await planningService.applyRecovery({
      speedBoostPercent: Number(body.speedBoostPercent || body.speedBoost || 0),
      overtimeHours: Number(body.overtimeHours || body.overtime || 0),
      plantId: body.plantId || request.user.plantId,
    });
    return reply.send(formatSuccess(data, "Recovery plan calculated & applied"));
  }
}

export const planningController = new PlanningController();
