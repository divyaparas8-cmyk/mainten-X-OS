import { FastifyReply, FastifyRequest } from "fastify";
export declare class AuthController {
    register(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    login(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    me(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    digitalSignOff(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    logout(request: FastifyRequest, reply: FastifyReply): Promise<never>;
}
export declare const authController: AuthController;
//# sourceMappingURL=auth.controller.d.ts.map