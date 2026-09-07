import { CreateSkuInput } from "./masterData.schema.js";
export interface CompanyEntity {
    id: string;
    companyId?: string;
    code: string;
    name: string;
    taxId: string;
    currency: string;
    hqLocation: string;
    fiscalYearStart?: string;
    status: string;
}
export interface PlantEntity {
    id: string;
    plantId?: string;
    companyId?: string;
    code: string;
    name: string;
    location?: string;
    city?: string;
    state?: string;
    country?: string;
    capacity?: string;
    dailyCapacity?: string;
    operatingShifts?: number;
    timezone?: string;
    linesCount?: number;
    status: string;
    effectiveFrom?: string;
    effectiveTo?: string;
}
export interface DepartmentEntity {
    id: string;
    departmentId?: string;
    plantId: string;
    code: string;
    name: string;
    deptHead?: string;
    managerName?: string;
    costCenter?: string;
    operatingShifts?: string;
    status: string;
}
export interface LineEntity {
    id?: string;
    lineId: string;
    lineCode: string;
    code?: string;
    name: string;
    plantId: string;
    plantName?: string;
    type?: string;
    lineType?: string;
    ratedSpeed?: string;
    ratedSpeedBPH?: number;
    status: string;
    healthScore?: number;
}
export interface WorkCenterEntity {
    id: string;
    workCenterId?: string;
    code: string;
    name: string;
    lineId: string;
    lineName: string;
    plantId?: string;
    capacity?: string;
    category?: string;
    status: string;
}
export declare class MasterDataService {
    listCompanies(tenantId?: string): Promise<CompanyEntity[]>;
    createCompany(tenantId: string | undefined, input: any): Promise<CompanyEntity>;
    updateCompany(tenantId: string | undefined, id: string, input: any): Promise<CompanyEntity>;
    deleteCompany(tenantId: string | undefined, id: string): Promise<CompanyEntity | {
        id: string;
        message: string;
    }>;
    listPlants(tenantId?: string): Promise<PlantEntity[]>;
    createPlant(tenantId: string | undefined, input: any): Promise<PlantEntity>;
    updatePlant(tenantId: string | undefined, id: string, input: any): Promise<PlantEntity>;
    deletePlant(tenantId: string | undefined, id: string): Promise<PlantEntity | {
        id: string;
        message: string;
    }>;
    listDepartments(tenantId?: string, plantId?: string): Promise<DepartmentEntity[]>;
    createDepartment(tenantId: string | undefined, input: any): Promise<DepartmentEntity>;
    updateDepartment(tenantId: string | undefined, id: string, input: any): Promise<DepartmentEntity>;
    deleteDepartment(tenantId: string | undefined, id: string): Promise<DepartmentEntity | {
        id: string;
        message: string;
    }>;
    listLines(tenantId: string | undefined, plantId?: string): Promise<LineEntity[]>;
    createLine(tenantId: string | undefined, input: any): Promise<LineEntity>;
    updateLine(tenantId: string | undefined, id: string, input: any): Promise<LineEntity>;
    deleteLine(tenantId: string | undefined, id: string): Promise<LineEntity | {
        id: string;
        message: string;
    }>;
    listWorkCenters(tenantId: string | undefined, plantId?: string): Promise<WorkCenterEntity[]>;
    createWorkCenter(tenantId: string | undefined, input: any): Promise<WorkCenterEntity>;
    updateWorkCenter(tenantId: string | undefined, id: string, input: any): Promise<WorkCenterEntity>;
    deleteWorkCenter(tenantId: string | undefined, id: string): Promise<WorkCenterEntity | {
        id: string;
        message: string;
    }>;
    listSkus(tenantId: string): Promise<{
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
    }[]>;
    createSku(tenantId: string, input: CreateSkuInput): Promise<{
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
    }>;
    listBoms(tenantId: string): Promise<{
        status: string;
        version: string;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        skuId: string;
        batchSize: string;
        batchUom: string;
        yieldPercent: string | null;
        isDefault: boolean;
        items: never;
        sku: never;
    }[]>;
    getBomById(tenantId: string, id: string): Promise<{
        status: string;
        version: string;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        skuId: string;
        batchSize: string;
        batchUom: string;
        yieldPercent: string | null;
        isDefault: boolean;
        items: never;
        sku: never;
    }>;
    listAssets(tenantId: string, plantId?: string): Promise<{
        status: string | null;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        plantId: string;
        lineId: string | null;
        assetCode: string;
        modelNumber: string | null;
        manufacturer: string | null;
        criticalLevel: string | null;
        healthPercent: number | null;
        mtbfHours: string | null;
        mttrHours: string | null;
        installDate: Date | null;
        lastServiceDate: Date | null;
    }[]>;
    listStaff(tenantId: string, plantId?: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        tenantId: string;
        phone: string | null;
        plantId: string;
        employeeCode: string;
        designation: string;
        shiftCode: string | null;
        isAvailable: boolean;
        certifications: unknown;
    }[]>;
    listQualitySpecs(tenantId: string): Promise<{
        id: string;
        createdAt: Date;
        tenantId: string;
        uom: string;
        skuId: string;
        parameterName: string;
        targetValue: string;
        minTolerance: string;
        maxTolerance: string;
        isCCP: boolean;
    }[]>;
}
export declare const masterDataService: MasterDataService;
//# sourceMappingURL=masterData.service.d.ts.map