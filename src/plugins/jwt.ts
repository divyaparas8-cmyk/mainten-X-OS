import fp from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";
import { authConfig } from "../config/auth.js";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: {
      userId: string;
      email: string;
      tenantId: string;
      plantId?: string;
      role: string;
      permissions: string[];
      isMasterAdmin?: boolean;
    };
    user: {
      userId: string;
      email: string;
      tenantId: string;
      plantId?: string;
      role: string;
      permissions: string[];
      isMasterAdmin?: boolean;
    };
  }
}

export default fp(async (fastify) => {
  await fastify.register(fastifyJwt, {
    secret: authConfig.jwtSecret,
    sign: {
      expiresIn: authConfig.jwtExpiresIn,
    },
  });
});
