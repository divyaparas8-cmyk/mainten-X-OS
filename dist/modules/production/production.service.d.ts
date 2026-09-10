import { RecordOperatorEntryInput } from "./production.schema.js";
export declare class ProductionService {
    listOrders(tenantId: string, plantId?: string): Promise<any[]>;
    createOrder(tenantId: string, plantId: string, input: any): Promise<{
        order: any;
        batch: {
            id: string;
            batchNumber: string;
        };
    }>;
    updateOrderStatus(tenantId: string, orderId: string, newStatus: string): Promise<{
        id: string;
        tenantId: string;
        plantId: string;
        orderNumber: string;
        skuId: string;
        lineId: string;
        targetQuantity: string;
        producedQuantity: string;
        scrapQuantity: string;
        status: string;
        priority: string | null;
        plannedStart: Date;
        plannedEnd: Date;
        actualStart: Date | null;
        actualEnd: Date | null;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
    } | {
        id: string;
        status: string;
        updatedAt: Date;
    }>;
    listBatches(tenantId: string): Promise<any[]>;
    advanceBatchStep(tenantId: string, batchId: string, input: any, userId?: string): Promise<{
        id: string;
        currentStep: number;
        progressPercent: number;
        status: string;
    }>;
    verifyLot(batchId: string, lotNo: string): Promise<{
        batchId: string;
        lotNo: string;
        verified: boolean;
        coaStatus: string;
        verifiedAt: string;
        message: string;
    }>;
    completeBatch(batchId: string): Promise<{
        id: string;
        status: string;
        progressPercent: number;
    }>;
    qaRelease(batchId: string): Promise<{
        id: string;
        status: string;
        releasedAt: string;
    }>;
    recordOperatorEntry(tenantId: string, plantId: string, input: RecordOperatorEntryInput, userId: string): Promise<{
        id: string;
        tenantId: string;
        plantId: string;
        lineId: string;
        shiftCode: string;
        orderId: string;
        operatorId: string;
        hourWindow: string;
        goodUnitsProduced: number;
        scrapUnitsProduced: number;
        loggedAt: Date;
    }>;
    logDowntime(tenantId: string, plantId: string, input: any, userId?: string): Promise<any>;
    listHbLogs(plantId?: string): Promise<any[]>;
    createHbLog(input: any): Promise<any>;
    getOEEAnalytics(plantId?: string, period?: string): Promise<{
        plantCode: string;
        period: string;
        overallOEE: number;
        availability: number;
        performance: number;
        qualityRate: number;
        sixBigLosses: {
            lossCategory: string;
            durationMins: number;
            impactPercent: number;
            costUSD: number;
        }[];
        hourlyTrend: {
            time: string;
            oee: number;
            availability: number;
            performance: number;
            quality: number;
        }[];
        lineMatrix: {
            line: string;
            oee: number;
            availability: number;
            performance: number;
            quality: number;
            status: string;
        }[];
    }>;
    getProductionPerformance(plantId?: string): Promise<{
        plantCode: string;
        speedCompliance: string;
        ratedSpeed: string;
        avgChangeoverMins: number;
        changeoverData: {
            sku: string;
            targetMins: number;
            actualMins: number;
            delta: string;
            status: string;
        }[];
        microStops: {
            reason: string;
            occurrences: number;
            lostMins: number;
        }[];
    }>;
    listMachines(plantId?: string): Promise<any[]>;
    updateMachineStatus(id: string, newStatus: string): Promise<any>;
    listShiftHandoffs(plantId?: string): Promise<any[]>;
    createShiftHandoff(input: any): Promise<any>;
    getShiftPerformance(plantId?: string): Promise<{
        plantCode: string;
        shiftA: {
            output: string;
            scrap: string;
            oee: string;
            supervisor: string;
        };
        shiftB: {
            output: string;
            scrap: string;
            oee: string;
            supervisor: string;
        };
        shiftC: {
            output: string;
            scrap: string;
            oee: string;
            supervisor: string;
        };
    }>;
    listDowntime(plantId?: string): Promise<any[]>;
}
export declare const productionService: ProductionService;
//# sourceMappingURL=production.service.d.ts.map