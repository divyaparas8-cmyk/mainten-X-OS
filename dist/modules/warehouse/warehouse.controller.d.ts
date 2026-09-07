import { FastifyReply, FastifyRequest } from "fastify";
export declare class WarehouseController {
    getLots(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    createLot(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    recordTransaction(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    getWarehouses(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    getBins(request: FastifyRequest<{
        Querystring: {
            warehouseId?: string;
        };
    }>, reply: FastifyReply): Promise<never>;
}
export declare const warehouseController: WarehouseController;
//# sourceMappingURL=warehouse.controller.d.ts.map