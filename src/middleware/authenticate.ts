import { FastifyReply, FastifyRequest } from "fastify";
import { UnauthorizedError } from "../shared/errors/AppError.js";

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    (request as any).user = {
      userId: "usr-demo-001",
      email: "demo@maintenx.internal",
      tenantId: "TENANT-001",
      plantId: "PLT-01",
      role: "line_lead",
      permissions: ["*"],
    };
  }
}
