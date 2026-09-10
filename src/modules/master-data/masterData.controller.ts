import { FastifyReply, FastifyRequest } from "fastify";
import { masterDataService } from "./masterData.service.js";
import { createSkuSchema, createRoutingSchema, updateRoutingSchema } from "./masterData.schema.js";
import { formatSuccess } from "../../shared/utils/responseFormatter.js";

export class MasterDataController {
  // ==========================================
  // COMPANIES / LEGAL ENTITIES
  // ==========================================
  async getCompanies(request: FastifyRequest, reply: FastifyReply) {
    const data = await masterDataService.listCompanies(request.user?.tenantId);
    return reply.send(formatSuccess(data));
  }

  async createCompany(request: FastifyRequest, reply: FastifyReply) {
    const data = await masterDataService.createCompany(request.user?.tenantId, request.body);
    return reply.status(201).send(formatSuccess(data, "Legal corporate entity registered successfully"));
  }

  async updateCompany(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params;
    const data = await masterDataService.updateCompany(request.user?.tenantId, id, request.body);
    return reply.send(formatSuccess(data, "Legal entity updated successfully"));
  }

  async deleteCompany(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params;
    const data = await masterDataService.deleteCompany(request.user?.tenantId, id);
    return reply.send(formatSuccess(data, "Legal entity deleted successfully"));
  }

  // ==========================================
  // PLANTS / FACILITIES
  // ==========================================
  async getPlants(request: FastifyRequest, reply: FastifyReply) {
    const data = await masterDataService.listPlants(request.user?.tenantId);
    return reply.send(formatSuccess(data));
  }

  async createPlant(request: FastifyRequest, reply: FastifyReply) {
    const data = await masterDataService.createPlant(request.user?.tenantId, request.body);
    return reply.status(201).send(formatSuccess(data, "Plant facility provisioned successfully"));
  }

  async updatePlant(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params;
    const data = await masterDataService.updatePlant(request.user?.tenantId, id, request.body);
    return reply.send(formatSuccess(data, "Plant facility updated successfully"));
  }

  async deletePlant(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params;
    const data = await masterDataService.deletePlant(request.user?.tenantId, id);
    return reply.send(formatSuccess(data, "Plant facility deleted successfully"));
  }

  // ==========================================
  // DEPARTMENTS
  // ==========================================
  async getDepartments(request: FastifyRequest<{ Querystring: { plantId?: string } }>, reply: FastifyReply) {
    const data = await masterDataService.listDepartments(request.user?.tenantId, request.query.plantId);
    return reply.send(formatSuccess(data));
  }

  async createDepartment(request: FastifyRequest, reply: FastifyReply) {
    const data = await masterDataService.createDepartment(request.user?.tenantId, request.body);
    return reply.status(201).send(formatSuccess(data, "Department registered successfully"));
  }

  async updateDepartment(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params;
    const data = await masterDataService.updateDepartment(request.user?.tenantId, id, request.body);
    return reply.send(formatSuccess(data, "Department updated successfully"));
  }

  async deleteDepartment(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params;
    const data = await masterDataService.deleteDepartment(request.user?.tenantId, id);
    return reply.send(formatSuccess(data, "Department deleted successfully"));
  }

  // ==========================================
  // PRODUCTION LINES
  // ==========================================
  async getLines(request: FastifyRequest<{ Querystring: { plantId?: string } }>, reply: FastifyReply) {
    const data = await masterDataService.listLines(request.user?.tenantId, request.query.plantId || request.user?.plantId);
    return reply.send(formatSuccess(data));
  }

  async createLine(request: FastifyRequest, reply: FastifyReply) {
    const data = await masterDataService.createLine(request.user?.tenantId, request.body);
    return reply.status(201).send(formatSuccess(data, "Manufacturing line created successfully"));
  }

  async updateLine(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params;
    const data = await masterDataService.updateLine(request.user?.tenantId, id, request.body);
    return reply.send(formatSuccess(data, "Manufacturing line updated successfully"));
  }

  async deleteLine(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params;
    const data = await masterDataService.deleteLine(request.user?.tenantId, id);
    return reply.send(formatSuccess(data, "Manufacturing line deleted successfully"));
  }

  // ==========================================
  // WORK CENTERS
  // ==========================================
  async getWorkCenters(request: FastifyRequest<{ Querystring: { plantId?: string } }>, reply: FastifyReply) {
    const data = await masterDataService.listWorkCenters(request.user?.tenantId, request.query.plantId || request.user?.plantId);
    return reply.send(formatSuccess(data));
  }

