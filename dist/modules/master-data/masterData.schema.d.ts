import { z } from "zod";
export declare const createSkuSchema: z.ZodObject<{
    skuCode: z.ZodString;
    name: z.ZodString;
    category: z.ZodEnum<["FINISHED_GOODS", "RAW_MATERIAL", "PACKAGING"]>;
    familyId: z.ZodOptional<z.ZodString>;
    uom: z.ZodDefault<z.ZodString>;
    barcode: z.ZodOptional<z.ZodString>;
    standardCost: z.ZodDefault<z.ZodNumber>;
    shelfLifeDays: z.ZodDefault<z.ZodNumber>;
    minStockLevel: z.ZodDefault<z.ZodNumber>;
    maxStockLevel: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    name: string;
    skuCode: string;
    category: "FINISHED_GOODS" | "RAW_MATERIAL" | "PACKAGING";
    uom: string;
    standardCost: number;
    shelfLifeDays: number;
    minStockLevel: number;
    maxStockLevel: number;
    familyId?: string | undefined;
    barcode?: string | undefined;
}, {
    name: string;
    skuCode: string;
    category: "FINISHED_GOODS" | "RAW_MATERIAL" | "PACKAGING";
    familyId?: string | undefined;
    uom?: string | undefined;
    barcode?: string | undefined;
    standardCost?: number | undefined;
    shelfLifeDays?: number | undefined;
    minStockLevel?: number | undefined;
    maxStockLevel?: number | undefined;
}>;
export type CreateSkuInput = z.infer<typeof createSkuSchema>;
export declare const createBomSchema: z.ZodObject<{
    skuId: z.ZodString;
    version: z.ZodDefault<z.ZodString>;
    name: z.ZodString;
    batchSize: z.ZodDefault<z.ZodNumber>;
    batchUom: z.ZodDefault<z.ZodString>;
    yieldPercent: z.ZodDefault<z.ZodNumber>;
    items: z.ZodArray<z.ZodObject<{
        componentSkuId: z.ZodString;
        quantity: z.ZodNumber;
        uom: z.ZodString;
        scrapPercentage: z.ZodDefault<z.ZodNumber>;
        stage: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        uom: string;
        componentSkuId: string;
        quantity: number;
        scrapPercentage: number;
        stage: string;
    }, {
        uom: string;
        componentSkuId: string;
        quantity: number;
        scrapPercentage?: number | undefined;
        stage?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    version: string;
    name: string;
    skuId: string;
    batchSize: number;
    batchUom: string;
    yieldPercent: number;
    items: {
        uom: string;
        componentSkuId: string;
        quantity: number;
        scrapPercentage: number;
        stage: string;
    }[];
}, {
    name: string;
    skuId: string;
    items: {
        uom: string;
        componentSkuId: string;
        quantity: number;
        scrapPercentage?: number | undefined;
        stage?: string | undefined;
    }[];
    version?: string | undefined;
    batchSize?: number | undefined;
    batchUom?: string | undefined;
    yieldPercent?: number | undefined;
}>;
export type CreateBomInput = z.infer<typeof createBomSchema>;
export declare const routingStepSchema: z.ZodObject<{
    sequence: z.ZodDefault<z.ZodNumber>;
    operationCode: z.ZodString;
    operationName: z.ZodString;
    workCenterId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    stdDurationMin: z.ZodDefault<z.ZodNumber>;
    setupDurationMin: z.ZodDefault<z.ZodNumber>;
    crewSize: z.ZodDefault<z.ZodNumber>;
    isQualityGate: z.ZodDefault<z.ZodBoolean>;
    instructions: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    sequence: number;
    setupDurationMin: number;
    operationCode: string;
    operationName: string;
    stdDurationMin: number;
    crewSize: number;
    isQualityGate: boolean;
    workCenterId?: string | null | undefined;
    instructions?: string | null | undefined;
}, {
    operationCode: string;
    operationName: string;
    sequence?: number | undefined;
    workCenterId?: string | null | undefined;
    setupDurationMin?: number | undefined;
    stdDurationMin?: number | undefined;
    crewSize?: number | undefined;
    isQualityGate?: boolean | undefined;
    instructions?: string | null | undefined;
}>;
export declare const createRoutingSchema: z.ZodObject<{
    routingCode: z.ZodString;
    skuId: z.ZodString;
    lineId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    plantId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    revision: z.ZodDefault<z.ZodString>;
    approvalStatus: z.ZodDefault<z.ZodEnum<["Draft", "In Review", "Approved", "Obsolete"]>>;
    status: z.ZodDefault<z.ZodEnum<["Active", "Inactive"]>>;
    stdRunRateBph: z.ZodDefault<z.ZodNumber>;
    setupDurationMin: z.ZodDefault<z.ZodNumber>;
    expectedYieldPct: z.ZodDefault<z.ZodNumber>;
    effectiveFrom: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    effectiveTo: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    notes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    steps: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
        sequence: z.ZodDefault<z.ZodNumber>;
        operationCode: z.ZodString;
        operationName: z.ZodString;
        workCenterId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        stdDurationMin: z.ZodDefault<z.ZodNumber>;
        setupDurationMin: z.ZodDefault<z.ZodNumber>;
        crewSize: z.ZodDefault<z.ZodNumber>;
        isQualityGate: z.ZodDefault<z.ZodBoolean>;
        instructions: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        sequence: number;
        setupDurationMin: number;
        operationCode: string;
        operationName: string;
        stdDurationMin: number;
        crewSize: number;
        isQualityGate: boolean;
        workCenterId?: string | null | undefined;
        instructions?: string | null | undefined;
    }, {
        operationCode: string;
        operationName: string;
        sequence?: number | undefined;
        workCenterId?: string | null | undefined;
        setupDurationMin?: number | undefined;
        stdDurationMin?: number | undefined;
        crewSize?: number | undefined;
        isQualityGate?: boolean | undefined;
        instructions?: string | null | undefined;
    }>, "many">>>;
}, "strip", z.ZodTypeAny, {
    status: "Active" | "Inactive";
    skuId: string;
    routingCode: string;
    revision: string;
    approvalStatus: "Approved" | "Draft" | "In Review" | "Obsolete";
    stdRunRateBph: number;
    setupDurationMin: number;
    expectedYieldPct: number;
    steps: {
        sequence: number;
        setupDurationMin: number;
        operationCode: string;
        operationName: string;
        stdDurationMin: number;
        crewSize: number;
        isQualityGate: boolean;
        workCenterId?: string | null | undefined;
        instructions?: string | null | undefined;
    }[];
    plantId?: string | null | undefined;
    lineId?: string | null | undefined;
    effectiveFrom?: string | null | undefined;
    effectiveTo?: string | null | undefined;
    notes?: string | null | undefined;
}, {
    skuId: string;
    routingCode: string;
    status?: "Active" | "Inactive" | undefined;
    plantId?: string | null | undefined;
    lineId?: string | null | undefined;
    revision?: string | undefined;
    approvalStatus?: "Approved" | "Draft" | "In Review" | "Obsolete" | undefined;
    stdRunRateBph?: number | undefined;
    setupDurationMin?: number | undefined;
    expectedYieldPct?: number | undefined;
    effectiveFrom?: string | null | undefined;
    effectiveTo?: string | null | undefined;
    notes?: string | null | undefined;
    steps?: {
        operationCode: string;
        operationName: string;
        sequence?: number | undefined;
        workCenterId?: string | null | undefined;
        setupDurationMin?: number | undefined;
        stdDurationMin?: number | undefined;
        crewSize?: number | undefined;
        isQualityGate?: boolean | undefined;
        instructions?: string | null | undefined;
    }[] | undefined;
}>;
export declare const updateRoutingSchema: z.ZodObject<{
    routingCode: z.ZodOptional<z.ZodString>;
    skuId: z.ZodOptional<z.ZodString>;
    lineId: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    plantId: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    revision: z.ZodOptional<z.ZodDefault<z.ZodString>>;
    approvalStatus: z.ZodOptional<z.ZodDefault<z.ZodEnum<["Draft", "In Review", "Approved", "Obsolete"]>>>;
    status: z.ZodOptional<z.ZodDefault<z.ZodEnum<["Active", "Inactive"]>>>;
    stdRunRateBph: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    setupDurationMin: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    expectedYieldPct: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    effectiveFrom: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    effectiveTo: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    notes: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    steps: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
        sequence: z.ZodDefault<z.ZodNumber>;
        operationCode: z.ZodString;
        operationName: z.ZodString;
        workCenterId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        stdDurationMin: z.ZodDefault<z.ZodNumber>;
        setupDurationMin: z.ZodDefault<z.ZodNumber>;
        crewSize: z.ZodDefault<z.ZodNumber>;
        isQualityGate: z.ZodDefault<z.ZodBoolean>;
        instructions: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        sequence: number;
        setupDurationMin: number;
        operationCode: string;
        operationName: string;
        stdDurationMin: number;
        crewSize: number;
        isQualityGate: boolean;
        workCenterId?: string | null | undefined;
        instructions?: string | null | undefined;
    }, {
        operationCode: string;
        operationName: string;
        sequence?: number | undefined;
        workCenterId?: string | null | undefined;
        setupDurationMin?: number | undefined;
        stdDurationMin?: number | undefined;
        crewSize?: number | undefined;
        isQualityGate?: boolean | undefined;
        instructions?: string | null | undefined;
    }>, "many">>>>;
}, "strip", z.ZodTypeAny, {
    status?: "Active" | "Inactive" | undefined;
    plantId?: string | null | undefined;
    skuId?: string | undefined;
    lineId?: string | null | undefined;
    routingCode?: string | undefined;
    revision?: string | undefined;
    approvalStatus?: "Approved" | "Draft" | "In Review" | "Obsolete" | undefined;
    stdRunRateBph?: number | undefined;
    setupDurationMin?: number | undefined;
    expectedYieldPct?: number | undefined;
    effectiveFrom?: string | null | undefined;
    effectiveTo?: string | null | undefined;
    notes?: string | null | undefined;
    steps?: {
        sequence: number;
        setupDurationMin: number;
        operationCode: string;
        operationName: string;
        stdDurationMin: number;
        crewSize: number;
        isQualityGate: boolean;
        workCenterId?: string | null | undefined;
        instructions?: string | null | undefined;
    }[] | undefined;
}, {
    status?: "Active" | "Inactive" | undefined;
    plantId?: string | null | undefined;
    skuId?: string | undefined;
    lineId?: string | null | undefined;
    routingCode?: string | undefined;
    revision?: string | undefined;
    approvalStatus?: "Approved" | "Draft" | "In Review" | "Obsolete" | undefined;
    stdRunRateBph?: number | undefined;
    setupDurationMin?: number | undefined;
    expectedYieldPct?: number | undefined;
    effectiveFrom?: string | null | undefined;
    effectiveTo?: string | null | undefined;
    notes?: string | null | undefined;
    steps?: {
        operationCode: string;
        operationName: string;
        sequence?: number | undefined;
        workCenterId?: string | null | undefined;
        setupDurationMin?: number | undefined;
        stdDurationMin?: number | undefined;
        crewSize?: number | undefined;
        isQualityGate?: boolean | undefined;
        instructions?: string | null | undefined;
    }[] | undefined;
}>;
export type CreateRoutingInput = z.infer<typeof createRoutingSchema>;
export type UpdateRoutingInput = z.infer<typeof updateRoutingSchema>;
export type RoutingStepInput = z.infer<typeof routingStepSchema>;
//# sourceMappingURL=masterData.schema.d.ts.map