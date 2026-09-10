import { FastifyInstance } from "fastify";
import { productionController } from "./production.controller.js";
import { authenticate } from "../../middleware/authenticate.js";

export async function productionRoutes(fastify: FastifyInstance) {
  fastify.addHook("preHandler", authenticate);

  // Orders
  fastify.get("/orders", { schema: { tags: ["Production & MES"], summary: "List Production Orders" } }, productionController.getOrders.bind(productionController));
  fastify.post("/orders", { schema: { tags: ["Production & MES"], summary: "Create Production Order" } }, productionController.createOrder.bind(productionController));
  fastify.patch("/orders/:id/status", { schema: { tags: ["Production & MES"], summary: "Advance Production Order Status" } }, productionController.updateOrderStatus.bind(productionController));

  // Batches / eBR
  fastify.get("/batches", { schema: { tags: ["Production & MES"], summary: "List 6-Step eBR Batches" } }, productionController.getBatches.bind(productionController));
  fastify.post("/batches/:id/steps", { schema: { tags: ["Production & MES"], summary: "Complete eBR Batch Step" } }, productionController.advanceBatchStep.bind(productionController));
  fastify.post("/batches/:id/verify-lot", { schema: { tags: ["Production & MES"], summary: "Verify Lot Barcode" } }, productionController.verifyLot.bind(productionController));
  fastify.patch("/batches/:id/complete", { schema: { tags: ["Production & MES"], summary: "Complete eBR Batch" } }, productionController.completeBatch.bind(productionController));
  fastify.post("/batches/:id/qa-release", { schema: { tags: ["Production & MES"], summary: "Release Batch to QA" } }, productionController.qaReleaseBatch.bind(productionController));

  // HMI & Downtime
  fastify.post("/hmi/entry", { schema: { tags: ["Production & MES"], summary: "Record Operator HMI Good/Scrap Units" } }, productionController.recordOperatorEntry.bind(productionController));
  fastify.get("/downtime", { schema: { tags: ["Production & MES"], summary: "List Downtime Events" } }, productionController.getDowntime.bind(productionController));
  fastify.post("/downtime", { schema: { tags: ["Production & MES"], summary: "Log Downtime / Stoppage Event" } }, productionController.logDowntime.bind(productionController));

  // Plant Manager Extended Endpoints
  fastify.get("/hb-logs", { schema: { tags: ["Production & MES"], summary: "List Pitch Hour Logs" } }, productionController.getHbLogs.bind(productionController));
  fastify.post("/hb-logs", { schema: { tags: ["Production & MES"], summary: "Create Pitch Hour Log" } }, productionController.createHbLog.bind(productionController));
  fastify.get("/oee", { schema: { tags: ["Production & MES"], summary: "Get Plant & Line OEE Breakdown" } }, productionController.getOEE.bind(productionController));
  fastify.get("/performance", { schema: { tags: ["Production & MES"], summary: "Get SMED & Micro-Stops Performance" } }, productionController.getPerformance.bind(productionController));
  fastify.get("/machines", { schema: { tags: ["Production & MES"], summary: "List Floor Machines Telemetry" } }, productionController.getMachines.bind(productionController));
  fastify.patch("/machines/:id/status", { schema: { tags: ["Production & MES"], summary: "Toggle Machine Status" } }, productionController.updateMachineStatus.bind(productionController));
  fastify.get("/shift-handoffs", { schema: { tags: ["Production & MES"], summary: "List Shift Handoff Logs" } }, productionController.getShiftHandoffs.bind(productionController));
  fastify.post("/shift-handoffs", { schema: { tags: ["Production & MES"], summary: "Create Shift Handoff Log" } }, productionController.createShiftHandoff.bind(productionController));
  fastify.get("/shift-performance", { schema: { tags: ["Production & MES"], summary: "Get Multi-Shift Output Performance" } }, productionController.getShiftPerformance.bind(productionController));
}
