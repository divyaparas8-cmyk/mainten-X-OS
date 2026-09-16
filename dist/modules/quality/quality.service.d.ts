import { CreateQualityHoldInput } from "./quality.schema.js";
export declare class QualityService {
    listCcpChecks(tenantId: string, plantId?: string): Promise<any[]>;
    recordCcpCheck(tenantId: string, plantId: string, input: any, userId: string): Promise<any>;
    listQaReleaseQueue(tenantId: string): Promise<{
        id: string;
        requestId: string;
        dbId: number;
        batchNumber: string;
        batch: string;
        skuName: string;
        productName: string;
        lineName: string;
        ccpStatus: string | null;
        brixStatus: string | null;
        allergenStatus: string | null;
        allergenCheck: string | null;
        preopCheck: string | null;
        openDeviations: string | null;
        status: string | null;
    }[] | {
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        plantId: string;
        uom: string;
        skuId: string;
        productionOrderId: string;
        batchNumber: string;
        recipeVersion: string;
        tankNumber: string | null;
        targetVolume: string;
        actualVolume: string | null;
        currentStep: number;
        progressPercent: number;
        startedAt: Date | null;
        completedAt: Date | null;
        sku: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            isActive: boolean;
            plantId: string | null;
            skuCode: string;
            category: string;
            familyId: string | null;
            uom: string;
            barcode: string | null;
            standardCost: string | null;
            shelfLifeDays: number | null;
            minStockLevel: string | null;
            maxStockLevel: string | null;
        };
        steps: {
            status: string;
            parameters: unknown;
            id: string;
            notes: string | null;
            startedAt: Date | null;
            completedAt: Date | null;
            batchId: string;
            stepNumber: number;
            stepName: string;
            operatorId: string | null;
            verifiedBy: string | null;
        }[];
        ccpChecks: {
            status: string;
            location: string | null;
            id: string;
            tenantId: string | null;
            plantId: string | null;
            uom: string;
            lineId: string | null;
            lineName: string | null;
            targetValue: string;
            criticalLimit: string | null;
            testMethod: string | null;
            notes: string | null;
            batchNumber: string | null;
            batchId: string | null;
            operatorId: string | null;
            verifiedBy: string | null;
            operator: string | null;
            equipment: string | null;
            correctiveAction: string | null;
            ccpCode: string;
            ccpName: string;
            actualValue: string;
            criticalLimitMin: string | null;
            criticalLimitMax: string | null;
            checkedAt: Date;
        }[];
    }[]>;
    getQaReleaseMetrics(tenantId: string): Promise<{
        pendingBatchesCount: number;
        ccpClearances: {
            rate: string;
            rawRate: number;
            passedCount: number;
            totalCount: number;
            badge: string;
            subtitle: string;
        };
        qaCycleTime: {
            time: string;
            badge: string;
            subtitle: string;
        };
    }>;
    getBatchReleaseDossier(tenantId: string, batchId: string): Promise<{
        id: string;
        batch: string;
        requestId: string;
        recipe: string;
        line: string;
        ccpTemp: string | null;
        brix: string | null;
        allergen: string | null;
        preOp: string | null;
        deviations: string | null;
        status: string | null;
    } | {
        id: string;
        batch: string;
        requestId: string;
        recipe: string;
        line: string | null;
        ccpTemp: string | null;
        brix: string;
        allergen: string;
        preOp: string;
        deviations: string;
        status: string | null;
    }>;
    authorizeBatchRelease(tenantId: string, plantId: string, input: any, userId: string, ipAddress?: string): Promise<{
        id: string;
        tenantId: string;
        plantId: string;
        comments: string | null;
        batchId: string;
        disposition: string;
        dispositionBy: string | null;
        digitalSignaturePinUsed: boolean;
        certificateOfAnalysisUrl: string | null;
        coaMetadata: unknown;
        releasedAt: Date;
    } | {
        id: string;
        batchId: string;
        disposition: any;
        certificateOfAnalysisUrl: string;
        releasedAt: string;
    }>;
    listQualityHolds(tenantId: string): Promise<{
        id: string;
        holdId: string;
        dbId: string;
        lotNumber: string;
        batch: string;
        batchNumber: string;
        reason: string;
        severity: string;
        status: string;
        date: string;
        heldBy: string;
        createdAt: Date | null;
    }[]>;
    createQualityHold(tenantId: string, plantId: string, input: CreateQualityHoldInput, userId: string): Promise<{
        id: string;
        holdId: string;
        batch: string | null;
        lotNumber: string;
        status: string;
        date: string | null;
        createdAt: Date | null;
        updatedAt: Date | null;
        tenantId: string | null;
        plantId: string | null;
        notes: string | null;
        reason: string;
        batchId: string | null;
        releasedAt: Date | null;
        severity: string | null;
        holdBy: string | null;
        heldByName: string | null;
        holdAt: Date;
    }>;
    getQualitySummary(tenantId: string): Promise<{
        pendingChecks: number;
        failedChecks: number;
        activeHolds: number;
        openDeviations: number;
        pendingReleases: number;
        openInvestigations: number;
        line1PreOp: string;
        lastCcpCheck: string;
        status: string;
    }>;
    listDeviations(tenantId: string): Promise<{
        id: string;
        deviationNumber: string;
        dbId: string;
        title: string;
        description: string;
        category: string;
        severity: string;
        status: string;
        holdId: string;
        reportedByName: string;
        createdAt: string;
    }[]>;
    reportDeviation(tenantId: string, plantId: string, input: any, userId: string): Promise<{
        id: string;
        deviationNumber: string;
        holdId: any;
        status: string;
        title: string;
        description: string;
        createdAt: Date;
        updatedAt: Date | null;
        tenantId: string | null;
        plantId: string | null;
        category: string | null;
        severity: string | null;
        reportedBy: string | null;
        reportedByName: string | null;
    }>;
    startInvestigation(tenantId: string, plantId: string, input: any, userId: string): Promise<{
        id: string;
        invNumber: string;
        dbId: number;
        devId: string;
        title: string;
        finding: string | null;
        action: string | null;
        status: string | null;
        leadInvestigator: string | null;
        targetDate: string | null;
        createdAt: string;
    }>;
    listInvestigations(tenantId: string): Promise<{
        id: string;
        invNumber: string;
        dbId: number;
        devId: string;
        title: string;
        finding: string;
        action: string;
        status: string;
        leadInvestigator: string;
        targetDate: string;
        rootCauseCategory: string;
        createdAt: string;
    }[]>;
    saveInvestigationFinding(tenantId: string, plantId: string, input: any, userId: string): Promise<{
        success: boolean;
        id: any;
        finding: any;
        status: string;
        rootCauseCategory: any;
        updatedAt: string;
        message: string;
    }>;
    completeInvestigation(tenantId: string, plantId: string, input: any, userId: string): Promise<{
        success: boolean;
        id: any;
        devId: any;
        status: string;
        completedAt: string;
        message: string;
    }>;
    exportDeviations(tenantId: string, body: any, userId: string): Promise<{
        success: boolean;
        exportedAt: string;
        count: any;
        message: string;
    }>;
    exportNcrReports(tenantId: string, body: any, userId: string): Promise<{
        success: boolean;
        exportedAt: string;
        count: any;
        message: string;
    }>;
    exportQualityHolds(tenantId: string, body: any, userId: string): Promise<{
        success: boolean;
        exportedAt: string;
        count: any;
        message: string;
    }>;
    exportInvestigations(tenantId: string, body: any, userId: string): Promise<{
        success: boolean;
        exportedAt: string;
        count: any;
        message: string;
    }>;
    exportBatchReviews(tenantId: string, body: any, userId: string): Promise<{
        success: boolean;
        exportedAt: string;
        count: any;
        message: string;
    }>;
    exportReleaseQueue(tenantId: string, body: any, userId: string): Promise<{
        success: boolean;
        exportedAt: string;
        count: any;
        message: string;
    }>;
    listNcrReports(tenantId: string): Promise<{
        id: string;
        ncrNumber: string;
        dbId: number;
        part: string;
        reason: string;
        severity: string;
        status: string;
        disposition: string;
        date: string;
        reportedBy: string;
    }[]>;
    createNcrReport(tenantId: string, plantId: string, input: any, userId: string): Promise<{
        id: string;
        ncrNumber: string;
        dbId: number;
        part: string;
        reason: string;
        severity: string | null;
        status: string | null;
        disposition: string | null;
        date: string | null;
        reportedBy: string | null;
    }>;
    reviewNcrReport(tenantId: string, plantId: string, input: any, userId: string): Promise<{
        success: boolean;
        id: any;
        status: any;
        disposition: any;
        updatedAt: string;
        message: string;
    }>;
    reviewQualityHold(tenantId: string, plantId: string, input: any, userId: string): Promise<{
        success: boolean;
        holdId: any;
        action: any;
        status: string;
        notes: any;
        timestamp: string;
    }>;
    releaseQualityHold(tenantId: string, plantId: string, input: any, userId: string): Promise<{
        success: boolean;
        holdId: any;
        status: string;
        releasedAt: string;
        releasedBy: string;
    }>;
    listBatchQualityReviews(tenantId: string): Promise<{
        id: string;
        batchNumber: string;
        dbId: number;
        recipeName: string;
        currentStep: string;
        stepNumber: number | null;
        totalSteps: number | null;
        progressPercent: number | null;
        line: string | null;
        ccpStatus: string | null;
        qaStatus: string | null;
    }[]>;
    reviewBatchDossier(tenantId: string, plantId: string, input: any, userId: string): Promise<{
        success: boolean;
        batchId: any;
        status: string;
        verifiedBy: string;
        verifiedAt: string;
        message: string;
    }>;
    submitPreOpChecklist(tenantId: string, plantId: string, input: any, userId: string): Promise<{
        success: boolean;
        message: string;
        checkRecord: {
            status: string;
            location: string | null;
            id: string;
            tenantId: string | null;
            plantId: string | null;
            uom: string;
            lineId: string | null;
            lineName: string | null;
            targetValue: string;
            criticalLimit: string | null;
            testMethod: string | null;
            notes: string | null;
            batchNumber: string | null;
            batchId: string | null;
            operatorId: string | null;
            verifiedBy: string | null;
            operator: string | null;
            equipment: string | null;
            correctiveAction: string | null;
            ccpCode: string;
            ccpName: string;
            actualValue: string;
            criticalLimitMin: string | null;
            criticalLimitMax: string | null;
            checkedAt: Date;
        };
    }>;
    submitSanitationChecklist(tenantId: string, plantId: string, input: any, userId: string): Promise<{
        success: boolean;
        message: string;
        record: {
            status: string;
            location: string | null;
            id: string;
            tenantId: string | null;
            plantId: string | null;
            uom: string;
            lineId: string | null;
            lineName: string | null;
            targetValue: string;
            criticalLimit: string | null;
            testMethod: string | null;
            notes: string | null;
            batchNumber: string | null;
            batchId: string | null;
            operatorId: string | null;
            verifiedBy: string | null;
            operator: string | null;
            equipment: string | null;
            correctiveAction: string | null;
            ccpCode: string;
            ccpName: string;
            actualValue: string;
            criticalLimitMin: string | null;
            criticalLimitMax: string | null;
            checkedAt: Date;
        };
    }>;
    listAllergenAudits(tenantId: string): Promise<{
        id: number;
        name: string;
        sku: string;
        line: string;
        testMethod: string;
        targetAllergen: string;
        status: string;
        auditor: string;
        timestamp: string;
    }[]>;
    clearAllergenAudit(tenantId: string, plantId: string, input: any, userId: string): Promise<{
        success: boolean;
        auditId: any;
        runName: any;
        status: string;
        clearedAt: string;
        clearedBy: string;
        data: {
            id: number;
            name: string;
            sku: string;
            line: string;
            testMethod: string;
            targetAllergen: string;
            status: string;
            auditor: string;
            timestamp: string;
        }[];
    }>;
    clearAllAllergenAudits(tenantId: string, plantId: string, userId: string): Promise<{
        success: boolean;
        status: string;
        data: {
            id: number;
            name: string;
            sku: string;
            line: string;
            testMethod: string;
            targetAllergen: string;
            status: string;
            auditor: string;
            timestamp: string;
        }[];
        message: string;
    }>;
    exportAllergenAudits(tenantId: string, input: any, userId: string): Promise<{
        success: boolean;
        message: string;
        totalRecords: number;
        exportedAt: string;
        records: {
            id: number;
            name: string;
            sku: string;
            line: string;
            testMethod: string;
            targetAllergen: string;
            status: string;
            auditor: string;
            timestamp: string;
        }[];
    }>;
    createAllergenAudit(tenantId: string, plantId: string, input: any, userId: string): Promise<{
        success: boolean;
        item: any;
        message: string;
    }>;
    deleteAllergenAudit(tenantId: string, id: string | number): Promise<{
        success: boolean;
        message: string;
    }>;
    listLineReadiness(tenantId: string): Promise<any[]>;
    toggleLineReadiness(tenantId: string, plantId: string, input: any, userId: string): Promise<{
        success: boolean;
        lineId: any;
        lineName: any;
        newStatus: string;
        updatedAt: string;
        data: any[];
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data: never[];
        lineId?: undefined;
        lineName?: undefined;
        newStatus?: undefined;
        updatedAt?: undefined;
    }>;
    authorizeAllLines(tenantId: string, plantId: string, userId: string): Promise<{
        success: boolean;
        message: string;
        data: any[];
    }>;
    exportLineReadiness(tenantId: string, input: any, userId: string): Promise<{
        success: boolean;
        message: string;
        totalRecords: number;
        exportedAt: string;
        records: any[];
    }>;
    getCleaningVerification(tenantId: string): Promise<any>;
    verifyCleaning(tenantId: string, plantId: string, input: any, userId: string): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    resetCleaningVerification(tenantId: string, plantId: string, userId: string): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    listProcessChecks(tenantId: string): Promise<any[]>;
    recordProcessCheck(tenantId: string, plantId: string, input: any, userId: string): Promise<{
        success: boolean;
        data: any[];
        item: any;
        message: string;
    }>;
    toggleProcessCheck(tenantId: string, plantId: string, input: any, userId: string): Promise<{
        success: boolean;
        data: any[];
        newStatus: string;
        message: string;
    }>;
    calibrateAllProcessChecks(tenantId: string, plantId: string, userId: string): Promise<{
        success: boolean;
        data: any[];
        message: string;
    }>;
    exportProcessChecks(tenantId: string, input: any, userId: string): Promise<{
        success: boolean;
        message: string;
        totalRecords: number;
        records: any[];
    }>;
    listProductChecks(tenantId: string): Promise<{
        id: string;
        type: string;
        batch: string;
        sku: string;
        line: string;
        target: string;
        actual: string;
        status: string;
        time: string;
    }[]>;
    recordProductCheck(tenantId: string, plantId: string, input: any, userId: string): Promise<{
        success: boolean;
        check: {
            id: any;
            type: any;
            batch: any;
            sku: any;
            line: any;
            target: any;
            actual: any;
            status: any;
            time: string;
        };
        data: {
            id: string;
            type: string;
            batch: string;
            sku: string;
            line: string;
            target: string;
            actual: string;
            status: string;
            time: string;
        }[];
        message: string;
    }>;
    exportProductChecks(tenantId: string, input: any, userId: string): Promise<{
        success: boolean;
        message: string;
        totalRecords: number;
        records: {
            id: string;
            type: string;
            batch: string;
            sku: string;
            line: string;
            target: string;
            actual: string;
            status: string;
            time: string;
        }[];
    }>;
    listQualitySpecs(tenantId: string): Promise<any[]>;
    createQualitySpec(tenantId: string, plantId: string, input: any, userId: string): Promise<{
        success: boolean;
        spec: any;
        data: any[];
        message: string;
    }>;
    toggleQualitySpecCcp(tenantId: string, plantId: string, input: any, userId: string): Promise<{
        success: boolean;
        specId: any;
        parameter: any;
        newCcp: string;
        data: any[];
        message: string;
    }>;
    exportQualitySpecs(tenantId: string, input: any, userId: string): Promise<{
        success: boolean;
        message: string;
        totalRecords: number;
        records: any[];
    }>;
    exportCcpChecks(tenantId: string, input: any, userId: string): Promise<{
        success: boolean;
        message: string;
        exportedAt: string;
    }>;
    listApprovedReleases(tenantId: string): Promise<{
        id: string;
        releaseCode: string;
        dbId: number;
        batch: string;
        recipe: string;
        pallets: string;
        approvedBy: string;
        date: string;
        status: string | null;
        coaUrl: string | null;
    }[]>;
    toggleApprovedReleaseStatus(tenantId: string, plantId: string, input: any, userId: string): Promise<{
        success: boolean;
        id: any;
        batch: any;
        status: string;
        message: string;
        data: {
            id: string;
            releaseCode: string;
            dbId: number;
            batch: string;
            recipe: string;
            pallets: string;
            approvedBy: string;
            date: string;
            status: string | null;
            coaUrl: string | null;
        }[];
    }>;
    exportApprovedReleases(tenantId: string, body: any, userId: string): Promise<{
        success: boolean;
        exportedAt: string;
        count: number;
        records: {
            id: string;
            releaseCode: string;
            dbId: number;
            batch: string;
            recipe: string;
            pallets: string;
            approvedBy: string;
            date: string;
            status: string | null;
            coaUrl: string | null;
        }[];
        message: string;
    }>;
    listBlockedBatches(tenantId: string): Promise<{
        id: string;
        dbId: string;
        batch: string;
        reason: string;
        blockedBy: string;
        date: string;
        status: string;
        severity: string;
        lotNumber: string;
    }[]>;
    toggleBlockedBatchStatus(tenantId: string, plantId: string, input: any, userId: string): Promise<{
        success: boolean;
        id: any;
        batch: any;
        status: string;
        message: string;
        data: {
            id: string;
            dbId: string;
            batch: string;
            reason: string;
            blockedBy: string;
            date: string;
            status: string;
            severity: string;
            lotNumber: string;
        }[];
    }>;
    exportBlockedBatches(tenantId: string, body: any, userId: string): Promise<{
        success: boolean;
        exportedAt: string;
        count: number;
        records: {
            id: string;
            dbId: string;
            batch: string;
            reason: string;
            blockedBy: string;
            date: string;
            status: string;
            severity: string;
            lotNumber: string;
        }[];
        message: string;
    }>;
    listDispositionRelease(tenantId: string): Promise<{
        id: string;
        dbId: string;
        batch: string;
        lotNumber: string;
        reason: string;
        severity: string;
        status: string;
        date: string;
    }[]>;
    getDispositionRework(tenantId: string): Promise<{
        batches: {
            id: string;
            name: string;
            holdId: string;
            lotNumber: string;
        }[];
        protocols: {
            id: string;
            label: string;
            defaultNote: string;
        }[];
    }>;
    getDispositionReject(tenantId: string): Promise<{
        batches: {
            id: string;
            name: string;
            holdId: string;
        }[];
        protocols: {
            id: string;
            label: string;
            defaultNote: string;
        }[];
    }>;
    getDispositionDowngrade(tenantId: string): Promise<{
        batches: {
            id: string;
            name: string;
            holdId: string;
        }[];
        grades: {
            id: string;
            label: string;
            defaultNote: string;
        }[];
    }>;
    authorizeDisposition(tenantId: string, plantId: string, input: any, userId: string): Promise<{
        success: boolean;
        holdId: any;
        batchId: any;
        decision: any;
        status: string;
        authorizedBy: string;
        authorizedAt: string;
        message: string;
    }>;
    submitReworkInstruction(tenantId: string, plantId: string, input: any, userId: string): Promise<{
        success: boolean;
        batch: any;
        instruction: any;
        protocol: any;
        status: string;
        authorizedBy: string;
        timestamp: string;
        message: string;
    }>;
    submitRejectAuthorization(tenantId: string, plantId: string, input: any, userId: string): Promise<{
        success: boolean;
        batch: any;
        status: string;
        authorizedBy: string;
        timestamp: string;
        message: string;
    }>;
    submitDowngradeAuthorization(tenantId: string, plantId: string, input: any, userId: string): Promise<{
        success: boolean;
        batch: any;
        targetGrade: any;
        status: string;
        authorizedBy: string;
        timestamp: string;
        message: string;
    }>;
    listCapaRecords(tenantId: string): Promise<{
        id: string;
        dbId: string;
        invId: string;
        deviationId: string;
        rootCause: string;
        correctiveAction: string;
        preventiveAction: string;
        status: string;
        assignedTo: string;
        targetDate: string;
        effectivenessRate: string;
    }[]>;
    saveCapaRecord(tenantId: string, plantId: string, input: any, userId: string): Promise<{
        success: boolean;
        id: string;
        dbId: string;
        invId: any;
        deviationId: any;
        rootCause: any;
        correctiveAction: any;
        preventiveAction: any;
        status: string;
        assignedTo: string;
        targetDate: any;
        effectivenessRate: string;
        message: string;
    }>;
    listAuditTrail(tenantId: string): Promise<{
        id: string;
        dbId: number;
        user: string;
        action: string;
        entityType: string;
        entityId: string;
        timestamp: string;
        ipAddress: string;
        verified: boolean;
        hash: string;
    }[]>;
    listQualityReports(tenantId: string): Promise<{
        id: string;
        dbId: number;
        name: string;
        date: string;
        category: string;
        format: string;
        status: string;
        recordsCount: number;
        generatedBy: string;
    }[]>;
    generateQualityReport(tenantId: string, plantId: string, input: any, userId: string): Promise<{
        success: boolean;
        reportId: any;
        dbId: number;
        name: any;
        downloadUrl: string;
        generatedAt: string;
        message: string;
    }>;
    listNotifications(tenantId: string): Promise<{
        id: string;
        dbId: number;
        title: string;
        msg: string;
        time: string;
        path: string;
        type: string;
        badge: string;
        read: boolean;
    }[]>;
    markNotificationRead(tenantId: string, input: any): Promise<{
        success: boolean;
        id: any;
        message: string;
    }>;
    clearNotifications(tenantId: string, input: any): Promise<{
        success: boolean;
        id: any;
        message: string;
    }>;
    getQualityProfile(tenantId: string, userId: string): Promise<{
        name: string | null;
        role: string | null;
        badgeTitle: string | null;
        subBadge: string | null;
        initials: string | null;
        stats: {
            batchesReviewed: number;
            holdsIssued: number;
            approvedReleases: number;
            complianceScore: string;
        };
        certifications: {
            id: number;
            name: string;
            status: string | null;
            issuer: string;
            validUntil: string;
        }[];
    }>;
    updateQualityProfile(tenantId: string, input: any, userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    verifyQualityCert(tenantId: string, input: any, userId: string): Promise<{
        success: boolean;
        certId: any;
        name: any;
        verified: boolean;
        message: string;
    }>;
    getPreOpChecklist(tenantId: string): Promise<{
        items: {
            id: string;
            category: string;
            name: string;
            spec: string;
            criticality: string;
            method: string | null;
            passed: boolean | null;
            notes: string;
            inspectorName: string;
        }[];
        lines: {
            id: string;
            code: string;
            name: string;
            displayName: string;
        }[];
        batches: {
            id: string;
            batchNumber: string;
            displayName: string;
        }[];
        status: string;
        metrics: {
            totalVerifications: number;
            passedChecks: number;
            failedCount: number;
            pendingCount: number;
            progressPercent: number;
        };
    }>;
    savePreOpProgress(tenantId: string, body: any, userId?: string): Promise<{
        success: boolean;
        message: string;
    }>;
    createPreOpItem(tenantId: string, plantId: string, input: any): Promise<{
        success: boolean;
        item: {
            method: string | null;
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string | null;
            plantId: string | null;
            category: string;
            lineId: string | null;
            lineName: string | null;
            criticality: string;
            notes: string | null;
            batchNumber: string | null;
            batchId: string | null;
            spec: string;
            passed: boolean | null;
            inspectorName: string | null;
        };
        message: string;
    }>;
    updatePreOpItem(tenantId: string, id: string, input: any): Promise<{
        success: boolean;
        item: {
            id: string;
            tenantId: string | null;
            plantId: string | null;
            lineId: string | null;
            lineName: string | null;
            batchId: string | null;
            batchNumber: string | null;
            category: string;
            name: string;
            spec: string;
            criticality: string;
            method: string | null;
            passed: boolean | null;
            notes: string | null;
            inspectorName: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        message: string;
    }>;
    deletePreOpItem(tenantId: string, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    markAllPreOpPass(tenantId: string, body?: any): Promise<{
        success: boolean;
        message: string;
    }>;
    resetPreOpChecklist(tenantId: string, body?: any): Promise<{
        success: boolean;
        message: string;
    }>;
    seedStandardPreOp(tenantId: string, plantId: string, body?: any): Promise<{
        success: boolean;
        message: string;
    }>;
    getSanitationChecklist(tenantId: string): Promise<{
        steps: {
            id: number;
            phase: string;
            equipment: string;
            spec: string;
            chemical: string;
            targetValue: string;
            completed: boolean | null;
            logValue: string;
        }[];
        loop: string;
        protocol: string;
        operator: string;
        chemicalWash: string;
        sanitizer: string;
        status: string;
        metrics: {
            totalSteps: number;
            completedCycles: number;
            progressPercent: number;
        };
    }>;
    saveSanitationProgress(tenantId: string, body: any, userId?: string): Promise<{
        success: boolean;
        message: string;
    }>;
    listBatchHistory(tenantId: string): Promise<{
        id: string;
        batchId: string;
        dbId: number;
        recipe: string;
        line: string;
        pallets: string;
        date: string;
        status: string | null;
        coaUrl: string | null;
        auditor: string | null;
    }[]>;
    toggleBatchHistoryStatus(tenantId: string, plantId: string, input: any, userId?: string): Promise<{
        success: boolean;
        id: any;
        data: {
            id: string;
            batchId: string;
            dbId: number;
            recipe: string;
            line: string;
            pallets: string;
            date: string;
            status: string | null;
            coaUrl: string | null;
            auditor: string | null;
        }[];
        message: string;
    }>;
    exportBatchHistory(tenantId: string, body: any, userId?: string): Promise<{
        success: boolean;
        exportedAt: string;
        count: any;
        message: string;
    }>;
    listQualityRecords(tenantId: string): Promise<{
        id: string;
        recordId: string;
        dbId: number;
        batch: string;
        type: string;
        result: string | null;
        date: string;
        officer: string | null;
        details: string | null;
    }[]>;
    exportQualityRecords(tenantId: string, body: any, userId?: string): Promise<{
        success: boolean;
        exportedAt: string;
        count: any;
        message: string;
    }>;
    deleteProductCheck(tenantId: string, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    deleteCcpCheck(tenantId: string, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    updateCcpCheckStatus(tenantId: string, id: string, status: string): Promise<{
        success: boolean;
        message: string;
    }>;
    deleteQualityHold(tenantId: string, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    deleteDeviation(tenantId: string, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    updateDeviationStatus(tenantId: string, id: string, status: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getDeviationCategories(tenantId: string): Promise<any>;
    saveDeviationCategory(tenantId: string, input: {
        id?: string;
        code?: string;
        name: string;
        description?: string;
    }): Promise<{
        id: string;
        code: string;
        name: string;
        description: string;
        createdAt: string;
    }>;
    deleteDeviationCategory(tenantId: string, categoryIdOrCode: string): Promise<{
        success: boolean;
        remaining: number;
    }>;
}
export declare const qualityService: QualityService;
//# sourceMappingURL=quality.service.d.ts.map