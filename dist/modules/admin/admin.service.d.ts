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
        plantId?: string;
        status?: string;
        password?: string;
    }): Promise<{
        id: string;
        name: string;
        email: string;
        role: any;
        roleCode: any;
        department: string;
        plant: any;
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
    editUser(tenantId: string | undefined, userId: string, input: {
        name?: string;
        email?: string;
        role?: string;
        department?: string;
        plant?: string;
        plantId?: string;
        status?: string;
        password?: string;
    }): Promise<{
        id: string;
        name: string;
        email: string;
        role: any;
        roleCode: any;
        department: string;
        plant: any;
        status: string;
        lastLogin: string;
        createdAt: Date;
    }>;
    deleteUser(tenantId: string | undefined, userId: string): Promise<{
        success: boolean;
        message: string;
        deletedId: string;
    }>;
    bulkUpdateUserStatus(tenantId: string | undefined, action: string): Promise<{
        success: boolean;
        action: string;
        targetStatus: string;
        message: string;
    }>;
    getInvitations(tenantId?: string): Promise<{
        id: string;
        email: string;
        role: string;
        department: string | null;
        invitedBy: string | null;
        sentDate: string;
        status: string;
    }[]>;
    createInvitation(tenantId: string | undefined, input: {
        email: string;
        role: string;
        department?: string;
        invitedBy?: string;
    }): Promise<InvitationRecord | {
        id: string;
        email: string;
        role: string;
        department: string | null;
        invitedBy: string | null;
        sentDate: string;
        status: string;
    }>;
    resendInvitation(tenantId: string | undefined, invitationId: string): Promise<{
        success: boolean;
        message: string;
        invitation: any;
    } | {
        success: boolean;
        message: string;
        invitation?: undefined;
    }>;
    deleteInvitation(tenantId: string | undefined, invitationId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    updateInvitation(tenantId: string | undefined, invitationId: string, data: {
        email?: string;
        role?: string;
        department?: string;
        status?: string;
    }): Promise<InvitationRecord | {
        id: string;
        email: string;
        role: string;
        department: string | null;
        invitedBy: string | null;
        sentDate: string;
        status: string;
    } | {
        email?: string;
        role?: string;
        department?: string;
        status?: string;
        success: boolean;
        id: string;
        invitedBy?: undefined;
        sentDate?: undefined;
    }>;
    getActivityLogs(tenantId?: string, query?: string): Promise<any[]>;
    createActivityLog(tenantId: string | undefined, data: {
        action: string;
        category?: string;
        details?: string;
    }): Promise<{
        id: string;
        dbId: string;
        user: string;
        action: string;
        category: string;
        ip: string;
        timestamp: string;
        createdAt: Date;
    }>;
    updateActivityLog(tenantId: string | undefined, logId: string, data: {
        action?: string;
        category?: string;
    }): Promise<{
        success: boolean;
        updated: {
            id: string;
            tenantId: string;
            plantId: string | null;
            userId: string | null;
            action: string;
            entityType: string;
            entityId: string;
            oldValues: unknown;
            newValues: unknown;
            ipAddress: string | null;
            userAgent: string | null;
            createdAt: Date;
        };
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        updated?: undefined;
    }>;
    deleteActivityLog(tenantId: string | undefined, logId: string): Promise<{
        success: boolean;
        message: any;
    }>;
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
    updateRole(tenantId: string | undefined, id: string, input: {
        name?: string;
        description?: string;
    }): Promise<any>;
    deleteRole(tenantId: string | undefined, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    private ensurePermissionsSeeded;
    getPermissionMatrix(tenantId?: string): Promise<Record<string, {
        permissions: Record<string, Record<string, boolean>>;
    }>>;
    updatePermissionMatrix(tenantId: string | undefined, input: {
        roleKey: string;
        permissions?: Record<string, Record<string, boolean>>;
        module?: string;
        action?: string;
        allowed?: boolean;
    }): Promise<{
        success: boolean;
        roleKey: string;
        roleId: string;
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
        description: string;
    }[] | {
        id: string;
        event: string;
        tier: string;
        authorizedRoles: string;
        compliance: string;
    }[]>;
    createApprovalRule(tenantId: string | undefined, data: {
        event: string;
        tier: string;
        authorizedRoles: string;
        compliance?: string;
        description?: string;
    }): Promise<{
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string | null;
        event: string;
        tier: string;
        authorizedRoles: string;
        compliance: string | null;
    }>;
    updateApprovalRule(tenantId: string | undefined, id: string, data: {
        event?: string;
        tier?: string;
        authorizedRoles?: string;
        compliance?: string;
        description?: string;
    }): Promise<{
        id: string;
        tenantId: string | null;
        event: string;
        tier: string;
        authorizedRoles: string;
        compliance: string | null;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteApprovalRule(tenantId: string | undefined, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
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
        missingData: Record<string, unknown>[];
        duplicates: Record<string, unknown>[];
        staleRecords: Record<string, unknown>[];
        invalidReferences: Record<string, unknown>[];
        brokenRelationships: Record<string, unknown>[];
    }>;
    createDataHealthRecord(tenantId: string | undefined, category: string, input: any): Promise<{
        id: any;
        table: any;
        recordKey: any;
        field: any;
        suggestion: any;
        status: any;
        entityType?: undefined;
        primaryRecord?: undefined;
        duplicateRecord?: undefined;
        similarity?: undefined;
        parentTable?: undefined;
        referencedField?: undefined;
        foreignId?: undefined;
        issue?: undefined;
        fromEntity?: undefined;
        toEntity?: undefined;
        relationship?: undefined;
        name?: undefined;
        lastProduced?: undefined;
        inventoryOnHand?: undefined;
        success?: undefined;
        message?: undefined;
    } | {
        id: any;
        entityType: any;
        primaryRecord: any;
        duplicateRecord: any;
        similarity: any;
        status: any;
        table?: undefined;
        recordKey?: undefined;
        field?: undefined;
        suggestion?: undefined;
        parentTable?: undefined;
        referencedField?: undefined;
        foreignId?: undefined;
        issue?: undefined;
        fromEntity?: undefined;
        toEntity?: undefined;
        relationship?: undefined;
        name?: undefined;
        lastProduced?: undefined;
        inventoryOnHand?: undefined;
        success?: undefined;
        message?: undefined;
    } | {
        id: any;
        parentTable: any;
        referencedField: any;
        foreignId: any;
        issue: any;
        status: any;
        table?: undefined;
        recordKey?: undefined;
        field?: undefined;
        suggestion?: undefined;
        entityType?: undefined;
        primaryRecord?: undefined;
        duplicateRecord?: undefined;
        similarity?: undefined;
        fromEntity?: undefined;
        toEntity?: undefined;
        relationship?: undefined;
        name?: undefined;
        lastProduced?: undefined;
        inventoryOnHand?: undefined;
        success?: undefined;
        message?: undefined;
    } | {
        id: any;
        fromEntity: any;
        toEntity: any;
        relationship: any;
        issue: any;
        status: any;
        table?: undefined;
        recordKey?: undefined;
        field?: undefined;
        suggestion?: undefined;
        entityType?: undefined;
        primaryRecord?: undefined;
        duplicateRecord?: undefined;
        similarity?: undefined;
        parentTable?: undefined;
        referencedField?: undefined;
        foreignId?: undefined;
        name?: undefined;
        lastProduced?: undefined;
        inventoryOnHand?: undefined;
        success?: undefined;
        message?: undefined;
    } | {
        id: any;
        name: any;
        table: any;
        lastProduced: any;
        inventoryOnHand: any;
        status: any;
        recordKey?: undefined;
        field?: undefined;
        suggestion?: undefined;
        entityType?: undefined;
        primaryRecord?: undefined;
        duplicateRecord?: undefined;
        similarity?: undefined;
        parentTable?: undefined;
        referencedField?: undefined;
        foreignId?: undefined;
        issue?: undefined;
        fromEntity?: undefined;
        toEntity?: undefined;
        relationship?: undefined;
        success?: undefined;
        message?: undefined;
    } | {
        success: boolean;
        message: string;
        id?: undefined;
        table?: undefined;
        recordKey?: undefined;
        field?: undefined;
        suggestion?: undefined;
        status?: undefined;
        entityType?: undefined;
        primaryRecord?: undefined;
        duplicateRecord?: undefined;
        similarity?: undefined;
        parentTable?: undefined;
        referencedField?: undefined;
        foreignId?: undefined;
        issue?: undefined;
        fromEntity?: undefined;
        toEntity?: undefined;
        relationship?: undefined;
        name?: undefined;
        lastProduced?: undefined;
        inventoryOnHand?: undefined;
    }>;
    updateDataHealthRecord(tenantId: string | undefined, category: string, id: string, input: any): Promise<any>;
    remediateDataHealthItem(tenantId: string | undefined, input: {
        type?: string;
        category?: string;
        id: string;
        recordKey?: string;
        resolution?: string;
    }): Promise<{
        success: boolean;
        id: string;
        status: string;
        message: string;
    }>;
    deleteDataHealthItem(tenantId: string | undefined, input: {
        type?: string;
        category?: string;
        id: string;
        recordKey?: string;
    }): Promise<{
        success: boolean;
        id: string;
        message: string;
    }>;
    getSecurityPolicies(tenantId?: string): Promise<any>;
    saveSecurityPolicies(tenantId?: string, policies?: any): Promise<{
        success: boolean;
        data: any;
    }>;
    getSystemConfig(tenantId?: string): Promise<any>;
    saveSystemConfig(tenantId?: string, config?: any): Promise<{
        success: boolean;
        data: any;
    }>;
    getAuditLogs(tenantId?: string, query?: string): Promise<any[]>;
    createAuditLog(tenantId: string | undefined, data: any): Promise<{
        success: boolean;
        auditId: string;
        id: string;
        timestamp: string;
        user: any;
        userRole: any;
        entityType: string;
        entityId: string;
        action: string;
        oldValue: {};
        newValue: {};
        notes: string;
    }>;
    updateAuditLog(tenantId: string | undefined, id: string, data: any): Promise<any>;
    deleteAuditLog(tenantId: string | undefined, id: string): Promise<{
        success: boolean;
        id: string;
    }>;
    getRemediationLog(tenantId?: string): Promise<Record<string, unknown>[]>;
    createRemediationLog(tenantId: string | undefined, data: any): Promise<{
        id: any;
        rule: any;
        affectedTable: any;
        recordsHealed: number;
        status: any;
        timestamp: any;
        details: any;
    }>;
    updateRemediationLog(tenantId: string | undefined, id: string, data: any): Promise<any>;
    executeRemediationEngine(tenantId?: string): Promise<{
        success: boolean;
        id: string;
        message: string;
        timestamp: string;
    }>;
    deleteRemediationLog(tenantId: string | undefined, id: string): Promise<{
        success: boolean;
        id: string;
        message: string;
    }>;
    getMigrationBatches(tenantId?: string): Promise<{
        id: string;
        target: string;
        connector: string;
        transferred: string;
        conformity: string;
        status: string;
        recordsCount: number | null;
        details: unknown;
        createdAt: Date | null;
    }[]>;
    createMigrationBatch(tenantId: string | undefined, data: any): Promise<{
        success: boolean;
        record: {
            id: any;
            tenantId: string | null;
            target: any;
            connector: any;
            transferred: any;
            conformity: any;
            status: any;
            recordsCount: number;
            details: any;
        };
    }>;
    updateMigrationBatch(tenantId: string | undefined, id: string, data: any): Promise<{
        success: boolean;
        id: string;
    }>;
    deleteMigrationBatch(tenantId: string | undefined, id: string): Promise<{
        success: boolean;
        id: string;
    }>;
    executeMigrationBatch(tenantId: string | undefined, batchData: any): Promise<{
        success: boolean;
        batchRunId: string;
        message: string;
    }>;
    getSystemReports(tenantId?: string): Promise<{
        uptime: string;
        uptimeStatus: string;
        uptimeTarget: string;
        dbStorage: string;
        dbStorageLimit: string;
        dbStorageUtilization: string;
        apiLatencyMs: number;
        apiLatencyP99: string;
        seatLicensesUsed: number;
        seatLicensesTotal: number;
        seatLicensesAvailable: number;
        tenantTier: string;
        resourceUtilization: {
            label: string;
            value: number;
        }[];
        edgeTelemetryHealth: string;
        edgeLatency: string;
        pgStorageHealth: string;
        pgCapacityHeadroom: string;
        totalAuditEvents: number;
        reports: any[];
        timestamp: string;
    }>;
    getSystemGovernanceReports(tenantId?: string): Promise<{
        status: string | null;
        title: string;
        id: string;
        createdAt: Date | null;
        updatedAt: Date | null;
        tenantId: string | null;
        tier: string | null;
        uptime: string;
        dbStorage: string;
        apiLatency: string;
        licensesUsed: number | null;
        licensesTotal: number | null;
        edgeHealth: string | null;
        generatedBy: string | null;
        metrics: unknown;
    }[]>;
    createSystemReport(tenantId: string | undefined, data: any): Promise<{
        success: boolean;
        report: {
            id: any;
            tenantId: string | null;
            title: any;
            uptime: any;
            dbStorage: any;
            apiLatency: any;
            licensesUsed: number;
            licensesTotal: number;
            tier: any;
            edgeHealth: any;
            status: any;
            generatedBy: any;
            metrics: any;
        };
    }>;
    updateSystemReport(tenantId: string | undefined, id: string, data: any): Promise<{
        success: boolean;
        id: string;
    }>;
    deleteSystemReport(tenantId: string | undefined, id: string): Promise<{
        success: boolean;
        id: string;
    }>;
    exportSystemReport(tenantId?: string): Promise<{
        success: boolean;
        data: {
            uptime: string;
            uptimeStatus: string;
            uptimeTarget: string;
            dbStorage: string;
            dbStorageLimit: string;
            dbStorageUtilization: string;
            apiLatencyMs: number;
            apiLatencyP99: string;
            seatLicensesUsed: number;
            seatLicensesTotal: number;
            seatLicensesAvailable: number;
            tenantTier: string;
            resourceUtilization: {
                label: string;
                value: number;
            }[];
            edgeTelemetryHealth: string;
            edgeLatency: string;
            pgStorageHealth: string;
            pgCapacityHeadroom: string;
            totalAuditEvents: number;
            reports: any[];
            timestamp: string;
        };
        reportId: string;
        generatedAt: string;
    }>;
    getIoTGateways(tenantId?: string): Promise<{
        id: any;
        name: any;
        protocol: any;
        endpointUrl: any;
        connectedNodes: number;
        telemetryRate: any;
        status: any;
        lastPingAt: any;
        createdAt: any;
        updatedAt: any;
    }[]>;
    createIoTGateway(tenantId: string | undefined, input: any): Promise<{
        id: any;
        name: any;
        protocol: any;
        endpointUrl: any;
        connectedNodes: number;
        telemetryRate: any;
        status: any;
        lastPingAt: string;
        createdAt: string;
        updatedAt: string;
    }>;
    updateIoTGateway(tenantId: string | undefined, id: string, input: any): Promise<any>;
    deleteIoTGateway(tenantId: string | undefined, id: string): Promise<{
        success: boolean;
        id: string;
        message: string;
    }>;
    pingIoTGateways(): Promise<{
        success: boolean;
        message: string;
        timestamp: string;
    }>;
    getERPStatus(tenantId?: string): Promise<{
        id: any;
        systemType: any;
        gatewayEndpoint: any;
        clientSystem: any;
        authMode: any;
        status: any;
        syncFrequency: any;
        syncStatus: any;
        connectorHealth: any;
        errorQueue: any;
    } | {
        connectorHealth: string;
        status: string;
        syncStatus: string;
        syncFrequency: string;
        errorQueue: string;
        id?: undefined;
        systemType?: undefined;
        gatewayEndpoint?: undefined;
        clientSystem?: undefined;
        authMode?: undefined;
    }>;
    updateERPConfig(tenantId: string | undefined, input: any): Promise<{
        id: any;
        systemType: any;
        gatewayEndpoint: any;
        clientSystem: any;
        authMode: any;
        status: any;
        syncFrequency: any;
        syncStatus: any;
        connectorHealth: any;
        errorQueue: any;
    } | {
        connectorHealth: string;
        status: string;
        syncStatus: string;
        syncFrequency: string;
        errorQueue: string;
        id?: undefined;
        systemType?: undefined;
        gatewayEndpoint?: undefined;
        clientSystem?: undefined;
        authMode?: undefined;
    }>;
    syncERP(tenantId?: string): Promise<{
        success: boolean;
        syncStatus: string;
        message: string;
    }>;
    getERPEvents(tenantId?: string): Promise<{
        id: any;
        time: any;
        type: any;
        scope: any;
        count: any;
        status: any;
        createdAt: any;
    }[]>;
    deleteERPEvent(tenantId: string | undefined, id: string): Promise<{
        success: boolean;
        id: string;
        message: string;
    }>;
    getBarcodeFormats(tenantId?: string): Promise<{
        id: any;
        standard: any;
        useCase: any;
        aiAppPrefix: any;
        status: any;
        createdAt: any;
        updatedAt: any;
    }[]>;
    createBarcodeFormat(tenantId: string | undefined, input: any): Promise<{
        id: any;
        standard: any;
        useCase: any;
        aiAppPrefix: any;
        status: any;
        createdAt: string;
        updatedAt: string;
    }>;
    updateBarcodeFormat(tenantId: string | undefined, id: string, input: any): Promise<any>;
    deleteBarcodeFormat(tenantId: string | undefined, id: string): Promise<{
        success: boolean;
        id: string;
        message: string;
    }>;
    getApiKeys(tenantId?: string): Promise<{
        id: any;
        name: any;
        keyMasked: any;
        rateLimit: any;
        status: any;
        created: string;
        updatedAt: any;
    }[]>;
    createApiKey(tenantId: string | undefined, input: any): Promise<{
        id: any;
        name: any;
        keyMasked: string;
        rateLimit: any;
        status: any;
        created: string;
        createdAt: string;
        updatedAt: string;
    }>;
    updateApiKey(tenantId: string | undefined, id: string, input: any): Promise<any>;
    revokeApiKey(tenantId: string | undefined, id: string): Promise<{
        success: boolean;
        id: string;
        message: string;
    }>;
}
export declare const adminService: AdminService;
export {};
//# sourceMappingURL=admin.service.d.ts.map