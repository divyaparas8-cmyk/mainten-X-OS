import { FastifyReply, FastifyRequest } from "fastify";
export declare class ProductionController {
    getOrders(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    createOrder(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    updateOrderStatus(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    getBatches(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    advanceBatchStep(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    recordOperatorEntry(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    logDowntime(request: FastifyRequest, reply: FastifyReply): Promise<never>;
}
export declare const productionController: ProductionController;
//# sourceMappingURL=production.controller.d.ts.map