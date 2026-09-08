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

  // 6. Standard Operations
  fastify.get("/operations", { schema: { tags: ["Master Data"], summary: "List Standard Operations Catalogue" } }, masterDataController.getOperations.bind(masterDataController));
  fastify.post("/operations", { schema: { tags: ["Master Data"], summary: "Register New Standard Operation" } }, masterDataController.createOperation.bind(masterDataController));
  fastify.put("/operations/:id", { schema: { tags: ["Master Data"], summary: "Update Standard Operation" } }, masterDataController.updateOperation.bind(masterDataController));
  fastify.delete("/operations/:id", { schema: { tags: ["Master Data"], summary: "Delete Standard Operation" } }, masterDataController.deleteOperation.bind(masterDataController));

  // 7. Routings Master
  fastify.get("/routings", { schema: { tags: ["Master Data"], summary: "List Production Routings" } }, masterDataController.getRoutings.bind(masterDataController));
  fastify.get("/routings/:id", { schema: { tags: ["Master Data"], summary: "Get Routing by ID with Steps" } }, masterDataController.getRoutingById.bind(masterDataController));
  fastify.post("/routings", { schema: { tags: ["Master Data"], summary: "Register New Routing Master" } }, masterDataController.createRouting.bind(masterDataController));
  fastify.put("/routings/:id", { schema: { tags: ["Master Data"], summary: "Update Routing Master" } }, masterDataController.updateRouting.bind(masterDataController));
  fastify.patch("/routings/:id/status", { schema: { tags: ["Master Data"], summary: "Update Routing Approval/Active Status" } }, masterDataController.updateRoutingStatus.bind(masterDataController));
  fastify.delete("/routings/:id", { schema: { tags: ["Master Data"], summary: "Delete Routing Master" } }, masterDataController.deleteRouting.bind(masterDataController));


  // 8. Product Families
  fastify.get("/product-families", { schema: { tags: ["Master Data"], summary: "List Product Families" } }, masterDataController.getProductFamilies.bind(masterDataController));
  fastify.post("/product-families", { schema: { tags: ["Master Data"], summary: "Create Product Family" } }, masterDataController.createProductFamily.bind(masterDataController));
  fastify.put("/product-families/:id", { schema: { tags: ["Master Data"], summary: "Update Product Family" } }, masterDataController.updateProductFamily.bind(masterDataController));
  fastify.delete("/product-families/:id", { schema: { tags: ["Master Data"], summary: "Delete Product Family" } }, masterDataController.deleteProductFamily.bind(masterDataController));

  // 9. Units of Measure (UOM)
  fastify.get("/uoms", { schema: { tags: ["Master Data"], summary: "List Units of Measure" } }, masterDataController.getUoms.bind(masterDataController));
  fastify.post("/uoms", { schema: { tags: ["Master Data"], summary: "Register New Unit of Measure" } }, masterDataController.createUom.bind(masterDataController));
  fastify.put("/uoms/:id", { schema: { tags: ["Master Data"], summary: "Update Unit of Measure" } }, masterDataController.updateUom.bind(masterDataController));
  fastify.delete("/uoms/:id", { schema: { tags: ["Master Data"], summary: "Delete Unit of Measure" } }, masterDataController.deleteUom.bind(masterDataController));

  // 10. Packaging & Pack Configurations
  fastify.get("/pack-configs", { schema: { tags: ["Master Data"], summary: "List Packaging Configurations" } }, masterDataController.getPackConfigs.bind(masterDataController));
  fastify.post("/pack-configs", { schema: { tags: ["Master Data"], summary: "Create Packaging Configuration" } }, masterDataController.createPackConfig.bind(masterDataController));
  fastify.put("/pack-configs/:id", { schema: { tags: ["Master Data"], summary: "Update Packaging Configuration" } }, masterDataController.updatePackConfig.bind(masterDataController));
  fastify.delete("/pack-configs/:id", { schema: { tags: ["Master Data"], summary: "Delete Packaging Configuration" } }, masterDataController.deletePackConfig.bind(masterDataController));

  // 11. Line Targets
  fastify.get("/line-targets", { schema: { tags: ["Master Data"], summary: "List Line Production Targets" } }, masterDataController.getLineTargets.bind(masterDataController));
  fastify.post("/line-targets", { schema: { tags: ["Master Data"], summary: "Create Line Production Target" } }, masterDataController.createLineTarget.bind(masterDataController));
  fastify.put("/line-targets/:id", { schema: { tags: ["Master Data"], summary: "Update Line Production Target" } }, masterDataController.updateLineTarget.bind(masterDataController));
  fastify.delete("/line-targets/:id", { schema: { tags: ["Master Data"], summary: "Delete Line Production Target" } }, masterDataController.deleteLineTarget.bind(masterDataController));

  // 12. Changeover Matrix
  fastify.get("/changeover-matrix", { schema: { tags: ["Master Data"], summary: "List Changeover Matrix Rules" } }, masterDataController.getChangeoverRules.bind(masterDataController));
  fastify.post("/changeover-matrix", { schema: { tags: ["Master Data"], summary: "Create Changeover Matrix Rule" } }, masterDataController.createChangeoverRule.bind(masterDataController));
  fastify.put("/changeover-matrix/:id", { schema: { tags: ["Master Data"], summary: "Update Changeover Matrix Rule" } }, masterDataController.updateChangeoverRule.bind(masterDataController));
  fastify.delete("/changeover-matrix/:id", { schema: { tags: ["Master Data"], summary: "Delete Changeover Matrix Rule" } }, masterDataController.deleteChangeoverRule.bind(masterDataController));

  // 13. Sanitation & Allergens
  fastify.get("/sanitation-classes", { schema: { tags: ["Master Data"], summary: "List Sanitation Classes" } }, masterDataController.getSanitationClasses.bind(masterDataController));
  fastify.post("/sanitation-classes", { schema: { tags: ["Master Data"], summary: "Create Sanitation Class" } }, masterDataController.createSanitationClass.bind(masterDataController));
  fastify.get("/allergen-rules", { schema: { tags: ["Master Data"], summary: "List Allergen Matrix Rules" } }, masterDataController.getAllergenRules.bind(masterDataController));
  fastify.post("/allergen-rules", { schema: { tags: ["Master Data"], summary: "Create Allergen Matrix Rule" } }, masterDataController.createAllergenRule.bind(masterDataController));

  // 14. SKUs, BOMs, Assets, Staff, Specs
  fastify.get("/skus", { schema: { tags: ["Master Data"], summary: "List Products & SKUs" } }, masterDataController.getSkus.bind(masterDataController));
  fastify.post("/skus", { schema: { tags: ["Master Data"], summary: "Create new SKU" } }, masterDataController.createSku.bind(masterDataController));
  fastify.get("/boms", { schema: { tags: ["Master Data"], summary: "List BOMs & Formulations" } }, masterDataController.getBoms.bind(masterDataController));
  fastify.get("/assets", { schema: { tags: ["Master Data"], summary: "List Equipment Assets" } }, masterDataController.getAssets.bind(masterDataController));
  fastify.get("/staff", { schema: { tags: ["Master Data"], summary: "List Operators & Shift Crew" } }, masterDataController.getStaff.bind(masterDataController));
  fastify.get("/quality-specs", { schema: { tags: ["Master Data"], summary: "List QA & CCP Specifications" } }, masterDataController.getQualitySpecs.bind(masterDataController));
}

