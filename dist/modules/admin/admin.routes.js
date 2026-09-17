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
    fastify.put("/users/:id", {
        schema: {
            tags: ["System Administration"],
            summary: "Edit Enterprise User Details",
        },
    }, admin_controller_js_1.adminController.editUser.bind(admin_controller_js_1.adminController));
    fastify.delete("/users/:id", {
        schema: {
            tags: ["System Administration"],
            summary: "Delete Enterprise User Account",
        },
    }, admin_controller_js_1.adminController.deleteUser.bind(admin_controller_js_1.adminController));
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
    fastify.put("/invitations/:id", {
        schema: {
            tags: ["System Administration"],
            summary: "Update User Invitation (Role, Department, Status, Email)",
        },
    }, admin_controller_js_1.adminController.updateInvitation.bind(admin_controller_js_1.adminController));
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
    fastify.post("/activity", {
        schema: {
            tags: ["System Administration"],
            summary: "Create New Audit Activity Log",
        },
    }, admin_controller_js_1.adminController.createActivityLog.bind(admin_controller_js_1.adminController));
    fastify.put("/activity/:id", {
        schema: {
            tags: ["System Administration"],
            summary: "Update Audit Activity Log",
        },
    }, admin_controller_js_1.adminController.updateActivityLog.bind(admin_controller_js_1.adminController));
    fastify.delete("/activity/:id", {
        schema: {
            tags: ["System Administration"],
            summary: "Delete Audit Activity Log",
        },
    }, admin_controller_js_1.adminController.deleteActivityLog.bind(admin_controller_js_1.adminController));
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
    fastify.put("/roles/:id", {
        schema: {
            tags: ["System Administration"],
            summary: "Update Enterprise RBAC Role",
        },
    }, admin_controller_js_1.adminController.updateRole.bind(admin_controller_js_1.adminController));
    fastify.delete("/roles/:id", {
        schema: {
            tags: ["System Administration"],
            summary: "Delete Enterprise RBAC Role",
        },
    }, admin_controller_js_1.adminController.deleteRole.bind(admin_controller_js_1.adminController));
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
    fastify.post("/approval-rules", {
        schema: {
            tags: ["System Administration"],
            summary: "Create Electronic Approval Governance Rule",
        },
    }, admin_controller_js_1.adminController.createApprovalRule.bind(admin_controller_js_1.adminController));
    fastify.put("/approval-rules/:id", {
        schema: {
            tags: ["System Administration"],
            summary: "Update Electronic Approval Governance Rule",
        },
    }, admin_controller_js_1.adminController.updateApprovalRule.bind(admin_controller_js_1.adminController));
    fastify.delete("/approval-rules/:id", {
        schema: {
            tags: ["System Administration"],
            summary: "Delete Electronic Approval Governance Rule",
        },
    }, admin_controller_js_1.adminController.deleteApprovalRule.bind(admin_controller_js_1.adminController));
    fastify.get("/data-health/scan", {
        schema: {
            tags: ["System Administration"],
            summary: "Scan All Master Data Tables for Anomalies — Missing, Duplicates, Stale, Invalid, Broken",
        },
    }, admin_controller_js_1.adminController.scanDataHealth.bind(admin_controller_js_1.adminController));
    fastify.post("/data-health/remediate", {
        schema: {
            tags: ["System Administration"],
            summary: "Remediate Data Health Anomaly in Database",
        },
    }, admin_controller_js_1.adminController.remediateDataHealth.bind(admin_controller_js_1.adminController));
    fastify.post("/data-health/delete", {
        schema: {
            tags: ["System Administration"],
            summary: "Delete Data Health Anomaly Record",
        },
    }, admin_controller_js_1.adminController.deleteDataHealth.bind(admin_controller_js_1.adminController));
    fastify.post("/data-health/:category", {
        schema: {
            tags: ["System Administration"],
            summary: "Create Data Health Record in Database",
        },
    }, admin_controller_js_1.adminController.createDataHealth.bind(admin_controller_js_1.adminController));
    fastify.put("/data-health/:category/:id", {
        schema: {
            tags: ["System Administration"],
            summary: "Update Data Health Record in Database",
        },
    }, admin_controller_js_1.adminController.updateDataHealth.bind(admin_controller_js_1.adminController));
    fastify.delete("/data-health/:category/:id", {
        schema: {
            tags: ["System Administration"],
            summary: "Delete Data Health Record from Database",
        },
    }, admin_controller_js_1.adminController.deleteDataHealth.bind(admin_controller_js_1.adminController));
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
    fastify.put("/integrations/erp", {
        schema: {
            tags: ["System Administration"],
            summary: "Update SAP S/4HANA ERP Connection Parameters",
        },
    }, admin_controller_js_1.adminController.updateERPConfig.bind(admin_controller_js_1.adminController));
    fastify.post("/integrations/erp/sync", {
        schema: {
            tags: ["System Administration"],
            summary: "Trigger Immediate Synchronization with SAP S/4HANA ERP",
        },
    }, admin_controller_js_1.adminController.syncERP.bind(admin_controller_js_1.adminController));
    fastify.get("/integrations/erp/events", {
        schema: {
            tags: ["System Administration"],
            summary: "Get Recent ERP Synchronization Events",
        },
    }, admin_controller_js_1.adminController.getERPEvents.bind(admin_controller_js_1.adminController));
    fastify.delete("/integrations/erp/events/:id", {
        schema: {
            tags: ["System Administration"],
            summary: "Delete ERP Synchronization Event",
        },
    }, admin_controller_js_1.adminController.deleteERPEvent.bind(admin_controller_js_1.adminController));
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
    fastify.put("/integrations/apis/:id", {
        schema: {
            tags: ["System Administration"],
            summary: "Update Enterprise Integration API Key",
        },
    }, admin_controller_js_1.adminController.updateApiKey.bind(admin_controller_js_1.adminController));
    fastify.delete("/integrations/apis/:id", {
        schema: {
            tags: ["System Administration"],
            summary: "Revoke Enterprise Integration API Key",
        },
    }, admin_controller_js_1.adminController.revokeApiKey.bind(admin_controller_js_1.adminController));
    // ── 8. SECURITY POLICIES ──────────────────────────────────────────
    fastify.get("/security/policies", {
        schema: {
            tags: ["System Administration"],
            summary: "Get Enterprise Security & Authentication Policies",
        },
    }, admin_controller_js_1.adminController.getSecurityPolicies.bind(admin_controller_js_1.adminController));
    fastify.post("/security/policies", {
        schema: {
            tags: ["System Administration"],
            summary: "Save Enterprise Security & Authentication Policies",
        },
    }, admin_controller_js_1.adminController.saveSecurityPolicies.bind(admin_controller_js_1.adminController));
    // ── 9. SYSTEM CONFIGURATION ───────────────────────────────────────
    fastify.get("/config", {
        schema: {
            tags: ["System Administration"],
            summary: "Get Global System Parameters & Configuration",
        },
    }, admin_controller_js_1.adminController.getSystemConfig.bind(admin_controller_js_1.adminController));
    fastify.post("/config", {
        schema: {
            tags: ["System Administration"],
            summary: "Save Global System Parameters & Configuration",
        },
    }, admin_controller_js_1.adminController.saveSystemConfig.bind(admin_controller_js_1.adminController));
    // ── 10. AUDIT LOGS ────────────────────────────────────────────────
    fastify.get("/audit-logs", {
        schema: {
            tags: ["System Administration"],
            summary: "Get Master Governance Audit Ledger",
        },
    }, admin_controller_js_1.adminController.getAuditLogs.bind(admin_controller_js_1.adminController));
    fastify.post("/audit-logs", {
        schema: {
            tags: ["System Administration"],
            summary: "Create Audit Log Record",
        },
    }, admin_controller_js_1.adminController.createAuditLog.bind(admin_controller_js_1.adminController));
    fastify.patch("/audit-logs/:id", {
        schema: {
            tags: ["System Administration"],
            summary: "Update Audit Log Record",
        },
    }, admin_controller_js_1.adminController.updateAuditLog.bind(admin_controller_js_1.adminController));
    fastify.delete("/audit-logs/:id", {
        schema: {
            tags: ["System Administration"],
            summary: "Delete Audit Log Record",
        },
    }, admin_controller_js_1.adminController.deleteAuditLog.bind(admin_controller_js_1.adminController));
    // ── 7. DATA REMEDIATION ───────────────────────────────────────────
    fastify.get("/data-health/remediation-log", {
        schema: {
            tags: ["System Administration"],
            summary: "Get Self-Healing Execution Log",
        },
    }, admin_controller_js_1.adminController.getRemediationLog.bind(admin_controller_js_1.adminController));
    fastify.post("/data-health/execute-remediation", {
        schema: {
            tags: ["System Administration"],
            summary: "Execute Automated Data Remediation Engine",
        },
    }, admin_controller_js_1.adminController.executeRemediationEngine.bind(admin_controller_js_1.adminController));
    fastify.delete("/data-health/remediation-log/:id", {
        schema: {
            tags: ["System Administration"],
            summary: "Delete Remediation Execution Log Item",
        },
    }, admin_controller_js_1.adminController.deleteRemediationLog.bind(admin_controller_js_1.adminController));
    fastify.post("/data-health/remediation-log", {
        schema: {
            tags: ["System Administration"],
            summary: "Create Remediation Execution Log Item in Database",
        },
    }, admin_controller_js_1.adminController.createRemediationLog.bind(admin_controller_js_1.adminController));
    fastify.put("/data-health/remediation-log/:id", {
        schema: {
            tags: ["System Administration"],
            summary: "Update Remediation Execution Log Item in Database",
        },
    }, admin_controller_js_1.adminController.updateRemediationLog.bind(admin_controller_js_1.adminController));
    // ── 11. DATA MIGRATION ────────────────────────────────────────────
    fastify.get("/migration/batches", {
        schema: {
            tags: ["System Administration"],
            summary: "Get Migration Ingestion Batches",
        },
    }, admin_controller_js_1.adminController.getMigrationBatches.bind(admin_controller_js_1.adminController));
    fastify.post("/migration/batches", {
        schema: {
            tags: ["System Administration"],
            summary: "Create or Ingest Migration Batch",
        },
    }, admin_controller_js_1.adminController.createMigrationBatch.bind(admin_controller_js_1.adminController));
    fastify.put("/migration/batches/:id", {
        schema: {
            tags: ["System Administration"],
            summary: "Update Migration Batch Record",
        },
    }, admin_controller_js_1.adminController.updateMigrationBatch.bind(admin_controller_js_1.adminController));
    fastify.post("/migration/execute", {
        schema: {
            tags: ["System Administration"],
            summary: "Execute and Commit Migration Batch",
        },
    }, admin_controller_js_1.adminController.executeMigrationBatch.bind(admin_controller_js_1.adminController));
    fastify.delete("/migration/batches/:id", {
        schema: {
            tags: ["System Administration"],
            summary: "Delete Migration Batch Record",
        },
    }, admin_controller_js_1.adminController.deleteMigrationBatch.bind(admin_controller_js_1.adminController));
    // ── 12. SYSTEM REPORTS ────────────────────────────────────────────
    fastify.get("/system-reports", {
        schema: {
            tags: ["System Administration"],
            summary: "Get System Governance & Infrastructure Reports Metrics",
        },
    }, admin_controller_js_1.adminController.getSystemReports.bind(admin_controller_js_1.adminController));
    fastify.get("/system-reports/items", {
        schema: {
            tags: ["System Administration"],
            summary: "Get Saved System Governance Reports",
        },
    }, admin_controller_js_1.adminController.getSystemGovernanceReports.bind(admin_controller_js_1.adminController));
    fastify.post("/system-reports/items", {
        schema: {
            tags: ["System Administration"],
            summary: "Create Saved System Governance Report Snapshot",
        },
    }, admin_controller_js_1.adminController.createSystemReport.bind(admin_controller_js_1.adminController));
    fastify.put("/system-reports/items/:id", {
        schema: {
            tags: ["System Administration"],
            summary: "Update Saved System Governance Report Snapshot",
        },
    }, admin_controller_js_1.adminController.updateSystemReport.bind(admin_controller_js_1.adminController));
    fastify.delete("/system-reports/items/:id", {
        schema: {
            tags: ["System Administration"],
            summary: "Delete Saved System Governance Report Snapshot",
        },
    }, admin_controller_js_1.adminController.deleteSystemReport.bind(admin_controller_js_1.adminController));
    fastify.post("/system-reports/export", {
        schema: {
            tags: ["System Administration"],
            summary: "Export Executive System Health & Compliance Report",
        },
    }, admin_controller_js_1.adminController.exportSystemReport.bind(admin_controller_js_1.adminController));
}
