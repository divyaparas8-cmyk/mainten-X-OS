export interface OEEInput {
    plannedProductionMinutes: number;
    downtimeMinutes: number;
    idealCycleTimeSeconds: number;
    totalUnitsProduced: number;
    goodUnitsProduced: number;
}
export interface OEEOutput {
    availabilityPercent: number;
    performancePercent: number;
    qualityPercent: number;
    overallOEEPercent: number;
}
export declare function calculateOEE(input: OEEInput): OEEOutput;
//# sourceMappingURL=oeeEngine.d.ts.map