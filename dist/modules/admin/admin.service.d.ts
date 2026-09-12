interface InvitationRecord {
    id: string;
    tenantId?: string;
    email: string;
    role: string;
    department: string;
    invitedBy: string;
    sentDate: string;
    status: "Pending" | "Accepted" | "Revoked";
}
export declare class AdminService {
    getDashboardMetrics(tenantId?: string): Promise<{
        systemHealth: number;
        status: string;
        uptimeSeconds: number;
        dbLatencyMs: number;
        metrics: {
            totalUsers: number;
            activeUsers: number;
            rolesCount: number;
            sitesCount: number;
            linesCount: number;
            skusCount: number;
            syncedTablesCount: number;
            liveConnectors: number;
            totalConnectors: number;
            qualityIndex: number;
        };
        latencyTrend: {
            label: string;
            value: number;
        }[];
        governanceTiles: ({
            id: string;
            label: string;
            sub: string;
            path: string;
            count: number;
            status?: undefined;
        } | {
            id: string;
            label: string;
            sub: string;
            path: string;
            status: string;
            count?: undefined;
        })[];
    }>;
    runHealthAudit(tenantId?: string): Promise<{
        success: boolean;
        timestamp: string;
        auditId: string;
        overallHealth: string;
        status: string;
        checks: {
            database: {
                service: string;
                status: string;
                latencyMs: number;
                poolActive: number;
                idleConnections: number;
                waitingQueries: number;
            };
            system: {
                uptimeSeconds: number;
                memoryRssMb: number;
                heapUsedMb: number;
            };
            microservices: {
                erpConnector: {
                    name: string;
                    status: string;
                    pingMs: number;
                };
                iotEdge: {
                    name: string;
                    status: string;
                    pingMs: number;
                };
                authService: {
                    name: string;
                    status: string;
                    compliance: string;
                };
                cmmsEngine: {
                    name: string;
                    status: string;
                };
            };
            integrity: {
                totalUsers: number;
                totalPlants: number;
                totalSKUs: number;
                orphanRecords: number;
                schemaVersion: string;
            };
        };
        message: string;
    }>;
    provisionUser(tenantId: string, input: {
        name: string;
        email: string;
        role: string;
        department?: string;
        plant?: string;
        status?: string;
        password?: string;
    }): Promise<{
        id: string;
        name: string;
        email: string;
        role: any;
        roleCode: any;
        department: string;
        plant: string;
        status: string;
        lastLogin: string;
        createdAt: Date;
    }>;
    getAllUsers(tenantId?: string): Promise<any[]>;
    updateUserStatus(tenantId: string | undefined, userId: string, newStatus: string): Promise<{
        id: string;
        name: string;
        email: string;
        status: string;
        updatedAt: Date;
    } | {
        id: any;
        name: any;
        email: any;
        status: string;
        updatedAt: string;
    }>;
    bulkUpdateUserStatus(tenantId: string | undefined, action: string): Promise<{
        success: boolean;
        action: string;
        targetStatus: string;
        message: string;
    }>;
    getInvitations(tenantId?: string): Promise<InvitationRecord[]>;
    createInvitation(tenantId: string | undefined, input: {
        email: string;
        role: string;
        department?: string;
        invitedBy?: string;
    }): Promise<InvitationRecord>;
    resendInvitation(tenantId: string | undefined, invitationId: string): Promise<{
        success: boolean;
        message: string;
        invitation: InvitationRecord;
    }>;
    deleteInvitation(tenantId: string | undefined, invitationId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getActivityLogs(tenantId?: string, query?: string): Promise<any[]>;
    getRoles(tenantId?: string): Promise<any[]>;
    createRole(tenantId: string | undefined, input: {
        name: string;
        description?: string;
    }): Promise<{
        id: string;
        dbId: string;
        code: string;
        name: string;
        description: string;
        userCount: number;
        isSystem: boolean;
        createdAt: string;
    }>;
    getPermissionMatrix(tenantId?: string): Promise<{
        admin: {
            permissions: {
                "SKU Master": {
                    view: boolean;
                    create: boolean;
                    edit: boolean;
                    delete: boolean;
                    approve: boolean;
                };
                "BOM / Recipe": {
                    view: boolean;
                    create: boolean;
                    edit: boolean;
                    delete: boolean;
                    approve: boolean;
                };
                "Work Centers / Lines": {
                    view: boolean;
                    create: boolean;
                    edit: boolean;
                    delete: boolean;
                    approve: boolean;
                };
                "Machine Assets": {
                    view: boolean;
                    create: boolean;
                    edit: boolean;
                    delete: boolean;
                    approve: boolean;
                };
                "Employees & Skills": {
                    view: boolean;
                    create: boolean;
                    edit: boolean;
                    delete: boolean;
                    approve: boolean;
                };
                "Quality Specs": {
                    view: boolean;
                    create: boolean;
                    edit: boolean;
                    delete: boolean;
                    approve: boolean;
                };
                Production: {
                    view: boolean;
                    create: boolean;
                    edit: boolean;
                    delete: boolean;
                    approve: boolean;
                };
                "Maintenance & CMMS": {
                    view: boolean;
                    create: boolean;
                    edit: boolean;
                    delete: boolean;
                    approve: boolean;
                };
                "Data Migration": {
                    view: boolean;
                    create: boolean;
                    edit: boolean;
                    delete: boolean;
                    approve: boolean;
                };
                "Audit Trail": {
                    view: boolean;
                    create: boolean;
                    edit: boolean;
                    delete: boolean;
                    approve: boolean;
                };
                "Executive Reports": {
                    view: boolean;
                    create: boolean;
                    edit: boolean;
                    delete: boolean;
                    approve: boolean;
                };
            };
        };
        plant_manager: {
            permissions: {
                "SKU Master": {
                    view: boolean;
                    create: boolean;
                    edit: boolean;
                    delete: boolean;
                    approve: boolean;
                };
                "BOM / Recipe": {
                    view: boolean;
                    create: boolean;
                    edit: boolean;
                    delete: boolean;
                    approve: boolean;
                };
                "Work Centers / Lines": {
                    view: boolean;
                    create: boolean;
                    edit: boolean;
                    delete: boolean;
                    approve: boolean;
                };
                "Machine Assets": {
                    view: boolean;
                    create: boolean;
                    edit: boolean;
                    delete: boolean;
                    approve: boolean;
                };
                "Employees & Skills": {
                    view: boolean;
                    create: boolean;
                    edit: boolean;
                    delete: boolean;
                    approve: boolean;
                };
                "Quality Specs": {
                    view: boolean;
                    create: boolean;
                    edit: boolean;
                    delete: boolean;
                    approve: boolean;
                };
                Production: {
                    view: boolean;
                    create: boolean;
                    edit: boolean;
                    delete: boolean;
                    approve: boolean;
                };
                "Maintenance & CMMS": {
                    view: boolean;
                    create: boolean;
                    edit: boolean;
                    delete: boolean;
                    approve: boolean;
                };
                "Data Migration": {
                    view: boolean;
                    create: boolean;
                    edit: boolean;
                    delete: boolean;
                    approve: boolean;
                };
                "Audit Trail": {
                    view: boolean;
                    create: boolean;
                    edit: boolean;
                    delete: boolean;
                    approve: boolean;
                };
                "Executive Reports": {
                    view: boolean;
                    create: boolean;
                    edit: boolean;
                    delete: boolean;
                    approve: boolean;
                };
            };
        };
        qa_manager: {
            permissions: {
                "SKU Master": {
                    view: boolean;
                    create: boolean;
                    edit: boolean;
                    delete: boolean;
                    approve: boolean;
                };
                "BOM / Recipe": {
                    view: boolean;
                    create: boolean;
                    edit: boolean;
                    delete: boolean;
                    approve: boolean;
                };
                "Quality Specs": {
                    view: boolean;
                    create: boolean;
                    edit: boolean;
                    delete: boolean;
                    approve: boolean;
                };
                Production: {
                    view: boolean;
                    create: boolean;
                    edit: boolean;
                    delete: boolean;
                    approve: boolean;
                };
                "Audit Trail": {
                    view: boolean;
                    create: boolean;
                    edit: boolean;
                    delete: boolean;
                    approve: boolean;
                };
                "Executive Reports": {
                    view: boolean;
                    create: boolean;
                    edit: boolean;
                    delete: boolean;
                    approve: boolean;
                };
            };
        };
        maintenance: {
            permissions: {
                "Machine Assets": {
                    view: boolean;
                    create: boolean;
                    edit: boolean;
                    delete: boolean;
                    approve: boolean;
                };
                "Work Centers / Lines": {
                    view: boolean;
                    create: boolean;
                    edit: boolean;
                    delete: boolean;
                    approve: boolean;
                };
                "Maintenance & CMMS": {
                    view: boolean;
                    create: boolean;
                    edit: boolean;
                    delete: boolean;
                    approve: boolean;
                };
                Production: {
                    view: boolean;
                    create: boolean;
                    edit: boolean;
                    delete: boolean;
                    approve: boolean;
                };
                "Audit Trail": {
                    view: boolean;
                    create: boolean;
                    edit: boolean;
                    delete: boolean;
                    approve: boolean;
                };
            };
        };
        operator: {
            permissions: {
                "SKU Master": {
                    view: boolean;
                    create: boolean;
                    edit: boolean;
                    delete: boolean;
                    approve: boolean;
                };
                "BOM / Recipe": {
                    view: boolean;
                    create: boolean;
                    edit: boolean;
                    delete: boolean;
                    approve: boolean;
                };
                "Work Centers / Lines": {
                    view: boolean;
                    create: boolean;
                    edit: boolean;
                    delete: boolean;
                    approve: boolean;
                };
                Production: {
                    view: boolean;
                    create: boolean;
                    edit: boolean;
                    delete: boolean;
                    approve: boolean;
                };
                "Quality Specs": {
                    view: boolean;
                    create: boolean;
                    edit: boolean;
                    delete: boolean;
                    approve: boolean;
                };
            };
        };
    }>;
    updatePermissionMatrix(tenantId: string | undefined, input: {
        roleKey: string;
        matrix?: any;
        module?: string;
        action?: string;
        allowed?: boolean;
    }): Promise<{
        success: boolean;
        roleKey: string;
        message: string;
    }>;
    testPermissionAccess(input: {
        roleKey: string;
        module: string;
        action: string;
    }): Promise<{
        allowed: boolean;
        roleKey: string;
        module: string;
        action: string;
        message: string;
    }>;
    updateUserRoleMapping(tenantId: string | undefined, userId: string, roleNameOrCode: string): Promise<{
        success: boolean;
        userId: string;
        name: string;
        role: string;
        roleCode: string;
        message: string;
    }>;
    getApprovalRules(tenantId?: string): Promise<{
        id: string;
        event: string;
        tier: string;
        authorizedRoles: string;
        compliance: string;
    }[]>;
    scanDataHealth(tenantId?: string): Promise<{
        summary: {
            completeness: number;
            totalAnomalies: number;
            missingCount: number;
            duplicatesCount: number;
            staleCount: number;
            invalidReferencesCount: number;
            brokenRelationshipsCount: number;
            autoFixRules: number;
            integrityTarget: number;
        };
        missingData: any[];
        duplicates: any[];
        staleRecords: any[];
        invalidReferences: any[];
        brokenRelationships: any[];
    }>;
    private inMemoryIoTGateways;
    getIoTGateways(_tenantId?: string): Promise<{
        id: string;
        name: string;
        protocol: string;
        connectedNodes: number;
        telemetryRate: string;
        status: string;
    }[]>;
    createIoTGateway(tenantId: string | undefined, data: any): Promise<{
        id: any;
        name: any;
        protocol: any;
        connectedNodes: number;
        telemetryRate: any;
        status: any;
    }>;
    updateIoTGateway(tenantId: string | undefined, id: string, data: any): Promise<{
        id: string;
        name: string;
        protocol: string;
        connectedNodes: number;
        telemetryRate: string;
        status: string;
    } | undefined>;
    deleteIoTGateway(tenantId: string | undefined, id: string): Promise<{
        success: boolean;
        id: string;
    }>;
    pingIoTGateways(): Promise<{
        success: boolean;
        gatewaysCount: number;
        activeNodes: number;
        packetLoss: string;
        latencyMs: number;
        timestamp: string;
        message: string;
    }>;
    private erpStatus;
    getERPStatus(_tenantId?: string): Promise<{
        connectorHealth: string;
        status: string;
        system: string;
        endpoint: string;
        syncFrequency: string;
        errorQueue: string;
        syncStatus: string;
        lastSyncedAt: string;
    }>;
    syncERP(tenantId: string | undefined): Promise<{
        success: boolean;
        syncStatus: string;
        syncedRecords: number;
        lastSyncedAt: string;
        message: string;
    }>;
    private inMemoryBarcodeFormats;
    getBarcodeFormats(_tenantId?: string): Promise<{
        id: string;
        standard: string;
        useCase: string;
        aiAppPrefix: string;
        status: string;
    }[]>;
    createBarcodeFormat(tenantId: string | undefined, data: any): Promise<{
        id: any;
        standard: any;
        useCase: any;
        aiAppPrefix: any;
        status: any;
    }>;
    updateBarcodeFormat(tenantId: string | undefined, id: string, data: any): Promise<{
        id: string;
        standard: string;
        useCase: string;
        aiAppPrefix: string;
        status: string;
    } | undefined>;
    deleteBarcodeFormat(tenantId: string | undefined, id: string): Promise<{
        success: boolean;
        id: string;
    }>;
    private inMemoryApiKeys;
    getApiKeys(_tenantId?: string): Promise<{
        id: string;
        name: string;
        keyMasked: string;
        rateLimit: string;
        created: string;
        status: string;
    }[]>;
    createApiKey(tenantId: string | undefined, data: any): Promise<{
        id: string;
        name: any;
        keyMasked: string;
        rateLimit: any;
        created: string;
        status: string;
    }>;
    revokeApiKey(tenantId: string | undefined, id: string): Promise<{
        success: boolean;
        id: string;
    }>;
}
export declare const adminService: AdminService;
export {};
//# sourceMappingURL=admin.service.d.ts.map