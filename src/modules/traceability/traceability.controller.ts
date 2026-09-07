import { FastifyReply, FastifyRequest } from "fastify";
import { traceabilityService } from "./traceability.service.js";
import { formatSuccess } from "../../shared/utils/responseFormatter.js";
import { z } from "zod";

const recallSimulationSchema = z.object({
  lotNumber: z.string().min(2),
  reason: z.string().min(2),
});

export class TraceabilityController {
  async getGenealogy(request: FastifyRequest<{ Params: { lotNumber: string } }>, reply: FastifyReply) {
    const data = await traceabilityService.get360Genealogy(request.user.tenantId, request.params.lotNumber);
    return reply.send(formatSuccess(data));
  }

  async runRecallSimulation(request: FastifyRequest, reply: FastifyReply) {
    const input = recallSimulationSchema.parse(request.body);
    const data = await traceabilityService.runRecallSimulation(
      request.user.tenantId,
      request.user.plantId || "default-plant",
      input.lotNumber,
      input.reason,
      request.user.userId
    );
    return reply.send(formatSuccess(data, "Digital 360° Recall Simulation executed and containment plan generated"));
  }
}

export const traceabilityController = new TraceabilityController();
