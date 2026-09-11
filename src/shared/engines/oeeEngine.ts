export interface OEEInput {
  plannedProductionMinutes: number;
  downtimeMinutes: number;
  idealCycleTimeSeconds: number; // e.g. 0.24 sec/unit = 250 BPM
  totalUnitsProduced: number;
  goodUnitsProduced: number;
}

export interface OEEOutput {
  availabilityPercent: number;
  performancePercent: number;
  qualityPercent: number;
  overallOEEPercent: number;
}

export function calculateOEE(input: OEEInput): OEEOutput {
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
