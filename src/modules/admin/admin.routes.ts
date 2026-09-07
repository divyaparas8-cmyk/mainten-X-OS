import { FastifyInstance } from "fastify";
import { adminController } from "./admin.controller.js";

export async function adminRoutes(fastify: FastifyInstance) {
  // Allow optional authentication so dashboard & management work seamlessly in both demo & live modes
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

  // Users Directory & Provisioning
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

  // User Status & Lifecycle
  fastify.put(
    "/users/:id/status",
    {
      schema: {
        tags: ["System Administration"],
        summary: "Update User Account Lockout / Active Status",
      },
    },
    adminController.updateUserStatus.bind(adminController)
  );

  fastify.post(
    "/users/bulk-status",
    {
      schema: {
        tags: ["System Administration"],
        summary: "Bulk Activate All or Emergency Lock All Users",
      },
    },
    adminController.bulkUpdateUserStatus.bind(adminController)
  );

  // User Invitations
  fastify.get(
    "/invitations",
    {
      schema: {
        tags: ["System Administration"],
        summary: "Get Pending User Invitations",
      },
    },
    adminController.getInvitations.bind(adminController)
  );

  fastify.post(
    "/invitations",
    {
      schema: {
        tags: ["System Administration"],
        summary: "Dispatch New Enterprise User Invitation Link",
      },
    },
    adminController.createInvitation.bind(adminController)
  );

  fastify.post(
    "/invitations/:id/resend",
    {
      schema: {
        tags: ["System Administration"],
        summary: "Resend Invitation Magic Link",
      },
    },
    adminController.resendInvitation.bind(adminController)
  );

  fastify.delete(
    "/invitations/:id",
    {
      schema: {
        tags: ["System Administration"],
        summary: "Revoke / Delete User Invitation",
      },
    },
    adminController.deleteInvitation.bind(adminController)
  );

  // Activity Stream & Audit Logs
  fastify.get(
    "/activity",
    {
      schema: {
        tags: ["System Administration"],
        summary: "Get User Live Activity Stream & Audit Ledger",
      },
    },
    adminController.getActivityLogs.bind(adminController)
  );
}

