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
//# sourceMappingURL=masterData.schema.d.ts.map