import { FastifyReply, FastifyRequest, FastifyInstance } from "fastify";
import { db } from "../../config/database.js";
import { notifications } from "../../db/schema/common.js";
import { eq, desc } from "drizzle-orm";
import { formatSuccess } from "../../shared/utils/responseFormatter.js";
import { authenticate } from "../../middleware/authenticate.js";

export class NotificationsController {
  async list(request: FastifyRequest, reply: FastifyReply) {
    const data = await db
      .select()
      .from(notifications)
      .where(eq(notifications.tenantId, request.user.tenantId))
      .orderBy(desc(notifications.createdAt))
      .limit(50);

    return reply.send(formatSuccess(data));
  }

  async markAsRead(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, request.params.id));
    return reply.send(formatSuccess({ markedRead: true }));
  }
}

export const notificationsController = new NotificationsController();

export async function notificationsRoutes(fastify: FastifyInstance) {
  fastify.addHook("preHandler", authenticate);
  fastify.get("/", { schema: { tags: ["Notifications"], summary: "List User Notifications" } }, notificationsController.list.bind(notificationsController));
  fastify.patch("/:id/read", { schema: { tags: ["Notifications"], summary: "Mark Notification as Read" } }, notificationsController.markAsRead.bind(notificationsController));
}
