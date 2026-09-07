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
export interface OperationEntity {
    id: string;
    operationId?: string;
    operationCode: string;
    code?: string;
    name: string;
    sequence: number;
    department: string;
    stdDurationMin: number;
    setupDurationMin: number;
    status: string;
}
export interface RoutingEntity {
    id: string;
    routingId?: string;
    routingCode: string;
    skuId?: string;
    skuCode: string;
    skuName: string;
    lineId: string;
    lineCode?: string;
    lineName: string;
    revision: string;
    approvalStatus: string;
    status: string;
    stdRunRateBPH: number;
    setupDurationMin: number;
    expectedYieldPct: number;
    effectiveFrom: string;
    effectiveTo: string;
    steps?: any[];
}
export interface ProductFamilyEntity {
    id: string;
    familyId?: string;
    code: string;
    name: string;
    category: string;
    description?: string;
    status: string;
    skusCount?: number;
}
export interface UomEntity {
    id: string;
    uomId?: string;
    code: string;
    name: string;
    category: string;
    baseUnit: string;
    conversionFactor: number;
    status: string;
}
export interface PackConfigEntity {
    id: string;
    configId?: string;
    code: string;
    name: string;
    packagingType: string;
    primaryUnitCount: number;
    secondaryUnitCount: number;
    palletCount: number;
    grossWeightKg: number;
    status: string;
}
export interface LineTargetEntity {
    id: string;
    targetId?: string;
    plantId: string;
    lineId: string;
    lineName: string;
    skuId: string;
    skuCode: string;
    skuName: string;
    shift: string;
    plannedOEE: number;
    plannedUnitsPerHour: number;
    plannedYieldPct: number;
    changeoverTimeMin: number;
    status: string;
}
export interface ChangeoverRuleEntity {
    id: string;
    ruleId?: string;
    fromSkuFamily: string;
    toSkuFamily: string;
    matrixType: string;
    requiredCleaningMin: number;
    allergenCleaningRequired: boolean;
    allergenType?: string;
    mechanicalChangeoverMin: number;
    totalDurationMin: number;
    status: string;
}
export interface SanitationClassEntity {
    id: string;
    classId?: string;
    code: string;
    name: string;
    cleaningLevel: string;
    washDurationMin: number;
    chemicalAgent: string;
    validationMethod: string;
    frequency: string;
    status: string;
}
export interface AllergenRuleEntity {
    id: string;
    ruleId?: string;
    allergenType: string;
    allergenName: string;
    riskLevel: string;
    protocol: string;
    verificationTest: string;
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
    listOperations(tenantId?: string, department?: string): Promise<OperationEntity[]>;
    createOperation(tenantId: string | undefined, input: any): Promise<OperationEntity>;
    updateOperation(tenantId: string | undefined, id: string, input: any): Promise<OperationEntity>;
    deleteOperation(tenantId: string | undefined, id: string): Promise<OperationEntity | {
        id: string;
        message: string;
    }>;
    listRoutings(tenantId?: string): Promise<RoutingEntity[]>;
    createRouting(tenantId: string | undefined, input: any): Promise<RoutingEntity>;
    updateRouting(tenantId: string | undefined, id: string, input: any): Promise<RoutingEntity>;
    deleteRouting(tenantId: string | undefined, id: string): Promise<RoutingEntity | {
        id: string;
        message: string;
    }>;
    listProductFamilies(tenantId?: string): Promise<ProductFamilyEntity[]>;
    createProductFamily(tenantId: string | undefined, input: any): Promise<ProductFamilyEntity>;
    updateProductFamily(tenantId: string | undefined, id: string, input: any): Promise<ProductFamilyEntity>;
    deleteProductFamily(tenantId: string | undefined, id: string): Promise<ProductFamilyEntity | {
        id: string;
        message: string;
    }>;
    listUoms(tenantId?: string): Promise<UomEntity[]>;
    createUom(tenantId: string | undefined, input: any): Promise<UomEntity>;
    updateUom(tenantId: string | undefined, id: string, input: any): Promise<any>;
    deleteUom(tenantId: string | undefined, id: string): Promise<UomEntity | {
        id: string;
        message: string;
    }>;
    listPackConfigs(tenantId?: string): Promise<PackConfigEntity[]>;
    createPackConfig(tenantId: string | undefined, input: any): Promise<PackConfigEntity>;
    updatePackConfig(tenantId: string | undefined, id: string, input: any): Promise<any>;
    deletePackConfig(tenantId: string | undefined, id: string): Promise<PackConfigEntity | {
        id: string;
        message: string;
    }>;
    listLineTargets(tenantId?: string): Promise<LineTargetEntity[]>;
    createLineTarget(tenantId: string | undefined, input: any): Promise<LineTargetEntity>;
    updateLineTarget(tenantId: string | undefined, id: string, input: any): Promise<any>;
    deleteLineTarget(tenantId: string | undefined, id: string): Promise<LineTargetEntity | {
        id: string;
        message: string;
    }>;
    listChangeoverRules(tenantId?: string): Promise<ChangeoverRuleEntity[]>;
    createChangeoverRule(tenantId: string | undefined, input: any): Promise<ChangeoverRuleEntity>;
    updateChangeoverRule(tenantId: string | undefined, id: string, input: any): Promise<any>;
    deleteChangeoverRule(tenantId: string | undefined, id: string): Promise<ChangeoverRuleEntity | {
        id: string;
        message: string;
    }>;
    listSanitationClasses(tenantId?: string): Promise<SanitationClassEntity[]>;
    createSanitationClass(tenantId: string | undefined, input: any): Promise<SanitationClassEntity>;
    listAllergenRules(tenantId?: string): Promise<AllergenRuleEntity[]>;
    createAllergenRule(tenantId: string | undefined, input: any): Promise<AllergenRuleEntity>;
    listSkus(tenantId?: string): Promise<{
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
    createSku(tenantId: string | undefined, input: any): Promise<any>;
    listBoms(tenantId?: string): Promise<{
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
    createBom(tenantId: string | undefined, input: any): Promise<any>;
    updateBom(tenantId: string | undefined, id: string, input: any): Promise<any>;
    deleteBom(tenantId: string | undefined, id: string): Promise<{
        id: string;
        message: string;
    }>;
    listAssets(tenantId: string | undefined, plantId?: string): Promise<{
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
    listStaff(tenantId: string | undefined, plantId?: string): Promise<{
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
    listQualitySpecs(tenantId?: string): Promise<{
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