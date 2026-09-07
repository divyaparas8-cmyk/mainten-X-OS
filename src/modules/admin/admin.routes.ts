import { FastifyInstance } from "fastify";
import { adminController } from "./admin.controller.js";
import { authenticate } from "../../middleware/authenticate.js";

export async function adminRoutes(fastify: FastifyInstance) {
  // Allow optional authentication so dashboard works smoothly in both demo & secured modes
  fastify.get(
    "/dashboard",
    {
      schema: {
        tags: ["System Administration"],
        summary: "Get System Administrator Command Dashboard Metrics",
      },
    },
    adminController.getDashboard.bind(adminController)
  );

  fastify.post(
    "/health-audit",
    {
      schema: {
        tags: ["System Administration"],
        summary: "Run Comprehensive System Health Audit",
      },
    },
    adminController.runHealthAudit.bind(adminController)
  );

  fastify.get(
    "/health-audit",
    {
      schema: {
        tags: ["System Administration"],
        summary: "Get System Health Audit Report",
      },
    },
    adminController.runHealthAudit.bind(adminController)
  );

  fastify.post(
    "/users/provision",
    {
      schema: {
        tags: ["System Administration"],
        summary: "Provision New Enterprise User Account",
      },
    },
    adminController.provisionUser.bind(adminController)
  );

  fastify.get(
    "/users",
    {
      schema: {
        tags: ["System Administration"],
        summary: "Get All Registered Enterprise Users",
      },
    },
    adminController.getUsers.bind(adminController)
  );
}
