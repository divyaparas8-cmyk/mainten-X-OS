export interface ReliabilityInput {
  totalOperatingHours: number;
  breakdownCount: number;
  totalRepairHours: number;
}

export interface ReliabilityOutput {
  mtbfHours: number; // Mean Time Between Failures
  mttrHours: number; // Mean Time To Repair
  availabilityPercent: number;
}

export function calculateReliability(input: ReliabilityInput): ReliabilityOutput {
  const { totalOperatingHours, breakdownCount, totalRepairHours } = input;

  const mtbf = breakdownCount > 0 ? Number((totalOperatingHours / breakdownCount).toFixed(1)) : totalOperatingHours;
  const mttr = breakdownCount > 0 ? Number((totalRepairHours / breakdownCount).toFixed(2)) : 0;
  const availability = totalOperatingHours + totalRepairHours > 0
    ? Number(((totalOperatingHours / (totalOperatingHours + totalRepairHours)) * 100).toFixed(1))
    : 100;

  return {
    mtbfHours: mtbf,
    mttrHours: mttr,
    availabilityPercent: availability,
  };
}
