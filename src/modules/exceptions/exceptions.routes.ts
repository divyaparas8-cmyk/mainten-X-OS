import { FastifyInstance } from "fastify";
import { exceptionsController } from "./exceptions.controller.js";
import { authenticate } from "../../middleware/authenticate.js";

export async function exceptionsRoutes(fastify: FastifyInstance) {
  fastify.addHook("preHandler", authenticate);

  fastify.get("", { schema: { tags: ["Exceptions & Alerts"], summary: "List Exceptions" } }, exceptionsController.getExceptions.bind(exceptionsController));
  fastify.post("", { schema: { tags: ["Exceptions & Alerts"], summary: "Create Exception" } }, exceptionsController.createException.bind(exceptionsController));
  fastify.get("/:id", { schema: { tags: ["Exceptions & Alerts"], summary: "Get Exception Details" } }, exceptionsController.getException.bind(exceptionsController));
  fastify.patch("/:id/assign", { schema: { tags: ["Exceptions & Alerts"], summary: "Assign and Escalate Exception" } }, exceptionsController.assignException.bind(exceptionsController));
  fastify.patch("/:id/resolve", { schema: { tags: ["Exceptions & Alerts"], summary: "Resolve Exception" } }, exceptionsController.resolveException.bind(exceptionsController));
}
