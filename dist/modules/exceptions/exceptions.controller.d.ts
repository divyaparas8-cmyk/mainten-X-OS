import { FastifyReply, FastifyRequest } from "fastify";
export declare class ExceptionsController {
    getExceptions(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    getException(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    createException(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    assignException(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    resolveException(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
}
export declare const exceptionsController: ExceptionsController;
//# sourceMappingURL=exceptions.controller.d.ts.map