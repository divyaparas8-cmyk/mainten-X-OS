import { FastifyReply, FastifyRequest } from "fastify";
import { machineDataService } from "./services/machineData.service.js";
import { formatSuccess } from "../../shared/utils/responseFormatter.js";
import { ValidationError } from "../../shared/errors/AppError.js";

export class IoTController {
  async ingest(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as any;
    if (!body || typeof body !== "object") {
      throw new ValidationError("Telemetry payload must be a valid JSON object.");
    }

    const normalized = await machineDataService.ingest(body);
    return reply.status(201).send(formatSuccess(normalized, "Telemetry event normalized and ingested."));
  }

  async getLatest(request: FastifyRequest<{ Querystring: { assetCode?: string } }>, reply: FastifyReply) {
    const { assetCode } = request.query;
    const telemetry = machineDataService.getLatestTelemetry(assetCode);
    return reply.send(formatSuccess(telemetry));
  }

  async getHistory(
    request: FastifyRequest<{ Params: { assetCode: string }; Querystring: { limit?: string } }>,
    reply: FastifyReply
  ) {
    const { assetCode } = request.params;
    const limit = parseInt(request.query.limit || "50", 10);
    const history = await machineDataService.getHistory(assetCode, limit);
    return reply.send(formatSuccess(history));
  }

  async stream(_request: FastifyRequest, reply: FastifyReply) {
    // Set headers for Server-Sent Events (SSE)
    reply.raw.setHeader("Content-Type", "text/event-stream");
    reply.raw.setHeader("Cache-Control", "no-cache, no-transform");
    reply.raw.setHeader("Connection", "keep-alive");
    reply.raw.setHeader("X-Accel-Buffering", "no");

    machineDataService.addSseSubscriber(reply);
  }

  async startSimulator(_request: FastifyRequest, reply: FastifyReply) {
    const result = await machineDataService.startSimulator();
    return reply.send(formatSuccess(result));
  }

  async stopSimulator(_request: FastifyRequest, reply: FastifyReply) {
    const result = await machineDataService.stopSimulator();
    return reply.send(formatSuccess(result));
  }

  async getGateways(_request: FastifyRequest, reply: FastifyReply) {
    const gateways = await machineDataService.listGateways();
    return reply.send(formatSuccess(gateways));
  }
}

export const iotController = new IoTController();
