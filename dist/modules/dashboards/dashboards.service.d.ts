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
                target: number;
                actual: number;
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
        hourlyLedger: {
            hour: string;
            target: number;
            actual: number;
            delta: string;
            status: string;
        }[];
    }>;
}
export declare const dashboardsService: DashboardsService;
//# sourceMappingURL=dashboards.service.d.ts.map