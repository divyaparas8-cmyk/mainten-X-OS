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
    // 6. SKUs, BOMs, Assets, Staff, Specs
    fastify.get("/skus", { schema: { tags: ["Master Data"], summary: "List Products & SKUs" } }, masterData_controller_js_1.masterDataController.getSkus.bind(masterData_controller_js_1.masterDataController));
    fastify.post("/skus", { schema: { tags: ["Master Data"], summary: "Create new SKU" } }, masterData_controller_js_1.masterDataController.createSku.bind(masterData_controller_js_1.masterDataController));
    fastify.get("/boms", { schema: { tags: ["Master Data"], summary: "List BOMs & Formulations" } }, masterData_controller_js_1.masterDataController.getBoms.bind(masterData_controller_js_1.masterDataController));
    fastify.get("/assets", { schema: { tags: ["Master Data"], summary: "List Equipment Assets" } }, masterData_controller_js_1.masterDataController.getAssets.bind(masterData_controller_js_1.masterDataController));
    fastify.get("/staff", { schema: { tags: ["Master Data"], summary: "List Operators & Shift Crew" } }, masterData_controller_js_1.masterDataController.getStaff.bind(masterData_controller_js_1.masterDataController));
    fastify.get("/quality-specs", { schema: { tags: ["Master Data"], summary: "List QA & CCP Specifications" } }, masterData_controller_js_1.masterDataController.getQualitySpecs.bind(masterData_controller_js_1.masterDataController));
}
//# sourceMappingURL=masterData.routes.js.map