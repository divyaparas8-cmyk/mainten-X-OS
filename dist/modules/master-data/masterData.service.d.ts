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
    notes?: string;
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
    matrixId?: string;
    fromSkuId?: string;
    fromSkuCode?: string;
    fromFamily?: string;
    toSkuId?: string;
    toSkuCode?: string;
    toFamily?: string;
    changeoverDurationMin?: number;
    sanitationClass?: string;
    allergenCleaningRequired?: boolean;
    notes?: string;
    status?: string;
}
export interface SanitationClassEntity {
    id: string;
    classId?: string;
    sanitationId?: string;
    code?: string;
    name?: string;
    sanitationClass: string;
    description?: string;
    durationMin: number;
    washDurationMin?: number;
    cleaningMethod: string;
    cleaningLevel?: string;
    riskLevel: string;
    applicableProducts?: string;
    chemicalAgent?: string;
    validationMethod?: string;
    frequency?: string;
    status: string;
}
export interface AllergenRuleEntity {
    id: string;
    ruleId?: string;
    allergenId?: string;
    allergenType?: string;
    allergenName: string;
    skuId?: string;
    skuCode: string;
    riskLevel: string;
    protocol?: string;
    cleaningProtocol: string;
    changeoverRestriction: string;
    verificationTest?: string;
    status: string;
}
export interface LabourStandardEntity {
    id: string;
    lineId: string;
    lineName: string;
    standardCrew: number;
    stdLaborHoursPer1kUnits: number;
    directCostPerHour: string;
    status: string;
    createdAt?: string;
    updatedAt?: string;
}
export declare class MasterDataService {
    listCompanies(tenantId?: string): Promise<any>;
    createCompany(tenantId: string | undefined, input: any): Promise<{
        id: string;
        companyId: string;
        code: any;
        name: string;
        taxId: any;
        currency: any;
        hqLocation: any;
        fiscalYearStart: any;
        status: any;
    }>;
    updateCompany(tenantId: string | undefined, id: string, input: any): Promise<any>;
    deleteCompany(tenantId: string | undefined, id: string): Promise<{
        id: string;
        message: string;
    }>;
    listPlants(tenantId?: string): Promise<PlantEntity[] | {
        id: string;
        plantId: string;
        code: string;
        name: string;
        city: string;
        state: string;
        country: string;
        timezone: string;
        location: string;
        status: string;
        isActive: boolean;
        capacity: string;
        dailyCapacity: string;
        linesCount: number;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    createPlant(tenantId: string | undefined, input: any): Promise<PlantEntity>;
    updatePlant(tenantId: string | undefined, id: string, input: any): Promise<any>;
    deletePlant(tenantId: string | undefined, id: string): Promise<PlantEntity | {
        id: string;
        message: string;
    }>;
    listDepartments(tenantId?: string, plantId?: string): Promise<any>;
    createDepartment(tenantId: string | undefined, input: any): Promise<{
        id: string;
        departmentId: string;
        plantId: any;
        code: string;
        name: string;
        deptHead: any;
        managerName: any;
        costCenter: any;
        operatingShifts: any;
        status: any;
    }>;
    updateDepartment(tenantId: string | undefined, id: string, input: any): Promise<any>;
    deleteDepartment(tenantId: string | undefined, id: string): Promise<{
        id: string;
        message: string;
    }>;
    listLines(tenantId: string | undefined, plantId?: string): Promise<any>;
    createLine(tenantId: string | undefined, input: any): Promise<{
        id: string;
        lineId: string;
        code: any;
        lineCode: any;
        name: string;
        lineType: any;
        type: any;
        ratedSpeed: any;
        ratedSpeedBPH: number;
        status: any;
        plantId: any;
        plantName: any;
        supervisorName: any;
        supervisorId: any;
        ratedOEE: any;
        currentRunningSku: any;
        healthScore: number;
    }>;
    updateLine(tenantId: string | undefined, id: string, input: any): Promise<any>;
    deleteLine(tenantId: string | undefined, id: string): Promise<{
        id: string;
        message: string;
    }>;
    listWorkCenters(tenantId: string | undefined, plantId?: string): Promise<any>;
    createWorkCenter(tenantId: string | undefined, input: any): Promise<{
        id: string;
        workCenterId: string;
        code: string;
        name: string;
        category: any;
        capacity: any;
        lineId: any;
        lineName: any;
        plantId: any;
        status: any;
    }>;
    updateWorkCenter(tenantId: string | undefined, id: string, input: any): Promise<any>;
    deleteWorkCenter(tenantId: string | undefined, id: string): Promise<{
        id: string;
        message: string;
    }>;
    listOperations(tenantId?: string, department?: string): Promise<OperationEntity[] | {
        id: any;
        operationId: any;
        operationCode: any;
        code: any;
        name: any;
        sequence: number;
        department: any;
        stdDurationMin: number;
        setupDurationMin: number;
        status: any;
        createdAt: any;
        updatedAt: any;
    }[]>;
    createOperation(tenantId: string | undefined, input: any): Promise<OperationEntity>;
    updateOperation(tenantId: string | undefined, id: string, input: any): Promise<OperationEntity>;
    deleteOperation(tenantId: string | undefined, id: string): Promise<OperationEntity | {
        id: string;
        message: string;
    }>;
    listRoutings(tenantId?: string): Promise<RoutingEntity[]>;
    getRoutingById(tenantId: string | undefined, id: string): Promise<RoutingEntity | null>;
    createRouting(tenantId: string | undefined, input: any): Promise<RoutingEntity>;
    updateRouting(tenantId: string | undefined, id: string, input: any): Promise<RoutingEntity | null>;
    updateRoutingStatus(tenantId: string | undefined, id: string, input: {
        status?: string;
        approvalStatus?: string;
    }): Promise<RoutingEntity | null>;
    deleteRouting(tenantId: string | undefined, id: string): Promise<RoutingEntity | {
        id: string;
        message: string;
    }>;
    listProductFamilies(tenantId?: string): Promise<any>;
    createProductFamily(tenantId: string | undefined, input: any): Promise<ProductFamilyEntity>;
    updateProductFamily(tenantId: string | undefined, id: string, input: any): Promise<ProductFamilyEntity>;
    deleteProductFamily(tenantId: string | undefined, id: string): Promise<ProductFamilyEntity | {
        id: string;
        message: string;
    }>;
    listUoms(tenantId?: string): Promise<any>;
    createUom(tenantId: string | undefined, input: any): Promise<{
        uomCode: any;
        baseUom: any;
        type: any;
        factor: number;
        id: string;
        uomId?: string;
        code: string;
        name: string;
        category: string;
        baseUnit: string;
        conversionFactor: number;
        status: string;
    }>;
    updateUom(tenantId: string | undefined, id: string, input: any): Promise<any>;
    deleteUom(tenantId: string | undefined, id: string): Promise<UomEntity | {
        id: string;
        message: string;
    }>;
    listPackConfigs(tenantId?: string): Promise<any>;
    createPackConfig(tenantId: string | undefined, input: any): Promise<any>;
    updatePackConfig(tenantId: string | undefined, id: string, input: any): Promise<any>;
    deletePackConfig(tenantId: string | undefined, id: string): Promise<any>;
    listLineTargets(tenantId?: string): Promise<LineTargetEntity[] | {
        id: any;
        targetId: any;
        plantId: any;
        lineId: any;
        lineName: any;
        skuId: any;
        skuCode: any;
        skuName: any;
        shift: any;
        targetQuantity: number;
        targetHB: any;
        stdRunRate: number;
        plannedOEE: number;
        oeeTargetPct: number;
        plannedUnitsPerHour: number;
        plannedYieldPct: number;
        changeoverTimeMin: number;
        status: any;
        effectiveDate: any;
        createdAt: any;
        updatedAt: any;
    }[]>;
    createLineTarget(tenantId: string | undefined, input: any): Promise<any>;
    updateLineTarget(tenantId: string | undefined, id: string, input: any): Promise<any>;
    deleteLineTarget(tenantId: string | undefined, id: string): Promise<LineTargetEntity | {
        id: string;
        message: string;
    }>;
    listChangeoverRules(tenantId?: string): Promise<ChangeoverRuleEntity[] | {
        id: any;
        matrixId: any;
        fromSkuId: any;
        fromSkuCode: any;
        fromFamily: any;
        toSkuId: any;
        toSkuCode: any;
        toFamily: any;
        changeoverDurationMin: number;
        sanitationClass: any;
        allergenCleaningRequired: boolean;
        notes: any;
        status: any;
        createdAt: any;
        updatedAt: any;
    }[]>;
    createChangeoverRule(tenantId: string | undefined, input: any): Promise<ChangeoverRuleEntity>;
    updateChangeoverRule(tenantId: string | undefined, id: string, input: any): Promise<any>;
    deleteChangeoverRule(tenantId: string | undefined, id: string): Promise<ChangeoverRuleEntity | {
        id: string;
        message: string;
    }>;
    listSanitationClasses(tenantId?: string): Promise<SanitationClassEntity[] | {
        id: any;
        classId: any;
        sanitationId: any;
        code: any;
        name: any;
        sanitationClass: any;
        description: any;
        durationMin: number;
        washDurationMin: number;
        cleaningMethod: any;
        cleaningLevel: any;
        riskLevel: any;
        applicableProducts: any;
        chemicalAgent: any;
        validationMethod: any;
        frequency: any;
        status: any;
        createdAt: any;
        updatedAt: any;
    }[]>;
    createSanitationClass(tenantId: string | undefined, input: any): Promise<any>;
    updateSanitationClass(tenantId: string | undefined, id: string, input: any): Promise<any>;
    deleteSanitationClass(tenantId: string | undefined, id: string): Promise<SanitationClassEntity | {
        id: string;
        message: string;
    }>;
    listAllergenRules(tenantId?: string): Promise<AllergenRuleEntity[] | {
        id: any;
        ruleId: any;
        allergenId: any;
        allergenType: any;
        allergenName: any;
        skuId: any;
        skuCode: any;
        riskLevel: any;
        cleaningProtocol: any;
        protocol: any;
        changeoverRestriction: any;
        verificationTest: any;
        status: any;
        createdAt: any;
        updatedAt: any;
    }[]>;
    createAllergenRule(tenantId: string | undefined, input: any): Promise<any>;
    updateAllergenRule(tenantId: string | undefined, id: string, input: any): Promise<any>;
    deleteAllergenRule(tenantId: string | undefined, id: string): Promise<AllergenRuleEntity | {
        id: string;
        message: string;
    }>;
    listSkus(tenantId?: string): Promise<any[]>;
    createSku(tenantId: string | undefined, input: any): Promise<{
        id: string;
        skuId: string;
        skuCode: any;
        code: any;
        name: any;
        category: any;
        itemType: any;
        familyId: any;
        family: any;
        uom: any;
        plantId: any;
        stdCost: number;
        revision: any;
        status: any;
        approvalStatus: any;
        shelfLifeDays: number;
        packConfigCode: any;
        packSize: any;
        eligibleLineIds: any;
        stdRunRateBPH: number;
        expectedYieldPct: number;
    }>;
    updateSku(tenantId: string | undefined, id: string, input: any): Promise<any>;
    deleteSku(tenantId: string | undefined, id: string): Promise<any>;
    listBoms(tenantId?: string): Promise<any>;
    getBomById(tenantId: string, id: string): Promise<any>;
    createBom(tenantId: string | undefined, input: any): Promise<{
        id: string;
        bomId: string;
        bomNumber: string;
        finishedSkuId: string | null;
        finishedSkuName: string;
        finishedSkuCode: any;
        revision: any;
        batchSize: string;
        yieldTarget: string;
        status: any;
        approvalStatus: any;
        components: any;
        createdBy: any;
        lastUpdated: string;
        revisionHistory: {
            revision: any;
            status: any;
            createdBy: any;
            date: string;
            changes: string;
            approvedBy: string;
        }[];
    }>;
    updateBom(tenantId: string | undefined, id: string, input: any): Promise<any>;
    deleteBom(tenantId: string | undefined, id: string): Promise<{
        id: string;
        message: string;
    }>;
    listAssets(tenantId: string | undefined, plantId?: string): Promise<{
        id: any;
        assetCode: any;
        dbId: any;
        name: any;
        type: any;
        department: string;
        plant: string;
        line: any;
        location: string;
        status: any;
        health: number;
        criticality: any;
        mtbf: number;
        mttr: number;
        vibration: number;
        temperature: number;
        manufacturer: any;
        model: any;
        serialNumber: string;
        commissionDate: string;
        installedDate: string;
        createdAt: any;
        updatedAt: any;
    }[]>;
    createAsset(tenantId: string | undefined, input: any): Promise<{
        id: string;
        assetCode: string;
        dbId: string;
        name: string;
        type: string | null;
        department: any;
        plant: any;
        line: any;
        location: any;
        status: any;
        health: number | null;
        criticality: any;
        mtbf: number;
        mttr: number;
        vibration: number;
        temperature: number;
        manufacturer: string | null;
        model: string | null;
        serialNumber: string;
        installedDate: string;
        createdAt: Date;
    }>;
    updateAsset(tenantId: string | undefined, id: string, input: any): Promise<{
        id: string;
        assetCode: string;
        dbId: string;
        name: string;
        type: string | null;
        department: any;
        line: any;
        location: any;
        status: any;
        health: number | null;
        criticality: any;
        mtbf: number;
        mttr: number;
        vibration: number;
        temperature: number;
        manufacturer: string | null;
        model: string | null;
        serialNumber: string;
        updatedAt: Date;
    }>;
    deleteAsset(tenantId: string | undefined, id: string): Promise<{
        success: boolean;
        id: string;
        dbId: string;
        message: string;
    }>;
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
    listLabourStandards(tenantId?: string): Promise<LabourStandardEntity[]>;
    createLabourStandard(tenantId: string | undefined, input: any): Promise<LabourStandardEntity>;
    updateLabourStandard(tenantId: string | undefined, id: string, input: any): Promise<any>;
    deleteLabourStandard(tenantId: string | undefined, id: string): Promise<LabourStandardEntity | {
        id: string;
        message: string;
    }>;
}
export declare const masterDataService: MasterDataService;
//# sourceMappingURL=masterData.service.d.ts.map