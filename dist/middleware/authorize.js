"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = authorize;
exports.authorizeRoles = authorizeRoles;
const AppError_js_1 = require("../shared/errors/AppError.js");
const database_js_1 = require("../config/database.js");
const index_js_1 = require("../db/schema/index.js");
const drizzle_orm_1 = require("drizzle-orm");
function authorize(requiredPermission) {
    return async (request, _reply) => {
        const user = request.user;
        if (!user) {
            throw new AppError_js_1.ForbiddenError("User context not found");
        }
        // Master Admin & System Admin bypass all checks
        if (user.isMasterAdmin ||
            user.role === "master_admin" ||
            user.role === "admin" ||
            user.role === "super_admin" ||
            user.role === "system_admin") {
            return;
        }
        const required = Array.isArray(requiredPermission) ? requiredPermission : [requiredPermission];
        // 1. Check live permissions from PostgreSQL for user's role
        try {
            const userRoleCode = user.role || "";
            const userRoleId = user.roleId || "";
            const dbRolePerms = await database_js_1.db
                .select({
                code: index_js_1.permissions.code,
                module: index_js_1.permissions.module,
                action: index_js_1.permissions.action,
            })
                .from(index_js_1.rolePermissions)
                .innerJoin(index_js_1.permissions, (0, drizzle_orm_1.eq)(index_js_1.rolePermissions.permissionId, index_js_1.permissions.id))
                .innerJoin(index_js_1.roles, (0, drizzle_orm_1.eq)(index_js_1.rolePermissions.roleId, index_js_1.roles.id))
                .where((0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(index_js_1.roles.code, userRoleCode), (0, drizzle_orm_1.eq)(index_js_1.roles.id, userRoleId || userRoleCode), userRoleCode === "qa_manager" ? (0, drizzle_orm_1.eq)(index_js_1.roles.code, "quality") : undefined, userRoleCode === "quality" ? (0, drizzle_orm_1.eq)(index_js_1.roles.code, "qa_manager") : undefined));
            const activeCodes = new Set(dbRolePerms.flatMap((rp) => [
                rp.code.toLowerCase(),
                `${rp.module.toLowerCase().replace(/[^a-z0-9]/g, "_")}.${rp.action.toLowerCase()}`,
                `${rp.module.toLowerCase()}:::${rp.action.toLowerCase()}`,
            ]));
            const hasDbPermission = required.some((req) => {
                const reqLower = req.toLowerCase();
                return activeCodes.has(reqLower) || activeCodes.has("*");
            });
            if (hasDbPermission) {
                return;
            }
        }
        catch (e) {
            console.warn("authorize DB check warning:", e.message);
        }
        // 2. Fallback to user.permissions in token
        const userPermissions = (user.permissions || []).map((p) => p.toLowerCase());
        const hasTokenPermission = required.some((perm) => {
            const pLower = perm.toLowerCase();
            return userPermissions.includes(pLower) || userPermissions.includes("*");
        });
        if (hasTokenPermission) {
            return;
        }
        throw new AppError_js_1.ForbiddenError(`Access denied: Missing required permission [${required.join(" | ")}]`);
    };
}
function authorizeRoles(allowedRoles) {
    return async (request, reply) => {
        const user = request.user;
        if (!user)
            throw new AppError_js_1.ForbiddenError("User context not found");
        if (user.isMasterAdmin ||
            user.role === "master_admin" ||
            user.role === "super_admin" ||
            user.role === "admin" ||
            user.role === "system_admin" ||
            allowedRoles.includes(user.role)) {
            return;
        }
        throw new AppError_js_1.ForbiddenError(`Access denied for role [${user.role}]. Required: [${allowedRoles.join(", ")}]`);
    };
}
//# sourceMappingURL=authorize.js.map