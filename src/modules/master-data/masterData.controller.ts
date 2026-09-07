import { FastifyReply, FastifyRequest } from "fastify";
import { masterDataService } from "./masterData.service.js";
import { createSkuSchema } from "./masterData.schema.js";
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
  // SKUs, BOMs, ASSETS, STAFF, SPECS
  // ==========================================
  async getSkus(request: FastifyRequest, reply: FastifyReply) {
    const data = await masterDataService.listSkus(request.user?.tenantId);
    return reply.send(formatSuccess(data));
  }

  async createSku(request: FastifyRequest, reply: FastifyReply) {
    const input = createSkuSchema.parse(request.body);
    const data = await masterDataService.createSku(request.user?.tenantId, input);
    return reply.status(201).send(formatSuccess(data, "SKU created successfully"));
  }

  async getBoms(request: FastifyRequest, reply: FastifyReply) {
    const data = await masterDataService.listBoms(request.user?.tenantId);
    return reply.send(formatSuccess(data));
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
}

export const masterDataController = new MasterDataController();

