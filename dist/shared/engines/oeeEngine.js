"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateOEE = calculateOEE;
function calculateOEE(input) {
    const { plannedProductionMinutes, downtimeMinutes, idealCycleTimeSeconds, totalUnitsProduced, goodUnitsProduced } = input;
    const operatingMinutes = Math.max(0, plannedProductionMinutes - downtimeMinutes);
    const availability = plannedProductionMinutes > 0 ? (operatingMinutes / plannedProductionMinutes) : 0;
    const operatingSeconds = operatingMinutes * 60;
    const idealOperatingSeconds = totalUnitsProduced * idealCycleTimeSeconds;
    const performance = operatingSeconds > 0 ? Math.min(1.0, idealOperatingSeconds / operatingSeconds) : 0;
    const quality = totalUnitsProduced > 0 ? (goodUnitsProduced / totalUnitsProduced) : 0;
    const overallOEE = availability * performance * quality;
    return {
        availabilityPercent: Number((availability * 100).toFixed(1)),
        performancePercent: Number((performance * 100).toFixed(1)),
        qualityPercent: Number((quality * 100).toFixed(1)),
        overallOEEPercent: Number((overallOEE * 100).toFixed(1)),
    };
}
//# sourceMappingURL=oeeEngine.js.map