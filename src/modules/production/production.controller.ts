import { FastifyReply, FastifyRequest } from "fastify";
import { productionService } from "./production.service.js";
import { createProductionOrderSchema, updateOrderStatusSchema, updateBatchStepSchema, recordOperatorEntrySchema, logDowntimeSchema } from "./production.schema.js";
import { formatSuccess } from "../../shared/utils/responseFormatter.js";

export class ProductionController {
  async getOrders(request: FastifyRequest, reply: FastifyReply) {
    const data = await productionService.listOrders(request.user.tenantId, request.user.plantId);
    return reply.send(formatSuccess(data));
  }

  async createOrder(request: FastifyRequest, reply: FastifyReply) {
    const input = createProductionOrderSchema.parse(request.body);
    const data = await productionService.createOrder(request.user.tenantId, request.user.plantId || "default-plant", input);
    return reply.status(201).send(formatSuccess(data, "Production Order created & eBR Batch initialized"));
  }

  async updateOrderStatus(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { status } = updateOrderStatusSchema.parse(request.body);
    const data = await productionService.updateOrderStatus(request.user.tenantId, request.params.id, status);
    return reply.send(formatSuccess(data, `Order status advanced to ${status}`));
  }

  async getBatches(request: FastifyRequest, reply: FastifyReply) {
    const data = await productionService.listBatches(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async advanceBatchStep(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const input = updateBatchStepSchema.parse(request.body);
    const data = await productionService.advanceBatchStep(request.user.tenantId, request.params.id, input, request.user.userId);
    return reply.send(formatSuccess(data, `Batch step ${input.stepNumber} completed successfully`));
  }

  async recordOperatorEntry(request: FastifyRequest, reply: FastifyReply) {
    const input = recordOperatorEntrySchema.parse(request.body);
    const data = await productionService.recordOperatorEntry(request.user.tenantId, request.user.plantId || "default-plant", input, request.user.userId);
    return reply.send(formatSuccess(data, "Operator production log recorded & order counter incremented"));
  }

  async logDowntime(request: FastifyRequest, reply: FastifyReply) {
    const input = logDowntimeSchema.parse(request.body);
    const data = await productionService.logDowntime(request.user.tenantId, request.user.plantId || "default-plant", input, request.user.userId);
    return reply.send(formatSuccess(data, "Downtime stoppage recorded"));
  }
}

export const productionController = new ProductionController();
