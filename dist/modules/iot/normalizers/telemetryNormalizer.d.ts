export interface NormalizedMachineEvent {
    assetId: string;
    assetCode: string;
    plantId: string;
    timestamp: string;
    status: "RUNNING" | "STOPPED" | "IDLE" | "MAINTENANCE";
    productionCount: number;
    speed: number;
    cycleTime: number;
    downtime: number;
    vibration: number;
    temperature: number;
    pressure: number;
    rpm?: number;
    powerKw?: number;
    flowRate?: number;
    faultCode?: string;
    alarm?: string;
    source: "OPC_UA" | "MQTT" | "MODBUS" | "SIMULATOR";
    rawPayload?: Record<string, any>;
}
export declare class TelemetryNormalizer {
    static normalize(raw: any): NormalizedMachineEvent;
}
//# sourceMappingURL=telemetryNormalizer.d.ts.map