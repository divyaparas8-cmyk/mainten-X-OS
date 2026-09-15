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
  fastify.put("/sanitation-classes/:id", { schema: { tags: ["Master Data"], summary: "Update Sanitation Class" } }, masterDataController.updateSanitationClass.bind(masterDataController));
  fastify.delete("/sanitation-classes/:id", { schema: { tags: ["Master Data"], summary: "Delete Sanitation Class" } }, masterDataController.deleteSanitationClass.bind(masterDataController));
  fastify.get("/allergen-rules", { schema: { tags: ["Master Data"], summary: "List Allergen Matrix Rules" } }, masterDataController.getAllergenRules.bind(masterDataController));
  fastify.post("/allergen-rules", { schema: { tags: ["Master Data"], summary: "Create Allergen Matrix Rule" } }, masterDataController.createAllergenRule.bind(masterDataController));
  fastify.put("/allergen-rules/:id", { schema: { tags: ["Master Data"], summary: "Update Allergen Matrix Rule" } }, masterDataController.updateAllergenRule.bind(masterDataController));
  fastify.delete("/allergen-rules/:id", { schema: { tags: ["Master Data"], summary: "Delete Allergen Matrix Rule" } }, masterDataController.deleteAllergenRule.bind(masterDataController));

  // 14. SKUs, BOMs, Assets, Staff, Specs
  fastify.get("/skus", { schema: { tags: ["Master Data"], summary: "List Products & SKUs" } }, masterDataController.getSkus.bind(masterDataController));
  fastify.post("/skus", { schema: { tags: ["Master Data"], summary: "Create new SKU" } }, masterDataController.createSku.bind(masterDataController));
  fastify.put("/skus/:id", { schema: { tags: ["Master Data"], summary: "Update SKU master record" } }, masterDataController.updateSku.bind(masterDataController));
  fastify.delete("/skus/:id", { schema: { tags: ["Master Data"], summary: "Delete SKU from master" } }, masterDataController.deleteSku.bind(masterDataController));

  fastify.get("/boms", { schema: { tags: ["Master Data"], summary: "List BOMs & Formulations" } }, masterDataController.getBoms.bind(masterDataController));
  fastify.post("/boms", { schema: { tags: ["Master Data"], summary: "Create new BOM Recipe Formula" } }, masterDataController.createBom.bind(masterDataController));
  fastify.put("/boms/:id", { schema: { tags: ["Master Data"], summary: "Update BOM Recipe Formula" } }, masterDataController.updateBom.bind(masterDataController));
  fastify.delete("/boms/:id", { schema: { tags: ["Master Data"], summary: "Delete BOM Recipe Formula" } }, masterDataController.deleteBom.bind(masterDataController));

  // 13. Assets, Categories & Machine Capability
  fastify.get("/asset-types", { schema: { tags: ["Master Data"], summary: "List Asset Categories / Types" } }, masterDataController.getAssetTypes.bind(masterDataController));
  fastify.post("/asset-types", { schema: { tags: ["Master Data"], summary: "Create Asset Category / Type" } }, masterDataController.createAssetType.bind(masterDataController));
  fastify.delete("/asset-types/:id", { schema: { tags: ["Master Data"], summary: "Delete Asset Category / Type" } }, masterDataController.deleteAssetType.bind(masterDataController));

  fastify.get("/criticality-levels", { schema: { tags: ["Master Data"], summary: "List Criticality Ratings" } }, masterDataController.getCriticalityLevels.bind(masterDataController));
  fastify.post("/criticality-levels", { schema: { tags: ["Master Data"], summary: "Create Criticality Rating" } }, masterDataController.createCriticalityLevel.bind(masterDataController));
  fastify.delete("/criticality-levels/:id", { schema: { tags: ["Master Data"], summary: "Delete Criticality Rating" } }, masterDataController.deleteCriticalityLevel.bind(masterDataController));

  fastify.get("/assets", { schema: { tags: ["Master Data"], summary: "List Equipment Assets" } }, masterDataController.getAssets.bind(masterDataController));
  fastify.post("/assets", { schema: { tags: ["Master Data"], summary: "Register New Equipment Asset" } }, masterDataController.createAsset.bind(masterDataController));
  fastify.put("/assets/:id", { schema: { tags: ["Master Data"], summary: "Update Equipment Asset Record" } }, masterDataController.updateAsset.bind(masterDataController));
  fastify.patch("/assets/:id", { schema: { tags: ["Master Data"], summary: "Partial Update Equipment Asset Record" } }, masterDataController.updateAsset.bind(masterDataController));
  fastify.delete("/assets/:id", { schema: { tags: ["Master Data"], summary: "Delete Equipment Asset" } }, masterDataController.deleteAsset.bind(masterDataController));
  fastify.get("/asset-details", { schema: { tags: ["Master Data"], summary: "Get Equipment Asset Details & Specifications" } }, masterDataController.getAssets.bind(masterDataController));

  fastify.get("/staff", { schema: { tags: ["Master Data"], summary: "List Operators & Shift Crew" } }, masterDataController.getStaff.bind(masterDataController));
  fastify.post("/staff", { schema: { tags: ["Master Data"], summary: "Register New Shift Supervisor / Staff Member" } }, masterDataController.createStaff.bind(masterDataController));
  fastify.put("/staff/:id", { schema: { tags: ["Master Data"], summary: "Update Staff Member Qualifications & Profile" } }, masterDataController.updateStaff.bind(masterDataController));
  fastify.delete("/staff/:id", { schema: { tags: ["Master Data"], summary: "Remove Staff Member" } }, masterDataController.deleteStaff.bind(masterDataController));

  // 14. Quality Specifications & Parameter Master
  fastify.get("/quality-specs", { schema: { tags: ["Master Data"], summary: "List QA & CCP Specifications" } }, masterDataController.getQualitySpecs.bind(masterDataController));
  fastify.post("/quality-specs", { schema: { tags: ["Master Data"], summary: "Create QA & CCP Specification" } }, masterDataController.createQualitySpec.bind(masterDataController));
  fastify.put("/quality-specs/:id", { schema: { tags: ["Master Data"], summary: "Update QA & CCP Specification" } }, masterDataController.updateQualitySpec.bind(masterDataController));
  fastify.delete("/quality-specs/:id", { schema: { tags: ["Master Data"], summary: "Delete QA & CCP Specification" } }, masterDataController.deleteQualitySpec.bind(masterDataController));

  // 18. HACCP CCP Limits
  fastify.get("/ccp-limits", { schema: { tags: ["Master Data"], summary: "List HACCP CCP Limits" } }, masterDataController.getCCPLimits.bind(masterDataController));
  fastify.post("/ccp-limits", { schema: { tags: ["Master Data"], summary: "Create HACCP CCP Limit" } }, masterDataController.createCCPLimit.bind(masterDataController));
  fastify.put("/ccp-limits/:id", { schema: { tags: ["Master Data"], summary: "Update HACCP CCP Limit" } }, masterDataController.updateCCPLimit.bind(masterDataController));
  fastify.delete("/ccp-limits/:id", { schema: { tags: ["Master Data"], summary: "Delete HACCP CCP Limit" } }, masterDataController.deleteCCPLimit.bind(masterDataController));

  // 19. Storage Resources & Warehouse Master
  fastify.get("/storage-resources", { schema: { tags: ["Master Data"], summary: "List Storage Resources" } }, masterDataController.getStorageResources.bind(masterDataController));
  fastify.post("/storage-resources", { schema: { tags: ["Master Data"], summary: "Create Storage Resource" } }, masterDataController.createStorageResource.bind(masterDataController));
  fastify.put("/storage-resources/:id", { schema: { tags: ["Master Data"], summary: "Update Storage Resource" } }, masterDataController.updateStorageResource.bind(masterDataController));
  fastify.delete("/storage-resources/:id", { schema: { tags: ["Master Data"], summary: "Delete Storage Resource" } }, masterDataController.deleteStorageResource.bind(masterDataController));

  // 15. Labour Standards
  fastify.get("/labour-standards", { schema: { tags: ["Master Data"], summary: "List Labour Standards" } }, masterDataController.getLabourStandards.bind(masterDataController));
  fastify.post("/labour-standards", { schema: { tags: ["Master Data"], summary: "Create Labour Standard" } }, masterDataController.createLabourStandard.bind(masterDataController));
  fastify.put("/labour-standards/:id", { schema: { tags: ["Master Data"], summary: "Update Labour Standard" } }, masterDataController.updateLabourStandard.bind(masterDataController));
  fastify.delete("/labour-standards/:id", { schema: { tags: ["Master Data"], summary: "Delete Labour Standard" } }, masterDataController.deleteLabourStandard.bind(masterDataController));

  // 17. Employee Skills & Qualifications Matrix
  fastify.get("/employee-skills", { schema: { tags: ["Master Data"], summary: "List Employee Skill Qualification Matrix" } }, masterDataController.getEmployeeSkills.bind(masterDataController));
  fastify.post("/employee-skills", { schema: { tags: ["Master Data"], summary: "Onboard Employee with Skill Competencies" } }, masterDataController.createEmployeeSkill.bind(masterDataController));
  fastify.put("/employee-skills/:id", { schema: { tags: ["Master Data"], summary: "Update Employee Skill Matrix" } }, masterDataController.updateEmployeeSkill.bind(masterDataController));
  fastify.delete("/employee-skills/:id", { schema: { tags: ["Master Data"], summary: "Delete Employee Skill Record" } }, masterDataController.deleteEmployeeSkill.bind(masterDataController));

  // Aliases for seamless API compatibility
  fastify.get("/employees", { schema: { tags: ["Master Data"], summary: "List Employees Matrix" } }, masterDataController.getEmployeeSkills.bind(masterDataController));
  fastify.post("/employees", { schema: { tags: ["Master Data"], summary: "Create Employee Record" } }, masterDataController.createEmployeeSkill.bind(masterDataController));
  fastify.put("/employees/:id", { schema: { tags: ["Master Data"], summary: "Update Employee Record" } }, masterDataController.updateEmployeeSkill.bind(masterDataController));
  fastify.delete("/employees/:id", { schema: { tags: ["Master Data"], summary: "Delete Employee Record" } }, masterDataController.deleteEmployeeSkill.bind(masterDataController));
}

