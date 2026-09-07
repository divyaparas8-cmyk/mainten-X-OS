import { FastifyInstance } from "fastify";
import { masterDataController } from "./masterData.controller.js";
import { authenticate } from "../../middleware/authenticate.js";

export async function masterDataRoutes(fastify: FastifyInstance) {
  fastify.addHook("preHandler", authenticate);

  fastify.get("/skus", { schema: { tags: ["Master Data"], summary: "List Products & SKUs" } }, masterDataController.getSkus.bind(masterDataController));
  fastify.post("/skus", { schema: { tags: ["Master Data"], summary: "Create new SKU" } }, masterDataController.createSku.bind(masterDataController));
  fastify.get("/boms", { schema: { tags: ["Master Data"], summary: "List BOMs & Formulations" } }, masterDataController.getBoms.bind(masterDataController));
  fastify.get("/lines", { schema: { tags: ["Master Data"], summary: "List Production Lines" } }, masterDataController.getLines.bind(masterDataController));
  fastify.get("/work-centers", { schema: { tags: ["Master Data"], summary: "List Work Centers" } }, masterDataController.getWorkCenters.bind(masterDataController));
  fastify.get("/assets", { schema: { tags: ["Master Data"], summary: "List Equipment Assets" } }, masterDataController.getAssets.bind(masterDataController));
  fastify.get("/staff", { schema: { tags: ["Master Data"], summary: "List Operators & Shift Crew" } }, masterDataController.getStaff.bind(masterDataController));
  fastify.get("/quality-specs", { schema: { tags: ["Master Data"], summary: "List QA & CCP Specifications" } }, masterDataController.getQualitySpecs.bind(masterDataController));
}
