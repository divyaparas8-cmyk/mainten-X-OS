import { FastifyReply, FastifyRequest } from "fastify";
export declare function authorize(requiredPermission: string | string[]): (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
export declare function authorizeRoles(allowedRoles: string[]): (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
//# sourceMappingURL=authorize.d.ts.map