import { FastifyInstance } from "fastify";
import { dashboardsController } from "./dashboards.controller.js";
import { authenticate } from "../../middleware/authenticate.js";

export async function dashboardsRoutes(fastify: FastifyInstance) {
  fastify.addHook("preHandler", authenticate);

  fastify.get("/command-center", { schema: { tags: ["Dashboards & Executive"], summary: "Get Plant Manager Command Center Overview" } }, dashboardsController.getCommandCenter.bind(dashboardsController));
  fastify.get("/kpis", { schema: { tags: ["Dashboards & Executive"], summary: "Get Executive KPI Scorecard" } }, dashboardsController.getKPIs.bind(dashboardsController));
}
