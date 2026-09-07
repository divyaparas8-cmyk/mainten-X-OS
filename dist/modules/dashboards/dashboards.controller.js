"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardsController = exports.DashboardsController = void 0;
const dashboards_service_js_1 = require("./dashboards.service.js");
const responseFormatter_js_1 = require("../../shared/utils/responseFormatter.js");
class DashboardsController {
    async getCommandCenter(request, reply) {
        const data = await dashboards_service_js_1.dashboardsService.getPlantManagerCommandCenter(request.user.tenantId, request.user.plantId);
        return reply.send((0, responseFormatter_js_1.formatSuccess)(data));
    }
}
exports.DashboardsController = DashboardsController;
exports.dashboardsController = new DashboardsController();
//# sourceMappingURL=dashboards.controller.js.map