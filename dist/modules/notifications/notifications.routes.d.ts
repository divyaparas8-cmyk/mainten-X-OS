import { FastifyReply, FastifyRequest, FastifyInstance } from "fastify";
export declare class NotificationsController {
    list(request: FastifyRequest, reply: FastifyReply): Promise<never>;
    markAsRead(request: FastifyRequest<{
        Params: {
            id: string;
        };
    }>, reply: FastifyReply): Promise<never>;
}
export declare const notificationsController: NotificationsController;
export declare function notificationsRoutes(fastify: FastifyInstance): Promise<void>;
//# sourceMappingURL=notifications.routes.d.ts.map