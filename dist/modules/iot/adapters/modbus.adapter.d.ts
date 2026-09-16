import { IIndustrialProtocolAdapter } from "./protocolAdapter.interface.js";
export declare class ModbusAdapter implements IIndustrialProtocolAdapter {
    name: string;
    protocol: "MODBUS";
    private host;
    private port;
    private connected;
    private dataCallback?;
    constructor(host?: string, port?: number);
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    onData(callback: (rawPayload: any) => void): void;
    handleRegisters(unitId: number, registers: Record<number, number>, assetCode?: string): void;
    getStatus(): {
        connected: boolean;
        endpoint: string;
        nodesCount: number;
        lastPing: string;
    };
}
//# sourceMappingURL=modbus.adapter.d.ts.map