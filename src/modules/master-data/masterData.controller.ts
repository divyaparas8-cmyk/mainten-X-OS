import { FastifyReply, FastifyRequest } from "fastify";
import { masterDataService } from "./masterData.service.js";
import { createSkuSchema } from "./masterData.schema.js";
import { formatSuccess } from "../../shared/utils/responseFormatter.js";

export class MasterDataController {
  async getSkus(request: FastifyRequest, reply: FastifyReply) {
    const data = await masterDataService.listSkus(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async createSku(request: FastifyRequest, reply: FastifyReply) {
    const input = createSkuSchema.parse(request.body);
    const data = await masterDataService.createSku(request.user.tenantId, input);
    return reply.status(201).send(formatSuccess(data, "SKU created successfully"));
  }

  async getBoms(request: FastifyRequest, reply: FastifyReply) {
    const data = await masterDataService.listBoms(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async getLines(request: FastifyRequest<{ Querystring: { plantId?: string } }>, reply: FastifyReply) {
    const data = await masterDataService.listLines(request.user.tenantId, request.query.plantId || request.user.plantId);
    return reply.send(formatSuccess(data));
  }

  async getWorkCenters(request: FastifyRequest<{ Querystring: { plantId?: string } }>, reply: FastifyReply) {
    const data = await masterDataService.listWorkCenters(request.user.tenantId, request.query.plantId || request.user.plantId);
    return reply.send(formatSuccess(data));
  }

  async getAssets(request: FastifyRequest<{ Querystring: { plantId?: string } }>, reply: FastifyReply) {
    const data = await masterDataService.listAssets(request.user.tenantId, request.query.plantId || request.user.plantId);
    return reply.send(formatSuccess(data));
  }

  async getStaff(request: FastifyRequest<{ Querystring: { plantId?: string } }>, reply: FastifyReply) {
    const data = await masterDataService.listStaff(request.user.tenantId, request.query.plantId || request.user.plantId);
    return reply.send(formatSuccess(data));
  }

  async getQualitySpecs(request: FastifyRequest, reply: FastifyReply) {
    const data = await masterDataService.listQualitySpecs(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }
}

export const masterDataController = new MasterDataController();
