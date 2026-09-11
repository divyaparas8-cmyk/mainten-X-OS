import { FastifyReply, FastifyRequest } from "fastify";
export declare class MasterDataController {
    getCompanies(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    createCompany(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    updateCompany(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    deleteCompany(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    getPlants(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    createPlant(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    updatePlant(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    deletePlant(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    getDepartments(request: FastifyRequest<{
        Querystring: {
            plantId?: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    createDepartment(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    updateDepartment(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    deleteDepartment(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    getLines(request: FastifyRequest<{
        Querystring: {
            plantId?: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    createLine(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    updateLine(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    deleteLine(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    getWorkCenters(request: FastifyRequest<{
        Querystring: {
            plantId?: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    createWorkCenter(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    updateWorkCenter(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    deleteWorkCenter(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    getOperations(request: FastifyRequest<{
        Querystring: {
            department?: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    createOperation(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    updateOperation(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    deleteOperation(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    getRoutings(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    getRoutingById(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    createRouting(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    updateRouting(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    updateRoutingStatus(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    deleteRouting(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    getProductFamilies(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    createProductFamily(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    updateProductFamily(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    deleteProductFamily(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    getUoms(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    createUom(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    updateUom(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    deleteUom(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    getPackConfigs(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    createPackConfig(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    updatePackConfig(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    deletePackConfig(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    getLineTargets(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    createLineTarget(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    updateLineTarget(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    deleteLineTarget(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    getChangeoverRules(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    createChangeoverRule(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    updateChangeoverRule(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    deleteChangeoverRule(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    getSanitationClasses(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    createSanitationClass(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    updateSanitationClass(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    deleteSanitationClass(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    getAllergenRules(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    createAllergenRule(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    updateAllergenRule(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    deleteAllergenRule(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    getSkus(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    createSku(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    updateSku(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    deleteSku(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    getBoms(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    createBom(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    updateBom(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    deleteBom(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    getAssets(request: FastifyRequest<{
        Querystring: {
            plantId?: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    getStaff(request: FastifyRequest<{
        Querystring: {
            plantId?: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    getQualitySpecs(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    getLabourStandards(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    createLabourStandard(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    updateLabourStandard(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    deleteLabourStandard(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
}
export declare const masterDataController: MasterDataController;
//# sourceMappingURL=masterData.controller.d.ts.map