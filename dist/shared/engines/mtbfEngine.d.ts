export interface ReliabilityInput {
    totalOperatingHours: number;
    breakdownCount: number;
    totalRepairHours: number;
}
export interface ReliabilityOutput {
    mtbfHours: number;
    mttrHours: number;
    availabilityPercent: number;
}
export declare function calculateReliability(input: ReliabilityInput): ReliabilityOutput;
//# sourceMappingURL=mtbfEngine.d.ts.map