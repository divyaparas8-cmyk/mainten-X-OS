import { RecordCcpCheckInput, CreateQualityHoldInput } from "./quality.schema.js";
export declare class QualityService {
    listCcpChecks(tenantId: string, plantId?: string): Promise<{
        status: string;
        id: string;
        tenantId: string;
        plantId: string;
        uom: string;
        lineId: string;
        targetValue: string;
        notes: string | null;
        batchId: string;
        operatorId: string;
        verifiedBy: string | null;
        ccpCode: string;
        ccpName: string;
        actualValue: string;
        criticalLimitMin: string | null;
        criticalLimitMax: string | null;
        checkedAt: Date;
    }[]>;
    recordCcpCheck(tenantId: string, plantId: string, input: RecordCcpCheckInput, userId: string): Promise<{
        status: string;
        id: string;
        tenantId: string;
        plantId: string;
        uom: string;
        lineId: string;
        targetValue: string;
        notes: string | null;
        batchId: string;
        operatorId: string;
        verifiedBy: string | null;
        ccpCode: string;
        ccpName: string;
        actualValue: string;
        criticalLimitMin: string | null;
        criticalLimitMax: string | null;
        checkedAt: Date;
    }>;
    listQaReleaseQueue(tenantId: string): Promise<{
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
            id: string;
            tenantId: string;
            plantId: string;
            uom: string;
            lineId: string;
            targetValue: string;
            notes: string | null;
            batchId: string;
            operatorId: string;
            verifiedBy: string | null;
            ccpCode: string;
            ccpName: string;
            actualValue: string;
            criticalLimitMin: string | null;
            criticalLimitMax: string | null;
            checkedAt: Date;
        }[];
    }[]>;
    authorizeBatchRelease(tenantId: string, plantId: string, input: any, userId: string, ipAddress?: string): Promise<{
        id: string;
        tenantId: string;
        plantId: string;
        comments: string | null;
        batchId: string;
        disposition: string;
        dispositionBy: string;
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
        status: string;
        id: string;
        tenantId: string;
        plantId: string;
        batchId: string | null;
        releasedAt: Date | null;
        lotNumber: string;
        reason: string;
        severity: string | null;
        holdBy: string;
        holdAt: Date;
    }[]>;
    createQualityHold(tenantId: string, plantId: string, input: CreateQualityHoldInput, userId: string): Promise<{
        status: string;
        id: string;
        tenantId: string;
        plantId: string;
        batchId: string | null;
        releasedAt: Date | null;
        lotNumber: string;
        reason: string;
        severity: string | null;
        holdBy: string;
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
        holdId: any;
        id: string;
        status: string | null;
        title: string;
        description: string;
        createdAt: Date;
        tenantId: string;
        plantId: string;
        category: string | null;
        severity: string | null;
        deviationNumber: string;
        reportedBy: string;
    }[] | {
        id: string;
        deviationNumber: string;
        title: string;
        description: string;
        category: string;
        severity: string;
        status: string;
        holdId: string;
        createdAt: string;
    }[]>;
    reportDeviation(tenantId: string, plantId: string, input: any, userId: string): Promise<{
        id: string;
        holdId: any;
        status: string;
        title: string;
        description: string;
        createdAt: Date;
        tenantId: string;
        plantId: string;
        category: string | null;
        severity: string | null;
        deviationNumber: string;
        reportedBy: string;
    }>;
    startInvestigation(tenantId: string, plantId: string, input: any, userId: string): Promise<{
        id: string;
        devId: any;
        title: any;
        finding: string;
        action: string;
        status: string;
        assignedTo: string;
        createdAt: string;
    }>;
    listInvestigations(tenantId: string): Promise<{
        id: string;
        devId: string;
        title: string;
        finding: string;
        action: string;
        status: string;
        leadInvestigator: string;
        targetDate: string;
        createdAt: string;
    }[]>;
    saveInvestigationFinding(tenantId: string, plantId: string, input: any, userId: string): Promise<{
        success: boolean;
        id: any;
        finding: any;
        status: string;
        rootCauseCategory: any;
        updatedAt: string;
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
        part: string;
        reason: string;
        severity: string;
        status: string;
        disposition: string;
        date: string;
        reportedBy: string;
    }[]>;
    createNcrReport(tenantId: string, plantId: string, input: any, userId: string): Promise<{
        id: any;
        part: any;
        reason: any;
        severity: any;
        status: string;
        disposition: any;
        date: string;
        reportedBy: string;
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
        recipeName: string;
        currentStep: string;
        stepNumber: number;
        totalSteps: number;
        progressPercent: number;
        line: string;
        ccpStatus: string;
        qaStatus: string;
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
            id: string;
            tenantId: string;
            plantId: string;
            uom: string;
            lineId: string;
            targetValue: string;
            notes: string | null;
            batchId: string;
            operatorId: string;
            verifiedBy: string | null;
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
            id: string;
            tenantId: string;
            plantId: string;
            uom: string;
            lineId: string;
            targetValue: string;
            notes: string | null;
            batchId: string;
            operatorId: string;
            verifiedBy: string | null;
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
        message: string;
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
    listLineReadiness(tenantId: string): Promise<{
        id: number;
        line: string;
        lineCode: string;
        safety: string;
        sanitation: string;
        mechanical: string;
        status: string;
        speedTarget: string;
        lastInspection: string;
    }[]>;
    toggleLineReadiness(tenantId: string, plantId: string, input: any, userId: string): Promise<{
        success: boolean;
        lineId: any;
        lineName: any;
        newStatus: string;
        updatedAt: string;
        data: {
            id: number;
            line: string;
            lineCode: string;
            safety: string;
            sanitation: string;
            mechanical: string;
            status: string;
            speedTarget: string;
            lastInspection: string;
        }[];
    }>;
    authorizeAllLines(tenantId: string, plantId: string, userId: string): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            line: string;
            lineCode: string;
            safety: string;
            sanitation: string;
            mechanical: string;
            status: string;
            speedTarget: string;
            lastInspection: string;
        }[];
    }>;
    exportLineReadiness(tenantId: string, input: any, userId: string): Promise<{
        success: boolean;
        message: string;
        totalRecords: number;
        exportedAt: string;
        records: {
            id: number;
            line: string;
            lineCode: string;
            safety: string;
            sanitation: string;
            mechanical: string;
            status: string;
            speedTarget: string;
            lastInspection: string;
        }[];
    }>;
    getCleaningVerification(tenantId: string): Promise<{
        verified: boolean;
        atpTestResult: string;
        microbialResidue: string;
        targetLimit: string;
        loop: string;
        notes: string;
        verifiedAt: string | null;
        verifiedBy: string;
        status: string;
    }>;
    verifyCleaning(tenantId: string, plantId: string, input: any, userId: string): Promise<{
        success: boolean;
        message: string;
        data: {
            verified: boolean;
            atpTestResult: string;
            microbialResidue: string;
            targetLimit: string;
            loop: string;
            notes: string;
            verifiedAt: string | null;
            verifiedBy: string;
            status: string;
        };
    }>;
    resetCleaningVerification(tenantId: string, plantId: string, userId: string): Promise<{
        success: boolean;
        message: string;
        data: {
            verified: boolean;
            atpTestResult: string;
            microbialResidue: string;
            targetLimit: string;
            loop: string;
            notes: string;
            verifiedAt: string | null;
            verifiedBy: string;
            status: string;
        };
    }>;
    listProcessChecks(tenantId: string): Promise<{
        id: number;
        name: string;
        parameter: string;
        target: string;
        actual: string;
        line: string;
        status: string;
        timestamp: string;
    }[]>;
    recordProcessCheck(tenantId: string, plantId: string, input: any, userId: string): Promise<{
        success: boolean;
        check: {
            id: number;
            name: any;
            parameter: any;
            target: any;
            actual: any;
            line: any;
            status: any;
            timestamp: string;
        };
        data: {
            id: number;
            name: string;
            parameter: string;
            target: string;
            actual: string;
            line: string;
            status: string;
            timestamp: string;
        }[];
        message: string;
    }>;
    toggleProcessCheck(tenantId: string, plantId: string, input: any, userId: string): Promise<{
        success: boolean;
        checkId: number;
        newStatus: any;
        data: {
            id: number;
            name: string;
            parameter: string;
            target: string;
            actual: string;
            line: string;
            status: string;
            timestamp: string;
        }[];
        message: string;
    }>;
    calibrateAllProcessChecks(tenantId: string, plantId: string, userId: string): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            name: string;
            parameter: string;
            target: string;
            actual: string;
            line: string;
            status: string;
            timestamp: string;
        }[];
    }>;
    exportProcessChecks(tenantId: string, input: any, userId: string): Promise<{
        success: boolean;
        message: string;
        totalRecords: number;
        records: {
            id: number;
            name: string;
            parameter: string;
            target: string;
            actual: string;
            line: string;
            status: string;
            timestamp: string;
        }[];
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
        spec: {
            id: number;
            parameter: any;
            range: any;
            sku: any;
            ccp: any;
            uom: any;
            min: any;
            max: any;
        };
        data: any[];
        message: string;
    }>;
    toggleQualitySpecCcp(tenantId: string, plantId: string, input: any, userId: string): Promise<{
        success: boolean;
        specId: number;
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
        batch: string;
        recipe: string;
        approvedBy: string;
        date: string;
        status: string;
        coaUrl: string;
        pallets: string;
    }[]>;
    toggleApprovedReleaseStatus(tenantId: string, plantId: string, input: any, userId: string): Promise<{
        success: boolean;
        id: any;
        batch: any;
        status: string;
        message: string;
        data: {
            id: string;
            batch: string;
            recipe: string;
            approvedBy: string;
            date: string;
            status: string;
            coaUrl: string;
            pallets: string;
        }[];
    }>;
    exportApprovedReleases(tenantId: string, body: any, userId: string): Promise<{
        success: boolean;
        exportedAt: string;
        count: number;
        records: {
            id: string;
            batch: string;
            recipe: string;
            approvedBy: string;
            date: string;
            status: string;
            coaUrl: string;
            pallets: string;
        }[];
        message: string;
    }>;
    listBlockedBatches(tenantId: string): Promise<{
        id: string;
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
        name: any;
        downloadUrl: string;
        generatedAt: string;
        message: string;
    }>;
    listNotifications(tenantId: string): Promise<{
        id: string;
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
        name: string;
        role: string;
        badgeTitle: string;
        subBadge: string;
        initials: string;
        stats: {
            batchesReviewed: number;
            holdsIssued: number;
            approvedReleases: number;
            complianceScore: string;
        };
        certifications: {
            id: number;
            name: string;
            status: string;
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
        items: ({
            id: number;
            category: string;
            name: string;
            spec: string;
            criticality: string;
            method: string;
            passed: boolean;
            notes: string;
        } | {
            id: number;
            category: string;
            name: string;
            spec: string;
            criticality: string;
            method: string;
            passed: null;
            notes: string;
        })[];
        line: string;
        batch: string;
        inspector: string;
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
        items: ({
            id: number;
            category: string;
            name: string;
            spec: string;
            criticality: string;
            method: string;
            passed: boolean;
            notes: string;
        } | {
            id: number;
            category: string;
            name: string;
            spec: string;
            criticality: string;
            method: string;
            passed: null;
            notes: string;
        })[];
        config: {
            line: string;
            batch: string;
            inspector: string;
        };
        message: string;
    }>;
    getSanitationChecklist(tenantId: string): Promise<{
        steps: ({
            id: number;
            phase: string;
            equipment: string;
            spec: string;
            chemical: string;
            targetValue: string;
            completed: boolean;
            logValue: string;
        } | {
            id: number;
            phase: string;
            equipment: string;
            spec: string;
            chemical: string;
            targetValue: string;
            completed: null;
            logValue: string;
        })[];
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
        steps: ({
            id: number;
            phase: string;
            equipment: string;
            spec: string;
            chemical: string;
            targetValue: string;
            completed: boolean;
            logValue: string;
        } | {
            id: number;
            phase: string;
            equipment: string;
            spec: string;
            chemical: string;
            targetValue: string;
            completed: null;
            logValue: string;
        })[];
        config: {
            loop: string;
            protocol: string;
            operator: string;
        };
        message: string;
    }>;
    listBatchHistory(tenantId: string): Promise<{
        id: string;
        recipe: string;
        line: string;
        pallets: string;
        date: string;
        status: string;
        coaUrl: string;
        auditor: string;
    }[]>;
    toggleBatchHistoryStatus(tenantId: string, plantId: string, input: any, userId?: string): Promise<{
        success: boolean;
        id: any;
        data: {
            id: string;
            recipe: string;
            line: string;
            pallets: string;
            date: string;
            status: string;
            coaUrl: string;
            auditor: string;
        }[];
        message: string;
    }>;
    exportBatchHistory(tenantId: string, body: any, userId?: string): Promise<{
        success: boolean;
        exportedAt: string;
        count: number;
        message: string;
    }>;
    listQualityRecords(tenantId: string): Promise<{
        id: string;
        batch: string;
        type: string;
        result: string;
        date: string;
        officer: string;
        details: string;
    }[]>;
    exportQualityRecords(tenantId: string, body: any, userId?: string): Promise<{
        success: boolean;
        exportedAt: string;
        count: number;
        message: string;
    }>;
}
export declare const qualityService: QualityService;
//# sourceMappingURL=quality.service.d.ts.map