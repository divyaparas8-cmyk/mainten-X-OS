export interface ForecastInput {
    historicalDemand: number[];
    alpha?: number;
    promoUpliftPercent?: number;
}
export interface ForecastOutput {
    baselineForecast: number;
    promoUpliftUnits: number;
    finalForecast: number;
    mapeAccuracy: number;
}
export declare function calculateExponentialSmoothingForecast(input: ForecastInput): ForecastOutput;
//# sourceMappingURL=forecastEngine.d.ts.map