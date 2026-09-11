"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logAuditTrail = logAuditTrail;
const database_js_1 = require("../config/database.js");
const audit_js_1 = require("../db/schema/audit.js");
async function logAuditTrail(params) {
    try {
        await database_js_1.db.insert(audit_js_1.auditLogs).values({
            tenantId: params.tenantId,
            plantId: params.plantId,
            userId: params.userId,
            action: params.action,
            entityType: params.entityType,
            entityId: params.entityId,
            oldValues: params.oldValues || null,
            newValues: params.newValues || null,
            ipAddress: params.ipAddress || null,
            userAgent: params.userAgent || null,
        });
    }
    catch (error) {
        console.error("⚠️ Audit log generation failed:", error.message);
    }
}
//# sourceMappingURL=auditContext.js.map