  async createWorkCenter(request: FastifyRequest, reply: FastifyReply) {
    const data = await masterDataService.createWorkCenter(request.user?.tenantId, request.body);
    return reply.status(201).send(formatSuccess(data, "Work center cell created successfully"));
  }

  async updateWorkCenter(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params;
    const data = await masterDataService.updateWorkCenter(request.user?.tenantId, id, request.body);
    return reply.send(formatSuccess(data, "Work center cell updated successfully"));
  }

  async deleteWorkCenter(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params;
    const data = await masterDataService.deleteWorkCenter(request.user?.tenantId, id);
    return reply.send(formatSuccess(data, "Work center cell deleted successfully"));
  }

  // ==========================================
  // OPERATIONS
  // ==========================================
  async getOperations(request: FastifyRequest<{ Querystring: { department?: string } }>, reply: FastifyReply) {
    const data = await masterDataService.listOperations(request.user?.tenantId, request.query.department);
    return reply.send(formatSuccess(data));
  }

  async createOperation(request: FastifyRequest, reply: FastifyReply) {
    const data = await masterDataService.createOperation(request.user?.tenantId, request.body);
    return reply.status(201).send(formatSuccess(data, "Operation registered successfully"));
  }

  async updateOperation(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params;
    const data = await masterDataService.updateOperation(request.user?.tenantId, id, request.body);
    return reply.send(formatSuccess(data, "Operation updated successfully"));
  }

  async deleteOperation(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params;
    const data = await masterDataService.deleteOperation(request.user?.tenantId, id);
    return reply.send(formatSuccess(data, "Operation deleted successfully"));
  }

  // ==========================================
  // ROUTINGS
  // ==========================================
  async getRoutings(request: FastifyRequest, reply: FastifyReply) {
    const data = await masterDataService.listRoutings(request.user?.tenantId);
    return reply.send(formatSuccess(data));
  }

