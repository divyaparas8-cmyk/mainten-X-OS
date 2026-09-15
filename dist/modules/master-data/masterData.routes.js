"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.masterDataRoutes = masterDataRoutes;
const masterData_controller_js_1 = require("./masterData.controller.js");
const authenticate_js_1 = require("../../middleware/authenticate.js");
async function masterDataRoutes(fastify) {
    fastify.addHook("preHandler", authenticate_js_1.authenticate);
    // 1. Companies & Legal Entities
    fastify.get("/companies", { schema: { tags: ["Master Data"], summary: "List Enterprise Companies & Legal Entities" } }, masterData_controller_js_1.masterDataController.getCompanies.bind(masterData_controller_js_1.masterDataController));
    fastify.post("/companies", { schema: { tags: ["Master Data"], summary: "Register New Legal Corporate Entity" } }, masterData_controller_js_1.masterDataController.createCompany.bind(masterData_controller_js_1.masterDataController));
    fastify.put("/companies/:id", { schema: { tags: ["Master Data"], summary: "Update Corporate Legal Entity" } }, masterData_controller_js_1.masterDataController.updateCompany.bind(masterData_controller_js_1.masterDataController));
    fastify.delete("/companies/:id", { schema: { tags: ["Master Data"], summary: "Remove Corporate Legal Entity" } }, masterData_controller_js_1.masterDataController.deleteCompany.bind(masterData_controller_js_1.masterDataController));
    // 2. Plants & Sites
    fastify.get("/plants", { schema: { tags: ["Master Data"], summary: "List Enterprise Manufacturing Plants" } }, masterData_controller_js_1.masterDataController.getPlants.bind(masterData_controller_js_1.masterDataController));
    fastify.post("/plants", { schema: { tags: ["Master Data"], summary: "Provision New Manufacturing Plant Site" } }, masterData_controller_js_1.masterDataController.createPlant.bind(masterData_controller_js_1.masterDataController));
    fastify.put("/plants/:id", { schema: { tags: ["Master Data"], summary: "Update Plant Site Configuration" } }, masterData_controller_js_1.masterDataController.updatePlant.bind(masterData_controller_js_1.masterDataController));
    fastify.delete("/plants/:id", { schema: { tags: ["Master Data"], summary: "Decommission / Delete Plant Site" } }, masterData_controller_js_1.masterDataController.deletePlant.bind(masterData_controller_js_1.masterDataController));
    // 3. Departments
    fastify.get("/departments", { schema: { tags: ["Master Data"], summary: "List Department Hierarchy & Cost Centers" } }, masterData_controller_js_1.masterDataController.getDepartments.bind(masterData_controller_js_1.masterDataController));
    fastify.post("/departments", { schema: { tags: ["Master Data"], summary: "Register New Department" } }, masterData_controller_js_1.masterDataController.createDepartment.bind(masterData_controller_js_1.masterDataController));
    fastify.put("/departments/:id", { schema: { tags: ["Master Data"], summary: "Update Department Hierarchy Info" } }, masterData_controller_js_1.masterDataController.updateDepartment.bind(masterData_controller_js_1.masterDataController));
    fastify.delete("/departments/:id", { schema: { tags: ["Master Data"], summary: "Remove Department" } }, masterData_controller_js_1.masterDataController.deleteDepartment.bind(masterData_controller_js_1.masterDataController));
    // 4. Production Lines
    fastify.get("/lines", { schema: { tags: ["Master Data"], summary: "List Manufacturing Production Lines" } }, masterData_controller_js_1.masterDataController.getLines.bind(masterData_controller_js_1.masterDataController));
    fastify.post("/lines", { schema: { tags: ["Master Data"], summary: "Register New Production Line Cell" } }, masterData_controller_js_1.masterDataController.createLine.bind(masterData_controller_js_1.masterDataController));
    fastify.put("/lines/:id", { schema: { tags: ["Master Data"], summary: "Update Production Line Configuration" } }, masterData_controller_js_1.masterDataController.updateLine.bind(masterData_controller_js_1.masterDataController));
    fastify.delete("/lines/:id", { schema: { tags: ["Master Data"], summary: "Remove Production Line" } }, masterData_controller_js_1.masterDataController.deleteLine.bind(masterData_controller_js_1.masterDataController));
    // 5. Work Centers & Machine Cells
    fastify.get("/work-centers", { schema: { tags: ["Master Data"], summary: "List Work Centers & Machine Cells" } }, masterData_controller_js_1.masterDataController.getWorkCenters.bind(masterData_controller_js_1.masterDataController));
    fastify.post("/work-centers", { schema: { tags: ["Master Data"], summary: "Create Work Center Cell" } }, masterData_controller_js_1.masterDataController.createWorkCenter.bind(masterData_controller_js_1.masterDataController));
    fastify.put("/work-centers/:id", { schema: { tags: ["Master Data"], summary: "Update Work Center Cell" } }, masterData_controller_js_1.masterDataController.updateWorkCenter.bind(masterData_controller_js_1.masterDataController));
    fastify.delete("/work-centers/:id", { schema: { tags: ["Master Data"], summary: "Delete Work Center Cell" } }, masterData_controller_js_1.masterDataController.deleteWorkCenter.bind(masterData_controller_js_1.masterDataController));
    // 6. Standard Operations
    fastify.get("/operations", { schema: { tags: ["Master Data"], summary: "List Standard Operations Catalogue" } }, masterData_controller_js_1.masterDataController.getOperations.bind(masterData_controller_js_1.masterDataController));
    fastify.post("/operations", { schema: { tags: ["Master Data"], summary: "Register New Standard Operation" } }, masterData_controller_js_1.masterDataController.createOperation.bind(masterData_controller_js_1.masterDataController));
    fastify.put("/operations/:id", { schema: { tags: ["Master Data"], summary: "Update Standard Operation" } }, masterData_controller_js_1.masterDataController.updateOperation.bind(masterData_controller_js_1.masterDataController));
    fastify.delete("/operations/:id", { schema: { tags: ["Master Data"], summary: "Delete Standard Operation" } }, masterData_controller_js_1.masterDataController.deleteOperation.bind(masterData_controller_js_1.masterDataController));
    // 7. Routings Master
    fastify.get("/routings", { schema: { tags: ["Master Data"], summary: "List Production Routings" } }, masterData_controller_js_1.masterDataController.getRoutings.bind(masterData_controller_js_1.masterDataController));
    fastify.get("/routings/:id", { schema: { tags: ["Master Data"], summary: "Get Routing by ID with Steps" } }, masterData_controller_js_1.masterDataController.getRoutingById.bind(masterData_controller_js_1.masterDataController));
    fastify.post("/routings", { schema: { tags: ["Master Data"], summary: "Register New Routing Master" } }, masterData_controller_js_1.masterDataController.createRouting.bind(masterData_controller_js_1.masterDataController));
    fastify.put("/routings/:id", { schema: { tags: ["Master Data"], summary: "Update Routing Master" } }, masterData_controller_js_1.masterDataController.updateRouting.bind(masterData_controller_js_1.masterDataController));
    fastify.patch("/routings/:id/status", { schema: { tags: ["Master Data"], summary: "Update Routing Approval/Active Status" } }, masterData_controller_js_1.masterDataController.updateRoutingStatus.bind(masterData_controller_js_1.masterDataController));
    fastify.delete("/routings/:id", { schema: { tags: ["Master Data"], summary: "Delete Routing Master" } }, masterData_controller_js_1.masterDataController.deleteRouting.bind(masterData_controller_js_1.masterDataController));
    // 8. Product Families
    fastify.get("/product-families", { schema: { tags: ["Master Data"], summary: "List Product Families" } }, masterData_controller_js_1.masterDataController.getProductFamilies.bind(masterData_controller_js_1.masterDataController));
    fastify.post("/product-families", { schema: { tags: ["Master Data"], summary: "Create Product Family" } }, masterData_controller_js_1.masterDataController.createProductFamily.bind(masterData_controller_js_1.masterDataController));
    fastify.put("/product-families/:id", { schema: { tags: ["Master Data"], summary: "Update Product Family" } }, masterData_controller_js_1.masterDataController.updateProductFamily.bind(masterData_controller_js_1.masterDataController));
    fastify.delete("/product-families/:id", { schema: { tags: ["Master Data"], summary: "Delete Product Family" } }, masterData_controller_js_1.masterDataController.deleteProductFamily.bind(masterData_controller_js_1.masterDataController));
    // 9. Units of Measure (UOM)
    fastify.get("/uoms", { schema: { tags: ["Master Data"], summary: "List Units of Measure" } }, masterData_controller_js_1.masterDataController.getUoms.bind(masterData_controller_js_1.masterDataController));
    fastify.post("/uoms", { schema: { tags: ["Master Data"], summary: "Register New Unit of Measure" } }, masterData_controller_js_1.masterDataController.createUom.bind(masterData_controller_js_1.masterDataController));
    fastify.put("/uoms/:id", { schema: { tags: ["Master Data"], summary: "Update Unit of Measure" } }, masterData_controller_js_1.masterDataController.updateUom.bind(masterData_controller_js_1.masterDataController));
    fastify.delete("/uoms/:id", { schema: { tags: ["Master Data"], summary: "Delete Unit of Measure" } }, masterData_controller_js_1.masterDataController.deleteUom.bind(masterData_controller_js_1.masterDataController));
    // 10. Packaging & Pack Configurations
    fastify.get("/pack-configs", { schema: { tags: ["Master Data"], summary: "List Packaging Configurations" } }, masterData_controller_js_1.masterDataController.getPackConfigs.bind(masterData_controller_js_1.masterDataController));
    fastify.post("/pack-configs", { schema: { tags: ["Master Data"], summary: "Create Packaging Configuration" } }, masterData_controller_js_1.masterDataController.createPackConfig.bind(masterData_controller_js_1.masterDataController));
    fastify.put("/pack-configs/:id", { schema: { tags: ["Master Data"], summary: "Update Packaging Configuration" } }, masterData_controller_js_1.masterDataController.updatePackConfig.bind(masterData_controller_js_1.masterDataController));
    fastify.delete("/pack-configs/:id", { schema: { tags: ["Master Data"], summary: "Delete Packaging Configuration" } }, masterData_controller_js_1.masterDataController.deletePackConfig.bind(masterData_controller_js_1.masterDataController));
    // 11. Line Targets
    fastify.get("/line-targets", { schema: { tags: ["Master Data"], summary: "List Line Production Targets" } }, masterData_controller_js_1.masterDataController.getLineTargets.bind(masterData_controller_js_1.masterDataController));
    fastify.post("/line-targets", { schema: { tags: ["Master Data"], summary: "Create Line Production Target" } }, masterData_controller_js_1.masterDataController.createLineTarget.bind(masterData_controller_js_1.masterDataController));
    fastify.put("/line-targets/:id", { schema: { tags: ["Master Data"], summary: "Update Line Production Target" } }, masterData_controller_js_1.masterDataController.updateLineTarget.bind(masterData_controller_js_1.masterDataController));
    fastify.delete("/line-targets/:id", { schema: { tags: ["Master Data"], summary: "Delete Line Production Target" } }, masterData_controller_js_1.masterDataController.deleteLineTarget.bind(masterData_controller_js_1.masterDataController));
    // 12. Changeover Matrix
    fastify.get("/changeover-matrix", { schema: { tags: ["Master Data"], summary: "List Changeover Matrix Rules" } }, masterData_controller_js_1.masterDataController.getChangeoverRules.bind(masterData_controller_js_1.masterDataController));
    fastify.post("/changeover-matrix", { schema: { tags: ["Master Data"], summary: "Create Changeover Matrix Rule" } }, masterData_controller_js_1.masterDataController.createChangeoverRule.bind(masterData_controller_js_1.masterDataController));
    fastify.put("/changeover-matrix/:id", { schema: { tags: ["Master Data"], summary: "Update Changeover Matrix Rule" } }, masterData_controller_js_1.masterDataController.updateChangeoverRule.bind(masterData_controller_js_1.masterDataController));
    fastify.delete("/changeover-matrix/:id", { schema: { tags: ["Master Data"], summary: "Delete Changeover Matrix Rule" } }, masterData_controller_js_1.masterDataController.deleteChangeoverRule.bind(masterData_controller_js_1.masterDataController));
    // 13. Sanitation & Allergens
    fastify.get("/sanitation-classes", { schema: { tags: ["Master Data"], summary: "List Sanitation Classes" } }, masterData_controller_js_1.masterDataController.getSanitationClasses.bind(masterData_controller_js_1.masterDataController));
    fastify.post("/sanitation-classes", { schema: { tags: ["Master Data"], summary: "Create Sanitation Class" } }, masterData_controller_js_1.masterDataController.createSanitationClass.bind(masterData_controller_js_1.masterDataController));
    fastify.put("/sanitation-classes/:id", { schema: { tags: ["Master Data"], summary: "Update Sanitation Class" } }, masterData_controller_js_1.masterDataController.updateSanitationClass.bind(masterData_controller_js_1.masterDataController));
    fastify.delete("/sanitation-classes/:id", { schema: { tags: ["Master Data"], summary: "Delete Sanitation Class" } }, masterData_controller_js_1.masterDataController.deleteSanitationClass.bind(masterData_controller_js_1.masterDataController));
    fastify.get("/allergen-rules", { schema: { tags: ["Master Data"], summary: "List Allergen Matrix Rules" } }, masterData_controller_js_1.masterDataController.getAllergenRules.bind(masterData_controller_js_1.masterDataController));
    fastify.post("/allergen-rules", { schema: { tags: ["Master Data"], summary: "Create Allergen Matrix Rule" } }, masterData_controller_js_1.masterDataController.createAllergenRule.bind(masterData_controller_js_1.masterDataController));
    fastify.put("/allergen-rules/:id", { schema: { tags: ["Master Data"], summary: "Update Allergen Matrix Rule" } }, masterData_controller_js_1.masterDataController.updateAllergenRule.bind(masterData_controller_js_1.masterDataController));
    fastify.delete("/allergen-rules/:id", { schema: { tags: ["Master Data"], summary: "Delete Allergen Matrix Rule" } }, masterData_controller_js_1.masterDataController.deleteAllergenRule.bind(masterData_controller_js_1.masterDataController));
    // 14. SKUs, BOMs, Assets, Staff, Specs
    fastify.get("/skus", { schema: { tags: ["Master Data"], summary: "List Products & SKUs" } }, masterData_controller_js_1.masterDataController.getSkus.bind(masterData_controller_js_1.masterDataController));
    fastify.post("/skus", { schema: { tags: ["Master Data"], summary: "Create new SKU" } }, masterData_controller_js_1.masterDataController.createSku.bind(masterData_controller_js_1.masterDataController));
    fastify.put("/skus/:id", { schema: { tags: ["Master Data"], summary: "Update SKU master record" } }, masterData_controller_js_1.masterDataController.updateSku.bind(masterData_controller_js_1.masterDataController));
    fastify.delete("/skus/:id", { schema: { tags: ["Master Data"], summary: "Delete SKU from master" } }, masterData_controller_js_1.masterDataController.deleteSku.bind(masterData_controller_js_1.masterDataController));
    fastify.get("/boms", { schema: { tags: ["Master Data"], summary: "List BOMs & Formulations" } }, masterData_controller_js_1.masterDataController.getBoms.bind(masterData_controller_js_1.masterDataController));
    fastify.post("/boms", { schema: { tags: ["Master Data"], summary: "Create new BOM Recipe Formula" } }, masterData_controller_js_1.masterDataController.createBom.bind(masterData_controller_js_1.masterDataController));
    fastify.put("/boms/:id", { schema: { tags: ["Master Data"], summary: "Update BOM Recipe Formula" } }, masterData_controller_js_1.masterDataController.updateBom.bind(masterData_controller_js_1.masterDataController));
    fastify.delete("/boms/:id", { schema: { tags: ["Master Data"], summary: "Delete BOM Recipe Formula" } }, masterData_controller_js_1.masterDataController.deleteBom.bind(masterData_controller_js_1.masterDataController));
<<<<<<< HEAD
=======
    // 13. Assets, Categories & Machine Capability
>>>>>>> 5af8411961ffaedde5d11b050f16c0266436a5f2
    fastify.get("/asset-types", { schema: { tags: ["Master Data"], summary: "List Asset Categories / Types" } }, masterData_controller_js_1.masterDataController.getAssetTypes.bind(masterData_controller_js_1.masterDataController));
    fastify.post("/asset-types", { schema: { tags: ["Master Data"], summary: "Create Asset Category / Type" } }, masterData_controller_js_1.masterDataController.createAssetType.bind(masterData_controller_js_1.masterDataController));
    fastify.delete("/asset-types/:id", { schema: { tags: ["Master Data"], summary: "Delete Asset Category / Type" } }, masterData_controller_js_1.masterDataController.deleteAssetType.bind(masterData_controller_js_1.masterDataController));
    fastify.get("/criticality-levels", { schema: { tags: ["Master Data"], summary: "List Criticality Ratings" } }, masterData_controller_js_1.masterDataController.getCriticalityLevels.bind(masterData_controller_js_1.masterDataController));
    fastify.post("/criticality-levels", { schema: { tags: ["Master Data"], summary: "Create Criticality Rating" } }, masterData_controller_js_1.masterDataController.createCriticalityLevel.bind(masterData_controller_js_1.masterDataController));
    fastify.delete("/criticality-levels/:id", { schema: { tags: ["Master Data"], summary: "Delete Criticality Rating" } }, masterData_controller_js_1.masterDataController.deleteCriticalityLevel.bind(masterData_controller_js_1.masterDataController));
    fastify.get("/assets", { schema: { tags: ["Master Data"], summary: "List Equipment Assets" } }, masterData_controller_js_1.masterDataController.getAssets.bind(masterData_controller_js_1.masterDataController));
    fastify.post("/assets", { schema: { tags: ["Master Data"], summary: "Register New Equipment Asset" } }, masterData_controller_js_1.masterDataController.createAsset.bind(masterData_controller_js_1.masterDataController));
<<<<<<< HEAD
    fastify.put("/assets/:id", { schema: { tags: ["Master Data"], summary: "Update Equipment Asset" } }, masterData_controller_js_1.masterDataController.updateAsset.bind(masterData_controller_js_1.masterDataController));
=======
    fastify.put("/assets/:id", { schema: { tags: ["Master Data"], summary: "Update Equipment Asset Record" } }, masterData_controller_js_1.masterDataController.updateAsset.bind(masterData_controller_js_1.masterDataController));
    fastify.patch("/assets/:id", { schema: { tags: ["Master Data"], summary: "Partial Update Equipment Asset Record" } }, masterData_controller_js_1.masterDataController.updateAsset.bind(masterData_controller_js_1.masterDataController));
>>>>>>> 5af8411961ffaedde5d11b050f16c0266436a5f2
    fastify.delete("/assets/:id", { schema: { tags: ["Master Data"], summary: "Delete Equipment Asset" } }, masterData_controller_js_1.masterDataController.deleteAsset.bind(masterData_controller_js_1.masterDataController));
    fastify.get("/asset-details", { schema: { tags: ["Master Data"], summary: "Get Equipment Asset Details & Specifications" } }, masterData_controller_js_1.masterDataController.getAssets.bind(masterData_controller_js_1.masterDataController));
    fastify.get("/staff", { schema: { tags: ["Master Data"], summary: "List Operators & Shift Crew" } }, masterData_controller_js_1.masterDataController.getStaff.bind(masterData_controller_js_1.masterDataController));
    fastify.post("/staff", { schema: { tags: ["Master Data"], summary: "Register New Shift Supervisor / Staff Member" } }, masterData_controller_js_1.masterDataController.createStaff.bind(masterData_controller_js_1.masterDataController));
    fastify.put("/staff/:id", { schema: { tags: ["Master Data"], summary: "Update Staff Member Qualifications & Profile" } }, masterData_controller_js_1.masterDataController.updateStaff.bind(masterData_controller_js_1.masterDataController));
    fastify.delete("/staff/:id", { schema: { tags: ["Master Data"], summary: "Remove Staff Member" } }, masterData_controller_js_1.masterDataController.deleteStaff.bind(masterData_controller_js_1.masterDataController));
<<<<<<< HEAD
    fastify.get("/quality-specs", { schema: { tags: ["Master Data"], summary: "List QA & CCP Specifications" } }, masterData_controller_js_1.masterDataController.getQualitySpecs.bind(masterData_controller_js_1.masterDataController));
    fastify.post("/quality-specs", { schema: { tags: ["Master Data"], summary: "Register QA & CCP Specification" } }, masterData_controller_js_1.masterDataController.createQualitySpec.bind(masterData_controller_js_1.masterDataController));
    fastify.put("/quality-specs/:id", { schema: { tags: ["Master Data"], summary: "Update QA & CCP Specification" } }, masterData_controller_js_1.masterDataController.updateQualitySpec.bind(masterData_controller_js_1.masterDataController));
    fastify.delete("/quality-specs/:id", { schema: { tags: ["Master Data"], summary: "Remove QA & CCP Specification" } }, masterData_controller_js_1.masterDataController.deleteQualitySpec.bind(masterData_controller_js_1.masterDataController));
=======
    // 14. Quality Specifications & Parameter Master
    fastify.get("/quality-specs", { schema: { tags: ["Master Data"], summary: "List QA & CCP Specifications" } }, masterData_controller_js_1.masterDataController.getQualitySpecs.bind(masterData_controller_js_1.masterDataController));
    fastify.post("/quality-specs", { schema: { tags: ["Master Data"], summary: "Create QA & CCP Specification" } }, masterData_controller_js_1.masterDataController.createQualitySpec.bind(masterData_controller_js_1.masterDataController));
    fastify.put("/quality-specs/:id", { schema: { tags: ["Master Data"], summary: "Update QA & CCP Specification" } }, masterData_controller_js_1.masterDataController.updateQualitySpec.bind(masterData_controller_js_1.masterDataController));
    fastify.delete("/quality-specs/:id", { schema: { tags: ["Master Data"], summary: "Delete QA & CCP Specification" } }, masterData_controller_js_1.masterDataController.deleteQualitySpec.bind(masterData_controller_js_1.masterDataController));
    // 18. HACCP CCP Limits
    fastify.get("/ccp-limits", { schema: { tags: ["Master Data"], summary: "List HACCP CCP Limits" } }, masterData_controller_js_1.masterDataController.getCCPLimits.bind(masterData_controller_js_1.masterDataController));
    fastify.post("/ccp-limits", { schema: { tags: ["Master Data"], summary: "Create HACCP CCP Limit" } }, masterData_controller_js_1.masterDataController.createCCPLimit.bind(masterData_controller_js_1.masterDataController));
    fastify.put("/ccp-limits/:id", { schema: { tags: ["Master Data"], summary: "Update HACCP CCP Limit" } }, masterData_controller_js_1.masterDataController.updateCCPLimit.bind(masterData_controller_js_1.masterDataController));
    fastify.delete("/ccp-limits/:id", { schema: { tags: ["Master Data"], summary: "Delete HACCP CCP Limit" } }, masterData_controller_js_1.masterDataController.deleteCCPLimit.bind(masterData_controller_js_1.masterDataController));
    // 19. Storage Resources & Warehouse Master
    fastify.get("/storage-resources", { schema: { tags: ["Master Data"], summary: "List Storage Resources" } }, masterData_controller_js_1.masterDataController.getStorageResources.bind(masterData_controller_js_1.masterDataController));
    fastify.post("/storage-resources", { schema: { tags: ["Master Data"], summary: "Create Storage Resource" } }, masterData_controller_js_1.masterDataController.createStorageResource.bind(masterData_controller_js_1.masterDataController));
    fastify.put("/storage-resources/:id", { schema: { tags: ["Master Data"], summary: "Update Storage Resource" } }, masterData_controller_js_1.masterDataController.updateStorageResource.bind(masterData_controller_js_1.masterDataController));
    fastify.delete("/storage-resources/:id", { schema: { tags: ["Master Data"], summary: "Delete Storage Resource" } }, masterData_controller_js_1.masterDataController.deleteStorageResource.bind(masterData_controller_js_1.masterDataController));
>>>>>>> 5af8411961ffaedde5d11b050f16c0266436a5f2
    // 15. Labour Standards
    fastify.get("/labour-standards", { schema: { tags: ["Master Data"], summary: "List Labour Standards" } }, masterData_controller_js_1.masterDataController.getLabourStandards.bind(masterData_controller_js_1.masterDataController));
    fastify.post("/labour-standards", { schema: { tags: ["Master Data"], summary: "Create Labour Standard" } }, masterData_controller_js_1.masterDataController.createLabourStandard.bind(masterData_controller_js_1.masterDataController));
    fastify.put("/labour-standards/:id", { schema: { tags: ["Master Data"], summary: "Update Labour Standard" } }, masterData_controller_js_1.masterDataController.updateLabourStandard.bind(masterData_controller_js_1.masterDataController));
    fastify.delete("/labour-standards/:id", { schema: { tags: ["Master Data"], summary: "Delete Labour Standard" } }, masterData_controller_js_1.masterDataController.deleteLabourStandard.bind(masterData_controller_js_1.masterDataController));
    // 17. Employee Skills & Qualifications Matrix
    fastify.get("/employee-skills", { schema: { tags: ["Master Data"], summary: "List Employee Skill Qualification Matrix" } }, masterData_controller_js_1.masterDataController.getEmployeeSkills.bind(masterData_controller_js_1.masterDataController));
    fastify.post("/employee-skills", { schema: { tags: ["Master Data"], summary: "Onboard Employee with Skill Competencies" } }, masterData_controller_js_1.masterDataController.createEmployeeSkill.bind(masterData_controller_js_1.masterDataController));
    fastify.put("/employee-skills/:id", { schema: { tags: ["Master Data"], summary: "Update Employee Skill Matrix" } }, masterData_controller_js_1.masterDataController.updateEmployeeSkill.bind(masterData_controller_js_1.masterDataController));
    fastify.delete("/employee-skills/:id", { schema: { tags: ["Master Data"], summary: "Delete Employee Skill Record" } }, masterData_controller_js_1.masterDataController.deleteEmployeeSkill.bind(masterData_controller_js_1.masterDataController));
    // Aliases for seamless API compatibility
    fastify.get("/employees", { schema: { tags: ["Master Data"], summary: "List Employees Matrix" } }, masterData_controller_js_1.masterDataController.getEmployeeSkills.bind(masterData_controller_js_1.masterDataController));
    fastify.post("/employees", { schema: { tags: ["Master Data"], summary: "Create Employee Record" } }, masterData_controller_js_1.masterDataController.createEmployeeSkill.bind(masterData_controller_js_1.masterDataController));
    fastify.put("/employees/:id", { schema: { tags: ["Master Data"], summary: "Update Employee Record" } }, masterData_controller_js_1.masterDataController.updateEmployeeSkill.bind(masterData_controller_js_1.masterDataController));
    fastify.delete("/employees/:id", { schema: { tags: ["Master Data"], summary: "Delete Employee Record" } }, masterData_controller_js_1.masterDataController.deleteEmployeeSkill.bind(masterData_controller_js_1.masterDataController));
}
//# sourceMappingURL=masterData.routes.js.map