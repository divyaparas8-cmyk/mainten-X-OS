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
    getSkus(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    createSku(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    getBoms(request: FastifyRequest, reply: FastifyReply): Promise<never>;
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
}
export declare const masterDataController: MasterDataController;
//# sourceMappingURL=masterData.controller.d.ts.map