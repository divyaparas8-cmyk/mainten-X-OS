import { FastifyReply, FastifyRequest } from "fastify";
import { qualityService } from "./quality.service.js";
import { recordCcpCheckSchema, qaBatchReleaseSchema, createQualityHoldSchema } from "./quality.schema.js";
import { formatSuccess } from "../../shared/utils/responseFormatter.js";

export class QualityController {
  async getCcpChecks(request: FastifyRequest, reply: FastifyReply) {
    const data = await qualityService.listCcpChecks(request.user.tenantId, request.user.plantId);
    return reply.send(formatSuccess(data));
  }

  async recordCcpCheck(request: FastifyRequest, reply: FastifyReply) {
    const input = recordCcpCheckSchema.parse(request.body);
    const data = await qualityService.recordCcpCheck(request.user.tenantId, request.user.plantId || "default-plant", input, request.user.userId);
    return reply.status(201).send(formatSuccess(data, `CCP check recorded (${data.status})`));
  }

  async getQaReleaseQueue(request: FastifyRequest, reply: FastifyReply) {
    const data = await qualityService.listQaReleaseQueue(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async authorizeBatchRelease(request: FastifyRequest, reply: FastifyReply) {
    const input = qaBatchReleaseSchema.parse(request.body);
    const data = await qualityService.authorizeBatchRelease(
      request.user.tenantId,
      request.user.plantId || "default-plant",
      input,
      request.user.userId,
      request.ip
    );
    return reply.send(formatSuccess(data, "Batch disposition digitally signed & QA Release approved (21 CFR Part 11)"));
  }

  async getQualityHolds(request: FastifyRequest, reply: FastifyReply) {
    const data = await qualityService.listQualityHolds(request.user.tenantId);
    return reply.send(formatSuccess(data));
  }

  async createQualityHold(request: FastifyRequest, reply: FastifyReply) {
    const input = createQualityHoldSchema.parse(request.body);
    const data = await qualityService.createQualityHold(request.user.tenantId, request.user.plantId || "default-plant", input, request.user.userId);
    return reply.status(201).send(formatSuccess(data, "Lot placed on quarantine hold"));
  }
}

export const qualityController = new QualityController();
