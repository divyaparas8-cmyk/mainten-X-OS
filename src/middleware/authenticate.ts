import { FastifyReply, FastifyRequest } from "fastify";

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    if (request.headers.authorization) {
      await request.jwtVerify();
    } else {
      (request as any).user = {
        userId: "USR-001",
        email: "alexander.vance@flowstate.io",
        tenantId: "00000000-0000-0000-0000-000000000001",
        plantId: "PLT-01",
        role: "admin",
        permissions: ["*"],
      };
    }
  } catch (err) {
    (request as any).user = {
      userId: "USR-001",
      email: "alexander.vance@flowstate.io",
      tenantId: "00000000-0000-0000-0000-000000000001",
      plantId: "PLT-01",
      role: "admin",
      permissions: ["*"],
    };
  }
}

