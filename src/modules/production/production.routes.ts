import { FastifyInstance } from "fastify";
import { productionController } from "./production.controller.js";
import { authenticate } from "../../middleware/authenticate.js";

export async function productionRoutes(fastify: FastifyInstance) {
  fastify.addHook("preHandler", authenticate);

  fastify.get("/orders", { schema: { tags: ["Production & MES"], summary: "List Production Orders" } }, productionController.getOrders.bind(productionController));
  fastify.post("/orders", { schema: { tags: ["Production & MES"], summary: "Create Production Order" } }, productionController.createOrder.bind(productionController));
  fastify.patch("/orders/:id/status", { schema: { tags: ["Production & MES"], summary: "Advance Production Order Status" } }, productionController.updateOrderStatus.bind(productionController));

  fastify.get("/batches", { schema: { tags: ["Production & MES"], summary: "List 6-Step eBR Batches" } }, productionController.getBatches.bind(productionController));
  fastify.post("/batches/:id/steps", { schema: { tags: ["Production & MES"], summary: "Complete eBR Batch Step" } }, productionController.advanceBatchStep.bind(productionController));

  fastify.post("/hmi/entry", { schema: { tags: ["Production & MES"], summary: "Record Operator HMI Good/Scrap Units" } }, productionController.recordOperatorEntry.bind(productionController));
  fastify.post("/downtime", { schema: { tags: ["Production & MES"], summary: "Log Downtime / Stoppage Event" } }, productionController.logDowntime.bind(productionController));
}
