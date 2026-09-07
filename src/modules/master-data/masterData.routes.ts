import { FastifyInstance } from "fastify";
import { masterDataController } from "./masterData.controller.js";
import { authenticate } from "../../middleware/authenticate.js";

export async function masterDataRoutes(fastify: FastifyInstance) {
  fastify.addHook("preHandler", authenticate);

  // 1. Companies & Legal Entities
  fastify.get("/companies", { schema: { tags: ["Master Data"], summary: "List Enterprise Companies & Legal Entities" } }, masterDataController.getCompanies.bind(masterDataController));
  fastify.post("/companies", { schema: { tags: ["Master Data"], summary: "Register New Legal Corporate Entity" } }, masterDataController.createCompany.bind(masterDataController));
  fastify.put("/companies/:id", { schema: { tags: ["Master Data"], summary: "Update Corporate Legal Entity" } }, masterDataController.updateCompany.bind(masterDataController));
  fastify.delete("/companies/:id", { schema: { tags: ["Master Data"], summary: "Remove Corporate Legal Entity" } }, masterDataController.deleteCompany.bind(masterDataController));

  // 2. Plants & Sites
  fastify.get("/plants", { schema: { tags: ["Master Data"], summary: "List Enterprise Manufacturing Plants" } }, masterDataController.getPlants.bind(masterDataController));
  fastify.post("/plants", { schema: { tags: ["Master Data"], summary: "Provision New Manufacturing Plant Site" } }, masterDataController.createPlant.bind(masterDataController));
  fastify.put("/plants/:id", { schema: { tags: ["Master Data"], summary: "Update Plant Site Configuration" } }, masterDataController.updatePlant.bind(masterDataController));
  fastify.delete("/plants/:id", { schema: { tags: ["Master Data"], summary: "Decommission / Delete Plant Site" } }, masterDataController.deletePlant.bind(masterDataController));

  // 3. Departments
  fastify.get("/departments", { schema: { tags: ["Master Data"], summary: "List Department Hierarchy & Cost Centers" } }, masterDataController.getDepartments.bind(masterDataController));
  fastify.post("/departments", { schema: { tags: ["Master Data"], summary: "Register New Department" } }, masterDataController.createDepartment.bind(masterDataController));
  fastify.put("/departments/:id", { schema: { tags: ["Master Data"], summary: "Update Department Hierarchy Info" } }, masterDataController.updateDepartment.bind(masterDataController));
  fastify.delete("/departments/:id", { schema: { tags: ["Master Data"], summary: "Remove Department" } }, masterDataController.deleteDepartment.bind(masterDataController));

  // 4. Production Lines
  fastify.get("/lines", { schema: { tags: ["Master Data"], summary: "List Manufacturing Production Lines" } }, masterDataController.getLines.bind(masterDataController));
  fastify.post("/lines", { schema: { tags: ["Master Data"], summary: "Register New Production Line Cell" } }, masterDataController.createLine.bind(masterDataController));
  fastify.put("/lines/:id", { schema: { tags: ["Master Data"], summary: "Update Production Line Configuration" } }, masterDataController.updateLine.bind(masterDataController));
  fastify.delete("/lines/:id", { schema: { tags: ["Master Data"], summary: "Remove Production Line" } }, masterDataController.deleteLine.bind(masterDataController));

  // 5. Work Centers & Machine Cells
  fastify.get("/work-centers", { schema: { tags: ["Master Data"], summary: "List Work Centers & Machine Cells" } }, masterDataController.getWorkCenters.bind(masterDataController));
  fastify.post("/work-centers", { schema: { tags: ["Master Data"], summary: "Create Work Center Cell" } }, masterDataController.createWorkCenter.bind(masterDataController));
  fastify.put("/work-centers/:id", { schema: { tags: ["Master Data"], summary: "Update Work Center Cell" } }, masterDataController.updateWorkCenter.bind(masterDataController));
  fastify.delete("/work-centers/:id", { schema: { tags: ["Master Data"], summary: "Delete Work Center Cell" } }, masterDataController.deleteWorkCenter.bind(masterDataController));

  // 6. SKUs, BOMs, Assets, Staff, Specs
  fastify.get("/skus", { schema: { tags: ["Master Data"], summary: "List Products & SKUs" } }, masterDataController.getSkus.bind(masterDataController));
  fastify.post("/skus", { schema: { tags: ["Master Data"], summary: "Create new SKU" } }, masterDataController.createSku.bind(masterDataController));
  fastify.get("/boms", { schema: { tags: ["Master Data"], summary: "List BOMs & Formulations" } }, masterDataController.getBoms.bind(masterDataController));
  fastify.get("/assets", { schema: { tags: ["Master Data"], summary: "List Equipment Assets" } }, masterDataController.getAssets.bind(masterDataController));
  fastify.get("/staff", { schema: { tags: ["Master Data"], summary: "List Operators & Shift Crew" } }, masterDataController.getStaff.bind(masterDataController));
  fastify.get("/quality-specs", { schema: { tags: ["Master Data"], summary: "List QA & CCP Specifications" } }, masterDataController.getQualitySpecs.bind(masterDataController));
}

