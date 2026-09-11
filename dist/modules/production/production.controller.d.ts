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
    verifyLot(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    completeBatch(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    qaReleaseBatch(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    recordOperatorEntry(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    logDowntime(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    getDowntime(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    getHbLogs(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    createHbLog(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    getOEE(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    getPerformance(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    getMachines(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    updateMachineStatus(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    getShiftHandoffs(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    createShiftHandoff(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    getShiftPerformance(request: FastifyRequest, reply: FastifyReply): Promise<never>;
}
export declare const productionController: ProductionController;
//# sourceMappingURL=production.controller.d.ts.map