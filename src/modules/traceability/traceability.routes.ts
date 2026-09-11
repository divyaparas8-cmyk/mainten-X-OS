import { FastifyInstance } from "fastify";
import { traceabilityController } from "./traceability.controller.js";
import { authenticate } from "../../middleware/authenticate.js";

export async function traceabilityRoutes(fastify: FastifyInstance) {
  fastify.addHook("preHandler", authenticate);

  fastify.get("/genealogy/:lotNumber", { schema: { tags: ["360° Traceability"], summary: "Get 360° Forward/Backward Lot Genealogy Graph" } }, traceabilityController.getGenealogy.bind(traceabilityController));
  fastify.post("/recall/simulate", { schema: { tags: ["360° Traceability"], summary: "Execute Digital Recall Simulation" } }, traceabilityController.runRecallSimulation.bind(traceabilityController));
}
