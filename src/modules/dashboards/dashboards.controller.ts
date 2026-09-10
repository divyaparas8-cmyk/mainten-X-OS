import { FastifyReply, FastifyRequest } from "fastify";
import { dashboardsService } from "./dashboards.service.js";
import { formatSuccess } from "../../shared/utils/responseFormatter.js";

export class DashboardsController {
  async getCommandCenter(request: FastifyRequest, reply: FastifyReply) {
    const data = await dashboardsService.getPlantManagerCommandCenter(request.user.tenantId, (request.query as any)?.plantId || request.user.plantId);
    return reply.send(formatSuccess(data));
  }

  async getKPIs(request: FastifyRequest, reply: FastifyReply) {
    const data = await dashboardsService.getExecutiveKPIs((request.query as any)?.plantId || request.user.plantId);
    return reply.send(formatSuccess(data));
  }
}

export const dashboardsController = new DashboardsController();
