import { FastifyReply, FastifyRequest } from "fastify";
export declare class IoTController {
    ingest(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    getLatest(request: FastifyRequest<{
        Querystring: {
            assetCode?: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    getHistory(request: FastifyRequest<{
        Params: {
            assetCode: string;
        };
        Querystring: {
            limit?: string;
        };
    }>, reply: FastifyReply): Promise<never>;
    stream(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    startSimulator(_request: FastifyRequest, reply: FastifyReply): Promise<never>;
    stopSimulator(_request: FastifyRequest, reply: FastifyReply): Promise<never>;
    getGateways(_request: FastifyRequest, reply: FastifyReply): Promise<never>;
}
export declare const iotController: IoTController;
//# sourceMappingURL=iot.controller.d.ts.map