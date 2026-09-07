"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationsController = exports.NotificationsController = void 0;
exports.notificationsRoutes = notificationsRoutes;
const database_js_1 = require("../../config/database.js");
const common_js_1 = require("../../db/schema/common.js");
const drizzle_orm_1 = require("drizzle-orm");
const responseFormatter_js_1 = require("../../shared/utils/responseFormatter.js");
const authenticate_js_1 = require("../../middleware/authenticate.js");
class NotificationsController {
    async list(request, reply) {
        const data = await database_js_1.db
            .select()
            .from(common_js_1.notifications)
            .where((0, drizzle_orm_1.eq)(common_js_1.notifications.tenantId, request.user.tenantId))
            .orderBy((0, drizzle_orm_1.desc)(common_js_1.notifications.createdAt))
            .limit(50);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
    async markAsRead(request, reply) {
        await database_js_1.db.update(common_js_1.notifications).set({ isRead: true }).where((0, drizzle_orm_1.eq)(common_js_1.notifications.id, request.params.id));
        return reply.send((0, responseFormatter_js_1.formatSuccess)({ markedRead: true }));
    }
}
exports.NotificationsController = NotificationsController;
exports.notificationsController = new NotificationsController();
async function notificationsRoutes(fastify) {
    fastify.addHook("preHandler", authenticate_js_1.authenticate);
    fastify.get("/", { schema: { tags: ["Notifications"], summary: "List User Notifications" } }, exports.notificationsController.list.bind(exports.notificationsController));
    fastify.patch("/:id/read", { schema: { tags: ["Notifications"], summary: "Mark Notification as Read" } }, exports.notificationsController.markAsRead.bind(exports.notificationsController));
}
//# sourceMappingURL=notifications.routes.js.map