  async getRoutingById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params;
    const data = await masterDataService.getRoutingById(request.user?.tenantId, id);
    return reply.send(formatSuccess(data));
  }

  async createRouting(request: FastifyRequest, reply: FastifyReply) {
    const body = (request.body || {}) as Record<string, any>;
    const validated = createRoutingSchema.partial({ skuId: true }).parse(body);
    const data = await masterDataService.createRouting(request.user?.tenantId, { ...body, ...validated });
    return reply.status(201).send(formatSuccess(data, "Routing master registered successfully"));
  }

  async updateRouting(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params;
    const body = (request.body || {}) as Record<string, any>;
    const validated = updateRoutingSchema.parse(body);
    const data = await masterDataService.updateRouting(request.user?.tenantId, id, { ...body, ...validated });
    return reply.send(formatSuccess(data, "Routing updated successfully"));
  }

  async updateRoutingStatus(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params;
    const data = await masterDataService.updateRoutingStatus(request.user?.tenantId, id, request.body as any);
    return reply.send(formatSuccess(data, "Routing status updated successfully"));
  }

  async deleteRouting(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params;
    const data = await masterDataService.deleteRouting(request.user?.tenantId, id);
    return reply.send(formatSuccess(data, "Routing deleted successfully"));
  }

  // ==========================================
  // PRODUCT FAMILIES
  // ==========================================
  async getProductFamilies(request: FastifyRequest, reply: FastifyReply) {
    const data = await masterDataService.listProductFamilies(request.user?.tenantId);
    return reply.send(formatSuccess(data));
  }

  async createProductFamily(request: FastifyRequest, reply: FastifyReply) {
    const data = await masterDataService.createProductFamily(request.user?.tenantId, request.body);
    return reply.status(201).send(formatSuccess(data, "Product family created successfully"));
  }

  async updateProductFamily(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params;
    const data = await masterDataService.updateProductFamily(request.user?.tenantId, id, request.body);
    return reply.send(formatSuccess(data, "Product family updated successfully"));
  }

  async deleteProductFamily(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params;
    const data = await masterDataService.deleteProductFamily(request.user?.tenantId, id);
    return reply.send(formatSuccess(data, "Product family deleted successfully"));
  }

  // ==========================================
  // UOMS
  // ==========================================
  async getUoms(request: FastifyRequest, reply: FastifyReply) {
    const data = await masterDataService.listUoms(request.user?.tenantId);
    return reply.send(formatSuccess(data));
  }

  async createUom(request: FastifyRequest, reply: FastifyReply) {
    const data = await masterDataService.createUom(request.user?.tenantId, request.body);
    return reply.status(201).send(formatSuccess(data, "UOM registered successfully"));
  }

  async updateUom(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params;
    const data = await masterDataService.updateUom(request.user?.tenantId, id, request.body);
    return reply.send(formatSuccess(data, "UOM updated successfully"));
  }

  async deleteUom(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params;
    const data = await masterDataService.deleteUom(request.user?.tenantId, id);
    return reply.send(formatSuccess(data, "UOM deleted successfully"));
  }

  // ==========================================
  // PACK CONFIGS
  // ==========================================
  async getPackConfigs(request: FastifyRequest, reply: FastifyReply) {
    const data = await masterDataService.listPackConfigs(request.user?.tenantId);
    return reply.send(formatSuccess(data));
  }

  async createPackConfig(request: FastifyRequest, reply: FastifyReply) {
    const data = await masterDataService.createPackConfig(request.user?.tenantId, request.body);
    return reply.status(201).send(formatSuccess(data, "Packaging configuration created successfully"));
  }

  async updatePackConfig(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params;
    const data = await masterDataService.updatePackConfig(request.user?.tenantId, id, request.body);
    return reply.send(formatSuccess(data, "Packaging configuration updated successfully"));
  }

  async deletePackConfig(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params;
    const data = await masterDataService.deletePackConfig(request.user?.tenantId, id);
    return reply.send(formatSuccess(data, "Packaging configuration deleted successfully"));
  }

  // ==========================================
  // LINE TARGETS
  // ==========================================
  async getLineTargets(request: FastifyRequest, reply: FastifyReply) {
    const data = await masterDataService.listLineTargets(request.user?.tenantId);
    return reply.send(formatSuccess(data));
  }

  async createLineTarget(request: FastifyRequest, reply: FastifyReply) {
    const data = await masterDataService.createLineTarget(request.user?.tenantId, request.body);
    return reply.status(201).send(formatSuccess(data, "Line target created successfully"));
  }

  async updateLineTarget(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params;
    const data = await masterDataService.updateLineTarget(request.user?.tenantId, id, request.body);
    return reply.send(formatSuccess(data, "Line target updated successfully"));
  }

  async deleteLineTarget(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params;
    const data = await masterDataService.deleteLineTarget(request.user?.tenantId, id);
    return reply.send(formatSuccess(data, "Line target deleted successfully"));
  }

  // ==========================================
  // CHANGEOVER MATRIX
  // ==========================================
  async getChangeoverRules(request: FastifyRequest, reply: FastifyReply) {
    const data = await masterDataService.listChangeoverRules(request.user?.tenantId);
    return reply.send(formatSuccess(data));
  }

  async createChangeoverRule(request: FastifyRequest, reply: FastifyReply) {
    const data = await masterDataService.createChangeoverRule(request.user?.tenantId, request.body);
    return reply.status(201).send(formatSuccess(data, "Changeover matrix rule created successfully"));
  }

  async updateChangeoverRule(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params;
    const data = await masterDataService.updateChangeoverRule(request.user?.tenantId, id, request.body);
    return reply.send(formatSuccess(data, "Changeover rule updated successfully"));
  }

  async deleteChangeoverRule(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params;
    const data = await masterDataService.deleteChangeoverRule(request.user?.tenantId, id);
    return reply.send(formatSuccess(data, "Changeover rule deleted successfully"));
  }

  // ==========================================
  // SANITATION & ALLERGENS
  // ==========================================
  async getSanitationClasses(request: FastifyRequest, reply: FastifyReply) {
    const data = await masterDataService.listSanitationClasses(request.user?.tenantId);
    return reply.send(formatSuccess(data));
  }

  async createSanitationClass(request: FastifyRequest, reply: FastifyReply) {
    const data = await masterDataService.createSanitationClass(request.user?.tenantId, request.body);
    return reply.status(201).send(formatSuccess(data, "Sanitation class created successfully"));
  }

  async updateSanitationClass(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params;
    const data = await masterDataService.updateSanitationClass(request.user?.tenantId, id, request.body);
    return reply.send(formatSuccess(data, "Sanitation class updated successfully"));
  }

  async deleteSanitationClass(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params;
    const data = await masterDataService.deleteSanitationClass(request.user?.tenantId, id);
    return reply.send(formatSuccess(data, "Sanitation class deleted successfully"));
  }

  async getAllergenRules(request: FastifyRequest, reply: FastifyReply) {
    const data = await masterDataService.listAllergenRules(request.user?.tenantId);
    return reply.send(formatSuccess(data));
  }

  async createAllergenRule(request: FastifyRequest, reply: FastifyReply) {
    const data = await masterDataService.createAllergenRule(request.user?.tenantId, request.body);
    return reply.status(201).send(formatSuccess(data, "Allergen matrix rule created successfully"));
  }

  async updateAllergenRule(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params;
    const data = await masterDataService.updateAllergenRule(request.user?.tenantId, id, request.body);
    return reply.send(formatSuccess(data, "Allergen rule updated successfully"));
  }

  async deleteAllergenRule(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params;
    const data = await masterDataService.deleteAllergenRule(request.user?.tenantId, id);
    return reply.send(formatSuccess(data, "Allergen rule deleted successfully"));
  }

  // ==========================================
  // SKUs, BOMs, ASSETS, STAFF, SPECS
  // ==========================================
  async getSkus(request: FastifyRequest, reply: FastifyReply) {
    const data = await masterDataService.listSkus(request.user?.tenantId);
    return reply.send(formatSuccess(data));
  }

  async createSku(request: FastifyRequest, reply: FastifyReply) {
    const data = await masterDataService.createSku(request.user?.tenantId, request.body);
    return reply.status(201).send(formatSuccess(data, "SKU created successfully"));
  }

  async updateSku(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params;
    const data = await masterDataService.updateSku(request.user?.tenantId, id, request.body);
    return reply.send(formatSuccess(data, "SKU updated successfully"));
  }

  async deleteSku(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params;
    const data = await masterDataService.deleteSku(request.user?.tenantId, id);
    return reply.send(formatSuccess(data, "SKU deleted successfully"));
  }


  async getBoms(request: FastifyRequest, reply: FastifyReply) {
    const data = await masterDataService.listBoms(request.user?.tenantId);
    return reply.send(formatSuccess(data));
  }

  async createBom(request: FastifyRequest, reply: FastifyReply) {
    const data = await masterDataService.createBom(request.user?.tenantId, request.body);
    return reply.status(201).send(formatSuccess(data, "BOM recipe created successfully"));
  }

  async updateBom(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params;
    const data = await masterDataService.updateBom(request.user?.tenantId, id, request.body);
    return reply.send(formatSuccess(data, "BOM recipe updated successfully"));
  }

  async deleteBom(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params;
    const data = await masterDataService.deleteBom(request.user?.tenantId, id);
    return reply.send(formatSuccess(data, "BOM recipe deleted successfully"));
  }


  async getAssets(request: FastifyRequest<{ Querystring: { plantId?: string } }>, reply: FastifyReply) {
    const data = await masterDataService.listAssets(request.user?.tenantId, request.query.plantId || request.user?.plantId);
    return reply.send(formatSuccess(data));
  }

  async getStaff(request: FastifyRequest<{ Querystring: { plantId?: string } }>, reply: FastifyReply) {
    const data = await masterDataService.listStaff(request.user?.tenantId, request.query.plantId || request.user?.plantId);
    return reply.send(formatSuccess(data));
  }

  async getQualitySpecs(request: FastifyRequest, reply: FastifyReply) {
    const data = await masterDataService.listQualitySpecs(request.user?.tenantId);
    return reply.send(formatSuccess(data));
  }

  // ==========================================
  // 15. LABOUR STANDARDS
  // ==========================================
  async getLabourStandards(request: FastifyRequest, reply: FastifyReply) {
    const data = await masterDataService.listLabourStandards(request.user?.tenantId);
    return reply.send(formatSuccess(data));
  }

  async createLabourStandard(request: FastifyRequest, reply: FastifyReply) {
    const data = await masterDataService.createLabourStandard(request.user?.tenantId, request.body);
    return reply.status(201).send(formatSuccess(data, "Labour standard created successfully"));
  }

  async updateLabourStandard(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params;
    const data = await masterDataService.updateLabourStandard(request.user?.tenantId, id, request.body);
    return reply.send(formatSuccess(data, "Labour standard updated successfully"));
  }

  async deleteLabourStandard(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const { id } = request.params;
    const data = await masterDataService.deleteLabourStandard(request.user?.tenantId, id);
    return reply.send(formatSuccess(data, "Labour standard deleted successfully"));
  }
}

export const masterDataController = new MasterDataController();

