import { FastifyInstance } from "fastify";
import { aiController } from "./ai.controller.js";
import { authenticate } from "../../middleware/authenticate.js";

export async function aiRoutes(fastify: FastifyInstance) {
  fastify.addHook("preHandler", authenticate);

  fastify.get("/insights", { schema: { tags: ["AI & Operations Intelligence"], summary: "List AI Insights" } }, aiController.getInsights.bind(aiController));
  fastify.post("/insights/:id/approve", { schema: { tags: ["AI & Operations Intelligence"], summary: "Approve AI Recommendation" } }, aiController.approveInsight.bind(aiController));
  fastify.post("/insights/:id/reject", { schema: { tags: ["AI & Operations Intelligence"], summary: "Reject AI Recommendation" } }, aiController.rejectInsight.bind(aiController));
  fastify.post("/chat", { schema: { tags: ["AI & Operations Intelligence"], summary: "AI Operational Assistant Query" } }, aiController.chat.bind(aiController));
}
