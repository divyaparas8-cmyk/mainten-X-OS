import { FastifyReply, FastifyRequest } from "fastify";
import { productionService } from "./production.service.js";
import { formatSuccess } from "../../shared/utils/responseFormatter.js";
import { resolvePlantId } from "../../shared/utils/tenantContext.js";

export class ProductionController {
  async getOrders(request: FastifyRequest, reply: FastifyReply) {
    const plantId = await resolvePlantId(request.user.tenantId, request.user.plantId);
    const data = await productionService.listOrders(request.user.tenantId, plantId);
    return reply.send(formatSuccess(data));
  }

  async createOrder(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as any;
    const plantId = await resolvePlantId(request.user.tenantId, request.user.plantId);
    const data = await productionService.createOrder(request.user.tenantId, plantId, body);
    return reply.status(201).send(formatSuccess(data, "Production Order created & eBR Batch initialized"));
  }

  async updateOrderStatus(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { status } = request.body as any;
    const data = await productionService.updateOrderStatus(request.user.tenantId, request.params.id, status);
    return reply.send(formatSuccess(data, `Order status advanced to ${status}`));
  }

  async getBatches(request: FastifyRequest, reply: FastifyReply) {
    const data = await productionService.listBatches(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async advanceBatchStep(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const body = request.body as any;
    const data = await productionService.advanceBatchStep(request.user.tenantId, request.params.id, body, request.user.userId);
    return reply.send(formatSuccess(data, "Batch step completed successfully"));
  }

  async verifyLot(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { lotNo } = request.body as any;
    const data = await productionService.verifyLot(request.params.id, lotNo || "LOT-2026-9901");
    return reply.send(formatSuccess(data));
  }

  async completeBatch(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const data = await productionService.completeBatch(request.params.id);
    return reply.send(formatSuccess(data, "Batch marked as completed"));
  }

  async qaReleaseBatch(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const data = await productionService.qaRelease(request.params.id);
    return reply.send(formatSuccess(data, "Batch released for QA"));
  }

  async recordOperatorEntry(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as any;
    const plantId = await resolvePlantId(request.user.tenantId, request.user.plantId);
    const data = await productionService.recordOperatorEntry(request.user.tenantId, plantId, body, request.user.userId);
    return reply.send(formatSuccess(data, "Operator production log recorded & order counter incremented"));
  }

  async logDowntime(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as any;
    const plantId = await resolvePlantId(request.user.tenantId, request.user.plantId);
    const data = await productionService.logDowntime(request.user.tenantId, plantId, body, request.user.userId);
    return reply.send(formatSuccess(data, "Downtime stoppage recorded"));
  }

  async getDowntime(request: FastifyRequest, reply: FastifyReply) {
    const data = await productionService.listDowntime((request.query as any)?.plantId || request.user.plantId);
    return reply.send(formatSuccess(data));
  }

  // --- Plant Manager Handlers ---

  async getHbLogs(request: FastifyRequest, reply: FastifyReply) {
    const data = await productionService.listHbLogs((request.query as any)?.plantId || request.user.plantId);
    return reply.send(formatSuccess(data));
  }

  async createHbLog(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as any;
    const data = await productionService.createHbLog(body);
    return reply.status(201).send(formatSuccess(data, "Pitch hour registered"));
  }

  async getOEE(request: FastifyRequest, reply: FastifyReply) {
    const { period, plantId } = request.query as any;
    const data = await productionService.getOEEAnalytics(plantId || request.user.plantId, period || "daily");
    return reply.send(formatSuccess(data));
  }

  async getPerformance(request: FastifyRequest, reply: FastifyReply) {
    const data = await productionService.getProductionPerformance((request.query as any)?.plantId || request.user.plantId);
    return reply.send(formatSuccess(data));
  }

  async getMachines(request: FastifyRequest, reply: FastifyReply) {
    const data = await productionService.listMachines((request.query as any)?.plantId || request.user.plantId);
    return reply.send(formatSuccess(data));
  }

  async updateMachineStatus(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { status } = request.body as any;
    const data = await productionService.updateMachineStatus(request.params.id, status);
    return reply.send(formatSuccess(data, `Machine status updated to ${status}`));
  }

  async getShiftHandoffs(request: FastifyRequest, reply: FastifyReply) {
    const data = await productionService.listShiftHandoffs((request.query as any)?.plantId || request.user.plantId);
    return reply.send(formatSuccess(data));
  }

  async createShiftHandoff(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as any;
    const data = await productionService.createShiftHandoff(body);
    return reply.status(201).send(formatSuccess(data, "Shift handoff recorded"));
  }

  async getShiftPerformance(request: FastifyRequest, reply: FastifyReply) {
    const data = await productionService.getShiftPerformance((request.query as any)?.plantId || request.user.plantId);
    return reply.send(formatSuccess(data));
  }
}

export const productionController = new ProductionController();
