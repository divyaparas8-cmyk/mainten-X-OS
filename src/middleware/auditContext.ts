import { db } from "../config/database.js";
import { auditLogs } from "../db/schema/audit.js";

export async function logAuditTrail(params: {
  tenantId: string;
  plantId?: string;
  userId?: string;
  action: string;
  entityType: string;
  entityId: string;
  oldValues?: any;
  newValues?: any;
  ipAddress?: string;
  userAgent?: string;
}) {
  try {
    await db.insert(auditLogs).values({
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
  } catch (error) {
    console.error("⚠️ Audit log generation failed:", (error as Error).message);
  }
}
