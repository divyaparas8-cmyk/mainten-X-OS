import { CreateWorkOrderInput, UpdateWorkOrderStatusInput } from "./maintenance.schema.js";
export declare class MaintenanceService {
    listWorkOrders(tenantId: string, plantId?: string): Promise<{
        type: string;
        status: string;
        title: string;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        plantId: string;
        assetId: string;
        priority: string;
        scheduledDate: Date | null;
        completedAt: Date | null;
        reportedBy: string | null;
        assignedTo: string | null;
        woNumber: string;
        failureCodeId: string | null;
        estimatedHours: string | null;
        actualHours: string | null;
        asset: {
            type: string | null;
            status: string | null;
            location: string | null;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string | null;
            plantId: string | null;
            healthScore: number | null;
            lineId: string | null;
            assetId: string | null;
            assetCode: string | null;
            lineName: string | null;
            plantName: string | null;
            criticality: string | null;
            criticalLevel: string | null;
            modelNumber: string | null;
            manufacturer: string | null;
            healthPercent: number | null;
            ratedSpeed: string | null;
            mtbfHours: string | null;
            mttrHours: string | null;
            serialNumber: string | null;
            nameplatePower: string | null;
            warrantyExpiry: string | null;
            operatingHours: number | null;
            installDate: Date | null;
            lastServiceDate: Date | null;
        };
        assignedUser: {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            email: string;
            passwordHash: string;
            firstName: string;
            lastName: string;
            phone: string | null;
            avatarUrl: string | null;
            digitalSignaturePinHash: string | null;
            isMasterAdmin: boolean;
            lastLoginAt: Date | null;
        } | null;
    }[]>;
    listBreakdowns(tenantId: string, plantId?: string): Promise<any[]>;
    reportBreakdown(tenantId: string, plantId: string, input: any, userId?: string): Promise<{
        id: string;
        dbId: string;
        downtimeLogId: string;
        assetId: any;
        assetName: any;
        plant: string;
        department: string;
        line: any;
        startTime: string;
        endTime: null;
        durationMinutes: number;
        failureCode: any;
        failureCategory: any;
        symptom: any;
        severity: any;
        status: string;
        technician: any;
        linkedWorkOrder: string;
        linkedWorkOrderId: string;
        impact: {
            productionLossUnits: number;
            downtimeCostUSD: number;
            safetyRisk: any;
            scrapRatePercent: number;
        };
    }>;
    findBreakdownTarget(tenantId: string, id: string): Promise<{
        type: "downtime";
        dt: {
            id: string;
            createdAt: Date;
            tenantId: string;
            plantId: string;
            comments: string | null;
            category: string;
            startTime: Date;
            endTime: Date | null;
            lineId: string;
            assetId: string | null;
            orderId: string | null;
            reasonCode: string;
            durationMinutes: number;
            loggedBy: string | null;
        };
        assetId: string | null;
        wo?: undefined;
    } | {
        type: "workOrder";
        wo: {
            type: string;
            status: string;
            title: string;
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            plantId: string;
            assetId: string;
            priority: string;
            scheduledDate: Date | null;
            completedAt: Date | null;
            reportedBy: string | null;
            assignedTo: string | null;
            woNumber: string;
            failureCodeId: string | null;
            estimatedHours: string | null;
            actualHours: string | null;
        };
        assetId: string;
        dt?: undefined;
    } | null>;
    updateBreakdown(tenantId: string, id: string, input: any): Promise<any>;
    resolveBreakdown(tenantId: string, id: string, input: any): Promise<{
        id: string;
        status: string;
        acknowledged: boolean;
    }>;
    deleteBreakdown(tenantId: string, id: string): Promise<{
        id: string;
        deleted: boolean;
    }>;
    listHistory(tenantId: string, plantId?: string): Promise<any[]>;
    exportHistoryDossier(tenantId: string, id: string): Promise<{
        id: string;
        status: string;
        acknowledged: boolean;
        exportTime: Date;
    }>;
    updateAsset(tenantId: string, id: string, input: any): Promise<any>;
    listTroubleshooting(tenantId: string): Promise<{
        id: any;
        problemSymptom: any;
        symptom: any;
        assetId: any;
        assetName: any;
        failureCode: any;
        rootCause: any;
        repairProcedure: any;
        partsRequired: any;
        verifiedBy: any;
        verificationDate: any;
        status: any;
        createdAt: any;
    }[]>;
    saveTroubleshootingStep(tenantId: string, input: any): Promise<{
        step: any;
        savedAt: Date;
        acknowledged: boolean;
        data: any;
    }>;
    saveTroubleshootingDraft(tenantId: string, input: any): Promise<{
        draftId: string;
        savedAt: Date;
        acknowledged: boolean;
        data: any;
    }>;
    saveTroubleshootingSolution(tenantId: string, input: any): Promise<any>;
    resolveTechnicianUserId(identifier?: string | null, tenantId?: string): Promise<string | null>;
    createWorkOrder(tenantId: string, plantId: string, input: CreateWorkOrderInput, userId: string): Promise<{
        type: string;
        status: string;
        title: string;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        plantId: string;
        assetId: string;
        priority: string;
        scheduledDate: Date | null;
        completedAt: Date | null;
        reportedBy: string | null;
        assignedTo: string | null;
        woNumber: string;
        failureCodeId: string | null;
        estimatedHours: string | null;
        actualHours: string | null;
    }>;
    updateWorkOrderStatus(tenantId: string, id: string, input: UpdateWorkOrderStatusInput): Promise<any>;
    updateWorkOrder(tenantId: string, id: string, input: any): Promise<any>;
    deleteWorkOrder(tenantId: string, id: string): Promise<{
        id: string;
        deleted: boolean;
        woNumber: string;
        message: string;
    }>;
    listPMSchedules(tenantId: string): Promise<{
        id: string;
<<<<<<< HEAD
        tenantId: string;
        isActive: boolean;
        plantId: string;
        frequency: string;
        assetId: string;
        scheduleCode: string;
=======
        scheduleCode: string;
        dbId: string;
        title: string;
        assetId: string;
        assetName: string;
        frequency: string;
>>>>>>> 5af8411961ffaedde5d11b050f16c0266436a5f2
        intervalDays: number;
        dueDate: string;
        dueNext: string;
        lastCompleted: string;
        status: string;
        assignedTo: any;
        assignedTechnician: any;
        templateId: any;
        priority: any;
        estimatedMinutes: any;
        isActive: boolean;
    }[]>;
    createPMSchedule(tenantId: string, plantId: string, input: {
        title: string;
        assetId?: string;
        assetName?: string;
        frequency?: string;
        assignedTo?: string;
        dueDate?: string;
        templateId?: string;
        priority?: string;
        status?: string;
    }): Promise<{
        id: string;
<<<<<<< HEAD
        tenantId: string;
        isActive: boolean;
        plantId: string;
        frequency: string;
        assetId: string;
        scheduleCode: string;
=======
        scheduleCode: string;
        dbId: string;
        title: string;
        assetId: any;
        assetName: any;
        frequency: string;
>>>>>>> 5af8411961ffaedde5d11b050f16c0266436a5f2
        intervalDays: number;
        dueDate: string;
        dueNext: string;
        lastCompleted: string;
        status: string;
        assignedTo: string;
        assignedTechnician: string;
        templateId: string;
        priority: string;
        isActive: boolean;
    }>;
    updatePMSchedule(tenantId: string, id: string, input: any): Promise<{
        id: string;
        scheduleCode: string;
        dbId: string;
        title: string;
        assetId: string;
        assetName: string;
        frequency: any;
        dueDate: string;
        dueNext: string;
        status: string;
        assignedTo: any;
        isActive: boolean;
    }>;
    deletePMSchedule(tenantId: string, id: string): Promise<{
        success: boolean;
        id: string;
        dbId: string;
        message: string;
    }>;
    executePMChecklist(tenantId: string, plantId: string, input: any): Promise<{
        id: string;
        scheduleId: any;
        assetId: any;
        status: string;
        executedAt: string;
        hasFailures: boolean;
        workOrder: {
            id: any;
            dbId: any;
            title: any;
            priority: any;
            status: any;
        } | null;
        acknowledged: boolean;
    }>;
    savePMChecklistDraft(tenantId: string, plantId: string, input: any): Promise<{
        draftId: string;
        scheduleId: any;
        savedAt: string;
        acknowledged: boolean;
        data: any;
    }>;
    listSpareParts(tenantId: string): Promise<{
        id: string;
        dbId: string;
        partNo: string;
        partNumber: string;
        name: string;
        category: string;
        stock: number;
        currentStock: number;
        minStock: number;
        minStockLevel: number;
        unitCost: number;
        location: string;
        binLocation: string;
        supplier: string;
        supplierName: string;
        status: string;
        linkedAssets: string[];
        linkedAsset: string | null;
    }[]>;
    createSparePart(tenantId: string, input: any): Promise<{
        id: string;
        dbId: string;
        partNo: string;
        partNumber: string;
        name: string;
        category: string;
        stock: number;
        currentStock: number;
        minStock: number;
        minStockLevel: number;
        unitCost: number;
        location: string | null;
        binLocation: string | null;
        supplier: string | null;
        supplierName: string | null;
        status: string;
        linkedAssets: string[];
        linkedAsset: string | null;
    }>;
    updateSparePart(tenantId: string, partId: string, input: any): Promise<{
        id: string;
        dbId: string;
        partNo: string;
        partNumber: string;
        name: string;
        category: string;
        stock: number;
        currentStock: number;
        minStock: number;
        minStockLevel: number;
        unitCost: number;
        location: string | null;
        binLocation: string | null;
        supplier: string | null;
        supplierName: string | null;
        status: string;
        linkedAssets: string[];
    }>;
    deleteSparePart(tenantId: string, partId: string): Promise<{
        id: string;
        success: boolean;
    }>;
    listCalibrations(tenantId: string): Promise<{
        id: string;
        assetId: string;
        dbAssetId: string;
        assetCode: string | null;
        instrumentName: string;
        name: string;
        certificateNumber: string | null;
        certificate: string | null;
        lastCalibration: string | null;
        nextDueDate: string | null;
        status: string;
        result: string;
        isUserCreated: boolean;
    }[]>;
    createCalibration(tenantId: string, input: any): Promise<{
        id: string;
        assetId: any;
        dbAssetId: string;
        assetCode: any;
        instrumentName: string;
        name: string;
        certificateNumber: string | null;
        certificate: string | null;
        lastCalibration: string | null;
        nextDueDate: string | null;
        status: string;
        result: any;
        isUserCreated: boolean;
    }>;
    listPM(tenantId: string): Promise<{
        status: string;
        title: string;
        id: string;
        tenantId: string;
        isActive: boolean;
        plantId: string;
        frequency: string;
        assetId: string;
<<<<<<< HEAD
=======
        frequency: string;
>>>>>>> 5af8411961ffaedde5d11b050f16c0266436a5f2
        scheduleCode: string;
        intervalDays: number;
        lastPerformedDate: Date | null;
        nextDueDate: Date;
        checklistTemplate: unknown;
    }[]>;
    listCalendar(tenantId: string): Promise<{
        status: string;
        title: string;
        id: string;
        tenantId: string;
        isActive: boolean;
        plantId: string;
        frequency: string;
        assetId: string;
<<<<<<< HEAD
=======
        frequency: string;
>>>>>>> 5af8411961ffaedde5d11b050f16c0266436a5f2
        scheduleCode: string;
        intervalDays: number;
        lastPerformedDate: Date | null;
        nextDueDate: Date;
        checklistTemplate: unknown;
    }[]>;
    listNotifications(tenantId: string): Promise<{
        id: any;
        title: any;
        message: any;
        type: string;
        category: any;
        timestamp: string;
        read: any;
        link: any;
        actionText: string;
    }[]>;
    markNotificationRead(id: string): Promise<import("pg").QueryResult<never>>;
    markAllNotificationsRead(tenantId: string): Promise<import("pg").QueryResult<never>>;
    clearNotifications(tenantId: string): Promise<import("pg").QueryResult<never>>;
    listProfile(tenantId: string, userId?: string, userEmail?: string): Promise<{
        id: any;
        name: string;
        email: any;
        phone: any;
        role: any;
        plant: string;
        shift: any;
        avatar: string;
        bio: string;
        activeWorkOrdersCount: number;
        completedWOsThisYear: number;
        pmComplianceContribution: string;
        certifications: any[];
        skills: any[];
    }>;
    updateProfile(tenantId: string, userId: string, input: any): Promise<any>;
    getReliabilityMetrics(tenantId: string, plantId?: string): Promise<{
        plantOverall: {
            mtbfHours: number;
            mttrHours: number;
            overallAvailability: number;
            repeatFailureRate: number;
            unplannedDowntimeHoursMonth: number;
            totalMaintenanceCostMonth: number;
        };
        assetRanking: any[];
        failurePareto: any[];
        failureCategories: {
            category: string;
            events: number;
            percentage: number;
            color: string;
        }[];
        repeatFailures: any[];
        monthlyTrend: {
            month: string;
            mtbf: number;
            mttr: number;
            availability: number;
            breakdowns: number;
            cost: number;
        }[];
        weibull: {
            beta: number;
            betaRegime: string;
            etaHours: number;
            pmComplianceRatio: number;
            hazardRatePerHour: number;
        };
    }>;
    getRCAInvestigations(tenantId: string): Promise<{
        id: string;
        title: string;
        assetId: string;
        assetName: string;
        lineId: string;
        lineName: string;
        plantId: string;
        sourceBreakdownId: string;
        leadInvestigator: string;
        teamMembers: string[];
        currentPhase: string;
        status: string;
        severity: string;
        daysActive: number;
        targetCloseDate: string;
    }[]>;
    createRCAInvestigation(tenantId: string, input: any): Promise<any>;
    exportReliabilityReport(tenantId: string): Promise<{
        success: boolean;
        reportType: string;
        generatedAt: Date;
        downloadUrl: string;
    }>;
    saveWorkOrderExecution(tenantId: string, id: string, input: any): Promise<any>;
    issueWorkOrderPart(tenantId: string, input: any): Promise<any>;
    signOffWorkOrder(tenantId: string, id: string, input: any): Promise<any>;
    addWorkOrderComment(tenantId: string, id: string, input: any): Promise<any>;
}
export declare const maintenanceService: MaintenanceService;
//# sourceMappingURL=maintenance.service.d.ts.map