import { FastifyReply, FastifyRequest } from "fastify";
import { exceptionsService } from "./exceptions.service.js";
import { formatSuccess } from "../../shared/utils/responseFormatter.js";

export class ExceptionsController {
  async getExceptions(request: FastifyRequest, reply: FastifyReply) {
    const { plantId, severity, category } = request.query as any;
    const data = await exceptionsService.listExceptions(plantId || request.user.plantId, severity, category);
    return reply.send(formatSuccess(data));
  }

  async getException(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const data = await exceptionsService.getException(request.params.id);
    return reply.send(formatSuccess(data));
  }

  async createException(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as any;
    const data = await exceptionsService.createException({
      title: body.title,
      severity: body.severity,
      category: body.category,
      assetOrOrder: body.assetOrOrder,
      impactDescription: body.impactDescription || body.description,
      owner: body.owner,
      escalationLevel: body.escalationLevel,
      plantId: body.plantId || request.user.plantId,
    });
    return reply.status(201).send(formatSuccess(data, "Exception alert logged in Control Tower"));
  }

  async assignException(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const body = request.body as any;
    const data = await exceptionsService.assignException(request.params.id, body);
    return reply.send(formatSuccess(data, "Exception assigned & escalated"));
  }

  async resolveException(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const body = request.body as any;
    const data = await exceptionsService.resolveException(request.params.id, {
      resolutionNotes: body.resolutionNotes || body.notes || "Resolved successfully by Plant Manager",
    });
    return reply.send(formatSuccess(data, "Exception marked as resolved"));
  }
}

export const exceptionsController = new ExceptionsController();
