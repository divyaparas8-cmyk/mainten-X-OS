import { FastifyReply, FastifyRequest } from "fastify";
import { ForbiddenError } from "../shared/errors/AppError.js";

export function authorize(requiredPermission: string | string[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const user = request.user;

    if (!user) {
      throw new ForbiddenError("User context not found");
    }

    // Master Admin bypasses all checks
    if (user.isMasterAdmin || user.role === "master_admin" || user.role === "admin") {
      return;
    }

    const userPermissions = user.permissions || [];
    const required = Array.isArray(requiredPermission) ? requiredPermission : [requiredPermission];

    const hasPermission = required.some((perm) => userPermissions.includes(perm) || userPermissions.includes("*"));

    if (!hasPermission) {
      throw new ForbiddenError(`Access denied: Missing required permission [${required.join(" | ")}]`);
    }
  };
}

export function authorizeRoles(allowedRoles: string[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const user = request.user;
    if (!user) throw new ForbiddenError("User context not found");

    if (user.isMasterAdmin || allowedRoles.includes(user.role)) {
      return;
    }

    throw new ForbiddenError(`Access denied for role [${user.role}]. Required: [${allowedRoles.join(", ")}]`);
  };
}
