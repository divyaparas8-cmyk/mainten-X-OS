export declare class ExecutiveService {
    getDashboardSummary(tenantId: string, plantId?: string): Promise<{
        productionAttainment: string;
        productionTargetUnits: string;
        productionActualUnits: string;
        fleetMTBF: string;
        fleetMTTR: string;
        realizedSavingsTotal: string;
        pipelineSavingsTotal: string;
        manufacturingCostMTD: string;
        standardCostTarget: string;
        activePlantsCount: number;
        plants: {
            id: string;
            name: string;
            plant: string;
            location: string;
            linesCount: number;
            attainment: number;
            status: string;
            oee: string;
            fpy: string;
            throughput: string;
            labor: string;
            lastAudit: string;
            auditStatus: string;
        }[];
        strategicRisks: {
            id: string;
            title: string;
            desc: string;
            severity: string;
        }[];
        aiRoutingRecommendation: {
            id: string;
            title: string;
            reason: string;
            confidence: string;
        };
        lastSyncedAt: string;
    }>;
    syncDashboardData(tenantId: string, input: any, userId: string): Promise<{
        success: boolean;
        syncedAt: string;
        message: string;
    }>;
    exportBoardReport(tenantId: string, input: any, userId: string): Promise<{
        success: boolean;
        reportUrl: string;
        generatedAt: string;
        generatedBy: string;
        message: string;
    }>;
    approveAiRecommendation(tenantId: string, input: any, userId: string): Promise<{
        success: boolean;
        approvedAt: string;
        recommendationId: any;
        message: string;
    }>;
    getMultiPlantKpis(tenantId: string): Promise<{
        avgOee: string;
        avgFpy: string;
        labourEfficiency: string;
        plants: {
            id: string;
            name: string;
            plant: string;
            location: string;
            linesCount: number;
            attainment: number;
            status: string;
            oee: string;
            fpy: string;
            throughput: string;
            labor: string;
            lastAudit: string;
            auditStatus: string;
        }[];
    }>;
    initiatePlantAudit(tenantId: string, input: any, userId: string): Promise<{
        success: boolean;
        plantId: any;
        leadAuditor: any;
        auditDate: any;
        auditStatus: string;
        message: string;
        plants: {
            id: string;
            name: string;
            plant: string;
            location: string;
            linesCount: number;
            attainment: number;
            status: string;
            oee: string;
            fpy: string;
            throughput: string;
            labor: string;
            lastAudit: string;
            auditStatus: string;
        }[];
    }>;
    getManufacturingCosts(tenantId: string, batchId?: string): Promise<{
        batches: {
            id: string;
            name: string;
        }[];
        current: any;
        breakdown: {
            label: string;
            value: any;
            desc: string;
        }[];
    }>;
    getCostVariance(tenantId: string): Promise<{
        totalCostVariance: string;
        materialYieldVariance: string;
        labourVariance: string;
        breakdown: {
            dept: string;
            variance: string;
            cause: string;
        }[];
    }>;
    validateVarianceTargets(tenantId: string, input: any, userId: string): Promise<{
        success: boolean;
        validatedAt: string;
        totalVariance: string;
        departmentsOverTarget: number;
        message: string;
    }>;
    getMaterialCosts(tenantId: string): Promise<{
        materialCostMtd: string;
        stdTarget: string;
        yieldLossAllocation: string;
        packagingCostMtd: string;
        packagingStdTarget: string;
        rates: {
            item: string;
            stdPrice: string;
            actPrice: string;
            status: string;
        }[];
    }>;
    updateContractRates(tenantId: string, input: any, userId: string): Promise<{
        success: boolean;
        updatedAt: string;
        rates: {
            item: string;
            stdPrice: string;
            actPrice: string;
            status: string;
        }[];
        message: string;
    }>;
    getLabourCosts(tenantId: string): Promise<{
        totalLaborCostMtd: string;
        stdTarget: string;
        laborEfficiency: string;
        overtimePremiums: string;
        rates: {
            role: string;
            stdRate: string;
            actRate: string;
            variance: string;
            status: string;
        }[];
    }>;
    auditLabourAllocation(tenantId: string, input: any, userId: string): Promise<{
        success: boolean;
        auditedAt: string;
        reportId: string;
        message: string;
    }>;
    getMachineCosts(tenantId: string): Promise<{
        machineCostMtd: string;
        stdTarget: string;
        electricitySteam: string;
        toolingAmortization: string;
        rates: {
            machine: string;
            stdRate: string;
            actRate: string;
            energy: string;
            status: string;
        }[];
    }>;
    auditMachineEfficiency(tenantId: string, input: any, userId: string): Promise<{
        success: boolean;
        auditedAt: string;
        reportId: string;
        message: string;
    }>;
    getScrapReworkCosts(tenantId: string): Promise<{
        scrapCostMtd: string;
        scrapTarget: string;
        reworkCostMtd: string;
        reworkTarget: string;
        yieldLossMargin: string;
        yieldLimit: string;
        events: {
            id: string;
            batch: string;
            cost: string;
            reason: string;
            status: string;
            department: string;
            loggedBy: string;
        }[];
    }>;
    auditScrapEvent(tenantId: string, input: any, userId: string): Promise<{
        success: boolean;
        eventId: any;
        auditedAt: string;
        events: {
            id: string;
            batch: string;
            cost: string;
            reason: string;
            status: string;
            department: string;
            loggedBy: string;
        }[];
        message: string;
    }>;
    getCiSavings(tenantId: string): Promise<{
        totalYtdSavings: string;
        projectedCiSavings: string;
        benefitsVerified: string;
        projects: {
            id: string;
            title: string;
            projected: string;
            actual: string;
            status: string;
        }[];
    }>;
    verifyCiProjectSavings(tenantId: string, input: any, userId: string): Promise<{
        success: boolean;
        projectId: any;
        verifiedAt: string;
        projects: {
            id: string;
            title: string;
            projected: string;
            actual: string;
            status: string;
        }[];
        message: string;
    }>;
    getBusinessTrends(tenantId: string): Promise<{
        oeeTrend30d: string;
        costVarianceTrend: string;
        demandGrowthTrend: string;
        trends: {
            metric: string;
            current: string;
            predicted30d: string;
            change: string;
            impact: string;
        }[];
    }>;
    simulateBusinessTrends(tenantId: string, input: any, userId: string): Promise<{
        success: boolean;
        simulatedAt: string;
        confidence: string;
        message: string;
    }>;
    getCustomerDemand(tenantId: string): Promise<{
        totalBacklog: string;
        incomingDemandWeek: string;
        demandCoverage: string;
        backlog: {
            customer: string;
            product: string;
            qty: string;
            due: string;
            status: string;
        }[];
    }>;
    syncCustomerDemand(tenantId: string, input: any, userId: string): Promise<{
        success: boolean;
        syncedAt: string;
        syncedOrdersCount: number;
        message: string;
    }>;
    getServiceLevel(tenantId: string): Promise<{
        otifRate: string;
        orderFillRate: string;
        leadTimeDays: string;
        slaExcursions: number;
        serviceMetrics: {
            customer: string;
            targetSla: string;
            actualSla: string;
            status: string;
        }[];
    }>;
    getShipmentPerformance(tenantId: string): Promise<{
        onTimeDispatches: string;
        delayedShipments: number;
        carrierAttainment: string;
        shipments: {
            id: string;
            destination: string;
            carrier: string;
            status: string;
            eta: string;
        }[];
    }>;
    getRisks(tenantId: string): Promise<{
        criticalCount: number;
        openCount: number;
        mitigationRate: string;
        risks: {
            id: string;
            title: string;
            prob: string;
            impact: string;
            owner: string;
            status: string;
        }[];
    }>;
    addRisk(tenantId: string, input: any, userId: string): Promise<{
        success: boolean;
        risk: {
            id: string;
            title: any;
            prob: any;
            impact: any;
            owner: any;
            status: string;
        };
        message: string;
    }>;
    mitigateRisk(tenantId: string, input: any, userId: string): Promise<{
        success: boolean;
        riskId: any;
        actionTaken: any;
        message: string;
    }>;
    getOpportunities(tenantId: string): Promise<{
        estAnnualizedSavings: string;
        implementationCosts: string;
        avgPaybackPeriod: string;
        opportunities: {
            id: string;
            title: string;
            estSavings: string;
            costToImplement: string;
            payback: string;
            status: string;
        }[];
    }>;
    approveOpportunity(tenantId: string, input: any, userId: string): Promise<{
        success: boolean;
        opportunityId: any;
        approvedAt: string;
        message: string;
    }>;
    getAiBriefing(tenantId: string): Promise<{
        briefingDate: string;
        briefingText: string;
    }>;
    generateAiBriefing(tenantId: string, input: any, userId: string): Promise<{
        success: boolean;
        generatedAt: string;
        briefingText: string;
        message: string;
    }>;
    getReports(tenantId: string): Promise<{
        activeReportsCount: number;
        dataFreshness: string;
        auditCompliance: string;
        scheduledDelivery: string;
        reports: {
            id: string;
            name: string;
            category: string;
            date: string;
            cadence: string;
            format: string;
        }[];
    }>;
    exportReport(tenantId: string, input: any, userId: string): Promise<{
        success: boolean;
        reportId: any;
        exportedAt: string;
        url: string;
        message: string;
    }>;
    getNotifications(tenantId: string): Promise<{
        unreadCount: number;
        notifications: {
            id: number;
            type: string;
            read: boolean;
            title: string;
            msg: string;
            time: string;
            path: string;
        }[];
    }>;
    markNotificationRead(tenantId: string, input: any, userId: string): Promise<{
        success: boolean;
        notificationId: any;
        message: string;
    }>;
    markAllNotificationsRead(tenantId: string, input: any, userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    deleteNotification(tenantId: string, input: any, userId: string): Promise<{
        success: boolean;
        notificationId: any;
        message: string;
    }>;
    clearAllNotifications(tenantId: string, input: any, userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getProfile(tenantId: string, userId: string): Promise<{
        email: string;
        phone: string;
        plant: string;
        shift: string;
        role: string;
        name: string;
        employeeId: string;
        certifications: {
            name: string;
            desc: string;
            level: string;
            variant: string;
        }[];
    }>;
    updateProfile(tenantId: string, input: any, userId: string): Promise<{
        success: boolean;
        updatedProfile: any;
        message: string;
    }>;
}
export declare const executiveService: ExecutiveService;
//# sourceMappingURL=executive.service.d.ts.map