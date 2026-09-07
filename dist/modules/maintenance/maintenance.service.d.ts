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
        priority: string;
        scheduledDate: Date | null;
        completedAt: Date | null;
        assetId: string;
        reportedBy: string | null;
        assignedTo: string | null;
        woNumber: string;
        failureCodeId: string | null;
        estimatedHours: string | null;
        actualHours: string | null;
        asset: never;
        assignedUser: never;
    }[]>;
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
        priority: string;
        scheduledDate: Date | null;
        completedAt: Date | null;
        assetId: string;
        reportedBy: string | null;
        assignedTo: string | null;
        woNumber: string;
        failureCodeId: string | null;
        estimatedHours: string | null;
        actualHours: string | null;
    }>;
    updateWorkOrderStatus(tenantId: string, id: string, input: UpdateWorkOrderStatusInput): Promise<{
        id: string;
        tenantId: string;
        plantId: string;
        woNumber: string;
        assetId: string;
        title: string;
        description: string | null;
        type: string;
        priority: string;
        status: string;
        assignedTo: string | null;
        reportedBy: string | null;
        failureCodeId: string | null;
        estimatedHours: string | null;
        actualHours: string | null;
        scheduledDate: Date | null;
        completedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    listPMSchedules(tenantId: string): Promise<{
        status: string;
        title: string;
        id: string;
        tenantId: string;
        isActive: boolean;
        plantId: string;
        assetId: string;
        scheduleCode: string;
        frequency: string;
        intervalDays: number;
        lastPerformedDate: Date | null;
        nextDueDate: Date;
        checklistTemplate: unknown;
    }[]>;
    listSpareParts(tenantId: string): Promise<{
        id: string;
        name: string;
        tenantId: string;
        plantId: string;
        category: string;
        minStockLevel: number;
        supplierName: string | null;
        partNumber: string;
        currentStock: number;
        unitCost: string | null;
        binLocation: string | null;
    }[]>;
    getReliabilityMetrics(tenantId: string, plantId?: string): Promise<{
        plantOverall: {
            mtbfHours: number;
            mttrHours: number;
            availabilityPercent: number;
        };
        criticalAssetsHealth: {
            code: string;
            name: string;
            health: number;
            mtbf: number;
            status: string;
        }[];
    }>;
}
export declare const maintenanceService: MaintenanceService;
//# sourceMappingURL=maintenance.service.d.ts.map