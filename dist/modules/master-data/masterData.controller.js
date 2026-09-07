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
    // SKUs, BOMs, ASSETS, STAFF, SPECS
    // ==========================================
    async getSkus(request, reply) {
        const data = await masterData_service_js_1.masterDataService.listSkus(request.user?.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async createSku(request, reply) {
        const input = masterData_schema_js_1.createSkuSchema.parse(request.body);
        const data = await masterData_service_js_1.masterDataService.createSku(request.user?.tenantId, input);
        return reply.status(201).send((0, responseFormatter_js_1.formatSuccess)(data, "SKU created successfully"));
    }
    async getBoms(request, reply) {
        const data = await masterData_service_js_1.masterDataService.listBoms(request.user?.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async getAssets(request, reply) {
        const data = await masterData_service_js_1.masterDataService.listAssets(request.user?.tenantId, request.query.plantId || request.user?.plantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async getStaff(request, reply) {
        const data = await masterData_service_js_1.masterDataService.listStaff(request.user?.tenantId, request.query.plantId || request.user?.plantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async getQualitySpecs(request, reply) {
        const data = await masterData_service_js_1.masterDataService.listQualitySpecs(request.user?.tenantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
}
exports.MasterDataController = MasterDataController;
exports.masterDataController = new MasterDataController();
//# sourceMappingURL=masterData.controller.js.map