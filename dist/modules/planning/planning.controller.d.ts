import { FastifyReply, FastifyRequest } from "fastify";
export declare class PlanningController {
    getCustomerOrders(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    createCustomerOrder(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    updateCustomerOrder(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    deleteCustomerOrder(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    runForecast(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    getApsSchedules(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    createApsSchedule(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    getMrpExplosion(request: FastifyRequest, reply: FastifyReply): Promise<never>;
}
export declare const planningController: PlanningController;
//# sourceMappingURL=planning.controller.d.ts.map