import { FastifyReply, FastifyRequest } from "fastify";
import { warehouseService } from "./warehouse.service.js";
import { createLotSchema, createTransactionSchema } from "./warehouse.schema.js";
import { formatSuccess } from "../../shared/utils/responseFormatter.js";

export class WarehouseController {
  async getLots(request: FastifyRequest, reply: FastifyReply) {
    const data = await warehouseService.listLots(request.user.tenantId, request.user.plantId);
    return reply.send(formatSuccess(data));
  }

  async createLot(request: FastifyRequest, reply: FastifyReply) {
    const input = createLotSchema.parse(request.body);
    const data = await warehouseService.createLot(request.user.tenantId, request.user.plantId || "default-plant", input);
    return reply.status(201).send(formatSuccess(data, "Inventory lot registered & initial receipt transaction logged"));
  }

  async recordTransaction(request: FastifyRequest, reply: FastifyReply) {
    const input = createTransactionSchema.parse(request.body);
    const data = await warehouseService.recordTransaction(request.user.tenantId, request.user.plantId || "default-plant", input, request.user.userId);
    return reply.status(201).send(formatSuccess(data, `Inventory transaction [${input.type}] recorded cleanly`));
  }

  async getWarehouses(request: FastifyRequest, reply: FastifyReply) {
    const data = await warehouseService.listWarehouses(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async getBins(request: FastifyRequest<{ Querystring: { warehouseId?: string } }>, reply: FastifyReply) {
    const data = await warehouseService.listBins(request.query.warehouseId);
    return reply.send(formatSuccess(data));
  }
}

export const warehouseController = new WarehouseController();
