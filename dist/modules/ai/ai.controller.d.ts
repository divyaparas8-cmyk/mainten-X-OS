import { FastifyReply, FastifyRequest } from "fastify";
export declare class AIController {
    getInsights(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    approveInsight(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    rejectInsight(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    chat(request: FastifyRequest, reply: FastifyReply): Promise<never>;
}
export declare const aiController: AIController;
//# sourceMappingURL=ai.controller.d.ts.map