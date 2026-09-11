export interface MRPCalculationInput {
    demand: number;
    availableStock: number;
    reservedStock: number;
    scheduledReceipts: number;
    safetyStock: number;
}
export interface MRPCalculationOutput {
    netRequirement: number;
    hasShortage: boolean;
    plannedOrderQuantity: number;
}
export declare function calculateNetRequirements(input: MRPCalculationInput): MRPCalculationOutput;
//# sourceMappingURL=mrpEngine.d.ts.map