import { FastifyInstance } from "fastify";
import { authController } from "./auth.controller.js";
import { authenticate } from "../../middleware/authenticate.js";

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/login",
    {
      schema: {
        tags: ["Authentication"],
        summary: "User login and JWT token issue",
        description: "Authenticate using email and password to receive JWT session token.",
      },
    },
    authController.login.bind(authController)
  );

  fastify.get(
    "/me",
    {
      preHandler: [authenticate],
      schema: {
        tags: ["Authentication"],
        summary: "Get current authenticated user profile",
        security: [{ bearerAuth: [] }],
      },
    },
    authController.me.bind(authController)
  );

  fastify.post(
    "/sign-off",
    {
      preHandler: [authenticate],
      schema: {
        tags: ["Authentication"],
        summary: "21 CFR Part 11 Electronic Digital Signature Verification",
        description: "Validates user's secret digital PIN for electronic batch record signing.",
        security: [{ bearerAuth: [] }],
      },
    },
    authController.digitalSignOff.bind(authController)
  );

  fastify.post(
    "/logout",
    {
      schema: {
        tags: ["Authentication"],
        summary: "Logout user session",
      },
    },
    authController.logout.bind(authController)
  );
}
