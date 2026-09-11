import { FastifyReply, FastifyRequest } from "fastify";
export declare class TraceabilityController {
    getGenealogy(request: FastifyRequest<{
        Params: {
            lotNumber: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    runRecallSimulation(request: FastifyRequest, reply: FastifyReply): Promise<never>;
}
export declare const traceabilityController: TraceabilityController;
//# sourceMappingURL=traceability.controller.d.ts.map