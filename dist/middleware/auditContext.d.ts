export declare function logAuditTrail(params: {
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
}): Promise<void>;
//# sourceMappingURL=auditContext.d.ts.map