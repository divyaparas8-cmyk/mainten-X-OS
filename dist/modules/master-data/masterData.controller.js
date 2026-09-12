"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.masterDataController = exports.MasterDataController = void 0;
const masterData_service_js_1 = require("./masterData.service.js");
const masterData_schema_js_1 = require("./masterData.schema.js");
const responseFormatter_js_1 = require("../../shared/utils/responseFormatter.js");
class MasterDataController {
    // ==========================================
    // COMPANIES / LEGAL ENTITIES
    // ==========================================
    async getCompanies(request, reply) {
        const data = await masterData_service_js_1.masterDataService.listCompanies(request.user?.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async createCompany(request, reply) {
        const data = await masterData_service_js_1.masterDataService.createCompany(request.user?.tenantId, request.body);
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, "Legal corporate entity registered successfully"));
    }
    async updateCompany(request, reply) {
        const { id } = request.params;
        const data = await masterData_service_js_1.masterDataService.updateCompany(request.user?.tenantId, id, request.body);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Legal entity updated successfully"));
    }
    async deleteCompany(request, reply) {
        const { id } = request.params;
        const data = await masterData_service_js_1.masterDataService.deleteCompany(request.user?.tenantId, id);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Legal entity deleted successfully"));
    }
    // ==========================================
    // PLANTS / FACILITIES
    // ==========================================
    async getPlants(request, reply) {
        const data = await masterData_service_js_1.masterDataService.listPlants(request.user?.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async createPlant(request, reply) {
        const data = await masterData_service_js_1.masterDataService.createPlant(request.user?.tenantId, request.body);
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, "Plant facility provisioned successfully"));
    }
    async updatePlant(request, reply) {
        const { id } = request.params;
        const data = await masterData_service_js_1.masterDataService.updatePlant(request.user?.tenantId, id, request.body);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Plant facility updated successfully"));
    }
    async deletePlant(request, reply) {
        const { id } = request.params;
        const data = await masterData_service_js_1.masterDataService.deletePlant(request.user?.tenantId, id);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Plant facility deleted successfully"));
    }
    // ==========================================
    // DEPARTMENTS
    // ==========================================
    async getDepartments(request, reply) {
        const data = await masterData_service_js_1.masterDataService.listDepartments(request.user?.tenantId, request.query.plantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async createDepartment(request, reply) {
        const data = await masterData_service_js_1.masterDataService.createDepartment(request.user?.tenantId, request.body);
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, "Department registered successfully"));
    }
    async updateDepartment(request, reply) {
        const { id } = request.params;
        const data = await masterData_service_js_1.masterDataService.updateDepartment(request.user?.tenantId, id, request.body);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Department updated successfully"));
    }
    async deleteDepartment(request, reply) {
        const { id } = request.params;
        const data = await masterData_service_js_1.masterDataService.deleteDepartment(request.user?.tenantId, id);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Department deleted successfully"));
    }
    // ==========================================
    // PRODUCTION LINES
    // ==========================================
    async getLines(request, reply) {
        const data = await masterData_service_js_1.masterDataService.listLines(request.user?.tenantId, request.query.plantId || request.user?.plantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async createLine(request, reply) {
        const data = await masterData_service_js_1.masterDataService.createLine(request.user?.tenantId, request.body);
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, "Manufacturing line created successfully"));
    }
    async updateLine(request, reply) {
        const { id } = request.params;
        const data = await masterData_service_js_1.masterDataService.updateLine(request.user?.tenantId, id, request.body);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Manufacturing line updated successfully"));
    }
    async deleteLine(request, reply) {
        const { id } = request.params;
        const data = await masterData_service_js_1.masterDataService.deleteLine(request.user?.tenantId, id);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Manufacturing line deleted successfully"));
    }
    // ==========================================
    // WORK CENTERS
    // ==========================================
    async getWorkCenters(request, reply) {
        const data = await masterData_service_js_1.masterDataService.listWorkCenters(request.user?.tenantId, request.query.plantId || request.user?.plantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async createWorkCenter(request, reply) {
        const data = await masterData_service_js_1.masterDataService.createWorkCenter(request.user?.tenantId, request.body);
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, "Work center cell created successfully"));
    }
    async updateWorkCenter(request, reply) {
        const { id } = request.params;
        const data = await masterData_service_js_1.masterDataService.updateWorkCenter(request.user?.tenantId, id, request.body);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Work center cell updated successfully"));
    }
    async deleteWorkCenter(request, reply) {
        const { id } = request.params;
        const data = await masterData_service_js_1.masterDataService.deleteWorkCenter(request.user?.tenantId, id);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Work center cell deleted successfully"));
    }
    // ==========================================
    // OPERATIONS
    // ==========================================
    async getOperations(request, reply) {
        const data = await masterData_service_js_1.masterDataService.listOperations(request.user?.tenantId, request.query.department);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async createOperation(request, reply) {
        const data = await masterData_service_js_1.masterDataService.createOperation(request.user?.tenantId, request.body);
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, "Operation registered successfully"));
    }
    async updateOperation(request, reply) {
        const { id } = request.params;
        const data = await masterData_service_js_1.masterDataService.updateOperation(request.user?.tenantId, id, request.body);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Operation updated successfully"));
    }
    async deleteOperation(request, reply) {
        const { id } = request.params;
        const data = await masterData_service_js_1.masterDataService.deleteOperation(request.user?.tenantId, id);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Operation deleted successfully"));
    }
    // ==========================================
    // ROUTINGS
    // ==========================================
    async getRoutings(request, reply) {
        const data = await masterData_service_js_1.masterDataService.listRoutings(request.user?.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async getRoutingById(request, reply) {
        const { id } = request.params;
        const data = await masterData_service_js_1.masterDataService.getRoutingById(request.user?.tenantId, id);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async createRouting(request, reply) {
        const body = (request.body || {});
        const validated = masterData_schema_js_1.createRoutingSchema.partial({ skuId: true }).parse(body);
        const data = await masterData_service_js_1.masterDataService.createRouting(request.user?.tenantId, { ...body, ...validated });
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, "Routing master registered successfully"));
    }
    async updateRouting(request, reply) {
        const { id } = request.params;
        const body = (request.body || {});
        const validated = masterData_schema_js_1.updateRoutingSchema.parse(body);
        const data = await masterData_service_js_1.masterDataService.updateRouting(request.user?.tenantId, id, { ...body, ...validated });
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Routing updated successfully"));
    }
    async updateRoutingStatus(request, reply) {
        const { id } = request.params;
        const data = await masterData_service_js_1.masterDataService.updateRoutingStatus(request.user?.tenantId, id, request.body);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Routing status updated successfully"));
    }
    async deleteRouting(request, reply) {
        const { id } = request.params;
        const data = await masterData_service_js_1.masterDataService.deleteRouting(request.user?.tenantId, id);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Routing deleted successfully"));
    }
    // ==========================================
    // PRODUCT FAMILIES
    // ==========================================
    async getProductFamilies(request, reply) {
        const data = await masterData_service_js_1.masterDataService.listProductFamilies(request.user?.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async createProductFamily(request, reply) {
        const data = await masterData_service_js_1.masterDataService.createProductFamily(request.user?.tenantId, request.body);
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, "Product family created successfully"));
    }
    async updateProductFamily(request, reply) {
        const { id } = request.params;
        const data = await masterData_service_js_1.masterDataService.updateProductFamily(request.user?.tenantId, id, request.body);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Product family updated successfully"));
    }
    async deleteProductFamily(request, reply) {
        const { id } = request.params;
        const data = await masterData_service_js_1.masterDataService.deleteProductFamily(request.user?.tenantId, id);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Product family deleted successfully"));
    }
    // ==========================================
    // UOMS
    // ==========================================
    async getUoms(request, reply) {
        const data = await masterData_service_js_1.masterDataService.listUoms(request.user?.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async createUom(request, reply) {
        const data = await masterData_service_js_1.masterDataService.createUom(request.user?.tenantId, request.body);
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, "UOM registered successfully"));
    }
    async updateUom(request, reply) {
        const { id } = request.params;
        const data = await masterData_service_js_1.masterDataService.updateUom(request.user?.tenantId, id, request.body);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "UOM updated successfully"));
    }
    async deleteUom(request, reply) {
        const { id } = request.params;
        const data = await masterData_service_js_1.masterDataService.deleteUom(request.user?.tenantId, id);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "UOM deleted successfully"));
    }
    // ==========================================
    // PACK CONFIGS
    // ==========================================
    async getPackConfigs(request, reply) {
        const data = await masterData_service_js_1.masterDataService.listPackConfigs(request.user?.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async createPackConfig(request, reply) {
        const data = await masterData_service_js_1.masterDataService.createPackConfig(request.user?.tenantId, request.body);
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, "Packaging configuration created successfully"));
    }
    async updatePackConfig(request, reply) {
        const { id } = request.params;
        const data = await masterData_service_js_1.masterDataService.updatePackConfig(request.user?.tenantId, id, request.body);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Packaging configuration updated successfully"));
    }
    async deletePackConfig(request, reply) {
        const { id } = request.params;
        const data = await masterData_service_js_1.masterDataService.deletePackConfig(request.user?.tenantId, id);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Packaging configuration deleted successfully"));
    }
    // ==========================================
    // LINE TARGETS
    // ==========================================
    async getLineTargets(request, reply) {
        const data = await masterData_service_js_1.masterDataService.listLineTargets(request.user?.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async createLineTarget(request, reply) {
        const data = await masterData_service_js_1.masterDataService.createLineTarget(request.user?.tenantId, request.body);
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, "Line target created successfully"));
    }
    async updateLineTarget(request, reply) {
        const { id } = request.params;
        const data = await masterData_service_js_1.masterDataService.updateLineTarget(request.user?.tenantId, id, request.body);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Line target updated successfully"));
    }
    async deleteLineTarget(request, reply) {
        const { id } = request.params;
        const data = await masterData_service_js_1.masterDataService.deleteLineTarget(request.user?.tenantId, id);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Line target deleted successfully"));
    }
    // ==========================================
    // CHANGEOVER MATRIX
    // ==========================================
    async getChangeoverRules(request, reply) {
        const data = await masterData_service_js_1.masterDataService.listChangeoverRules(request.user?.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async createChangeoverRule(request, reply) {
        const data = await masterData_service_js_1.masterDataService.createChangeoverRule(request.user?.tenantId, request.body);
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, "Changeover matrix rule created successfully"));
    }
    async updateChangeoverRule(request, reply) {
        const { id } = request.params;
        const data = await masterData_service_js_1.masterDataService.updateChangeoverRule(request.user?.tenantId, id, request.body);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Changeover rule updated successfully"));
    }
    async deleteChangeoverRule(request, reply) {
        const { id } = request.params;
        const data = await masterData_service_js_1.masterDataService.deleteChangeoverRule(request.user?.tenantId, id);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Changeover rule deleted successfully"));
    }
    // ==========================================
    // SANITATION & ALLERGENS
    // ==========================================
    async getSanitationClasses(request, reply) {
        const data = await masterData_service_js_1.masterDataService.listSanitationClasses(request.user?.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async createSanitationClass(request, reply) {
        const data = await masterData_service_js_1.masterDataService.createSanitationClass(request.user?.tenantId, request.body);
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, "Sanitation class created successfully"));
    }
    async updateSanitationClass(request, reply) {
        const { id } = request.params;
        const data = await masterData_service_js_1.masterDataService.updateSanitationClass(request.user?.tenantId, id, request.body);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Sanitation class updated successfully"));
    }
    async deleteSanitationClass(request, reply) {
        const { id } = request.params;
        const data = await masterData_service_js_1.masterDataService.deleteSanitationClass(request.user?.tenantId, id);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Sanitation class deleted successfully"));
    }
    async getAllergenRules(request, reply) {
        const data = await masterData_service_js_1.masterDataService.listAllergenRules(request.user?.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async createAllergenRule(request, reply) {
        const data = await masterData_service_js_1.masterDataService.createAllergenRule(request.user?.tenantId, request.body);
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, "Allergen matrix rule created successfully"));
    }
    async updateAllergenRule(request, reply) {
        const { id } = request.params;
        const data = await masterData_service_js_1.masterDataService.updateAllergenRule(request.user?.tenantId, id, request.body);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Allergen rule updated successfully"));
    }
    async deleteAllergenRule(request, reply) {
        const { id } = request.params;
        const data = await masterData_service_js_1.masterDataService.deleteAllergenRule(request.user?.tenantId, id);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Allergen rule deleted successfully"));
    }
    // ==========================================
    // SKUs, BOMs, ASSETS, STAFF, SPECS
    // ==========================================
    async getSkus(request, reply) {
        const data = await masterData_service_js_1.masterDataService.listSkus(request.user?.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async createSku(request, reply) {
        const data = await masterData_service_js_1.masterDataService.createSku(request.user?.tenantId, request.body);
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, "SKU created successfully"));
    }
    async updateSku(request, reply) {
        const { id } = request.params;
        const data = await masterData_service_js_1.masterDataService.updateSku(request.user?.tenantId, id, request.body);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "SKU updated successfully"));
    }
    async deleteSku(request, reply) {
        const { id } = request.params;
        const data = await masterData_service_js_1.masterDataService.deleteSku(request.user?.tenantId, id);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "SKU deleted successfully"));
    }
    async getBoms(request, reply) {
        const data = await masterData_service_js_1.masterDataService.listBoms(request.user?.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async createBom(request, reply) {
        const data = await masterData_service_js_1.masterDataService.createBom(request.user?.tenantId, request.body);
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, "BOM recipe created successfully"));
    }
    async updateBom(request, reply) {
        const { id } = request.params;
        const data = await masterData_service_js_1.masterDataService.updateBom(request.user?.tenantId, id, request.body);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "BOM recipe updated successfully"));
    }
    async deleteBom(request, reply) {
        const { id } = request.params;
        const data = await masterData_service_js_1.masterDataService.deleteBom(request.user?.tenantId, id);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "BOM recipe deleted successfully"));
    }
    async getAssets(request, reply) {
        const data = await masterData_service_js_1.masterDataService.listAssets(request.user?.tenantId, request.query.plantId || request.user?.plantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async createAsset(request, reply) {
        const data = await masterData_service_js_1.masterDataService.createAsset(request.user?.tenantId, request.body);
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, "Asset registered successfully"));
    }
    async updateAsset(request, reply) {
        const { id } = request.params;
        const data = await masterData_service_js_1.masterDataService.updateAsset(request.user?.tenantId, id, request.body);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Asset updated successfully"));
    }
    async deleteAsset(request, reply) {
        const { id } = request.params;
        const data = await masterData_service_js_1.masterDataService.deleteAsset(request.user?.tenantId, id);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Asset deleted successfully"));
    }
    async getStaff(request, reply) {
        const data = await masterData_service_js_1.masterDataService.listStaff(request.user?.tenantId, request.query.plantId || request.user?.plantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async getQualitySpecs(request, reply) {
        const data = await masterData_service_js_1.masterDataService.listQualitySpecs(request.user?.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    // ==========================================
    // 15. LABOUR STANDARDS
    // ==========================================
    async getLabourStandards(request, reply) {
        const data = await masterData_service_js_1.masterDataService.listLabourStandards(request.user?.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async createLabourStandard(request, reply) {
        const data = await masterData_service_js_1.masterDataService.createLabourStandard(request.user?.tenantId, request.body);
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, "Labour standard created successfully"));
    }
    async updateLabourStandard(request, reply) {
        const { id } = request.params;
        const data = await masterData_service_js_1.masterDataService.updateLabourStandard(request.user?.tenantId, id, request.body);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Labour standard updated successfully"));
    }
    async deleteLabourStandard(request, reply) {
        const { id } = request.params;
        const data = await masterData_service_js_1.masterDataService.deleteLabourStandard(request.user?.tenantId, id);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data, "Labour standard deleted successfully"));
    }
}
exports.MasterDataController = MasterDataController;
exports.masterDataController = new MasterDataController();
//# sourceMappingURL=masterData.controller.js.map