"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRoutes = adminRoutes;
const admin_controller_js_1 = require("./admin.controller.js");
const authenticate_js_1 = require("../../middleware/authenticate.js");
async function adminRoutes(fastify) {
    fastify.addHook("preHandler", authenticate_js_1.authenticate);
    // Allow optional authentication so dashboard & management work seamlessly in both demo & live modes
    fastify.get("/dashboard", {
        schema: {
            tags: ["System Administration"],
            summary: "Get System Administrator Command Dashboard Metrics",
        },
    }, admin_controller_js_1.adminController.getDashboard.bind(admin_controller_js_1.adminController));
    fastify.post("/health-audit", {
        schema: {
            tags: ["System Administration"],
            summary: "Run Comprehensive System Health Audit",
        },
    }, admin_controller_js_1.adminController.runHealthAudit.bind(admin_controller_js_1.adminController));
    fastify.get("/health-audit", {
        schema: {
            tags: ["System Administration"],
            summary: "Get System Health Audit Report",
        },
    }, admin_controller_js_1.adminController.runHealthAudit.bind(admin_controller_js_1.adminController));
    // Users Directory & Provisioning
    fastify.post("/users/provision", {
        schema: {
            tags: ["System Administration"],
            summary: "Provision New Enterprise User Account",
        },
    }, admin_controller_js_1.adminController.provisionUser.bind(admin_controller_js_1.adminController));
    fastify.get("/users", {
        schema: {
            tags: ["System Administration"],
            summary: "Get All Registered Enterprise Users",
        },
    }, admin_controller_js_1.adminController.getUsers.bind(admin_controller_js_1.adminController));
    // User Status & Lifecycle
    fastify.put("/users/:id/status", {
        schema: {
            tags: ["System Administration"],
            summary: "Update User Account Lockout / Active Status",
        },
    }, admin_controller_js_1.adminController.updateUserStatus.bind(admin_controller_js_1.adminController));
    fastify.post("/users/bulk-status", {
        schema: {
            tags: ["System Administration"],
            summary: "Bulk Activate All or Emergency Lock All Users",
        },
    }, admin_controller_js_1.adminController.bulkUpdateUserStatus.bind(admin_controller_js_1.adminController));
    // User Invitations
    fastify.get("/invitations", {
        schema: {
            tags: ["System Administration"],
            summary: "Get Pending User Invitations",
        },
    }, admin_controller_js_1.adminController.getInvitations.bind(admin_controller_js_1.adminController));
    fastify.post("/invitations", {
        schema: {
            tags: ["System Administration"],
            summary: "Dispatch New Enterprise User Invitation Link",
        },
    }, admin_controller_js_1.adminController.createInvitation.bind(admin_controller_js_1.adminController));
    fastify.post("/invitations/:id/resend", {
        schema: {
            tags: ["System Administration"],
            summary: "Resend Invitation Magic Link",
        },
    }, admin_controller_js_1.adminController.resendInvitation.bind(admin_controller_js_1.adminController));
    fastify.delete("/invitations/:id", {
        schema: {
            tags: ["System Administration"],
            summary: "Revoke / Delete User Invitation",
        },
    }, admin_controller_js_1.adminController.deleteInvitation.bind(admin_controller_js_1.adminController));
    // Activity Stream & Audit Logs
    fastify.get("/activity", {
        schema: {
            tags: ["System Administration"],
            summary: "Get User Live Activity Stream & Audit Ledger",
        },
    }, admin_controller_js_1.adminController.getActivityLogs.bind(admin_controller_js_1.adminController));
    // Roles & Permissions Governance
    fastify.get("/roles", {
        schema: {
            tags: ["System Administration"],
            summary: "Get All Enterprise RBAC Roles & Assigned Counts",
        },
    }, admin_controller_js_1.adminController.getRoles.bind(admin_controller_js_1.adminController));
    fastify.post("/roles", {
        schema: {
            tags: ["System Administration"],
            summary: "Create New Custom Enterprise RBAC Role",
        },
    }, admin_controller_js_1.adminController.createRole.bind(admin_controller_js_1.adminController));
    fastify.get("/permissions/matrix", {
        schema: {
            tags: ["System Administration"],
            summary: "Get Granular RBAC Permissions Matrix Configuration",
        },
    }, admin_controller_js_1.adminController.getPermissionMatrix.bind(admin_controller_js_1.adminController));
    fastify.post("/permissions/matrix", {
        schema: {
            tags: ["System Administration"],
            summary: "Save & Synchronize RBAC Permissions Matrix Configuration",
        },
    }, admin_controller_js_1.adminController.updatePermissionMatrix.bind(admin_controller_js_1.adminController));
    fastify.post("/permissions/test", {
        schema: {
            tags: ["System Administration"],
            summary: "Simulate & Test Action Permission Access",
        },
    }, admin_controller_js_1.adminController.testPermissionAccess.bind(admin_controller_js_1.adminController));
    fastify.put("/users/:userId/role", {
        schema: {
            tags: ["System Administration"],
            summary: "Reassign User Account to Role in Registry",
        },
    }, admin_controller_js_1.adminController.updateUserRoleMapping.bind(admin_controller_js_1.adminController));
    fastify.get("/approval-rules", {
        schema: {
            tags: ["System Administration"],
            summary: "Get Electronic Approval Governance Rules",
        },
    }, admin_controller_js_1.adminController.getApprovalRules.bind(admin_controller_js_1.adminController));
    fastify.get("/data-health/scan", {
        schema: {
            tags: ["System Administration"],
            summary: "Scan All Master Data Tables for Anomalies — Missing, Duplicates, Stale, Invalid, Broken",
        },
    }, admin_controller_js_1.adminController.scanDataHealth.bind(admin_controller_js_1.adminController));
    // ── INTEGRATIONS: IOT GATEWAYS ─────────────────────────────────────
    fastify.get("/integrations/iot", {
        schema: {
            tags: ["System Administration"],
            summary: "Get All Connected Industrial IoT Gateways & Edge Brokers",
        },
    }, admin_controller_js_1.adminController.getIoTGateways.bind(admin_controller_js_1.adminController));
    fastify.post("/integrations/iot", {
        schema: {
            tags: ["System Administration"],
            summary: "Register / Provision New Industrial IoT Gateway",
        },
    }, admin_controller_js_1.adminController.createIoTGateway.bind(admin_controller_js_1.adminController));
    fastify.put("/integrations/iot/:id", {
        schema: {
            tags: ["System Administration"],
            summary: "Update Industrial IoT Gateway Configuration",
        },
    }, admin_controller_js_1.adminController.updateIoTGateway.bind(admin_controller_js_1.adminController));
    fastify.delete("/integrations/iot/:id", {
        schema: {
            tags: ["System Administration"],
            summary: "Delete / Disconnect Industrial IoT Gateway",
        },
    }, admin_controller_js_1.adminController.deleteIoTGateway.bind(admin_controller_js_1.adminController));
    fastify.post("/integrations/iot/ping", {
        schema: {
            tags: ["System Administration"],
            summary: "Ping All Industrial IoT Gateways & Check Sensor Health",
        },
    }, admin_controller_js_1.adminController.pingIoTGateways.bind(admin_controller_js_1.adminController));
    // ── INTEGRATIONS: ERP CONNECTOR ───────────────────────────────────
    fastify.get("/integrations/erp", {
        schema: {
            tags: ["System Administration"],
            summary: "Get SAP S/4HANA ERP Connector Status & Parameters",
        },
    }, admin_controller_js_1.adminController.getERPStatus.bind(admin_controller_js_1.adminController));
    fastify.post("/integrations/erp/sync", {
        schema: {
            tags: ["System Administration"],
            summary: "Trigger Immediate Synchronization with SAP S/4HANA ERP",
        },
    }, admin_controller_js_1.adminController.syncERP.bind(admin_controller_js_1.adminController));
    // ── INTEGRATIONS: BARCODE SYMBOLOGY ───────────────────────────────
    fastify.get("/integrations/barcode", {
        schema: {
            tags: ["System Administration"],
            summary: "Get Configured Barcode, QR & GS1 Symbologies",
        },
    }, admin_controller_js_1.adminController.getBarcodeFormats.bind(admin_controller_js_1.adminController));
    fastify.post("/integrations/barcode", {
        schema: {
            tags: ["System Administration"],
            summary: "Configure New Barcode / QR Symbology Standard",
        },
    }, admin_controller_js_1.adminController.createBarcodeFormat.bind(admin_controller_js_1.adminController));
    fastify.put("/integrations/barcode/:id", {
        schema: {
            tags: ["System Administration"],
            summary: "Update Barcode Symbology Configuration",
        },
    }, admin_controller_js_1.adminController.updateBarcodeFormat.bind(admin_controller_js_1.adminController));
    fastify.delete("/integrations/barcode/:id", {
        schema: {
            tags: ["System Administration"],
            summary: "Delete Barcode Symbology Configuration",
        },
    }, admin_controller_js_1.adminController.deleteBarcodeFormat.bind(admin_controller_js_1.adminController));
    // ── INTEGRATIONS: REST API KEYS ───────────────────────────────────
    fastify.get("/integrations/apis", {
        schema: {
            tags: ["System Administration"],
            summary: "Get Active Enterprise REST API & Machine Integration Keys",
        },
    }, admin_controller_js_1.adminController.getApiKeys.bind(admin_controller_js_1.adminController));
    fastify.post("/integrations/apis", {
        schema: {
            tags: ["System Administration"],
            summary: "Generate New Enterprise Integration API Key",
        },
    }, admin_controller_js_1.adminController.createApiKey.bind(admin_controller_js_1.adminController));
    fastify.delete("/integrations/apis/:id", {
        schema: {
            tags: ["System Administration"],
            summary: "Revoke Enterprise Integration API Key",
        },
    }, admin_controller_js_1.adminController.revokeApiKey.bind(admin_controller_js_1.adminController));
}
//# sourceMappingURL=admin.routes.js.map