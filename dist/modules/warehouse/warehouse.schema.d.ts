import { z } from "zod";
export declare const createLotSchema: z.ZodObject<{
    skuId: z.ZodString;
    lotNumber: z.ZodString;
    lotType: z.ZodEnum<["RAW_MATERIAL", "PACKAGING", "FINISHED_GOOD"]>;
    supplierName: z.ZodOptional<z.ZodString>;
    supplierLotNumber: z.ZodOptional<z.ZodString>;
    initialQuantity: z.ZodNumber;
    uom: z.ZodDefault<z.ZodString>;
    locationBinId: z.ZodOptional<z.ZodString>;
    expiryDate: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    uom: string;
    skuId: string;
    lotNumber: string;
    lotType: "RAW_MATERIAL" | "PACKAGING" | "FINISHED_GOOD";
    initialQuantity: number;
    supplierName?: string | undefined;
    supplierLotNumber?: string | undefined;
    locationBinId?: string | undefined;
    expiryDate?: string | undefined;
}, {
    skuId: string;
    lotNumber: string;
    lotType: "RAW_MATERIAL" | "PACKAGING" | "FINISHED_GOOD";
    initialQuantity: number;
    uom?: string | undefined;
    supplierName?: string | undefined;
    supplierLotNumber?: string | undefined;
    locationBinId?: string | undefined;
    expiryDate?: string | undefined;
}>;
export type CreateLotInput = z.infer<typeof createLotSchema>;
export declare const createTransactionSchema: z.ZodObject<{
    lotId: z.ZodString;
    type: z.ZodEnum<["RECEIPT", "TRANSFER", "RESERVATION", "ISSUE", "CONSUMPTION", "ADJUSTMENT", "SHIPMENT"]>;
    quantity: z.ZodNumber;
    uom: z.ZodDefault<z.ZodString>;
    fromBinId: z.ZodOptional<z.ZodString>;
    toBinId: z.ZodOptional<z.ZodString>;
    referenceType: z.ZodOptional<z.ZodString>;
    referenceId: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: "RECEIPT" | "TRANSFER" | "RESERVATION" | "ISSUE" | "CONSUMPTION" | "ADJUSTMENT" | "SHIPMENT";
    uom: string;
    quantity: number;
    lotId: string;
    notes?: string | undefined;
    fromBinId?: string | undefined;
    toBinId?: string | undefined;
    referenceType?: string | undefined;
    referenceId?: string | undefined;
}, {
    type: "RECEIPT" | "TRANSFER" | "RESERVATION" | "ISSUE" | "CONSUMPTION" | "ADJUSTMENT" | "SHIPMENT";
    quantity: number;
    lotId: string;
    uom?: string | undefined;
    notes?: string | undefined;
    fromBinId?: string | undefined;
    toBinId?: string | undefined;
    referenceType?: string | undefined;
    referenceId?: string | undefined;
}>;
export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
//# sourceMappingURL=warehouse.schema.d.ts.map