import { FastifyReply, FastifyRequest } from "fastify";
import { UnauthorizedError } from "../shared/errors/AppError.js";

export async function tenantContext(request: FastifyRequest, reply: FastifyReply) {
  const user = request.user;
  if (!user || !user.tenantId) {
    throw new UnauthorizedError("Tenant context missing from session");
  }
}
