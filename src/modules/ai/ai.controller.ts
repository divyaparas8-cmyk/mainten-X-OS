import { FastifyReply, FastifyRequest } from "fastify";
import { aiService } from "./ai.service.js";
import { formatSuccess } from "../../shared/utils/responseFormatter.js";

export class AIController {
  async getInsights(request: FastifyRequest, reply: FastifyReply) {
    const data = await aiService.listInsights();
    return reply.send(formatSuccess(data));
  }

  async approveInsight(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const data = await aiService.approveInsight(request.params.id);
    return reply.send(formatSuccess(data, "AI recommendation approved"));
  }

  async rejectInsight(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const data = await aiService.rejectInsight(request.params.id);
    return reply.send(formatSuccess(data, "AI recommendation rejected"));
  }

  async chat(request: FastifyRequest, reply: FastifyReply) {
    const { query } = request.body as any;
    const data = await aiService.chatQuery(query || "");
    return reply.send(formatSuccess(data));
  }
}

export const aiController = new AIController();
