import { CreateCustomerOrderInput, RunForecastInput, CreateApsScheduleInput } from "./planning.schema.js";
export declare class PlanningService {
    listCustomerOrders(tenantId: string, plantId?: string): Promise<{
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        plantId: string;
        skuId: string;
        quantity: string;
        orderNumber: string;
        customerName: string;
        priority: string | null;
        requestedDate: Date;
        scheduledDate: Date | null;
        deliveryAddress: string | null;
    }[]>;
    createCustomerOrder(tenantId: string, plantId: string, input: CreateCustomerOrderInput): Promise<{
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        plantId: string;
        skuId: string;
        quantity: string;
        orderNumber: string;
        customerName: string;
        priority: string | null;
        requestedDate: Date;
        scheduledDate: Date | null;
        deliveryAddress: string | null;
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
    listApsSchedules(tenantId: string, plantId?: string): Promise<{
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        plantId: string;
        skuId: string;
        quantity: string;
        startTime: Date;
        endTime: Date;
        lineId: string;
        shiftId: string | null;
        orderId: string | null;
        changeoverMinutes: number | null;
        cipRequired: boolean | null;
        sequenceNumber: number | null;
    }[]>;
    createApsSchedule(tenantId: string, plantId: string, input: CreateApsScheduleInput): Promise<{
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        plantId: string;
        skuId: string;
        quantity: string;
        startTime: Date;
        endTime: Date;
        lineId: string;
        shiftId: string | null;
        orderId: string | null;
        changeoverMinutes: number | null;
        cipRequired: boolean | null;
        sequenceNumber: number | null;
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
    listSchedules(plantId?: string): Promise<any[]>;
    createSchedule(input: {
        sku: string;
        line: string;
        quantity: number;
        startTime: string;
        endTime: string;
        plantId?: string;
    }): Promise<any>;
    toggleScheduleLock(id: string, locked?: boolean): Promise<any>;
    deleteSchedule(id: string): Promise<{
        id: string;
        deleted: boolean;
    }>;
    listCapacity(plantId?: string): Promise<any[]>;
    listConstraints(plantId?: string): Promise<any[]>;
    createConstraint(input: {
        type: string;
        description: string;
        line: string;
        impact: string;
        risk: string;
        plantId?: string;
    }): Promise<any>;
    resolveConstraint(id: string): Promise<any>;
    deleteConstraint(id: string): Promise<{
        id: string;
        deleted: boolean;
    }>;
    applyRecovery(input: {
        speedBoostPercent: number;
        overtimeHours: number;
        plantId?: string;
    }): Promise<{
        id: string;
        speedBoostPercent: number;
        overtimeHours: number;
        projectedRecoveryUnits: number;
        feasibilityPercent: number;
        estimatedCostUsd: number;
        status: string;
    }>;
}
export declare const planningService: PlanningService;
//# sourceMappingURL=planning.service.d.ts.map