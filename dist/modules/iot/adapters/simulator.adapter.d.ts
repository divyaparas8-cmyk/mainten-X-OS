import { IIndustrialProtocolAdapter } from "./protocolAdapter.interface.js";
export declare class SimulatorAdapter implements IIndustrialProtocolAdapter {
    name: string;
    protocol: "SIMULATOR";
    private running;
    private intervalTimer;
    private intervalMs;
    private dataCallback?;
    private assetStates;
    constructor(intervalMs?: number);
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    onData(callback: (rawPayload: any) => void): void;
    private startLoop;
    getStatus(): {
        connected: boolean;
        endpoint: string;
        nodesCount: number;
        lastPing: string;
    };
}
//# sourceMappingURL=simulator.adapter.d.ts.map