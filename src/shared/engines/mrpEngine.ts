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

export function calculateNetRequirements(input: MRPCalculationInput): MRPCalculationOutput {
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
