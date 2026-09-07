import { FastifyReply, FastifyRequest } from "fastify";
import { maintenanceService } from "./maintenance.service.js";
import { createWorkOrderSchema, updateWorkOrderStatusSchema } from "./maintenance.schema.js";
import { formatSuccess } from "../../shared/utils/responseFormatter.js";

export class MaintenanceController {
  async getWorkOrders(request: FastifyRequest, reply: FastifyReply) {
    const data = await maintenanceService.listWorkOrders(request.user.tenantId, request.user.plantId);
    return reply.send(formatSuccess(data));
  }

  async createWorkOrder(request: FastifyRequest, reply: FastifyReply) {
    const input = createWorkOrderSchema.parse(request.body);
    const data = await maintenanceService.createWorkOrder(request.user.tenantId, request.user.plantId || "default-plant", input, request.user.userId);
    return reply.status(201).send(formatSuccess(data, "Maintenance Work Order created"));
  }

  async updateWorkOrderStatus(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const input = updateWorkOrderStatusSchema.parse(request.body);
    const data = await maintenanceService.updateWorkOrderStatus(request.user.tenantId, request.params.id, input);
    return reply.send(formatSuccess(data, `Work Order status updated to ${input.status}`));
  }

  async getPMSchedules(request: FastifyRequest, reply: FastifyReply) {
    const data = await maintenanceService.listPMSchedules(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async getSpareParts(request: FastifyRequest, reply: FastifyReply) {
    const data = await maintenanceService.listSpareParts(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async getReliabilityMetrics(request: FastifyRequest, reply: FastifyReply) {
    const data = await maintenanceService.getReliabilityMetrics(request.user.tenantId, request.user.plantId);
    return reply.send(formatSuccess(data));
  }
}

export const maintenanceController = new MaintenanceController();
