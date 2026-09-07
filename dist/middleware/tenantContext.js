"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tenantContext = tenantContext;
const AppError_js_1 = require("../shared/errors/AppError.js");
async function tenantContext(request, reply) {
    const user = request.user;
    if (!user || !user.tenantId) {
        throw new AppError_js_1.UnauthorizedError("Tenant context missing from session");
    }
}
//# sourceMappingURL=tenantContext.js.map