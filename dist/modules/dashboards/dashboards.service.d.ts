export declare class DashboardsService {
    getPlantManagerCommandCenter(tenantId: string, plantId?: string): Promise<{
        plantCode: string;
        plantStatus: string;
        hbSummary: {
            processing: {
                target: number;
                actual: number;
                variance: number;
                recoveryPace: string;
                eodProjection: number;
                status: string;
            };
            packaging: {
                target: number;
                actual: number;
                variance: number;
                recoveryPace: string;
                eodProjection: number;
                status: string;
            };
            total: {
                target: any;
                actual: any;
                netVariance: number;
                shiftPacing: string;
                eodProjection: number;
                status: string;
            };
        };
        pillars: {
            hbPacing: {
                value: string;
                unit: string;
                trend: string;
                status: string;
            };
            oeeScore: {
                value: string;
                unit: string;
                trend: string;
                status: string;
            };
            productionOutput: {
                value: string;
                unit: string;
                trend: string;
                status: string;
            };
            qualityYield: {
                value: string;
                unit: string;
                trend: string;
                status: string;
            };
            labourStaffing: {
                value: string;
                unit: string;
                trend: string;
                status: string;
            };
            maintenanceMtbf: {
                value: string;
                unit: string;
                trend: string;
                status: string;
            };
            materialStockHealth: {
                value: string;
                unit: string;
                trend: string;
                status: string;
            };
            scheduleRecovery: {
                value: string;
                unit: string;
                trend: string;
                status: string;
            };
            riskRadar: {
                value: string;
                unit: string;
                trend: string;
                status: string;
            };
        };
        hourlyLedger: any[];
    }>;
    getExecutiveKPIs(plantId?: string): Promise<{
        id: string;
        title: string;
        category: string;
        current: string;
        target: string;
        variance: string;
        status: string;
        isPositive: boolean;
    }[]>;
}
export declare const dashboardsService: DashboardsService;
//# sourceMappingURL=dashboards.service.d.ts.map