import { FastifyReply, FastifyRequest } from "fastify";
export declare class MasterDataController {
    getSkus(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    createSku(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    getBoms(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    getLines(request: FastifyRequest<{
        Querystring: {
            plantId?: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    getWorkCenters(request: FastifyRequest<{
        Querystring: {
            plantId?: string;
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
}
export declare const masterDataController: MasterDataController;
//# sourceMappingURL=masterData.controller.d.ts.map