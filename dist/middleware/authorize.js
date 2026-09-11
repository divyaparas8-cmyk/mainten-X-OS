"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = authorize;
exports.authorizeRoles = authorizeRoles;
const AppError_js_1 = require("../shared/errors/AppError.js");
function authorize(requiredPermission) {
    return async (request, reply) => {
        const user = request.user;
        if (!user) {
            throw new AppError_js_1.ForbiddenError("User context not found");
        }
        // Master Admin bypasses all checks
        if (user.isMasterAdmin || user.role === "master_admin" || user.role === "admin") {
            return;
        }
        const userPermissions = user.permissions || [];
        const required = Array.isArray(requiredPermission) ? requiredPermission : [requiredPermission];
        const hasPermission = required.some((perm) => userPermissions.includes(perm) || userPermissions.includes("*"));
        if (!hasPermission) {
            throw new AppError_js_1.ForbiddenError(`Access denied: Missing required permission [${required.join(" | ")}]`);
        }
    };
}
function authorizeRoles(allowedRoles) {
    return async (request, reply) => {
        const user = request.user;
        if (!user)
            throw new AppError_js_1.ForbiddenError("User context not found");
        if (user.isMasterAdmin || allowedRoles.includes(user.role)) {
            return;
        }
        throw new AppError_js_1.ForbiddenError(`Access denied for role [${user.role}]. Required: [${allowedRoles.join(", ")}]`);
    };
}
//# sourceMappingURL=authorize.js.map