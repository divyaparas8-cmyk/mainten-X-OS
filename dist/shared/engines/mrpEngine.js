"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateNetRequirements = calculateNetRequirements;
function calculateNetRequirements(input) {
    const { demand, availableStock, reservedStock, scheduledReceipts, safetyStock } = input;
    // Formula: Demand + SafetyStock - (Available - Reserved + ScheduledReceipts)
    const effectiveAvailable = Math.max(0, availableStock - reservedStock + scheduledReceipts);
    const totalRequired = demand + safetyStock;
    const netShortage = Math.max(0, totalRequired - effectiveAvailable);
    return {
        netRequirement: netShortage,
        hasShortage: netShortage > 0,
        plannedOrderQuantity: netShortage,
    };
}
//# sourceMappingURL=mrpEngine.js.map