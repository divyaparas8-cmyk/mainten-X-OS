declare module "@fastify/jwt" {
    interface FastifyJWT {
        payload: {
            userId: string;
            email: string;
            tenantId: string;
            plantId?: string;
            role: string;
            permissions: string[];
            isMasterAdmin?: boolean;
        };
        user: {
            userId: string;
            email: string;
            tenantId: string;
            plantId?: string;
            role: string;
            permissions: string[];
            isMasterAdmin?: boolean;
        };
    }
}
declare const _default: (fastify: import("fastify").FastifyInstance<import("fastify").RawServerDefault, import("http").IncomingMessage, import("http").ServerResponse<import("http").IncomingMessage>, import("fastify").FastifyBaseLogger, import("fastify").FastifyTypeProviderDefault>) => Promise<void>;
export default _default;
//# sourceMappingURL=jwt.d.ts.map