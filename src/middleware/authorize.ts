import { FastifyReply, FastifyRequest } from "fastify";
import { ForbiddenError } from "../shared/errors/AppError.js";
import { db } from "../config/database.js";
import { roles, permissions, rolePermissions } from "../db/schema/index.js";
import { eq, or } from "drizzle-orm";

export function authorize(requiredPermission: string | string[]) {
  return async (request: FastifyRequest, _reply: FastifyReply) => {
    const user = (request as any).user;

    if (!user) {
      throw new ForbiddenError("User context not found");
    }

    // Master Admin & System Admin bypass all checks
    if (
      user.isMasterAdmin ||
      user.role === "master_admin" ||
      user.role === "admin" ||
      user.role === "super_admin" ||
      user.role === "system_admin"
    ) {
      return;
    }

    const required = Array.isArray(requiredPermission) ? requiredPermission : [requiredPermission];

    // 1. Check live permissions from PostgreSQL for user's role
    try {
      const userRoleCode = user.role || "";
      const userRoleId = user.roleId || "";

      const dbRolePerms = await db
        .select({
          code: permissions.code,
          module: permissions.module,
          action: permissions.action,
        })
        .from(rolePermissions)
        .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
        .innerJoin(roles, eq(rolePermissions.roleId, roles.id))
        .where(
          or(
            eq(roles.code, userRoleCode),
            eq(roles.id, userRoleId || userRoleCode),
            userRoleCode === "qa_manager" ? eq(roles.code, "quality") : undefined,
            userRoleCode === "quality" ? eq(roles.code, "qa_manager") : undefined
          )
        );

      const activeCodes = new Set(
        dbRolePerms.flatMap((rp) => [
          rp.code.toLowerCase(),
          `${rp.module.toLowerCase().replace(/[^a-z0-9]/g, "_")}.${rp.action.toLowerCase()}`,
          `${rp.module.toLowerCase()}:::${rp.action.toLowerCase()}`,
        ])
      );

      const hasDbPermission = required.some((req) => {
        const reqLower = req.toLowerCase();
        return activeCodes.has(reqLower) || activeCodes.has("*");
      });

      if (hasDbPermission) {
        return;
      }
    } catch (e: any) {
      console.warn("authorize DB check warning:", e.message);
    }

    // 2. Fallback to user.permissions in token
    const userPermissions = (user.permissions || []).map((p: string) => p.toLowerCase());
    const hasTokenPermission = required.some((perm) => {
      const pLower = perm.toLowerCase();
      return userPermissions.includes(pLower) || userPermissions.includes("*");
    });

    if (hasTokenPermission) {
      return;
    }

    throw new ForbiddenError(`Access denied: Missing required permission [${required.join(" | ")}]`);
  };
}

export function authorizeRoles(allowedRoles: string[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const user = request.user;
    if (!user) throw new ForbiddenError("User context not found");

    if (
      user.isMasterAdmin ||
      user.role === "master_admin" ||
      user.role === "super_admin" ||
      user.role === "admin" ||
      user.role === "system_admin" ||
      allowedRoles.includes(user.role)
    ) {
      return;
    }

    throw new ForbiddenError(`Access denied for role [${user.role}]. Required: [${allowedRoles.join(", ")}]`);
  };
}
