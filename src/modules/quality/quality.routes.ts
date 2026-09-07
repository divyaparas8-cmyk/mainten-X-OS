import { FastifyInstance } from "fastify";
import { qualityController } from "./quality.controller.js";
import { authenticate } from "../../middleware/authenticate.js";

export async function qualityRoutes(fastify: FastifyInstance) {
  fastify.addHook("preHandler", authenticate);

  fastify.get("/ccp", { schema: { tags: ["Quality & QMS"], summary: "List Critical Control Point Checks" } }, qualityController.getCcpChecks.bind(qualityController));
  fastify.post("/ccp", { schema: { tags: ["Quality & QMS"], summary: "Record In-Process CCP Check (Auto PASS/FAIL)" } }, qualityController.recordCcpCheck.bind(qualityController));

  fastify.get("/release/queue", { schema: { tags: ["Quality & QMS"], summary: "List Batches Pending QA Release" } }, qualityController.getQaReleaseQueue.bind(qualityController));
  fastify.post("/release/authorize", { schema: { tags: ["Quality & QMS"], summary: "21 CFR Part 11 QA Digital Batch Release Authorization" } }, qualityController.authorizeBatchRelease.bind(qualityController));

  fastify.get("/holds", { schema: { tags: ["Quality & QMS"], summary: "List Quarantined / Lot Holds" } }, qualityController.getQualityHolds.bind(qualityController));
  fastify.post("/holds", { schema: { tags: ["Quality & QMS"], summary: "Place Lot on Quality Quarantine Hold" } }, qualityController.createQualityHold.bind(qualityController));
}
