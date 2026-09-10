import { CreateCustomerOrderInput, UpdateCustomerOrderInput, CreateForecastInput, UpdateForecastInput, RunForecastInput, CreatePromotionInput, UpdatePromotionInput, CreateApsScheduleInput, RescheduleApsScheduleInput, SplitApsScheduleInput, OptimizeApsScheduleInput, RunMrpEngineInput, CreatePurchaseRequisitionInput, ExpediteShortageInput, UpdateSafetyStockPolicyInput, MitigateServiceRiskInput, CreateScheduleVersionInput, ValidateScheduleInput, PublishScheduleInput } from "./planning.schema.js";
interface ServiceRiskRecord {
    id: string;
    customer: string;
    orderRef: string;
    riskTitle: string;
    potentialPenalty: string;
    financialExposure: number;
    severity: string;
    impact: string;
    recommendation: string;
    isMitigated: boolean;
    mitigatedAt: string | null;
    mitigatedBy: string | null;
}
export declare class PlanningService {
    private resolvePlantId;
    private resolveSkuId;
    private mapOrderRow;
    listCustomerOrders(tenantId: string, plantId?: string): Promise<{
        id: any;
        orderNumber: any;
        customer: any;
        customerName: any;
        skuId: any;
        productCode: any;
        productName: any;
        quantity: number;
        uom: any;
        requestedShipDate: string;
        priority: any;
        plantId: any;
        status: any;
        notes: any;
        deliveryAddress: any;
        createdDate: string;
    }[]>;
    createCustomerOrder(tenantId: string, plantId: string, input: CreateCustomerOrderInput): Promise<{
        id: any;
        orderNumber: any;
        customer: any;
        customerName: any;
        skuId: any;
        productCode: any;
        productName: any;
        quantity: number;
        uom: any;
        requestedShipDate: string;
        priority: any;
        plantId: any;
        status: any;
        notes: any;
        deliveryAddress: any;
        createdDate: string;
    }>;
    updateCustomerOrder(tenantId: string, id: string, input: UpdateCustomerOrderInput): Promise<{
        id: any;
        orderNumber: any;
        customer: any;
        customerName: any;
        skuId: any;
        productCode: any;
        productName: any;
        quantity: number;
        uom: any;
        requestedShipDate: string;
        priority: any;
        plantId: any;
        status: any;
        notes: any;
        deliveryAddress: any;
        createdDate: string;
    } | {
        status?: string | undefined;
        plantId?: string | undefined;
        uom?: string | undefined;
        skuId?: string | undefined;
        quantity?: number | undefined;
        notes?: string | undefined;
        orderNumber?: string | undefined;
        customerName?: string | undefined;
        priority?: string | undefined;
        requestedDate?: string | undefined;
        deliveryAddress?: string | undefined;
        customer?: string | undefined;
        productCode?: string | undefined;
        productName?: string | undefined;
        requestedShipDate?: string | undefined;
        id: string;
    }>;
    deleteCustomerOrder(tenantId: string, id: string): Promise<{
        success: boolean;
        id: string;
    }>;
    listForecasts(tenantId: string, plantId?: string): Promise<{
        id: string;
        period: string;
        plantId: string;
        skuId: string;
        productCode: string;
        productName: string;
        uom: string;
        historicalDemand: number;
        baselineForecast: number;
        overrideQuantity: number;
        finalForecast: number;
        method: string;
        reason: string;
        owner: string;
        status: string;
        createdDate: string;
        lastUpdated: string;
    }[]>;
    createForecast(tenantId: string, plantId: string, input: CreateForecastInput): Promise<{
        id: string;
        period: string;
        plantId: string;
        skuId: string;
        productCode: string;
        productName: string;
        uom: string;
        historicalDemand: number;
        baselineForecast: number;
        overrideQuantity: number;
        finalForecast: number;
        method: string | null;
        reason: string;
        owner: string;
        status: string;
        createdDate: string;
        lastUpdated: string;
    }>;
    updateForecast(tenantId: string, id: string, input: UpdateForecastInput): Promise<{
        status: string;
        lastUpdated: string;
        method?: string | undefined;
        skuId?: string | undefined;
        period?: string | undefined;
        baselineDemand?: number | undefined;
        overrideQuantity?: number | undefined;
        finalForecast?: number | undefined;
        reason?: string | undefined;
        baselineForecast?: number | undefined;
        owner?: string | undefined;
        id: string;
    }>;
    deleteForecast(tenantId: string, id: string): Promise<{
        success: boolean;
        id: string;
    }>;
    listDemandHistory(tenantId: string, plantId?: string): Promise<{
        id: string;
        period: string;
        skuId: string;
        productCode: string;
        productName: string;
        uom: string;
        forecastedVolume: number;
        actualShippedVolume: number;
        variance: string;
        modelAccuracy: string;
        otifCompliance: string;
    }[]>;
    listPromotions(tenantId: string, plantId?: string): Promise<{
        id: string;
        title: string;
        skuId: string;
        productCode: string;
        productName: string;
        upliftPercent: number;
        projectedUnits: number;
        startDate: string;
        endDate: string;
        channel: string;
        status: string;
    }[]>;
    createPromotion(tenantId: string, input: CreatePromotionInput): Promise<{
        id: string;
        title: string;
        skuId: string;
        productCode: string;
        productName: string;
        upliftPercent: number;
        projectedUnits: number;
        startDate: string;
        endDate: string;
        channel: string;
        status: string;
    }>;
    updatePromotion(tenantId: string, id: string, input: UpdatePromotionInput): Promise<{
        id: string;
        title: string;
        skuId: string;
        productCode: string;
        productName: string;
        upliftPercent: number;
        projectedUnits: number;
        startDate: string;
        endDate: string;
        channel: string;
        status: string;
    } | {
        status?: string | undefined;
        title?: string | undefined;
        upliftPercent?: number | undefined;
        projectedUnits?: number | undefined;
        id: string;
    }>;
    listShipments(tenantId: string, plantId?: string): Promise<{
        id: string;
        orderRef: string;
        destination: string;
        carrier: string;
        mode: string;
        pallets: number;
        units: string;
        scheduledDate: string;
        dockDoor: string;
        status: string;
    }[]>;
    createShipment(tenantId: string, input: any): Promise<{
        id: string;
        orderRef: any;
        destination: any;
        carrier: any;
        mode: any;
        pallets: number;
        units: any;
        scheduledDate: any;
        dockDoor: any;
        status: any;
    }>;
    updateShipmentStatus(tenantId: string, id: string, nextStatus: string): Promise<{
        id: string;
        orderRef: string;
        destination: string;
        carrier: string;
        mode: string;
        pallets: number;
        units: string;
        scheduledDate: string;
        dockDoor: string;
        status: string;
    } | {
        id: string;
        status: string;
    }>;
    runStatisticalForecast(tenantId: string, plantId: string, input: RunForecastInput): Promise<{
        historicalDemand: number[];
        calculationDetails: import("../../shared/engines/forecastEngine.js").ForecastOutput;
        id: string;
        createdAt: Date;
        tenantId: string;
        plantId: string;
        skuId: string;
        period: string;
        baselineDemand: string;
        promoUplift: string | null;
        overrideQuantity: string | null;
        finalForecast: string;
        mapeAccuracy: string | null;
        modelType: string | null;
    }>;
    listApsSchedules(tenantId: string, plantId?: string): Promise<any[]>;
    createApsSchedule(tenantId: string, plantId: string, input: CreateApsScheduleInput): Promise<{
        scheduleId: string;
        productionOrderId: string;
        orderNumber: string;
        skuId: string | undefined;
        productCode: string;
        productName: string;
        lineId: string;
        lineName: string;
        targetQuantity: number;
        runRate: number;
        productionDurationHrs: number;
        changeoverDurationHrs: number;
        changeoverReason: string;
        totalDurationHrs: number;
        startTime: string;
        endTime: string;
        status: string;
        capacityStatus: string;
        materialStatus: string;
    }>;
    rescheduleApsSchedule(tenantId: string, scheduleId: string, input: RescheduleApsScheduleInput): Promise<any>;
    splitApsSchedule(tenantId: string, scheduleId: string, input: SplitApsScheduleInput): Promise<{
        success: boolean;
        message: string;
        originalScheduleId?: undefined;
        splitCount?: undefined;
        subBatches?: undefined;
    } | {
        success: boolean;
        originalScheduleId: string;
        splitCount: number;
        subBatches: any[];
        message: string;
    }>;
    optimizeApsSchedule(tenantId: string, plantId?: string, input?: OptimizeApsScheduleInput): Promise<{
        success: boolean;
        optimized: boolean;
        changeoverReductionPercent: number;
        downtimeSavedMinutes: number;
        optimizedCount: number;
        schedules: any[];
        message: string;
    }>;
    getCapacityCalculations(tenantId: string, plantId?: string): Promise<{
        overallUtilization: number;
        totalScheduledHours: number;
        totalAvailableHours: number;
        remainingCapacityHours: number;
        conflictsCount: number;
        lines: {
            lineId: string;
            lineCode: string;
            name: string;
            plantName: string;
            availableHours: number;
            plannedHours: number;
            remainingHours: number;
            utilizationPercent: number;
            hasConflict: boolean;
            runRateSpec: string;
            assignedOrdersCount: number;
            status: string;
        }[];
    }>;
    getWorkCenters(tenantId: string, plantId?: string): Promise<{
        lineId: string;
        lineCode: string;
        name: string;
        plantFacility: string;
        ratedCapacity: string;
        assignedAssetsCount: number;
        assetDescription: string;
        scheduledLoadHours: number;
        utilizationPercent: number;
        availableCapacityHours: number;
        status: string;
    }[]>;
    getChangeovers(tenantId: string, plantId?: string): Promise<any[]>;
    createChangeover(tenantId: string, input: any): Promise<{
        id: string;
        fromSku: any;
        toSku: any;
        line: any;
        durationMins: number;
        protocol: any;
        mechanicalChanges: any;
        impact: any;
    }>;
    runMrpExplosion(tenantId: string, plantId: string): Promise<{
        skuId: string;
        skuCode: string;
        skuName: string;
        category: string;
        grossDemand: number;
        availableStock: number;
        netShortage: number;
        status: string;
        recommendedRequisitionQty: number;
    }[]>;
    runMrpEngineCalculation(tenantId: string, plantId: string, input: RunMrpEngineInput): Promise<{
        runId: string;
        period: string;
        plant: string;
        productScope: string;
        calculatedAt: string;
        explodedItems: {
            product: string;
            productCode: string;
            requiredUnits: number;
            plant: string;
            period: string;
            materials: {
                component: string;
                skuCode: string;
                required: number;
                available: number;
                shortage: number;
                plannedPurchase: number;
                plannedProduction: number;
                uom: string;
                status: string;
            }[];
        }[];
    }>;
    createPurchaseRequisition(tenantId: string, plantId: string, input: CreatePurchaseRequisitionInput): Promise<{
        id: string;
        tenantId: string;
        plantId: string;
        reqNumber: string;
        skuId: string;
        skuCode: string;
        name: string;
        quantity: number;
        uom: string;
        vendorName: string;
        urgency: string;
        notes: string;
        status: string;
        createdAt: string;
    }>;
    listPurchaseRequisitions(tenantId: string): Promise<any[]>;
    expediteMaterialShortage(tenantId: string, plantId: string, input: ExpediteShortageInput): Promise<{
        success: boolean;
        skuId: string;
        trackingId: string;
        data: {
            trackingId: string;
            skuId: string | undefined;
            skuCode: string;
            name: string;
            expediteMode: string;
            leadTimeReductionHours: number;
            status: string;
            vendorName: string;
            dispatchedAt: string;
            expectedArrival: string;
            notes: string;
        };
        message: string;
    }>;
    listExpeditedShortages(tenantId: string, plantId?: string): Promise<Record<string, any>>;
    updateSafetyStockPolicy(tenantId: string, plantId: string, input: UpdateSafetyStockPolicyInput): Promise<{
        success: boolean;
        skuId: string | undefined;
        skuCode: string | undefined;
        safetyStock: number;
        serviceLevelTarget: number;
        updatedAt: string;
    }>;
    listSafetyStockPolicies(tenantId: string, plantId?: string): Promise<Record<string, number>>;
    listServiceRisks(tenantId: string, plantId?: string): Promise<ServiceRiskRecord[]>;
    mitigateServiceRisk(tenantId: string, plantId: string, input: MitigateServiceRiskInput): Promise<{
        success: boolean;
        riskId: string;
        riskTitle: string | undefined;
        status: string;
        activeThreats: number;
        mitigatedThreats: number;
        remainingFinancialExposure: number;
        mitigatedAt: string;
        message: string;
    }>;
    getSupplyDemandBalance(tenantId: string, plantId?: string): Promise<{
        totalFirmDemand: number;
        availableProductionSupply: number;
        balancedSkusCount: number;
        deficitSkusCount: number;
        items: {
            skuId: string;
            skuCode: string;
            name: string;
            uom: string;
            totalDemand: number;
            availableSupply: number;
            netBalance: number;
            isSurplus: boolean;
            coveragePercent: number;
            status: string;
        }[];
    }>;
    private scheduleVersionsStore;
    listScheduleVersions(tenantId: string): Promise<{
        versionId: string;
        title: string;
        status: string;
        createdDate: string;
        createdBy: string;
        ordersCount: number;
        totalPlannedHours: number;
        utilizationPercent: number;
        reason: string;
        changesDescription: string;
    }[]>;
    createScheduleVersion(tenantId: string, input: CreateScheduleVersionInput): Promise<{
        versionId: string;
        title: string;
        status: string;
        createdDate: string;
        createdBy: string;
        ordersCount: number;
        totalPlannedHours: number;
        utilizationPercent: number;
        reason: string;
        changesDescription: string;
    }>;
    validateSchedule(tenantId: string, input?: ValidateScheduleInput): Promise<{
        isValid: boolean;
        isPublishable: boolean;
        status: string;
        passCount: number;
        warningCount: number;
        errorCount: number;
        checks: {
            rule: string;
            type: string;
            message: string;
            status: string;
        }[];
        validatedAt: string;
    }>;
    getPublishSchedule(tenantId: string): Promise<{
        scheduleVersions: {
            versionId: string;
            title: string;
            status: string;
            createdDate: string;
            createdBy: string;
            ordersCount: number;
            totalPlannedHours: number;
            utilizationPercent: number;
            reason: string;
            changesDescription: string;
        }[];
        selectedVersion: string;
        validationData: {
            isValid: boolean;
            isPublishable: boolean;
            status: string;
            passCount: number;
            warningCount: number;
            errorCount: number;
            checks: {
                rule: string;
                type: string;
                message: string;
                status: string;
            }[];
            validatedAt: string;
        };
        isPublishable: boolean;
        activePublishedVersion: string;
        terminalsCount: number;
        linesCount: number;
    }>;
    publishSchedule(tenantId: string, input: PublishScheduleInput): Promise<{
        success: boolean;
        versionId: string;
        status: string;
        publishedBy: string;
        publishedAt: string;
        dispatchedTerminalsCount: number;
        message: string;
    }>;
    handleAiChat(tenantId: string, promptText: string): Promise<{
        reply: string;
        query: string;
        timestamp: string;
        recommendationId: string;
        savings: {
            downtimeSavedMinutes: number;
            cipSanitizingFluidsLiters: number;
            slaComplianceRate: number;
        };
    }>;
    applyAiRecommendation(tenantId: string, recommendationId: string, actionLabel?: string): Promise<{
        success: boolean;
        recommendationId: string;
        actionLabel: string;
        status: string;
        appliedAt: string;
        message: string;
    }>;
    simulateAiImpact(tenantId: string, recommendationId?: string): Promise<{
        recommendationId: string;
        downtimeSavedMinutes: number;
        cipSanitizingFluidsLiters: number;
        slaComplianceRate: number;
        oeeImpactPercent: number;
        capacityLoadDrop: string;
        simulatedAt: string;
    }>;
    listMaterialReservations(tenantId: string): Promise<any[]>;
    createMaterialReservation(tenantId: string, data: any): Promise<{
        reservationId: string;
        productionOrderId: any;
        orderNumber: any;
        skuId: any;
        skuCode: any;
        materialName: any;
        requiredQty: number;
        availableQty: number;
        reservedQty: number;
        uom: any;
        shortage: number;
        status: string;
        staged: boolean;
        createdAt: string;
    }>;
    stageMaterialReservation(tenantId: string, reservationId: string): Promise<any>;
    releaseMaterialReservation(tenantId: string, reservationId: string): Promise<{
        success: boolean;
        reservationId: string;
        message: string;
    }>;
    recalculateMaterialReservations(tenantId: string): Promise<{
        success: boolean;
        reservations: any[];
        message: string;
    }>;
    getAiAssistantOverview(tenantId: string): Promise<{
        status: string;
        model: string;
        activeRecommendationsCount: number;
        simData: {
            downtimeSaved: string;
            cipWash: string;
            sla: string;
        };
        quickPrompts: string[];
        recommendations: {
            id: string;
            title: string;
            impact: string;
            type: string;
        }[];
    }>;
    getPlanningReports(tenantId: string): Promise<{
        reports: {
            id: string;
            title: string;
            description: string;
            category: string;
            recordCount: string;
            type: string;
        }[];
    }>;
    getPlanningDashboardSummary(tenantId: string, plantId?: string, horizon?: string): Promise<{
        horizon: string;
        activePublishedVersion: string;
        metrics: {
            openDemandVolume: number;
            activeRequisitionsCount: number;
            totalForecastVolume: number;
            forecastBaseline: string;
            shortagesCount: number;
            shortageStatus: string;
            avgLineUtil: any;
            conflictsCount: any;
            conflictDescription: string;
            productionOrdersCount: number;
            apsSchedulesCount: number;
            materialAllocationsCount: number;
            unreservedMaterialsCount: number;
            validationGateStatus: string;
            validationScore: string;
        };
        mrpAllocations: {
            item: string;
            status: string;
            hasShortage: boolean;
        }[];
        capacityOverview: {
            line1Load: string;
            publishedVersion: string;
        };
        aiRecommendation: {
            title: string;
            text: string;
            savingsMinutes: number;
        };
    }>;
}
export declare const planningService: PlanningService;
export {};
//# sourceMappingURL=planning.service.d.ts.map